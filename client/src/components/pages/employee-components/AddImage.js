import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

class AddImage extends Component {

    render() {
        let imageContainer;
        if(this.props.image !== null && this.props.image !== undefined){
            imageContainer = <img src = {this.props.image} alt = "profile" />
        }
        else if(this.props.storedImage && this.props.storedImage !== ''){
            imageContainer = <img src = {window.location.origin + '/asset_images/'+ this.props.storedImage} alt = "profile 2" />
        }
        else{
            imageContainer = <FontAwesomeIcon icon={faCamera} />;
        }
        return(
            <div className="col-lg-3 col-md-6">
                <div className = "image-container" onClick = {() => document.getElementById('profileImage').click()}>
                    {imageContainer}
                </div>
                <input id="profileImage" type="file" name="profileImage" ref={this.fileInput} onChange={this.props.onImageChange} />
            </div>

        );
    }
}
export default AddImage;