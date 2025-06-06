import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  mainContent: {
    flex: 1,
    padding: '1.5rem',
    backgroundColor: '#f5f5f5',
  },
};
