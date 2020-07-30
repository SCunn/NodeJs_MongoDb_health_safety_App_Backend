import React, { Component } from 'react';
import {  Link } from "react-router-dom";

class ListCerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false
        };
        this.handleClose = this.handleClose.bind(this);
    }


    handleClose(){
        this.setState({
            visible: false
        })
    }
    render() {
        let table;
        if(this.props.certs.length >= 1){
            table = (
                <table className="table employee-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                    {this.props.certs.map(cert =>
                        <tr key={cert._id}>
                            <td>{cert.file_cert}</td>
                            <td>{cert.status}</td>
                            <td>
                                <a onClick = {() => {this.props.onCertDelete(cert._id)}} href = '# '>Delete </a> | 
                                <a href={'http://localhost:5000/images/'+ cert.file_cert} target = "_blank" rel="noopener noreferrer" download> View </a> 
                            </td>
                        </tr>
                    )}
                </tbody>
              </table>
            )
        }
        else{
            table = '';
        }

        return(
            <div className = "row"> 
                {table}
            </div>
        );
    }
    
}
export default ListCerts;