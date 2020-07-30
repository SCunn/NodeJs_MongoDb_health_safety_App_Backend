import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

class Elearning extends Component {
    render() {
        return(
        <div className = "container">
            <div className="row header-row">
                <div className="col-6">
                    <h3>ELearning</h3>
                </div>
                <div className="col-6">
                    <p className = "float-right settings"> <FontAwesomeIcon icon={faCog} /> No courses available</p>
                </div>
            </div>
        </div>
        );
    }
    
}
export default Elearning;