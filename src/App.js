import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import AppRoutes from './routes/AppRoute';
import { BrowserRouter } from 'react-router-dom';
import "./styles/index.css"
import ScrollToTop from "./components/ScrollToTop"; // Adjust path if needed

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('User state:', user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
      <BrowserRouter>
        <ScrollToTop />   {/* ✅ Add this here */}
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;
