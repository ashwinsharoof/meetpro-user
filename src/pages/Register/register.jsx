import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/register.css';

export default function GetStarted() {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/user/register', { // Replace with your actual backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/Login', { state: formData }); // navigate after success
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>MobileNumber</label>
          <input name="mobileNumber" type="text" required value={formData.mobileNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" required value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Get Started</button>
      </form>
    </div>
  );
}
