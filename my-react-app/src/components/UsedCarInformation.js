import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './UsedCarInformation.css';

const UsedCarInformation = () => {
  const location = useLocation();
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [model, setModel] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (location.state && location.state.response) {
      const { output } = location.state.response;
      const parts = output.split('_');
      if (parts[0] == '트럭' ||  parts[0] == '이륜차') {
        parts[0] = '미분류';
      }
      if (parts.length === 3) {
        setBrand(parts[0]); 
        setType(parts[1]);  
        setModel(parts[2]); 
      }
    }
    if (location.state && location.state.imageUrl) {
      setImageUrl(location.state.imageUrl);
    }
  }, [location.state]);

  return (
    <div className="container">
      <div className="inner-container">
        <div className="header">
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
        <div className="content">
          <div className="section">
            <h2>Used Car Price</h2>
          </div>
          <div className="filters">
            <button className="filter">{type}</button> {/* "SUV" 대신 type 사용 */}
            <button className="filter">{brand}</button> {/* "Audi" 대신 brand 사용 */}
            <button className="filter">{model}</button> {/* modelName 대신 model 사용 */}
          </div>
          <div className="image-section">
            <img src={imageUrl} alt="Car" />
          </div>
          <div className="stats">
            <div className="stat-box">
              <div className="price">Average</div>
              <div className="label">$39,000</div>
              <div className="change">+1.56%</div>
            </div>
            <div className="stat-box">
              <div className="price">Current</div>
              <div className="label">$40,000</div>
              <div className="change">+2.56%</div>
            </div>
            <div className="stat-box">
              <div className="label">Specifications</div>
                <div className='spec_logo_box'>
                <img className="spec_image" src="/spec_logo1.png" alt="Logo" />
                <img className="spec_image" src="/spec_logo2.png" alt="Logo" />
                <img className="spec_image" src="/spec_logo3.png" alt="Logo" />
                <img className="spec_image" src="/spec_logo4.png" alt="Logo" />
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsedCarInformation;
