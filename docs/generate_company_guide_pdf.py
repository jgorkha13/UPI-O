#!/usr/bin/env python3
"""6-Month Company Target Guide for Medi-Caps / Java Backend Intern."""

from fpdf import FPDF

COMPANIES = [
    # (name, tier, difficulty, focus, rounds, dsa_level, java_focus, realistic)
    ("Zoho", "B", "Medium", "Java, logic, practical coding",
     "1-2 rounds: Aptitude + Java coding + technical interview. Less LeetCode-hard, more logic and real problems.",
     "Medium - arrays, strings, basic DS", "High - OOP, collections, problem solving in Java",
     "HIGH - hires many from all colleges"),
    ("Razorpay", "B", "Hard", "DSA + backend + system thinking",
     "Online test (DSA) -> Technical (Java/Spring) -> Project deep dive -> Culture fit",
     "Medium-Hard - trees, graphs, DP basics", "High - APIs, DB, concurrency basics",
     "MEDIUM - fintech project (UPI-O) helps a lot"),
    ("PhonePe", "B", "Hard", "DSA + Java + payments domain",
     "OA (coding) -> Tech rounds (DSA + Java) -> HM round",
     "Medium-Hard", "High - Java, multithreading overview",
     "MEDIUM - UPI domain match"),
    ("Paytm", "B", "Medium-Hard", "DSA + Java backend",
     "OA -> 2-3 technical rounds -> HR",
     "Medium", "High",
     "MEDIUM"),
    ("Freshworks", "B", "Medium-Hard", "DSA + Java + product thinking",
     "OA -> Coding -> System basics -> HR",
     "Medium", "High - clean code, OOP",
     "MEDIUM-HIGH"),
    ("Postman", "B", "Hard", "DSA + API/backend knowledge",
     "OA -> DSA round -> Backend/API round -> Culture",
     "Medium-Hard", "High - REST APIs (your strength via UPI-O)",
     "MEDIUM"),
    ("Chargebee", "B", "Medium", "Java/Spring heavy",
     "Coding (Java) -> Spring/DB round -> HR",
     "Medium", "Very High - Spring Boot",
     "MEDIUM-HIGH for Java path"),
    ("Meesho", "B", "Medium-Hard", "DSA + scalability basics",
     "OA -> 2 tech rounds -> HR",
     "Medium-Hard", "Medium-High",
     "MEDIUM"),
    ("Swiggy", "B", "Hard", "DSA strong",
     "OA (hard) -> 2-3 DSA rounds -> LLD basics",
     "Hard", "Medium",
     "LOW-MEDIUM off-campus"),
    ("Zomato", "B", "Hard", "DSA + backend",
     "OA -> Technical rounds -> HR",
     "Medium-Hard", "Medium-High",
     "MEDIUM"),
    ("CRED", "A", "Very Hard", "DSA + strong CS fundamentals",
     "Hard OA -> Multiple DSA -> System design lite -> Culture",
     "Hard", "Medium",
     "LOW off-campus - need strong DSA"),
    ("Flipkart", "A", "Very Hard", "DSA primary filter",
     "Online coding -> Problem solving -> Machine coding/LLD -> HR",
     "Hard - DP, graphs, greedy", "Medium",
     "LOW-MEDIUM - need 120+ problems"),
    ("Amazon", "A", "Very Hard", "LP + DSA (leadership principles)",
     "OA (2 coding) -> 3-4 rounds DSA + LP questions -> Bar raiser",
     "Hard - Amazon specific patterns", "Medium - any language",
     "LOW off-campus intern - referral helps"),
    ("Microsoft", "A", "Very Hard", "DSA + clean code",
     "OA -> 3-4 technical rounds -> AA (as appropriate)",
     "Hard", "Medium",
     "LOW - campus preferred"),
    ("Google", "A", "Extremely Hard", "DSA only mostly",
     "Phone screen -> 4-5 rounds hard DSA -> Googleyness",
     "Very Hard", "Low-Medium - language agnostic",
     "VERY LOW off-campus"),
    ("Oracle", "B", "Medium", "Java + SQL + OOP",
     "OA (Java/MCQ) -> Technical Java -> HR",
     "Easy-Medium", "Very High - Java, JDBC, SQL",
     "MEDIUM-HIGH - NPTEL Java helps"),
    ("SAP Labs", "B", "Medium", "Java + DSA medium",
     "OA -> 2 tech rounds -> HR",
     "Medium", "High",
     "MEDIUM"),
    ("Directi / Media.net", "B", "Hard", "Strong DSA",
     "Hard coding test -> 2-3 tech rounds",
     "Hard", "Medium",
     "LOW-MEDIUM"),
    ("Thoughtworks", "B", "Medium-Hard", "TDD, clean code, pairing",
     "Pair programming -> Technical -> HR",
     "Medium", "High - code quality",
     "MEDIUM"),
    ("HashedIn (Deloitte)", "B", "Medium-Hard", "DSA + Java",
     "OA -> Coding -> Technical -> HR",
     "Medium", "High",
     "MEDIUM"),
    ("Curefit / Cult", "C", "Medium", "DSA medium + backend",
     "OA -> Tech -> HR", "Medium", "Medium-High", "MEDIUM-HIGH"),
    ("Dunzo", "C", "Medium", "Practical coding", "OA -> Tech -> HR", "Medium", "Medium", "MEDIUM"),
    ("BrowserStack", "B", "Medium-Hard", "Java + DSA",
     "OA -> 2 tech rounds", "Medium-Hard", "High", "MEDIUM"),
    ("Groww", "B", "Hard", "DSA + fintech", "OA -> DSA -> Backend", "Medium-Hard", "Medium-High", "MEDIUM"),
    ("Instamojo", "C", "Medium", "Java startup", "Direct tech -> HR", "Easy-Medium", "High", "HIGH"),
    ("Wellfound Startups", "C", "Easy-Medium", "Ship fast, project matters",
     "1-2 rounds, often founder chat + small coding",
     "Easy-Medium", "Medium - project demo huge",
     "VERY HIGH - best for month 1-3 applying"),
    ("Cutshort / Instahyre Startups", "C", "Easy-Medium", "Skills + project",
     "Recruiter chat -> Tech round -> Offer",
     "Easy-Medium", "Medium-High",
     "VERY HIGH"),
    ("TCS / Infosys / Wipro", "D", "Easy", "Aptitude + basic Java MCQ",
     "Aptitude -> Technical MCQ -> HR",
     "Easy", "Medium (MCQ level)",
     "VERY HIGH but service - backup only"),
]

JAVA_FAQ = [
    ("Difference between == and equals()?",
     "== compares references (same object in memory). equals() compares content. For strings always use equals()."),
    ("ArrayList vs LinkedList?",
     "ArrayList: fast random access O(1), slow insert middle. LinkedList: fast insert/delete at ends, slow get by index. Use ArrayList 95% of time."),
    ("HashMap internal working?",
     "Key-value pairs. Uses hash of key to find bucket. Collision handled by chaining or tree. get/put average O(1)."),
    ("What is OOP?",
     "Encapsulation (hide data), Inheritance (reuse), Polymorphism (same method different behavior), Abstraction (hide complexity)."),
    ("Abstract class vs Interface?",
     "Abstract class: can have state, single inheritance. Interface: contract only (Java 8+ default methods), multiple inheritance of type."),
    ("Checked vs Unchecked exception?",
     "Checked: must handle at compile time (IOException). Unchecked: RuntimeException, NullPointerException - no forced handling."),
    ("What is final keyword?",
     "final variable = constant. final method = cannot override. final class = cannot extend."),
    ("String vs StringBuilder?",
     "String immutable - every change creates new object. StringBuilder mutable - use in loops for building strings."),
    ("What is JVM, JRE, JDK?",
     "JVM runs bytecode. JRE = JVM + libraries to run. JDK = JRE + compiler (javac) to develop."),
    ("What is garbage collection?",
     "JVM automatically frees memory of unreferenced objects. You don't delete manually like C++."),
    ("What is multithreading?",
     "Running multiple threads concurrently. Thread class or Runnable interface. synchronized prevents race conditions."),
    ("What is static keyword?",
     "Belongs to class not instance. static method called without object. One copy shared by all objects."),
    ("Override vs Overload?",
     "Override: same signature in subclass, runtime polymorphism. Overload: same name different params, compile time."),
    ("What is Spring Boot?",
     "Java framework for building REST APIs quickly. Auto-configures server, DB, security. Used in UPI-O."),
    ("What is JPA?",
     "Maps Java objects to database tables. Repository interfaces auto-generate SQL. User.java = users table."),
    ("What is JWT?",
     "JSON Web Token. Signed token after login. Sent in Authorization header. Stateless authentication."),
    ("What is REST API?",
     "API style using HTTP methods. GET read, POST create. URLs represent resources like /api/wallet."),
    ("What is @Transactional?",
     "Spring ensures all DB operations in method succeed together or rollback. Important for money transfers."),
    ("What is BCrypt?",
     "Password hashing algorithm. One-way function. Never store plain text passwords."),
    ("What is CORS?",
     "Browser security. Backend must allow frontend domain to call API. FRONTEND_URL env var in UPI-O."),
]

DSA_FAQ = [
    ("Two Sum approach?",
     "Brute: all pairs O(n²). Optimal: HashMap store complement O(n)."),
    ("Valid Anagram?",
     "Count char frequency int[26] or HashMap. Compare counts."),
    ("Valid Palindrome?",
     "Two pointers from ends, skip non-alphanumeric, compare lowercase."),
    ("Best time to buy sell stock?",
     "Track min price so far, max profit = price - min. One pass O(n)."),
    ("Contains duplicate?",
     "HashSet add each element. If add fails, duplicate exists."),
    ("Maximum subarray (Kadane)?",
     "cur = max(nums[i], cur + nums[i]). Track global max. O(n)."),
    ("Binary search template?",
     "lo=0, hi=n-1. while lo<=hi: mid, compare, narrow lo or hi."),
    ("Reverse linked list?",
     "Three pointers prev=null, curr, next. Flip links iteratively."),
    ("Detect cycle in linked list?",
     "Floyd fast/slow pointers. If they meet, cycle exists."),
    ("Valid parentheses?",
     "Stack. Push open brackets. Pop on close if matches."),
    ("Number of islands?",
     "DFS/BFS flood fill each '1', increment count."),
    ("Climbing stairs?",
     "dp[i]=dp[i-1]+dp[i-2]. Fibonacci. O(1) space with two vars."),
    ("Coin change?",
     "dp[amount]=min coins. For each coin update dp array."),
    ("Merge intervals?",
     "Sort by start. Merge if overlap else add new interval."),
    ("Top K frequent?",
     "Count in HashMap. Min heap size k or bucket sort."),
    ("Subarray sum equals K?",
     "Prefix sum + HashMap count of prefix sums. O(n)."),
    ("Longest substring without repeating?",
     "Sliding window + HashSet. Shrink left when duplicate."),
    ("3Sum?",
     "Sort. Fix i, two pointer on rest for sum zero. Skip duplicates."),
    ("Product except self?",
     "Prefix pass left, suffix pass right. O(n) no division."),
    ("When to use HashMap?",
     "Need O(1) lookup: complement, frequency, seen before, counting."),
    ("When to use two pointers?",
     "Sorted array pair sum, palindrome, container water, 3Sum."),
    ("When to use sliding window?",
     "Contiguous subarray/substring with constraint (max length, at most k distinct)."),
    ("When to use BFS?",
     "Shortest path, level order, nearest/nearest 0, rotting oranges."),
    ("When to use DFS?",
     "Explore all paths, islands, trees, backtracking, cycle detect."),
    ("Time complexity of HashMap operations?",
     "Average O(1) get, put, containsKey."),
]

ROUNDS_GUIDE = [
    ("Online Assessment (OA)", "1-2 coding problems, 60-90 min on HackerRank/Coderbyte. Usually medium. Pass rate filter - study arrays, strings, trees first."),
    ("Technical Round 1", "Live coding 1-2 problems + explain approach. Interviewer watches your thinking. Communication matters as much as code."),
    ("Technical Round 2", "Deeper DSA or Java fundamentals or project discussion. UPI-O: explain JWT, send money flow, database."),
    ("Machine Coding / LLD", "Flipkart/Amazon sometimes. Build small system in 90 min - parking lot, splitwise lite. Know basic OOP design."),
    ("HR / Culture", "Tell me about yourself, why company, strengths/weaknesses. Prepare 2 min story about UPI-O."),
    ("Manager Round", "Experience, project impact, team fit. For intern: learning attitude, why backend."),
]


class GuidePDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 8, f"Page {self.page_no()} | 6-Month Company Target Guide", align="C")

    def reset_x(self):
        self.set_x(self.l_margin)

    def section_title(self, t):
        self.reset_x()
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(0, 102, 204)
        self.multi_cell(0, 7, t)
        self.ln(2)
        self.set_text_color(0, 0, 0)

    def body(self, t):
        self.reset_x()
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, t)
        self.ln(1)

    def q(self, t):
        self.reset_x()
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(80, 0, 120)
        self.multi_cell(0, 5, "Q: " + t)
        self.set_text_color(0, 0, 0)

    def a(self, t):
        self.reset_x()
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, "A: " + t)
        self.ln(2)


def build():
    pdf = GuidePDF()
    pdf.set_auto_page_break(True, margin=15)

    pdf.add_page()
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 10, "6-Month Company Target Guide", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, "Medi-Caps | Java Backend | UPI-O Project", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.body(
        "Timeline: Month 1-2 apply startups + Zoho/Oracle. Month 3-4 Tier B fintech. "
        "Month 5-6 Flipkart/Amazon if 100+ LeetCode done.\n\n"
        "Tier A = Dream (very hard off-campus)\n"
        "Tier B = Very Good Product (main target)\n"
        "Tier C = Good Startups (apply from day 1)\n"
        "Tier D = Service backup (TCS etc - avoid if possible)"
    )

    pdf.section_title("MONTH-BY-MONTH TARGET PLAN")
    months = [
        ("Month 1-2", "Wellfound startups, Cutshort, Instamojo, Zoho, Oracle. Goal: interview practice. DSA: 30-40 problems."),
        ("Month 3-4", "Chargebee, Freshworks, Postman, Paytm, BrowserStack. NPTEL done. DSA: 60-80 problems."),
        ("Month 5-6", "Razorpay, PhonePe, Meesho, Groww. If 100+ LC: try Flipkart, Swiggy, Amazon referral.",),
    ]
    for m, plan in months:
        pdf.set_font("Helvetica", "B", 10)
        pdf.body(m + ": " + plan)

    pdf.add_page()
    pdf.section_title("COMPANY LIST - FULL DETAILS")

    for c in COMPANIES:
        name, tier, diff, focus, rounds, dsa, java, realistic = c
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(0, 0, 0)
        pdf.body(f"{name}  [Tier {tier}]  Difficulty: {diff}  |  Realistic: {realistic}")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.body(f"Focus: {focus}\nRounds: {rounds}\nDSA Level: {dsa}\nJava Focus: {java}")
        pdf.ln(1)

    pdf.add_page()
    pdf.section_title("TOP 10 PRIORITY FOR YOU (Start Here)")
    priority = [
        "1. Zoho - best off-campus hire rate, Java heavy, medium DSA",
        "2. Wellfound/Cutshort startups - project matters most, apply week 1",
        "3. Oracle - Java MCQ + coding, NPTEL prep helps directly",
        "4. Chargebee - Spring Boot Java shop",
        "5. Freshworks - good intern program Chennai",
        "6. Razorpay - UPI-O fintech story (apply month 3+)",
        "7. PhonePe - same fintech angle",
        "8. Postman - API backend fits UPI-O",
        "9. Instamojo - smaller fintech, easier entry",
        "10. BrowserStack - solid product, medium difficulty",
    ]
    for p in priority:
        pdf.body(p)

    pdf.add_page()
    pdf.section_title("JAVA INTERVIEW FAQ (Memorize Top 15)")
    for q, a in JAVA_FAQ:
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf.q(q)
        pdf.a(a)

    pdf.add_page()
    pdf.section_title("DSA INTERVIEW FAQ (Memorize Top 15)")
    for q, a in DSA_FAQ[:15]:
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf.q(q)
        pdf.a(a)

    pdf.add_page()
    pdf.section_title("MORE DSA FAQ")
    for q, a in DSA_FAQ[15:]:
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf.q(q)
        pdf.a(a)

    pdf.add_page()
    pdf.section_title("INTERVIEW ROUNDS EXPLAINED")
    for round_name, desc in ROUNDS_GUIDE:
        pdf.set_font("Helvetica", "B", 10)
        pdf.body(round_name)
        pdf.set_font("Helvetica", "", 9)
        pdf.body(desc)

    pdf.section_title("DIFFICULTY BY TIER - WHAT TO PREPARE")
    pdf.body(
        "TIER C Startups: 40 LeetCode easy/medium + UPI-O demo = enough to try\n"
        "TIER B Product: 80-100 LeetCode + Java FAQ + explain UPI-O cold\n"
        "TIER A Flipkart/Amazon: 120-150 LeetCode medium/hard + referrals\n"
        "TIER A Google: 200+ hard problems + exceptional luck/referral\n\n"
        "Medi-Caps strategy: Win Tier C first (month 2-3), Tier B (month 4-6), "
        "Tier A as stretch goal with referral."
    )

    pdf.section_title("SAMPLE OA PROBLEMS BY COMPANY TYPE")
    pdf.body(
        "Fintech (Razorpay/PhonePe): Two Sum, Subarray Sum K, Valid Anagram, LRU Cache basics\n"
        "Zoho: Logic puzzles, array manipulation, string problems, not always standard LC\n"
        "Amazon: 2 medium-hard in 90 min - trees, graphs, DP\n"
        "Oracle: Java MCQ + easy-medium coding + SQL basics\n"
        "Startups: Often 1 easy problem + project walkthrough - LEAD WITH UPI-O DEMO"
    )

    out = "/Users/jiya_gorkha/Downloads/paymentsystem/docs/6_Month_Company_Target_Guide.pdf"
    pdf.output(out)
    print(f"Created: {out}")


if __name__ == "__main__":
    build()
