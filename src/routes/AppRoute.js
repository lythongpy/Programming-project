import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import UserDashboard from '../pages/User/UserDashboard';
import ClientDashboard from '../pages/Client/ClientDashboard';
import ProtectedRoute from './ProtectedRoute';
import MainHomepage from '../pages/Home/Mainhomepage';
import AdminHomepage from '../pages/Admin/AdminHomepage';
import AdminAddAccount from '../pages/Admin/AdminAddAccount';
import AdminUser from '../pages/Admin/AdminUser';
import AdminClient from '../pages/Admin/AdminClient';
import BookingPage from '../pages/User/BookingPage';
import BookHistory from '../pages/User/BookHistory';
import UserNotification from '../pages/User/UserNotification';
import UserProfile from '../pages/User/UserProfile';
import ClientAppointment from '../pages/Client/ClientAppointment';
import UserList from '../pages/Client/UserList';
import ClientNotification from '../pages/Client/ClientNotification';
import ClientProfile from '../pages/Client/ClientProfile';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
  const unprotectedRoutes = ['/', '/register', '/login'];
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    if (!user && !unprotectedRoutes.includes(currentPath)) {
      navigate('/login');
    }
  });
  return () => unsubscribe();
}, [navigate]);


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainHomepage />} />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
              <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRole="client">
              <ClientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-client"
        element={
          <ProtectedRoute allowedRole="admin">
              <AdminAddAccount />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
              <AdminHomepage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/user"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/client"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminClient />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/booking"
        element={
          <ProtectedRoute allowedRole="user">
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/history"
        element={
          <ProtectedRoute allowedRole="user">
            <BookHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/notifications"
        element={
          <ProtectedRoute allowedRole="user">
            <UserNotification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRole="user">
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/appointment"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientAppointment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/user"
        element={
          <ProtectedRoute allowedRole="client">
            <UserList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/notifications"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientNotification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/profile"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientProfile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;
