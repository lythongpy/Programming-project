import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import "../../styles/homepage.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Tiểu Mimi",
    firstName: "Tôm",
    lastName: "Lê Nguyễn",
    middleName: "Quỳnh ",
    gender: "Bị Thiến Rồi",
    phone: "0906335661",
    email: "meow@mimi.com",
    description: "Rất béo và thúi và ngáo ngơ",
    userType: "Chó",
    password: "12345678"
  });

  const handleToggleEdit = () => {
    if (isEditing) {
      alert("Profile saved!");
      // Optional: send to backend
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div className="logo-left">
          <Link to="/user/dashboard" className="login-logo-link">
            <img src="/image/img_logo.svg" alt="Logo" className="login-logo" />
          </Link>
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <UserMenu />
      </div>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          gap: "40px",
          justifyContent: "space-between"
        }}>
          {/* Left side - avatar and name */}
          <div style={{
            backgroundColor: "#b0b3a8",
            borderRadius: "40px",
            padding: "40px",
            width: "500px",
            textAlign: "center"
            
          }}>
            <img
              src="/image/DucAnh.png"
              alt="Avatar"
              style={{
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "16px"
              }}
            />
            <h2 style={{
              fontFamily: "monospace",
              fontSize: "2rem",     // Increase this value as needed
              marginTop: "16px"
            }}>
              {form.name}
            </h2>
          </div>

          {/* Right side - form */}
          <div style={{
            backgroundColor: "#b0b3a8",
            borderRadius: "40px",
            padding: "40px",
            flex: 1,
          }}>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <button
                onClick={handleToggleEdit}
                style={{
                  backgroundColor: "#666851",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#4a4c3d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#666851"}
              >
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
              
            }}>
              <FormRow label="First name" name="firstName" value={form.firstName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Last name" name="lastName" value={form.lastName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Middle name (optional)" name="middleName" value={form.middleName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Gender" name="gender" value={form.gender} editable={isEditing} onChange={handleChange} />
              <FormRow label="Phone number" name="phone" value={form.phone} editable={isEditing} onChange={handleChange} />
              <FormRow label="Email" name="email" value={form.email} editable={isEditing} onChange={handleChange} />
              <FormRow label="Password" name="password" type="password" value={form.password} editable={isEditing} onChange={handleChange} />
              <FormRow label="User Type" name="userType" value={form.userType} editable={isEditing} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>Discription:</label><br />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={6}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  padding: "16px",
                  fontFamily: "monospace",
                  fontSize: "1.5rem",
                  backgroundColor: isEditing ? "#e0dede" : "#d9d9d9",
                  border: "none",
                  marginTop: "10px"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormRow = ({ label, name, value, editable, onChange, type = "text" }) => (
  <div>
    <label style={{ fontWeight: "bold" }}>{label}</label><br />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "16px",
        fontFamily: "monospace",
        fontSize: "1.3rem",
        backgroundColor: editable ? "#e0dede" : "#d9d9d9",
        border: "none"
      }}
    />
  </div>
);

export default UserProfile;
