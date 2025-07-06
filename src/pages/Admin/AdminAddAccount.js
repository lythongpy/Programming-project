import React, { useState } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import "../../styles/AdminMenu.css";

const AdminAddAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Client",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("❗ Passwords do not match");
    return;
  }

  try {
    await authService.register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role.toLowerCase(),
    });

    // Mark that a new account has been created
    localStorage.setItem('isNewAccount', 'true'); // Set the flag here

    // After successful account creation, do not redirect immediately.
    // Display a success message and allow them to navigate themselves.
    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "Client",
    });
  } catch (error) {
    alert("❌ Error creating user: " + error.message);
  }
};

  return (
    <div style={{ backgroundColor: "#f4f1e8", minHeight: "100vh" }}>
      {/* Header */}
      <div className="main-homepage">
        <div className="logo-box">
          <div
            className="logo-left"
            onClick={() => navigate("/admin/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img src="/image/img_logo.svg" alt="Logo" />
            <span className="navbar-title">Appointment Scheduler</span>
          </div>
          <AdminMenu />
        </div>
      </div>

      {/* Form Section */}
      <div className="fade-in" style={formBoxStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "24px"}}>
          ➕ Add New {form.role} Account
        </h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name*"
            aria-label="Full Name"
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email*"
            aria-label="Email Address"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password*"
            aria-label="Password"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password*"
            aria-label="Confirm Password"
            required
            style={inputStyle}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f4f1e8", 
              padding: "14px",
              fontSize: "1rem",
              borderRadius: "12px",
              border: "1px solid #bbb",
              fontFamily: "monospace",
            }}
          >
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" style={buttonStyle}>Create Account</button>

          {submitted && <SuccessPopup onClose={() => setSubmitted(false)} role={form.role} />}
            
        </form>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: "14px",
  fontSize: "1rem",
  borderRadius: "12px",
  border: "1px solid #bbb",
  fontFamily: "monospace",
  backgroundColor: "#ECE7DC",
};

const buttonStyle = {
  backgroundColor: "#f4f1e8",
  color: "#666851",
  fontWeight: "bold",
  padding: "14px",
  borderRadius: "24px",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease",
  fontFamily: "monospace",
};

const formBoxStyle = {
  backgroundColor: "#B0B3A8",
  maxWidth: "700px",
  margin: "80px auto",
  padding: "40px",
  borderRadius: "28px",
  boxShadow: "0 0 20px rgba(0,0,0,0.12)",
  fontFamily: "monospace",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const popupOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "30px 40px",
  borderRadius: "20px",
  boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  textAlign: "center",
  fontFamily: "monospace",
};

const popupButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#666851",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const SuccessPopup = ({ onClose, role }) => (
  <div style={popupOverlayStyle}>
    <div style={popupBoxStyle}>
      <h3 style={{ marginBottom: "10px" }}>🎉 Account Created!</h3>
      <p>{role} account has been successfully added.</p>
      <button onClick={onClose} style={popupButtonStyle}>OK</button>
    </div>
  </div>
);

export default AdminAddAccount;
