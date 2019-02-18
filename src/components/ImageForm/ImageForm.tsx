import React from "react";
import "./ImageForm.scss";

interface ImageProps {
  onInputChange: any;
  onSubmitImage: any;
}

const ImageForm = ({ onInputChange, onSubmitImage }: ImageProps) => (
  <div>
    <div>
      <input
        className="url-input"
        type="text"
        onChange={onInputChange}
        placeholder="Enter Image URL"
        required
      />
      <button className="btn url-input-btn" onClick={onSubmitImage}>
        Detect
      </button>
    </div>
  </div>
);

export default ImageForm;
