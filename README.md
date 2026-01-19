# URL Tracker - Production SaaS

A production-grade URL monitoring and uptime checker with real-time dashboards, automated alerts, and public status pages. Monitor your websites 24/7 with instant notifications when services go down.

## 🚀 What It Does

- **Automated Monitoring**: Checks your URLs every 5 minutes using HTTP requests
- **Real-time Dashboards**: Live status updates with uptime percentages and response times
- **Instant Alerts**: Email notifications when sites go down (UP→DOWN status changes)
- **Historical Analytics**: Response time charts and uptime trends over time
- **Public Status Pages**: Share service status with customers without login required
- **Multi-user Support**: Secure user isolation with Supabase authentication

## 🛠 Tech Stack

### Backend
- **Node.js + Express + TypeScript** - REST API server
- **Supabase** - PostgreSQL database with Row Level Security
- **node-cron** - Scheduled monitoring jobs
- **axios** - HTTP health checks with timeout handling
- **nodemailer** - SMTP email alerts
- **helmet + cors** - Security middleware

### Frontend
- **React + TypeScript + Vite** - Modern SPA with hot reload
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive response time charts
- **React Router** - Client-side routing

### Infrastructure
- **Supabase Auth** - JWT-based authentication
- **PostgreSQL** - Relational database with indexes
- **SMTP** - Email delivery (Gmail, SendGrid, etc.)

## ✨ Features Implemented

### Core Monitoring
- ✅ Add/remove URLs to monitor
- ✅ Configurable check intervals (default: 5 minutes)
- ✅ Expected status code validation (default: 200)
- ✅ Response time measurement
- ✅ Automatic UP/DOWN status detection
- ✅ Historical data storage with timestamps

### Dashboard & Analytics
- ✅ Real-time status overview cards
- ✅ Monitored URLs table with status badges
- ✅ Uptime percentage calculations
- ✅ Response time line charts
- ✅ Last checked timestamps

### Alerting System
- ✅ Email alerts on status changes (UP→DOWN)
- ✅ Prevents duplicate alerts for ongoing outages
- ✅ Detailed alert emails with URL, status code, response time
- ✅ SMTP configuration via environment variables

### Public Status Pages
- ✅ Public URLs accessible without authentication
- ✅ Professional UI similar to StatusPage.io
- ✅ Overall system health indicators
- ✅ Individual service status with uptime percentages

### Security & Performance
- ✅ JWT authentication with Supabase
- ✅ Row Level Security policies
- ✅ Database indexes for query optimization
- ✅ CORS and security headers
- ✅ TypeScript for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- SMTP email provider (Gmail, SendGrid, etc.)

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor
-- Copy from database/schema.sql
CREATE TABLE monitored_urls (...)
CREATE TABLE uptime_logs (...)
-- Includes RLS policies and indexes
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase and SMTP credentials

npm run dev  # Starts on port 3001
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase URL and keys

npm run dev  # Starts on port 3000
```

### 4. Environment Variables

**Backend (.env)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

## 🏗 Production Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
# Deploy dist/ folder to CDN/static hosting
```

## 🔒 Why Production-Ready

### Security
- **Authentication**: Supabase JWT with automatic token refresh
- **Authorization**: Row Level Security ensures users only see their data
- **Input Validation**: TypeScript interfaces and API validation
- **Security Headers**: Helmet.js protection against common attacks
- **CORS**: Configured for specific frontend origins

### Scalability
- **Database**: PostgreSQL with proper indexes and foreign keys
- **Caching**: Efficient queries with limited result sets
- **Async Processing**: Non-blocking HTTP checks with Promise.all
- **Error Handling**: Comprehensive try/catch with proper HTTP status codes

### Reliability
- **Monitoring**: Automated health checks every 5 minutes
- **Alerting**: Immediate email notifications on failures
- **Data Integrity**: Cascade deletes and referential integrity
- **Timeout Handling**: 30-second HTTP timeouts prevent hanging requests

### Maintainability
- **TypeScript**: Full type safety across frontend and backend
- **Modular Architecture**: Separated services, routes, and components
- **Environment Config**: All secrets externalized to .env files
- **Code Organization**: Clear folder structure with single responsibility

### Monitoring & Observability
- **Logging**: Console logs for cron jobs and errors
- **Health Checks**: `/health` endpoint for load balancer monitoring
- **Status Tracking**: Complete audit trail of all URL checks
- **Public Status**: Transparent service status for customers

## 📊 API Endpoints

```
POST   /api/monitor          # Add new URL to monitor
GET    /api/monitor          # Get user's monitored URLs
GET    /api/monitor/logs/:id # Get uptime logs for URL
GET    /api/status/:userId   # Public status page (no auth)
GET    /health               # Health check
```

## 🎯 Use Cases

- **SaaS Companies**: Monitor critical service endpoints
- **E-commerce**: Track website and API availability
- **Development Teams**: Monitor staging and production environments
- **Agencies**: Provide uptime monitoring for client websites
- **Personal Projects**: Keep tabs on side projects and portfolios

Built with modern best practices for scalability, security, and maintainability.