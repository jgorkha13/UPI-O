# UPI-O

**Offline-first peer-to-peer wallet inspired by UPI**

[![Live Demo](https://img.shields.io/badge/demo-live-5f259f?style=for-the-badge)](https://upi-o-coral.vercel.app)

UPI-O is a full-stack payment wallet that supports instant online transfers and offline payment queuing. When connectivity drops, payments are saved locally and synced automatically once the device is back online.

**Live application:** https://upi-o-coral.vercel.app

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Offline and PWA](#offline-and-pwa)
- [Deployment](#deployment)
- [License](#license)

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

| Layer      | Technologies                                      |
| ---------- | ------------------------------------------------- |
| Backend    | Java 21, Spring Boot 4, PostgreSQL, JWT           |
| Frontend   | React, Tailwind CSS, React Router                 |
| Offline    | IndexedDB, Service Worker (Workbox)               |
| Deployment | Vercel (frontend), Render (backend and database)  |

---

## Getting Started

### Prerequisites

- Java 21
- PostgreSQL
- Node.js 18 or later

### 1. Database setup

```sql
CREATE DATABASE payment_db;
CREATE USER payment_user WITH PASSWORD 'payment123';
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
```

Update `src/main/resources/application.properties` with your local database credentials if needed.

### 2. Start the backend

From the project root:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`.

---

## Offline and PWA

UPI-O supports three layers of offline functionality:

1. **Service worker** - caches the app shell for offline loading
2. **Local storage** - caches wallet balance and contact data
3. **IndexedDB queue** - stores pending payments until sync

To test the installable PWA locally:

```bash
cd frontend
npm run build
npm run serve
```

Open the app while online, log in, and add funds. Install the app from the browser prompt, then disconnect the network and send a payment to verify offline queuing.

For a detailed architecture guide, see [docs/PWA_OFFLINE.md](docs/PWA_OFFLINE.md).

---

## Deployment

| Component | Platform            |
| --------- | ------------------- |
| Frontend  | Vercel              |
| Backend   | Render              |
| Database  | Render (PostgreSQL) |

Only the frontend URL should be shared with end users. The backend is an internal API and does not serve a web interface.

### Backend (Render)

| Variable                     | Description                          |
| ---------------------------- | ------------------------------------ |
| `SPRING_DATASOURCE_URL`      | PostgreSQL JDBC connection string    |
| `SPRING_DATASOURCE_USERNAME` | Database username                    |
| `SPRING_DATASOURCE_PASSWORD` | Database password                    |
| `JWT_SECRET`                 | Secret key (minimum 32 characters)   |
| `FRONTEND_URL`               | Vercel frontend URL for CORS         |

**Build command:** `./mvnw clean package -DskipTests`  
**Start command:** `java -jar target/paymentsystem-0.0.1-SNAPSHOT.jar`

### Frontend (Vercel)

| Variable            | Description                                |
| ------------------- | ------------------------------------------ |
| `REACT_APP_API_URL` | Render backend URL (no trailing slash)     |

Set the root directory to `frontend`, build command to `npm run build`, and output directory to `build`.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Jiya Gorkha**

- GitHub: [@jgorkha13](https://github.com/jgorkha13)
- Project: [UPI-O](https://github.com/jgorkha13/UPI-O)
