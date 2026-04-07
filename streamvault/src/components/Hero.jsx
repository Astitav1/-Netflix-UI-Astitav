// Hero banner — shows Today's Top Show fetched from TVMaze's schedule API.
// Falls back to the first show in the list if schedule is unavailable.

export default function Hero({ show }) {
  if (!show) return null;

  const bg      = show.image?.original || show.image?.medium || null;
  const name    = show.name || 'Untitled';
  const summary = show.summary
    ? show.summary.replace(/<[^>]+>/g, '') // strip HTML tags from API
    : 'No description available.';
  const rating  = show.rating?.average;
  const year    = show.premiered ? show.premiered.slice(0, 4) : '';
  const genre   = show.genres?.[0] || '';
  const network = show.network?.name || show.webChannel?.name || '';

  return (
    <div className="hero">
      {/* Background image */}
      <div
        className="hero-bg"
        style={bg ? { backgroundImage: `url(${bg})` } : { background: '#1a0505' }}
      />

      <div className="hero-content fade-up">
        <p className="hero-label">▶ Today's Top Show</p>

        <h1 className="hero-title">{name}</h1>

        <div className="hero-meta">
          {rating && <span className="rating">★ {rating}</span>}
          {year   && <span>{year}</span>}
          {genre  && <span>{genre}</span>}
          {network && <span>{network}</span>}
        </div>

        <p className="hero-summary">{summary}</p>

        <div className="hero-actions">
          <button className="btn btn-primary">▶ Watch Now</button>
          <button className="btn btn-secondary">＋ My List</button>
        </div>
      </div>
    </div>
  );
}
