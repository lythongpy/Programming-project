import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import authService from "../../services/AuthService";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // ✅ Regex email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
    setErrorMessage("❌ Invalid email format.");
    return;
  }
    try {
      const user = await authService.login(form);
      const role = await authService.getUserRole(user.uid);
      // alert("Login successful");
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setErrorMessage("❌ Login failed: Credentials are incorrect or user does not exist.");
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
        {errorMessage && (
        <div
          style={{
            fontSize: "20px",
            backgroundColor: "transparent",
            color: "#721c24",
            border: "1px solid transparent",
            padding: "12px 16px",
            borderRadius: "10px",
            margin: "0 auto 20px",
            maxWidth: "100%",
            fontFamily: "monospace",
            textAlign: "center"
          }}
        >
          {errorMessage}
        </div>
      )}
        <input
          type="text"
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

        <a className="social-btn" disabled style={{ fontSize: "1.2rem" }}>
          <FaFacebookF style={{ fontSize: "40px" }} className="social-icon" /> Login with Facebook (coming soon)
        </a>

        <a className="social-btn" disabled style={{ fontSize: "1.2rem" }}>
          <MdEmail style={{ fontSize: "40px" }} className="social-icon" /> Login with Mail (coming soon)
        </a>

      </form>
    </div>
  );
};

export default Login;
