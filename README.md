# UPI-O

A UPI-style wallet I built where you can send money to friends — and if you're offline (train, bad network, etc.), payments get queued and sync when you're back online. There's a ₹2,000 cap on offline spends so things stay sane.

**Try it:** [upi-o-coral.vercel.app](https://upi-o-coral.vercel.app)

Sign up on the live site first — accounts on your laptop (`localhost`) don't carry over to production.

First load can feel slow (~30 sec) if the server was sleeping. Render free tier does that. Refresh once and it should be fine.

---

## What's in it

- Spring Boot + PostgreSQL + JWT on the backend
- React + Tailwind on the frontend
- PWA — installable, works offline after you've opened it once online
- IndexedDB queue for offline payments with nonce dedup on sync

More detail on the offline/PWA stuff: [docs/PWA_OFFLINE.md](docs/PWA_OFFLINE.md)

---

## Run locally

You'll need Java 21, PostgreSQL, and Node 18+.

**Database**

```sql
CREATE DATABASE payment_db;
CREATE USER payment_user WITH PASSWORD 'payment123';
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
```

**Backend** (from repo root)

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21   # macOS — change for your setup
./mvnw spring-boot:run
```

→ http://localhost:8080

**Frontend**

```bash
cd frontend
npm install
npm start
```

→ http://localhost:3000

**Test offline PWA locally**

```bash
cd frontend
npm run build
npm run serve
```

Open it online, log in, add some money, install the app. Then kill wifi and try a payment — it queues.

---

## How it's deployed

Frontend is on Vercel, backend + DB on Render. The backend URL isn't something you open in a browser — it's just the API the frontend talks to.

If you're forking this and deploying your own copy, you'll need env vars on both sides:

**Render (backend)** — `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET` (32+ chars), `FRONTEND_URL` (your Vercel URL)

**Vercel (frontend)** — set root to `frontend/`, add `REACT_APP_API_URL` pointing to your Render backend (no trailing slash)

Build: `./mvnw clean package -DskipTests` · Start: `java -jar target/paymentsystem-0.0.1-SNAPSHOT.jar`

---

MIT
