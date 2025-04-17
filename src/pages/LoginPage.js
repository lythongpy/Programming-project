import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');

  const [isRegistering, setIsRegistering] = useState(mode === 'register');
  const [role, setRole] = useState('user');

  // Shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setIsRegistering(mode === 'register');
  }, [mode]);

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        if (password !== confirmPassword) return alert('Passwords do not match.');

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name,
          email,
          country,
          role,
        });

        alert('🎉 Registered successfully!');
        navigate(`/${role}`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role || 'user';
          navigate(`/${userRole}`);
        } else {
          alert('⚠️ No user profile found.');
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleAuth}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {isRegistering && (
          <div className="input-group">
            <label><i className="fas fa-user"></i> Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}

        <div className="input-group">
          <label><i className="fas fa-envelope"></i> Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {isRegistering && (
          <div className="input-group">
            <label><i className="fas fa-globe"></i> Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} required>
              <option value="">-- Select Country --</option>
              <option value="Vietnam">Vietnam</option>
              <option value="USA">USA</option>
              <option value="Japan">Japan</option>
            </select>
          </div>
        )}

        <div className="input-group">
          <label><i className="fas fa-lock"></i> Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {isRegistering && (
          <>
            <div className="input-group">
              <label><i className="fas fa-lock"></i> Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label><i className="fas fa-user-tag"></i> Role</label>
              <label>
                <input type="radio" value="user" checked={role === 'user'} onChange={() => setRole('user')} /> User
              </label>
              <label>
                <input type="radio" value="client" checked={role === 'client'} onChange={() => setRole('client')} /> Client
              </label>
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p style={{ marginTop: '1rem' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ color: '#007acc', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login' : 'Register'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
