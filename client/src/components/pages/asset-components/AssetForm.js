import React, { Component } from 'react';
class AssetForm extends Component {
    render() {
        return(
            <div className="col-9 employee-form-container">
                <form> 
                    <div className="input-container">
                        <label htmlFor="equipmentName">Equipment Name</label>
                        <input required name="asset_name" type="text" id="equipmentName" 
                            value={this.props.asset_name} onChange={this.props.onDataChange} />
                    </div>
                    <div className="input-container">
                        <label htmlFor="assetStatus">Status</label>
                        <select name="status" onChange={this.props.onDataChange} defaultValue={this.props.status} value={this.props.status}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="input-container">
                    <label htmlFor="assetType">Type</label>
                        <select name="asset_type" onChange={this.props.onDataChange} defaultValue={this.props.type} value={this.props.type}>
                        <option value="Water">Water</option>
                            <option value="Roads">Roads</option>
                            <option value="Environment">Environment</option>
                            <option value="Construction">Construction</option>
                            <option value="Quarying">Quarying</option>
                            <option value="Administration">Administration</option>
                            <option value="Agricultural Services & Products">Agricultural Services & Products</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Fishing">Fishing</option>
                            <option value="Oil & Gas">Oil & Gas</option>
                            <option value="Pharmaceutical">Pharmaceutical</option>
                            <option value="Retail and Hospitality">Retail and Hospitality</option>
                            <option value="Haulage & Transportation">Haulage & Transportation</option>
                            <option value="Security">Security</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Childcare">Childcare</option>
                            <option value="Forestry">Forestry</option>
                        </select>
                    </div>
                </form>
            </div>

        );
    }
    
}
export default AssetForm;