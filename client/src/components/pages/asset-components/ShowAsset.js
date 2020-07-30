import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {  Link } from "react-router-dom";
import ListCerts from '../employee-components/ListCerts';

class ShowAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
          asset: [],
          certs:[],
          assetId: '',
          employerId: ''
        };
      }

    componentDidMount() {
        console.log('show asset');
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

    render() {
        return(
        <div className = "container">
            <div className="row header-row">
                <div className="col-6">
                <h3>Asset Details</h3>
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
                <div className="col-lg-3 col-md-6 employee-progile-image">
                    <img alt="profile of equipment" src={window.location.origin + '/asset_images/'+ this.state.asset.asset_image} /><br />
                    <Link className = "button-link" to={`/edit_asset/${this.props.match.params.id}`}>Edit</Link> 
                </div>
                <div className="col-lg-9">
                    <div className="employee-details-container">
                        <div className = "employee-detail">
                            <p><strong>Name</strong></p>
                            <p>{this.state.asset.asset_name}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Type</strong></p>
                            <p>{this.state.asset.asset_type}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Status</strong></p>
                            <p>{this.state.asset.status}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row header-row">
                    <div className="col-12">
                        <h3>Certificates</h3>
                    </div>
                    
            </div>
            <ListCerts certs={this.state.certs} />

        </div>        
        );
    }
    
}
export default ShowAsset;