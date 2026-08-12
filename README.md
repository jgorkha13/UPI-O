UPI-O

An offline-first peer-to-peer wallet application inspired by UPI. Send and receive payments instantly when online, or queue transactions offline with automatic sync upon reconnection.

Live Demo

About

UPI-O is a full-stack payment wallet application designed to demonstrate modern web technologies and offline-first design patterns. The application enables seamless peer-to-peer transfers with robust offline support, allowing users to initiate transactions regardless of connectivity status.

Features
User Authentication – Secure registration and JWT-based login
Digital Wallet – Manage balance and view complete transaction history
P2P Transfers – Send money using recipient phone numbers
Offline-First – Queue payments offline (capped at Rs. 2,000) and automatically sync when connectivity returns
Progressive Web App – Installable on mobile and desktop with full PWA capabilities
Dark & Light Themes – Support for user preference-based theming
Technology Stack

Backend

Java 21 + Spring Boot 4
PostgreSQL
JWT authentication

Frontend

React
Tailwind CSS
IndexedDB (offline storage)
Workbox (service workers)
Getting Started
Prerequisites
Java 21 or later
PostgreSQL 12+
Node.js 18+ and npm
Setup Instructions

1. Database Setup

sql
CREATE DATABASE payment_db;
CREATE USER payment_user WITH PASSWORD 'payment123';
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;

2. Start Backend

bash
./mvnw spring-boot:run

Backend runs at http://localhost:8080

3. Start Frontend

bash
cd frontend
npm install
npm start

Frontend runs at http://localhost:3000

Test Offline Mode
bash
cd frontend
npm run build
npm run serve
Log in while online
Disconnect network (DevTools or system settings)
Send a payment – it queues locally in IndexedDB
Reconnect to network – transactions sync automatically

See docs/PWA_OFFLINE.md for more details.

Deployment

Frontend: Vercel
Backend API: Render
Database: Render PostgreSQL

Backend Environment Variables

Set these in your Render dashboard:

SPRING_DATASOURCE_URL – PostgreSQL connection string
SPRING_DATASOURCE_USERNAME – Database user
SPRING_DATASOURCE_PASSWORD – Database password
JWT_SECRET – Secret key (minimum 32 characters)
FRONTEND_URL – Vercel app URL for CORS
Frontend Environment Variables

Set in your Vercel project settings:

REACT_APP_API_URL – Render backend URL (no trailing slash)

Build directory: frontend

How It Works

Online Mode

User initiates transfer via phone number
Request sent directly to backend API
Transaction processed immediately

Offline Mode

Payments queue locally in IndexedDB (Rs. 2,000 limit)
Stored with timestamp and metadata
Automatically syncs when connection returns
License

MIT License – see LICENSE file for details.

Contributing

Contributions welcome! Fork the repository and submit a pull request.

Questions or Issues?

Open an issue on the GitHub repository.
