import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import authService from "../../services/AuthService";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login(form);
      const role = await authService.getUserRole(user.uid);
      alert("Login successful");
      navigate(`/dashboard/${role}`);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <a href="/" className="login-logo-link">
          <img src="/image/img_logo.svg" alt="Logo" className="login-logo" />
        </a>
        <span className="navbar-title">Appointment Scheduler</span>
      </header>

      <form className="login-box" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        <div className="login-buttons">
          <button type="submit" className="login-btn">Login</button>
          <a href="/register" className="login-btn">Sign up</a>
        </div>

        <div className="divider">
          <hr /> <span>or</span> <hr />
        </div>

        <button className="social-btn" disabled>
          <FaFacebookF className="social-icon" /> Login with Facebook (coming soon)
        </button>

        <button className="social-btn" disabled>
          <MdEmail className="social-icon" /> Login with Mail (coming soon)
        </button>

      </form>
    </div>
  );
};

export default Login;
