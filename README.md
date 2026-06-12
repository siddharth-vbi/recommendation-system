# Instagram Template Marketplace — Recommendation System Demo

A full-stack recommendation system demo themed as an Instagram Template Marketplace. Demonstrates content-based filtering, personalized recommendations, user activity tracking, and authentication.

## Tech Stack

### Frontend
- React (JavaScript, JSX), Tailwind CSS, Vite, React Router
- Axios for API calls
- local JSON data fallback (35 templates)

### Backend
- Express.js, PostgreSQL, Sequelize ORM
- JWT authentication (bcryptjs + jsonwebtoken)
- CORS, dotenv

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env    # Edit with your PostgreSQL credentials
npm install
npm run seed            # Seed 35 templates into DB
npm run dev             # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend (configured in `vite.config.js`).

## Project Structure

```
recommendation-system/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   ├── server.js                 # Express entry, CORS, routes
│   │   ├── config/database.js        # Sequelize + PostgreSQL connection
│   │   ├── middleware/auth.js        # JWT authenticate & optionalAuth
│   │   ├── models/
│   │   │   ├── index.js              # Associations + syncDatabase()
│   │   │   ├── User.js
│   │   │   ├── Template.js
│   │   │   ├── View.js
│   │   │   ├── Like.js
│   │   │   └── Search.js
│   │   ├── routes/
│   │   │   ├── auth.js               # POST /register, /login, GET /me
│   │   │   ├── templates.js          # GET /categories, /, /:id, /suggestions
│   │   │   ├── recommendations.js    # GET /similar/:id, /personalized, /trending, /most-viewed
│   │   │   └── activity.js           # POST /view, /like, /search; GET /recent-searches, /liked-ids, etc.
│   │   ├── controllers/              # Route handlers
│   │   └── services/
│   │       └── recommendationService.js  # Scoring logic (same as frontend)
│   └── seeders/seed.js               # Seeds 35 templates
├── frontend/
│   ├── AGENTS.md                     # AI agent context (frontend-specific details)
│   ├── package.json
│   ├── vite.config.js                # Proxy /api -> backend
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                   # Layout, routes, auth-aware navbar
│       ├── api.js                    # Axios instance with JWT interceptor
│       ├── data/templates.js         # 35 template objects (local fallback)
│       ├── context/
│       │   ├── SearchContext.jsx     # Global search state
│       │   └── AuthContext.jsx       # Auth state, login/register/logout
│       ├── components/              # TemplateCard, SearchBar, RecommendationSection, CategoryFilter
│       ├── pages/                   # Home, TemplateDetails, Login, Register
│       └── utils/                   # localStorage.js, recommendationEngine.js, scoring.js, searchSuggestions.js
└── .gitignore
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account (name, email, password) |
| POST | /api/auth/login | No | Login, returns JWT token |
| GET | /api/auth/me | Yes | Get current user profile |
| GET | /api/templates/categories | No | List categories |
| GET | /api/templates | No | List templates (?search=&category=) |
| GET | /api/templates/suggestions | No | Search suggestions (?query=) |
| GET | /api/templates/:id | No | Single template |
| GET | /api/recommendations/similar/:id | Optional | Content-based similar templates |
| GET | /api/recommendations/personalized | Yes | Personalized recommendations |
| GET | /api/recommendations/trending | Yes | Recently viewed by user |
| GET | /api/recommendations/most-viewed | Yes | Most viewed by user |
| POST | /api/activity/view | Yes | Track template view |
| POST | /api/activity/like | Yes | Toggle like |
| POST | /api/activity/search | Yes | Track search query |
| GET | /api/activity/recent-searches | Yes | Recent searches |
| GET | /api/activity/liked-ids | Yes | Liked template IDs |
| GET | /api/activity/view-counts | Yes | Per-template view counts |
| GET | /api/activity/category-view-counts | Yes | Per-category view counts |
