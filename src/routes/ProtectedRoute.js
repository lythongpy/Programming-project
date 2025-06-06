import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ allowedRole, children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return setLoading(false);

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role);
      }
      setLoading(false);
    };

    checkRole();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user || role !== allowedRole) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
