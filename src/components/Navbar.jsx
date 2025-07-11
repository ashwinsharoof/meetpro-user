import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home/style/navbar.css'

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear all localStorage
    navigate('/Login');   // ✅ Navigate to Login page
  };


  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar">
        <ul className="nav-links">
          <li onClick={() => navigate('/Home')}>Home</li>
          <li onClick={() => navigate('/Profile')}>Profile</li>
          <li onClick={handleLogout}>Logout</li> {/* ✅ Updated */}
        </ul>
      </nav>
    </div>
  );
}