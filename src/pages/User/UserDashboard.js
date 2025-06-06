import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import AppointmentService from '../../services/AppointmentService';

function UserDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [datetime, setDatetime] = useState('');

  const fetchClients = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClients(list);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedClient || !datetime) return alert('Please select all fields');

    const appointment = {
      userId: auth.currentUser.uid,
      clientId: selectedClient,
      date: datetime,
      status: 'pending'
    };

    try {
      await AppointmentService.create(appointment);
      alert('Appointment booked successfully');
      setSelectedClient('');
      setDatetime('');
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 40 }}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBooking}>
        <label>Select a Client:</label><br />
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select><br /><br />

        <label>Choose Date & Time:</label><br />
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        /><br /><br />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default UserDashboard;
