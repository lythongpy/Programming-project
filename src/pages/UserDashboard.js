import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

function UserDashboard() {
  const [form, setForm] = useState({ date: '', time: '', clientId: '' });
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [userName, setUserName] = useState('');
  const [editId, setEditId] = useState(null); // ⭐ current editing appointment id

  const fetchUserName = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserName(userSnap.data().name || '');
    }
  };

  const fetchClients = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    const snapshot = await getDocs(q);
    const clientList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClients(clientList);
  };

  const fetchAppointments = async () => {
    const q = query(collection(db, 'appointments'), where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.clientId) return alert('Please select a client');

    try {
      if (editId) {
        // 🔄 UPDATE existing appointment
        const apptRef = doc(db, 'appointments', editId);
        await updateDoc(apptRef, {
          date: form.date,
          time: form.time,
          clientId: form.clientId
        });
        alert('✅ Appointment updated!');
      } else {
        // ➕ CREATE new appointment
        await addDoc(collection(db, 'appointments'), {
          name: userName,
          userId: auth.currentUser.uid,
          clientId: form.clientId,
          date: form.date,
          time: form.time,
          status: 'pending'
        });
        alert('✅ Appointment booked!');
      }

      setForm({ date: '', time: '', clientId: '' });
      setEditId(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to save appointment');
    }
  };

  const handleEdit = (appt) => {
    if (appt.status !== 'pending') {
      return alert('⚠️ Only pending appointments can be edited.');
    }
    setForm({ date: appt.date, time: appt.time, clientId: appt.clientId });
    setEditId(appt.id);
  };
  
  const handleDelete = async (id) => {
    const confirm = window.confirm("❗ Are you sure you want to cancel this appointment?");
    if (!confirm) return;
  
    try {
      await doc(db, 'appointments', id); // doc ref
      await deleteDoc(doc(db, 'appointments', id));
      alert("🗑️ Appointment deleted.");
      fetchAppointments(); // refresh
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("❌ Failed to delete appointment.");
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchClients();
    fetchAppointments();
  }, []);


  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>{editId ? '✏️ Edit Appointment' : '📅 Book an Appointment'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="time" type="time" value={form.time} onChange={handleChange} required />
        <select name="clientId" value={form.clientId} onChange={handleChange} required>
          <option value="">👤 Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name || client.email}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Book Now'}</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <h3>📋 Your Appointments</h3>

      {appointments.length === 0 ? (
        <p style={{ color: '#888' }}>You have no appointments yet.</p>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '1rem'
        }}>
          {appointments.map((appt) => (
            <div key={appt.id} style={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '1rem'
            }}>
              <strong>Date:</strong> {appt.date} <br />
              <strong>Time:</strong> {appt.time} <br />
              <strong>Status:</strong>{' '}
              <span style={{
                color: appt.status === 'approved' ? 'green' :
                      appt.status === 'cancelled' ? 'red' : '#555',
                fontWeight: 'bold'
              }}>
                {appt.status}
              </span>
              <br />
              {appt.status === 'pending' && (
                <>
                  <button style={{ marginTop: '0.5rem' }} onClick={() => handleEdit(appt)}>
                    ✏️ Change
                  </button>
                  <button
                    style={{ marginTop: '0.5rem', marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                    onClick={() => handleDelete(appt.id)}
                  >
                    🗑️ Cancel
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
