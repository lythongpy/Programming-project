import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // Register
        await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          email,
          role,
        });
        alert('🎉 Registered!');
        navigate(`/${role}`); // Redirect based on role
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role || 'user';
          alert(`✅ Logged in as ${userRole}`);
          navigate(`/${userRole}`); // /user or /client
        } else {
          alert('⚠️ No user record found in Firestore');
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth} className="auth-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegistering && (
          <div style={{ marginTop: '1rem' }}>
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />
              I'm a user (book appointments)
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === 'client'}
                onChange={() => setRole('client')}
              />
              I'm a client (manage appointments)
            </label>
          </div>
        )}

        <button type="submit" style={{ marginTop: '1rem' }}>
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
