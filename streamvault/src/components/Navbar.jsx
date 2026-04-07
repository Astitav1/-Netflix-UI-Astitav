import { useState, useRef, useEffect } from 'react';
import { useDebounce }   from '../hooks/utils';
import { useSearch }     from '../hooks/useTVMaze';
import { useScrolled }   from '../hooks/utils';

export default function Navbar({ activeTab, onTabChange, shows, onShowSelect }) {
  const scrolled = useScrolled(40);
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const debouncedQ            = useDebounce(query, 380); // debounce: prevent API spam
  const { results, searching } = useSearch(debouncedQ, shows);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = (show) => {
    setQuery('');
    setOpen(false);
    onShowSelect && onShowSelect(show);
  };

  const tabs = [
    { key: 'home',        label: 'Home' },
    { key: 'tvshows',     label: 'TV Shows' },
    { key: 'movies',      label: 'Movies' },
    { key: 'videogames',  label: 'Video Games' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="nav-logo" onClick={() => onTabChange('home')}>
        STREAMVAULT
      </div>

      {/* Tab links */}
      <ul className="nav-links">
        {tabs.map(tab => (
          <li key={tab.key}>
            <button
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right side: search */}
      <div className="nav-right">
        <div className="search-wrap" ref={dropRef}>
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search title, ID, year…"
            value={query}
            onChange={handleInput}
            onFocus={() => query && setOpen(true)}
          />

          {/* Suggestions dropdown */}
          {open && debouncedQ.trim() && (
            <div className="search-dropdown">
              {searching && (
                <div className="search-no-result">Searching…</div>
              )}
              {!searching && results.length === 0 && (
                <div className="search-no-result">No results for "{debouncedQ}"</div>
              )}
              {!searching && results.map(show => (
                <div
                  key={show.id}
                  className="search-result-item"
                  onClick={() => handleSelect(show)}
                >
                  {show.image?.medium ? (
                    <img src={show.image.medium} alt={show.name} />
                  ) : (
                    <div style={{
                      width: 40, height: 56, borderRadius: 4,
                      background: '#242424', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>🎬</div>
                  )}
                  <div className="sri-info">
                    <span className="sri-name">{show.name}</span>
                    <span className="sri-meta">
                      {show.type || ''}
                      {show.premiered ? ` · ${show.premiered.slice(0,4)}` : ''}
                      {show.rating?.average ? ` · ★ ${show.rating.average}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
