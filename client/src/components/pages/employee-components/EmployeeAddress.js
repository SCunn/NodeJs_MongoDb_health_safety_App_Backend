import React, { Component } from 'react';

class EmployeeAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
          show: false
        };
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps){
          this.setState({show: nextProps.show });
    }

    handleClose(){
        this.setState({
            show: false
        })
    }
    render() {
        let modalStyle = {};
        if(this.state.show === true){
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
                    <h5 className="modal-title" id="exampleModalLabel">Add Address</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick = {this.handleClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    ...
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick = {this.handleClose}>Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>
        );
    }
    
}
export default EmployeeAddress;