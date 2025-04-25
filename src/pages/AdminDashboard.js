import React, { useState } from 'react';
import './AdminDashboard.css';
import { collection, getDocs, setDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user',
    name: '',
    email: '',
    country: 'Vietnam',
  });

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };
  

  const handleFormChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const submitNewUser = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const uid = userCred.user.uid;
  
      await setDoc(doc(db, 'users', uid), {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        country: newUser.country,
        role: newUser.role,
      });
  
      alert('✅ User created!');
      setShowForm(false);
      setNewUser({
        username: '',
        password: '',
        role: 'user',
        name: '',
        email: '',
        country: 'Vietnam',
      });
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create user: ' + err.message);
    }
  };

  // --- USERS ---
  const fetchAllUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList); // ✅ update state
  };

  const submitUpdateUser = async () => {
    if (!editingUser?.id) return;
  
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await setDoc(userRef, {
        name: editingUser.name,
        email: editingUser.email,
        country: editingUser.country,
        role: editingUser.role,
        username: editingUser.username || "", // optional field
      });
      alert('✅ User updated!');
      setEditingUser(null);
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update user: ' + err.message);
    }
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

  const roleLabel = {
    display: 'inline-block',
    marginRight: '15px',
    fontWeight: '500',
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
            <button onClick={() => setShowForm(true)}>Add New User</button>
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
                    <th style={th}>Action</th> 
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
                      <td style={td}>
                        <button onClick={() => handleEditClick(user)} style={{ marginTop: '5px' }}>Edit</button>
                      </td>

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
      {showForm && (
        <div className="popup-form">
          <div className="form-box">
            <h3>Create New User</h3>

            <input name="username" placeholder="Username" onChange={handleFormChange} value={newUser.username} />
            <input name="password" type="password" placeholder="Password" onChange={handleFormChange} value={newUser.password} />
            <input name="name" placeholder="Full Name" onChange={handleFormChange} value={newUser.name} />
            <input name="email" type="email" placeholder="Email" onChange={handleFormChange} value={newUser.email} />
            
            <select name="country" onChange={handleFormChange} value={newUser.country}>
              <option value="Vietnam">Vietnam</option>
              <option value="USA">USA</option>
              <option value="Japan">Japan</option>
            </select>

            <div style={{ marginTop: '1rem' }}>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={newUser.role === 'user'}
                  onChange={handleFormChange}
                />
                User
              </label>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={newUser.role === 'client'}
                  onChange={handleFormChange}
                />
                Client
              </label>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={newUser.role === 'admin'}
                  onChange={handleFormChange}
                />
                Admin
              </label>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button onClick={submitNewUser}>Create</button>
              <button onClick={() => setShowForm(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {editingUser && (
        <div className="popup-form">
          <div className="form-box">
            <h3>Edit User</h3>

            <input
              name="name"
              placeholder="Full Name"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />
            <input
              name="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />

            <select
              name="country"
              value={editingUser.country}
              onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
            >
              <option value="Vietnam">Vietnam</option>
              <option value="USA">USA</option>
              <option value="Japan">Japan</option>
            </select>

            <div style={{ marginTop: '1rem' }}>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={editingUser.role === 'user'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                />
                User
              </label>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={editingUser.role === 'client'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                />
                Client
              </label>
              <label style={roleLabel}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={editingUser.role === 'admin'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                />
                Admin
              </label>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button onClick={submitUpdateUser}>Update</button>
              <button onClick={() => setEditingUser(null)} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
