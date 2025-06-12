import React from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

const barData = [
  { name: "Jan", clients: 4 },
  { name: "Feb", clients: 6 },
  { name: "Mar", clients: 8 },
  { name: "Apr", clients: 5 },
  { name: "May", clients: 9 },
  { name: "Jun", clients: 7 }
];

const lineData = [
  { name: "Mon", users: 20 },
  { name: "Tue", users: 35 },
  { name: "Wed", users: 25 },
  { name: "Thu", users: 40 },
  { name: "Fri", users: 30 },
  { name: "Sat", users: 10 },
  { name: "Sun", users: 5 }
];

const pieData = [
  { name: "Total Income", value: 450 },
  { name: "Client Revenue", value: 280 },
  { name: "User Revenue", value: 170 }
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const AdminHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-homepage">
      {/* Header */}
      <div className="logo-box">
        <div
          className="logo-left"
          onClick={() => navigate("/admin/homepage")}
          style={{ cursor: "pointer" }}
        >
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <AdminMenu />
      </div>

      {/* Chart Section */}
      <section style={{ padding: "40px", textAlign: "center", fontFamily: "monospace" }}>
        <h2 style={{ marginBottom: "40px" }}>Admin Dashboard</h2>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "60px",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          {/* Bar Chart - Client Count */}
          <BarChart width={520} height={370} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="clients" fill="#8884d8" />
          </BarChart>

          {/* Line Chart - User Activity */}
          <LineChart width={520} height={370} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#ff7300" />
          </LineChart>

          {/* Pie Chart - Income */}
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
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

export default AdminHomepage;
