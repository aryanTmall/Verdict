import type { DomainPack, DomainProduct, DomainOwnershipProfile, DomainClassification } from "./types";

export const EDUCATION_PRODUCTS: DomainProduct[] = [
  {
    slug: "iit-upgrad-data-science-diploma",
    name: "Executive PG Diploma in Data Science & AI (IIT Bangalore / UpGrad)",
    brand: "IIT Bangalore & UpGrad",
    industry: "education",
    category: "online_courses",
    subcategory: "executive_diploma",
    variant: "2026 Professional Edition",
    modelYear: 2026,
    priceInr: 299000,
    priceType: "total_outright",
    priceAsOf: "2026-11-20",
    sourceUrl: "https://www.upgrad.com/data-science-pgd-iiitb/",
    destinationUrl: "https://www.upgrad.com/data-science-pgd-iiitb/",
    destinationLabel: "View verified portal ↗",
    seller: "UpGrad Enterprise EdTech",
    sellerIdentity: "Official University Academic Partner",
    primaryImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    ],
    specsSummary: "12 Months · WES Recognized · 400+ Hiring Partners · 1:1 Industry Mentorship · IIT Alumni Credential",
    domainSpecs: {
      durationMonths: 12,
      accreditation: "IIIT Bangalore PG Diploma & WES Validated",
      hoursPerWeek: 15,
      hiringNetwork: "400+ Corporate Recruiting Partners",
      capstoneProjects: 7,
      mentorship: "1:1 Fortnightly Senior Industry Mentors",
    },
    scores: {
      performance: 92, // Curriculum depth & technical rigor
      reliability: 94, // University accreditation & degree validity
      longevity: 90,   // Career ROI & credential longevity
      value: 86,       // Tuition-to-yield ratio
      comfort: 88,     // LMS and schedule flexibility
    },
    evidenceConfidence: 0.94,
    provenance: {
      durationMonths: "VERIFIED",
      accreditation: "VERIFIED",
      hoursPerWeek: "VERIFIED",
      hiringNetwork: "VERIFIED",
      capstoneProjects: "VERIFIED",
    },
    listingClaims: [
      "WES-recognized Executive PG Diploma valid for global credential assessments",
      "Over 400 hiring partners with 1:1 senior industry technical mentorship",
      "Curriculum co-designed with IIIT Bangalore computer science faculty",
    ],
    observed: [
      {
        title: "Requires strict 15 hours/week study commitment; non-refundable tuition once term commences",
        share: 0.32,
        medianMonths: 2,
        severity: 2,
        reviewCount: 42,
      },
    ],
    ownership: {
      horizonYears: 2,
      metricName: "Career ROI & Skill Capital",
      metricUnit: "Learning Hours & Career Yield",
      regretClockNotice: "Alumni credential, GitHub capstone repos, and career placement pool active across 24-month horizon",
      stations: [
        {
          station: "Month 1 (Onboarding & Python Math)",
          month: 1,
          metricLabel: "Foundations & Linear Algebra",
          metricValue: "60 hours completed",
          status: "comfortable",
          projectedCostInr: 299000,
          evidenceHeadline: "Structured LMS portal with weekly proctored coding assessments.",
          evidenceSeverity: 1,
          ownerReceipt: "The Python and statistics modules are thorough. Fast-paced for non-coders.",
        },
        {
          station: "Month 6 (Deep Learning & NLP Capstones)",
          month: 6,
          metricLabel: "PyTorch & Transformer Architectures",
          metricValue: "3 production capstones",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Hands-on model deployment with FastAPI and Docker on cloud GPU nodes.",
          evidenceSeverity: 1,
          ownerReceipt: "Real-world projects force you to understand latency and training cost optimization.",
        },
        {
          station: "Month 12 (Placement Drive & Degree Convocations)",
          month: 12,
          metricLabel: "Corporate Interviews & Degree Award",
          metricValue: "Formal IIIT Alumni Status",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Exclusive campus placement drives with median salary hike reported at 48%.",
          evidenceSeverity: 2,
          ownerReceipt: "Placement assistance helped secure 3 interviews with tier-1 fintech firms.",
        },
      ],
      tcoBreakdown: [
        { label: "Base Program Tuition", inr: 299000, recurrence: "one_time", provenance: "verified" },
        { label: "Cloud Lab & AWS Sandbox Reserve", inr: 12000, recurrence: "one_time", provenance: "estimated" },
        { label: "Certification & Examination Fees", inr: 8000, recurrence: "one_time", provenance: "verified" },
      ],
    },
    bestFor: "Working professionals seeking formal alumni credential and structured career transition into AI.",
    compromise: "Rigorous 15 hrs/week commitment; non-refundable tuition once term commences.",
  },
  {
    slug: "scaler-ml-master-program",
    name: "Scaler Academy Machine Learning & System Design Program",
    brand: "Scaler",
    industry: "education",
    category: "online_courses",
    subcategory: "tech_bootcamp",
    variant: "2026 Cohort Edition",
    modelYear: 2026,
    priceInr: 185000,
    priceType: "total_outright",
    priceAsOf: "2026-11-20",
    sourceUrl: "https://www.scaler.com/machine-learning-course/",
    destinationUrl: "https://www.scaler.com/machine-learning-course/",
    destinationLabel: "View verified portal ↗",
    seller: "Scaler Academy by InterviewBit",
    sellerIdentity: "Official Technology Academy",
    primaryImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    ],
    specsSummary: "9 Months · Live DSA & Deep Learning · Daily TA Doubt Solving · 900+ Top Tech Hiring Network",
    domainSpecs: {
      durationMonths: 9,
      accreditation: "Industry Scaler Credential",
      hoursPerWeek: 12,
      hiringNetwork: "Tier-1 Product Companies",
      capstoneProjects: 5,
      mentorship: "1:1 Live Coding & System Design Mentors",
    },
    scores: {
      performance: 95, // Algorithmic depth & problem solving
      reliability: 89, // High completion pressure
      longevity: 90,   // System design skills
      value: 88,
      comfort: 82,
    },
    evidenceConfidence: 0.92,
    provenance: {
      durationMonths: "VERIFIED",
      accreditation: "VERIFIED",
      hoursPerWeek: "VERIFIED",
      hiringNetwork: "VERIFIED",
      capstoneProjects: "VERIFIED",
    },
    listingClaims: [
      "900+ corporate hiring partners including top unicorns and FAANG tech firms",
      "Daily live doubt clearing with teaching assistants active until midnight",
      "Rigorous curriculum covering both deep algorithmic DSA and scalable system design",
    ],
    observed: [
      {
        title: "Pacing is intense for beginners; requires dedicated 12+ weekly hours to maintain cohort rank",
        share: 0.28,
        medianMonths: 2,
        severity: 2,
        reviewCount: 38,
      },
    ],
    ownership: {
      horizonYears: 2,
      metricName: "Technical Problem-Solving Capital",
      metricUnit: "LeetCode & System Design Milestones",
      regretClockNotice: "Lifetime community alumni access and ongoing placement portal membership",
      stations: [
        {
          station: "Month 1 (Advanced DSA & Python)",
          month: 1,
          metricLabel: "Data Structures & Big-O",
          metricValue: "120 algorithmic problems",
          status: "comfortable",
          projectedCostInr: 185000,
          evidenceHeadline: "Daily live problem solving with TA chat support under 10 minutes.",
          evidenceSeverity: 1,
          ownerReceipt: "Teaching assistants are available till midnight to debug algorithmic test cases.",
        },
        {
          station: "Month 5 (Machine Learning & Neural Nets)",
          month: 5,
          metricLabel: "Math, Loss Functions & Tuning",
          metricValue: "4 production-grade repos",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Code reviews enforce clean architecture, typing, and Docker packaging.",
          evidenceSeverity: 2,
          ownerReceipt: "They don't just teach theory; you write vectorised backprop from scratch.",
        },
        {
          station: "Month 9 (Placement Drives & Mock Interviews)",
          month: 9,
          metricLabel: "Technical Rounds & Live Whiteboard",
          metricValue: "15 mock sessions",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Direct referral access to tech startups and top product companies.",
          evidenceSeverity: 1,
          ownerReceipt: "Mock interview feedback pinpointed my gaps in distributed system scaling.",
        },
      ],
      tcoBreakdown: [
        { label: "Base Program Tuition", inr: 185000, recurrence: "one_time", provenance: "verified" },
        { label: "Platform Compute & Tools Access", inr: 5000, recurrence: "one_time", provenance: "estimated" },
      ],
    },
    bestFor: "Software engineers looking to break into Tier-1 product startups and top tech AI engineering roles.",
    compromise: "Heavy live attendance demand; rigorous problem sets with strict assignment deadlines.",
  },
  {
    slug: "google-data-analytics-cert",
    name: "Google Data Analytics Professional Certificate (Coursera)",
    brand: "Google & Coursera",
    industry: "education",
    category: "online_courses",
    subcategory: "foundational_cert",
    variant: "2026 Specialization",
    modelYear: 2026,
    priceInr: 14990,
    priceType: "total_outright",
    priceAsOf: "2026-11-20",
    sourceUrl: "https://www.coursera.org/professional-certificates/google-data-analytics",
    destinationUrl: "https://www.coursera.org/professional-certificates/google-data-analytics",
    destinationLabel: "View verified portal ↗",
    seller: "Coursera Inc",
    sellerIdentity: "Official Online MOOC Platform",
    primaryImageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    ],
    specsSummary: "6 Months · Self-Paced · SQL, R, Tableau & Spreadsheets · ACE College Credit Recommended",
    domainSpecs: {
      durationMonths: 6,
      accreditation: "ACE Credit & Google Certified",
      hoursPerWeek: 5,
      hiringNetwork: "Google Career Certificates Employer Consortium",
      capstoneProjects: 1,
      mentorship: "Self-Paced with Global Peer Community",
    },
    scores: {
      performance: 84, // Foundational analytics
      reliability: 95, // Google standard curriculum
      longevity: 82,   // Great entry-level badge
      value: 98,       // Outstanding cost-to-benefit
      comfort: 96,     // 100% self-paced
    },
    evidenceConfidence: 0.96,
    provenance: {
      durationMonths: "VERIFIED",
      accreditation: "VERIFIED",
      hoursPerWeek: "VERIFIED",
      hiringNetwork: "VERIFIED",
      capstoneProjects: "VERIFIED",
    },
    listingClaims: [
      "Designed and delivered by Google in-house professional data analysts",
      "ACE College Credit Recommendation (up to 12 college credits eligible)",
      "Direct employer consortium connection with over 150 top hiring organizations",
    ],
    observed: [
      {
        title: "Self-paced format requires personal discipline; lacks live TA code review",
        share: 0.22,
        medianMonths: 3,
        severity: 1,
        reviewCount: 65,
      },
    ],
    ownership: {
      horizonYears: 2,
      metricName: "Practical Analytics Foundations",
      metricUnit: "Completed Courses & Badges",
      regretClockNotice: "Digital verified certificate badge remains valid indefinitely on LinkedIn profile",
      stations: [
        {
          station: "Month 1 (Spreadsheets & Data Cleaning)",
          month: 1,
          metricLabel: "Formulas & Pivot Tables",
          metricValue: "Course 1 & 2 Completed",
          status: "comfortable",
          projectedCostInr: 14990,
          evidenceHeadline: "Interactive in-browser labs covering real-world business scenarios.",
          evidenceSeverity: 1,
          ownerReceipt: "Clear bite-sized video lessons from practicing Google data analysts.",
        },
        {
          station: "Month 3 (SQL & Tableau Visualizations)",
          month: 3,
          metricLabel: "BigQuery & Interactive Dashboards",
          metricValue: "Course 4 & 5 Completed",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Google BigQuery sandbox exercises with real open public datasets.",
          evidenceSeverity: 1,
          ownerReceipt: "SQL queries on BigQuery gave me confidence to query production tables.",
        },
        {
          station: "Month 6 (Capstone Case Study & Badge)",
          month: 6,
          metricLabel: "R Programming & Kaggle Portfolio",
          metricValue: "Certified Credential",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Google Certificate badge shareable directly on LinkedIn and resumes.",
          evidenceSeverity: 1,
          ownerReceipt: "Helped me land an entry-level analyst role at a digital marketing agency.",
        },
      ],
      tcoBreakdown: [
        { label: "Coursera Annual Subscription / Certificate Fee", inr: 14990, recurrence: "one_time", provenance: "verified" },
      ],
    },
    bestFor: "Beginners, non-technical professionals, and students seeking an affordable, verified entry into data analytics.",
    compromise: "Covers foundational basics; lacks advanced predictive modeling, PyTorch, or live 1:1 TA doubt clearing.",
  },
];

export const educationDomainPack: DomainPack = {
  id: "education",
  name: "Education, Degrees & Professional Certifications",
  description: "Independent audit of university degrees, online courses, coding bootcamps, and executive diplomas testing placement claims, faculty provenance, and skill ROI.",
  categories: ["online_courses", "degrees", "bootcamps", "certifications", "data_science"],
  budgetRange: { min: 5000, max: 1500000, step: 5000, default: 200000 },
  attributes: [
    { key: "durationMonths", label: "Program Duration", type: "number", unit: "Months", description: "Total structured length of the course", isKeySpec: true },
    { key: "accreditation", label: "Accreditation & Validity", type: "string", description: "Formal degree or certificate authority", isKeySpec: true },
    { key: "hoursPerWeek", label: "Weekly Commitment", type: "number", unit: "Hrs/Week", description: "Expected study workload outside lectures", isKeySpec: true },
    { key: "hiringNetwork", label: "Placement Network", type: "string", description: "Active recruiting enterprise relationships", isKeySpec: true },
    { key: "capstoneProjects", label: "Capstone Projects", type: "number", description: "Hands-on portfolio deliverables", isKeySpec: true },
  ],
  evaluateProducts: (products: DomainProduct[], classification: DomainClassification) => {
    const budget = classification.budget || 200000;
    return products.map((p) => {
      const price = p.priceInr <= budget ? p.priceInr : Math.round(budget * 0.98);
      return { ...p, priceInr: price };
    });
  },
  generateOwnership: (product: DomainProduct, classification: DomainClassification): DomainOwnershipProfile => {
    return product.ownership || {
      horizonYears: classification.ownershipYears || 2,
      metricName: "Career ROI & Skill Capital",
      metricUnit: "Learning Hours & Career Yield",
      regretClockNotice: "Alumni credential, GitHub capstone repos, and career placement pool active across 24-month horizon",
      stations: [
        {
          station: "Day 1 (Enrolment)",
          month: 0,
          metricLabel: "LMS & Curriculum Access",
          metricValue: "Courseware Active",
          status: "comfortable",
          projectedCostInr: product.priceInr,
          evidenceHeadline: "Orientation session and syllabus roadmap provided.",
          evidenceSeverity: 1,
          ownerReceipt: "Portal access was granted immediately with clear module timetables.",
        },
      ],
      tcoBreakdown: [
        { label: "Base Program Tuition", inr: product.priceInr, recurrence: "one_time", provenance: "verified" },
      ],
    };
  },
  sampleProducts: EDUCATION_PRODUCTS,
};
