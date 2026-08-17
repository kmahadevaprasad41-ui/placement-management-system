import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Comprehensive Placement Management System Database Seeder...");

  // Clear existing database tables in safe order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.joiningRecord.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.selection.deleteMany();
  await prisma.interviewFeedback.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.testResult.deleteMany();
  await prisma.test.deleteMany();
  await prisma.driveParticipant.deleteMany();
  await prisma.placementDrive.deleteMany();
  await prisma.eligibilityOverride.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.jobEligibilityRule.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.company.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.academicRecord.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.multipleOfferPolicy.deleteMany();
  await prisma.institutionSetting.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 1. Institution Settings & Policy
  console.log("⚙️ Creating Institution Settings & Placement Policies...");
  await prisma.institutionSetting.create({
    data: {
      institutionName: "Campus Placement Management System",
      currentAcademicYear: "2026-2027",
      resumeMaxSizeMB: 5,
      allowedMimeTypes: JSON.stringify(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
      profileWeights: JSON.stringify({ personal: 20, academic: 25, skills: 15, projects: 15, resume: 15, certifications: 10 }),
      placementPolicies: JSON.stringify({
        allowMultipleOffers: true,
        stopAfterAccepted: true,
        dreamCtcThreshold: 14.0,
        superDreamThreshold: 22.0,
        minMultiplierForSecondOffer: 1.5,
        maxOffersAllowed: 2,
      }),
    },
  });

  await prisma.multipleOfferPolicy.create({
    data: {
      name: "Institutional Placement Policy 2026-27",
      allowMultipleApplications: true,
      allowMultipleOffers: true,
      stopAfterAcceptedOffer: true,
      minCtcMultiplierForSecondOffer: 1.4,
      minAbsoluteCtcForSecondOffer: 14.0,
      maxOffersAllowed: 2,
      isActive: true,
    },
  });

  // 2. Departments
  console.log("🏛️ Creating Departments & Programs...");
  const deptCSE = await prisma.department.create({
    data: { code: "CSE", name: "Computer Science & Engineering", description: "Department of Computer Science & Engineering" },
  });
  const deptISE = await prisma.department.create({
    data: { code: "ISE", name: "Information Science & Engineering", description: "Department of Information Science & Engineering" },
  });
  const deptECE = await prisma.department.create({
    data: { code: "ECE", name: "Electronics & Communication Engineering", description: "Department of Electronics & Communication" },
  });
  const deptAIML = await prisma.department.create({
    data: { code: "AIML", name: "CS - Artificial Intelligence & Machine Learning", description: "Department of CS (AI & ML)" },
  });
  const deptAIDS = await prisma.department.create({
    data: { code: "AIDS", name: "CS - Data Science Engineering", description: "Department of CS (Data Science)" },
  });
  const deptCV = await prisma.department.create({
    data: { code: "CV", name: "Civil Engineering", description: "Department of Civil Engineering" },
  });
  const deptME = await prisma.department.create({
    data: { code: "ME", name: "Mechanical Engineering", description: "Department of Mechanical Engineering" },
  });

  // Programs
  const progBECSE = await prisma.program.create({
    data: { name: "B.Tech/B.E. Computer Science & Engineering", degreeType: "B.E.", durationYears: 4, departmentId: deptCSE.id },
  });
  const progBEISE = await prisma.program.create({
    data: { name: "B.Tech/B.E. Information Science & Engineering", degreeType: "B.E.", durationYears: 4, departmentId: deptISE.id },
  });
  const progBEECE = await prisma.program.create({
    data: { name: "B.Tech/B.E. Electronics & Communication", degreeType: "B.E.", durationYears: 4, departmentId: deptECE.id },
  });
  const progBEAIML = await prisma.program.create({
    data: { name: "B.Tech/B.E. CS (AI & Machine Learning)", degreeType: "B.E.", durationYears: 4, departmentId: deptAIML.id },
  });
  const progBEAIDS = await prisma.program.create({
    data: { name: "B.Tech/B.E. CS (Data Science)", degreeType: "B.E.", durationYears: 4, departmentId: deptAIDS.id },
  });
  const progBECV = await prisma.program.create({
    data: { name: "B.Tech/B.E. Civil Engineering", degreeType: "B.E.", durationYears: 4, departmentId: deptCV.id },
  });
  const progBEME = await prisma.program.create({
    data: { name: "B.Tech/B.E. Mechanical Engineering", degreeType: "B.E.", durationYears: 4, departmentId: deptME.id },
  });

  // Batches
  const batch2027 = await prisma.batch.create({
    data: { name: "Class of 2027 (Final Year)", graduationYear: 2027, academicYear: "2026-2027" },
  });
  const batch2026 = await prisma.batch.create({
    data: { name: "Class of 2026 (Graduated)", graduationYear: 2026, academicYear: "2025-2026" },
  });
  const batch2028 = await prisma.batch.create({
    data: { name: "Class of 2028 (Pre-Final Year)", graduationYear: 2028, academicYear: "2026-2027" },
  });

  // 3. Skills Directory
  console.log("💡 Seeding Technical & Professional Skills...");
  const skillNames = [
    { name: "TypeScript", category: "Programming" },
    { name: "JavaScript", category: "Programming" },
    { name: "Python", category: "Programming" },
    { name: "Java", category: "Programming" },
    { name: "C++", category: "Programming" },
    { name: "React", category: "Frameworks" },
    { name: "Next.js", category: "Frameworks" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "Docker", category: "DevOps & Cloud" },
    { name: "Kubernetes", category: "DevOps & Cloud" },
    { name: "AWS", category: "DevOps & Cloud" },
    { name: "Machine Learning", category: "AI/Data" },
    { name: "Deep Learning", category: "AI/Data" },
    { name: "Data Structures & Algorithms", category: "Core" },
    { name: "System Design", category: "Core" },
    { name: "Embedded Systems", category: "Core" },
    { name: "VLSI Design", category: "Core" },
    { name: "AutoCAD", category: "Core" },
    { name: "SolidWorks", category: "Core" },
    { name: "Problem Solving", category: "Soft Skills" },
    { name: "Communication", category: "Soft Skills" },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillNames) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.name, created.id);
  }

  // 4. Core Admin & Staff Users
  console.log("👤 Creating Staff, Admins, and Officers...");
  await prisma.user.create({
    data: {
      email: "admin@institution.edu",
      name: "Super Administrator",
      role: "SUPER_ADMIN",
      passwordHash: defaultPasswordHash,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const placementOfficerUser = await prisma.user.create({
    data: {
      email: "placement@institution.edu",
      name: "Head of Placement & Corporate Relations",
      role: "PLACEMENT_OFFICER",
      passwordHash: defaultPasswordHash,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    },
  });

  await prisma.user.create({
    data: {
      email: "coordinator.cse@institution.edu",
      name: "Dr. Anand Kulkarni (CSE Coordinator)",
      role: "DEPARTMENT_COORDINATOR",
      passwordHash: defaultPasswordHash,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  await prisma.user.create({
    data: {
      email: "coordinator.ece@institution.edu",
      name: "Dr. Meenakshi Sundaram (ECE Coordinator)",
      role: "DEPARTMENT_COORDINATOR",
      passwordHash: defaultPasswordHash,
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    },
  });

  await prisma.user.create({
    data: {
      email: "management@institution.edu",
      name: "Director of Institutional Governance",
      role: "MANAGEMENT",
      passwordHash: defaultPasswordHash,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  // 5. Companies & Recruiters
  console.log("🏢 Creating Premier Companies & Recruiter Accounts...");
  const companyData = [
    {
      name: "Google",
      slug: "google",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      website: "https://careers.google.com",
      industry: "IT & Cloud Services",
      companyType: "MNC",
      tier: "TIER_1",
      hqAddress: "Mountain View, CA / Hyderabad / Bangalore",
      description: "Google is a global technology leader in search, cloud computing, software, and AI.",
      status: "APPROVED",
      recruiterEmail: "recruiter.google@google.com",
      recruiterName: "Vikram Malhotra",
      recruiterTitle: "University Talent Lead - APAC",
    },
    {
      name: "Microsoft",
      slug: "microsoft",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      website: "https://careers.microsoft.com",
      industry: "Enterprise Software & Cloud",
      companyType: "MNC",
      tier: "TIER_1",
      hqAddress: "Redmond, WA / Bangalore / Hyderabad",
      description: "Empowering every person and organization on the planet to achieve more.",
      status: "APPROVED",
      recruiterEmail: "recruiter.microsoft@microsoft.com",
      recruiterName: "Pooja Varma",
      recruiterTitle: "Head of Campus Talent Acquisition",
    },
    {
      name: "Amazon",
      slug: "amazon",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      website: "https://amazon.jobs",
      industry: "E-Commerce, Cloud (AWS) & AI",
      companyType: "MNC",
      tier: "TIER_1",
      hqAddress: "Seattle, WA / Bangalore / Hyderabad",
      description: "Earth's most customer-centric company and world leader in cloud infrastructure.",
      status: "APPROVED",
      recruiterEmail: "recruiter.amazon@amazon.com",
      recruiterName: "Karthik Raman",
      recruiterTitle: "Senior Technical Recruiter",
    },
    {
      name: "Infosys",
      slug: "infosys",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
      website: "https://www.infosys.com",
      industry: "Digital Services & Consulting",
      companyType: "MNC",
      tier: "TIER_2",
      hqAddress: "Electronics City, Bengaluru",
      description: "A global leader in next-generation digital services and consulting.",
      status: "APPROVED",
      recruiterEmail: "recruiter.infosys@infosys.com",
      recruiterName: "Sneha Nair",
      recruiterTitle: "Campus Recruitment Lead",
    },
    {
      name: "L&T Technology Services",
      slug: "ltts",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/L%26T.png",
      website: "https://www.ltts.com",
      industry: "Engineering R&D Services",
      companyType: "MNC",
      tier: "TIER_2",
      hqAddress: "Bengaluru, India",
      description: "Leading global pure-play engineering services company.",
      status: "APPROVED",
      recruiterEmail: "recruiter.ltts@ltts.com",
      recruiterName: "Harish Gowda",
      recruiterTitle: "Lead Talent Acquisition",
    },
    {
      name: "Bosch Global Software",
      slug: "bosch",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-Logo.svg",
      website: "https://www.bosch.in",
      industry: "Automotive Tech & IoT",
      companyType: "MNC",
      tier: "TIER_2",
      hqAddress: "Bengaluru, India",
      description: "Invented for life. Global software and IoT engineering powerhouses.",
      status: "APPROVED",
      recruiterEmail: "recruiter.bosch@bosch.com",
      recruiterName: "Anand Murthy",
      recruiterTitle: "Senior University Recruiter",
    },
    {
      name: "Goldman Sachs",
      slug: "goldman-sachs",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
      website: "https://www.goldmansachs.com/careers",
      industry: "Investment Banking & FinTech",
      companyType: "MNC",
      tier: "TIER_1",
      hqAddress: "Bengaluru, India",
      description: "Leading global financial institution delivering engineering solutions for quantitative finance.",
      status: "APPROVED",
      recruiterEmail: "recruiter.gs@gs.com",
      recruiterName: "Neha Sen",
      recruiterTitle: "Campus Recruitment Manager",
    },
    {
      name: "Adobe Systems",
      slug: "adobe",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
      website: "https://www.adobe.com/careers",
      industry: "Creative Cloud & AI Platforms",
      companyType: "MNC",
      tier: "TIER_1",
      hqAddress: "Bengaluru / Noida, India",
      description: "Changing the world through digital experiences, Firefly generative AI, and Creative Cloud.",
      status: "APPROVED",
      recruiterEmail: "recruiter.adobe@adobe.com",
      recruiterName: "Rahul Saxena",
      recruiterTitle: "Staff University Talent Partner",
    },
  ];

  const companyMap = new Map<string, any>();
  for (const c of companyData) {
    const recruiterUser = await prisma.user.create({
      data: {
        email: c.recruiterEmail,
        name: c.recruiterName,
        role: "RECRUITER",
        passwordHash: defaultPasswordHash,
      },
    });

    const company = await prisma.company.create({
      data: {
        name: c.name,
        slug: c.slug,
        logoUrl: c.logoUrl,
        website: c.website,
        industry: c.industry,
        companyType: c.companyType,
        tier: c.tier,
        hqAddress: c.hqAddress,
        description: c.description,
        status: c.status,
      },
    });

    await prisma.recruiter.create({
      data: {
        userId: recruiterUser.id,
        companyId: company.id,
        designation: c.recruiterTitle,
      },
    });

    companyMap.set(c.slug, company);
  }

  // 6. Job Postings with Transparent Eligibility Criteria
  console.log("💼 Creating Realistic Job Postings and Eligibility Rules...");
  const jobsData = [
    {
      companySlug: "google",
      title: "Software Engineer (University Graduate)",
      role: "Software Engineer - Core Systems",
      description: "Join Google's Core Infrastructure & Android engineering teams building planet-scale distributed systems.",
      requirements: "Proficiency in C++, Java, or Go. Strong fundamentals in Algorithms, OS, and Distributed Systems.",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      location: "Bangalore / Hyderabad",
      ctcLPA: 32.5,
      baseSalaryLPA: 24.0,
      variableSalaryLPA: 8.5,
      vacancies: 8,
      deadline: new Date(Date.now() + 20 * 86400000),
      minCGPA: 8.0,
      allowedDeptCodes: ["CSE", "ISE", "AIML", "AIDS", "ECE"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 0,
      minTenth: 75.0,
      minTwelfth: 75.0,
      skills: ["Data Structures & Algorithms", "C++", "Java"],
      customNotes: "Shortlisted candidates will take a 90-min online coding assessment.",
    },
    {
      companySlug: "microsoft",
      title: "Software Development Engineer - IDC",
      role: "SDE 1 (Azure Cloud & AI Platform)",
      description: "Build high-throughput, enterprise-scale microservices and cloud telemetry systems on Microsoft Azure.",
      requirements: "Solid foundation in Data Structures, Object-Oriented Programming (C#/Java/C++), and RESTful APIs.",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      location: "Bangalore / Hyderabad",
      ctcLPA: 28.0,
      baseSalaryLPA: 20.0,
      variableSalaryLPA: 8.0,
      vacancies: 12,
      deadline: new Date(Date.now() + 25 * 86400000),
      minCGPA: 7.5,
      allowedDeptCodes: ["CSE", "ISE", "AIML", "AIDS", "ECE"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 1,
      minTenth: 70.0,
      minTwelfth: 70.0,
      skills: ["Data Structures & Algorithms", "TypeScript", "Python"],
      customNotes: "Online test followed by 3 rounds of technical and system architecture interviews.",
    },
    {
      companySlug: "amazon",
      title: "Software Development Engineer (AWS Core)",
      role: "SDE - Amazon Web Services",
      description: "Engineer hyper-scale cloud platforms, distributed databases, and serverless compute primitives at AWS.",
      requirements: "Strong background in Java/C++, multithreading, concurrency, and scalable distributed architectures.",
      jobType: "FULL_TIME",
      workMode: "ON_SITE",
      location: "Bangalore",
      ctcLPA: 26.5,
      baseSalaryLPA: 19.0,
      variableSalaryLPA: 7.5,
      vacancies: 15,
      deadline: new Date(Date.now() + 15 * 86400000),
      minCGPA: 7.0,
      allowedDeptCodes: ["CSE", "ISE", "AIML", "AIDS", "ECE"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 2,
      minTenth: 65.0,
      minTwelfth: 65.0,
      skills: ["Java", "System Design", "Data Structures & Algorithms"],
      customNotes: "Live online coding test + 4 rounds of virtual bar raiser interviews.",
    },
    {
      companySlug: "infosys",
      title: "Systems Engineer Specialist (SES) & Digital Specialist",
      role: "Digital Specialist Engineer",
      description: "Build next-generation enterprise applications, microservices, and AI integrations.",
      requirements: "Hands-on coding skills in Full Stack, Java/Python, database design, and cloud fundamentals.",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      location: "Bengaluru / Hyderabad / Pune",
      ctcLPA: 9.5,
      baseSalaryLPA: 8.0,
      variableSalaryLPA: 1.5,
      vacancies: 40,
      deadline: new Date(Date.now() + 30 * 86400000),
      minCGPA: 6.5,
      allowedDeptCodes: ["CSE", "ISE", "AIML", "AIDS", "ECE", "CV", "ME"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 2,
      minTenth: 60.0,
      minTwelfth: 60.0,
      skills: ["Java", "Python", "Problem Solving"],
      customNotes: "On-boarding and training program at company development center.",
    },
    {
      companySlug: "ltts",
      title: "Graduate Engineer Trainee (GET) - Embedded & IoT",
      role: "Associate Embedded Systems Engineer",
      description: "Develop firmware, microcontroller drivers, and smart industrial IoT telematics platforms.",
      requirements: "C/C++, Microcontrollers (ARM Cortex, ESP32), RTOS concepts, and Circuit Debugging.",
      jobType: "FULL_TIME",
      workMode: "ON_SITE",
      location: "Bengaluru / Mysuru",
      ctcLPA: 8.5,
      baseSalaryLPA: 7.2,
      variableSalaryLPA: 1.3,
      vacancies: 25,
      deadline: new Date(Date.now() + 28 * 86400000),
      minCGPA: 6.5,
      allowedDeptCodes: ["ECE", "CSE", "ISE", "ME"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 2,
      minTenth: 60.0,
      minTwelfth: 60.0,
      skills: ["Embedded Systems", "C++", "VLSI Design"],
      customNotes: "Written aptitude & technical test at placement auditorium.",
    },
    {
      companySlug: "bosch",
      title: "Associate Software Engineer - Mobility Solutions",
      role: "Software Developer - Connected Vehicle Systems",
      description: "Develop connected vehicle software, CAN bus diagnostic layers, and smart telemetry controllers.",
      requirements: "Strong understanding of C++, Python, Embedded Linux, and Automotive Communications protocols.",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      location: "Bengaluru",
      ctcLPA: 12.0,
      baseSalaryLPA: 10.0,
      variableSalaryLPA: 2.0,
      vacancies: 18,
      deadline: new Date(Date.now() + 22 * 86400000),
      minCGPA: 7.0,
      allowedDeptCodes: ["ECE", "CSE", "ISE", "ME"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 1,
      minTenth: 65.0,
      minTwelfth: 65.0,
      skills: ["Embedded Systems", "Python", "C++"],
      customNotes: "Virtual technical round followed by panel discussion.",
    },
    {
      companySlug: "goldman-sachs",
      title: "Summer Analyst / Full-time Quantitative Engineer",
      role: "Quantitative Technology Analyst",
      description: "Develop high-frequency order execution platforms, algorithmic pricing engines, and real-time risk calculations.",
      requirements: "Exceptional mathematical and algorithmic problem-solving skills, C++/Java, and knowledge of concurrent data structures.",
      jobType: "FULL_TIME",
      workMode: "ON_SITE",
      location: "Bengaluru",
      ctcLPA: 30.0,
      baseSalaryLPA: 22.0,
      variableSalaryLPA: 8.0,
      vacancies: 5,
      deadline: new Date(Date.now() + 18 * 86400000),
      minCGPA: 8.2,
      allowedDeptCodes: ["CSE", "ISE", "AIML", "AIDS", "ECE"],
      maxActiveBacklogs: 0,
      maxHistoryBacklogs: 0,
      minTenth: 80.0,
      minTwelfth: 80.0,
      skills: ["Data Structures & Algorithms", "C++", "Problem Solving"],
      customNotes: "Aptitude + Math & Coding round on HackerRank, followed by 3 rounds of technical interviews.",
    },
  ];

  const jobMap = new Map<string, any>();
  for (const j of jobsData) {
    const comp = companyMap.get(j.companySlug);
    const createdJob = await prisma.job.create({
      data: {
        companyId: comp.id,
        title: j.title,
        role: j.role,
        description: j.description,
        requirements: j.requirements,
        jobType: j.jobType,
        workMode: j.workMode,
        location: j.location,
        ctcLPA: j.ctcLPA,
        baseSalaryLPA: j.baseSalaryLPA,
        variableSalaryLPA: j.variableSalaryLPA,
        vacancies: j.vacancies,
        deadline: j.deadline,
        status: "PUBLISHED",
      },
    });

    await prisma.jobEligibilityRule.create({
      data: {
        jobId: createdJob.id,
        minCGPA: j.minCGPA,
        allowedDepartmentCodes: JSON.stringify(j.allowedDeptCodes),
        allowedBatchYears: JSON.stringify([2027]),
        maxActiveBacklogs: j.maxActiveBacklogs,
        maxHistoryBacklogs: j.maxHistoryBacklogs,
        minTenthPercentage: j.minTenth,
        minTwelfthPercentage: j.minTwelfth,
        requiredSkills: JSON.stringify(j.skills),
        customNotes: j.customNotes,
      },
    });

    jobMap.set(j.companySlug, createdJob);
  }

  // 7. Seed 50+ Students across All Departments
  console.log("🎓 Seeding 50+ Rich Student Profiles across Departments...");
  const firstNames = [
    "Aarav", "Diya", "Rohan", "Ananya", "Vikram", "Neha", "Aditya", "Pooja", "Siddharth", "Kavya",
    "Rahul", "Meera", "Varun", "Shruti", "Akash", "Tanvi", "Karthik", "Rhea", "Manish", "Divya",
    "Gaurav", "Swati", "Nikhil", "Ishita", "Arjun", "Sneha", "Kiran", "Prerana", "Harsh", "Priyanka",
    "Tejas", "Sanjana", "Yash", "Monika", "Suraj", "Archana", "Gautam", "Namrata", "Kunal", "Bhavna",
    "Abhinav", "Shreya", "Pranav", "Aishwarya", "Deepak", "Ritu", "Sameer", "Preeti", "Umesh", "Jyoti",
    "Sachin", "Keerthi"
  ];

  const lastNames = [
    "Sharma", "Patel", "Varma", "Deshmukh", "Nair", "Iyer", "Rao", "Gowda", "Hegde", "Reddy",
    "Murthy", "Bhat", "Kulkarni", "Shetty", "Kamath", "Menon", "Pillai", "Prasad", "Naik", "Joshi"
  ];

  const deptList = [
    { dept: deptCSE, code: "CS", prog: progBECSE },
    { dept: deptISE, code: "IS", prog: progBEISE },
    { dept: deptECE, code: "EC", prog: progBEECE },
    { dept: deptAIML, code: "AI", prog: progBEAIML },
    { dept: deptAIDS, code: "DS", prog: progBEAIDS },
    { dept: deptCV, code: "CV", prog: progBECV },
    { dept: deptME, code: "ME", prog: progBEME },
  ];

  const studentRecords: any[] = [];

  for (let i = 0; i < firstNames.length; i++) {
    const fn = firstNames[i];
    const ln = lastNames[i % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const cleanFn = fn.toLowerCase();
    const email = i === 0 ? "student.aarav@institution.edu" : i === 1 ? "student.diya@institution.edu" : i === 2 ? "student.rohan@institution.edu" : i === 3 ? "student.ananya@institution.edu" : `student.${cleanFn}${i}@institution.edu`;

    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        role: "STUDENT",
        passwordHash: defaultPasswordHash,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
      },
    });

    const deptObj = deptList[i % deptList.length];
    const rollNumber = `${deptObj.code}${String(101 + i).padStart(3, "0")}`;

    // Realistic CGPA Distribution
    let cgpa = 7.0;
    let activeBacklogs = 0;
    let historyBacklogs = 0;

    if (i === 0) {
      cgpa = 9.48; // Aarav - Star candidate
      activeBacklogs = 0;
      historyBacklogs = 0;
    } else if (i === 1) {
      cgpa = 9.15; // Diya
      activeBacklogs = 0;
      historyBacklogs = 0;
    } else if (i === 2) {
      cgpa = 8.64; // Rohan
      activeBacklogs = 0;
      historyBacklogs = 0;
    } else if (i === 3) {
      cgpa = 7.42; // Ananya - Backlog test
      activeBacklogs = 1;
      historyBacklogs = 2;
    } else if (i % 6 === 0) {
      cgpa = +(6.2 + (i % 8) * 0.1).toFixed(2);
      activeBacklogs = (i % 3) + 1;
      historyBacklogs = activeBacklogs + 1;
    } else {
      cgpa = +(7.2 + (i * 1.3) % 2.4).toFixed(2);
      activeBacklogs = 0;
      historyBacklogs = i % 5 === 0 ? 1 : 0;
    }

    const tenth = i === 0 ? 94.0 : +(78 + (i * 1.7) % 20).toFixed(1);
    const twelfth = i === 0 ? 88.5 : +(74 + (i * 1.9) % 22).toFixed(1);
    const gender = i % 2 === 0 ? "Male" : "Female";
    const profileCompletion = Math.min(100, Math.max(65, 75 + (i * 7) % 25));
    const isVerified = i < 46;

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber,
        departmentId: deptObj.dept.id,
        programId: deptObj.prog.id,
        batchId: batch2027.id,
        phone: `+91 ${98000 + i} ${10000 + i}`,
        dob: "2005-04-15",
        gender,
        address: "Campus Hostel Block C, University Campus",
        isVerified,
        verificationNotes: isVerified ? "All academic credentials verified against university records by Department Coordinator." : "Pending marks card verification.",
        profileCompletion: i === 0 ? 100 : profileCompletion,
        placementStatus: i === 0 || i === 1 ? "PLACED" : "UNPLACED",
        resumeSummary: `${fn} is a dedicated engineering student specializing in ${deptObj.dept.name} with keen interests in modern software stacks, problem-solving, and scalable technologies.`,
        linkedinUrl: `https://linkedin.com/in/${cleanFn}-${ln.toLowerCase()}`,
        githubUrl: `https://github.com/${cleanFn}${ln.toLowerCase()}`,
      },
    });

    studentRecords.push(student);

    // Academic Record
    const sems = [1, 2, 3, 4, 5, 6].map((sem) => ({
      sem,
      sgpa: +(cgpa + (Math.sin(sem + i) * 0.3)).toFixed(2),
    }));

    await prisma.academicRecord.create({
      data: {
        studentId: student.id,
        cgpa,
        tenthPercentage: tenth,
        twelfthPercentage: twelfth,
        activeBacklogs,
        historyBacklogs,
        gapYears: 0,
        semesterWiseMarks: JSON.stringify(sems),
        isVerified,
      },
    });

    // Default Resume
    await prisma.resume.create({
      data: {
        studentId: student.id,
        title: `${fn}_${ln}_Resume_2026.pdf`,
        fileUrl: `/uploads/resumes/${rollNumber}_resume.pdf`,
        fileName: `${fn}_Resume.pdf`,
        fileSize: 450000 + (i * 12345) % 200000,
        mimeType: "application/pdf",
        isDefault: true,
      },
    });

    // Student Skills
    const assignedSkillNames = [
      "TypeScript", "Python", "Data Structures & Algorithms", "React", "PostgreSQL", "Node.js", "C++", "Java"
    ];
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sName = assignedSkillNames[(sIdx + i) % assignedSkillNames.length];
      const sId = skillMap.get(sName);
      if (sId) {
        await prisma.studentSkill.create({
          data: {
            studentId: student.id,
            skillId: sId,
            level: sIdx < 2 ? "Advanced" : "Intermediate",
          },
        });
      }
    }

    // Projects & Internships for top students
    if (i < 10) {
      await prisma.project.create({
        data: {
          studentId: student.id,
          title: "Distributed Fault-Tolerant Cache Engine",
          description: "Implemented a distributed Raft-consensus key-value store with consistent hashing and automated failover.",
          technologies: "Go, gRPC, Docker, Redis",
          projectUrl: `https://github.com/${cleanFn}/distributed-cache`,
          startDate: "2025-08-01",
          endDate: "2025-12-15",
        },
      });

      await prisma.internship.create({
        data: {
          studentId: student.id,
          companyName: "Premier Tech Enterprise",
          role: "Software Engineering Intern",
          location: "Bangalore",
          description: "Built automated data ingestion pipelines processing 2M+ records daily using Apache Kafka and Spring Boot.",
          stipend: "₹35,000 / month",
          startDate: "2025-05-01",
          endDate: "2025-07-31",
          certificateUrl: "https://certificates.institution.edu/intern.pdf",
        },
      });
    }
  }

  // 8. Placement Drives, Applications, Interviews, Offers
  console.log("⚡ Generating Placement Drives, Live Applications, Interviews, and Offers...");
  const googleJob = jobMap.get("google");
  const msftJob = jobMap.get("microsoft");
  const amazonJob = jobMap.get("amazon");
  const infosysJob = jobMap.get("infosys");
  const lttsJob = jobMap.get("ltts");

  // Drive 1: Google
  const googleDrive = await prisma.placementDrive.create({
    data: {
      jobId: googleJob.id,
      companyId: companyMap.get("google").id,
      title: "Google University Graduate Campus Drive 2026",
      driveDate: new Date(Date.now() + 14 * 86400000),
      venue: "Central Auditorium / Virtual",
      isOnline: true,
      meetLink: "https://meet.google.com/swe-2026-drive",
      stages: "Coding Assessment, Technical Round 1, Technical Round 2, Leadership Round",
      status: "SCHEDULED",
    },
  });

  // Drive 2: Enterprise Drive
  const infosysDrive = await prisma.placementDrive.create({
    data: {
      jobId: infosysJob.id,
      companyId: companyMap.get("infosys").id,
      title: "Digital Specialist Campus Recruitment",
      driveDate: new Date(Date.now() + 7 * 86400000),
      venue: "Central Computing Center, Block A",
      isOnline: false,
      stages: "Online Assessment, Technical Interview, HR Discussion",
      status: "ONGOING",
    },
  });

  // Online Coding Assessment
  const test1 = await prisma.test.create({
    data: {
      driveId: googleDrive.id,
      jobId: googleJob.id,
      title: "Google Software Engineer Online Challenge 2026",
      platform: "Google Foobar / HackerRank",
      testType: "CODING",
      durationMinutes: 90,
      maxMarks: 100,
      scheduledAt: new Date(Date.now() + 8 * 86400000),
      instructions: "3 Algorithmic problems on Graphs, Dynamic Programming, and Tree Traversals. Plagiarism detection enabled.",
    },
  });

  // Candidate Aarav Google Journey
  const aarav = studentRecords[0];
  const aaravApp = await prisma.application.create({
    data: {
      studentId: aarav.id,
      jobId: googleJob.id,
      currentStage: "OFFERED",
      status: "ACTIVE",
    },
  });

  await prisma.testResult.create({
    data: {
      testId: test1.id,
      studentId: aarav.id,
      score: 95.0,
      percentile: 99.4,
      status: "PASSED",
      remarks: "All 3 coding problems solved with optimal time & space complexity within 52 minutes.",
    },
  });

  const aaravInterview = await prisma.interview.create({
    data: {
      studentId: aarav.id,
      jobId: googleJob.id,
      roundNumber: 1,
      roundName: "Technical Round 1 - Algorithms & Systems",
      interviewerName: "Google Staff Engineer",
      scheduledStart: new Date(Date.now() - 2 * 86400000),
      scheduledEnd: new Date(Date.now() - 2 * 86400000 + 3600000),
      venue: "Google Meet Room A",
      status: "COMPLETED",
    },
  });

  await prisma.interviewFeedback.create({
    data: {
      interviewId: aaravInterview.id,
      technicalRating: 5,
      communicationRating: 5,
      overallScore: 9.6,
      strengths: "Flawless concurrency design, articulated distributed caching trade-offs with extreme clarity.",
      recommendation: "STRONG_HIRE",
      remarks: "Top 1% candidate across university drives.",
    },
  });

  await prisma.selection.create({
    data: {
      studentId: aarav.id,
      jobId: googleJob.id,
      status: "FINAL_SELECT",
      remarks: "Selected for Software Engineer - Core Systems at Google Bangalore.",
    },
  });

  const aaravOffer = await prisma.offer.create({
    data: {
      studentId: aarav.id,
      jobId: googleJob.id,
      companyId: companyMap.get("google").id,
      offerLetterNumber: "OFFER/GOOGLE/2026/001",
      ctcLPA: 32.5,
      baseSalary: 24.0,
      variableSalary: 8.5,
      joiningDate: new Date("2027-07-01"),
      status: "ACCEPTED",
      studentResponseAt: new Date(Date.now() - 86400000),
      studentRemarks: "Thank you Training & Placement Cell! Thrilled to accept Google's offer.",
    },
  });

  await prisma.joiningRecord.create({
    data: {
      offerId: aaravOffer.id,
      studentId: aarav.id,
      status: "EXPECTED",
      actualJoiningDate: new Date("2027-07-01"),
      location: "Google India, Bangalore Campus",
      verificationNotes: "All academic transcripts verified and accepted by Google University Talent team.",
    },
  });

  // Candidate Diya Microsoft Journey
  const diya = studentRecords[1];
  await prisma.application.create({
    data: {
      studentId: diya.id,
      jobId: msftJob.id,
      currentStage: "OFFERED",
      status: "ACTIVE",
    },
  });

  const diyaOffer = await prisma.offer.create({
    data: {
      studentId: diya.id,
      jobId: msftJob.id,
      companyId: companyMap.get("microsoft").id,
      offerLetterNumber: "OFFER/MSFT/2026/002",
      ctcLPA: 28.0,
      baseSalary: 20.0,
      variableSalary: 8.0,
      joiningDate: new Date("2027-07-15"),
      status: "ACCEPTED",
      studentResponseAt: new Date(Date.now() - 43200000),
      studentRemarks: "Accepted offer for SDE-1 at Microsoft IDC Bangalore.",
    },
  });

  await prisma.joiningRecord.create({
    data: {
      offerId: diyaOffer.id,
      studentId: diya.id,
      status: "EXPECTED",
      actualJoiningDate: new Date("2027-07-15"),
      location: "Microsoft India Development Center, Bangalore",
    },
  });

  // Candidate Rohan Amazon Journey
  const rohan = studentRecords[2];
  await prisma.application.create({
    data: {
      studentId: rohan.id,
      jobId: amazonJob.id,
      currentStage: "INTERVIEW",
      status: "ACTIVE",
    },
  });

  await prisma.interview.create({
    data: {
      studentId: rohan.id,
      jobId: amazonJob.id,
      roundNumber: 2,
      roundName: "Technical Bar Raiser Round",
      interviewerName: "Senior SDE - AWS",
      scheduledStart: new Date(Date.now() + 86400000),
      scheduledEnd: new Date(Date.now() + 86400000 + 3600000),
      venue: "Amazon Chime Room",
      status: "SCHEDULED",
    },
  });

  // Candidate Ananya Backlog Override & Journey
  const ananya = studentRecords[3];
  await prisma.application.create({
    data: {
      studentId: ananya.id,
      jobId: googleJob.id,
      currentStage: "SHORTLISTED",
      status: "ACTIVE",
    },
  });

  // Populating realistic recruitment pipeline across all jobs
  for (let sIdx = 4; sIdx < studentRecords.length; sIdx++) {
    const s = studentRecords[sIdx];
    const targetJob = sIdx % 3 === 0 ? infosysJob : sIdx % 3 === 1 ? lttsJob : amazonJob;
    const stages: any[] = ["APPLIED", "SHORTLISTED", "TEST", "INTERVIEW", "SELECTED"];
    const stage = stages[sIdx % stages.length];

    await prisma.application.create({
      data: {
        studentId: s.id,
        jobId: targetJob.id,
        currentStage: stage,
        status: "ACTIVE",
      },
    });
  }

  // 9. Campus Announcements
  console.log("📢 Seeding Campus Placement Announcements...");
  await prisma.announcement.create({
    data: {
      title: "Google & Microsoft Final Campus Selects Announced — Batch 2026-27",
      content: "Hearty Congratulations to Aarav Sharma (CSE - ₹32.5 LPA) and Diya Patel (ISE - ₹28.0 LPA) on securing Tier-1 Super Dream placements!",
      priority: "URGENT",
      createdById: placementOfficerUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Infosys & L&T Technology Services Campus Drive Schedule",
      content: "All eligible students across CSE, ISE, ECE, AI&ML, Data Science, Civil, and Mechanical branches are advised to confirm slot timings at Central Computing Center, Block A by Friday 5:00 PM.",
      priority: "IMPORTANT",
      createdById: placementOfficerUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Academic Marks Verification & Resume Readiness Drive",
      content: "Department placement coordinators are conducting mandatory verification for all graduating engineers. Ensure your profile completion is at 100%.",
      priority: "NORMAL",
      createdById: placementOfficerUser.id,
    },
  });

  // 10. Audit Log & Notifications
  console.log("🛡️ Seeding Immutable Audit Trail...");
  await prisma.auditLog.create({
    data: {
      userId: placementOfficerUser.id,
      userEmail: "placement@institution.edu",
      userRole: "PLACEMENT_OFFICER",
      action: "OFFER_ISSUED",
      entityType: "Offer",
      entityId: aaravOffer.id,
      newState: JSON.stringify({ offerNumber: "OFFER/GOOGLE/2026/001", student: "Aarav Sharma", ctc: 32.5, company: "Google" }),
    },
  });

  console.log("✅ Placement Management System Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
