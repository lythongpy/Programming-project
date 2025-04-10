import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function UserDashboard() {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
  });

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await addDoc(collection(db, 'appointments'), {
            ...form,
            status: 'pending',
          });          
        alert('✅ Appointment booked!');
        setForm({ name: '', date: '', time: '' }); // clear form
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('❌ Failed to book appointment');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <h2>📅 Book an Appointment</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default UserDashboard;
