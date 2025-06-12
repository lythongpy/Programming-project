import React, { useState, useEffect, useCallback } from "react";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService"; // ✅ Added

const ClientAppointment = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ Fixed: Use appointmentService instead of authService
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const uid = authService.getCurrentUserId();
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const appts = await appointmentService.getAppointmentsForClient(uid);
      const pending = [];
      const todayList = [];
      const completed = [];
      appts.forEach((a) => {
        const apptDate = new Date(a.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        if (a.status === "Pending") {
          pending.push(a);
        } else if (apptDate === today && a.status === "Confirmed") {
          todayList.push({ ...a, description: "" });
        } else if (a.status === "Completed" || a.status === "Denied") {
          completed.push(a);
        }
      });
      setPendingAppointments(pending);
      setTodaysAppointments(todayList);
      setCompletedAppointments(completed);
    } catch (e) {
      setPendingAppointments([]);
      setTodaysAppointments([]);
      setCompletedAppointments([]);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredHistory = completedAppointments.filter(
    (item) => filterStatus === "All" || item.status === filterStatus
  );

  // ✅ Fixed: Use appointmentService
  const handleStatusChange = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointments();
    } catch (e) {
      // Optionally handle error
    }
    setLoading(false);
  };

  const handleComplete = async (appt) => {
    setLoading(true);
    try {
      await appointmentService.updateAppointmentStatus(appt.id, "Completed");
      await fetchAppointments();
    } catch (e) {
      // Optionally handle error
    }
    setLoading(false);
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div
          className="logo-left"
          onClick={() => navigate("/client/homepage")}
          style={{ cursor: "pointer" }}
        >
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      <div style={{ display: "flex", padding: "20px 30px", gap: "30px", height: "calc(100vh - 90px)", boxSizing: "border-box", fontFamily: "monospace" }}>
        {/* Pending */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3>🕒 Pending Approvals</h3>
          <div style={{ flex: 1, overflowY: "auto", background: "#b0b3a860", borderRadius: "12px", padding: "12px" }}>
            {pendingAppointments.length === 0 && <div>No pending appointments.</div>}
            {pendingAppointments.map((user) => (
              <div key={user.id} style={{ backgroundColor: "#b0b3a8", borderRadius: "16px", padding: "16px", marginBottom: "16px", minHeight: "140px" }}>
                <div style={{ display: "flex", gap: "14px", cursor: "pointer" }} onClick={() => toggleExpand(user.id)}>
                  <img src={user.avatar || "/image/img_avatar_placeholder.png"} alt="avatar" width="40" height="40" style={{ borderRadius: "50%" }} />
                  <span>{user.bookedBy || user.name}</span>
                </div>
                {expandedId === user.id && (
                  <div style={{ marginTop: "10px" }}>
                    <p><strong>Email:</strong> {user.client?.email || user.email}</p>
                    <p><strong>Date:</strong> {user.date}</p>
                    <p><strong>Time:</strong> {user.time}</p>
                    <p><strong>Note:</strong> {user.note || user.notes}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button className="confirm-btn" style={{ backgroundColor: "#7a9cc6" }} onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, "Confirmed"); }}>
                        ✅ Approve
                      </button>
                      <button className="confirm-btn" style={{ backgroundColor: "#e06d6d" }} onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, "Denied"); }}>
                        ❌ Deny
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3>📅 Today’s Appointments</h3>
          <div style={{ flex: 1, overflowY: "auto", background: "#b0b3a860", borderRadius: "12px", padding: "12px" }}>
            {todaysAppointments.length === 0 && <div>No appointments for today.</div>}
            {todaysAppointments.map((appt) => (
              <div key={appt.id} style={{ backgroundColor: "#b0b3a8", borderRadius: "16px", padding: "16px", marginBottom: "16px", minHeight: "140px" }}>
                <p><strong>Name:</strong> {appt.bookedBy || appt.name}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Note:</strong> {appt.note}</p>
                <textarea
                  rows="2"
                  value={appt.description}
                  onChange={(e) => {
                    const desc = e.target.value;
                    setTodaysAppointments((prev) =>
                      prev.map((a) => a.id === appt.id ? { ...a, description: desc } : a)
                    );
                  }}
                  style={{ width: "100%", borderRadius: "8px", marginTop: "8px", padding: "6px" }}
                  placeholder="Add completion note (optional)..."
                />
                <button className="confirm-btn" onClick={() => handleComplete(appt)} style={{ marginTop: "10px" }}>
                  ✅ Complete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3>✅ History</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Filter by status:</strong>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ marginLeft: "10px", padding: "4px" }}>
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Denied">Denied</option>
              </select>
            </label>
            <br />
            <label>
              <strong>Search by name:</strong>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Enter name..." style={{ width: "100%", marginTop: "6px", padding: "6px", borderRadius: "6px" }} />
            </label>
            <button onClick={() => { setFilterStatus("All"); setSearchText(""); }} style={{ marginTop: "10px", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
              🔄 Clear Filters
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", background: "#b0b3a860", borderRadius: "12px", padding: "12px" }}>
            {filteredHistory
              .filter((item) => (item.bookedBy || item.name || "").toLowerCase().includes(searchText.toLowerCase()))
              .map((item) => (
                <div key={item.id} style={{ backgroundColor: "#b0b3a8", borderRadius: "16px", padding: "16px", marginBottom: "16px", minHeight: "140px" }}>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Time:</strong> {item.time}</p>
                  <p><strong>User:</strong> {item.bookedBy || item.name}</p>
                  <p><strong>Note:</strong> {item.note}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAppointment;
