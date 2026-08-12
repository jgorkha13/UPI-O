# UPI-O

Offline-first peer-to-peer wallet inspired by UPI.

**Live Demo:** https://upi-o-coral.vercel.app

UPI-O is a full-stack payment wallet that supports instant online transfers and offline payment queuing. When connectivity drops, payments are saved locally and synced automatically once the device is back online.

---

## Features

- User registration and login with JWT authentication
- Wallet balance management and transaction history
- Peer-to-peer money transfer via phone number
- Offline payment queue with automatic sync
- Nonce-based deduplication to prevent duplicate transactions
- Offline spending limit of Rs. 2,000
- Progressive Web App (installable on mobile and desktop)
- Light and dark theme support

---

## Tech Stack

| Layer      | Technologies                                     |
| ---------- | ------------------------------------------------ |
| Backend    | Java 21, Spring Boot 4, PostgreSQL, JWT          |
| Frontend   | React, Tailwind CSS, React Router                |
| Offline    | IndexedDB, Service Worker (Workbox)              |
| Deployment | Vercel (frontend), Render (backend and database) |

---

## Getting Started

### Prerequisites

- Java 21
- PostgreSQL
- Node.js 18 or later

### Database setup

```sql
CREATE DATABASE payment_db;
CREATE USER payment_user WITH PASSWORD 'payment123';
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
```

### Start the backend

```bash
./mvnw spring-boot:run
```

API runs at http://localhost:8080

### Start the frontend

```bash
cd frontend
npm install
npm start
```

App runs at http://localhost:3000

---

## Offline and PWA

UPI-O supports offline use in three ways:

1. Service worker caches the app shell
2. Local storage caches wallet balance and contacts
3. IndexedDB queues pending payments until sync

Test the installable PWA locally:

```bash
cd frontend
npm run build
npm run serve
```

Log in while online, install the app, then disconnect the network and send a payment to verify offline queuing.

See [docs/PWA_OFFLINE.md](docs/PWA_OFFLINE.md) for full architecture details.

---

## Deployment

| Component | Platform            |
| --------- | ------------------- |
| Frontend  | Vercel              |
| Backend   | Render              |
| Database  | Render (PostgreSQL) |

Share only the frontend URL with users. The backend is an internal API.

### Backend environment variables (Render)

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (minimum 32 characters)
- `FRONTEND_URL` (your Vercel URL)

Build: `./mvnw clean package -DskipTests`  
Start: `java -jar target/paymentsystem-0.0.1-SNAPSHOT.jar`

### Frontend environment variables (Vercel)

- `REACT_APP_API_URL` (Render backend URL, no trailing slash)
- Root directory: `frontend`

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Author

Jiya Gorkha

- GitHub: https://github.com/jgorkha13
- Repository: https://github.com/jgorkha13/UPI-O
