# 🔗 Sniplink — Smart URL Shortener

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A production-grade, full-stack URL shortener SaaS with powerful analytics, QR code generation, custom aliases, bulk CSV shortening, and a beautiful modern dashboard.

---

## ✨ Features

### Core
- **URL Shortening** — Generate unique 6-character short codes using nanoid
- **Custom Aliases** — Brand your links (e.g., `/my-brand`)
- **Expiry Dates** — Auto-deactivate links after a set expiration
- **Server-Side Redirect** — 302 redirect with full click tracking

### Analytics
- **Click Tracking** — Total clicks, unique IPs, daily trends
- **Device Breakdown** — Mobile, desktop, tablet detection via `ua-parser-js`
- **Geo Tracking** — Country detection via `ip-api.com`
- **Browser Detection** — Identify Chrome, Firefox, Safari, etc.
- **30-Day Trend Chart** — Recharts line chart with filled day gaps
- **Recent Visits** — Last 10 visits with full metadata

### Extras
- **QR Code Generation** — Generate and download as PNG
- **Bulk CSV Upload** — Upload a CSV with URLs, download shortened results
- **JWT Authentication** — Access + refresh token pattern with auto-refresh
- **Real-Time Validation** — React Hook Form + Zod on all forms
- **Responsive Design** — Looks great on mobile, tablet, and desktop
- **Framer Motion** — Smooth page transitions and list animations

---

## 🏗️ Architecture

```
sniplink/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # Axios service layer (auth, urls, analytics)
│   │   ├── components/         # DashboardLayout, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT persistence)
│   │   ├── hooks/              # useUrls, useAnalytics
│   │   ├── pages/              # Landing, Login, Signup, Dashboard, Analytics, Settings, NotFound
│   │   └── utils/              # helpers (cn, formatDate, buildShortUrl)
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express.js backend
│   ├── config/                 # db.js (MongoDB connection)
│   ├── controllers/            # authController, urlController, analyticsController, redirectController
│   ├── middleware/              # authMiddleware, errorHandler, rateLimiter, requestLogger
│   ├── models/                 # User, Url, Click (Mongoose schemas)
│   ├── routes/                 # authRoutes, urlRoutes, analyticsRoutes, redirectRoutes
│   ├── services/               # clickService, geoService, bulkService
│   ├── utils/                  # generateToken
│   ├── index.js                # Express entry point
│   └── package.json
│
└── README.md
```

### Request Flow

```
Client → Axios (with JWT interceptor)
  ↓
Express API Routes (/api/*)
  ↓
Auth Middleware (JWT verification)
  ↓
Controller (business logic)
  ↓
Mongoose Model (MongoDB)
  ↓
Response: { success, data, message }
```

### Redirect Flow

```
GET /:shortCode → Lookup Url by shortCode/alias
  → Check expiry → Record click (IP, UA, geo) → 302 redirect
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** v9+

### 1. Clone the repo
```bash
git clone https://github.com/your-username/sniplink.git
cd sniplink
```

### 2. Server setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

### 3. Client setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### 4. Open in browser
Navigate to `http://localhost:5173`

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sniplink
JWT_SECRET=your_jwt_secret_change_this_in_production
JWT_REFRESH_SECRET=your_refresh_secret_change_this_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user info |
| PATCH | `/api/auth/profile` | Update name/email |
| PATCH | `/api/auth/password` | Change password |

### URLs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create short URL |
| GET | `/api/urls` | List user's URLs (paginated) |
| DELETE | `/api/urls/:id` | Delete a URL |
| PATCH | `/api/urls/:id` | Update URL/alias |
| GET | `/api/urls/:id/analytics` | Full analytics |
| GET | `/api/urls/:id/qr` | Generate QR code |
| POST | `/api/urls/bulk` | Bulk CSV upload |

### Analytics & Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/:shortCode` | Redirect to original URL |

---

## 🤖 AI Planning Document

### Planning Process
This application was planned and built following a structured approach:

1. **Requirement Analysis** — Parsed the hackathon brief into discrete features, categorized as mandatory (auth, shortening, analytics) and bonus (QR, CSV, geo tracking).

2. **Architecture Decision** — Chose a monorepo structure with separate client/server directories. Express.js was selected over NestJS for faster iteration. MongoDB over PostgreSQL for schema flexibility with the Click tracking model.

3. **Data Modeling** — Designed three core models:
   - **User**: Standard auth model with bcrypt pre-save hooks
   - **Url**: Short code with sparse unique index on customAlias, virtual `isExpired`
   - **Click**: Denormalized for fast aggregation queries with compound index

4. **API Design** — RESTful API with consistent response shape `{ success, data, message }`. JWT access + refresh token pattern for stateless auth.

5. **Frontend Architecture** — Component-based with clear separation:
   - API layer (`src/api/`) — No raw Axios calls in components
   - Custom hooks — `useUrls`, `useAnalytics` encapsulate data fetching
   - AuthContext — JWT persistence with auto-refresh interceptor

6. **UI/UX Decisions** — Dark navy for auth screens (premium feel), white dashboard (clean data display). Framer Motion for page transitions, Recharts for data viz.

### Feature List
| Feature | Status | Priority |
|---------|--------|----------|
| User signup/login | ✅ | Mandatory |
| JWT auth with refresh | ✅ | Mandatory |
| URL shortening (nanoid) | ✅ | Mandatory |
| Custom aliases | ✅ | Bonus |
| Link expiry | ✅ | Bonus |
| Click tracking | ✅ | Mandatory |
| Device/browser analytics | ✅ | Bonus |
| Geo tracking (ip-api) | ✅ | Bonus |
| QR code generation | ✅ | Bonus |
| Bulk CSV shortening | ✅ | Bonus |
| Recharts analytics | ✅ | Mandatory |
| Responsive UI | ✅ | Mandatory |
| Rate limiting | ✅ | Bonus |

### Key Engineering Decisions
- **nanoid v3** over v5 for CommonJS compatibility with Express
- **Sparse unique index** on `customAlias` to allow multiple `null` values
- **Fire-and-forget click recording** to avoid blocking the redirect response
- **ip-api.com** free tier with graceful fallback for localhost/private IPs
- **Compound index** on `Click { urlId, timestamp }` for efficient analytics aggregation
- **30-day gap filling** — Pre-fills missing days with 0 clicks for smooth chart rendering

---

## 🖼️ Screenshots

> Screenshots to be added after deployment

| Page | Description |
|------|-------------|
| Landing | Hero section with animated demo |
| Login | Dark navy auth card |
| Dashboard | Stats bar, URL table, creation form |
| Analytics | Line chart, donut chart, country bar chart |
| QR Modal | Generated QR code with download |

---

## 🎥 Demo Video

> Loom/YouTube video link to be added

---

## 🧪 Assumptions

1. MongoDB is available locally or via MongoDB Atlas
2. The app is designed for development/demo — not horizontally scaled
3. IP geolocation uses the free ip-api.com tier (45 req/min limit)
4. No email verification flow (out of hackathon scope)
5. Short codes are 6 characters — collision probability is negligible at hackathon scale
6. Access tokens expire in 15 minutes, refresh tokens in 7 days

---

## 📝 License

MIT

---

<p align="center">
  This project is a part of a hackathon run by <a href="https://katomaran.com">https://katomaran.com</a>
</p>
