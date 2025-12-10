#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Smart Symptom Log & Triage Assistant${NC}"
echo ""

# Start PostgreSQL
echo -e "${GREEN}1. Starting PostgreSQL in Docker...${NC}"
docker compose up -d
sleep 3

# Check if database is ready
echo -e "${GREEN}2. Waiting for PostgreSQL to be ready...${NC}"
until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Waiting for database..."
  sleep 2
done
echo "   ✓ PostgreSQL is ready!"

echo ""
echo -e "${BLUE}Database is running! Now start your services:${NC}"
echo ""
echo "Terminal 2 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 3 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${GREEN}Then access:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  Health:   http://localhost:5000/health"
echo ""
echo -e "${BLUE}To stop database:${NC} docker compose down"
