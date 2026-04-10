import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddJob from './pages/AddJob';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import MyJobs from './pages/MyJobs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/my-jobs" element={<MyJobs />} />
      </Routes>
    </Router>
  );
}

export default App;