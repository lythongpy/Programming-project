import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login(form); 
      const role = await authService.getUserRole(user.uid); 
      alert('Login successful');
      navigate(`/dashboard/${role}`);
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
