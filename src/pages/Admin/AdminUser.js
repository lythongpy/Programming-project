import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";

const AdminUser = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = await authService.getAllUsers();
        setUsers(list);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#f4f1e8", minHeight: "100vh" }}>
      {/* Header */}
      <div className="main-homepage">
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
      </div>

      {/* Main Section */}
      <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "monospace" }}>
        <h2 style={{ marginBottom: "16px" }}>All User Bookings</h2>

        <input
          type="text"
          placeholder="Search users by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "24px",
            fontSize: "1rem"
          }}
        />

        {/* User cards */}
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => toggleExpand(user.id)}
            style={{
              backgroundColor: "#b0b3a8",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              padding: "14px",
              marginBottom: "16px",
              cursor: "pointer",
            }}
          >
            <img
              src={user.avatar || "/image/img_gbao_3.png"}
              alt="avatar"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                marginRight: "16px"
              }}
            />
            <div>
              <p style={{ fontWeight: "bold", margin: 0 }}>{user.name}</p>
              {expandedId === user.id && (
                <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                  <p><strong>Email:</strong> {user.email || "N/A"}</p>
                  <p><strong>Role:</strong> {user.role || "user"}</p>
                  {user.note && (
                    <div
                      style={{
                        backgroundColor: "#f4f4f4",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        marginTop: "8px"
                      }}
                    >
                      <strong>Note:</strong> {user.note}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUser;
