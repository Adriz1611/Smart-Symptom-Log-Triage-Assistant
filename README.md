# 🏥 Smart Symptom Log & Triage Assistant

**A comprehensive full-stack healthcare application for intelligent symptom tracking, AI-powered triage assessment, and medication management.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why This Project?](#-why-this-project)
- [What It Does](#-what-it-does)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Setup Instructions](#-setup-instructions)
- [Features](#-features)
- [Security](#-security)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Medical Disclaimer](#-medical-disclaimer)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **Smart Symptom Log & Triage Assistant** is an intelligent healthcare companion designed to help users track their health symptoms, receive immediate triage assessments, and make informed healthcare decisions. Built with modern technologies and enhanced with optional AI capabilities, this application bridges the gap between experiencing symptoms and seeking appropriate medical care.

### Core Capabilities

- **🩺 Intelligent Symptom Tracking** - Log symptoms with comprehensive details including severity, location, characteristics, vital signs, and temporal patterns
- **⚡ Real-time Triage Assessment** - Get immediate urgency evaluations using rule-based algorithms enhanced with optional AI insights
- **💊 Medication Management** - Track medication schedules, adherence, effectiveness, and side effects
- **📊 Health Analytics** - Visualize symptom patterns, trends, and correlations over time
- **🤖 AI-Powered Insights** - Receive intelligent health insights powered by Google's Gemini AI (optional)
- **📄 Medical Reports** - Generate PDF reports for healthcare provider consultations
- **🔐 Secure & Private** - Enterprise-grade security with JWT authentication and encrypted data storage

---

## 🤔 Why This Project?

### The Problem

1. **Decision Paralysis** - People often struggle to determine if their symptoms warrant immediate medical attention or can be managed at home
2. **Information Overload** - Online symptom checkers provide conflicting information and cause unnecessary anxiety
3. **Poor Record Keeping** - Patients forget symptom details when visiting healthcare providers
4. **Delayed Care** - People delay seeking care due to uncertainty about symptom severity
5. **Fragmented Tracking** - No unified system for tracking symptoms, medications, and health patterns

### The Solution

This application provides:

- **Evidence-Based Triage** - Algorithmic assessment based on medical guidelines and red flag symptom detection
- **Comprehensive Documentation** - Detailed symptom logs with timestamps, characteristics, and context
- **Intelligent Insights** - AI-powered pattern recognition and health recommendations
- **Empowered Decision Making** - Clear guidance on when and where to seek care
- **Longitudinal Tracking** - Timeline visualization of health trends for better medical consultations

### Target Users

- 👤 **Individuals** - Managing chronic conditions or acute symptoms
- 👨‍👩‍👧‍👦 **Families** - Parents tracking children's health
- 🏥 **Healthcare Providers** - Receiving better patient histories
- 📊 **Researchers** - (Future) Anonymized symptom data analysis

---

## 🌟 What It Does

### 1. Symptom Logging & Tracking

**Captures Comprehensive Health Data:**

- **Basic Information**

  - Symptom name and description
  - Body location (with future body map visualization)
  - Severity rating (1-10 scale)
  - Start and end timestamps
  - Current status (Active, Resolved, Improving, Worsening, Monitoring)

- **Detailed Characteristics**

  - Pain/sensation type (sharp, dull, burning, throbbing, aching, stabbing, cramping)
  - Frequency patterns (constant, intermittent, occasional)
  - Triggers (activities, foods, stress, weather, etc.)
  - Alleviating factors (rest, medication, position changes)
  - Aggravating factors (movement, eating, stress)

- **Vital Signs**

  - Body temperature (°F/°C)
  - Heart rate (BPM)
  - Blood pressure (systolic/diastolic)
  - Respiratory rate
  - Oxygen saturation

- **Contextual Notes**
  - Free-form text for additional details
  - Relationship to other symptoms
  - Impact on daily activities

### 2. Intelligent Triage Assessment

**Multi-Layer Analysis System:**

#### **Rule-Based Engine**

- Evaluates symptoms against medical red flag databases
- Scores urgency based on severity, characteristics, and vital signs
- Detects critical symptom combinations (e.g., chest pain + shortness of breath)
- Provides immediate recommendations

#### **5-Level Urgency Classification**

| Level              | Response Time   | Action               | Examples                                           |
| ------------------ | --------------- | -------------------- | -------------------------------------------------- |
| 🚨 **EMERGENCY**   | Immediate       | Call 911 / Go to ER  | Chest pain, severe bleeding, loss of consciousness |
| ⚠️ **URGENT**      | 2-4 hours       | Urgent care / ER     | High fever with confusion, severe abdominal pain   |
| 📞 **SEMI-URGENT** | 24-48 hours     | Contact primary care | Persistent fever, moderate pain, infection signs   |
| 📅 **NON-URGENT**  | 1-2 weeks       | Schedule appointment | Mild pain, minor rash, routine concerns            |
| 🏠 **SELF-CARE**   | Monitor at home | Self-care measures   | Minor headache, common cold, mild fatigue          |

#### **AI Enhancement (Optional)**

When Gemini API is enabled:

- Pattern recognition across symptom history
- Contextual health insights based on user's medical profile
- Personalized recommendations considering past treatments
- Confidence scoring for assessments
- Natural language health summaries

### 3. Medication Management

**Complete Medication Tracking:**

- **Medication Records**

  - Name, dosage, and frequency
  - Scheduled time slots for daily intake
  - Purpose and prescribing physician
  - Start and end dates
  - Known side effects

- **Adherence Tracking**

  - Daily medication logs (taken, skipped, missed)
  - Adherence rate calculations
  - Reminder system (future feature)

- **Effectiveness Monitoring**
  - Symptom relief ratings
  - Side effect reporting
  - Correlation with symptom patterns

### 4. Health Analytics Dashboard

**Visual Health Intelligence:**

- **Overview Statistics**

  - Total symptoms tracked
  - Active vs. resolved symptoms
  - Average severity trends
  - Triage urgency distribution

- **Timeline Visualization**

  - Chronological symptom progression
  - Overlapping symptom identification
  - Treatment efficacy periods
  - Seasonal/temporal patterns

- **Charts & Graphs** (using Recharts)
  - Severity trends over time
  - Body location heat maps
  - Medication adherence rates
  - Symptom frequency analysis

### 5. AI-Powered Health Insights

**Intelligent Analysis (Optional - Requires Gemini API):**

- **Pattern Detection**

  - Recurring symptom clusters
  - Trigger identification
  - Correlation with medications or activities
  - Seasonal or temporal patterns

- **Risk Assessment**

  - Early warning signs based on symptom progression
  - Potential complications identification
  - Chronic condition monitoring

- **Personalized Recommendations**

  - Lifestyle modifications
  - When to seek specific specialists
  - Preventive measures
  - Self-care strategies

- **Natural Language Summaries**
  - Plain-English health reports
  - Digestible insights for non-medical users
  - Shareable summaries for healthcare providers

### 6. Report Generation

**Medical Documentation:**

- **PDF Export**

  - Symptom timeline reports
  - Medication history summaries
  - Triage assessment details
  - Vital signs tracking

- **Sharing Options**
  - Download to device
  - Email to healthcare providers
  - WhatsApp sharing
  - Print-ready formatting

---

## ⚙️ How It Works

---

## ⚙️ How It Works

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  Next.js 16 Frontend (React 19, TypeScript, Tailwind CSS 4)    │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/REST API (Axios)
             │ JWT Authentication
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                          │
│        Express.js (Node.js, TypeScript, Middleware)             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controllers → Services → Database (Prisma ORM)           │  │
│  │  • Auth         • Triage     • PostgreSQL                │  │
│  │  • Symptoms     • Gemini AI  • Data Models               │  │
│  │  • Medications  • Analytics  • Migrations                │  │
│  │  • Insights                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ Prisma Client
             │
┌────────────▼────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                           │
│  Users, Symptoms, Medications, Triage, Insights, Attachments   │
└─────────────────────────────────────────────────────────────────┘
             │
             │ Optional: Gemini AI Integration
             │
┌────────────▼────────────────────────────────────────────────────┐
│                 GOOGLE GEMINI AI (Optional)                      │
│  Pattern Analysis, Health Insights, Recommendations             │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

#### 1. **User Authentication Flow**

```typescript
User Registration:
1. User submits email, password, name, DOB
2. Backend validates input (express-validator)
3. Password hashed with bcrypt (12 rounds)
4. User record created in database
5. JWT access token (15min) + refresh token (7d) generated
6. Tokens returned to client
7. Frontend stores tokens in localStorage
8. Auto-login with tokens

User Login:
1. User submits credentials
2. Backend finds user by email
3. Password verified with bcrypt.compare()
4. New JWT tokens generated
5. Refresh token stored in database
6. Tokens returned and stored client-side

Token Refresh:
1. Access token expires (401 error)
2. Frontend intercepts 401 response
3. Sends refresh token to /auth/refresh
4. New access token generated and returned
5. Original request retried with new token
6. Seamless user experience
```

#### 2. **Symptom Logging & Triage Flow**

```typescript
Symptom Creation:
1. User fills symptom form with details
2. Frontend validates inputs (required fields, ranges)
3. POST /api/symptoms with symptom data
4. Backend validates with middleware
5. Creates Symptom record in database
6. Creates SymptomDetail record (characteristics, vitals)

Triage Assessment:
7. EnhancedTriageService.assessSymptom() triggered
8. Rule-based analysis:
   - Check for critical symptoms (chest pain, bleeding, etc.)
   - Calculate severity score (base + red flags + vitals)
   - Detect emergency symptom combinations
   - Evaluate vital sign abnormalities
9. Optional: AI Enhancement
   - Fetch user's symptom history
   - Send context to Gemini AI
   - Get AI insights and pattern analysis
   - Merge with rule-based results
10. Create TriageAssessment record
11. Return complete symptom + triage to frontend
12. Display urgency level and recommendations
```

#### 3. **Triage Scoring Algorithm**

```typescript
Score Calculation:
Base Score = severity (1-10)

Critical Symptoms (+60 points each):
- Chest pain, difficulty breathing, severe bleeding
- Loss of consciousness, stroke symptoms, seizures
- Severe allergic reaction, suicidal thoughts

High Priority Symptoms (+30 points each):
- Confusion, severe abdominal pain, coughing blood
- Severe burns, head injury, vision loss

Moderate Symptoms (+15 points each):
- Persistent headache, moderate fever, swelling

Vital Sign Abnormalities:
- Temperature ≥103°F or ≤95°F (+15)
- Heart rate >120 or <50 BPM (+15)
- Blood pressure >180/120 or <90/60 (+20)

Emergency Combinations (+50):
- Chest pain + shortness of breath
- Severe headache + confusion
- Abdominal pain + fever

Final Classification:
Score ≥ 100 → EMERGENCY
Score 70-99 → URGENT
Score 40-69 → SEMI_URGENT
Score 20-39 → NON_URGENT
Score < 20 → SELF_CARE
```

#### 4. **AI Integration Flow (Optional)**

```typescript
When GEMINI_API_KEY is configured:

1. Symptom Assessment:
   - Build context prompt with symptom data
   - Include user's historical symptoms
   - Request Gemini analysis
   - Parse AI response (JSON format)
   - Extract insights, patterns, recommendations

2. Long-term Insights:
   - Analyze symptom patterns over 30/60/90 days
   - Identify recurring clusters
   - Detect trends (improving/worsening)
   - Highlight risk factors
   - Generate actionable recommendations

3. Enhanced Recommendations:
   - Combine rule-based + AI insights
   - Provide confidence scores
   - Offer personalized guidance
   - Suggest specialist consultations

Fallback Mechanism:
- If API unavailable: Use rule-based only
- No degradation of core functionality
- AI is enhancement, not requirement
```

#### 5. **Medication Tracking Flow**

```typescript
Medication Management:
1. User adds medication (name, dosage, schedule)
2. System creates Medication record
3. Generates daily MedicationLog entries for each time slot
4. User logs intake (taken/skipped/missed)
5. Records effectiveness and side effects
6. Calculates adherence statistics
7. Correlates with symptom patterns

Daily Log Generation:
- Cron job creates logs for scheduled times
- Logs remain pending until user action
- Late logging tracked separately
- Adherence rate calculated: (taken / (taken + missed)) * 100
```

#### 6. **Data Visualization Flow**

```typescript
Analytics Generation:
1. Frontend requests dashboard data
2. Backend aggregates symptom statistics:
   - Count by status (active, resolved, etc.)
   - Severity trends over time
   - Body location distribution
   - Urgency level breakdown
3. Frontend renders with Recharts:
   - Line charts for temporal trends
   - Bar charts for frequency distribution
   - Pie charts for categorical data
4. Interactive tooltips and filters
5. Export to PDF functionality
```

### Security Implementation

#### **Authentication & Authorization**

```typescript
JWT Token Strategy:
- Access Token: Short-lived (15 minutes)
  - Contains: user ID, email
  - Used: Every API request
  - Stored: localStorage (XSS considerations)

- Refresh Token: Long-lived (7 days)
  - Contains: user ID, email
  - Used: Token refresh only
  - Stored: Database + localStorage
  - Rotated: On each refresh

Token Verification:
1. Extract token from Authorization header
2. Verify signature with JWT_SECRET
3. Check expiration
4. Decode payload to get user info
5. Attach user to request object
6. Proceed to route handler
```

#### **Password Security**

```typescript
Bcrypt Implementation:
- Salt rounds: 12 (2^12 = 4096 iterations)
- Time: ~200-300ms per hash
- Rainbow table resistant
- Brute force resistant

Registration:
const hash = await bcrypt.hash(password, 12);

Login:
const isValid = await bcrypt.compare(password, hash);
```

#### **Input Validation**

```typescript
Express-Validator Middleware:
- Sanitize inputs (trim, escape)
- Validate formats (email, dates, numbers)
- Check required fields
- Validate ranges (severity 1-10)
- Custom validation rules
- Return descriptive errors
```

#### **API Security Layers**

```typescript
Helmet.js:
- Sets security HTTP headers
- XSS protection
- Content Security Policy
- Clickjacking prevention
- MIME sniffing protection

CORS:
- Whitelist: localhost:3000, localhost:3001
- Credentials: true
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

Rate Limiting:
- Window: 15 minutes
- Max requests: 100 per IP
- Prevents: DDoS, brute force
- Graceful error messages

Compression:
- Gzip response compression
- Reduces bandwidth
- Improves performance
```

### Database Operations

#### **Prisma ORM Workflow**

```typescript
Schema Definition (schema.prisma):
1. Define models with fields and relations
2. Set data types and constraints
3. Add indexes for query optimization
4. Configure cascading deletes

Migration Process:
1. Modify schema.prisma
2. Run: npx prisma migrate dev --name description
3. Prisma generates SQL migration
4. Migration applied to database
5. Prisma Client regenerated

Query Patterns:
// Create with relations
await prisma.symptom.create({
  data: {
    userId,
    symptomName,
    details: { create: { characteristic, frequency } },
    triageAssessments: { create: { urgencyLevel, score } }
  },
  include: { details: true, triageAssessments: true }
});

// Complex filtering
await prisma.symptom.findMany({
  where: {
    userId,
    status: 'ACTIVE',
    startedAt: { gte: thirtyDaysAgo }
  },
  include: { details: true },
  orderBy: { startedAt: 'desc' }
});

// Aggregation
await prisma.symptom.groupBy({
  by: ['urgencyLevel'],
  _count: true,
  where: { userId }
});
```

#### **Database Optimization**

```typescript
Indexes:
- User email (unique)
- Symptom userId + startedAt (compound)
- Symptom status
- TriageAssessment symptomId
- RefreshToken token (unique)

Cascade Deletes:
- Delete user → cascade to symptoms, medications, insights
- Delete symptom → cascade to details, triage, attachments

Transaction Support:
- Atomic operations for complex writes
- Rollback on failure
- Maintain data integrity
```

---

## 🚀 Tech Stack

---

## 🚀 Tech Stack

### Frontend Technologies

| Technology       | Version | Purpose            | Why Chosen                                               |
| ---------------- | ------- | ------------------ | -------------------------------------------------------- |
| **Next.js**      | 16.0.8  | React framework    | App Router, SSR, optimized performance, built-in routing |
| **React**        | 19.2.1  | UI library         | Component-based, virtual DOM, rich ecosystem             |
| **TypeScript**   | 5.x     | Type safety        | Catch errors early, better IDE support, maintainability  |
| **Tailwind CSS** | 4.x     | Styling            | Utility-first, rapid development, consistent design      |
| **Axios**        | 1.13.2  | HTTP client        | Interceptors for auth, request/response transformation   |
| **Recharts**     | 3.5.1   | Data visualization | React-based charts, responsive, customizable             |
| **Lucide React** | 0.556.0 | Icons              | Lightweight, modern, extensive icon library              |
| **date-fns**     | 4.1.0   | Date utilities     | Immutable, tree-shakeable, timezone support              |
| **jsPDF**        | 3.0.4   | PDF generation     | Client-side PDF creation for reports                     |
| **html2canvas**  | 1.4.1   | HTML to canvas     | Screenshot functionality for PDF reports                 |

### Backend Technologies

| Technology             | Version | Purpose              | Why Chosen                                        |
| ---------------------- | ------- | -------------------- | ------------------------------------------------- |
| **Node.js**            | 18+     | Runtime              | Event-driven, non-blocking I/O, npm ecosystem     |
| **Express.js**         | 5.2.1   | Web framework        | Minimalist, flexible, extensive middleware        |
| **TypeScript**         | 5.x     | Type safety          | Same codebase language as frontend, reliability   |
| **Prisma**             | 6.19.0  | ORM                  | Type-safe queries, auto-completion, migrations    |
| **PostgreSQL**         | 16+     | Database             | ACID compliance, complex queries, relational data |
| **bcryptjs**           | 3.0.3   | Password hashing     | Industry standard, salt + hash, slow by design    |
| **jsonwebtoken**       | 9.0.3   | Authentication       | Stateless auth, standard format, signed tokens    |
| **Helmet**             | 8.1.0   | Security headers     | XSS protection, clickjacking prevention           |
| **CORS**               | 2.8.5   | Cross-origin         | Controlled resource sharing, security             |
| **Morgan**             | 1.10.1  | HTTP logging         | Request/response logging, debugging               |
| **express-validator**  | 7.3.1   | Input validation     | Sanitization, validation rules, error handling    |
| **express-rate-limit** | 8.2.1   | Rate limiting        | DDoS protection, abuse prevention                 |
| **compression**        | 1.8.1   | Response compression | Gzip, reduced bandwidth, faster responses         |

### AI & External Services

| Technology           | Version | Purpose     | Why Chosen                                      |
| -------------------- | ------- | ----------- | ----------------------------------------------- |
| **Google Gemini AI** | 0.24.1  | AI insights | Multimodal, fast inference, pattern recognition |

### Development & Build Tools

| Technology  | Purpose                              |
| ----------- | ------------------------------------ |
| **nodemon** | Auto-restart backend on file changes |
| **ts-node** | Execute TypeScript directly in Node  |
| **ESLint**  | Code linting and style enforcement   |
| **Docker**  | PostgreSQL containerization          |
| **Git**     | Version control                      |

---

## 🏗️ Architecture

### Project Structure

```
Smart-Symptom-Log-Triage-Assistant/
│
├── frontend/                          # Next.js application
│   ├── app/                           # App Router pages
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Landing page
│   │   ├── auth/                      # Authentication
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/                 # Protected routes
│   │       ├── layout.tsx             # Dashboard layout
│   │       ├── page.tsx               # Dashboard home
│   │       ├── symptoms/              # Symptom management
│   │       │   ├── new/page.tsx       # Create symptom
│   │       │   └── [id]/              # Symptom details
│   │       │       ├── page.tsx       # View symptom
│   │       │       └── edit/page.tsx  # Edit symptom
│   │       ├── medications/page.tsx   # Medication tracking
│   │       ├── insights/page.tsx      # AI insights
│   │       └── analytics/page.tsx     # Charts & stats
│   │
│   ├── components/                    # Reusable components
│   │   ├── auth/                      # Auth forms
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── ui/                        # UI components
│   │       ├── Button3D.tsx           # 3D button
│   │       ├── Select3D.tsx           # 3D select
│   │       └── ShareModal.tsx         # Share dialog
│   │
│   ├── lib/                           # Utilities & config
│   │   ├── api/                       # API client functions
│   │   │   ├── client.ts              # Axios instance + interceptors
│   │   │   ├── auth.ts                # Auth API calls
│   │   │   ├── symptoms.ts            # Symptom API calls
│   │   │   └── insights.ts            # Insights API calls
│   │   ├── auth/                      # Authentication
│   │   │   └── auth-context.tsx       # Auth state management
│   │   ├── theme/                     # Theme management
│   │   │   └── theme-context.tsx      # Dark mode context
│   │   ├── utils/                     # Utility functions
│   │   │   └── pdf-generator.ts       # PDF export logic
│   │   ├── types.ts                   # TypeScript types
│   │   └── utils.ts                   # Helper functions
│   │
│   ├── public/                        # Static assets
│   ├── .env.example                   # Environment template
│   ├── next.config.ts                 # Next.js configuration
│   ├── tailwind.config.js             # Tailwind configuration
│   ├── tsconfig.json                  # TypeScript config
│   └── package.json                   # Dependencies
│
├── backend/                           # Express.js API
│   ├── src/
│   │   ├── server.ts                  # App entry point
│   │   │
│   │   ├── config/                    # Configuration
│   │   │   ├── database.ts            # Prisma client setup
│   │   │   └── env.ts                 # Environment variables
│   │   │
│   │   ├── controllers/               # Route handlers
│   │   │   ├── auth.controller.ts     # Registration, login, refresh
│   │   │   ├── symptom.controller.ts  # CRUD + triage + timeline
│   │   │   ├── medication.controller.ts # Medication management
│   │   │   └── insights.controller.ts # AI insights generation
│   │   │
│   │   ├── routes/                    # API routes
│   │   │   ├── auth.routes.ts         # /api/auth/*
│   │   │   ├── symptom.routes.ts      # /api/symptoms/*
│   │   │   ├── medication.routes.ts   # /api/medications/*
│   │   │   └── insights.routes.ts     # /api/insights/*
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── enhanced-triage.service.ts # Triage algorithm
│   │   │   └── gemini.service.ts      # AI integration
│   │   │
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   ├── validation.middleware.ts # Input validation
│   │   │   └── error.middleware.ts    # Error handling
│   │   │
│   │   ├── types/                     # TypeScript interfaces
│   │   │   └── index.ts               # Shared types
│   │   │
│   │   └── utils/                     # Utilities
│   │       └── jwt.util.ts            # JWT helpers
│   │
│   ├── prisma/                        # Database management
│   │   ├── schema.prisma              # Database schema
│   │   ├── migrations/                # Migration history
│   │   └── seed.ts                    # Database seeding
│   │
│   ├── scripts/                       # Utility scripts
│   │   └── seed-symptoms.ts           # Sample data generator
│   │
│   ├── .env.example                   # Environment template
│   ├── tsconfig.json                  # TypeScript config
│   ├── nodemon.json                   # Nodemon config
│   └── package.json                   # Dependencies
│
├── docker-compose.yml                 # PostgreSQL container
├── start-dev.sh                       # Development startup script
└── README.md                          # This file
```

### Component Architecture

#### **Frontend Layers**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, UI Elements)       │
│  • React Components                     │
│  • Tailwind CSS Styling                 │
│  • Client-side Routing                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         State Management Layer          │
│  (Context API, Local State)             │
│  • Auth Context                         │
│  • Theme Context                        │
│  • Component State (useState)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         API Communication Layer         │
│  (Axios Client, Interceptors)           │
│  • HTTP requests                        │
│  • Token management                     │
│  • Error handling                       │
│  • Response transformation              │
└──────────────┬──────────────────────────┘
               │
               ▼
          Backend API
```

#### **Backend Layers**

```
┌─────────────────────────────────────────┐
│         HTTP Layer (Express)            │
│  • Routing                              │
│  • Middleware chain                     │
│  • Request/Response handling            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Controller Layer                │
│  • Request parsing                      │
│  • Input validation                     │
│  • Response formatting                  │
│  • Error handling                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Service Layer                   │
│  (Business Logic)                       │
│  • Triage algorithms                    │
│  • AI integration                       │
│  • Data processing                      │
│  • Complex operations                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Access Layer               │
│  (Prisma ORM)                           │
│  • Database queries                     │
│  • Transactions                         │
│  • Relations                            │
│  • Type-safe operations                 │
└──────────────┬──────────────────────────┘
               │
               ▼
       PostgreSQL Database
```

---

## 🗄️ Database Schema

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │──┐
│ email (unique)  │  │
│ passwordHash    │  │
│ name            │  │
│ dateOfBirth     │  │
│ createdAt       │  │
│ updatedAt       │  │
└─────────────────┘  │
                     │
         ┌───────────┴───────────┬──────────────┬──────────────┐
         │                       │              │              │
         ▼                       ▼              ▼              ▼
┌──────────────────┐   ┌─────────────────┐  ┌────────────┐  ┌──────────────┐
│  UserProfile     │   │    Symptom      │  │ Medication │  │ HealthInsight│
├──────────────────┤   ├─────────────────┤  ├────────────┤  ├──────────────┤
│ id (PK)          │   │ id (PK)         │──┐│ id (PK)   │  │ id (PK)      │
│ userId (FK)      │   │ userId (FK)     │  ││ userId(FK)│  │ userId (FK)  │
│ medicalConditions│   │ symptomName     │  │└────────────┘  │ type         │
│ allergies        │   │ bodyLocation    │  │                │ content      │
│ currentMeds      │   │ severity        │  │                │ ...          │
│ emergencyContact │   │ startedAt       │  │                └──────────────┘
│ bloodType        │   │ endedAt         │  │
│ height           │   │ status          │  │
│ weight           │   │ createdAt       │  │
└──────────────────┘   │ updatedAt       │  │
                       └─────────────────┘  │
                                            │
                ┌───────────────────────────┼─────────────────┐
                │                           │                 │
                ▼                           ▼                 ▼
      ┌─────────────────┐        ┌──────────────────┐  ┌───────────┐
      │ SymptomDetail   │        │ TriageAssessment │  │Attachment │
      ├─────────────────┤        ├──────────────────┤  ├───────────┤
      │ id (PK)         │        │ id (PK)          │  │ id (PK)   │
      │ symptomId (FK)  │        │ symptomId (FK)   │  │symptomId  │
      │ characteristic  │        │ urgencyLevel     │  │ fileName  │
      │ frequency       │        │ score            │  │ fileUrl   │
      │ triggers[]      │        │ reasoning[]      │  │ fileType  │
      │ alleviating[]   │        │ recommendation   │  │ fileSize  │
      │ aggravating[]   │        │ redFlags[]       │  └───────────┘
      │ notes           │        │ aiInsights       │
      │ temperature     │        │ patternAnalysis  │
      │ heartRate       │        │ createdAt        │
      │ bloodPressure   │        └──────────────────┘
      └─────────────────┘
                │
                ▼
         ┌─────────────┐
         │  Treatment  │
         ├─────────────┤
         │ id (PK)     │
         │ symptomId   │
         │ type        │
         │ description │
         │ startedAt   │
         │ endedAt     │
         │ effectiveness│
         └─────────────┘
```

### Model Descriptions

#### **User Model**

Core authentication and profile information.

```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String
  dateOfBirth  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  profile        UserProfile?
  symptoms       Symptom[]
  medications    Medication[]
  refreshTokens  RefreshToken[]
  healthInsights HealthInsight[]
}
```

**Purpose**: Stores user authentication credentials and basic profile data. Password is hashed with bcrypt (12 rounds).

#### **UserProfile Model**

Extended medical history and health information.

```prisma
model UserProfile {
  id                 String   @id @default(uuid())
  userId             String   @unique
  medicalConditions  String[] @default([])
  allergies          String[] @default([])
  currentMedications String[] @default([])
  emergencyContact   Json?
  bloodType          String?
  height             Float?
  weight             Float?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Medical history for personalized triage assessments and insights.

#### **Symptom Model**

Core symptom tracking entity.

```prisma
model Symptom {
  id           String        @id @default(uuid())
  userId       String
  symptomName  String
  bodyLocation String?
  severity     Int           @default(5) // 1-10 scale
  startedAt    DateTime      @default(now())
  endedAt      DateTime?
  status       SymptomStatus @default(ACTIVE)

  // Relations
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  details           SymptomDetail?
  triageAssessments TriageAssessment[]
  attachments       Attachment[]
  treatments        Treatment[]

  @@index([userId, startedAt])
  @@index([status])
}

enum SymptomStatus {
  ACTIVE      // Currently experiencing
  RESOLVED    // No longer present
  IMPROVING   // Getting better
  WORSENING   // Getting worse
  MONITORING  // Tracking for changes
}
```

**Purpose**: Main symptom entity with temporal tracking and status management.

**Indexes**:

- `userId + startedAt`: Fast user symptom queries ordered by date
- `status`: Efficient filtering by symptom status

#### **SymptomDetail Model**

Extended symptom characteristics and vital signs.

```prisma
model SymptomDetail {
  id                 String   @id @default(uuid())
  symptomId          String   @unique
  characteristic     String?  // sharp, dull, burning, throbbing
  frequency          String?  // constant, intermittent, occasional
  triggers           String[] @default([])
  alleviatingFactors String[] @default([])
  aggravatingFactors String[] @default([])
  notes              String?
  temperature        Float?
  heartRate          Int?
  bloodPressure      String?

  symptom Symptom @relation(fields: [symptomId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Rich symptom metadata for better triage accuracy and pattern recognition.

#### **TriageAssessment Model**

Triage evaluation results.

```prisma
model TriageAssessment {
  id              String       @id @default(uuid())
  symptomId       String
  urgencyLevel    UrgencyLevel
  score           Int          @default(0)
  reasoning       String[]     @default([])
  recommendation  String
  redFlags        String[]     @default([])
  aiInsights      String?      @db.Text
  patternAnalysis String?      @db.Text
  createdAt       DateTime     @default(now())

  symptom Symptom @relation(fields: [symptomId], references: [id], onDelete: Cascade)

  @@index([symptomId])
}

enum UrgencyLevel {
  EMERGENCY    // Call 911 / Go to ER immediately
  URGENT       // Urgent care within 2-4 hours
  SEMI_URGENT  // Primary care within 24-48 hours
  NON_URGENT   // Schedule within 1-2 weeks
  SELF_CARE    // Monitor at home
}
```

**Purpose**: Store triage results with reasoning for audit trail and improvement.

#### **Medication Model**

Medication tracking and scheduling.

```prisma
model Medication {
  id              String           @id @default(uuid())
  userId          String
  name            String
  dosage          String
  frequency       String
  timeSlots       String[]         @default([])
  startDate       DateTime
  endDate         DateTime?
  purpose         String?
  prescribedBy    String?
  sideEffects     String[]         @default([])
  notes           String?
  reminderEnabled Boolean          @default(true)
  status          MedicationStatus @default(ACTIVE)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs MedicationLog[]

  @@index([userId, status])
}

enum MedicationStatus {
  ACTIVE
  PAUSED
  COMPLETED
  DISCONTINUED
}
```

**Purpose**: Track medications with scheduling and adherence monitoring.

#### **MedicationLog Model**

Daily medication intake tracking.

```prisma
model MedicationLog {
  id                String   @id @default(uuid())
  medicationId      String
  scheduledTime     DateTime
  takenAt           DateTime?
  status            String   // TAKEN, SKIPPED, MISSED
  notes             String?
  effectiveness     Int?     // 1-10 scale
  sideEffectsNoted  String[] @default([])

  medication Medication @relation(fields: [medicationId], references: [id], onDelete: Cascade)

  @@index([medicationId, scheduledTime])
}
```

**Purpose**: Log each medication intake for adherence calculation and effectiveness tracking.

#### **HealthInsight Model**

AI-generated long-term health insights.

```prisma
model HealthInsight {
  id              String   @id @default(uuid())
  userId          String
  type            String   // pattern, trend, risk_factor, recommendation
  title           String
  description     String   @db.Text
  severity        String   // low, medium, high, critical
  relatedSymptoms String[] @default([])
  recommendations String[] @default([])
  confidence      Float
  metadata        Json?
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, type])
}
```

**Purpose**: Store AI-generated pattern analysis and health recommendations.

#### **Attachment Model**

File uploads for symptoms.

```prisma
model Attachment {
  id        String   @id @default(uuid())
  symptomId String
  fileName  String
  fileUrl   String
  fileType  String
  fileSize  Int
  createdAt DateTime @default(now())

  symptom Symptom @relation(fields: [symptomId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Store photos, documents, or other files related to symptoms.

#### **Treatment Model**

Treatment tracking for symptoms.

```prisma
model Treatment {
  id            String    @id @default(uuid())
  symptomId     String
  type          String    // medication, therapy, lifestyle
  description   String
  startedAt     DateTime  @default(now())
  endedAt       DateTime?
  effectiveness Int?      // 1-10 scale
  notes         String?

  symptom Symptom @relation(fields: [symptomId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Track treatments applied to symptoms and their effectiveness.

#### **RefreshToken Model**

JWT refresh token management.

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Store refresh tokens for secure token rotation and revocation.

### Database Relationships

- **User** → **UserProfile** (1:1)
- **User** → **Symptoms** (1:N)
- **User** → **Medications** (1:N)
- **User** → **HealthInsights** (1:N)
- **User** → **RefreshTokens** (1:N)
- **Symptom** → **SymptomDetail** (1:1)
- **Symptom** → **TriageAssessments** (1:N)
- **Symptom** → **Attachments** (1:N)
- **Symptom** → **Treatments** (1:N)
- **Medication** → **MedicationLogs** (1:N)

### Cascade Deletion Rules

All relations use `onDelete: Cascade`:

- Delete User → All related data deleted
- Delete Symptom → Details, triage, attachments deleted
- Delete Medication → Logs deleted

**Rationale**: Maintain data integrity and comply with GDPR "right to be forgotten".

---

## 📡 API Documentation

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication

All protected endpoints require JWT Bearer token:

```http
Authorization: Bearer <access_token>
```

---

### 🔐 Authentication Endpoints

#### **POST /api/auth/register**

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "dateOfBirth": "1990-01-15" // Optional
}
```

**Validation Rules:**

- Email: Valid email format, unique
- Password: Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
- Name: Required, 2-100 characters

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "createdAt": "2025-12-10T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `409 Conflict`: Email already exists
- `400 Bad Request`: Validation errors

---

#### **POST /api/auth/login**

Authenticate user and get tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "dateOfBirth": "1990-01-15T00:00:00.000Z"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid credentials

---

#### **POST /api/auth/refresh**

Get new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or expired refresh token

---

#### **POST /api/auth/logout**

Revoke refresh token.

**Request Body:**

```json
{
  "refreshToken": "..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### 🩺 Symptom Endpoints

#### **POST /api/symptoms**

Create new symptom with triage assessment.

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "symptomName": "Severe Headache",
  "bodyLocation": "Forehead",
  "severity": 8,
  "characteristic": "throbbing",
  "frequency": "constant",
  "triggers": ["stress", "bright lights"],
  "alleviatingFactors": ["dark room", "rest"],
  "aggravatingFactors": ["movement", "noise"],
  "temperature": 99.5,
  "heartRate": 85,
  "bloodPressure": "130/85",
  "notes": "Started after work, worsening"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "symptom": {
      "id": "uuid",
      "symptomName": "Severe Headache",
      "bodyLocation": "Forehead",
      "severity": 8,
      "startedAt": "2025-12-10T14:30:00.000Z",
      "status": "ACTIVE",
      "details": {
        "characteristic": "throbbing",
        "frequency": "constant",
        "triggers": ["stress", "bright lights"],
        "temperature": 99.5,
        "heartRate": 85
      }
    },
    "triageAssessment": {
      "urgencyLevel": "SEMI_URGENT",
      "score": 38,
      "reasoning": [
        "Base severity level: 8/10",
        "Moderate symptom detected: persistent headache",
        "Slightly elevated temperature: 99.5°F"
      ],
      "recommendation": "Contact your primary care provider within 24-48 hours...",
      "redFlags": ["persistent headache"],
      "aiInsights": "Pattern suggests tension headache...", // If AI enabled
      "patternAnalysis": "Similar headaches occurred 3 times this month..."
    }
  }
}
```

---

#### **GET /api/symptoms**

Get all user symptoms with filtering.

**Query Parameters:**

- `status` (optional): Filter by status (ACTIVE, RESOLVED, etc.)
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date
- `limit` (optional): Results per page (default: 50)
- `offset` (optional): Pagination offset

**Example:**

```http
GET /api/symptoms?status=ACTIVE&limit=20
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "symptoms": [
      {
        "id": "uuid",
        "symptomName": "Headache",
        "severity": 7,
        "startedAt": "2025-12-10T10:00:00.000Z",
        "status": "ACTIVE",
        "triageAssessments": [
          {
            "urgencyLevel": "SEMI_URGENT",
            "score": 32
          }
        ]
      }
    ],
    "total": 15,
    "page": 1,
    "pages": 1
  }
}
```

---

#### **GET /api/symptoms/:id**

Get single symptom with full details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symptomName": "Chest Pain",
    "bodyLocation": "Center Chest",
    "severity": 9,
    "startedAt": "2025-12-10T08:00:00.000Z",
    "endedAt": null,
    "status": "ACTIVE",
    "details": {
      "characteristic": "sharp",
      "frequency": "intermittent",
      "triggers": ["exertion"],
      "temperature": 98.6,
      "heartRate": 95,
      "bloodPressure": "140/90",
      "notes": "Pain radiates to left arm"
    },
    "triageAssessments": [
      {
        "urgencyLevel": "EMERGENCY",
        "score": 119,
        "reasoning": [
          "CRITICAL: Detected life-threatening symptom - chest pain",
          "Base severity level: 9/10",
          "Abnormal blood pressure: 140/90"
        ],
        "recommendation": "🚨 CALL 911 IMMEDIATELY...",
        "redFlags": ["chest pain"],
        "createdAt": "2025-12-10T08:05:00.000Z"
      }
    ],
    "attachments": [],
    "treatments": []
  }
}
```

---

#### **PUT /api/symptoms/:id**

Update existing symptom.

**Request Body:** (Partial update supported)

```json
{
  "severity": 5,
  "status": "IMPROVING",
  "endedAt": "2025-12-10T18:00:00.000Z",
  "notes": "Much better after medication"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "symptom": {
      /* Updated symptom */
    }
  }
}
```

---

#### **DELETE /api/symptoms/:id**

Delete symptom and related data.

**Response (200):**

```json
{
  "success": true,
  "message": "Symptom deleted successfully."
}
```

---

#### **GET /api/symptoms/timeline**

Get chronological symptom timeline.

**Query Parameters:**

- `days` (optional): Number of days to include (default: 30)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2025-12-10",
        "symptoms": [
          {
            "id": "uuid",
            "symptomName": "Headache",
            "severity": 7,
            "urgencyLevel": "SEMI_URGENT",
            "startedAt": "2025-12-10T10:00:00.000Z"
          }
        ]
      },
      {
        "date": "2025-12-09",
        "symptoms": [...]
      }
    ],
    "stats": {
      "totalSymptoms": 12,
      "activeSymptoms": 3,
      "averageSeverity": 5.2,
      "urgencyDistribution": {
        "EMERGENCY": 0,
        "URGENT": 1,
        "SEMI_URGENT": 4,
        "NON_URGENT": 5,
        "SELF_CARE": 2
      }
    }
  }
}
```

---

### 💊 Medication Endpoints

#### **POST /api/medications**

Create new medication.

**Request Body:**

```json
{
  "name": "Ibuprofen",
  "dosage": "400mg",
  "frequency": "Twice daily",
  "timeSlots": ["08:00", "20:00"],
  "startDate": "2025-12-10",
  "endDate": "2025-12-17", // Optional
  "purpose": "Pain relief",
  "prescribedBy": "Dr. Smith",
  "sideEffects": ["nausea"],
  "reminderEnabled": true
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ibuprofen",
    "dosage": "400mg",
    "frequency": "Twice daily",
    "timeSlots": ["08:00", "20:00"],
    "status": "ACTIVE",
    "logs": [] // Daily logs created automatically
  }
}
```

---

#### **GET /api/medications**

Get all user medications.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "Twice daily",
      "status": "ACTIVE",
      "adherenceRate": 95.5
    }
  ]
}
```

---

#### **GET /api/medications/stats**

Get medication adherence statistics.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalMedications": 3,
    "activeMedications": 2,
    "overallAdherence": 92.3,
    "recentLogs": [...]
  }
}
```

---

#### **POST /api/medications/logs/:logId/intake**

Log medication intake.

**Request Body:**

```json
{
  "status": "TAKEN",
  "notes": "Took with food",
  "effectiveness": 8,
  "sideEffectsNoted": ["mild drowsiness"]
}
```

---

### 🤖 AI Insights Endpoints

#### **POST /api/insights/generate**

Generate AI insights from symptom history.

**Request Body:**

```json
{
  "days": 30 // Analyze last 30 days
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "pattern",
        "title": "Recurring Headache Pattern",
        "description": "Headaches consistently occur on weekdays, suggesting work-related stress...",
        "severity": "medium",
        "relatedSymptoms": ["headache", "fatigue"],
        "recommendations": [
          "Practice stress management techniques",
          "Maintain regular sleep schedule"
        ],
        "confidence": 0.85
      }
    ]
  }
}
```

---

#### **GET /api/insights**

Get all stored insights for user.

---

#### **DELETE /api/insights/:id**

Delete specific insight.

---

### 🏥 Health Check

#### **GET /health**

Check API server status (no authentication required).

**Response (200):**

```json
{
  "success": true,
  "message": "Smart Symptom Log & Triage Assistant API is running",
  "timestamp": "2025-12-10T12:00:00.000Z"
}
```

---

### Error Response Format

All errors follow consistent format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": {
    // Optional, for validation errors
    "field": ["Validation error message"]
  }
}
```

**HTTP Status Codes:**

- `200 OK`: Successful request
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## 🛠️ Setup Instructions

---

## 🛠️ Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Docker**: Optional, for containerized PostgreSQL ([Download](https://www.docker.com/))
- **Git**: For version control ([Download](https://git-scm.com/))

### Quick Start (Recommended)

The fastest way to get started using the included startup script:

```bash
# 1. Clone the repository
git clone https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant.git
cd Smart-Symptom-Log-Triage-Assistant

# 2. Start PostgreSQL with Docker
chmod +x start-dev.sh
./start-dev.sh
# This script will:
# - Start PostgreSQL in Docker
# - Wait for database to be ready
# - Display next steps

# 3. In a new terminal: Setup and start backend
cd backend
npm install
cp .env.example .env
# Edit .env if needed (defaults work for Docker setup)
npm run prisma:generate
npm run prisma:migrate
npm run dev

# 4. In another terminal: Setup and start frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

# 5. Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# Health:   http://localhost:5000/health
```

### Detailed Setup

#### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant.git
cd Smart-Symptom-Log-Triage-Assistant

# Install root dependencies (if any)
npm install
```

#### Step 2: Database Setup

##### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d

# Verify database is running
docker compose ps

# View logs
docker compose logs postgres

# Stop database when done
docker compose down
```

**Docker Compose Configuration:**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: symptom-tracker-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: symptom_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

##### Option B: Local PostgreSQL Installation

```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Create database
createdb symptom_tracker

# Or using psql
psql -U postgres
CREATE DATABASE symptom_tracker;
\q
```

#### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Environment Variables (.env):**

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/symptom_tracker?schema=public"

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# AI/ML Service (Optional - for enhanced triage)
GEMINI_API_KEY=your-gemini-api-key-here
# Get key from: https://makersuite.google.com/app/apikey
```

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Optional: Seed database with sample data
npm run seed

# Start development server
npm run dev
```

**Backend will be running at: http://localhost:5000**

**Verify backend is running:**

```bash
curl http://localhost:5000/health
```

#### Step 4: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local if needed
nano .env.local
```

**Environment Variables (.env.local):**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

**Frontend will be running at: http://localhost:3000**

#### Step 5: Verify Installation

1. **Check Backend Health:**

   ```bash
   curl http://localhost:5000/health
   ```

   Expected: `{"success":true,"message":"...","timestamp":"..."}`

2. **Open Frontend:**
   Navigate to http://localhost:3000
   You should see the landing page

3. **Test Registration:**

   - Click "Get Started" or "Register"
   - Create a test account
   - Login and access dashboard

4. **Test Symptom Logging:**
   - Navigate to "New Symptom"
   - Fill out the form
   - Submit and view triage assessment

### Optional: AI Enhancement Setup

To enable AI-powered insights with Google Gemini:

1. **Get Gemini API Key:**

   - Visit https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Create new API key
   - Copy the key

2. **Configure Backend:**

   ```bash
   # Edit backend/.env
   GEMINI_API_KEY=your-actual-api-key-here
   ```

3. **Restart Backend:**

   ```bash
   cd backend
   npm run dev
   ```

4. **Verify AI Integration:**
   - Log a symptom in the application
   - Check for "AI Insight" section in triage results
   - Navigate to Insights page for pattern analysis

### Development Commands

#### Backend Commands

```bash
cd backend

# Development
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Start production server
npm run lint             # Check TypeScript errors

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create/apply migrations
npm run prisma:push      # Push schema without migration
npm run prisma:studio    # Open Prisma Studio GUI
npm run seed             # Seed database with sample data

# Testing
npm test                 # Run tests (if configured)
```

#### Frontend Commands

```bash
cd frontend

# Development
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
```

#### Docker Commands

```bash
# Database management
docker compose up -d          # Start in background
docker compose down           # Stop containers
docker compose logs postgres  # View logs
docker compose restart        # Restart services
docker compose ps             # List containers

# Database backup/restore
docker exec symptom-tracker-db pg_dump -U postgres symptom_tracker > backup.sql
docker exec -i symptom-tracker-db psql -U postgres symptom_tracker < backup.sql

# Clean up
docker compose down -v        # Stop and remove volumes
```

### Troubleshooting

#### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

#### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps
# or
sudo service postgresql status

# Test connection
psql -U postgres -d symptom_tracker -c "SELECT 1"

# Reset database
cd backend
npm run prisma:migrate reset
```

#### Prisma Issues

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset and re-migrate
npm run prisma:migrate reset

# Fix migration issues
rm -rf prisma/migrations
npm run prisma:migrate dev --name init
```

#### Frontend Build Issues

```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### JWT Token Issues

- Ensure `JWT_SECRET` is set in `.env`
- Tokens are case-sensitive
- Check token expiration times
- Clear localStorage and re-login

---

## 🎯 Features

---

## 🎯 Features

### ✅ Implemented Features

#### 1. **User Authentication & Authorization**

- ✅ Secure registration with email validation
- ✅ Password hashing (bcrypt with 12 salt rounds)
- ✅ JWT-based authentication (access + refresh tokens)
- ✅ Token refresh mechanism (seamless re-authentication)
- ✅ Protected routes and API endpoints
- ✅ Secure logout with token revocation
- ✅ Password strength requirements
- ✅ User profile management

#### 2. **Comprehensive Symptom Tracking**

- ✅ Multi-field symptom entry form
- ✅ Body location selection (30+ locations)
- ✅ Severity rating (1-10 scale with visual indicators)
- ✅ Symptom characteristics (sharp, dull, burning, etc.)
- ✅ Frequency patterns (constant, intermittent, occasional)
- ✅ Trigger identification
- ✅ Alleviating and aggravating factors
- ✅ Vital signs logging (temperature, heart rate, blood pressure)
- ✅ Free-form notes and context
- ✅ Temporal tracking (start/end times)
- ✅ Status management (Active, Resolved, Improving, Worsening, Monitoring)

#### 3. **Intelligent Triage Assessment**

- ✅ **Rule-Based Engine:**
  - Critical symptom detection (60+ emergency symptoms)
  - Red flag identification (40+ high-priority symptoms)
  - Severity scoring algorithm (0-150+ scale)
  - Emergency symptom combination detection
  - Vital signs abnormality assessment
  - 5-level urgency classification
- ✅ **AI Enhancement (Optional):**
  - Google Gemini AI integration
  - Pattern recognition across history
  - Contextual health insights
  - Personalized recommendations
  - Confidence scoring
  - Natural language summaries
- ✅ **Triage Levels:**
  - 🚨 EMERGENCY (Score ≥100): Immediate 911
  - ⚠️ URGENT (70-99): Care within 2-4 hours
  - 📞 SEMI-URGENT (40-69): Contact provider 24-48h
  - 📅 NON-URGENT (20-39): Schedule 1-2 weeks
  - 🏠 SELF-CARE (<20): Monitor at home

#### 4. **Medication Management**

- ✅ Medication record creation
- ✅ Dosage and frequency tracking
- ✅ Multi-time daily scheduling
- ✅ Purpose and prescriber documentation
- ✅ Side effect tracking
- ✅ Medication logs (taken/skipped/missed)
- ✅ Adherence rate calculation
- ✅ Effectiveness rating (1-10 scale)
- ✅ Medication statistics dashboard
- ✅ Active/paused/completed status management

#### 5. **Health Analytics & Visualization**

- ✅ Dashboard overview with key metrics
- ✅ Active vs. resolved symptom tracking
- ✅ Severity trend analysis
- ✅ Urgency level distribution (pie charts)
- ✅ Timeline visualization (chronological view)
- ✅ Symptom frequency analysis
- ✅ Body location heat maps (Recharts)
- ✅ Date range filtering
- ✅ Interactive charts with tooltips
- ✅ Responsive design for all devices

#### 6. **AI-Powered Health Insights** (Optional)

- ✅ Long-term pattern analysis
- ✅ Recurring symptom cluster detection
- ✅ Temporal trend identification
- ✅ Risk factor highlighting
- ✅ Personalized health recommendations
- ✅ Confidence scoring for insights
- ✅ Insight storage and management
- ✅ Natural language explanations

#### 7. **Report Generation & Sharing**

- ✅ PDF export functionality
- ✅ Symptom timeline reports
- ✅ Medication history summaries
- ✅ Triage assessment reports
- ✅ Share modal with multiple options:
  - Download to device
  - Email integration
  - WhatsApp sharing
- ✅ Print-ready formatting
- ✅ Professional medical report layout

#### 8. **Security & Privacy**

- ✅ HTTPS-ready configuration
- ✅ Helmet.js security headers
- ✅ CORS protection with whitelist
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Input sanitization and validation
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ Password strength enforcement
- ✅ JWT token expiration and rotation
- ✅ Secure token storage
- ✅ Cascade deletion for data privacy
- ✅ Database indexing for performance

#### 9. **User Experience**

- ✅ Modern, responsive UI (Tailwind CSS 4)
- ✅ 3D button and select components
- ✅ Dark mode support
- ✅ Intuitive navigation
- ✅ Loading states and spinners
- ✅ Error handling and user feedback
- ✅ Form validation with clear messages
- ✅ Mobile-optimized layouts
- ✅ Accessibility considerations
- ✅ Toast notifications

#### 10. **Developer Experience**

- ✅ TypeScript throughout (type safety)
- ✅ Prisma ORM (type-safe database queries)
- ✅ Hot reload development servers
- ✅ Environment-based configuration
- ✅ Migration system for database changes
- ✅ Comprehensive error logging
- ✅ Code organization and modularity
- ✅ RESTful API design
- ✅ Docker Compose for local development
- ✅ Startup script for quick setup

---

## 🔐 Security

---

## 🔐 Security

### Authentication Security

#### Password Protection

```typescript
// Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters recommended

// Hashing:
- Algorithm: bcrypt
- Salt rounds: 12 (2^12 = 4,096 iterations)
- Time per hash: ~200-300ms
- Rainbow table resistant
- Brute force resistant (~10 hashes/second)
```

#### JWT Token Strategy

```typescript
// Access Token:
- Lifetime: 15 minutes
- Payload: { id, email }
- Algorithm: HS256
- Secret: env.JWT_SECRET

// Refresh Token:
- Lifetime: 7 days
- Stored in database for revocation
- Rotated on each refresh
- Single-use tokens

// Token Flow:
1. Login → Issue both tokens
2. Access token expires → Use refresh token
3. Get new access token → Continue
4. Refresh expires → Re-login required
```

### API Security

#### Rate Limiting

```typescript
// Configuration:
- Window: 15 minutes
- Max requests: 100 per IP
- Response: 429 Too Many Requests
- Headers: X-RateLimit-*

// Protects against:
- DDoS attacks
- Brute force attempts
- API abuse
- Automated scraping
```

#### CORS Protection

```typescript
// Allowed Origins:
- http://localhost:3000
- http://localhost:3001
- Production domain (configured)

// Allowed Methods:
- GET, POST, PUT, DELETE

// Credentials: true (allows cookies/auth headers)
```

#### Helmet.js Headers

```typescript
// Security Headers Set:
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Referrer-Policy: no-referrer

// Protects Against:
- Clickjacking
- XSS attacks
- MIME-type sniffing
- Clickjacking
- Protocol downgrade
```

### Input Validation

#### Express-Validator

```typescript
// Validation Rules:
- Email format and uniqueness
- String length limits
- Number ranges (severity 1-10)
- Date format validation
- Required field enforcement
- SQL injection prevention
- HTML/script tag sanitization

// Example:
body('symptomName')
  .trim()
  .isLength({ min: 2, max: 200 })
  .withMessage('Symptom name must be 2-200 characters')
```

### Database Security

#### Prisma ORM Protection

```typescript
// Built-in Protection:
- Parameterized queries (prevents SQL injection)
- Type-safe query building
- Input sanitization
- Connection pooling
- Transaction support

// No direct SQL execution:
// BAD:  raw SQL with user input
// GOOD: Prisma query builder
await prisma.user.findUnique({
  where: { email: sanitizedEmail }
})
```

#### Data Access Control

```typescript
// User Isolation:
- All queries filtered by userId
- No cross-user data access
- Ownership verification on updates/deletes

// Example:
const symptom = await prisma.symptom.findFirst({
  where: {
    id: symptomId,
    userId: requestUser.id // Critical check
  }
});
if (!symptom) throw new Error('Not found');
```

#### Cascade Deletion

```typescript
// Privacy Compliance:
- Delete user → All data removed
- Delete symptom → Cascades to details, triage
- Supports GDPR "right to be forgotten"

// Configuration:
onDelete: Cascade // In schema relations
```

### Data Privacy

#### HTTPS/TLS

```typescript
// Production Requirements:
- TLS 1.2 or higher
- Valid SSL certificate
- HSTS header enforced
- HTTP→HTTPS redirect

// Local Development:
- HTTP acceptable
- Use self-signed cert if testing HTTPS
```

#### Environment Variables

```typescript
// Sensitive Data Protection:
- Never commit .env files
- Use .env.example templates
- Rotate secrets regularly
- Different secrets per environment

// Critical Secrets:
- JWT_SECRET
- JWT_REFRESH_SECRET
- DATABASE_URL
- GEMINI_API_KEY
```

#### Password Storage

```typescript
// Best Practices:
✅ Store hashed passwords only
✅ Never log passwords
✅ Never return passwords in API responses
✅ Use HTTPS for transmission
❌ Never store plaintext passwords
❌ Never email passwords
```

### Response Security

#### Sensitive Data Handling

```typescript
// User Response (safe):
{
  id, email, name, dateOfBirth;
}
// ❌ Never include: passwordHash, refreshTokens

// Error Responses:
// Production:
{
  error: "Authentication failed";
}
// ❌ Avoid: "Password incorrect" or "User not found"
// (Prevents user enumeration attacks)
```

#### Content Compression

```typescript
// Gzip Compression:
- Reduces bandwidth
- Faster responses
- Compression ratio: 70-80%
- Enabled via middleware
```

### Security Best Practices

#### Production Checklist

- [ ] Change default JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Enable database connection pooling
- [ ] Set up monitoring and alerting
- [ ] Regular dependency updates
- [ ] Security audit with npm audit
- [ ] Rate limiting per user (not just IP)
- [ ] Implement request logging
- [ ] Set up backup strategy
- [ ] Enable database encryption at rest
- [ ] Configure firewall rules
- [ ] Implement API versioning
- [ ] Set up WAF (Web Application Firewall)

#### Development Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 🚀 Deployment

---

## 🚀 Deployment

### Production Deployment Options

#### Option 1: Vercel (Frontend) + Render/Railway (Backend)

**Frontend on Vercel:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd frontend
vercel

# 3. Add environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend.com/api

# 4. Deploy to production
vercel --prod
```

**Backend on Render:**

```yaml
# render.yaml
services:
  - type: web
    name: symptom-tracker-api
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: symptom-tracker-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true

databases:
  - name: symptom-tracker-db
    databaseName: symptom_tracker
    user: symptom_tracker_user
```

#### Option 2: Docker Deployment

**Dockerfile (Backend):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

**Dockerfile (Frontend):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.prod.yml:**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: symptom_tracker
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/symptom_tracker
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

#### Option 3: VPS Deployment (Ubuntu/Debian)

```bash
# 1. Server Setup
ssh user@your-server-ip
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. Configure PostgreSQL
sudo -u postgres psql
CREATE DATABASE symptom_tracker;
CREATE USER symptom_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE symptom_tracker TO symptom_user;
\q

# 5. Install Nginx
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Install PM2
sudo npm install -g pm2

# 7. Clone and setup application
git clone https://github.com/youruser/symptom-tracker.git
cd symptom-tracker

# Backend
cd backend
npm install
cp .env.example .env
nano .env  # Configure production values
npm run prisma:migrate deploy
npm run build
pm2 start npm --name "symptom-api" -- start
pm2 save
pm2 startup

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
nano .env.local  # Configure API URL
npm run build
pm2 start npm --name "symptom-frontend" -- start

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/symptom-tracker

# Nginx config:
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/symptom-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 9. SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Environment Configuration

#### Production Environment Variables

**Backend (.env):**

```bash
NODE_ENV=production
PORT=5000

# Database - Use connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/symptom_tracker?schema=public&connection_limit=20&pool_timeout=20"

# Strong secrets (use password generator)
JWT_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Production domain
CORS_ORIGIN=https://yourdomain.com

# Adjust for production load
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Gemini API (if using AI features)
GEMINI_API_KEY=<your-key>
```

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Database Migration in Production

```bash
# Run migrations (safe, non-destructive)
npm run prisma:migrate deploy

# If you need to reset (WARNING: deletes all data)
npm run prisma:migrate reset

# Generate Prisma Client
npm run prisma:generate
```

### Monitoring & Logging

#### PM2 Monitoring

```bash
# View logs
pm2 logs symptom-api
pm2 logs symptom-frontend

# Monitor resources
pm2 monit

# Restart on crash
pm2 restart symptom-api --watch

# View status
pm2 status
```

#### Application Logging

```typescript
// Use production logger (Winston, Pino, etc.)
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log important events
logger.info("User registered", { userId, email });
logger.error("Triage assessment failed", { error, symptomId });
```

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="symptom_tracker"

pg_dump -U symptom_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Schedule with cron
# crontab -e
# 0 2 * * * /path/to/backup-script.sh
```

### Health Checks

```typescript
// Enhanced health endpoint
app.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    database: "connected",
    memory: process.memoryUsage(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    health.status = "error";
    health.database = "disconnected";
    return res.status(503).json(health);
  }

  res.json(health);
});
```

### Performance Optimization

```typescript
// Backend
- Enable gzip compression
- Database connection pooling
- Query optimization with indexes
- Implement caching (Redis)
- Use CDN for static assets

// Frontend
- Next.js Image optimization
- Code splitting
- Lazy loading components
- Service worker for offline support
- Bundle size optimization
```

---

## 📊 Future Enhancements

### Planned Features

#### Phase 1: Enhanced User Experience

- [ ] **Interactive Body Map** - Visual symptom location selection
- [ ] **Photo Upload** - Attach images to symptoms (rashes, injuries)
- [ ] **Multi-language Support** - i18n implementation
- [ ] **Voice Input** - Speech-to-text for symptom logging
- [ ] **Offline Mode** - Progressive Web App (PWA) with offline sync
- [ ] **Mobile Apps** - React Native iOS/Android apps

#### Phase 2: Advanced Health Tracking

- [ ] **Wearable Integration**
  - Apple Health
  - Google Fit
  - Fitbit
  - Garmin
- [ ] **Continuous Monitoring**
  - Auto-import vital signs
  - Sleep tracking
  - Activity correlation
- [ ] **Symptom Prediction** - ML model to predict symptom occurrence
- [ ] **Trigger Analysis** - Advanced pattern recognition for triggers

#### Phase 3: Collaboration Features

- [ ] **Family Accounts** - Manage dependents (children, elderly)
- [ ] **Healthcare Provider Portal** - Secure data sharing
- [ ] **Telemedicine Integration** - Video consultation booking
- [ ] **Pharmacy Integration** - Medication refill reminders
- [ ] **Lab Results Import** - Parse and track lab values
- [ ] **Appointment Management** - Calendar integration

#### Phase 4: Advanced AI & Analytics

- [ ] **Improved Triage ML Model** - Learn from outcomes
- [ ] **Symptom Clustering** - Identify related symptom groups
- [ ] **Seasonal Analysis** - Detect seasonal patterns
- [ ] **Community Insights** - Anonymized population health trends
- [ ] **Natural Language Queries** - "Show my headaches this month"
- [ ] **Predictive Alerts** - "Your pattern suggests..."

#### Phase 5: Compliance & Security

- [ ] **HIPAA Compliance Certification** - Healthcare data standards
- [ ] **SOC 2 Compliance** - Security audit certification
- [ ] **GDPR Full Compliance** - European data protection
- [ ] **Two-Factor Authentication** - Enhanced login security
- [ ] **Biometric Authentication** - Fingerprint/Face ID
- [ ] **Audit Logging** - Complete action tracking
- [ ] **Data Export** - Structured data download (JSON, CSV)

#### Phase 6: Premium Features

- [ ] **Subscription Model** - Premium tier with advanced features
- [ ] **Health Coach AI** - Personalized health guidance
- [ ] **Custom Reports** - Configurable report templates
- [ ] **White-Label Solution** - For healthcare organizations
- [ ] **API Access** - Third-party integrations
- [ ] **Advanced Analytics** - Business intelligence dashboards

### Technical Improvements

#### Code Quality

- [ ] Unit test coverage (Jest)
- [ ] Integration tests (Supertest)
- [ ] End-to-end tests (Playwright/Cypress)
- [ ] Performance testing (k6)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Code coverage >80%

#### Architecture

- [ ] Microservices migration
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Event-driven architecture
- [ ] GraphQL API option
- [ ] WebSocket for real-time updates
- [ ] Kubernetes orchestration

#### DevOps

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Blue-green deployment
- [ ] Canary releases
- [ ] Infrastructure as Code (Terraform)

---

## ⚠️ Medical Disclaimer

---

## ⚠️ Medical Disclaimer

**IMPORTANT: This application is for informational and educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.**

### Legal Notices

#### Not Medical Advice

- This application does not provide medical advice, diagnosis, or treatment
- All content and triage assessments are algorithmic and may not be accurate
- Triage results should not be used as the sole basis for medical decisions
- Always seek the advice of qualified healthcare professionals

#### Emergency Situations

- **In case of a medical emergency, call 911 immediately**
- Do not rely on this application during emergencies
- Do not use this application as a substitute for emergency medical services
- Time-sensitive medical conditions require immediate professional evaluation

#### Healthcare Professional Relationship

- Using this application does not create a doctor-patient relationship
- Always consult with your physician or qualified healthcare provider
- Discuss any health concerns with your healthcare team
- Do not disregard professional medical advice based on this application

#### Accuracy and Reliability

- Triage assessments are generated by algorithms, not medical professionals
- AI insights are supplementary and may contain errors
- Symptom databases may not be exhaustive or current
- Individual medical conditions vary significantly

#### Privacy and Data Security

- While we implement security measures, no system is 100% secure
- Users are responsible for keeping access credentials confidential
- Medical information should be shared carefully
- See our Privacy Policy for data handling details

#### Liability Limitations

- This software is provided "as is" without warranties of any kind
- Developers are not liable for medical outcomes or decisions
- Users assume all risks associated with using this application
- This disclaimer applies to the fullest extent permitted by law

### Proper Usage Guidelines

#### DO Use This Application To:

✅ Track symptoms for personal reference
✅ Organize health information for doctor visits
✅ Monitor symptom patterns over time
✅ Remember medication schedules
✅ Document health trends

#### DO NOT Use This Application To:

❌ Diagnose medical conditions
❌ Make treatment decisions
❌ Delay seeking professional medical care
❌ Replace doctor consultations
❌ Determine if emergency care is needed (when in doubt, call 911)

### When to Seek Immediate Medical Attention

**Call 911 or go to the nearest emergency room if you experience:**

- Chest pain or pressure
- Difficulty breathing or shortness of breath
- Sudden severe headache
- Loss of consciousness or fainting
- Severe bleeding that won't stop
- Sudden weakness or numbness
- Confusion or difficulty speaking
- Severe abdominal pain
- Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911)
- Severe allergic reaction
- Suicidal thoughts or intent to harm yourself or others
- Any other condition you believe requires immediate medical attention

**DO NOT WAIT. DO NOT use this application to evaluate emergency symptoms.**

### International Users

This application was developed following general medical guidelines. Medical practices, emergency numbers, and healthcare systems vary by country. Always follow local medical guidance and emergency protocols.

---

## 🤝 Contributing

We welcome contributions from the community! This is an open-source educational project.

### How to Contribute

1. **Fork the Repository**

   ```bash
   git clone https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant.git
   cd Smart-Symptom-Log-Triage-Assistant
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Follow existing code style
   - Write clear commit messages
   - Add tests for new features
   - Update documentation

3. **Test Your Changes**

   ```bash
   # Backend
   cd backend
   npm run lint
   npm test

   # Frontend
   cd frontend
   npm run lint
   npm run build
   ```

4. **Submit a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure CI checks pass

### Contribution Guidelines

#### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Follow existing patterns
- **Comments**: Document complex logic
- **Naming**: Descriptive variable/function names

#### Commit Messages

```
feat: Add medication reminder functionality
fix: Correct triage scoring for fever
docs: Update API documentation
refactor: Simplify symptom controller
test: Add unit tests for triage service
```

#### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features (see Future Enhancements)
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Translations
- ♿ Accessibility improvements
- 🔒 Security enhancements

### Reporting Issues

Found a bug? Have a feature request?

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots/logs if applicable
   - Your environment (OS, browser, Node version)

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the project's goals
- No harassment or discrimination

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Adriz1611

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Getting Help

- **Documentation**: Read this README thoroughly
- **Issues**: [GitHub Issues](https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant/discussions)

### Resources

- **Live Demo**: [Coming Soon]
- **Video Tutorial**: [Coming Soon]
- **Blog Posts**: [Coming Soon]

### Project Status

- ✅ **Status**: Active Development
- 📅 **Last Updated**: December 10, 2025
- 🔖 **Version**: 1.0.0
- 🌟 **Stars**: [Give us a star on GitHub!](https://github.com/Adriz1611/Smart-Symptom-Log-Triage-Assistant)

---

## 🙏 Acknowledgments

### Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities

### Inspiration

This project was inspired by the need for accessible, intelligent health tracking tools that empower individuals to make informed healthcare decisions.

### Medical Guidelines

Triage algorithms based on general medical triage principles and emergency medicine guidelines. Not affiliated with or endorsed by any medical organization.

---

## 📈 Project Statistics

- **Total Lines of Code**: ~15,000+
- **Backend Endpoints**: 20+
- **Database Models**: 12
- **React Components**: 30+
- **Triage Symptoms Tracked**: 100+
- **Languages**: TypeScript, SQL, CSS
- **Dependencies**: 50+

---

## 🎯 Project Goals

### Mission

To provide accessible, intelligent health tracking and triage assessment tools that help people make informed decisions about when and where to seek medical care.

### Vision

A future where everyone has access to smart health management tools that bridge the gap between symptom onset and appropriate medical intervention.

### Core Values

- **User Empowerment**: Put health information in users' hands
- **Evidence-Based**: Ground in medical science and best practices
- **Privacy First**: Protect sensitive health information
- **Accessibility**: Make healthcare technology available to all
- **Continuous Improvement**: Learn and evolve with user needs

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Adriz1611/Smart-Symptom-Log-Triage-Assistant&type=Date)](https://star-history.com/#Adriz1611/Smart-Symptom-Log-Triage-Assistant&Date)

---

### Made with ❤️ for better healthcare decision-making

**[⬆ Back to Top](#-smart-symptom-log--triage-assistant)**

</div>

---

_Remember: This is a tool to help organize health information. Always consult healthcare professionals for medical advice._
