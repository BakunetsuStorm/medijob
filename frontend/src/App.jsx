import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddJob from './pages/AddJob';

function App() {
  return (
    <Router>
      <Routes>
        {/* Нүүр хуудас (http://localhost:5173/) */}
        <Route path="/" element={<Home />} />
        
        {/* Зар нэмэх хуудас (http://localhost:5173/add-job) */}
        <Route path="/add-job" element={<AddJob />} />
      </Routes>
    </Router>
  );
}

export default App;