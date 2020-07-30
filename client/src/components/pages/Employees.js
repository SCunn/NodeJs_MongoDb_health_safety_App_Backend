import React, { Component } from 'react';
import axios from 'axios';
import {  Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './employees.css';
import EmployeeRow from './employee-components/EmployeeRow';
import jwt_decode from 'jwt-decode';

class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
          employee: [],
          showModal: false,
          feedback: '',
          employerId: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
      }
    
      componentDidMount() {
        //get employer ID from tokem
        let employerId = '';
        if(localStorage.getItem('jwtToken')){
          var decoded = jwt_decode(localStorage.getItem('jwtToken'));
          employerId = decoded._id;
        }
        else{
          employerId = '';
        }

        
        //add to state
        this.setState({
          employerId: employerId, 
        });
        
        //make the request
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/asset/view_my_employees/'+employerId, 
          {params: {
            id: employerId,
            role: 'employer'
          }
        })
          .then(res => {
            this.setState({ employee: res.data.employee });
          })
          .catch((error) => {
            console.log(error);
            if(error.response.status === 401 || error.response.status === 404 ) {
             this.props.history.push("/login");
            }
          });
      }

    /**
     * Delete an Asset
     * @return void
     */
    handleDelete (id) {
      if(window.confirm('Delete the item?')){
        //set temp array
        let tempEmployees = [...this.state.employee];
        //filter bases on passed id
        let employees = tempEmployees.filter(x => {
          return x._id !== id;
        })
        //set state to refresh view
        this.setState({employee: employees})
        //delete from server
        axios.put('/asset/delete/'+this.state.employerId +'/'+id)
        .then((result) => {
          console.log(result);
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

    render() {
        return(
          <div>
            <div className="container">
          <div className="row header-row">
            <div className="col-6">
                <h3>Employees</h3>
            </div>
            <div className="col-6">
                <div className = "float-right settings">
                  <div className = "employee-button" >
                    <Link to="/employees/add" >
                    <FontAwesomeIcon icon={faPlus} />
                    </Link>
                  </div>
                </div>
            </div>
          </div>
          <div className="row">
                <table className="table employee-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Shared</th>
                        <th>Email</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.employee.map(employees =>
                          <EmployeeRow 
                          key={employees._id}
                          firstname= {employees.firstname}
                          lastname = {employees.lastname}
                          phone= {employees.mobile_phone}
                          photo= {employees.photo_id}
                          email = {employees.email}
                          status = {employees.status}
                          certs={employees.certificates}
                          id={employees._id}
                          onDelete = {this.handleDelete}
                           />
                        )}
                    </tbody>
                  </table>
              </div>
            </div>
        </div>
        );
    }
    
}
export default Employees;