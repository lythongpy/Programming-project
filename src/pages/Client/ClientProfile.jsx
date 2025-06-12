import React, { useState } from "react";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Tiểu Mimi",
    gender: "Bị Thiến Rồi",
    phone: "0906335661",
    email: "meow@mimi.com",
    description: "Rất béo và thúi và ngáo ngơ",
    role: "Chó",
    joined: "2023-10-01"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    if (isEditing) alert("Profile saved!");
    setIsEditing(!isEditing);
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div
          className="logo-left"
          onClick={() => navigate("/client/hompage")}
          style={{ cursor: "pointer" }}
        >
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: "40px",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Left side - avatar and name */}
          <div
            style={{
              backgroundColor: "#b0b3a8",
              borderRadius: "40px",
              padding: "40px",
              width: "480px",
              textAlign: "center"
            }}
          >
            <img
              src="/image/DucAnh.png"
              alt="Client Avatar"
              style={{
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "16px"
              }}
            />
            <h2
              style={{
                fontFamily: "monospace",
                fontSize: "2rem",
                marginTop: "16px"
              }}
            >
              {form.name}
            </h2>
            <p style={{ fontSize: "1.1rem", fontFamily: "monospace", opacity: 0.8 }}></p>
          </div>

          {/* Right side - form */}
          <div
            style={{
              backgroundColor: "#b0b3a8",
              borderRadius: "40px",
              padding: "40px",
              flex: 1
            }}
          >
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <button
                onClick={toggleEdit}
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
                onMouseOver={(e) => (e.target.style.backgroundColor = "#4a4c3d")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#666851")}
              >
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px"
              }}
            >
              <FormRow label="Email" name="email" value={form.email} editable={isEditing} onChange={handleChange} />
              <FormRow label="Phone" name="phone" value={form.phone} editable={isEditing} onChange={handleChange} />
              <FormRow label="Joined" name="joined" value={form.joined} editable={false} onChange={handleChange} />
              <FormRow label="Role" name="role" value={form.role} editable={false} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Description:</label>
              <br />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={5}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  padding: "16px",
                  fontFamily: "monospace",
                  fontSize: "1.3rem",
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

const FormRow = ({ label, name, value, editable, onChange }) => (
  <div>
    <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{label}</label>
    <br />
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "16px",
        fontFamily: "monospace",
        fontSize: "1.3rem",
        backgroundColor: editable ? "#e0dede" : "#d9d9d9",
        border: "none"
      }}
    />
  </div>
);

export default ClientProfile;
