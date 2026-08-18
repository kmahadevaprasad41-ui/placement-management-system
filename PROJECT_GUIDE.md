# 🎓 Placement Management System (PMS) — Complete Beginner's Guide

Welcome! If you are new to this project, this guide explains **everything you need to know in simple, easy-to-understand steps**.

---

## 🌟 1. What is this Project?

The **Placement Management System (PMS)** is a modern, web-based platform designed to manage the entire campus placement lifecycle of an engineering institution:

1. **Students** can build their profile, upload multiple tailored resumes, scan resumes with an **AI ATS Analyzer**, practice with an **AI Mock Interviewer**, check real-time transparent job eligibility, and accept job offers.
2. **Corporate Recruiters** (like Google, Microsoft, Amazon, Infosys) can post jobs, manage candidate applicants through an **8-stage Kanban board**, schedule interviews, and rollout offer letters.
3. **Placement Officers** manage the entire recruitment season, grant eligibility overrides, schedule campus drives, and generate compliance reports.
4. **Department Heads & Management** view live analytics, salary distributions, and department-wise placement conversion charts.

---

## 🚀 2. How to Run the Project (3 Steps)

### Step 1: Open Terminal / Command Prompt
Open your terminal in the project folder (`d:\placement management system`).

### Step 2: Start the Website
Type this command and press **Enter**:
```bash
npm run dev
```

### Step 3: Open in Browser
Open your browser (Chrome, Edge, Firefox) and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

That's it! The website is live.

---

## 🔑 3. Demo Login Accounts (Password for ALL accounts: `password123`)

You don't need to create accounts from scratch! 65 realistic accounts are pre-loaded in the database:

| User Role | Demo Email | Password | What You Can Do in This Role |
| :--- | :--- | :--- | :--- |
| **Placement Officer** | `placement@institution.edu` | `password123` | Verify students, schedule drives, grant officer overrides, release offer letters |
| **Student (Placed @ Google 32.5L)** | `student.aarav@institution.edu` | `password123` | View accepted Google SWE offer, AI ATS scanner, resume manager |
| **Student (Testing Backlogs)** | `student.ananya@institution.edu` | `password123` | Test rule engine (has 1 backlog), request officer exemption override |
| **Recruiter (Google APAC)** | `recruiter.google@google.com` | `password123` | Move candidates on the 8-stage Kanban board, submit interview scorecards |
| **Recruiter (Infosys)** | `recruiter.infosys@infosys.com` | `password123` | View registered students, manage coding tests & technical interviews |
| **CSE Dept Coordinator** | `coordinator.cse@institution.edu` | `password123` | Academic student verification queue, department conversion metrics |
| **Management / Director** | `management@institution.edu` | `password123` | Executive intelligence dashboard, salary quartiles, CSV report studio |

> 💡 **Super Easy Tip**: When you are on any page of the website, look at the top bar. You will see a blue button called **"Switch Demo Role"**. Click it to switch between any user role in **1 click** without typing passwords!

---

## 🧭 4. Feature-by-Feature Tour (What to Showcase)

### 1. 🏠 Landing Page (`/`)
- **3D Interactive Hero Canvas**: Moves in 3D perspective as you move your mouse.
- **Floating 3D Wireframe Polyhedrons**: Rotating geometric 3D shapes in the background.
- **3D Flip Cards**: Click any of the 4 Core Engine cards to flip them 180 degrees in 3D!
- **Live Marquee**: Continuous ticker showing real-time placement offers.

### 2. 🤖 AI Resume Analyzer & ATS Scorecard (`/resume-ai`)
- Go to `/resume-ai` from the top navigation or bottom floating dock.
- Select a target company (e.g., **Google SWE** or **Microsoft Azure**).
- View the circular **ATS Compatibility Score (0-100%)** and matched vs missing keywords.
- Paste any weak resume bullet point into the **AI Bullet Enhancer** to generate quantified, high-impact bullet points with 1-click copy!

### 3. 🎙️ AI Mock Interview Simulator (`/interviews/mock-ai`)
- Select a company track (Google, Amazon, Microsoft).
- Practice with the **AI Interviewer Persona** featuring live audio wave rings and a 3-minute timer.
- Type or speak your answer and receive an instant **AI Performance Scorecard (Overall Rating, Technical Depth, STAR Communication, and Strengths)**.

### 4. 🏆 Achievers Hall of Fame (`/hall-of-fame`)
- Celebratory holographic cards for top placement offers (₹32.5 LPA Google, ₹28.0 LPA Microsoft, ₹30.0 LPA Goldman Sachs).
- Filter by Engineering Department (CSE, ISE, ECE, AIML) or Tier (Super Dream, Dream).
- Click **"Read Interview Strategy"** to see verified advice and tips from placed seniors.

### 5. 💰 Salary & In-Hand Take-Home Calculator (`/salary-insights`)
- Drag the **CTC Slider** from ₹3 LPA to ₹50 LPA.
- Watch real-time calculations of Base Pay, Performance Bonus, PF deductions, and estimated **Net Monthly In-Hand Cash deposited into your bank account**.

### 6. 📡 Live Placement Drive Radar (`/drives/radar`)
- Live ticking countdown clocks (Days : Hours : Mins : Secs) to upcoming campus drives.
- Visual stage-by-stage steppers showing drive progress.

### 7. 📊 8-Stage Recruitment Kanban Board (`/applications`)
- Interactive board with 8 stages: `APPLIED` → `SHORTLISTED` → `TEST` → `INTERVIEW` → `SELECTED` → `OFFERED` → `ACCEPTED` → `JOINED`.
- Move candidates across stages with automatic audit logs.

### 8. 🔍 Global Spotlight Search (`Ctrl+K`)
- Press **Ctrl + K** anywhere on the website to open the command palette and jump to any page, job, or student instantly.

---

## 🧪 5. How to Run Automated Verification Tests

The project includes an automated test suite verifying all 10 domain engines (database records, authentication, eligibility rules, overrides, conflict detection, offer policies):

In terminal, run:
```bash
npx tsx test-e2e.ts
```
Result:
```text
==================================================================
📊 FINAL TEST SUMMARY: 35 PASSED, 0 FAILED (100% Pass Rate)
==================================================================
```

---

## 🛠️ 6. Technology Stack Summary

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS
- **Backend & APIs**: Next.js Server Route Handlers, REST API
- **Database**: SQLite with Prisma ORM + Firebase Cloud Firestore & Realtime Database
- **3D & Animations**: HTML5 Canvas, CSS 3D Transforms, Perspective Physics, Glassmorphism
- **Authentication**: Role-Based Access Control (RBAC) with JWT tokens & 1-click demo switcher

---

## 🎉 Project is Complete & Ready for Presentation!
You are all set! You can run the website, demonstrate all features, and share the repository link with full confidence.
