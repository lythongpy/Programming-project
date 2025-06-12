import React from "react";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";

const notifications = [
  { message: "User Quốc Bảo booked you on June 10, 2:00 PM", time: "1h ago" },
  { message: "Schedule updated by Admin", time: "3d ago" },
  { message: "Reminder: Tomorrow's 9AM session with Nguyễn", time: "1 week ago" }
];

const ClientNotification = () => {
  const navigate = useNavigate();

  return (
    <div className="main-homepage">
      {/* Header */}
      <div className="logo-box">
        <div className="logo-left" onClick={() => navigate("/client/homepage")} style={{ cursor: "pointer" }}>
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      {/* Content */}
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "monospace" }}>
        <h2>Notifications</h2>

        {notifications.map((n, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#b0b3a8",
              borderRadius: "20px",
              padding: "24px 32px",
              marginBottom: "24px",
              fontSize: "1.2rem",
              lineHeight: "1.8"
            }}
          >
            {n.message}
            <br />
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientNotification;
