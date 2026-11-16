#!/usr/bin/env python3
"""Generate UPI-O Interview Preparation PDF."""

from fpdf import FPDF


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 8, "UPI-O Interview Preparation Guide", align="C")
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def chapter_title(self, title):
        self.ln(4)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(95, 37, 159)
        self.multi_cell(0, 10, title)
        self.ln(2)
        self.set_draw_color(95, 37, 159)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)
        self.set_text_color(0, 0, 0)

    def section_title(self, title):
        self.ln(3)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 8, title)
        self.ln(1)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        x = self.get_x()
        self.cell(5, 5.5, chr(149))
        self.multi_cell(0, 5.5, text)
        self.set_x(x)
        self.ln(1)

    def qa_question(self, q):
        self.ln(2)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(95, 37, 159)
        self.multi_cell(0, 6, f"Q: {q}")
        self.ln(1)

    def qa_answer(self, a):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, f"A: {a}")
        self.ln(2)

    def code_block(self, text):
        self.set_font("Courier", "", 9)
        self.set_fill_color(245, 245, 245)
        self.multi_cell(0, 5, text, fill=True)
        self.ln(2)


def build_pdf(output_path):
    pdf = GuidePDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Cover
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(95, 37, 159)
    pdf.cell(0, 15, "UPI-O", align="C", ln=True)
    pdf.set_font("Helvetica", "", 16)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 10, "Complete Interview Preparation Guide", align="C", ln=True)
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, "Offline-First P2P Wallet | Full-Stack Project", align="C", ln=True)
    pdf.ln(20)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 7, "Author: Jiya Gorkha", align="C", ln=True)
    pdf.cell(0, 7, "Live Demo: https://upi-o-coral.vercel.app", align="C", ln=True)
    pdf.cell(0, 7, "GitHub: https://github.com/jgorkha13/UPI-O", align="C", ln=True)

    # Section 1
    pdf.add_page()
    pdf.chapter_title("1. What Is This Project? (Explain in 30 Seconds)")
    pdf.body_text(
        "UPI-O is a UPI-style digital wallet I built. Users can register with their phone number, "
        "add money to a wallet, and send money to other users by phone number. The special feature "
        "is offline support: if you lose internet (like on a train), you can still queue a payment. "
        "When internet returns, the app automatically syncs that payment to the server."
    )
    pdf.body_text(
        "Tech summary: Java Spring Boot backend, React frontend, PostgreSQL database, "
        "deployed on Render (backend + DB) and Vercel (frontend)."
    )
    pdf.section_title("Your Elevator Pitch (Memorize This)")
    pdf.code_block(
        'I built UPI-O, an offline-first payment wallet. The backend is Spring Boot\n'
        'with JWT authentication and PostgreSQL. The frontend is React with a PWA\n'
        'that queues payments in IndexedDB when offline and syncs them with UUID\n'
        'nonces to prevent duplicates. It is deployed live on Vercel and Render.'
    )

    pdf.chapter_title("2. Tech Stack - Explained for Java Developers")
    pdf.section_title("Backend (You should know this best)")
    pdf.bullet("Java 21 - Programming language")
    pdf.bullet("Spring Boot 4 - Framework that runs your server. Handles HTTP requests, database, security.")
    pdf.bullet("Spring Security - Protects API endpoints. Only logged-in users can access wallet/transactions.")
    pdf.bullet("Spring Data JPA - Talks to PostgreSQL without writing SQL manually.")
    pdf.bullet("PostgreSQL - Database where users, wallets, and transactions are stored.")
    pdf.bullet("JWT (JSON Web Token) - A token given after login. Frontend sends it with every request to prove identity.")
    pdf.bullet("BCrypt - Hashes passwords so they are never stored in plain text.")
    pdf.bullet("Lombok - Reduces boilerplate code (@Data, @RequiredArgsConstructor).")

    pdf.section_title("Frontend (Learn the basics, not every line)")
    pdf.bullet("React - JavaScript library for building UI. Everything is a component (Login page, Dashboard, etc.).")
    pdf.bullet("React Router - Handles page navigation (/login, /dashboard, /send).")
    pdf.bullet("Axios - Sends HTTP requests from browser to your Spring Boot API.")
    pdf.bullet("Tailwind CSS - CSS classes for styling (colors, spacing, responsive design).")
    pdf.bullet("IndexedDB - Browser database for storing offline payment queue.")
    pdf.bullet("localStorage - Browser storage for wallet balance cache and login token.")
    pdf.bullet("Service Worker (Workbox) - Caches app files so the app loads even without internet.")
    pdf.bullet("PWA - Progressive Web App. Users can install UPI-O like a mobile app.")

    pdf.section_title("Deployment")
    pdf.bullet("Vercel - Hosts the React frontend (static files).")
    pdf.bullet("Render - Hosts Spring Boot backend and PostgreSQL database.")
    pdf.bullet("Environment Variables - Secret config (DB password, JWT secret, API URLs) stored on cloud, not in code.")

    pdf.add_page()
    pdf.chapter_title("3. Project Folder Structure")
    pdf.code_block(
        "paymentsystem/\n"
        "  src/main/java/paymentsystem/   <- YOUR JAVA CODE\n"
        "    controller/    REST API endpoints (Auth, Wallet, Transaction)\n"
        "    service/       Business logic (register, send money, etc.)\n"
        "    model/         Database entities (User, Wallet, Transaction)\n"
        "    repository/    Database queries\n"
        "    config/        Security, JWT, CORS settings\n"
        "    dto/           Request objects with validation\n"
        "  src/main/resources/\n"
        "    application.properties   Database and JWT config\n"
        "  frontend/src/    REACT CODE\n"
        "    pages/         Login, Dashboard, SendMoney, etc.\n"
        "    api/           Calls to backend\n"
        "    services/      Offline queue and sync logic\n"
        "    context/       Global state (online/offline, theme)\n"
        "  docs/            Documentation"
    )

    pdf.chapter_title("4. Database Schema (3 Tables)")
    pdf.section_title("users table")
    pdf.bullet("id - Primary key (auto-generated)")
    pdf.bullet("name - User full name")
    pdf.bullet("phone - 10-digit phone (unique, used for login)")
    pdf.bullet("password - BCrypt hashed password")
    pdf.bullet("created_at - Registration timestamp")

    pdf.section_title("wallets table (one per user)")
    pdf.bullet("id - Primary key")
    pdf.bullet("user_id - Links to users table")
    pdf.bullet("balance - Current wallet balance (DECIMAL)")
    pdf.bullet("offline_limit - Max offline spending (default 2000 rupees)")
    pdf.bullet("offline_spent - How much spent offline so far")
    pdf.bullet("last_sync_at - Last wallet update time")

    pdf.section_title("transactions table")
    pdf.bullet("id - Primary key")
    pdf.bullet("sender_id - User who sent money")
    pdf.bullet("receiver_id - User who received money")
    pdf.bullet("amount - Transfer amount")
    pdf.bullet("status - PENDING, COMPLETED, or FAILED")
    pdf.bullet("nonce - Unique UUID from client (prevents duplicate sync)")
    pdf.bullet("is_offline - true if payment was queued offline")
    pdf.bullet("created_at - When transaction happened")

    pdf.body_text("Relationships: One User has One Wallet. One User can have many Transactions as sender or receiver.")

    pdf.add_page()
    pdf.chapter_title("5. All API Endpoints")
    pdf.section_title("Public (No login required)")
    pdf.code_block(
        "POST /api/auth/register\n"
        "  Body: { name, phone, password }\n"
        "  Creates user + wallet. Returns userId and name.\n\n"
        "POST /api/auth/login\n"
        "  Body: { phone, password }\n"
        "  Returns JWT token, userId, name."
    )

    pdf.section_title("Protected (Need JWT token in header)")
    pdf.code_block(
        "Authorization: Bearer <token>\n\n"
        "GET  /api/wallet              Get balance, offline limit, offline spent\n"
        "POST /api/wallet/add          Add money { amount }\n"
        "GET  /api/users/lookup?phone= Look up recipient name before sending\n"
        "POST /api/transactions        Send money { receiverPhone, amount, nonce, isOffline }\n"
        "GET  /api/transactions        Get transaction history"
    )

    pdf.chapter_title("6. Authentication Flow (Step by Step)")
    pdf.body_text("REGISTRATION:")
    pdf.bullet("1. User fills name, phone, password on Register page")
    pdf.bullet("2. Frontend sends POST /api/auth/register")
    pdf.bullet("3. UserService checks phone not already registered")
    pdf.bullet("4. Password hashed with BCrypt and saved to users table")
    pdf.bullet("5. WalletService creates wallet with balance 0 and offline limit 2000")
    pdf.bullet("6. User redirected to Login (no auto-login)")

    pdf.body_text("LOGIN:")
    pdf.bullet("1. User enters phone and password")
    pdf.bullet("2. POST /api/auth/login")
    pdf.bullet("3. UserService finds user by phone, BCrypt matches password")
    pdf.bullet("4. JwtUtil generates token with phone as subject, expires in 24 hours")
    pdf.bullet("5. Frontend saves token in localStorage")
    pdf.bullet("6. Every API call adds header: Authorization: Bearer <token>")

    pdf.body_text("PROTECTED REQUEST:")
    pdf.bullet("1. JwtFilter intercepts every request")
    pdf.bullet("2. Extracts token from Authorization header")
    pdf.bullet("3. Validates token signature and expiry")
    pdf.bullet("4. Sets authenticated user phone in SecurityContext")
    pdf.bullet("5. Controller uses authentication.getName() to get sender phone")

    pdf.add_page()
    pdf.chapter_title("7. Send Money Flow - Online")
    pdf.bullet("1. User opens Send Money, enters 10-digit phone")
    pdf.bullet("2. Frontend calls GET /api/users/lookup to show recipient name")
    pdf.bullet("3. User enters amount, clicks Send")
    pdf.bullet("4. Frontend generates UUID nonce (unique ID for this payment)")
    pdf.bullet("5. POST /api/transactions with receiverPhone, amount, nonce")
    pdf.bullet("6. TransactionService validates: not self, nonce unique, balance enough, min 1 rupee")
    pdf.bullet("7. Debits sender wallet, credits receiver wallet (same database transaction)")
    pdf.bullet("8. Saves transaction with status COMPLETED")
    pdf.bullet("9. Frontend refreshes wallet balance on dashboard")

    pdf.chapter_title("8. Send Money Flow - Offline")
    pdf.bullet("1. navigator.onLine is false - browser detects no internet")
    pdf.bullet("2. User can still enter phone and amount")
    pdf.bullet("3. Amount checked against cached balance AND offline limit (2000 rupees cap)")
    pdf.bullet("4. Frontend generates UUID nonce")
    pdf.bullet("5. Payment saved to IndexedDB (browser database) with status PENDING_SYNC")
    pdf.bullet("6. localStorage wallet cache updated (balance reduced locally)")
    pdf.bullet("7. Toast message: Transaction queued for sync")
    pdf.bullet("8. NO server call happens yet")

    pdf.section_title("When Internet Returns (Sync)")
    pdf.bullet("1. Browser fires online event")
    pdf.bullet("2. OfflineContext detects reconnect")
    pdf.bullet("3. syncService reads all pending transactions from IndexedDB")
    pdf.bullet("4. For each: POST /api/transactions with isOffline=true")
    pdf.bullet("5. Server validates balance, offline cap, receiver exists")
    pdf.bullet("6. Success: delete from IndexedDB, refresh wallet")
    pdf.bullet("7. Permanent failure (receiver not found, duplicate nonce): drop from queue")
    pdf.bullet("8. Temporary failure: keep in queue for retry")

    pdf.chapter_title("9. Key Java Classes (Know These by Name)")
    pdf.section_title("Controllers")
    pdf.bullet("AuthController - /api/auth/register and /api/auth/login")
    pdf.bullet("WalletController - get wallet, add money")
    pdf.bullet("TransactionController - send money, get history")
    pdf.bullet("UserController - lookup user by phone")
    pdf.bullet("GlobalExceptionHandler - converts errors to JSON { error: message }")

    pdf.section_title("Services")
    pdf.bullet("UserService - register, login, lookupByPhone")
    pdf.bullet("WalletService - createWallet, getWalletByPhone, addMoney")
    pdf.bullet("TransactionService - sendMoney (main logic), getHistory")

    pdf.section_title("Config")
    pdf.bullet("SecurityConfig - which URLs are public vs protected")
    pdf.bullet("JwtFilter - reads and validates JWT on every request")
    pdf.bullet("JwtUtil - creates and validates JWT tokens")
    pdf.bullet("CorsConfig - allows frontend domain to call backend API")

    pdf.add_page()
    pdf.chapter_title("10. Security Features")
    pdf.bullet("Passwords hashed with BCrypt - never stored as plain text")
    pdf.bullet("JWT stateless auth - no server sessions")
    pdf.bullet("All /api/* except /api/auth/** require valid token")
    pdf.bullet("CORS restricts API calls to your Vercel frontend URL only")
    pdf.bullet("Nonce (UUID) prevents duplicate payments on sync")
    pdf.bullet("Offline spending capped at 2000 rupees server-side")
    pdf.bullet("Cannot send money to yourself")
    pdf.bullet("@Transactional on sendMoney - debit and credit happen together or rollback")

    pdf.section_title("Honest Weaknesses (Say These If Asked 'What Would You Improve?')")
    pdf.bullet("JWT stored in localStorage (XSS risk) - HttpOnly cookies would be better")
    pdf.bullet("No refresh token - user must re-login after 24 hours")
    pdf.bullet("No rate limiting on login API")
    pdf.bullet("offline_spent never resets after sync")
    pdf.bullet("Scan Pay page is UI only - no real QR scanning")

    pdf.chapter_title("11. Deployment Setup")
    pdf.section_title("Render (Backend + Database)")
    pdf.bullet("SPRING_DATASOURCE_URL - PostgreSQL connection string")
    pdf.bullet("SPRING_DATASOURCE_USERNAME and PASSWORD")
    pdf.bullet("JWT_SECRET - at least 32 characters")
    pdf.bullet("FRONTEND_URL - https://upi-o-coral.vercel.app (for CORS)")
    pdf.bullet("Build: ./mvnw clean package -DskipTests")
    pdf.bullet("Start: java -jar target/paymentsystem-0.0.1-SNAPSHOT.jar")

    pdf.section_title("Vercel (Frontend)")
    pdf.bullet("Root directory: frontend")
    pdf.bullet("REACT_APP_API_URL - Render backend URL")
    pdf.bullet("Build: npm run build, Output: build")

    pdf.chapter_title("12. Frontend Pages (Simple Explanation)")
    pdf.bullet("Login.jsx - Login form, saves token to localStorage")
    pdf.bullet("Register.jsx - Create account form")
    pdf.bullet("Dashboard.jsx - Shows balance, recent transactions, quick actions")
    pdf.bullet("SendMoney.jsx - 3-step send flow, handles online vs offline")
    pdf.bullet("AddMoney.jsx - Add funds to wallet")
    pdf.bullet("TransactionHistory.jsx - Full passbook with filters")
    pdf.bullet("Profile.jsx - User info, theme toggle, logout")
    pdf.bullet("ScanPay.jsx - UI mockup only (coming soon feature)")
    pdf.bullet("App.js - Defines all routes and ProtectedRoute wrapper")

    pdf.add_page()
    pdf.chapter_title("13. Interview Questions and Answers")

    qa = [
        ("What is UPI-O?",
         "An offline-first peer-to-peer wallet inspired by UPI. Users send money by phone number. "
         "Payments can be queued offline and synced when connectivity returns."),

        ("Why did you build this?",
         "To demonstrate full-stack skills: REST API with Spring Boot, React frontend, database design, "
         "JWT auth, and a real-world offline problem (payments without network)."),

        ("Explain your tech stack.",
         "Backend: Java 21, Spring Boot 4, PostgreSQL, JWT. Frontend: React, Tailwind, IndexedDB for offline queue. "
         "Deployed on Render and Vercel."),

        ("What is Spring Boot?",
         "A Java framework that auto-configures a web server, database connection, and security. "
         "I use it to expose REST APIs that the React frontend calls."),

        ("What is JWT and how do you use it?",
         "JSON Web Token. After login, server creates a signed token containing the user phone number. "
         "Frontend sends it in Authorization header. JwtFilter validates it on every protected request."),

        ("Why JWT instead of sessions?",
         "JWT is stateless - server does not store session data. Good for SPAs and cloud deployment. "
         "Frontend handles the token; backend just validates signature."),

        ("How are passwords stored?",
         "BCrypt hashed in the users table. On login, BCryptPasswordEncoder.matches() compares "
         "plain password with hash. Plain passwords never stored."),

        ("Explain your database design.",
         "Three tables: users (auth), wallets (one per user with balance and offline limits), "
         "transactions (sender, receiver, amount, nonce, status). JPA/Hibernate creates tables automatically."),

        ("What is JPA?",
         "Java Persistence API. Maps Java classes (User, Wallet) to database tables. "
         "Repositories like findByPhone() are auto-generated from method names."),

        ("How does send money work?",
         "TransactionService.sendMoney() validates nonce, balance, and rules. Debits sender wallet, "
         "credits receiver wallet in one @Transactional block. Saves COMPLETED transaction."),

        ("What is a nonce and why?",
         "A UUID generated by the client for each payment. Stored unique in transactions table. "
         "If same payment syncs twice (network retry), server rejects duplicate nonce."),

        ("Explain offline payments.",
         "When offline, payment saved in IndexedDB with PENDING_SYNC status. Wallet cache updated locally. "
         "On reconnect, syncService POSTs each to server. Server is source of truth at sync time."),

        ("What is the 2000 rupee offline cap?",
         "Each wallet has offline_limit=2000 and offline_spent tracked server-side. "
         "Offline payments with isOffline=true cannot exceed remaining offline allowance."),

        ("What is IndexedDB?",
         "Browser built-in database. I use it to store offline payment queue with nonce as primary key. "
         "Persists even if user closes the app."),

        ("What is a PWA?",
         "Progressive Web App. Service worker caches HTML/JS/CSS so app loads offline. "
         "User can install UPI-O to home screen like a native app."),

        ("What is CORS?",
         "Cross-Origin Resource Sharing. Browser blocks frontend (Vercel) from calling backend (Render) "
         "unless backend explicitly allows that origin. CorsConfig sets FRONTEND_URL as allowed origin."),

        ("What is React?",
         "JavaScript UI library. Each page is a component. State (useState) holds data; useEffect runs side effects. "
         "I used it because component-based UI fits a multi-page wallet app."),

        ("What is Axios?",
         "HTTP client for JavaScript. Configured with base URL and interceptor that attaches JWT token automatically."),

        ("How do you handle errors?",
         "GlobalExceptionHandler returns JSON { error: message } with 400 status. "
         "Frontend shows toast with error message. Offline sync drops non-retryable errors."),

        ("What is @Transactional?",
         "Spring annotation. If debit succeeds but credit fails, entire operation rolls back. "
         "Prevents money disappearing from sender without reaching receiver."),

        ("How did you deploy?",
         "Frontend on Vercel (static React build). Backend JAR on Render with PostgreSQL. "
         "Environment variables connect them: REACT_APP_API_URL and FRONTEND_URL for CORS."),

        ("What happens if sync fails due to insufficient balance?",
         "Server returns error. syncService marks as non-retryable and removes from IndexedDB. "
         "User sees toast. This can happen if they queued more offline than actual balance."),

        ("Can user login offline?",
         "No. Login requires API call. But once logged in and app installed, they can use cached session and queue payments."),

        ("What is Spring Security?",
         "Framework that secures endpoints. SecurityConfig defines /api/auth/** as public, everything else needs JWT. "
         "JwtFilter runs before controllers to validate token."),

        ("Difference between Controller and Service?",
         "Controller receives HTTP request and returns response. Service contains business logic. "
         "Good practice: thin controllers, fat services."),

        ("What is a DTO?",
         "Data Transfer Object. RegisterRequest, LoginRequest validate input with @NotBlank, @Size annotations "
         "before reaching service layer."),

        ("What is ddl-auto=update?",
         "Hibernate automatically creates/updates database tables from Java entities. "
         "Good for development. Production often uses Flyway/Liquibase migrations instead."),

        ("Why PostgreSQL not MySQL?",
         "Both work. PostgreSQL has strong ACID compliance for financial transactions. "
         "Render free tier offers PostgreSQL easily."),

        ("What is the wallet created with on register?",
         "Balance 0, offline_limit 2000, offline_spent 0. One wallet per user via WalletService.createWallet()."),

        ("How does user lookup work before sending?",
         "GET /api/users/lookup?phone= returns name and UPI ID (phone@upio). "
         "Frontend caches contacts in localStorage for offline use."),
    ]

    for q, a in qa:
        if pdf.get_y() > 250:
            pdf.add_page()
        pdf.qa_question(q)
        pdf.qa_answer(a)

    pdf.add_page()
    pdf.chapter_title("14. Tough Cross-Questions (Be Ready)")

    cross = [
        ("If you only know Java, how did you build the frontend?",
         "I used React which is component-based - similar idea to separating concerns in Java. "
         "Axios calls my REST API like any HTTP client. I focused on understanding the flow: "
         "which page calls which API and what data it sends."),

        ("Walk me through the code when user clicks Send.",
         "Frontend SendMoney.jsx generates nonce, calls POST /api/transactions. "
         "JwtFilter validates token. TransactionController calls TransactionService.sendMoney(). "
         "Service validates, updates two wallets, saves transaction, returns success."),

        ("What if two offline payments sync at the same time?",
         "Each has unique nonce. @Transactional ensures wallet updates are atomic. "
         "Database handles concurrent updates. Duplicate nonce rejected by existsByNonce check."),

        ("Why not use Redis for offline queue?",
         "Offline queue must live on client device - server is unreachable. IndexedDB persists locally. "
         "Redis would be server-side and useless when client has no network."),

        ("Is this production-ready?",
         "Honest answer: It is a portfolio/demo project. For production I would add: "
         "HttpOnly cookies, refresh tokens, rate limiting, proper migrations, audit logs, "
         "payment reconciliation, and PCI/compliance review."),

        ("Explain MVC in your project.",
         "Model = JPA entities (User, Wallet, Transaction). "
         "View = React pages. Controller = Spring REST controllers. "
         "Service layer sits between controller and repository."),

        ("What design patterns did you use?",
         "Repository pattern (Spring Data JPA), Filter pattern (JwtFilter), "
         "DTO pattern (request objects), Singleton (Spring beans), "
         "Interceptor pattern (Axios request interceptor for JWT)."),

        ("How do you test offline mode?",
         "Build PWA with npm run build && npm run serve. Login online, add money, install app. "
         "Turn off wifi, send payment, turn wifi on - watch it sync."),

        ("What is Workbox?",
         "Google library for service workers. Precaches JS/CSS/HTML on first visit. "
         "Serves cached files when offline. API calls are never cached - only static assets."),

        ("What would you do differently?",
         "Add unit tests for TransactionService, use Flyway migrations, "
         "implement refresh tokens, reset offline_spent after sync, add real QR payments."),
    ]

    for q, a in cross:
        if pdf.get_y() > 245:
            pdf.add_page()
        pdf.qa_question(q)
        pdf.qa_answer(a)

    pdf.add_page()
    pdf.chapter_title("15. Quick Reference Cheat Sheet")
    pdf.code_block(
        "Live App:     https://upi-o-coral.vercel.app\n"
        "GitHub:       https://github.com/jgorkha13/UPI-O\n"
        "Local Backend:  http://localhost:8080\n"
        "Local Frontend: http://localhost:3000\n\n"
        "Tables:       users, wallets, transactions\n"
        "Auth:         JWT, BCrypt, 24h expiry\n"
        "Offline cap:  Rs. 2000 per wallet\n"
        "Dedup key:    UUID nonce\n"
        "Offline DB:   IndexedDB (UPIODB)\n"
        "Cache:        localStorage (wallet, contacts, token)\n\n"
        "Key files:\n"
        "  TransactionService.java  - send money logic\n"
        "  JwtFilter.java           - token validation\n"
        "  SecurityConfig.java      - endpoint security\n"
        "  SendMoney.jsx            - send UI + offline queue\n"
        "  syncService.js           - sync on reconnect\n"
        "  offlineService.js        - IndexedDB operations"
    )

    pdf.chapter_title("16. Before Your Interview Checklist")
    pdf.bullet("Open live app and demo: register, login, add money, send money")
    pdf.bullet("Know your GitHub link by heart")
    pdf.bullet("Explain JWT flow in under 1 minute")
    pdf.bullet("Explain offline flow in under 1 minute")
    pdf.bullet("Name 3 Java classes and what they do")
    pdf.bullet("Know your deployment: Vercel + Render + PostgreSQL")
    pdf.bullet("Prepare 2 weaknesses and how you would fix them")
    pdf.bullet("Run backend locally once: ./mvnw spring-boot:run")
    pdf.bullet("Be honest: 'I focused on Java backend; React frontend I understand at flow level'")

    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, "Good luck with your interviews! - Jiya Gorkha", align="C")

    pdf.output(output_path)
    print(f"PDF created: {output_path}")


if __name__ == "__main__":
    build_pdf("/Users/jiya_gorkha/Downloads/paymentsystem/docs/UPI-O_Interview_Guide.pdf")
