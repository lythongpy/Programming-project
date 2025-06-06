import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  const fetchAppointments = async () => {
    const snapshot = await getDocs(collection(db, 'appointments'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Delete this appointment?')) {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>

      <h3>All Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name || u.email} ({u.role})
            <button onClick={() => deleteUser(u.id)} style={{ marginLeft: 10 }}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>All Appointments</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            User: {a.userId} → Client: {a.clientId} <br />
            Date: {new Date(a.date).toLocaleString()} | Status: {a.status}
            <button onClick={() => deleteAppointment(a.id)} style={{ marginLeft: 10 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
