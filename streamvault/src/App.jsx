import { useState } from 'react';
import './index.css';

import SignIn            from './components/SignIn';
import Navbar            from './components/Navbar';
import ConnectionBanner  from './components/ConnectionBanner';
import HomePage          from './pages/HomePage';
import { useTVMaze }     from './hooks/useTVMaze';

// ── Simple show detail modal (Stage 2 preview screen) ──────────────────────
function ShowModal({ show, onClose }) {
  if (!show) return null;
  const summary = show.summary?.replace(/<[^>]+>/g, '') || 'No description available.';
  const bg = show.image?.original || show.image?.medium;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: 14,
          width: '100%', maxWidth: 600,
          overflow: 'hidden',
          animation: 'fadeUp 0.3s ease',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {bg && (
          <div style={{
            width: '100%', height: 220,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        )}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>
              {show.name}
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}
            >✕</button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {show.rating?.average && (
              <span style={{ color: '#46d369', fontSize: '0.82rem', fontWeight: 600 }}>★ {show.rating.average}</span>
            )}
            {show.premiered && (
              <span style={{ color: '#888', fontSize: '0.82rem' }}>{show.premiered.slice(0, 4)}</span>
            )}
            {show.genres?.map(g => (
              <span key={g} style={{ color: '#888', fontSize: '0.82rem' }}>{g}</span>
            ))}
            {show.status && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                borderRadius: 4, letterSpacing: 1,
                background: show.status === 'Running' ? 'rgba(70,211,105,0.15)' : 'rgba(255,255,255,0.07)',
                color: show.status === 'Running' ? '#46d369' : '#888',
              }}>{show.status}</span>
            )}
          </div>

          <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            {summary}
          </p>

          {show.network?.name && (
            <p style={{ color: '#555', fontSize: '0.78rem' }}>Network: {show.network.name}</p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn btn-primary">▶ Watch Now</button>
            <button className="btn btn-secondary">＋ Watchlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]           = useState(null);        // null = not signed in
  const [activeTab, setActiveTab] = useState('home');
  const [selected, setSelected]   = useState(null);        // show detail modal

  const { shows, loading, error, hasMore, fetchNextPage } = useTVMaze();

  // ── Sign-in ──
  if (!user) {
    return <SignIn onSignIn={setUser} />;
  }

  return (
    <>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shows={shows}
        onShowSelect={setSelected}
      />

      <HomePage
        shows={shows}
        loading={loading}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
        activeTab={activeTab}
        onShowClick={setSelected}
      />

      {/* Show detail modal */}
      {selected && (
        <ShowModal show={selected} onClose={() => setSelected(null)} />
      )}

      {/* Error state */}
      {error && (
        <div style={{
          position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
          background: '#c0392b', color: '#fff', borderRadius: 8, padding: '0.6rem 1.2rem',
          fontSize: '0.82rem', zIndex: 400,
        }}>
          API Error: {error}
        </div>
      )}

      {/* Online / offline banner */}
      <ConnectionBanner />
    </>
  );
}
