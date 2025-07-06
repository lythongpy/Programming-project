import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import "../../styles/AdminMenu.css";
import { getAuth } from "firebase/auth";
import AdminService from "../../services/AdminService";


const roleColors = {
  user: "#5bc0de",
  client: "#5cb85c",
  admin: "#f0ad4e",
};

const roleOrder = {
  client: 0,
  user: 1,
  admin: 2,
};

const AdminAccount = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [editModalUser, setEditModalUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAllUsersRealtime((userList) => {
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      const list = await authService.getAllUsers();
      setUsers(list);
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCancel = () => {
    setEditModalUser(null);
  };

  const handleSave = async () => {
    if (!editModalUser?.id) return console.error("Missing user ID");

    try {
      await authService.updateUserProfile(editModalUser.id, {
        name: editModalUser.name,
        email: editModalUser.email,
        role: editModalUser.role,
      });
      await fetchUsers();
      alert("✅ User updated successfully!");
      setEditModalUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      alert("Please sign in as an admin.");
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) {
      alert("User not found.");
      return;
    }

    try {
      await AdminService.deleteUserOrClient(userId, targetUser.role);
      alert("✅ User and associated appointments cleaned up.");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      alert("Failed to delete user: " + err.message);
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchText.toLowerCase()) &&
        (roleFilter ? user.role === roleFilter : true)
    )
    .sort((a, b) => {
      const orderA = roleOrder[a.role] ?? 99;
      const orderB = roleOrder[b.role] ?? 99;
      return orderA === orderB ? a.name.localeCompare(b.name) : orderA - orderB;
    });

  return (
    <div style={{ backgroundColor: "#f4f1e8", minHeight: "100vh" }}>
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

      <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "monospace" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "1.8rem", color: "#333" }}>
          All Accounts
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: "1",
              minWidth: "220px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor: "transparent",
            }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              width: "200px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor: "transparent",
            }}
          >
            <option value="">All Roles</option>
            <option value="client">client</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => toggleExpand(user.id)}
            className="user-card fade-slide-up"
            style={{
              backgroundColor: "#b0b3a8",
              borderRadius: "16px",
              display: "flex",
              alignItems: "flex-start",
              padding: "16px",
              marginBottom: "16px",
              cursor: "pointer",
              boxShadow: expandedId === user.id ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
            }}
          >
            <img
              src={
                user.avatar && user.avatar.trim() !== ""
                  ? `/image/${user.avatar}`
                  : "/image/default.png"
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image/default.png";
              }}
              alt="avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginRight: "16px",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontWeight: "bold", margin: 0, fontSize: "1.1rem" }}>{user.name}</p>
                <span
                  style={{
                    backgroundColor: roleColors[user.role] || "#aaa",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {user.role || "user"}
                </span>
              </div>

              {expandedId === user.id && (
                <div style={{ marginTop: "12px", fontSize: "0.95rem", lineHeight: "1.5" }}>
                  <p><strong>Email:</strong> {user.email || "N/A"}</p>
                  {user.note && (
                    <div style={{
                      backgroundColor: "#f4f4f4",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}>
                      <strong>Note:</strong> {user.note}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }} 
                    style={{
                    ...btn("#e60000"),
                    padding: "6px 16px",      
                    fontSize: "0.9rem",       
                    width: "fit-content",
                    marginLeft: "auto"        
                  }}
                   >🗑️ Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editModalUser && (
        <div className="fade-in" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "10px",
            minWidth: "320px",
            width: "90%",
            maxWidth: "400px"
          }}>
            <h3>Edit User</h3>
            <div style={{ marginBottom: "12px" }}>
              <label><strong>Name:</strong></label><br />
              <input
                value={editModalUser.name}
                onChange={(e) => setEditModalUser({ ...editModalUser, name: e.target.value })}
                style={{ width: "100%", padding: "6px" }}
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label><strong>Email:</strong></label><br />
              <input
                value={editModalUser.email}
                onChange={(e) => setEditModalUser({ ...editModalUser, email: e.target.value })}
                style={{ width: "100%", padding: "6px" }}
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label><strong>Role:</strong></label><br />
              <select
                value={editModalUser.role}
                onChange={(e) => setEditModalUser({ ...editModalUser, role: e.target.value })}
                style={{ width: "100%", padding: "6px" }}
              >
                <option value="client">client</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button onClick={handleCancel} style={btn("#aaa")}>❌ Cancel</button>
              <button onClick={handleSave} style={btn("#5cb85c")}>💾 Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const btn = (color) => ({
  backgroundColor: color,
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
});

export default AdminAccount;