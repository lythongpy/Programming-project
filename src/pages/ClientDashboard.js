import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const snapshot = await getDocs(collection(db, 'appointments'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this appointment?");
    if (!confirm) return;

    await deleteDoc(doc(db, 'appointments', id));
    alert("Deleted");
    fetchAppointments();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const apptRef = doc(db, 'appointments', id);
      await updateDoc(apptRef, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 All Appointments (Client View)</h2>
      <ul>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <li key={appt.id} style={{ marginBottom: '1rem' }}>
              <strong>{appt.name}</strong> — {appt.date} at {appt.time}
              <br />
              <span>Status: <em>{appt.status || 'pending'}</em></span>
              <br />
              <button onClick={() => handleUpdateStatus(appt.id, 'approved')}>✅ Approve</button>
              <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} style={{ margin: '0 10px' }}>❌ Cancel</button>
              <button onClick={() => handleDelete(appt.id)}>🗑️ Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ClientDashboard;
