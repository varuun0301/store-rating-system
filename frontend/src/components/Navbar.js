import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        ⭐ Rating System
      </div>
      <div className="nav-links">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
