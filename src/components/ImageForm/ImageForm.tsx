import React from "react";
import "./ImageForm.scss";

interface ImageProps {
  onInputChange: any;
  onSubmit: any;
}

const ImageForm = ({ onInputChange, onSubmit }: ImageProps) => (
  <div>
    <div>
      <input
        className="url-input"
        type="text"
        onChange={onInputChange}
        placeholder="Enter Image URL"
        required
      />
      <button className="btn url-input-btn" onClick={onSubmit}>
        Detect
      </button>
    </div>
  </div>
);

export default ImageForm;
