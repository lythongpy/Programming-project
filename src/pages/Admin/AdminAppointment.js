import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Import Firebase db
import "../../styles/AdminMenu.css"; // ✅ animation styles

const statusColors = {
  Confirmed: "#28a745",
  Pending: "#ffc107",
  Denied: "#dc3545",
  Completed: "#007bff", // Optional: define color if you use "Completed"
};

// 👇 Define custom order
const statusOrder = {
  Completed: 0,
  Denied: 1,
  Confirmed: 2,
  Pending: 3,
};

const AdminAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusAnimation, setStatusAnimation] = useState(false); // To trigger animation

  // Fetch appointments from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "appointments"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      },
      (error) => {
        console.error("Failed to listen to appointments:", error);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setStatusAnimation(true);
    setTimeout(() => setStatusAnimation(false), 300);
  };

  // ✅ Apply filtering and custom sorting
  const filteredAppointments = appointments
    .filter((item) => {
      const matchName =
        item.client?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.bookedBy?.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = !statusFilter || item.status === statusFilter;
      return matchName && matchStatus;
    })
    .sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;
      return orderA - orderB;
    });

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

      {/* Main Content */}
      <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "monospace" }}>
        <h2 style={{ marginBottom: "16px" }}>All Appointments</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by user/client name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor:"transparent",
            }}
          />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{
              width: "200px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor:"transparent",
            }}
            className={statusAnimation ? "status-anim" : ""}
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Denied">Denied</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Appointment List */}
        <div className="appointment-list">
          {filteredAppointments.map((appointment) => {
            const appointmentDate = appointment.date?.toDate?.();
            const formattedDate = appointmentDate ? appointmentDate.toLocaleDateString() : "N/A";

            return (
              <div
                key={appointment.id}
                className="appointment-card fade-slide-up"
                onClick={() => toggleExpand(appointment.id)}
              >
                <p className="appt-time">
                  📅 <span>{formattedDate}</span> — <span>{appointment.time}</span>
                </p>
                <p>👤 <strong>Booked by:</strong> {appointment.bookedBy || "Unknown"}</p>
                <p>👑 <strong>Client:</strong> {appointment.client?.name || "N/A"}</p>
                <p>
                  🏷 <strong>Status:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: statusColors[appointment.status] || "#888",
                      padding: "3px 12px",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {appointment.status}
                  </span>
                </p>

                {expandedId === appointment.id && appointment.note && (
                  <div className="note-box">
                    📝 <strong>Note:</strong> {appointment.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointment;
