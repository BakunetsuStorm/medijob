import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddJob from "./pages/AddJob";
import Login from "./pages/Login"; // Нэмсэн
import Register from "./pages/Register"; // Нэмсэн

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add-job' element={<AddJob />} />

        {/* Шинээр нэмэгдсэн замууд */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
