import React from 'react';
import '../index.css'

const FileInput = ({ onFileChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="fileInputContainer">
      <label className="fileInputLabel">
        <input className="fileInput" type="file" accept="*/*" onChange={handleFileChange} />
        select yo file
      </label>
    </div>
  );
};

export default FileInput;
