// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import Login from './components/Login';

const App = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <div>Loading...</div>; // prevent flash
  console.log(isAuthenticated)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Admin route — only show if authenticated */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />
            // <AdminPanel/>
          }
        />
        {/* Login route — only show if NOT authenticated */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/admin" replace />
          }
        />
        {/* Public route */}

      </Routes>
    </Router>
  );
};

export default App;
