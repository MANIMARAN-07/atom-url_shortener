# 🔗 Sniplink — Smart URL Shortener (Hackathon Submission)

A modern, full-stack URL shortener application built with React, NestJS, and MongoDB.

## 🏗️ Architecture

- **Frontend**: React + Vite
- **Backend API**: NestJS (TypeScript)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT & bcryptjs
- **Short Codes**: NanoID

### Data Flow
1. User authenticates via `/api/auth/login`.
2. Client receives a JWT and stores it.
3. Authenticated requests create short URLs via `/api/urls`.
4. Public users navigate to `/:code` which redirects them.
5. The redirect controller asynchronously tracks the click in the Analytics collection.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or update `MONGODB_URI` in `.env`)

### Backend Setup
```bash
cd backend
npm install
npm install @nestjs/mongoose mongoose @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs nanoid
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm install react-router-dom axios recharts lucide-react react-hook-form
npm run dev
```

## 🎥 Walkthrough Video
[Link to Loom/YouTube Video here]

## 📊 Sample Output
- **Short URL generation:** `POST /api/urls` -> Returns `{ "shortCode": "xA9b2P", "originalUrl": "https://example.com" }`
- **Analytics aggregation:** `GET /api/analytics/:id` -> Returns click counts and referrers.
