import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/homepage.css";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import { useClientAnalytics } from "./ClientAnalyticsContext";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";

const COLORS = ["#8884d8", "#ffc658", "#ff5f5f"];

const ClientDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Analytics fallback
  const analytics = useClientAnalytics() || {};
  const weeklyBookings = analytics.weeklyBookings || [];
  const statusCounts = analytics.statusCounts || { confirmed: 0, pending: 0, cancelled: 0 };

  useEffect(() => {
    const fetchAppointments = async () => {
      const uid = authService.getCurrentUserId();
      if (!uid) return;
      // Use appointmentService for appointment logic
      if (appointmentService.getAppointmentsForClient) {
        const appts = await appointmentService.getAppointmentsForClient(uid);
        setAppointments(appts || []);
      } else {
        // Fallback: filter after fetching all appointments
        const appts = await appointmentService.getAllAppointments?.();
        if (appts) {
          setAppointments(appts.filter(a => a.client?.id === uid));
        } else {
          setAppointments([]);
        }
      }
    };
    fetchAppointments();
  }, []);

  const pieData = [
    { name: "Confirmed", value: statusCounts.confirmed },
    { name: "Pending", value: statusCounts.pending },
    { name: "Cancelled", value: statusCounts.cancelled }
  ];

  // Helper to get appointments for a specific date
  const getAppointmentsForDate = (targetDate) =>
    appointments.filter(
      (a) => {
        // a.date is "YYYY-MM-DD", targetDate is Date
        const [y, m, d] = a.date.split("-");
        const apptDate = new Date(y, m - 1, d);
        return apptDate.toDateString() === targetDate.toDateString();
      }
    );

  return (
    <div className="main-homepage">
      {/* Header */}
      <div className="logo-box">
        <div className="logo-left" style={{ cursor: "pointer" }} onClick={() => navigate("/client/homepage")}>
          <img src="/image/img_logo.svg" alt="Logo" width={40} />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      {/* Calendar and Detail Panel */}
      <section className="calendar-page-content" style={{ marginTop: "40px", padding: "0 40px" }}>
        <h2>Client Calendar</h2>

        <button
          className="confirm-btn"
          style={{ margin: "12px 0" }}
          onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
        >
          Switch to {viewMode === "month" ? "Week View" : "Month View"}
        </button>

        <div style={{
          display: "flex",
          gap: "40px",
          alignItems: "stretch",
          minHeight: "400px"
        }}>
          {/* Calendar */}
          <div style={{ flex: "1", background: "#ece7dc", padding: "20px", borderRadius: "10px", height: "100%", width: "1300px" }}>
            {viewMode === "month" ? (
              <Calendar
                onChange={setDate}
                value={date}
                className="calendar-box"
                tileContent={({ date: d, view }) => {
                  // d is Date
                  const hasEvent = appointments.some(a => {
                    const [y, m, dd] = a.date.split("-");
                    const apptDate = new Date(y, m - 1, dd);
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
                      <th key={i} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{d}</th>
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
                            background: isSelected ? "#d0d0d0" : "transparent"
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
                                  fontSize: "0.85rem"
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

          {/* Appointment Detail Box */}
          <div style={{
            flex: "1",
            backgroundColor: "#b0b3a8",
            borderRadius: "12px",
            padding: "24px",
            fontFamily: "Roboto Mono, monospace",
            height: "620px",
            overflowY: "auto"
          }}>
            <h3>Details for {date.toDateString()}</h3>
            {getAppointmentsForDate(date).length > 0 ? (
              [...getAppointmentsForDate(date)]
                .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`))
                .map((a, idx) => (
                  <div key={idx} style={{
                    backgroundColor: "#e1e1e1",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px"
                  }}>
                    <strong>Time:</strong> {a.time}<br />
                    <strong>From:</strong> {a.bookedBy || a.user || "Unknown"}<br />
                    <strong>Note:</strong> {a.note || "-"}
                  </div>
                ))
            ) : (
              <p>No appointments on this day.</p>
            )}
          </div>
        </div>
      </section>

      <hr style={{
        border: "none",
        borderTop: "2px solid black",
        margin: "60px auto",
        width: "90%"
      }} />

      {/* Charts Section */}
      <section style={{ marginTop: "60px", padding: "32px" }}>
        <h2 style={{ textAlign: "center" }}>Live Booking Analytics</h2>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Bar Chart */}
          <BarChart width={480} height={350} data={weeklyBookings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>

          {/* Line Chart */}
          <LineChart width={480} height={350} data={weeklyBookings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ff7300" />
          </LineChart>

          {/* Pie Chart */}
          <PieChart width={360} height={360}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;