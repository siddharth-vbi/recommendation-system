# AGENTS.md — Recommendation System Project

## Project Overview

Full-stack recommendation system demo themed as an Instagram Template Marketplace. Demonstrates content-based filtering and personalized recommendations with user authentication and activity tracking.

### Core Concept
35 templates across 6 categories (Fitness, Business, Fashion, Food, Travel, Education). Users browse templates, like them, and get personalized recommendations based on their activity. Both frontend and backend independently implement the same scoring algorithms — the backend serves as the API source while the frontend can fall back to local data.

## Tech Stack

### Frontend (`frontend/`)
- **React 18** (JavaScript, JSX) — no TypeScript
- **Tailwind CSS 3** — utility classes only, scanned from `index.html` + `src/**/*.{js,jsx}`
- **Vite 6** — dev server + build; proxies `/api` to backend via `vite.config.js`
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **localStorage** — fallback persistence for non-authenticated users
- Scripts: `npm run dev`, `npm run build`, `npm run preview`

### Backend (`backend/`)
- **Express.js** — REST API server
- **PostgreSQL** — database via **Sequelize ORM**
- **JWT** — authentication (bcryptjs + jsonwebtoken)
- **dotenv** — env configuration
- **CORS** — cross-origin support
- Scripts: `npm run start`, `npm run dev` (watch mode), `npm run seed`

## Recent Changes (Restructure)
The following changes have been applied to set up the project properly:

1. **Moved `.git` from `frontend/` to repo root** — the repository now tracks the full project (backend + frontend) instead of just the frontend.
2. **Added `.gitignore`** at root — excludes `node_modules/`, `.vite/`, `dist/`, `.env`, `.env.local`, `*.log`, `.DS_Store`, `Thumbs.db`.
3. **Added backend API** — full Express + PostgreSQL backend with auth, template CRUD, activity tracking, and recommendation endpoints.
4. **Added new frontend features** — `AuthContext`, `AuthModal` (login/register popup), `api.js` interceptor.
5. **Moved docs to root** — `AGENTS.md` and `README.md` now live at repo root for project-wide discoverability.
6. **Seeded database** — `backend/seeders/seed.js` populates 35 templates.
7. **Auth modal popup** — Login/Register replaced with `AuthModal` component. Appears as a popup when unauthenticated users click "Like", "Sign In", or try to access recommendation sections. The separate `/login` and `/register` routes have been removed.

## Project Structure

```
recommendation-system/
├── .gitignore
├── AGENTS.md                          # THIS FILE — AI agent context
├── README.md                          # Project docs
├── backend/
│   ├── .env.example                   # Template for env vars
│   ├── .env                           # Actual env (gitignored)
│   ├── package.json
│   ├── seeders/
│   │   └── seed.js                    # Seeds 35 templates + categories
│   └── src/
│       ├── server.js                  # Express entry point
│       ├── config/database.js         # Sequelize postgres connection
│       ├── middleware/auth.js         # JWT verify (authenticate + optionalAuth)
│       ├── models/
│       │   ├── index.js              # Associations & syncDatabase()
│       │   ├── User.js               # id, name, email, password (bcrypt)
│       │   ├── Template.js           # id, title, category, tags[], thumbnail, description
│       │   ├── View.js               # id, templateId, userId, createdAt
│       │   ├── Like.js               # id, templateId, userId
│       │   └── Search.js             # id, query, userId, createdAt
│       ├── routes/
│       │   ├── auth.js               # /api/auth/*
│       │   ├── templates.js          # /api/templates/*
│       │   ├── recommendations.js    # /api/recommendations/*
│       │   └── activity.js           # /api/activity/*
│       ├── controllers/              # Route handler functions
│       └── services/
│           └── recommendationService.js  # Scoring algorithms (same logic as frontend/utils/)
├── frontend/
│   ├── package.json
│   ├── vite.config.js                # Proxy /api -> http://localhost:5000
│   ├── index.html
│   └── src/
│       ├── main.jsx                  # Entry: ReactDOM.createRoot + BrowserRouter + AuthProvider
│       ├── App.jsx                   # Routes, layout, auth-aware navbar
│       ├── api.js                    # Axios instance with Bearer token interceptor
│       ├── index.css                 # Tailwind directives + .card-hover
│       ├── data/templates.js         # 35 template objects + CATEGORIES + getTemplateById()
│       ├── context/
│       │   ├── SearchContext.jsx     # Global search state
│       │   └── AuthContext.jsx       # login(), register(), logout(), user state
│       ├── components/
│       │   ├── TemplateCard.jsx      # Card with optional score display
│       │   ├── SearchBar.jsx         # Controlled input with variant prop
│       │   ├── RecommendationSection.jsx  # Grid section with title
│       │   └── CategoryFilter.jsx    # Pill buttons
│       ├── pages/
│       │   ├── Home.jsx              # Category filter + rec sections + grid
│       │   ├── TemplateDetails.jsx   # Detail + similar templates
│       │   ├── Login.jsx             # Email/password login form
│       │   └── Register.jsx          # Name/email/password register form
│       └── utils/
│           ├── scoring.js            # calculateContentScore(), countMatchingTags()
│           ├── recommendationEngine.js  # getSimilarTemplates(), getPersonalizedRecommendations(), etc.
│           ├── localStorage.js       # trackView(), trackLike(), trackSearch(), getViewCounts(), etc.
│           └── searchSuggestions.js  # getSearchSuggestions()
```

## File Conventions
- `.jsx` — components, pages, contexts (contain JSX)
- `.js` — utilities, services, config, data (no JSX)
- No TypeScript anywhere — write plain JS only
- No comments in code — let code be self-documenting
- No emojis in code or UI unless explicitly asked by user
- Tailwind classes only — no CSS modules, styled-components, or inline styles
- Use `import`/`export` (ESM) throughout — `require`/`module.exports` only if unavoidable

## Database Schema (PostgreSQL via Sequelize)

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoIncrement |
| name | STRING | not null |
| email | STRING | unique, not null |
| password | STRING | bcrypt hashed |
| createdAt | DATE | auto |
| updatedAt | DATE | auto |

### Templates
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoIncrement |
| title | STRING | |
| category | STRING | one of 6 categories |
| tags | JSON | string array |
| thumbnail | STRING | picsum.photos URL |
| description | TEXT | |

### Views
Tracks each template view: id, templateId FK, userId FK, createdAt.

### Likes
Tracks likes as rows (delete on unlike): id, templateId FK, userId FK.

### Searches
Tracks search queries: id, query, userId FK, createdAt.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | `{ name, email, password }` → `{ token, user }` |
| POST | /api/auth/login | No | `{ email, password }` → `{ token, user }` |
| GET | /api/auth/me | Yes | Current user profile |
| GET | /api/templates/categories | No | `["All","Fitness",...]` |
| GET | /api/templates | No | `?search=&category=` |
| GET | /api/templates/suggestions | No | `?query=` → `[{ value, type }]` |
| GET | /api/templates/:id | No | Single template |
| GET | /api/recommendations/similar/:id | Optional | Content-based, top 6 |
| GET | /api/recommendations/personalized | Yes | Personalized, top 6 |
| GET | /api/recommendations/trending | Yes | Recently viewed, top 4 |
| GET | /api/recommendations/most-viewed | Yes | Most viewed, top 4 |
| POST | /api/activity/view | Yes | `{ templateId }` |
| POST | /api/activity/like | Yes | `{ templateId }` → `{ liked: bool }` |
| POST | /api/activity/search | Yes | `{ query }` |
| GET | /api/activity/recent-searches | Yes | Last 10 |
| GET | /api/activity/liked-ids | Yes | Array of template IDs |
| GET | /api/activity/view-counts | Yes | `{ templateId: count }` |
| GET | /api/activity/category-view-counts | Yes | `{ category: count }` |

## Frontend Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | Home | Category filter + rec sections |
| `/template/:id` | TemplateDetails | `useParams()` |

- Use `<Link to="/template/:id">` from react-router-dom
- Use `useParams()` for `:id`, `useNavigate()` for programmatic nav
- BrowserRouter is in `main.jsx`, wrapped by AuthProvider then SearchProvider then App
- Auth (login/register) is rendered as a popup modal (`AuthModal`) — no dedicated route

## Auth Flow
1. **AuthModal** (`components/AuthModal.jsx`) — a modal popup with tabbed "Sign In" / "Create Account" forms
2. **Triggers** — modal opens when unauthenticated users click:
   - "Sign In" button in navbar
   - "Like" button on template detail page
   - "Sign In" prompt buttons in recommendation sections (Home)
3. User registers or logs in → JWT token stored in `localStorage('token')`
4. `AuthContext` reads token on mount, calls `/api/auth/me` to validate
5. `api.js` axios interceptor attaches `Authorization: Bearer <token>` to every request
6. 401 responses auto-clear token + user from localStorage
7. Modal closes on successful auth; user can then interact freely
8. Authenticated users see their name + "Sign Out" in the navbar

## Recommendation Algorithms

Both backend (`recommendationService.js`) and frontend (`utils/recommendationEngine.js` + `utils/scoring.js`) implement identical logic. The backend queries PostgreSQL via Sequelize; the frontend uses local JSON + localStorage as fallback.

### Scoring Constants
```
SAME_CATEGORY = 10
MATCHING_TAG = 5
USER_CATEGORY_BONUS = 8
LIKE_BONUS = 3
```

### Content-Based Filtering (`getSimilarTemplates`)
1. Exclude the current template
2. Score each candidate: +10 same category, +5 per matching tag
3. Filter score > 0, sort desc, return top 6
4. Build reasons from category + tag matches

### Personalized Recommendations (`getPersonalizedRecommendations`)
1. Read category view counts from user's View history
2. If no history → return first N templates with fallback message
3. Score: `categoryViews * 8` + `3` if liked + `10` if top interest category
4. Exclude already-viewed templates
5. Filter score > 0, sort desc, return top 6

### Trending (`getTrendingTemplates`)
Returns recently viewed templates in reverse chronological order (deduplicated). Top 4.

### Most Viewed (`getMostViewedTemplates`)
Counts view occurrences per template, sorts desc, returns top 4.

### Search (`filterTemplates`)
Checks query against title, description, tags, category. Filters by category (passes "All" through).

### Search Suggestions (`getSearchSuggestions`)
Returns up to 8 unique matches from titles, categories, and tags matching the query prefix.

## Data Structure — Template Object
```js
{
  id: Number,
  title: String,
  category: String,  // 'Fitness' | 'Business' | 'Fashion' | 'Food' | 'Travel' | 'Education'
  tags: String[],
  thumbnail: String,  // picsum.photos URL
  description: String
}
```

35 total templates: Fitness(6), Business(6), Fashion(6), Food(6), Travel(6), Education(5).

## localStorage Shape (key: `templateMarketplaceActivity`) — Legacy Frontend Fallback
```json
{
  "viewed": [{ "templateId": 1, "timestamp": 1734000000000 }],
  "liked": [1, 5, 12],
  "searches": [{ "query": "gym", "timestamp": 1734000200000 }]
}
```

## Component Conventions (Frontend)
- All components are functional components with hooks
- State managed via `useState` / `useContext` — no Redux
- Performance: `useMemo` and `useCallback` where appropriate
- `TemplateCard` receives `{ template, score, showScore }` — renders with `<Link>` to `/template/:id`
- `RecommendationSection` receives `{ title, subtitle, items, showScore, emptyMessage }` — renders grid of TemplateCard
- `SearchBar` receives `{ value, onChange, onSearch, variant? }` — controlled input
- Search state via `useContext(SearchContext)` — `searchQuery`, `setSearchQuery`, `submitSearch`
- Auth state via `useContext(AuthContext)` — `user`, `loading`, `login`, `register`, `logout`, `openAuthModal`, `closeAuthModal`, `showAuthModal`
- To show auth popup: call `openAuthModal()` anywhere — modal is rendered at the App layout level via `AuthModal` component
- `AuthModal` handles login/register in a tabbed popup; closes on successful auth or backdrop click

## Build & Run
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run dev`
- Seed DB: `cd backend && npm run seed`
- No linter or type checker is configured — do NOT run lint/typecheck commands
