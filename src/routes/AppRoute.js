import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// Pages
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import MainHomepage from '../pages/Home/Mainhomepage';
import AboutUs from '../pages/Home/AboutUs';
import ProtectedRoute from './ProtectedRoute';

// User
import UserDashboard from '../pages/User/UserDashboard';
import BookingPage from '../pages/User/BookingPage';
import BookHistory from '../pages/User/BookHistory';
import UserProfile from '../pages/User/UserProfile';

// Client
import ClientDashboard from '../pages/Client/ClientDashboard';
import ClientAppointment from '../pages/Client/ClientAppointment';
import UserList from '../pages/Client/UserList';
import ClientProfile from '../pages/Client/ClientProfile';

// Admin
import AdminHomepage from '../pages/Admin/AdminHomepage';
import AdminAddAccount from '../pages/Admin/AdminAddAccount';
import AdminAccounts from '../pages/Admin/AdminAccounts';
import AdminAppointment from '../pages/Admin/AdminAppointment';
import AdminProfile from '../pages/Admin/AdminProfile';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
  const unprotectedRoutes = ['/', '/register', '/login', '/AboutUs'];

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;

    const isNewAccount = localStorage.getItem('isNewAccount') === 'true';

    // Check if user is not logged in, is not on an unprotected route, and is not a new user
    if (!user && !unprotectedRoutes.includes(currentPath) && !isNewAccount) {
      navigate('/login', { replace: true });
    }

    if (isNewAccount) {
      localStorage.removeItem('isNewAccount');
      navigate('/user/dashboard', { replace: true }); // Redirect new users to their dashboard
    }
  });

  return () => unsubscribe();
}, [navigate]);


  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainHomepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/AboutUs" element={<AboutUs />} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/booking" element={
        <ProtectedRoute allowedRole="user">
          <BookingPage />
        </ProtectedRoute>
      } />
      <Route path="/user/history" element={
        <ProtectedRoute allowedRole="user">
          <BookHistory />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute allowedRole="user">
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* Client Routes */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute allowedRole="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/client/appointment" element={
        <ProtectedRoute allowedRole="client">
          <ClientAppointment />
        </ProtectedRoute>
      } />
      <Route path="/client/users" element={
        <ProtectedRoute allowedRole="client">
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/client/profile" element={
        <ProtectedRoute allowedRole="client">
          <ClientProfile />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <AdminHomepage />
        </ProtectedRoute>
      } />
      <Route path="/admin/add-client" element={
        <ProtectedRoute allowedRole="admin">
          <AdminAddAccount />
        </ProtectedRoute>
      } />
      <Route path="/admin/accounts" element={
        <ProtectedRoute allowedRole="admin">
          <AdminAccounts />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute allowedRole="admin">
          <AdminAppointment />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute allowedRole="admin">
          <AdminProfile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;
