// ── useTVMaze.js ──────────────────────────────────────────────────────────
// Fetches shows from the TVMaze API with pagination (page-based).
// TVMaze /shows?page=N returns ~250 items per page.
// We cache fetched pages in a ref so they're never re-fetched.

import { useState, useEffect, useRef, useCallback } from 'react';

const BASE = 'https://api.tvmaze.com';
const PAGE_SIZE = 250; // TVMaze returns up to 250 per page

export function useTVMaze() {
  const [shows, setShows]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [hasMore, setHasMore]   = useState(true);

  const pageRef  = useRef(0);
  const cacheRef = useRef({}); // page -> shows[]
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoading(true);

    const page = pageRef.current;

    // Return cached page immediately
    if (cacheRef.current[page]) {
      setShows(prev => [...prev, ...cacheRef.current[page]]);
      pageRef.current += 1;
      fetchingRef.current = false;
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE}/shows?page=${page}`);
      if (res.status === 404) {
        // TVMaze returns 404 when there are no more pages
        setHasMore(false);
        fetchingRef.current = false;
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        cacheRef.current[page] = data;
        setShows(prev => [...prev, ...data]);
        pageRef.current += 1;
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  // Load first page on mount
  useEffect(() => {
    fetchPage();
  }, []); // eslint-disable-line

  return { shows, loading, error, hasMore, fetchNextPage: fetchPage };
}


// ── useTopShow.js  ────────────────────────────────────────────────────────
// Gets today's schedule and picks the highest-rated show.
export function useTopShow() {
  const [topShow, setTopShow] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    fetch(`${BASE}/schedule?date=${today}`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;
        // Sort by show rating, pick highest
        const sorted = data
          .filter(ep => ep.show && ep.show.rating && ep.show.rating.average)
          .sort((a, b) => b.show.rating.average - a.show.rating.average);
        if (sorted.length > 0) setTopShow(sorted[0].show);
      })
      .catch(() => {});
  }, []);

  return topShow;
}


// ── useSearch.js  ─────────────────────────────────────────────────────────
// Searches TVMaze API with debouncing to prevent excessive calls.
// Searches by name (API supports it). We also filter locally by ID/year.
export function useSearch(query, allShows) {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Check if query is a year (4 digits) or numeric ID
    const isYear = /^\d{4}$/.test(query.trim());
    const isId   = /^\d+$/.test(query.trim()) && !isYear;

    if (isYear || isId) {
      // Filter locally from already-fetched shows (no API call needed)
      const filtered = allShows.filter(show => {
        if (isId)   return String(show.id) === query.trim();
        if (isYear) {
          const premiered = show.premiered || '';
          return premiered.startsWith(query.trim());
        }
        return false;
      }).slice(0, 8);
      setResults(filtered);
      return;
    }

    // Name search → hit the API (debounced by the hook caller)
    setSearching(true);
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    fetch(`${BASE}/search/shows?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => {
        setResults(data.map(item => item.show).slice(0, 8));
        setSearching(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setSearching(false);
      });

    return () => ctrl.abort();
  }, [query, allShows]);

  return { results, searching };
}
