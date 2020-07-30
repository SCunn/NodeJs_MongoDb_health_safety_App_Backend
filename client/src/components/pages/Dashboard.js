import React, { Component } from 'react';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import ExpiringCerts from './dashboard-components/ExpiringCerts';
import PendingCerts from './dashboard-components/PendingCerts';
import AssetsCheckList from './dashboard-components/AssetsCheckList';

class Dashboard extends Component {
    render() {
        return(
            <div className = "container">
            <div className="row header-row">
                <div className="col-6">
                    <h3>Overview</h3>
                </div>
                <div className="col-6">
                    <p className = "float-right settings"> <FontAwesomeIcon icon={faCog} /> Customise Dashbaord</p>
                </div>
            </div>
            <div className="row">
                <ExpiringCerts />
                <PendingCerts />
                <AssetsCheckList />
            </div>
            </div>
        );
    }
    
}
export default Dashboard;
