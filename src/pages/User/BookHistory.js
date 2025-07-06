import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import "../../styles/homepage.css";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";

const BookHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const uid = authService.getCurrentUserId();
    if (!uid) return;

    // Real-time subscription to user's appointments with Timestamp normalization
    const unsubscribe = appointmentService.subscribeToUserAppointments(
      uid,
      (appointments) => {
        // Convert Firestore Timestamps to JS Date
        const normalized = appointments.map((a) => {
          const ts = a.date;
          const dateObj = ts && ts.toDate ? ts.toDate() : new Date(ts);
          return { ...a, date: dateObj };
        });
        // Sort by date & time descending (latest first)
        normalized.sort((a, b) => b.date.getTime() - a.date.getTime());
        setHistory(normalized);
      }
    );

    return () => unsubscribe();
  }, []);

  const blockStyle = {
    backgroundColor: "#b0b3a8",
    borderRadius: "20px",
    padding: "24px 32px",
    marginBottom: "24px",
    fontSize: "1.2rem",
    lineHeight: "1.8",
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

      {/* History */}
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px" }}>
        <h2 style={{ fontFamily: "monospace", marginBottom: "24px" }}>Appointment History</h2>
        {history.length === 0 ? (
          <div style={blockStyle}>No appointment history found.</div>
        ) : (
          history.map((item, index) => (
            <div key={item.id || index} style={blockStyle}>
              <strong>{item.date.toLocaleString()}</strong>
              {item.time && <> at <strong>{item.time}</strong></>}
              <br />
              {item.client?.name && <>with: {item.client.name}</>}
              {item.with && <>with: {item.with}</>}
              {item.status && (
                <span
                  style={{
                    float: "right",
                    fontSize: "1rem",
                    backgroundColor: {
                      Pending: "#ccc",     // soft green-gray 
                      Confirmed: "#4CAF50",     // medium green
                      Denied: "#e74c3c",      // light red
                      Completed: "#007bff",    // dark green a8d5a2
                    }[item.status] || "#ccc", // fallback color
                    color: "black",
                    borderRadius: "8px",
                    padding: "2px 10px",
                    marginLeft: "10px"
                  }}
                >
                  {item.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookHistory;
