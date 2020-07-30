import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import {  Link } from "react-router-dom";
import AddImage from '../employee-components/AddImage';
import AssetForm from './AssetForm';
import ListCerts from '../employee-components/ListCerts';
import AddCert from '../employee-components/AddCert';
import certs from '../../../data/certs.js';

class EditAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
          asset: [],
          certs:[],
          image: null,
          sampleFile: null,
          assetId: '',
          employerId: '',
          certStatus: '',
          tempCert: '',
          cert_file: '',
          cert_name: '',
          certTypes: [],
          cert_type: '',
          cert_titles: [],
          issue_date: '',
          expiry_date: '',
          showCert: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showCertWindow = this.showCertWindow.bind(this);
        this.handleCertChange = this.handleCertChange.bind(this);
        this.handleAddCert = this.handleAddCert.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDeleteCert = this.handleDeleteCert.bind(this);
      }
    /**
     * load details on mount
     * @return void
     */
    componentDidMount() {
        const tempArr = [];
        Object.keys(certs).forEach(key => {
            tempArr.push(certs[key]);
        })
        //set to state
        this.setState({
            certTypes: certs
        });
        //get employee ID
        let assetId = this.props.match.params.id;
        //get employer ID from tokem
        let decoded = jwt_decode(localStorage.getItem('jwtToken'));
        const employerId = decoded._id;
        
        //add to state
        this.setState({
          employerId: employerId, 
        });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/asset/viewAsset/'+employerId+'/'+assetId)
          .then(res => {
            console.log(res);
            this.setState(
                {asset: res.data.data.asset,
                certs: res.data.data.certificates })
          })
          .catch((error) => {
            console.log(error);
            if(error.response.status === 401) {
             this.props.history.push("/login");
             console.log(error.response);
            }
          });


    }
    /**
     * Handle date chanfe from add cert
     * @param {*} evt 
     */
    handleDateChange (evt){
        this.setState({ [evt.target.name]: evt.target.value });

    } 
    /**
     * Open cert window
     * @param {click} e 
     */
    showCertWindow(e) {
        e.stopPropagation();
        this.setState({showCert: true});
    } 
        /**
     * Handle File change for certs
     * @param evt 
     */
    handleFileChange(evt){
        this.setState({
            showKin: false,
            cert_file: evt.target.files[0],
            tempCert: URL.createObjectURL(evt.target.files[0])
        })
        
    }
    /**
     * Handle Cert input change
     * @param evt 
     */
    handleCertChange (evt){
        const selected = this.state.certTypes.find(cert => cert.slug === evt.target.value);
        
        this.setState({ 
            cert_type: evt.target.value,
            cert_titles: selected.titles
         });  
    }
    /**
     * Save cert with employee ID
     * @param  e 
     */
    handleAddCert(e){
        e.preventDefault();

        let employeeId = this.props.match.params.id;
        var decoded = jwt_decode(localStorage.getItem('jwtToken'));
        let employerId = decoded._id;
        //get details from state
        const certFile = this.state.cert_file;
        console.log(certFile);
        //set data
        const {cert_type, cert_name, issue_date, expiry_date} = this.state;
        //set formData for files
        const data = new FormData();
        data.set('issue_date', issue_date);
        data.set('expiry_date', expiry_date);
        data.set(cert_type, cert_name);
        data.append('sampleFile', certFile);
        //close add cert window
        this.setState({
            showCert: false,
        });
        
        //add cert
        axios.put('/certificates/add/'+employerId +'/' + employeeId,
        data)
          .then((result) => {
            this.setState({
                feedback: "success",
            });
            
          })
          .catch((response) => {
            console.log("error", response);
            this.setState({
                feedback: "error"
            })
        });

    }
    /**
     * Delete cert based on ID
     * @param {cert id} id 
     */
    handleDeleteCert (id) {
        let decoded = jwt_decode(localStorage.getItem('jwtToken'));
        let employerId = decoded._id;
        if(window.confirm('Delete this cert?')){
          //set temp array
          let tempCerts = [...this.state.certs];
          //filter bases on passed id
          let newCerts = tempCerts.filter(x => {
            return x._id !== id;
          })
          //set state to refresh view
          this.setState({certs: newCerts})
          //delete from server
          axios.put('/certificates/delete/'+employerId +'/'+id)
          .then((result) => {
            this.setState({
                feedback: "success"
            })
          })
          .catch((response) => {
            console.log("error", response);
            this.setState({
                feedback: "error"
            })
        });
        }
    }
    
    /**
     * Handle Chage from Form
     * @param {event} evt 
     */
    handleChange (evt){
      const newDetails = this.state.asset;
      newDetails[evt.target.name] = evt.target.value;
      this.setState({ asset: newDetails });
      
  }

  /**
   * Handle Image Change from Image Component
   * @param {image} evt 
   */
  handleImageChange(evt){
      this.setState({
          showKin: false,
          image: evt.target.files[0],
          sampleFile: URL.createObjectURL(evt.target.files[0]),
      })
      
  }

    /**
     * Submit changes
     * @return Promise
     */
    handleSubmit = (e) => {

      e.preventDefault();
      //get employer ID from tokem
      var decoded = jwt_decode(localStorage.getItem('jwtToken'));
      let employerId = decoded._id;
      
      //get details from state
      const {status, asset_type, asset_name} = this.state.asset;
      axios.put('/asset/update/'+ employerId + '/' + this.props.match.params.id, { status, asset_type, asset_name })
        .then((result) => {
            console.log(result.data)
          this.setState({
              feedback: "success",
              newAsset: this.props.match.params.id
          });
          
          //if an image exists, add it
          if(this.state.image !== null){
              const assetId = this.state.newAsset;
              const sampleFile = this.state.image;
              console.log(sampleFile);
              //set formData for files
              const data = new FormData();
              //apprend the image
              data.append('sampleFile', sampleFile);
              console.log(data);
              axios.put('/asset/addImage/'+employerId +'/' + assetId, 
              data)
                  .then((result) => {
                  console.log(result);
                  })
                  .catch((response) => {
                  console.log("error", response);
              });
          }
        })
        .catch((response) => {
          console.log("error", response);
          this.setState({
              feedback: "error"
          })
      });
    }
    render() {
      let message;
      if(this.state.feedback === "success"){
          message = <div className="alert alert-success" data-role="alert">
              Asset was updated successfully!
          </div>
      }
      else if(this.state.feedback === "error"){
          message = <div className="alert alert-danger" data-role="alert">
              There was an error, please check the form and try again.
          </div>
      }
        return(
            <div className = "container">
            <AddCert show={this.state.showCert} 
                onDataChange={this.handleDateChange} 
                onCertChange={this.handleCertChange} 
                onFileChange={this.handleFileChange}
                onAddCert={this.handleAddCert}
                cert_file={this.state.tempCert}
                cert_name={this.state.cert_name}
                expiry_date={this.state.expiry_date}
                issue_date={this.state.issue_date}
                certTypes={this.state.certTypes}
                cert_titles={this.state.cert_titles}
                certStatus={this.state.certStatus}
            />
            <div className="row header-row">
                <div className="col-6">
                <h3>Equipment Details</h3>
                </div>
                <div className="col-6">
                    <div className = "float-right settings">
                        <Link to="/equipment/" >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Equipment List
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row">
                <AddImage onImageChange={this.handleImageChange} image={this.state.sampleFile} storedImage={this.state.asset.asset_image}/>
                <AssetForm 
                    asset_name={this.state.asset.asset_name} 
                    type={this.state.asset.asset_type} 
                    status={this.state.asset.status} 
                    onDataChange={this.handleChange} 
                />
            </div>
            <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3">
                    </div>
                    <div className="col-lg-3">
                    </div>
                    <div className="col-lg-3">
                        <button  
                            disabled={this.state.email === '' || this.state.firstname === '' || this.state.lastname === ''} 
                            className="default-button float-right" 
                            onClick={this.handleSubmit}>
                                Update Equipment
                        </button>
                    </div>
                </div>
                <div className ="row">
                    <div className="response-message">
                        {message}
                    </div>
                </div>
                <div className="row header-row">
                        <div className="col-6">
                            <h3>Certificates</h3>
                        </div>
                        <div className="col-6">
                            <div className = "float-right settings">
                                <button className='launch-modal' onClick={this.showCertWindow}><FontAwesomeIcon icon={faPlus} /> Add Certification</button>
                            </div>
                        </div>
                    </div>
                    <ListCerts certs={this.state.certs} onCertDelete={this.handleDeleteCert}/>
        </div>        
        );
    }
    
}
export default EditAsset;