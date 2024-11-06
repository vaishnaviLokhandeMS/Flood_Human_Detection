// src/routes/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../assets/data.json";
import "../styles/Login.css";

const Login = ({ setUserRole }) => {
  const [role, setRole] = useState("OfficerLevel1");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const userCredentials = data.credentials[role];

    if (
      userCredentials &&
      userCredentials.username === username &&
      userCredentials.password === password
    ) {
      setUserRole(role);
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <label>Select Role: </label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="OfficerLevel1">Officer Level 1</option>
        <option value="OfficerLevel2">Officer Level 2</option>
        <option value="OfficerLevel3">Officer Level 3</option>
        <option value="OfficerLevel4">Officer Level 4</option>
        <option value="OfficerLevel5">Officer Level 5</option>
      </select>

      <div>
        <label>Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
