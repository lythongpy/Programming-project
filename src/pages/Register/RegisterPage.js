import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import './Register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await authService.register({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role,
      });
      alert('Registration successful');
      navigate(`/${form.role}/dashboard `);
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/" className="login-logo-link">
          <img src="/image/img_logo.svg" alt="Logo" className="login-logo" />
        </Link>
        <span className="navbar-title">Appointment Scheduler</span>
      </header>

      <form className="login-box" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name*"
          className="login-input"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Mail*"
          className="login-input"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username*"
          className="login-input"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password*"
          className="login-input"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password*"
          className="login-input"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <input type="hidden" name="role" value="user" />

        <button className="login-btn" type="submit" style={{ marginTop: "0.5px", width: "400px" }}>
          Create Account
        </button>

        <Link to="/login" className="login-btn" style={{ marginTop: "10px", textAlign: "center", width: "150px" }}>
          Back
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
