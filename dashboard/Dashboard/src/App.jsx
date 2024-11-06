// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";

const App = () => {
  const [userRole, setUserRole] = useState(null); // Track logged-in user role

  const handleLogout = () => {
    setUserRole(null); // Clear the role on logout
  };

  const ProtectedRoute = ({ children }) => {
    return userRole ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setUserRole={setUserRole} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard userRole={userRole} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
