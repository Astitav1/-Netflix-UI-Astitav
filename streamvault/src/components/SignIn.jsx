import { useState } from 'react';

export default function SignIn({ onSignIn }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErr('Please enter your email and password.');
      return;
    }
    // In a real app, you'd authenticate via Firebase here (Stage 2).
    // For now, any non-empty credentials work.
    onSignIn({ email, guest: false });
  };

  const handleGuest = () => {
    onSignIn({ email: 'guest', guest: true });
  };

  return (
    <div className="signin-screen">
      <div className="signin-logo-big">STREAMVAULT</div>
      <p className="signin-tag">Unlimited entertainment</p>

      <div className="signin-box">
        <h2>Sign In</h2>

        {err && (
          <p style={{ color: '#f39c12', fontSize: '0.8rem' }}>{err}</p>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => { setEmail(e.target.value); setErr(''); }}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setErr(''); }}
          autoComplete="current-password"
        />

        <button
          className="btn btn-primary btn-full"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <div className="signin-divider">or</div>

        <button
          className="btn btn-ghost btn-full"
          onClick={handleGuest}
        >
          Continue as Guest
        </button>

        <p style={{ fontSize: '0.72rem', color: '#555', textAlign: 'center', marginTop: '0.25rem' }}>
          Stage 2: Firebase authentication integration
        </p>
      </div>
    </div>
  );
}
