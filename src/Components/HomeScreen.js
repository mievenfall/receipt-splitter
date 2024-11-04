import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css'
import TextRecognition from './TextRecognition';


function HomeScreen({ setSelectedFile}) {
  const navigate = useNavigate();
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file); // Store the actual file
      }

      navigate('/process');
    }
  
    return (
      <div className="home-container">
        <div className="title">TARGET'S BILL PLITTER</div>
        <div className="subtitle">start by uploading your receipt here</div>
        <label className="receipt-upload btn" htmlFor="receipt-upload-btn">
          UPLOAD
        </label>
        <input
          type="file"
          id="receipt-upload-btn"
          accept=".pdf, image/png, image/jpeg"
          onChange={handleFileUpload}
        />
      </div>
    );
  }

export default HomeScreen;