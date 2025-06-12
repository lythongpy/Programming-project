import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../../styles/homepage.css";
import UserMenu from "../../components/UserMenu";
import { FaUser, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import authService from "../../services/AuthService";
import appointmentService from "../../services/AppointmentService";

const generateTimeSlots = () => {
  const slots = [];
  const startHour = 7;
  const endHour = 16;
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 12) continue;
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);

  // Fetch appointments and clients from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = authService.getCurrentUserId();
        if (!uid) return;
        const appts = await appointmentService.getUserAppointments(uid);
        setAppointments(appts || []);
        const allClients = await authService.getAllClients();
        setClients(allClients || []);
      } catch (err) {
        setAppointments([]);
        setClients([]);
      }
    };
    fetchData();
  }, []);

  // Fetch current user profile for name
  const [currentUserName, setCurrentUserName] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      const uid = authService.getCurrentUserId();
      if (!uid) return;
      const profile = await authService.getUserProfile(uid);
      setCurrentUserName(profile?.name || "");
    };
    fetchProfile();
  }, []);

  const slots = generateTimeSlots();

  const isClientAvailable = (clientId, time) => {
    return !appointments.some(
      (appt) =>
        appt.client?.id === clientId &&
        new Date(appt.date).toDateString() === selectedDate.toDateString() &&
        appt.time === time
    );
  };

  const handleClientClick = (client) => {
    if (selectedClient?.id === client.id) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
    }
  };

  const handleTimeClick = (time) => {
    if (selectedTime === time) {
      setSelectedTime(null);
    } else {
      setSelectedTime(time);
    }
  };

  const isTimeSelectable = (time) => {
    if (!selectedClient) return true;
    return isClientAvailable(selectedClient.id, time);
  };

  const isClientSelectable = (client) => {
    if (!selectedTime) return true;
    return isClientAvailable(client.id, selectedTime);
  };

  // 1. Click a day: setSelectedDate
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // 2. Click Book: open popup for time/client selection
  const handleBookClick = () => {
    setShowPopup(true);
    setSelectedClient(null);
    setSelectedTime(null);
    setDescription("");
  };

  // 3. Continue Booking: open confirmation
  const handleContinueBooking = () => {
    setShowDescriptionPopup(true);
  };

  // 4. Confirm Booking: add to Firestore
  const handleConfirmBooking = async () => {
    if (selectedClient && selectedTime) {
      const userId = authService.getCurrentUserId();
      await appointmentService.addAppointment({
        date: selectedDate,
        client: selectedClient,
        time: selectedTime,
        note: description,
        bookedBy: currentUserName // <-- add the user's name here
      }, userId);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setShowPopup(false);
        setShowDescriptionPopup(false);
      }, 1000);
      setTimeout(() => {
        setSelectedClient(null);
        setSelectedTime(null);
        setDescription("");
      }, 1500);
      // Refresh appointments
      const appts = await appointmentService.getUserAppointments(userId);
      setAppointments(appts || []);
    }
  };

  return (
    <div className="main-homepage">
      <div className="logo-box">
        <div className="logo-left">
          <Link to="/user/dashboard" className="login-logo-link">
            <img src="/image/img_logo.svg" alt="Logo" />
          </Link>
          <span className="navbar-title">Appointment Scheduler</span>
        </div>
        <UserMenu />
      </div>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Book Appointment</h2>
        <Calendar
          value={selectedDate}
          onChange={handleDayClick}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="confirm-btn" onClick={handleBookClick}>Book</button>
        </div>

        {showPopup && (
          <div
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => setShowPopup(false)}
          >
            <div
              style={{ backgroundColor: "#f4f1e8", padding: "30px", borderRadius: "20px", width: "90%", maxWidth: "1200px", height: "90%", maxHeight: "1000px", display: "flex", flexDirection: "column" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "flex-start", flex: 1, overflow: "hidden" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Time</h3>
                  <div style={{ background: "#dcdad3", padding: "10px", borderRadius: "16px", height: "620px", overflowY: "scroll" }}>
                    {slots.map((time) => {
                      const isSelected = selectedTime === time;
                      const isDisabled = !isTimeSelectable(time);
                      return (
                        <div key={time} onClick={() => !isDisabled && handleTimeClick(time)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 16px", marginBottom: "12px", borderRadius: "16px", backgroundColor: isSelected ? "#7eb9b6" : isDisabled ? "#c0c0c0" : "#b2c7d9", cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1 }}>
                          <FaClock size={20} /> <strong>{time}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ width: "2px", backgroundColor: "black", height: "100%", margin: "0 10px" }} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Client</h3>
                  <div style={{ background: "#dcdad3", padding: "10px", borderRadius: "16px", height: "620px", overflowY: "scroll" }}>
                    {clients.map((client) => {
                      const isSelected = selectedClient?.id === client.id;
                      const isDisabled = !isClientSelectable(client);
                      return (
                        <div key={client.id}>
                          <div onClick={() => { if (!isDisabled) { handleClientClick(client); setExpandedClientId(expandedClientId === client.id ? null : client.id); } }} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 16px", marginBottom: "12px", borderRadius: "16px", backgroundColor: isSelected ? "#7eb9b6" : isDisabled ? "#c0c0c0" : "#d2b9d9", cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <FaUser size={40} />
                                <strong>{client.name}</strong>
                              </div>
                              <span style={{ fontSize: "1.5rem" }}>{expandedClientId === client.id ? "▲" : "▼"}</span>
                            </div>
                            {expandedClientId === client.id && (
                              <div style={{ marginTop: "10px", backgroundColor: "#eee", borderRadius: "12px", padding: "10px", fontSize: "0.9rem" }}>
                                <p><strong>Role:</strong> {client.role || "—"}</p>
                                <p><strong>Description:</strong> {client.description || "—"}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button className="confirm-btn" disabled={!(selectedClient && selectedTime)} onClick={handleContinueBooking}>Continue Booking</button>
              </div>
            </div>
          </div>
        )}

        {showDescriptionPopup && (
          <div
            onClick={() => setShowDescriptionPopup(false)}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: "#f4f1e8", padding: "40px", borderRadius: "20px", width: "500px", maxWidth: "90%" }}
            >
              <h3>Confirm Appointment Details</h3>
              <p><strong>Client:</strong> {selectedClient?.name}</p>
              <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <label style={{ display: "block", marginTop: "16px" }}>Add a Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                style={{ width: "100%", borderRadius: "10px", padding: "10px", fontSize: "1rem", marginBottom: "20px" }}
              />
              <div style={{ textAlign: "center" }}>
                <button className="confirm-btn" onClick={handleConfirmBooking}>Confirm Booking</button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#5cb85c",
            color: "white",
            padding: "20px 30px",
            borderRadius: "16px",
            fontSize: "1rem",
            zIndex: 1200,
            textAlign: "center",
            maxWidth: "90%",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>✅ Appointment booked successfully!</div>
            <div><strong>Client:</strong> {selectedClient?.name || "Unknown"}</div>
            <div><strong>Date:</strong> {selectedDate.toDateString()}</div>
            <div><strong>Time:</strong> {selectedTime}</div>
            {description && <div><strong>Note:</strong> {description}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;