import React, { Component } from 'react';
import axios from 'axios';
import {  Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddImage from '../employee-components/AddImage';
import AssetForm from './AssetForm';
import jwt_decode from 'jwt-decode';

class AddAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Active",
            asset_name: '',
            asset_type: '',
            image: null,
            sampleFile: null,
            loading: false,
            feedback: null,
            newAsset: '',
            certs: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');

    }
    handleChange (evt){
        this.setState({ [evt.target.name]: evt.target.value });
        
    }
    handleImageChange(evt){
        console.log(evt.target.files[0]);
        this.setState({
            image: evt.target.files[0],
            sampleFile: URL.createObjectURL(evt.target.files[0]),
        })
    }

    handleSubmit = (e) => {

        e.preventDefault();
        //get employer ID from tokem
        var decoded = jwt_decode(localStorage.getItem('jwtToken'));
        let employerId = decoded._id;
        
        //get details from state
        const {status, asset_type, asset_name} = this.state;

        axios.put('/asset/add/'+employerId, { status, asset_type, asset_name })
          .then((result) => {
              console.log(result)
            this.setState({
                feedback: "success",
                newAsset: result.data.assets[result.data.assets.length -1]._id
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
                Asset was added successfully!
            </div>
        }
        else if(this.state.feedback === "error"){
            message = <div className="alert alert-danger" data-role="alert">
                There was an error, please check the form and try again.
            </div>
        }
        return(
            <div>

            <div className="container">
                <div className="row header-row">
                    <div className="col-6">
                        <h3>Add New Equipment</h3>
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
                    <AddImage onImageChange={this.handleImageChange} image={this.state.sampleFile} />
                    <AssetForm 
                        asset_name={this.state.asset_name} 
                        type={this.state.asset_type} 
                        status={this.state.status} 
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
                                Add Equipment
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
                                <button className='launch-modal' onClick={this.showCertWindow}><FontAwesomeIcon icon={faPlus} /> Add Certification</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 
}
export default AddAsset;