import { useRef, useState, useEffect } from 'react';

// ── LazyImage ──────────────────────────────────────────────────────────────
// Only loads the <img> src when the element enters the viewport.
// Uses IntersectionObserver internally. Prevents loading thousands of
// images at once (memory leak / unnecessary network calls).
function LazyImage({ src, alt }) {
  const imgRef  = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '200px' } // pre-load 200px before entering viewport
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={visible ? src : undefined}
      alt={alt}
      className={loaded ? 'loaded' : 'loading'}
      onLoad={() => setLoaded(true)}
    />
  );
}


// ── Card ──────────────────────────────────────────────────────────────────
export default function Card({ show, onClick }) {
  const name    = show.name || 'Untitled';
  const poster  = show.image?.medium || show.image?.original || null;
  const year    = show.premiered ? show.premiered.slice(0, 4) : '—';
  const rating  = show.rating?.average ? `★ ${show.rating.average}` : '';
  const type    = show.type || '';

  const typeLabel = {
    'Scripted':    'Show',
    'Animation':   'Anime',
    'Reality':     'Reality',
    'Documentary': 'Doc',
    'Game Show':   'Game',
    'Talk Show':   'Talk',
    'Sports':      'Sports',
  }[type] || type;

  return (
    <div className="card fade-in" onClick={() => onClick && onClick(show)}>
      {typeLabel && <span className="card-type-badge">{typeLabel}</span>}

      {poster ? (
        <LazyImage src={poster} alt={name} />
      ) : (
        <div className="card-placeholder">🎬</div>
      )}

      <div className="card-overlay">
        <p className="card-name">{name}</p>
        <p className="card-meta">
          {year}{rating ? ` · ${rating}` : ''}
        </p>
      </div>
    </div>
  );
}
