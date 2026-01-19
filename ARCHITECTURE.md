# Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Express API    │    │   Supabase      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Cron Scheduler │
                       │  (Monitoring)   │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Email Service  │
                       │  (Alerts)       │
                       └─────────────────┘
```

## Core Components

### Frontend (React + TypeScript)
- **Dashboard**: Real-time monitoring overview
- **URL Management**: Add/edit/delete monitored URLs
- **Charts**: Historical uptime data with Recharts
- **Status Pages**: Public status display
- **Authentication**: Supabase Auth integration

### Backend (Node.js + Express)
- **API Routes**: RESTful endpoints for CRUD operations
- **Monitoring Service**: Periodic URL health checks
- **Email Service**: Alert notifications
- **Database Service**: Supabase integration layer

### Database (Supabase)
```sql
-- Core Tables
users (id, email, created_at)
monitors (id, user_id, url, name, interval, created_at)
checks (id, monitor_id, status, response_time, checked_at)
incidents (id, monitor_id, started_at, resolved_at, status)
```

## Data Flow

1. **User adds URL** → Frontend → API → Supabase
2. **Cron job runs** → Checks URLs → Stores results → Triggers alerts
3. **Dashboard loads** → API fetches data → Charts render
4. **Downtime detected** → Email sent → Incident logged

## Key Features Implementation

### Monitoring System
- node-cron schedules periodic checks
- axios performs HTTP requests with timeout
- Results stored in Supabase with timestamps

### Alert System
- Incident detection on status changes
- nodemailer sends email notifications
- Configurable alert thresholds

### Dashboard
- Real-time data with Supabase subscriptions
- Recharts for uptime percentage graphs
- Response time trend analysis