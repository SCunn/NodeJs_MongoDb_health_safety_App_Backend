import React, { Component } from 'react';
class EmployeeForm extends Component {
    render() {
        return(
            <div className="col-9 employee-form-container">
                    <form> 
                        <div className="input-container">
                        <label htmlFor="fullName">First Name</label>
                        <input required name="firstname" type="text" id="FullName" 
                            value={this.props.firstname} onChange={this.props.onDataChange} />
                        </div>
                        <div className="input-container">
                        <label htmlFor="fullName">Last Name</label>
                        <input required name="lastname" type="text" id="FullName" 
                            value={this.props.lastname} onChange={this.props.onDataChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="employyeEmail">Email</label>
                            <input required name="email" type="email" id="employeeEmail" 
                            value={this.props.email} onChange={this.props.onDataChange}  />
                        </div>
                        <div className="input-container">
                            <label htmlFor="employeePhone">Phone Number</label>
                            <input required name="mobile_phone" type="tel" id="employeePhone" 
                            value={this.props.phone} onChange={this.props.onDataChange}  />
                        </div>

                            <div className="input-container">
                            <label htmlFor="employeeStatus">Status</label>
                            <select name="status" onChange={this.props.onDataChange}>
                                <option value="Active">Active</option>
                                <option value="Archived">Archived</option>
                                <option value="pending">Pending</option>
                                <option value="connected">Connected</option>

                            </select>
                        </div>
                        <div className="input-container">
                        <label htmlFor="employeeStatus">Role</label>
                            <select name="role" onChange={this.props.onDataChange}>
                            <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                                <option value="employer">Employer</option>
                                <option value="institute">Institute</option>
                            </select>
                        </div>
                    </form>
            </div>

        );
    }
    
}
export default EmployeeForm;