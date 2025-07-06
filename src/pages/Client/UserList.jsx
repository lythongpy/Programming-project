import React, { useEffect, useState } from "react";
import ClientMenu from "../../components/ClientMenu";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDocs
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import authService from "../../services/AuthService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const clientId = authService.getCurrentUserId();
    if (!clientId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "appointments"),
        where("client.id", "==", clientId),
        where("status", "==", "Completed")
      ),
      async (snapshot) => {
        const userIds = [
          ...new Set(snapshot.docs.map((doc) => doc.data().userId))
        ];

        const usersSnapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "user"))
        );

        const filtered = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => userIds.includes(u.id));

        setUsers(filtered);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const unsub = onSnapshot(doc(db, "public_profiles", selectedUser.id), (snap) => {
      if (snap.exists()) {
        setPublicProfile(snap.data());
      } else {
        setPublicProfile(null);
      }
    });
    return () => unsub();
  }, [selectedUser]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const clientId = authService.getCurrentUserId();
      const apptSnap = await getDocs(
        query(
          collection(db, "appointments"),
          where("client.id", "==", clientId),
          where("userId", "==", user.id),
          where("status", "==", "Completed")
        )
      );
      setCompletedCount(apptSnap.size);
    } catch (error) {
      setCompletedCount(0);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setPublicProfile(null);
    setCompletedCount(0);
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div
          className="logo-left"
          onClick={() => (window.location.href = "/client/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      <div style={{ padding: "40px", fontFamily: "monospace" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Users List</h2>
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
              onClick={() => handleUserClick(user)}
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

      {selectedUser && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}
        onClick={closeModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "480px",
            fontFamily: "monospace"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>{selectedUser.name}'s Profile</h2>
          {publicProfile ? (
            <div style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              <p><strong>Full Name:</strong> {publicProfile.name || "-"}</p>
              <p><strong>Gender:</strong> {publicProfile.gender || "-"}</p>
              <p><strong>Phone Number:</strong> {publicProfile.phone || "-"}</p>
              <p><strong>Email:</strong> {publicProfile.email || "-"}</p>
              <p><strong>Completed Appointments:</strong> {completedCount}</p>
            </div>
          ) : (
            <p>This user has no public profile information.</p>
          )}
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button onClick={closeModal} style={{ padding: "8px 16px" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default UserList;
