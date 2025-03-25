import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/Register'; // Import the Register component
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookDetail from './pages/BookDetail';
import Listing from './pages/Listing';
import Review from './components/Review';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle login
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem("distribute", 0);
    setIsAuthenticated(true);
  };
  
  // Handle successful registration (redirects to login)
  const handleRegisterSuccess = () => {
    // You could potentially auto-login the user here instead
    // or just redirect them to the login page
    return <Navigate to="/login" />;
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem("distribute");
    setIsAuthenticated(false);
  };
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={500} />
      <div className="flex  bg-gray-100">
        {/* {isAuthenticated && <Sidebar />} */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isAuthenticated && <Navbar onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/home" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? 
                <Register onRegisterSuccess={handleRegisterSuccess} /> : 
                <Navigate to="/home" />
            } />
            <Route path="/home" element={
              isAuthenticated ? 
                <Home /> : 
                <Navigate to="/login" />
            } />
            <Route path="*" element={
              isAuthenticated ? 
                <Navigate to="/home" /> : 
                <Navigate to="/login" />
            } />
            <Route path="/profile" element={
              isAuthenticated ? 
                <Profile /> : 
                <Navigate to="/login" />
            } />
            <Route path="/book/:bookId" element={
              isAuthenticated ? 
                <BookDetail /> : 
                <Navigate to="/login" />
            } />
            <Route path="/book" element={
              isAuthenticated ? 
                <Listing /> : 
                <Navigate to="/login" />
            } />
            <Route path="/my-review" element={
              isAuthenticated ? 
                <Review /> : 
                <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;