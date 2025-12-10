# Smart Symptom Log & Triage Assistant - Backend

Backend API for the Smart Symptom Log & Triage Assistant application.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

## Features

- ✅ User authentication (Register, Login, JWT tokens)
- ✅ Symptom logging with detailed tracking
- ✅ Intelligent triage engine with rule-based assessment
- ✅ Timeline and history tracking
- ✅ Treatment logging
- ✅ RESTful API design
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up PostgreSQL database:

```bash
# Create database
createdb symptom_tracker

# Or use PostgreSQL command
psql -U postgres
CREATE DATABASE symptom_tracker;
```

4. Run Prisma migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Development

Start the development server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Push schema without migration (dev only)
npm run prisma:push
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Symptoms (Protected Routes)

- `POST /api/symptoms` - Create new symptom entry
- `GET /api/symptoms` - Get all symptoms for user
- `GET /api/symptoms/:id` - Get specific symptom
- `PUT /api/symptoms/:id` - Update symptom
- `DELETE /api/symptoms/:id` - Delete symptom
- `GET /api/symptoms/timeline` - Get symptom timeline

### Health Check

- `GET /health` - Server health status

## API Request Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01"
  }'
```

### Log Symptom

```bash
curl -X POST http://localhost:5000/api/symptoms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "symptomName": "headache",
    "severity": 7,
    "bodyLocation": "head",
    "details": {
      "characteristic": "throbbing",
      "frequency": "constant",
      "notes": "Started after work"
    }
  }'
```

## Triage Algorithm

The triage engine uses a rule-based scoring system:

- **Base Score**: Severity level (1-10)
- **Red Flags**: Critical symptoms add significant weight
- **Vital Signs**: Abnormal temperature, heart rate, blood pressure
- **Symptom Combinations**: Certain combinations trigger emergency levels

### Urgency Levels

1. **EMERGENCY** - Call 911 / Go to ER immediately
2. **URGENT** - Seek care within 2-4 hours
3. **SEMI_URGENT** - Contact provider within 24-48 hours
4. **NON_URGENT** - Schedule appointment within 1-2 weeks
5. **SELF_CARE** - Monitor at home with self-care

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT authentication with refresh tokens
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS protection
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Set production environment variables
3. Run migrations in production
4. Start server:

```bash
npm start
```

## Environment Variables

See `.env.example` for all required variables.

## License

MIT
