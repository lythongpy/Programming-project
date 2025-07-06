import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import UserMenu from "../../components/UserMenu";
import "../../styles/homepage.css";
import { Link } from "react-router-dom";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

const [weekStartDate, setWeekStartDate] = useState(() => {
  const d = new Date(selectedDate);
  d.setDate(d.getDate() - d.getDay()); // Sunday of current week
  return d;
});

const goToPrevWeek = () => {
  const prev = new Date(weekStartDate);
  prev.setDate(prev.getDate() - 7);
  setWeekStartDate(prev);
};

const goToNextWeek = () => {
  const next = new Date(weekStartDate);
  next.setDate(next.getDate() + 7);
  setWeekStartDate(next);
};

// Keep selectedDate synced (optional but nice UX)
useEffect(() => {
  setSelectedDate(new Date(weekStartDate));
}, [weekStartDate]);


  // Subscribe to real-time user appointments and normalize timestamp
  useEffect(() => {
    const uid = authService.getCurrentUserId();
    if (!uid) {
      console.warn("User ID missing. Abort appointment subscription.");
      return;
    }

    const unsubscribe = appointmentService.subscribeToUserAppointments(uid, (appts) => {
      const normalized = appts.map((appt) => ({
        ...appt,
        date: appt.date?.toDate?.() || new Date(appt.date),
        createdAt: appt.createdAt?.toDate?.() || new Date(),
      }));
      setAppointments(normalized);
    });

    return () => unsubscribe();
  }, []);


  
  // Normalize appointments to ensure date is a valid Date object
  const normalizedAppointments = appointments.map((appt) => {
    const apptDate = appt.date?.toDate
      ? appt.date.toDate()
      : new Date(appt.date);

    const dateStr = `${apptDate.getFullYear()}-${String(apptDate.getMonth() + 1).padStart(2, "0")}-${String(apptDate.getDate()).padStart(2, "0")}`;

    return {
      ...appt,
      date: apptDate,
      dateStr,
      client: {
        ...(appt.client || {}),
        avatar: appt.client?.avatar || "/image/default.png",
      },
    };
  });

  const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time to start of day

  const upcomingAppointments = normalizedAppointments
    .filter((appt) => appt.date >= today)
    .sort((a, b) => a.date - b.date);

  // Helper to filter by selectedDate
  const getAppointmentsForDate = (date) => {
    const dayStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return normalizedAppointments
      .filter((a) => a.dateStr === dayStr)
      .sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
  };

  return (
    <div className="main-homepage">
      {/* Header */}
      <div
        className="logo-box"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div className="logo-left">
          <Link to="/user/dashboard">
            <img src="/image/img_logo.svg" alt="Logo" width={40} />
          </Link>
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <UserMenu />
      </div>

      {/* Calendar Controls */}
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Calendar</h2>
        <button
          className="confirm-btn"
          style={{ marginLeft: "12px" }}
          onClick={() =>
            setViewMode(viewMode === "month" ? "week" : "month")
          }
        >
          Switch to {viewMode === "month" ? "Week View" : "Month View"}
        </button>

        {/* Month View */}
        {viewMode === "month" && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#ece7dc",
              borderRadius: "10px",
            }}
          >
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              className="calendar-grid-stretch"
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const dayStr = `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, '0')}-${String(date.getDate()).padStart(
                  2,
                  '0'
                )}`;
                const hasEvent = normalizedAppointments.some(
                  (a) => a.dateStr === dayStr
                );
                return hasEvent ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "green",
                      fontSize: "2rem",
                    }}
                  >
                    •
                  </div>
                ) : null;
              }}
            />
          </div>
        )}

        {/* Week View */}
        {viewMode === "week" && (
  <div
    style={{
      marginTop: "30px",
      padding: "20px",
      background: "#ece7dc",
      borderRadius: "10px",
    }}
  >
    {/* Week View Header */}
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginBottom: "16px" }}>
  <button onClick={goToPrevWeek} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>‹</button>
  <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
    {weekStartDate.toLocaleString("default", { month: "long" })} {weekStartDate.getFullYear()}
  </div>
  <button onClick={goToNextWeek} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>›</button>
</div>


    {/* Week Table */}
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <th
              key={i}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Array.from({ length: 7 }).map((_, idx) => {
            const day = new Date(weekStartDate);
            day.setDate(weekStartDate.getDate() + idx);
            const events = getAppointmentsForDate(day);
            return (
              <td
                key={idx}
                style={{
                  verticalAlign: "top",
                  padding: "10px",
                  height: "120px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  {day.getDate()} / {day.getMonth() + 1}
                </div>
                {events.map((event, i) => {
                  const bg = {
                    Pending: "#ccc",
                    Confirm: "#28a745",
                    Denied: "#dc3545",
                    Complete: "#007bff",
                  }[event.status] || "#6c757d";
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: bg,
                        color: "black",
                        borderRadius: "6px",
                        marginBottom: "6px",
                        padding: "4px 8px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {event.client?.name || event.user} – {event.time}
                    </div>
                  );
                })}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  </div>
)}


        {/* Upcoming Appointments List */}
        <div style={{ padding: "40px" }}>
          <h2 style={{ fontFamily: "monospace", marginBottom: "20px" }}>
            Upcoming Appointments
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                onClick={() => setSelectedClient(appt)}
                style={{
                  backgroundColor: "#b0b3a8",
                  borderRadius: "32px",
                  padding: "20px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <img
                    src={appt.client?.avatar || "/image/default.png"}
                    onError={(e) => { e.target.src = "/image/default.png"; }}
                    alt="avatar"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                  />
                  <span style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                    <strong>{appt.client?.name || "Unknown"}</strong><br />
                    📅 {new Date(appt.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                    <br />
                    ⏰ {appt.time || "—"}
                  </span>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedClient && (
          <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const color = {
    Pending: "#ccc",
    Confirmed: "#5cb85c",
    Denied: "#d9534f",
    Completed: "#3c8c3c",
  }[status] || "#6c757d";
  return (
    <span
      style={{
        backgroundColor: color,
        color: "black",
        padding: "4px 12px",
        borderRadius: "10px",
        fontSize: "0.9rem",
      }}
    >
      {status}
    </span>
  );
};

const ClientDetailModal = ({ client, onClose, onDelete  }) => {
  const handleBg = (e) => {
    if (e.target.id === "modal-bg") onClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      await appointmentService.deleteAppointment(client.id);
      onClose();
    }
  };

  return (
    <div
      id="modal-bg"
      onClick={handleBg}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#b0b3a8",
          borderRadius: "48px",
          padding: "40px",
          width: "700px",
          maxWidth: "90%",
          fontFamily: "monospace",
        }}
      >
        {/* Status */}
        <div style={{ position: "absolute", top: "20px", right: "30px" }}>
          <StatusBadge status={client.status} />
        </div>

        {/* Client Name */}
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "30px" }}>
          {client.client?.name || client.user || "Details"}
        </h2>

        {/* Date / Time Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: "1.1rem",
            marginBottom: "24px",
            padding: "0 10px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>📅 Date</div>
            {new Date(client.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>⏰ Time</div>
            {client.time || "—"}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            backgroundColor: "#e1e1e1",
            borderRadius: "24px",
            padding: "20px",
            fontSize: "1rem",
            minHeight: "120px",
            marginBottom: "30px",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Description:</strong>
          <br />
          {client.note || client.description || "—"}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          {client.status === "Pending" && (
            <button onClick={handleDelete} style={btnStyle("#f76e6e")}>
              Delete
            </button>
          )}
          <button onClick={onClose} style={btnStyle("#fdbd88")}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: "#333",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  fontWeight: "bold",
  cursor: "pointer",
});

export default UserDashboard;
