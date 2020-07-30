import React, { Component } from 'react';
import {  Link } from "react-router-dom";


class EmployeeRow extends Component {
    render() {
        return(
            <tr>
            <td>{this.props.id} <input type="checkbox" value = "this id" /></td>
            <td>{this.props.firstname}&nbsp;{this.props.lastname} </td>
            <td>Company</td>
             <td>{this.props.status}</td>
             <td>{this.props.mobile_phone}</td>
            <td>{this.props.email}</td>
            <td>
                <Link to={`/show/${this.props.id}`}>View</Link> 
                | Share | 
                <a onClick = {() => {this.props.onDelete(this.props.id)}} href = '# '>Delete </a> 
            </td>
{/*               
            
            <td>{this.props.photo_id}</td>
            <td>{this.props.certificates}</td> */}
          </tr>


                  
        );
    }
    
}
export default EmployeeRow;
