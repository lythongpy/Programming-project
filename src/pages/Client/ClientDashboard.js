import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [userMap, setUserMap] = useState({});

  const fetchAppointments = async () => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, 'appointments'), where('clientId', '==', uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const map = {};
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      map[doc.id] = user.name || user.email;
    });
    setUserMap(map);
  };

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', paddingTop: 40 }}>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>
              <strong>Booked by:</strong> {userMap[a.userId] || a.userId}<br />
              <strong>Date:</strong> {new Date(a.date).toLocaleString()}<br />
              <strong>Status:</strong> {a.status}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientDashboard;
