import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Decode role from response (backend must return it in login API)
      const { role } = res.data;

      // Redirect based on role
      if (role === "USER") {
        navigate("/user-dashboard");
      } else if (role === "OWNER") {
        navigate("/owner-dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
