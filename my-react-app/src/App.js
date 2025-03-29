import React from 'react';
import Home from './components/Home';
import UsedCarInformation from './components/UsedCarInformation';
import LearningAccuracy from './components/LearningAccuracy';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UsedCarInformation" element={<UsedCarInformation />} />
          <Route path="/LearningAccuracy" element={<LearningAccuracy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;