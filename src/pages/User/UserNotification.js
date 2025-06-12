import React from "react";
import UserMenu from "../../components/UserMenu";
import { Link } from "react-router-dom";
import "../../styles/homepage.css";

const UserNotification = () => {
  const notifications = [
    { message: "Your appointment with Dr. Linh was moved to June 9, 10:00 AM", time: "1h ago" },
    { message: "New message from CEO Nguyễn", time: "3d ago" },
    { message: "Appointment with Bảo confirmed", time: "1 week ago" }
  ];

  const blockStyle = {
    backgroundColor: "#b0b3a8",
    borderRadius: "20px",
    padding: "24px 32px",
    marginBottom: "24px",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    fontFamily: "Roboto Mono, monospace"
  };

  return (
    <div style={{ backgroundColor: "#f4f1e8", minHeight: "100vh" }}>
      {/* Header */}
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
      </div>

      {/* Notifications */}
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px" }}>
        <h2 style={{ fontFamily: "monospace", marginBottom: "24px" }}>Notifications</h2>

        {notifications.map((n, idx) => (
          <div key={idx} style={blockStyle}>
            {n.message}
            <br />
            <span style={{ fontSize: "0.9rem", color: "#333" }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserNotification;
