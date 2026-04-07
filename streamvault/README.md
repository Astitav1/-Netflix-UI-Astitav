# StreamVault — Netflix-style React App

A React.js streaming UI built against the TVMaze REST API.

## Getting Started

```bash
cd streamvault
npm install
npm start
```

Opens at http://localhost:3000

---

## Project Structure

```
src/
├── hooks/
│   ├── useTVMaze.js     — API fetching, search, top-show hooks
│   └── utils.js         — useDebounce, useIntersectionObserver,
│                          useOnlineStatus, useScrolled
├── components/
│   ├── Card.jsx         — Lazy-loaded show thumbnail card
│   ├── Hero.jsx         — Today's top show banner
│   ├── Navbar.jsx       — Nav with tabs + search + debounce
│   ├── SignIn.jsx       — Sign-in / guest screen
│   └── ConnectionBanner.jsx — Online/offline indicator
├── pages/
│   └── HomePage.jsx     — Infinite-scroll grid + hero layout
├── App.jsx              — Root component, routing, modal
├── index.css            — All styles (CSS variables + animations)
└── index.js             — React DOM entry point
```

---

## Features (Stage 1)

| Feature | Implementation |
|---|---|
| 10,000+ shows via REST API | TVMaze `/shows?page=N` — page-based, ~250/page |
| Lazy loading images | `IntersectionObserver` inside `Card.jsx` — loads image only when in viewport |
| Infinite scroll | Sentinel div + `IntersectionObserver` in `HomePage.jsx` |
| Memory leak prevention | All observers cleaned up in `useEffect` return functions |
| No unnecessary re-renders | `useMemo` for filtered list; page cache in `useRef` |
| Sign-in + Guest | `SignIn.jsx` — form or guest button |
| Today's Top Show hero | TVMaze `/schedule` endpoint, sorted by rating |
| Nav tabs | Home / TV Shows / Movies / Video Games — filter by `show.type` |
| Search | TVMaze `/search/shows?q=` for names; local filter for ID/year |
| Debounce | `useDebounce(query, 380)` in `Navbar.jsx` — waits 380ms before API call |
| Online/offline banner | `useOnlineStatus` with `window online/offline` events |
| Animations | CSS `fadeUp` / `fadeIn` keyframes; card hover scale |
| Show detail modal | Click any card — opens preview with info + actions |

---

## API

Uses the free [TVMaze API](https://www.tvmaze.com/api) — no key required.

Key endpoints used:
- `GET /shows?page=N` — paginated full catalog
- `GET /schedule?date=YYYY-MM-DD` — today's schedule (for top show)
- `GET /search/shows?q=query` — name search

---

## Stage 2 (not yet implemented)

- Profile / watch history / watchlist
- Firebase authentication (sign-up)
- Full movie preview screen with transitions
- Offline mode with service worker + cached API responses
