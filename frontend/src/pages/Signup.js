import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"; // 🔥 external CSS

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", formData);
      navigate("/");
    } catch (err) {
      alert("Error signing up");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            
          </select>
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
