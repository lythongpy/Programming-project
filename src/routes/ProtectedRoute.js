import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * A wrapper component that only allows access to users with a specific role.
 * If the user's role doesn't match `allowedRole`, they are redirected.
 *
 * @param {string} allowedRole - Required user role (e.g., 'admin', 'client')
 * @param {JSX.Element} children - The protected component to render
 */
const ProtectedRoute = ({ allowedRole, children }) => {
  const [role, setRole] = useState(null);         // 🔐 User's role in Firestore
  const [loading, setLoading] = useState(true);   // ⏳ Prevent premature redirect
  const user = auth.currentUser;                  // 🔑 Firebase Auth object

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } catch (err) {
        console.error("Failed to check user role:", err);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  // ⏳ Show loading while checking
  if (loading) return <div>Loading...</div>;

  // 🔒 Block access if not logged in or role mismatch
  if (!user || role !== allowedRole) return <Navigate to="/login" replace />;

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
