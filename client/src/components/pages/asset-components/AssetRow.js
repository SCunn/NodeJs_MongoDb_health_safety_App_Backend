import React, { Component } from 'react';
import {  Link } from "react-router-dom";

class AssetRow extends Component {
    render() {
        return(
            <tr>
            <td>{this.props.id} <input type="checkbox" value = "this id" /></td>
            <td>{this.props.name} </td>
             <td>{this.props.status}</td>
             <td>{this.props.type}</td>
            <td>
                <Link to={`/show_asset/${this.props.id}`}>View</Link> 
                | Share | 
                <a onClick = {() => {this.props.onDelete(this.props.id)}} href = '# '>Delete </a> 
            </td>
          </tr>


                  
        );
    }
    
}
export default AssetRow;
