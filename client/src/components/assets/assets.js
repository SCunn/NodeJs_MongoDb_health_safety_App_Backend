import React, { Component } from 'react';
// import axios from 'axios';

import './assets.css';


class Assets extends Component {
    constructor() {
        super();
        this.state = {
            assets: []
        }
    }

    componentDidMount() {
        fetch('asset/assets')
            .then(res => res.json())
            .then(assets => this.setState({assets}, () => console.log('Assets Fetched...', assets)));
    }

    render() {
        return(
            <div>
                <h2>Assets</h2>
                <ul>
                    {this.state.assets.map(asset =>
                        <li> key={asset.asset_type}>
                        {asset.asset_name}>
                        {asset.status}>
                        {asset.QR_Tag}>
                        {asset.shared}>
                        {asset.certificate_id}>
                        {asset.item_condition}
                        </li>    
                    )}
                </ul>
            </div>
        );
    }
}


export default Assets;
