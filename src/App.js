import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import AppRoutes from './routes/AppRoute';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return <AppRoutes />;
}

export default App;
