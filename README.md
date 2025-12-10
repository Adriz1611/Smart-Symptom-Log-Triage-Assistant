# Smart Symptom Log & Triage Assistant

A comprehensive full-stack healthcare application for intelligent symptom tracking and triage assessment.

## 🏥 Overview

This application helps users:

- **Track health symptoms** with detailed logging (severity, location, characteristics)
- **Get intelligent triage assessments** using rule-based algorithms
- **Make informed healthcare decisions** with urgency level guidance
- **Monitor symptom patterns** over time with timeline visualization
- **Generate medical reports** for healthcare provider consultations

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt

## 📁 Project Structure

```
/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App router pages
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Protected dashboard
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable components
│   │   ├── auth/             # Auth-related components
│   │   ├── symptoms/         # Symptom components
│   │   └── ui/               # UI components
│   └── lib/                  # Utilities and configs
│       ├── api/              # API client functions
│       ├── auth/             # Auth context
│       └── utils.ts          # Helper functions
│
└── backend/                  # Express.js backend API
    ├── src/
    │   ├── config/           # Database & environment config
    │   ├── controllers/      # Route controllers
    │   ├── middleware/       # Auth, validation, errors
    │   ├── models/           # (Prisma handles this)
    │   ├── routes/           # API route definitions
    │   ├── services/         # Business logic (triage)
    │   ├── types/            # TypeScript interfaces
    │   └── server.ts         # Application entry point
    └── prisma/
        └── schema.prisma     # Database schema
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create PostgreSQL database:**

```bash
createdb symptom_tracker
# Or in psql: CREATE DATABASE symptom_tracker;
```

5. **Run Prisma migrations:**

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. **Start development server:**

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.local.example .env.local
# Default values should work for local development
```

4. **Start development server:**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎯 Features

### User Authentication

- Secure registration with password hashing (bcrypt, 12 rounds)
- JWT-based authentication with access & refresh tokens
- Protected routes and API endpoints
- Token refresh mechanism

### Symptom Logging

- Multi-field symptom entry (name, location, severity 1-10)
- Detailed characteristics (sharp, dull, throbbing, etc.)
- Frequency tracking (constant, intermittent, occasional)
- Vital signs (temperature, heart rate, blood pressure)
- Additional notes and context
- Timestamps for symptom start/end

### Intelligent Triage Engine

- Rule-based scoring algorithm
- Red flag symptom detection
- Vital sign abnormality assessment
- 5 urgency levels:
  - 🚨 **EMERGENCY**: Call 911 immediately
  - ⚠️ **URGENT**: Seek care within 2-4 hours
  - 📞 **SEMI-URGENT**: Contact provider within 24-48 hours
  - 📅 **NON-URGENT**: Schedule within 1-2 weeks
  - 🏠 **SELF-CARE**: Monitor at home

### Dashboard & Visualization

- Symptom overview with statistics
- Recent symptoms list with triage results
- Status tracking (Active, Resolved, Improving, etc.)
- Timeline view for pattern recognition

## 🔐 Security Features

- Password strength requirements (8+ chars, mixed case, numbers)
- JWT tokens with expiration
- Refresh token rotation
- HTTP-only cookies (can be configured)
- CORS protection
- Helmet.js security headers
- Rate limiting (100 req/15 min)
- Input validation (express-validator)
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Symptoms (Protected)

- `POST /api/symptoms` - Create symptom
- `GET /api/symptoms` - Get all user symptoms
- `GET /api/symptoms/:id` - Get symptom by ID
- `PUT /api/symptoms/:id` - Update symptom
- `DELETE /api/symptoms/:id` - Delete symptom
- `GET /api/symptoms/timeline` - Get symptom timeline

### Health

- `GET /health` - Server health check

## 🧪 Database Schema

Key models:

- **User**: Authentication and profile
- **UserProfile**: Medical history, allergies, medications
- **Symptom**: Core symptom data
- **SymptomDetail**: Extended symptom information
- **TriageAssessment**: Triage evaluation results
- **Treatment**: Treatment tracking
- **Attachment**: File uploads (photos, documents)

## 🚦 Development Workflow

1. **Backend Development:**

```bash
cd backend
npm run dev        # Start with hot reload
npm run prisma:studio  # Open database GUI
```

2. **Frontend Development:**

```bash
cd frontend
npm run dev        # Start Next.js dev server
```

3. **Database Changes:**

```bash
# Modify prisma/schema.prisma
npm run prisma:migrate  # Create and apply migration
```

## 📊 Future Enhancements

- [ ] Interactive body map for symptom location
- [ ] Photo upload for visible symptoms
- [ ] PDF report generation
- [ ] Symptom pattern analysis & charts
- [ ] Email notifications & reminders
- [ ] Multi-user family accounts
- [ ] Medication tracking
- [ ] Integration with wearables (Apple Health, Fitbit)
- [ ] Telemedicine provider integration
- [ ] ML-powered triage improvement
- [ ] HIPAA compliance certification

## ⚠️ Medical Disclaimer

**This application is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.**

- Always consult with qualified healthcare professionals
- In case of medical emergency, call 911 immediately
- Do not rely solely on this application for medical decisions
- Triage assessments are algorithmic and may not be accurate

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for better healthcare decision-making**
