import React, { Component } from 'react';
import axios from 'axios';
import {  Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddImage from './AddImage';
import EmployeeForm from './EmployeeForm';
import EmployeeAddress from './EmployeeAddress';
import NextOfKin from './NextOfKin';
import AddCert from './AddCert';
import jwt_decode from 'jwt-decode';
import certs from '../../../data/certs.js';
import ListCerts from './ListCerts';


class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            firstname: "",
            lastname: "",
            email:"",
            mobile_phone:"",
            password: "password" /*todo*/,
            role: "employee",
            employer:"",
            status: "Active",
            image: null,
            sampleFile: null,
            loading: false,
            feedback: null,
            showAddress: false,
            showCert: false,
            showKin: false,
            newEmployee: null,
            certs: [],
            certStatus: '',
            tempCert: '',
            cert_file: '',
            cert_name: '',
            certTypes: [],
            cert_type: '',
            cert_titles: [],
            issue_date: '',
            expiry_date: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showModalWindow = this.showModalWindow.bind(this);
        this.showKinWindow = this.showKinWindow.bind(this);
        this.showCertWindow = this.showCertWindow.bind(this);
        this.handleCertChange = this.handleCertChange.bind(this);
        this.handleAddCert = this.handleAddCert.bind(this);
        this.handleDeleteCert = this.handleDeleteCert.bind(this);

    }
    /**
     * when component mounts get necessary details
     */
    componentDidMount() {
        //get JWT token
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        //set array from cert file
        const tempArr = [];
        Object.keys(certs).forEach(key => {
            tempArr.push(certs[key]);
        })
        //set to state
        this.setState({
            certTypes: certs
        });
    }
    /**
     * 
     * Modal windows
     */
    showModalWindow(e) {
        e.stopPropagation();
         this.setState({
            showKin: false, 
            showCert: false,
            showAddress: true});
    }
    showKinWindow(e) {
        e.stopPropagation();
        this.setState({
            showAddress: false,
            showCert: false,
            showKin: true});
    }
    showCertWindow(e) {
        e.stopPropagation();
        this.setState({
            showKin: false,
            showAddress: false,
            showCert: true});
    }

    /**
     * Handle Change from input fields
     * @param  evt 
     */

    handleChange (evt){
        this.setState({ [evt.target.name]: evt.target.value });
        
    }
    /**
     * Handle Image change for profile image
     * @param evt 
     */
    handleImageChange(evt){
        console.log(evt.target.files[0]);
        this.setState({
            showKin: false,
            image: evt.target.files[0],
            sampleFile: URL.createObjectURL(evt.target.files[0]),
        })
        
    }
        /**
     * Handle Image change for profile image
     * @param evt 
     */
    handleFileChange(evt){
        console.log(evt.target.files[0]);
        this.setState({
            showKin: false,
            cert_file: evt.target.files[0],
            tempCert: URL.createObjectURL(evt.target.files[0])
        })
        
    }
    /**
     * Handle Cert upload
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
        console.log(this.state);
        e.preventDefault();

        const assetId = this.state.newEmployee;
        var decoded = jwt_decode(localStorage.getItem('jwtToken'));
        let employerId = decoded._id;
        //get details from state
        const certFile = this.state.cert_file;
        console.log(certFile);

        const {cert_type, cert_name, issue_date, expiry_date} = this.state;
        //set formData for files
        const data = new FormData();
        data.set('issue_date', issue_date);
        data.set('expiry_date', expiry_date);
        data.set(cert_type, cert_name);
        data.append('sampleFile', certFile);
        this.setState({
            showCert: false,
        });

        axios.put('/certificates/add/'+employerId +'/' + assetId,
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

    handleSubmit = (e) => {
        this.setState({
            showCert: false,
            showKin: false, 
            showAddress: false});
        e.preventDefault();
        //get employer ID from tokem
        var decoded = jwt_decode(localStorage.getItem('jwtToken'));
        let employerId = decoded._id;
        
        //get details from state
        const {firstname, lastname, mobile_phone, email, status} = this.state;

        axios.put('/asset/add_employee_asset/'+employerId, { firstname, lastname, mobile_phone, email, status })
          .then((result) => {
            this.setState({
                feedback: "success",
                newEmployee: result.data.assets[result.data.assets.length -1]._id
            });
            
            //if an image exists, add it
            if(this.state.image !== null){
                const assetId = this.state.newEmployee;
                const sampleFile = this.state.image;
                console.log(sampleFile);
                //set formData for files
                const data = new FormData();
                //apprend the image
                data.append('sampleFile', sampleFile);
                axios.put('/asset/add_profile_img/'+employerId +'/' + assetId, 
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
                Employee was added successfully!
            </div>
        }
        else if(this.state.feedback === "error"){
            message = <div className="alert alert-danger" data-role="alert">
                There was an error, please check the form and try again.
            </div>
        }
        return(
            <div>
            <EmployeeAddress show={this.state.showAddress}/>
            <NextOfKin show={this.state.showKin}/>
            <AddCert show={this.state.showCert} 
                onDataChange={this.handleChange} 
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

            <div className="container">
                <div className="row header-row">
                    <div className="col-6">
                        <h3>Add New Employee</h3>
                    </div>
                    <div className="col-6">
                        <div className = "float-right settings">
                            <Link to="/employees/" >
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Employees List
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <AddImage onImageChange={this.handleImageChange} image={this.state.sampleFile} />

                    <EmployeeForm 
                        onDataChange={this.handleChange}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        email={this.state.email}
                        phone={this.state.mobile_phone}
                        role={this.state.role}
                    />
                </div>
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3">
                        <button className='launch-modal' onClick={this.showModalWindow}><FontAwesomeIcon icon={faPlus} /> Add Address</button>
                    </div>
                    <div className="col-lg-3">
                        <button className='launch-modal' onClick={this.showKinWindow}><FontAwesomeIcon icon={faPlus} /> Add Next of Kin</button>
                    </div>
                    <div className="col-lg-3">
                        <button  
                            disabled={this.state.email === '' || this.state.firstname === '' || this.state.lastname === ''} 
                            className="default-button float-right" 
                            onClick={this.handleSubmit}>
                                Add Employee
                        </button>
                    </div>
                </div>
                <div className ="row">
                    <div className="response-message">
                        {message}
                    </div>
                </div>
            </div>
                <div className="container">
                    <div className="row header-row">
                        <div className="col-6">
                            <h3>Certificates</h3>
                        </div>
                        <div className="col-6">
                            <div className = "float-right settings">
                                <button className='launch-modal' 
                                onClick={this.showCertWindow}><FontAwesomeIcon 
                                icon={faPlus}
                                disabled={this.state.newEmployee === null || !this.state.newEmployee}
                                 /> Add Certification
                                 </button>
                            </div>
                        </div>
                    </div>
                    <ListCerts certs={this.state.certs} onCertDelete={this.handleDeleteCert}/>

                </div>
            </div>
        );
    } 
}
export default AddEmployee;