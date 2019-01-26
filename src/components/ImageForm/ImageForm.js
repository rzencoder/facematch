import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange, onSubmit }) => (
    <div>
        <div>
            <input className="url-input" type="text" onChange={onInputChange} placeholder="Enter Image URL" required></input>
            <button className="btn url-input-btn" onClick={onSubmit}>Detect</button>
        </div>
    </div>
);

export default ImageForm;
