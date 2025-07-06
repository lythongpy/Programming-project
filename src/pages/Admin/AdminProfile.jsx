import React, { useState, useEffect } from "react";
import ClientMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import authService from "../../services/AuthService";


const AdminProfile = () => {
  const navigate = useNavigate();
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
    avatarUrl: "",
  });
  const [uploadPreview, setUploadPreview] = useState(null);

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#CFC9C9",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    fontFamily: "monospace",
    cursor: "pointer",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = authService.getCurrentUserId();
      if (!uid) return;
      const profileRef = doc(db, "client_profiles", uid);
      const userRef = doc(db, "users", uid);
      const [profileSnap, userSnap] = await Promise.all([
        getDoc(profileRef),
        getDoc(userRef),
      ]);

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
        confirmPassword: "",
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

      const privateData = {
        ...form,
        name: fullName,
        updatedAt: new Date(),
      };

      const publicData = {
        name: fullName,
        gender: form.gender,
        description: form.description,
        ...(form.avatarUrl && { avatarUrl: form.avatarUrl }),
      };

      await setDoc(doc(db, "client_profiles", uid), privateData);
      await setDoc(doc(db, "public_profiles", uid), publicData);
      await setDoc(doc(db, "users", uid), {
        name: fullName,
        email: form.email,
        role: "admin",
        updatedAt: new Date(),
      });

      if (form.newPassword) {
        await updatePassword(user, form.newPassword);
        alert("✅ Password updated successfully.");
      }

      alert("✅ Profile saved!");
      setInitialForm({ ...form });
      setIsEditing(false);
      setShowAuthModal(false);
      setAuthPassword("");
    } catch (error) {
      console.error("❌ Reauthentication failed", error);
      alert("❌ Reauthentication failed. Please check your password.");
    }
  };

  const handleCancelEdit = () => {
    if (initialForm) {
      setForm({ ...initialForm, newPassword: "", confirmPassword: "" });
      setUploadPreview(null);
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
    setUploadPreview(URL.createObjectURL(file));
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div className="logo-left" onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }}>
          <img src="/image/img_logo.svg" alt="Logo" />
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <ClientMenu />
      </div>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>
          <div style={{ backgroundColor: "#b0b3a8", borderRadius: "40px", padding: "40px", width: "500px", textAlign: "center" }}>
            <img
              src={uploadPreview || form.avatarUrl || "/image/avatar_placeholder.png"}
              alt="Avatar"
              style={{ width: "300px", height: "300px", borderRadius: "50%", objectFit: "cover", marginBottom: "16px" }}
            />
            {/*isEditing && (
              <>
                <input type="file" accept="image/*" onChange={handleUpload} />
                <p style={{ fontSize: "0.85rem" }}>🔁 Upload a new profile picture</p>
              </>
            )*/}
            <h2 style={{ fontFamily: "monospace", fontSize: "2rem", marginTop: "16px" }}>{form.name}</h2>
          </div>

          <div style={{ backgroundColor: "#b0b3a8", borderRadius: "40px", padding: "40px", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
              {isEditing ? (
                <>
                  <button onClick={handleCancelEdit} style={buttonStyle}>Cancel</button>
                  <button onClick={handleToggleEdit} style={buttonStyle}>💾 Save</button>
                </>
              ) : (
                <button onClick={handleToggleEdit} style={buttonStyle}>✏️ Edit</button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <FormRow label="First name" name="firstName" value={form.firstName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Last name" name="lastName" value={form.lastName} editable={isEditing} onChange={handleChange} />
              <FormRow label="Middle name" name="middleName" value={form.middleName} editable={isEditing} onChange={handleChange} />
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
                rows={5}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  padding: "12px",
                  fontFamily: "monospace",
                  fontSize: "1.2rem",
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
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0, 0, 0, 0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div style={{ backgroundColor: "#B0B3A8", padding: "32px", borderRadius: "20px", width: "400px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>🔐 Confirm your password</h3>
            <input
              type="password"
              placeholder="Enter your current password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={{
                backgroundColor: "#CFC9C9",
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "1rem",
                marginBottom: "20px",
                border: "1px solid gray"
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowAuthModal(false)} style={buttonStyle}>Cancel</button>
              <button onClick={handleAuthConfirm} style={buttonStyle}>Confirm</button>
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
          width: "100%", padding: "10px",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: "1.2rem",
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
        style={{
          width: "100%", padding: "10px",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: "1.2rem",
          backgroundColor: editable ? "#e0dede" : "#d9d9d9",
          border: "none"
        }}
      />
    )}
  </div>
);

export default AdminProfile;
