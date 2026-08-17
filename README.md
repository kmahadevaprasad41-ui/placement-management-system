# Placement Management System (PMS) — Enterprise SaaS Platform

A production-grade campus recruitment, student eligibility screening, drive scheduling, interview management, and offer rollout SaaS platform built with **Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Prisma ORM, and SQLite**.

---

## 🌟 Key Features & Capabilities

1. **Role-Based Access Control (RBAC)**:
   - **Placement Officer**: Manage student verifications, configure eligibility rules, grant officer overrides, manage drives, and issue offer letters.
   - **Students**: Profile self-service (weighted completion engine), tailored multi-resume management, job board with live transparent eligibility check, and offer acceptance.
   - **Corporate Recruiters**: 8-stage interactive Kanban board (`APPLIED` → `SHORTLISTED` → `TEST` → `INTERVIEW` → `SELECTED` → `OFFERED` → `ACCEPTED` → `JOINED`), interview scorecards, and candidate feedback.
   - **Department Coordinators**: Department-specific cohort tracking, sem-wise transcript verification, and branch conversion metrics.
   - **Management / Institutional Governance**: Real-time institutional placement analytics, salary distributions, department conversion charts, and custom CSV query report studio.

2. **Transparent Multi-Variable Eligibility Engine**:
   - Live eligibility evaluations showing exact pass/fail checklist items (CGPA cutoff, allowed branches, active backlogs, gap years, 10th/12th percentages, required skills).
   - Placement Officer **Eligibility Exemption & Override** workflow with mandatory audit trail logging.

3. **Interview Scheduler & Conflict Detection Engine**:
   - Detects time slot overlaps and prevents double-booking across simultaneous student interview rounds and tests.

4. **Multiple-Offer & Dream Placement Policy Engine**:
   - Configurable compensation threshold policies (`stopAfterAcceptedOffer`, `minCtcMultiplierForSecondOffer`, `dreamCtcThreshold`, `superDreamThreshold`).

5. **Modern 3D UI & Micro-Animation Suite**:
   - 3D tactile buttons with physical press mechanics.
   - 3D mouse tilt cards with dynamic cursor spotlight glares.
   - Interactive background particle mesh canvas.
   - Continuous live placement marquee ticker.
   - 3D rotating partner gyro rings.
   - Floating 3D AI companion mascot orb.

6. **Enterprise Governance**:
   - Cryptographically timestamped, immutable audit log explorer.
   - Real-time in-app notification center.
   - Global keyboard search palette (`Ctrl+K`).

---

## 🔑 Demo Accounts (Password for all accounts: `password123`)

| Role | Demo Email | Roll Number | Key Features to Test |
| :--- | :--- | :--- | :--- |
| **Placement Officer** | `placement@institution.edu` | - | Verification, drives, jobs, officer overrides, offers |
| **Student (Placed - 32.5 LPA)** | `student.aarav@institution.edu` | `CS101` | 9.48 CGPA, transparent eligibility, accepted Google offer |
| **Student (Backlog Test)** | `student.ananya@institution.edu` | `IS042` | Active backlog rule failure & officer exemption workflow |
| **Recruiter (Google APAC)** | `recruiter.google@google.com` | - | 8-Stage Kanban applicant pipeline, candidate scorecards |
| **Recruiter (Infosys)** | `recruiter.infosys@infosys.com` | - | Drive manager, bulk applicant status transitions |
| **Department Coordinator** | `coordinator.cse@institution.edu` | - | CSE cohort verification queue & conversion metrics |
| **Management / Director** | `management@institution.edu` | - | Executive placement analytics & report studio |

*(Tip: In the top bar of any page, click the **"Switch Demo Role"** 3D button to switch roles in 1-click!)*

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/kmahadevaprasad41-ui/placement-management-system.git
cd placement-management-system

# 2. Install dependencies
npm install

# 3. Initialize database & seed 50+ rich candidate records
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run automated end-to-end verification suite (35/35 tests)
npx tsx test-e2e.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

The repository includes a comprehensive end-to-end test suite (`test-e2e.ts`) covering all 10 domain engines:
```bash
npx tsx test-e2e.ts
```

```text
==================================================================
📊 FINAL TEST SUMMARY: 35 PASSED, 0 FAILED
==================================================================
```

---

## 📄 License
MIT License. Open for educational and institutional placement management use.
