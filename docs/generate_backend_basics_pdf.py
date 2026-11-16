#!/usr/bin/env python3
"""Backend Basics PDF - Easy language for beginners."""

from fpdf import FPDF


class BackendPDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 8, f"Page {self.page_no()} | Backend Basics Guide | Jiya Gorkha", align="C")

    def cover(self):
        self.add_page()
        self.ln(35)
        self.set_font("Helvetica", "B", 24)
        self.set_text_color(95, 37, 159)
        self.cell(0, 12, "Backend Basics", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 14)
        self.set_text_color(60, 60, 60)
        self.cell(0, 10, "APIs, Servers, Databases & More", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(8)
        self.set_font("Helvetica", "", 11)
        self.cell(0, 7, "Easy language guide for interviews", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 7, "Based on your UPI-O project", align="C", new_x="LMARGIN", new_y="NEXT")

    def chapter(self, num, title):
        self.ln(4)
        if self.get_y() > 250:
            self.add_page()
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(95, 37, 159)
        self.multi_cell(0, 8, f"{num}. {title}")
        self.ln(2)
        self.set_draw_color(95, 37, 159)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)
        self._reset_x()
        self.set_text_color(0, 0, 0)

    def _reset_x(self):
        self.set_x(self.l_margin)

    def h3(self, title):
        self._reset_x()
        self.ln(2)
        self.set_font("Helvetica", "B", 11)
        self.multi_cell(0, 7, title)
        self.ln(1)

    def p(self, text):
        self._reset_x()
        self.set_font("Helvetica", "", 10)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.cell(5, 5.5, "-")
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def box(self, text):
        self.set_font("Helvetica", "", 9)
        self.set_fill_color(245, 240, 255)
        self.multi_cell(0, 5, text, fill=True)
        self.ln(2)

    def code(self, text):
        self.set_font("Courier", "", 8.5)
        self.set_fill_color(248, 248, 248)
        self.multi_cell(0, 4.5, text, fill=True)
        self.ln(2)

    def table2(self, rows):
        for a, b in rows:
            self._reset_x()
            self.set_font("Helvetica", "B", 9)
            self.multi_cell(0, 5, f"{a}:")
            self._reset_x()
            self.set_font("Helvetica", "", 9)
            self.multi_cell(0, 5, b)
            self.ln(1)
        self.ln(1)


def build():
    pdf = BackendPDF()
    pdf.set_auto_page_break(True, margin=18)
    pdf.cover()

    pdf.add_page()
    pdf.chapter("1", "Frontend vs Backend - What Is What?")
    pdf.p(
        "Think of a restaurant. Frontend = dining area (what customer sees). "
        "Backend = kitchen (where food is actually made). Customer orders from menu (UI). "
        "Kitchen prepares food (logic + database). Waiter brings food back (API response)."
    )
    pdf.table2([
        ("Frontend", "What user sees and clicks. React, HTML, CSS. Runs in browser on user's phone/laptop."),
        ("Backend", "Brain of the app. Java/Spring Boot. Runs on a server in the cloud."),
        ("Database", "Storage room. PostgreSQL. Keeps users, balances, transactions permanently."),
    ])
    pdf.box("In UPI-O: React app on Vercel = frontend. Spring Boot on Render = backend. PostgreSQL = database.")

    pdf.chapter("2", "What Is a Server?")
    pdf.p(
        "A server is just a computer that runs 24/7 and waits for requests. "
        "When you open UPI-O, your phone sends a request to the Render server. "
        "The server runs your Java code and sends back a response."
    )
    pdf.bullet("Local server: your Mac running ./mvnw spring-boot:run on port 8080")
    pdf.bullet("Cloud server: Render runs same Java app so anyone on internet can use it")
    pdf.bullet("Server does not have a screen - it only listens and responds")

    pdf.chapter("3", "What Is an API?")
    pdf.p(
        "API = Application Programming Interface. Simple meaning: a set of URLs your frontend "
        "can call to get work done. Like a menu of actions the backend offers."
    )
    pdf.box("Analogy: API is like a waiter. You say 'I want to login' (request). Waiter goes to kitchen (backend). Brings result (response).")
    pdf.h3("UPI-O API examples")
    pdf.code(
        "POST /api/auth/login       -> Login user\n"
        "POST /api/auth/register    -> Create account\n"
        "GET  /api/wallet           -> Get balance\n"
        "POST /api/wallet/add       -> Add money\n"
        "POST /api/transactions     -> Send money\n"
        "GET  /api/transactions     -> View history"
    )
    pdf.p("Each line is one API endpoint. Frontend calls these. Backend handles them.")

    pdf.chapter("4", "HTTP - How Frontend Talks to Backend")
    pdf.p("Every API call uses HTTP. Think of it as the language browsers and servers use to communicate.")

    pdf.h3("HTTP Methods (verbs)")
    pdf.table2([
        ("GET", "Read/fetch data. Example: get wallet balance. Does not change anything."),
        ("POST", "Create or do action. Example: login, send money, register."),
        ("PUT", "Update existing data (replace)."),
        ("DELETE", "Remove data."),
    ])
    pdf.p("UPI-O mostly uses GET (fetch) and POST (actions).")

    pdf.h3("HTTP Status Codes (important for interviews)")
    pdf.table2([
        ("200 OK", "Success. Request worked."),
        ("201 Created", "New resource created (e.g. registered user)."),
        ("400 Bad Request", "Wrong input. Invalid phone, wrong password format."),
        ("401 Unauthorized", "Not logged in or token expired."),
        ("403 Forbidden", "Logged in but not allowed."),
        ("404 Not Found", "URL or user does not exist."),
        ("500 Internal Server Error", "Backend crashed or bug. Server's fault."),
    ])
    pdf.box("If login fails with wrong password -> backend sends 400 with { error: 'Invalid credentials' }")

    pdf.add_page()
    pdf.chapter("5", "JSON - Data Format")
    pdf.p(
        "JSON = JavaScript Object Notation. Text format to send data between frontend and backend. "
        "Looks like key-value pairs. Both React and Java understand it."
    )
    pdf.h3("Example: Login request (frontend sends)")
    pdf.code('{\n  "phone": "9876543210",\n  "password": "mypassword123"\n}')
    pdf.h3("Example: Login response (backend sends back)")
    pdf.code('{\n  "token": "eyJhbGciOiJIUzI1NiJ9...",\n  "userId": "2",\n  "name": "Jiya"\n}')
    pdf.p("Axios in React converts JavaScript objects to JSON automatically.")

    pdf.chapter("6", "REST API - The Standard You Used")
    pdf.p(
        "REST = common style for building APIs. Rules: use URLs for resources, HTTP methods for actions, "
        "stateless (each request has all info needed)."
    )
    pdf.bullet("Resource = noun in URL: /api/wallet, /api/transactions")
    pdf.bullet("Action = HTTP method: GET to read, POST to create/act")
    pdf.bullet("Stateless = server does not remember you between requests unless you send token")
    pdf.box("REST is why your URLs look clean. Not /doLogin?action=xyz but POST /api/auth/login")

    pdf.chapter("7", "Database Basics")
    pdf.p(
        "Database stores data permanently. If server restarts, data stays. "
        "UPI-O uses PostgreSQL (relational database = data in tables with relationships)."
    )
    pdf.h3("Your 3 tables")
    pdf.table2([
        ("users", "id, name, phone, password (hashed), created_at"),
        ("wallets", "id, user_id, balance, offline_limit, offline_spent"),
        ("transactions", "id, sender_id, receiver_id, amount, nonce, status"),
    ])
    pdf.h3("Basic SQL (know these words)")
    pdf.code(
        "SELECT * FROM users WHERE phone = '9876543210';  -- fetch user\n"
        "INSERT INTO users (name, phone, password) VALUES (...);  -- add user\n"
        "UPDATE wallets SET balance = 500 WHERE user_id = 2;  -- update balance"
    )
    pdf.p("In your project, you rarely write SQL by hand. JPA/Spring Data does it for you via Repository interfaces.")

    pdf.chapter("8", "JPA & Repository - How Java Talks to Database")
    pdf.p(
        "JPA = Java Persistence API. Maps Java classes to database tables. "
        "User.java class = users table. You call repository.findByPhone() and Java generates SQL."
    )
    pdf.code(
        "UserRepository.findByPhone('9876543210')\n"
        "  -> SQL: SELECT * FROM users WHERE phone = '9876543210'\n\n"
        "TransactionRepository.existsByNonce('abc-123')\n"
        "  -> SQL: SELECT COUNT(*) FROM transactions WHERE nonce = 'abc-123'"
    )
    pdf.box("Interview line: 'I use Spring Data JPA repositories so I don't write raw SQL for basic queries.'")

    pdf.add_page()
    pdf.chapter("9", "Spring Boot - Your Backend Framework")
    pdf.p(
        "Spring Boot is a Java framework that sets up web server, database connection, "
        "security, and REST endpoints with less boilerplate code."
    )
    pdf.h3("Key parts in your project")
    pdf.table2([
        ("Controller", "Receives HTTP request, returns response. AuthController, WalletController."),
        ("Service", "Business logic. UserService, TransactionService. Where rules live."),
        ("Repository", "Database access. UserRepository, WalletRepository."),
        ("Model/Entity", "Java class = table row. User, Wallet, Transaction."),
        ("DTO", "Request object with validation. RegisterRequest, LoginRequest."),
        ("Config", "Settings. SecurityConfig, JwtFilter, CorsConfig."),
    ])
    pdf.box("Flow: Request -> Controller -> Service -> Repository -> Database -> back up the chain")

    pdf.h3("Important Spring annotations (memorize)")
    pdf.table2([
        ("@RestController", "Marks class as API controller. Returns JSON."),
        ("@PostMapping", "Handles POST request at given URL."),
        ("@GetMapping", "Handles GET request."),
        ("@Autowired", "Spring injects dependency automatically."),
        ("@Service", "Marks business logic class."),
        ("@Transactional", "All DB changes succeed together or rollback."),
    ])

    pdf.chapter("10", "Authentication & JWT")
    pdf.p(
        "Authentication = proving who you are. Authorization = what you're allowed to do. "
        "UPI-O uses JWT (JSON Web Token) for authentication."
    )
    pdf.h3("Login flow in simple steps")
    pdf.bullet("1. User sends phone + password")
    pdf.bullet("2. Backend checks password (BCrypt hash compare)")
    pdf.bullet("3. Backend creates JWT token containing user phone")
    pdf.bullet("4. Frontend saves token in localStorage")
    pdf.bullet("5. Every next request sends: Authorization: Bearer <token>")
    pdf.bullet("6. JwtFilter validates token before allowing access")

    pdf.box(
        "Why JWT? Server doesn't store sessions. Token is self-contained and signed. "
        "Good for mobile/web apps and cloud deployment."
    )

    pdf.h3("BCrypt - Password security")
    pdf.p(
        "Never store plain passwords. BCrypt converts 'mypassword123' into random-looking hash. "
        "On login, BCrypt.matches(typedPassword, storedHash) checks without decoding."
    )

    pdf.chapter("11", "CORS - Why Frontend Needs Permission")
    pdf.p(
        "Browser security rule: JavaScript on upi-o-coral.vercel.app cannot call upi-o.onrender.com "
        "unless backend explicitly allows it. That permission is CORS."
    )
    pdf.bullet("Frontend URL: https://upi-o-coral.vercel.app")
    pdf.bullet("Backend sets FRONTEND_URL env var")
    pdf.bullet("CorsConfig.java allows that origin to call /api/**")
    pdf.box("Without CORS: login works in Postman but fails in browser. Very common beginner bug.")

    pdf.add_page()
    pdf.chapter("12", "Environment Variables")
    pdf.p(
        "Secret settings stored outside code. Database password, JWT secret, URLs. "
        "Set on Render/Vercel dashboard, not committed to GitHub."
    )
    pdf.code(
        "SPRING_DATASOURCE_URL      -> PostgreSQL connection\n"
        "SPRING_DATASOURCE_USERNAME -> DB username\n"
        "SPRING_DATASOURCE_PASSWORD -> DB password\n"
        "JWT_SECRET                 -> Token signing key\n"
        "FRONTEND_URL               -> CORS allowed origin\n"
        "REACT_APP_API_URL          -> Frontend knows backend URL"
    )
    pdf.box("Interview: 'We use env vars so secrets aren't in source code and differ per environment.'")

    pdf.chapter("13", "Request Lifecycle - Full Picture")
    pdf.p("When user sends money in UPI-O, this happens:")
    pdf.code(
        "1. User clicks Send in React (SendMoney.jsx)\n"
        "2. Axios POST /api/transactions + JSON body + JWT header\n"
        "3. Request travels over internet to Render server\n"
        "4. JwtFilter validates token\n"
        "5. TransactionController receives request\n"
        "6. TransactionService.sendMoney() runs business rules\n"
        "7. WalletRepository updates sender and receiver balance\n"
        "8. TransactionRepository saves transaction row\n"
        "9. JSON success response sent back\n"
        "10. React shows success toast, refreshes balance"
    )

    pdf.chapter("14", "Deployment - How It All Connects")
    pdf.table2([
        ("Vercel", "Hosts React build (HTML/JS/CSS). User visits this URL."),
        ("Render Web Service", "Runs Java JAR. Handles /api/* requests."),
        ("Render PostgreSQL", "Stores all data. Only backend connects to it."),
    ])
    pdf.p(
        "User never opens backend URL in browser. Frontend JavaScript calls backend API in background. "
        "Render free tier sleeps when idle - first request may take 30-60 seconds (cold start)."
    )

    pdf.chapter("15", "Common Backend Terms Glossary")
    terms = [
        ("API", "Set of URLs backend exposes for frontend to call"),
        ("Endpoint", "One specific API URL e.g. POST /api/auth/login"),
        ("Request", "Data frontend sends to backend"),
        ("Response", "Data backend sends back"),
        ("Payload", "Body of request (usually JSON)"),
        ("Header", "Extra info with request e.g. Authorization token"),
        ("Middleware/Filter", "Code that runs before controller e.g. JwtFilter"),
        ("CRUD", "Create Read Update Delete - basic data operations"),
        ("ORM", "Maps objects to tables - JPA/Hibernate"),
        ("Migration", "Script to change database schema safely"),
        ("Scalability", "Handling more users by adding servers"),
        ("Latency", "Time delay for request to complete"),
        ("Cold start", "Delay when server wakes from sleep"),
        ("Idempotent", "Same request twice = same result. Nonce helps this."),
        ("Monolith", "All backend in one app. UPI-O is a monolith."),
        ("Microservices", "Backend split into many small services. UPI-O is NOT this."),
    ]
    for term, defn in terms:
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf._reset_x()
        pdf.set_font("Helvetica", "B", 9)
        pdf.multi_cell(0, 5, term + ":")
        pdf._reset_x()
        pdf.set_font("Helvetica", "", 9)
        pdf.multi_cell(0, 5, defn)
        pdf.ln(1)

    pdf.add_page()
    pdf.chapter("16", "Interview Questions - Backend Basics")
    qa = [
        ("What is backend?", "Server-side code that handles logic, database, security. User doesn't see it directly."),
        ("What is an API?", "Contract of URLs/methods frontend uses to talk to backend."),
        ("Difference GET vs POST?", "GET reads data. POST creates or performs action. GET should not change data."),
        ("What is JSON?", "Text format for sending structured data. Key-value pairs."),
        ("What is a database?", "Permanent storage organized in tables with relationships."),
        ("What is JWT?", "Signed token proving user logged in. Sent in Authorization header."),
        ("Why hash passwords?", "If database leaks, attacker can't read plain passwords."),
        ("What is CORS?", "Browser rule. Backend must allow frontend domain to call API."),
        ("What is Spring Boot?", "Java framework for building REST APIs quickly with built-in server and config."),
        ("Controller vs Service?", "Controller handles HTTP. Service has business logic. Separation of concerns."),
        ("What is @Transactional?", "Ensures multiple DB updates all succeed or all fail together."),
        ("What happens on login?", "Verify password, generate JWT, return token to frontend."),
        ("What is env variable?", "Config outside code for secrets and URLs per environment."),
        ("REST vs GraphQL?", "REST uses fixed URLs. GraphQL one endpoint flexible queries. UPI-O uses REST."),
        ("SQL vs NoSQL?", "SQL = tables/relations (PostgreSQL). NoSQL = flexible docs/key-value. UPI-O uses SQL because money needs ACID transactions."),
    ]
    for q, a in qa:
        if pdf.get_y() > 250:
            pdf.add_page()
        pdf._reset_x()
        pdf.set_font("Helvetica", "B", 10)
        pdf.multi_cell(0, 5, f"Q: {q}")
        pdf._reset_x()
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 5, f"A: {a}")
        pdf.ln(2)

    pdf.chapter("17", "What You Should Know (Checklist)")
    pdf.h3("Basic (must know)")
    pdf.bullet("Frontend vs backend vs database")
    pdf.bullet("What API and endpoint mean")
    pdf.bullet("GET vs POST")
    pdf.bullet("Status codes 200, 400, 401, 404, 500")
    pdf.bullet("What JSON looks like")
    pdf.bullet("Your UPI-O API list")

    pdf.h3("Medium (should know for interviews)")
    pdf.bullet("JWT login flow")
    pdf.bullet("BCrypt password hashing")
    pdf.bullet("Controller -> Service -> Repository flow")
    pdf.bullet("Your 3 database tables")
    pdf.bullet("CORS why it exists")
    pdf.bullet("Env variables purpose")
    pdf.bullet("What Spring Boot and JPA do")

    pdf.h3("Bonus (impresses interviewer)")
    pdf.bullet("@Transactional on send money")
    pdf.bullet("Nonce for duplicate prevention")
    pdf.bullet("Offline cap enforced server-side")
    pdf.bullet("Deployment architecture Vercel + Render")

    pdf.ln(4)
    pdf.box(
        "Remember: You don't need to build backend from scratch in interview. "
        "You need to explain these concepts and connect them to YOUR UPI-O project."
    )

    out = "/Users/jiya_gorkha/Downloads/paymentsystem/docs/Backend_Basics_Guide.pdf"
    pdf.output(out)
    print(f"Created: {out}")


if __name__ == "__main__":
    build()
