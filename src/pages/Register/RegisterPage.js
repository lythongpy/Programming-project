import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RegisterPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("❌ Invalid email format.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("❗ Passwords do not match");
      return;
    }

    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success("🎉 Registration successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        theme: "colored",
      });

      setTimeout(() => {
        navigate(`/${form.role}/dashboard`);
      }, 2500);
    } catch (err) {
      toast.error("❌ Registration failed: " + err.message);
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
          type="text"
          name="email"
          placeholder="Mail*"
          className="login-input"
          value={form.email}
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

        <Link to="/login" className="login-btn" style={{ marginTop: "35px", textAlign: "center", width: "150px" }}>
          Back
        </Link>
      </form>
      <ToastContainer
  position="top-center"
  autoClose={2000}
  pauseOnHover={false}
  theme="colored"
/>

    </div>
  );
};

export default RegisterPage;
