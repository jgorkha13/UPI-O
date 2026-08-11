# UPI-O PWA & Offline Architecture

This document explains how offline payments work in UPI-O, what the PWA adds, and how to test it.

---

## The problem we solve

Real users lose connectivity **mid-session** (trains, villages, basements). UPI-O lets them:

1. **Open the app offline** (after installing / caching once)
2. **Queue payments** in IndexedDB when there is no network
3. **Sync automatically** when connectivity returns (with nonce deduplication)

---

## Three layers of offline support

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1 — PWA Service Worker (NEW)                     │
│  Caches app shell: HTML, JS, CSS, icons, fonts          │
│  → App LOADS even after refresh while offline           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2 — Wallet & contact cache (localStorage)        │
│  Balance, offline limit, spent, contact names           │
│  → Dashboard & Send Money show data without API         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3 — Offline transaction queue (IndexedDB)        │
│  Pending payments with unique nonce per tx              │
│  → syncService POSTs to backend when online           │
└─────────────────────────────────────────────────────────┘
```

| Layer | Storage | What it enables |
|---|---|---|
| PWA | Cache API (Service Worker) | Cold start offline — app UI loads |
| Wallet cache | `localStorage` | Balance & offline limits visible |
| Tx queue | IndexedDB (`UPIODB`) | Payments saved without server |

**Backend API calls are never cached** — money always syncs to the server when online.

---

## PWA files added

| File | Purpose |
|---|---|
| `src/service-worker.js` | Workbox precache + routing for SPA |
| `src/serviceWorkerRegistration.js` | Registers SW in **production only** |
| `src/components/ui/InstallPWA.jsx` | “Install app” banner |
| `public/manifest.json` | App name, icons, theme, standalone mode |

Service worker runs only after `npm run build` (not during `npm start` dev mode). This avoids dev-server conflicts.

---

## How to test PWA locally

### Step 1 — Production build + serve

```bash
cd frontend
npm install
npm run build
npm run serve
```

Opens at **http://localhost:3000** (or the port `serve` prints).

### Step 2 — First visit (must be online)

1. Open the served URL in Chrome
2. Register / log in
3. Add money on Dashboard
4. Optional: click **Install app** banner, or Chrome menu → **Install UPI-O**

This visit caches the app shell and stores wallet data.

### Step 3 — Go offline

**Option A — Installed PWA (best demo)**  
Close browser tab. Open **UPI-O** from home screen / Applications. Turn off Wi‑Fi. App should still open.

**Option B — DevTools**  
Network tab → **Offline**. Refresh page — app should still load from service worker cache.

### Step 4 — Send money offline

1. Go to **Send Money**
2. Enter another user’s 10-digit number (not your own)
3. Enter amount within offline limit
4. Send → “Transaction queued for sync”

### Step 5 — Back online

Turn network on. Pending transactions sync automatically. Dashboard balance updates from server.

---

## What works vs what does not

| Scenario | Works? |
|---|---|
| Install app, open offline later | ✅ Yes (after one online visit) |
| Refresh while offline | ✅ Yes (service worker) |
| Send money offline | ✅ Yes (IndexedDB queue) |
| Sync when online | ✅ Yes |
| Register new account offline | ❌ No (needs API) |
| Look up new phone number offline | ⚠️ Only if cached from earlier online lookup |
| First-ever visit with zero prior cache | ❌ Needs one online session first |

This matches how real wallet apps behave: the app must be **installed or cached once** while online.

---

## Deploy notes (Vercel / Netlify)

1. Deploy the **`frontend/`** folder (`npm run build`, output `build/`)
2. HTTPS is **required** for service workers in production
3. Set `REACT_APP_API_URL` to your backend URL
4. Add `_redirects` or equivalent so SPA routes work:

**Netlify** — `frontend/public/_redirects`:
```
/*    /index.html   200
```

**Vercel** — usually auto-handled for CRA; if not, add `vercel.json` rewrites.

5. On backend, set `FRONTEND_URL` to your deployed frontend URL (CORS)

---

## Interview talking points

> “UPI-O uses a three-layer offline model: Workbox PWA for app-shell caching, localStorage for wallet state, and IndexedDB for an offline transaction queue. Each queued payment carries a UUID nonce; the backend rejects duplicates on sync. Offline spending is capped at ₹2,000 per wallet independently of total balance.”

---

## Troubleshooting

| Issue | Fix |
|---|---|
| App blank offline | Run `npm run build && npm run serve`, visit online first |
| SW not registering | Service worker only in production build, not `npm start` |
| Install banner missing | Use Chrome/Edge; needs HTTPS in prod; may need second visit |
| Sync fails | Check backend running; verify `REACT_APP_API_URL` |
| Old cache after deploy | Hard refresh or clear site data in browser |

---

## Clear cache (development)

Chrome → DevTools → **Application** → **Storage** → **Clear site data**

Also clears IndexedDB queue and wallet cache.
