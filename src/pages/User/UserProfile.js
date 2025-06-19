import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../../components/UserMenu";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  updateDoc
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import authService from "../../services/AuthService";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import "../../styles/homepage.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({
    name: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    phone: "",
    email: "",
    description: "",
    newPassword: "",
    confirmPassword: "",
    avatarUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = authService.getCurrentUserId();
      if (!uid) return;
      const profileRef = doc(db, "user_profiles", uid);
      const userRef = doc(db, "users", uid);
      const [profileSnap, userSnap] = await Promise.all([getDoc(profileRef), getDoc(userRef)]);

      let profileData = {};
      let userData = {};
      if (profileSnap.exists()) profileData = profileSnap.data();
      if (userSnap.exists()) userData = userSnap.data();

      const fullName = userData.name || profileData.name || "";
      const parts = fullName.trim().split(" ");
      const firstName = parts.pop() || "";
      const lastName = parts.shift() || "";
      const middleName = parts.join(" ");

      const fullForm = {
        ...form,
        ...profileData,
        name: fullName,
        firstName,
        lastName,
        middleName,
        email: userData.email || "",
        newPassword: "",
        confirmPassword: ""
      };

      setForm(fullForm);
      setInitialForm(fullForm);
    };
    fetchProfile();
  }, []);

  const handleToggleEdit = () => {
    if (isEditing) {
      if (form.newPassword || form.confirmPassword) {
        if (form.newPassword !== form.confirmPassword) {
          alert("New password and confirm password do not match.");
          return;
        }
      }
      setShowAuthModal(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleAuthConfirm = async () => {
    const user = authService.getCurrentUser();
    const credential = EmailAuthProvider.credential(user.email, authPassword);

    try {
      await reauthenticateWithCredential(user, credential);

      const uid = user.uid;
      const fullName = `${form.lastName} ${form.middleName} ${form.firstName}`.trim();

      const {
        newPassword,
        confirmPassword,
        ...safeForm
      } = form;

      const privateData = {
        ...safeForm,
        name: fullName,
        updatedAt: new Date()
      };

      const publicData = {
        name: fullName,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        ...(form.avatarUrl && { avatarUrl: form.avatarUrl })
      };

      // ✅ Update user profile collections
      await Promise.all([
        setDoc(doc(db, "user_profiles", uid), privateData),
        setDoc(doc(db, "public_profiles", uid), publicData),
        setDoc(doc(db, "users", uid), { name: fullName }, { merge: true }),
      ]);

      // ✅ Update name in all appointments
      const apptSnapshot = await getDocs(query(collection(db, "appointments"), where("userId", "==", uid)));
      for (const docSnap of apptSnapshot.docs) {
        await updateDoc(doc(db, "appointments", docSnap.id), {
          "user.name": fullName
        });
      }

      const clientSnapshot = await getDocs(query(collection(db, "appointments"), where("client.id", "==", uid)));
      for (const docSnap of clientSnapshot.docs) {
        await updateDoc(doc(db, "appointments", docSnap.id), {
          "client.name": fullName
        });
      }

      // ✅ Update password if requested
      if (newPassword) {
        await updatePassword(user, newPassword);
        alert("Password updated successfully.");
      }

      alert("Profile saved!");
      setInitialForm({ ...form, newPassword: "", confirmPassword: "" });
      setIsEditing(false);
      setShowAuthModal(false);
      setAuthPassword("");

    } catch (error) {
      console.error("Reauthentication failed", error);
      alert("Reauthentication failed. Please check your password.");
    }
  };

  const handleCancelEdit = () => {
    if (initialForm) {
      setForm({ ...initialForm, newPassword: "", confirmPassword: "" });
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uid = authService.getCurrentUserId();
    const storageRef = ref(storage, `avatars/${uid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setForm((prev) => ({ ...prev, avatarUrl: url }));
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div className="logo-left">
          <Link to="/user/dashboard" className="login-logo-link">
            <img src="/image/img_logo.svg" alt="Logo" className="login-logo" />
          </Link>
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <UserMenu />
      </div>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>
          <div style={{ backgroundColor: "#b0b3a8", borderRadius: "40px", padding: "40px", width: "500px", textAlign: "center" }}>
            <img
              src={form.avatarUrl || "/image/avatar_placeholder.png"}
              alt="Avatar"
              style={{ width: "400px", height: "400px", borderRadius: "50%", objectFit: "cover", marginBottom: "16px" }}
            />
            {isEditing && (
              <div>
                <input type="file" accept="image/*" onChange={handleUpload} />
              </div>
            )}
            <h2 style={{ fontFamily: "monospace", fontSize: "2rem", marginTop: "16px" }}>{form.name}</h2>
          </div>

          <div style={{ backgroundColor: "#b0b3a8", borderRadius: "40px", padding: "40px", flex: 1 }}>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              {isEditing ? (
                <>
                  <button onClick={handleCancelEdit} style={{ marginRight: "10px" }}>Cancel</button>
                  <button onClick={handleToggleEdit}>💾 Save</button>
                </>
              ) : (
                <button onClick={handleToggleEdit}>✏️ Edit</button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <FormRow label="First name" name="firstName" value={form.firstName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Last name" name="lastName" value={form.lastName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Middle name (optional)" name="middleName" value={form.middleName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Gender" name="gender" value={form.gender} editable={isEditing} onChange={handleChange} type="select" options={["Male", "Female", "Other"]} />
              <FormRow label="Phone number" name="phone" value={form.phone} editable={isEditing} onChange={handleChange} />
              <FormRow label="Email" name="email" value={form.email} editable={false} onChange={handleChange} />
              <FormRow label="New Password" name="newPassword" type="password" value={form.newPassword} editable={isEditing} onChange={handleChange} />
              <FormRow label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} editable={isEditing} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>Description:</label><br />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={6}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  padding: "16px",
                  fontFamily: "monospace",
                  fontSize: "1.5rem",
                  backgroundColor: isEditing ? "#e0dede" : "#d9d9d9",
                  border: "none",
                  marginTop: "10px"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "20px",
              width: "400px",
              fontFamily: "monospace"
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>🔐 Confirm your password</h3>
            <input
              type="password"
              placeholder="Enter your current password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "1rem",
                marginBottom: "20px",
                border: "1px solid gray"
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowAuthModal(false)}
                style={{
                    backgroundColor: "#ccc",       // light gray
                    color: "#333",                 // text color
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
                >Cancel</button>
              <button onClick={handleAuthConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormRow = ({ label, name, value, editable, onChange, type = "text", options = [] }) => (
  <div>
    <label style={{ fontWeight: "bold" }}>{label}</label><br />
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editable}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "16px",
          fontFamily: "monospace",
          fontSize: "1.3rem",
          backgroundColor: editable ? "#e0dede" : "#d9d9d9",
          border: "none"
        }}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editable}
        autoComplete="new-password"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "16px",
          fontFamily: "monospace",
          fontSize: "1.3rem",
          backgroundColor: editable ? "#e0dede" : "#d9d9d9",
          border: "none"
        }}
      />
    )}
  </div>
);

export default UserProfile;
