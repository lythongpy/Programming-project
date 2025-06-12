import React, { useState } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";

const AdminAddAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Client"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authService.register({
        name: form.name,
        email: form.email,
        username: form.phone, // assuming username = phone input
        password: form.password,
        role: form.role.toLowerCase(), // make role lowercase for consistency
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        navigate("/admin/add-client");
      }, 2000);
    } catch (error) {
      alert("Error creating user: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: "#aeb1a5", minHeight: "100vh" }}>
      <div className="main-homepage">
        {/* Header */}
        <div className="logo-box">
          <div
            className="logo-left"
            onClick={() => navigate("/admin/homepage")}
            style={{ cursor: "pointer" }}
          >
            <img src="/image/img_logo.svg" alt="Logo" />
            <span className="navbar-title">Appointment Scheduler</span>
          </div>
          <AdminMenu />
        </div>
      </div>

      {/* Centered Form Box */}
      <div style={formBoxStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Add New Client Account</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name*"
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Mail*"
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Username*"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password*"
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password*"
            required
            style={inputStyle}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" style={buttonStyle}>Create Account</button>

          {submitted && (
            <p style={successStyle}>
              ✅ Client account created successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// Style Definitions
const inputStyle = {
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontFamily: "monospace"
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundColor: "#fff"
};

const buttonStyle = {
  backgroundColor: "#aeb1a5",
  color: "#333",
  fontWeight: "bold",
  padding: "12px",
  borderRadius: "24px",
  border: "none",
  cursor: "pointer",
  fontFamily: "monospace"
};


const formBoxStyle = {
  backgroundColor: "#f3efe4",
  maxWidth: "700px",
  margin: "80px auto",
  padding: "40px",
  borderRadius: "28px",
  boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  fontFamily: "monospace"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};

const successStyle = {
  marginTop: "10px",
  color: "#4CAF50",
  textAlign: "center"
};

export default AdminAddAccount;
