import React, { useState } from 'react';
import './AdminDashboard.css';
import { collection, getDocs, setDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);


  // --- USERS ---
  const fetchAllUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList); // ✅ update state
  };

  const addNewUser = async () => {
    const uid = prompt('Enter new UID manually:');
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), {
      name: 'New User',
      email: 'newuser@example.com',
      role: 'user',
      country: 'Vietnam',
    });
    alert('User added');
    fetchAllUsers(); // refresh list
  };

  const deleteUser = async () => {
    const uid = prompt('Enter UID to delete:');
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid));
    alert('User deleted');
    fetchAllUsers(); // refresh list
  };

  // --- APPOINTMENTS ---
  const fetchAllAppointments = async () => {
    const snapshot = await getDocs(collection(db, 'appointments'));
    const appointmentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(appointmentList); // ✅ store to state
  };
  

  const fetchAppointmentsByStatus = async () => {
    const status = prompt('Enter status (pending, approved, etc.):');
    if (!status) return;
    const q = query(collection(db, 'appointments'), where('status', '==', status));
    const snapshot = await getDocs(q);
    const filtered = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Filtered [${status}]:`, filtered);
  };

  // --- ANALYTICS ---
  const countUsersAndClients = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    let users = 0, clients = 0;
    snapshot.forEach(doc => {
      const role = doc.data().role;
      if (role === 'user') users++;
      if (role === 'client') clients++;
    });
    alert(`Users: ${users}, Clients: ${clients}`);
  };

  return (
    <div className="admin-container">
      <h1>🛠️ Admin Dashboard</h1>

      {/* Tabs */}
      <div className="tab-buttons">
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users & Clients</button>
        <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>Appointments</button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'users' && (
          <div>
            <h2>Users & Clients</h2>
            <button onClick={fetchAllUsers}>View All Accounts</button>
            <button onClick={addNewUser}>Add New User</button>
            <button onClick={deleteUser}>Delete User</button>

            {/* Display Users */}
            {users.length > 0 && (
              <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>UID</th>
                    <th style={th}>Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Role</th>
                    <th style={th}>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={td}>{user.id}</td>
                      <td style={td}>{user.name}</td>
                      <td style={td}>{user.email}</td>
                      <td style={td}>{user.role}</td>
                      <td style={td}>{user.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

{activeTab === 'appointments' && (
  <div>
    <h2>Appointments</h2>
    <button onClick={fetchAllAppointments}>All Appointments</button>
    <button onClick={fetchAppointmentsByStatus}>Filter / Manage</button>

    {appointments.length > 0 && (
      <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Client ID</th>
            <th style={th}>User Name</th>
            <th style={th}>Date</th>
            <th style={th}>Time</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id}>
              <td style={td}>{appt.clientId || '-'}</td>
              <td style={td}>{appt.name}</td>
              <td style={td}>{appt.date}</td>
              <td style={td}>{appt.time}</td>
              <td style={td}>{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


        {activeTab === 'analytics' && (
          <div>
            <h2>Analytics</h2>
            <button onClick={countUsersAndClients}>View Stats</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple inline table styles
const th = {
  border: '1px solid #ccc',
  background: '#f0f0f0',
  padding: '8px',
  textAlign: 'left',
};

const td = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default AdminDashboard;
