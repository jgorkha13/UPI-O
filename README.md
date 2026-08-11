# UPI-O — Offline-First P2P Wallet

Simulated UPI-style wallet with offline payment queue, nonce-based sync, and ₹2,000 offline spending cap.

## Stack

- **Backend:** Spring Boot 4, PostgreSQL, JWT
- **Frontend:** React, Tailwind, PWA (Workbox), IndexedDB offline queue

## PWA & offline (full guide)

See **[docs/PWA_OFFLINE.md](docs/PWA_OFFLINE.md)** for architecture, testing steps, and interview notes.

Quick test with installable offline app:

```bash
cd frontend
npm run build
npm run serve
```

Visit once **online** (login + add money), then install **UPI-O** from the banner or browser menu. Open offline later — app still loads and can queue payments.

## Local setup

### Prerequisites

- Java 21
- PostgreSQL
- Node.js 18+

### Database

```sql
CREATE DATABASE payment_db;
CREATE USER payment_user WITH PASSWORD 'payment123';
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
```

### Backend

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21   # adjust for your OS
./mvnw spring-boot:run
```

Runs on **http://localhost:8080**

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on **http://localhost:3000**

## Deploy

### 1. Backend (Render / Railway)

1. Create a **PostgreSQL** database on the platform.
2. Create a **Web Service** from this repo (root directory, not `frontend/`).
3. Build command: `./mvnw clean package -DskipTests`
4. Start command: `java -jar target/paymentsystem-0.0.1-SNAPSHOT.jar`
5. Set environment variables:

| Variable | Example |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://host:5432/dbname` |
| `SPRING_DATASOURCE_USERNAME` | from provider |
| `SPRING_DATASOURCE_PASSWORD` | from provider |
| `JWT_SECRET` | long random string |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `PORT` | usually set automatically |

Copy your backend URL, e.g. `https://upi-o-api.onrender.com`

### 2. Frontend (Vercel / Netlify)

1. Import repo, set **root directory** to `frontend`
2. Build command: `npm run build`
3. Output directory: `build`
4. Environment variable:

| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | your backend URL (no trailing slash) |

5. Redeploy after backend `FRONTEND_URL` matches your frontend URL.

## Offline testing

**Dev mode (`npm start`):** queue works if you go offline without refreshing — wallet cache + IndexedDB only.

**PWA mode (`npm run build && npm run serve`):** full offline including refresh and cold start after install. See [docs/PWA_OFFLINE.md](docs/PWA_OFFLINE.md).

## License

MIT
