import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LearningAccuracy.css';

const LearningAccuracy = () => {
  const location = useLocation();
  const [modelAccuracy, setmodelAccuracy] = useState('');
  const [typeAccuracy, settypeAccuracy] = useState('');
  const [brandAccuracy, setbrandAccuracy] = useState('');
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (location.state && location.state.response) {
      const { modelAccuracy, typeAccuracy, brandAccuracy, results } = location.state.response;
      setmodelAccuracy(modelAccuracy);
      settypeAccuracy(typeAccuracy);
      setbrandAccuracy(brandAccuracy);
      setResults(results);

      if (location.state.selectedFiles) {
        const urls = location.state.selectedFiles.map(file => URL.createObjectURL(file));
        setImageUrls(urls);
      }
    }
  }, [location.state]);

  // Handlers for navigating the image slider
  const goToPreviousImage = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentIndex(prevIndex => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="learning-accuracy-container">
      <div className="learning-accuracy-wrapper">
        <div className="header-container">
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
        </div>
        
        <div className="main-title">Evaluation</div>
        
        {/* Image slider section */}
        <div className="content-container">
          <div className="image-slider-section">
            {imageUrls.length > 0 && (
              <>
                <div className="image-slider">
                  <button className="slider-button left" onClick={goToPreviousImage}>◀</button>
                  <div className="image-wrapper">
                    <img
                      className="slider-image"
                      src={imageUrls[currentIndex]}
                      alt={`Slide ${currentIndex + 1}`}
                    />
                  </div>
                  <button className="slider-button right" onClick={goToNextImage}>▶</button>
                </div>
                <div className="image-label">
                  <p>{results[currentIndex]?.output}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Metrics section */}
          <div className="metrics-container">
            <div className="metric-box">
              <div className="metric-title">Type Accuracy</div>
              <div className="metric-value">{typeAccuracy} %</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Brand Accuracy</div>
              <div className="metric-value">{brandAccuracy} %</div>
            </div>
            <div className="metric-box">
              <div className="metric-title">Model Accuracy</div>
              <div className="metric-value">{modelAccuracy} %</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningAccuracy;
