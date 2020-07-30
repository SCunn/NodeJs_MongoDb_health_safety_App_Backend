import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {  Link } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AssetRow from './asset-components/AssetRow';


class Equipment extends Component {
    constructor(props) {
        super(props);
        this.state = {
          assets: [],
          showModal: false,
          feedback: '',
          employerId: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
    }
        /**
     * Delete an Asset
     * @return void
     */
    handleDelete (id) {
        if(window.confirm('Delete the item?')){
          //set temp array
          let tempAssets = [...this.state.assets];
          //filter bases on passed id
          let assets = tempAssets.filter(x => {
            return x._id !== id;
          })
          //set state to refresh view
          this.setState({assets: assets})
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
        axios.get('/asset/view_my_equipment/'+employerId, 
          {params: {
            id: employerId,
            role: 'employer'
          }
        })
          .then(res => {
            console.log(res);
            this.setState({ assets: res.data });
          })
          .catch((error) => {
            console.log(error);
            if(error.response.status === 401 || error.response.status === 404 ) {
             this.props.history.push("/login");
            }
          });
      }
    render() {
        return(
        <div className = "container">
            <div className="row header-row">
                <div className="col-6">
                    <h3>Equipment</h3>
                </div>
                <div className="col-6">
                    <div className = "float-right settings">
                    <div className = "employee-button" >
                        <Link to="/equipment/add" >
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
                        <th>Status</th>
                        <th>Type</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.assets.map(asset =>
                          <AssetRow 
                          key={asset._id}
                          name= {asset.asset_name}
                          status = {asset.status}
                          type={asset.asset_type}
                          id={asset._id}
                          onDelete = {this.handleDelete}
                           />
                        )}
                    </tbody>
                  </table>
              </div>
        </div>        );
    }
    
}
export default Equipment;