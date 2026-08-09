# CivicPulse — Frontend (React + Vite + Tailwind)

## Quick start

```bash
cd civicpulse-frontend
npm install
cp .env.example .env    # points the app at your backend, defaults to localhost:8080
npm run dev
```

Opens on `http://localhost:5173`. Make sure the backend (see `civicpulse-backend/README.md`)
is running first — registration/login and the live map need it.

## What's implemented

- **Auth** — register as Citizen or Ward Officer, JWT stored client-side, auto-redirect to
  login on 401 (`src/services/api.js`), role-based route protection (`ProtectedRoute.jsx`).
- **Report flow** (`pages/ReportIssue.jsx`) — 4-step form: photo (browser camera/file
  picker) -> category -> ward + description -> submit, with live geolocation capture and
  inline duplicate-report suggestions after submitting.
- **Live map** (`pages/LiveMap.jsx`) — Leaflet map of all open issues, bubble size scales
  with priority score, subscribes to `/topic/issues` over WebSocket for real-time updates.
- **Issue detail** (`pages/IssueDetail.jsx`) — status timeline, confirm-this-report action,
  live-updates via WebSocket subscription scoped to that issue.
- **Officer dashboard** (`pages/OfficerDashboard.jsx`) — ward-scoped issue queue sorted by
  priority, one-tap status advancement (Reported -> Acknowledged -> In Progress -> Resolved).
- **Officer analytics** (`pages/OfficerAnalytics.jsx`) — Recharts bar chart by category,
  SLA-breach count, average resolution time.

## Design system

Tokens live in `tailwind.config.js`: civic blue `#1E3A5F` (trust/primary), signal amber
`#F0A73B` (priority/alerts), resolved green `#2F9E68`. Display type is Fraunces, body is
Inter, data/timestamps use IBM Plex Mono (`src/index.css` imports all three from Google
Fonts). The signature visual motif is `components/PulseBadge.jsx` — a radar-style pulsing
ring used everywhere a priority score appears; it stops pulsing (renders as a still dot)
once an issue is resolved, so the UI itself communicates "this is settled."

## Structure

```
src/
  components/   Navbar, IssueCard, PulseBadge (signature element), StatusPill,
                CategoryBadge, ProtectedRoute, EmptyState, Loader
  pages/        Landing, Login, Register, ReportIssue, MyReports, IssueDetail,
                LiveMap, OfficerDashboard, OfficerAnalytics, NotFound
  context/      AuthContext (login/register/logout, persists to localStorage)
  services/     api.js (axios + JWT interceptor), authService, wardService,
                issueService, socket.js (STOMP/SockJS connection helper)
```

## Notes for the live demo

1. Register one Citizen account and one Officer account (same ward) in two browser tabs.
2. Submit a report as the citizen — watch the officer's dashboard update instantly via
   WebSocket, no refresh needed.
3. Submit a second, nearby report of the same category to show the duplicate-detection
   prompt firing.
4. Advance the status as the officer — watch the citizen's issue-detail page update live.
5. Open `/map` to show the clustered, priority-weighted live map.

## Production build

```bash
npm run build   # outputs to dist/
```
Deploy `dist/` to Netlify/Vercel; set `VITE_API_BASE_URL` to your deployed backend URL as
a build-time environment variable on whichever platform you use.
