import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = handleFileUpload;
    input.click();
  };

  const openFolderDialog = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('webkitdirectory', 'true');
    input.setAttribute('directory', 'true');
    input.setAttribute('multiple', 'true');
    input.onchange = handleFileUpload;
    input.click();
  };

  const handleSubmitSingleFile = async () => {
    const formData = new FormData();
    formData.append('image', selectedFiles[0]);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload/single/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
        navigate('/usedCarInformation', { state: { response: data, imageUrl: URL.createObjectURL(selectedFiles[0]) } });
      } else {
        console.error('Failed to upload image. Status code:', response.status);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmitFolder = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/upload/multiple/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
        navigate('/learningAccuracy', { state: { response: data, selectedFiles } });
      } else {
        console.error('Failed to upload images. Status code:', response.status);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img className="logo" src="/inhaCar_icon.png" alt="Logo" />
        <div className="nav-container">
          <div className="nav-items">
            <div className="nav-item">Home</div>
            <div className="nav-item">Cars</div>
            <div className="nav-item">Finance</div>
            <div className="nav-item">Guides</div>
            <div className="nav-item">News</div>
          </div>
          <div className="auth-buttons">
            <div className="signup-button">Sign Up</div>
            <div className="login-button">Log in</div>
          </div>
        </div>
      </header>
      <div className='main'>
        <div className="upload-section">
          <h2>Used Car Information</h2>
          <p>Please upload a photo of the car model you're interested in.</p>
          <button onClick={openFileDialog}>Upload</button>
          {selectedFiles.length > 0 && <button onClick={handleSubmitSingleFile}>Submit</button>}
        </div>
        <div className="upload-section">
          <h2>Learning Accuracy</h2>
          <p>Please upload directory you're interested in (testing set).</p>
          <button onClick={openFolderDialog}>Upload</button>
          {selectedFiles.length > 0 && <button onClick={handleSubmitFolder}>Submit</button>}
        </div>
      </div>
    </div>
  );
}

export default Home;
