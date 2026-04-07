import { useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Hero from '../components/Hero';
import { useIntersectionObserver } from '../hooks/utils';
import { useTopShow } from '../hooks/useTVMaze';

// Skeleton row shown while loading
function SkeletonGrid({ count = 10 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}

// Tab → TVMaze show type mapping
const TAB_FILTER = {
  home:       null,              // show all
  tvshows:    'Scripted',
  movies:     'Animation',       // TVMaze doesn't have 'movie' type; adjust as needed
  videogames: 'Game Show',
};

export default function HomePage({ shows, loading, hasMore, fetchNextPage, activeTab, onShowClick }) {
  const topShow = useTopShow();
  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  // Trigger next page load when sentinel enters viewport
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      fetchNextPage();
    }
  }, [isIntersecting, hasMore, loading, fetchNextPage]);

  // Filter shows based on active tab
  const filtered = useMemo(() => {
    const typeFilter = TAB_FILTER[activeTab];
    if (!typeFilter) return shows;
    return shows.filter(s => s.type === typeFilter);
  }, [shows, activeTab]);

  const sectionLabel = {
    home:       'All Titles',
    tvshows:    'TV Shows',
    movies:     'Movies',
    videogames: 'Video Games',
  }[activeTab] || 'All Titles';

  return (
    <div className="main-content">
      {/* Hero: only on home tab */}
      {activeTab === 'home' && (
        <Hero show={topShow || shows[0] || null} />
      )}

      {/* Main grid */}
      <div className="section" style={{ paddingTop: activeTab !== 'home' ? '2rem' : '1.5rem' }}>
        <p className="section-title">
          {sectionLabel}
          {filtered.length > 0 && (
            <span style={{ marginLeft: '0.75rem', color: '#555' }}>
              {filtered.length.toLocaleString()} titles
            </span>
          )}
        </p>

        {filtered.length === 0 && !loading ? (
          <div className="empty-state">
            <span style={{ fontSize: '2rem' }}>📺</span>
            <p>No titles found in this category yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map(show => (
              <Card key={show.id} show={show} onClick={onShowClick} />
            ))}
          </div>
        )}

        {/* Skeleton while loading next page */}
        {loading && <SkeletonGrid count={12} />}

        {/* Invisible sentinel — triggers next page fetch */}
        <div ref={sentinelRef} className="load-sentinel" />

        {!hasMore && filtered.length > 0 && (
          <p className="loading-spinner">All {filtered.length.toLocaleString()} titles loaded.</p>
        )}
      </div>
    </div>
  );
}
