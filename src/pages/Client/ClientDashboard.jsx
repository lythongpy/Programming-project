import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/homepage.css";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";

const ClientDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [appointments, setAppointments] = useState([]);
  const [compareType, setCompareType] = useState("monthly");
  const [statusSummary, setStatusSummary] = useState({ completed: 0, denied: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const uid = authService.getCurrentUserId();
    if (!uid) return;

    const unsubscribe = appointmentService.subscribeToAppointmentsForClient(uid, (appts) => {
      setAppointments(appts);

      const summary = { completed: 0, denied: 0 };

      appts.forEach((appt) => {
        const status = appt.status?.toLowerCase();
        if (status === "completed") summary.completed++;
        if (status === "denied") summary.denied++;
      });

      setStatusSummary(summary);
    });

    return () => unsubscribe();
  }, []);

  const getAppointmentsForDate = (targetDate) =>
    appointments.filter((a) => {
      if (a.status?.toLowerCase() !== "confirmed") return false;
      let apptDate;
      if (typeof a.date === "string") {
        const [y, m, d] = a.date.split("-");
        apptDate = new Date(y, m - 1, d);
      } else if (a.date?.toDate) {
        apptDate = a.date.toDate();
      } else {
        apptDate = new Date(a.date);
      }
      return apptDate.toDateString() === targetDate.toDateString();
    });


const generateChartData = (appointments, mode) => {
  const dataMap = {};

  appointments.forEach((appt) => {
    const status = appt.status?.toLowerCase();
    if (!["completed", "denied"].includes(status)) return;

    const date = appt.date?.toDate?.() || new Date(appt.date);
    let label;
    let sortKey;

    if (mode === "monthly") {
      const month = date.getMonth(); // 0 = Jan, 6 = July
      label = date.toLocaleString("default", { month: "long" });
      sortKey = `${date.getFullYear()}-${month}`;
    } else if (mode === "weekly") {
      const weekNum = Math.ceil(date.getDate() / 7);
      const month = date.toLocaleString("default", { month: "short" });
      label = `Week ${weekNum} (${month})`;
      sortKey = `${date.getFullYear()}-${date.getMonth()}-${weekNum}`;
    }

    if (!dataMap[sortKey]) {
      dataMap[sortKey] = { label, completed: 0, denied: 0, sortKey };
    }

    dataMap[sortKey][status]++;
  });

  return Object.values(dataMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
};

const chartData = generateChartData(appointments, compareType);

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div
          className="logo-left"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/client/dashboard")}
        >
          <img src="/image/img_logo.svg" alt="Logo" width={40} />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      {/* Calendar Section */}
      <section className="calendar-page-content" style={{ marginTop: "40px", padding: "0 40px" }}>
        <h2>Client Calendar</h2>
        <button
          className="confirm-btn"
          style={{ margin: "12px 0" }}
          onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
        >
          Switch to {viewMode === "month" ? "Week View" : "Month View"}
        </button>

        <div style={{ display: "flex", gap: "40px", alignItems: "stretch", minHeight: "400px" }}>
          {/* Calendar */}
          <div style={{ flex: "1", background: "#ece7dc", padding: "20px", borderRadius: "10px" }}>
            {viewMode === "month" ? (
              <Calendar
                onChange={setDate}
                value={date}
                className="calendar-box"
                tileContent={({ date: d, view }) => {
                  const hasEvent = appointments.some((a) => {
                    if (a.status?.toLowerCase() !== "confirmed") return false;
                    let apptDate;
                    if (typeof a.date === "string") {
                      const [y, m, dd] = a.date.split("-");
                      apptDate = new Date(y, m - 1, dd);
                    } else if (a.date?.toDate) {
                      apptDate = a.date.toDate();
                    } else {
                      apptDate = new Date(a.date);
                    }
                    return apptDate.toDateString() === d.toDateString();
                  });

                  return view === "month" && hasEvent ? (
                    <div style={{ textAlign: "center", color: "green", fontSize: "1.2rem" }}>•</div>
                  ) : null;
                }}
              />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                      <th key={i} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Array.from({ length: 7 }).map((_, dayOffset) => {
                      const day = new Date(date);
                      day.setDate(date.getDate() - date.getDay() + dayOffset);
                      const isSelected = day.toDateString() === date.toDateString();
                      return (
                        <td
                          key={dayOffset}
                          onClick={() => setDate(new Date(day))}
                          style={{
                            verticalAlign: "top",
                            padding: "10px",
                            height: "120px",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                            background: isSelected ? "#d0d0d0" : "transparent",
                          }}
                        >
                          <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                            {day.getDate()} / {day.getMonth() + 1}
                          </div>
                          {getAppointmentsForDate(day)
                            .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`))
                            .map((event, i) => (
                              <div
                                key={i}
                                style={{
                                  backgroundColor: "#34a853",
                                  color: "#fff",
                                  borderRadius: "6px",
                                  marginBottom: "6px",
                                  padding: "4px 8px",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {event.time} – {event.bookedBy || event.user || "Unknown"}
                              </div>
                            ))}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Appointment Details */}
          <div
            style={{
              flex: "1",
              backgroundColor: "#b0b3a8",
              borderRadius: "12px",
              padding: "24px",
              fontFamily: "Roboto Mono, monospace",
              height: "620px",
              overflowY: "auto",
            }}
          >
            <h3>Details for {date.toDateString()}</h3>
            {getAppointmentsForDate(date).length > 0 ? (
              [...getAppointmentsForDate(date)]
                .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`))
                .map((a, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#e1e1e1",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <strong>Time:</strong> {a.time}
                    <br />
                    <strong>From:</strong> {a.bookedBy || a.user || "Unknown"}
                    <br />
                    <strong>Note:</strong> {a.note || "-"}
                  </div>
                ))
            ) : (
              <p>No appointments on this day.</p>
            )}
          </div>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "2px solid black", margin: "60px auto", width: "90%" }} />

      {/* Analytics Section */}
      <section style={{ padding: "32px" }}>
        <h2 style={{ textAlign: "center" }}>Live Booking Analytics</h2>

        {/* Status summary */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "1rem" }}>
          ✅ Completed: <strong>{statusSummary.completed}</strong> &nbsp;&nbsp;
          ❌ Denied: <strong>{statusSummary.denied}</strong>
        </div>

        {/* View Mode */}
        <div style={{ textAlign: "center", margin: "20px auto" }}>
          <select
            value={compareType}
            onChange={(e) => setCompareType(e.target.value)}
            style={{
              padding: "6px 12px",
              fontSize: "0.85rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "transparent",
              width: "160px",
              textAlign: "center",
            }}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Chart */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {chartData.length === 0 ? (
            <p style={{ fontSize: "1.2rem", fontFamily: "monospace" }}>No data available for this period.</p>
          ) : (
            <BarChart width={800} height={350} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#4caf50" />
              <Bar dataKey="denied" fill="#f44336" />
            </BarChart>
          )}
      </div>
      </section>
    </div>
  );
};

export default ClientDashboard;
