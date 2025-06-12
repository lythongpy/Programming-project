import React, { useEffect, useState } from "react";
import ClientMenu from "../../components/ClientMenu";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await authService.getAllUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="main-homepage">
      {/* Header */}
      <div className="logo-box">
        <div className="logo-left" onClick={() => navigate("/client/homepage")} style={{ cursor: "pointer" }}>
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      {/* User List */}
      <div style={{ padding: "40px", fontFamily: "monospace" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>User List</h2>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {users.length === 0 && <div>No users found.</div>}
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/client/user/${user.id}`)}
              style={{
                backgroundColor: "#b0b3a8",
                padding: "24px",
                borderRadius: "16px",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "1.2rem",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {user.name}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default UserList;
