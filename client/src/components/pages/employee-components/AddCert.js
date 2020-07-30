import React, { Component } from 'react';
class AddCert extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
        };
        this.handleClose = this.handleClose.bind(this);
    }
    componentWillReceiveProps(nextProps){
          this.setState({visible: nextProps.show });
    }

    handleClose(){
        this.setState({
            visible: false
        })
    }

    render() {
        let modalStyle = {};
        if(this.state.visible === true){
             modalStyle = {
                opacity:1, 
                display: 'block'
            }
        }
        else{
            modalStyle = {
                opacity:0, 
                display: 'none'
            }
        }

        return(
            <div className="modal fade show" id="exampleModal" 
                tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
                style={modalStyle}
            >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add Certification</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick = {this.handleClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="modal-form">
                        <form> 
                            <div className="input-container">
                            <label htmlFor="File">Upload File</label>
                            <input required name="file" type="file" id="File" 
                                onChange = {this.props.onFileChange} value={this.props.cert_file.name}  />
                            </div>
                            <div className="input-container">
                                <label htmlFor="certStatus">Certification Type</label>
                                <select name="cert_type" onChange={this.props.onCertChange}>
                                    { this.props.certTypes.map((cert, i) =>
                
                                        <option key={i} value = {cert.slug} >{cert.section}</option>
                                     ) }
                                </select>
                            </div>
                            <div className="input-container">
                            <label htmlFor="FileName">Cert Name</label>
                                <select name="cert_name" onChange={this.props.onDataChange} value={this.props.cert_name}>
                                    { this.props.cert_titles.map((cert, i) =>
                                        <option key={i} value = {cert}>{cert}</option>
                                    ) }
                                </select>
                            </div>
                            <div className="input-container">
                                <label htmlFor="certStatus">Status</label>
                                <select name="certStatus" onChange={this.props.onDataChange}>
                                    <option value="Active">Active</option>
                                    <option value="Archived">Archived</option>
                                    <option value="pending">Pending</option>
                                    <option value="connected">Connected</option>
                                </select>
                            </div>
                            <div className="input-container date-container">
                            <label htmlFor="IssueDate">Issue Date:</label>
                            <input required name="issue_date" type="datetime-local" id="IssueDate" 
                                onChange = {this.props.onDataChange} value={this.props.issue_date}  />
                            </div>
                            <div className="input-container date-container">
                            <label htmlFor="ExpiryDate">Expiry Date:</label>
                            <input required name="expiry_date" type="datetime-local" id="ExpiryDate" 
                                onChange = {this.props.onDataChange} value={this.props.expiry_date} />
                            </div>
                        </form>
                </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick = {this.handleClose}>Close</button>
                    <button type="button" className="btn btn-primary" onClick = {this.props.onAddCert}>Add Cert</button>
                </div>
                </div>
            </div>
            </div>
        );
    }
    
}
export default AddCert;