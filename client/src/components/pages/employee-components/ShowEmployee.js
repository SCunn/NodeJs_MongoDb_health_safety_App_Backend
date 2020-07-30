import React, { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {  Link } from "react-router-dom";
import ListCerts from "./ListCerts";

class ShowEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
          employee: [],
          certs:[],
          employeeId: '',
          employerId: ''
        };
      }

    componentDidMount() {
        //get employee ID
        let employeeId = this.props.match.params.id;
        //get employer ID from tokem
        let decoded = jwt_decode(localStorage.getItem('jwtToken'));
        const employerId = decoded._id;
        
        //add to state
        this.setState({
          employerId: employerId, 
        });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/asset/viewAsset/'+employerId+'/'+employeeId)
          .then(res => {
            console.log(res.data.data);
            this.setState(
                {employee: res.data.data.asset,
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
                <h3>Equipment Details</h3>
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
                <div className="col-lg-3 col-md-6 employee-progile-image">
                    <img alt="profile of employee" src={window.location.origin + '/asset_images/'+ this.state.employee.photo_id} /><br />
                    <Link className = "button-link" to={`/edit/${this.state.employee._id}`}>Edit</Link> 
                </div>
                <div className="col-lg-9">
                    <div className="employee-details-container">
                        <div className = "employee-detail">
                            <p><strong>Full Name</strong></p>
                            <p>{this.state.employee.firstname}&nbsp;{this.state.employee.lastname}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Email</strong></p>
                            <p>{this.state.employee.email}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Phone</strong></p>
                            <p>{this.state.employee.mobile_phone}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Registered as</strong></p>
                            <p>{this.state.employee.asset_type}</p>
                        </div>
                        <div className = "employee-detail">
                            <p><strong>Status</strong></p>
                            <p>{this.state.employee.status}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                    <div className="row header-row">
                        <div className="col-12">
                            <h3>Certificates</h3>
                        </div>
                        
                    </div>
                    <ListCerts certs={this.state.certs} />
            </div>
            
        </div>        );
    }
    
}
export default ShowEmployee;