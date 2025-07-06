import React, { useState, useEffect, useCallback, useMemo } from "react";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";
import { db } from "../../firebase/firebase";
import {
  onSnapshot,
  query,
  collection,
  where,
  getDoc,
  doc,
  Timestamp
} from "firebase/firestore";

// Helper function to check if two dates are the same day
const isSameDay = (d1, d2) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const ClientAppointment = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const uid = authService.getCurrentUserId();
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const appts = await appointmentService.getAppointmentsForClient(uid);
      const enriched = await Promise.all(appts.map(async (a) => {
        let avatar = "/image/img_avatar_placeholder.png";
        let name = a.name;
        let time = a.time || "—";

        try {
          const publicSnap = await getDoc(doc(db, "public_profiles", a.userId));
          if (publicSnap.exists()) {
            const publicData = publicSnap.data();
            avatar = publicData.avatarUrl ?? avatar;
            name = publicData.name || name;
          }
        } catch (e) {
          console.warn(`No public profile found for user ${a.userId}`);
        }

        return { ...a, avatar, name, time };
      }));

      const today = new Date();
      const pending = [];
      const todayList = [];
      const completed = [];

      enriched.forEach((a) => {
        const dateObj = a.date?.toDate() instanceof Date ? a.date.toDate() : new Date(a.date);
        if (a.status === "Pending") {
          pending.push(a);
        } else if (isSameDay(dateObj, today) && a.status === "Confirmed") {
          todayList.push({ ...a, description: "" });
        } else if (["Completed", "Denied"].includes(a.status)) {
          completed.push(a);
        }
      });

      setPendingAppointments(pending);
      setTodaysAppointments(todayList);
      setCompletedAppointments(completed);
    } catch (e) {
      console.error("Failed to fetch appointments:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const uid = authService.getCurrentUserId();
    if (!uid) return;

    const unsubscribe = onSnapshot(
      query(collection(db, "appointments"), where("client.id", "==", uid)),
      async (snapshot) => {
        if (!active) return;
        if (snapshot.empty) {
          setPendingAppointments([]);
          setTodaysAppointments([]);
          setCompletedAppointments([]);
          setLoading(false);
          return;
        }

        const raw = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const today = new Date();

        const enriched = await Promise.all(raw.map(async (a) => {
          let avatar = "/image/img_avatar_placeholder.png";
          let name = a.name;
          let email = "";

          if (a.userId) {
            try {
              const pub = await getDoc(doc(db, "public_profiles", a.userId));
              if (pub.exists()) {
                const profile = pub.data();
                avatar = profile.avatarUrl ?? avatar;
                name = profile.name || name;
              }
              const user = await getDoc(doc(db, "users", a.userId));
              if (user.exists()) email = user.data().email || "";
            } catch (_) {}
          }

          return { ...a, avatar, name, email, time: a.time };
        }));

        const pending = enriched
          .filter((a) => a.status === "Pending")
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(a.date);
            const dateB = b.date?.toDate?.() || new Date(b.date);

            // First sort by date
            const dateCompare = dateA - dateB;
            if (dateCompare !== 0) return dateCompare;

            // If dates are the same, sort by time
            const timeA = a.time ?? "";
            const timeB = b.time ?? "";

            // Convert "HH:mm" to comparable minutes (e.g. "09:30" → 570)
            const toMinutes = (t) => {
              const [h, m] = (t || "").split(":").map(Number);
              return h * 60 + m;
            };

            return toMinutes(timeA) - toMinutes(timeB);
          });

        const todayList = enriched
          .filter((a) => {
            const dateObj = a.date?.toDate?.() || new Date(a.date);
            return isSameDay(dateObj, today) && a.status === "Confirmed";
          })
          .map((a) => ({ ...a, description: "" }));

        const completed = enriched.filter((a) =>
          ["Completed", "Denied"].includes(a.status)
        );  

        setPendingAppointments(pending);
        setTodaysAppointments(todayList);
        setCompletedAppointments(completed);
        setLoading(false);
      }
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [fetchAppointments]);

  // Toggle expanded view of appointments
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter completed appointments
  const filteredHistory = useMemo(() => {
    return completedAppointments.filter((item) => {
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      const matchesSearch = (item.bookedBy || item.name || "").toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [completedAppointments, filterStatus, searchText]);

  // Update appointment status

  // Format the date
  const formatDate = (val) => {
    if (!val) return "-";
    const d = val.toDate?.() || new Date(val);
    return d.toLocaleDateString();
  };

  // Format the time
  const formatTime = (val) => {
    if (!val) return "-";

    // If it's a string in HH:mm format, return it directly
    if (typeof val === "string" && /^\d{2}:\d{2}$/.test(val)) {
      return val;
    }

    // Otherwise, try to convert it as a Date
    const d = val instanceof Timestamp ? val.toDate() : new Date(val);
    if (d instanceof Date && !isNaN(d)) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return "-";
  };



  // Mark appointment as completed
  const handleComplete = async (appt) => {
    setLoading(true);
    try {
      await appointmentService.updateAppointmentStatus(appt.id, "Completed");
      await fetchAppointments();
    } catch (e) {
      console.error("Failed to mark appointment as completed", e);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const snapshot = await appointmentService.getAppointmentById(id);
    const appt = snapshot;
    if (!appt) return;

    if (newStatus === "Confirmed") {
      const freshConflicts = await appointmentService.getConfirmedAppointments({
        date: appt.date?.toDate?.() || new Date(appt.date),
        time: appt.time,
        clientId: appt.client?.id,
      });

      const confirmedAlready = freshConflicts.find(
        c => c.id !== appt.id && c.status === "Confirmed"
      );  

      if (confirmedAlready) {
        setToastMessage("⚠️ This time slot has just been booked by another user. Please choose a different time.");
        setTimeout(() => setToastMessage(""), 4000);
        return;
      }
    }

    // ✅ Status update (runs for both "Confirmed" and "Denied")
    await appointmentService.updateAppointmentStatus(id, newStatus);

      if (newStatus === "Confirmed") {
        const dateOnly = appt.date?.toDate?.() || new Date(appt.date);
        const conflicting = await appointmentService.getAllActiveAppointments({
          date: dateOnly,
          time: appt.time,
          clientId: appt.client?.id,
        });

        // Deny all others in the same slot
        const denyPromises = conflicting
          .filter(c => c.id !== appt.id && c.status === "Pending")
          .map(c => appointmentService.updateAppointmentStatus(c.id, "Denied"));

        await Promise.all(denyPromises);
      }
    await fetchAppointments();
  };

  // Loading state
  if (loading) return <div>Loading appointments...</div>;

  // Render JSX
  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div
          className="logo-left"
          onClick={() => navigate("/client/dashboard")}
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
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "#b0b3a860",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            {pendingAppointments.map((user) => {
              const userDate = user.date.toDate();
              const alreadyApprovedSameSlot = pendingAppointments.some((other) => {
                if (other.id === user.id) return false;
                const otherDate = other.date.toDate();
                return (
                  otherDate.toDateString() === userDate.toDateString() &&
                  other.time === user.time &&
                  other.status === "Confirmed"
                );
              });

              return (
                <div
                  key={user.id}
                  style={{
                    backgroundColor: "#b0b3a8",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "16px",
                    minHeight: "140px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "14px", cursor: "pointer" }}
                    onClick={() => toggleExpand(user.id)}
                  >
                    <img
                      src={
                        user.avatar && user.avatar.startsWith("http")
                          ? user.avatar
                          : "/image/default.png"
                      }
                      alt="avatar"
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%" }}
                    />
                    <span>{user.bookedBy || user.name}</span>
                  </div>

                  {expandedId === user.id && (
                    <div style={{ marginTop: "10px" }}>
                      <p>
                        <strong>Date:</strong> {formatDate(user.date)}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(user.time) || "-"}
                      </p>
                      <p>
                        <strong>Note:</strong> {user.note || user.notes || "-"}
                      </p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button
                          className="confirm-btn"
                          style={{ backgroundColor: "#7a9cc6", color: "black" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(user.id, "Confirmed");
                          }}
                          disabled={alreadyApprovedSameSlot}
                        >
                          ✅ Approve
                        </button>

                        <button
                          className="confirm-btn"
                          style={{ backgroundColor: "#e06d6d", color: "black" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(user.id, "Denied");
                          }}
                          disabled={alreadyApprovedSameSlot}
                        >
                          ❌ Deny
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                {/* <textarea
                  rows="2"
                  value={appt.description}
                  onChange={(e) => {
                    const desc = e.target.value;
                    setTodaysAppointments((prev) =>
                      prev.map((a) => a.id === appt.id ? { ...a, description: desc } : a)
                    );
                  }} */}
                  {/* // style={{ width: "100%", borderRadius: "8px", marginTop: "8px", padding: "6px", backgroundColor: "transparent", border: "1px solid #555", fontFamily: "monospace" }}
                  // placeholder="Add completion note (optional)..." */}
                {/* /> */}
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
          <div style={{ marginBottom: "10px", backgroundColor: "transparent" }}>
            <label>
              <strong>Filter by status:</strong>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} 
              style={{ marginLeft: "0px",
                padding: "4px",
                backgroundColor: "transparent",  
                border: "1px solid #555",
                borderRadius: "6px",
                fontFamily: "monospace" 
                }}>
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Denied">Denied</option>
              </select>
            </label>
            <br />
            <label>
              <strong>Search by name:</strong>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Enter name..." style={{ width: "100%", marginTop: "6px", padding: "6px", borderRadius: "6px", backgroundColor: "transparent", border: "1px solid #555", fontFamily: "monospace" }} />
            </label>
            <button onClick={() => { setFilterStatus("All"); setSearchText(""); }} style={{ marginTop: "10px", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", backgroundColor: "transparent", order: "1px solid #555", fontFamily: "monospace"}}>Clear Filters</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", background: "#b0b3a860", borderRadius: "12px", padding: "12px" }}>
            {filteredHistory
              .filter((item) => (item.bookedBy || item.name || "").toLowerCase().includes(searchText.toLowerCase()))
              .map((item) => (
                <div
                key={item.id}
                style={{
                  backgroundColor: {
                    Completed: "#d1ecf1",  // light blue
                    Denied: "#f8d7da",     // light red
                    Pending: "#fff3cd",    // light yellow
                  }[item.status] || "#b0b3a8",  // fallback color
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px",
                  minHeight: "140px",
                  fontFamily: "monospace"
                }}
              >
                  <p><strong>Date:</strong> {formatDate(item.date)}</p>
                  <p><strong>Time:</strong> {formatTime(item.time)}</p>
                  <p><strong>User:</strong> {item.bookedBy || item.name}</p>
                  <p><strong>Note:</strong> {item.note}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      {toastMessage && (
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "16px 20px",
        borderRadius: "12px",
        border: "1px solid #f5c6cb",
        fontFamily: "monospace",
        fontSize: "14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "320px"
      }}>
        <span>⚠️</span>
        <span>{toastMessage}</span>
      </div>
    )}
    </div>
  );
};

export default ClientAppointment;
