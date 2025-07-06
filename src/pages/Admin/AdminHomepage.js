import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminMenu.css";

const STATUS_COLORS = {
  Confirmed: "#5cb85c",
  Completed: "#0275d8",
  Denied: "#d9534f"
};

const AdminHomepage = () => {
  const [lineData, setLineData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [appointmentStatusData, setAppointmentStatusData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      if (!active) return;
      const userCounts = Array(12).fill(0);
      const clientCounts = Array(12).fill(0);
      let totalUser = 0;
      let totalClient = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.();

        if (createdAt && data.role) {
          const month = createdAt.getMonth();
          const role = data.role.toLowerCase();
          if (role === "user") {
            userCounts[month]++;
            totalUser++;
          } else if (role === "client") {
            clientCounts[month]++;
            totalClient++;
          }
        }
      });

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const data = months.map((m, i) => ({
        name: m,
        users: userCounts[i],
        clients: clientCounts[i],
      }));

      setLineData(data);
      setTotalUsers(totalUser);
      setTotalClients(totalClient);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      if (!active) return;
      let confirmed = 0;
      let completed = 0;
      let denied = 0;

      snapshot.forEach((doc) => {
        const status = doc.data().status;
        if (status === "Confirmed") confirmed++;
        else if (status === "Completed") completed++;
        else if (status === "Denied") denied++;
      });

      setAppointmentStatusData([
        { name: "Confirmed", value: confirmed },
        { name: "Completed", value: completed },
        { name: "Denied", value: denied },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ backgroundColor: "#f4f1e8", minHeight: "100vh" }}>
      {/* Header */}
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

      {/* Dashboard Content */}
      <section
  style={{
    padding: "40px",
    fontFamily: "monospace",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f1e8"
  }}
>
  <h2 style={{ marginBottom: "24px" }}>Dashboard</h2>

  <div
    style={{
      backgroundColor: "#f4f1e8",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      display: "flex",
      flexWrap: "wrap",
      gap: "40px",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "1200px",
      width: "100%",
    }}
  >
    {/* Line Chart Section */}
    <div style={{ minWidth: "550px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "12px" }}>
        <span style={{ color: "#ff7300" }}><strong>Users:</strong> {totalUsers}</span>
        <span style={{ color: "#8884d8" }}><strong>Clients:</strong> {totalClients}</span>
      </div>
      <LineChart width={500} height={320} data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#ff7300" />
        <Line type="monotone" dataKey="clients" stroke="#8884d8" />
      </LineChart>
    </div>

    {/* Pie Chart Section */}
    <div style={{ minWidth: "400px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "12px" }}>
        <span style={{ color: "#5cb85c" }}><strong>Confirmed:</strong> {appointmentStatusData.find(d => d.name === "Confirmed")?.value || 0}</span>
        <span style={{ color: "#0275d8" }}><strong>Completed:</strong> {appointmentStatusData.find(d => d.name === "Completed")?.value || 0}</span>
        <span style={{ color: "#d9534f" }}><strong>Denied:</strong> {appointmentStatusData.find(d => d.name === "Denied")?.value || 0}</span>
      </div>
      <PieChart width={360} height={360}>
        <Pie
          data={appointmentStatusData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          label
        >
          {appointmentStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  </div>
</section>

    </div>
  );
};

export default AdminHomepage;
