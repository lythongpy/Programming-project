import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(form);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        /><br /><br />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        /><br /><br />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
        /><br /><br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage
