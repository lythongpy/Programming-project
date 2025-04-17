import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔄 Load appointments for current client
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser.uid;
      const q = query(collection(db, 'appointments'), where('clientId', '==', uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Fetch all users to map userId -> name
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const map = {};
      snapshot.forEach(doc => {
        map[doc.id] = doc.data().name || doc.data().email || 'Unknown';
      });
      setUserMap(map);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("❗ Are you sure you want to delete this appointment?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'appointments', id));
      alert("✅ Deleted");
      fetchAppointments();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error('❌ Failed to update status:', err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Client Appointment Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id} style={{ marginBottom: '1.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: '6px' }}>
              <strong>{appt.name}</strong><br />
              📅 {appt.date} at ⏰ {appt.time}<br />
              🧍 Booked by: <em>{userMap[appt.userId] || 'Unknown User'}</em><br />
              🔖 Status: <strong>{appt.status || 'pending'}</strong><br />

              <button onClick={() => handleUpdateStatus(appt.id, 'approved')}>✅ Approve</button>
              <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} style={{ margin: '0 10px' }}>❌ Cancel</button>
              <button onClick={() => handleDelete(appt.id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientDashboard;
