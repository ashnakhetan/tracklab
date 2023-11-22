import React from 'react';
import '../index.css'

const FileInput = ({ onFileChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        console.log(file);
      onFileChange(file);
    }
  };

  return (
    <div className="fileInputContainer">
      <label className="fileInputLabel">
        <input className="fileInput" type="file" accept="audio/*" onChange={handleFileChange} />
        select yo file
      </label>
    </div>
  );
};

export default FileInput;
