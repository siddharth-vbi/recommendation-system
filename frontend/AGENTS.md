# AGENTS.md — Recommendation System Demo

## Project Overview
A beginner-friendly **React + Vite** front-end demo of a recommendation system themed as an **Instagram Template Marketplace**. Demonstrates content-based filtering and personalized recommendations using local JSON data + `localStorage` — no backend, database, or ML.

## Tech Stack
- **React 18** (JavaScript, JSX) — no TypeScript, no prop-types
- **Tailwind CSS 3** — classes scanned from `index.html` + `src/**/*.{js,jsx}`
- **Vite 6** — bundler/dev server
- **React Router v6** — client-side routing
- **localStorage** — persistence (single key: `templateMarketplaceActivity`)
- All tools: `package.json` scripts — `npm run dev`, `npm run build`, `npm run preview`

## File Conventions
- `.jsx` — components, pages, contexts (contain JSX)
- `.js` — utilities, data, config (no JSX)
- No TypeScript anywhere — write plain JS only
- Tailwind classes only — no CSS modules, styled-components, or inline styles

## Project Structure
```
src/
├── main.jsx                          # Entry: ReactDOM.createRoot + BrowserRouter
├── App.jsx                           # Routes + SearchProvider + Header layout
├── index.css                         # Tailwind directives + custom .card-hover class
├── data/
│   └── templates.js                  # 35 template objects, CATEGORIES array, getTemplateById()
├── context/
│   └── SearchContext.jsx             # Global search state (query, recent searches, submitSearch)
├── utils/
│   ├── scoring.js                    # calculateContentScore(), countMatchingTags()
│   ├── recommendationEngine.js       # getSimilarTemplates(), getPersonalizedRecommendations(),
│   │                                 # getTrendingTemplates(), getMostViewedTemplates(),
│   │                                 # filterTemplates()
│   ├── localStorage.js               # trackView(), trackLike(), trackSearch(), getViewCounts(),
│   │                                 # getCategoryViewCounts(), getLikedTemplateIds(), etc.
│   └── searchSuggestions.js          # getSearchSuggestions(query, templates)
├── components/
│   ├── TemplateCard.jsx              # Card component — props: { template, score?, showScore? }
│   ├── SearchBar.jsx                 # Controlled search input — props: { value, onChange, onSearch, variant? }
│   ├── RecommendationSection.jsx     # Section with grid — props: { title, subtitle?, items, showScore?, emptyMessage? }
│   └── CategoryFilter.jsx            # Pill buttons — props: { selected, onChange }
└── pages/
    ├── Home.jsx                      # Index page — category filter, rec sections, template grid
    └── TemplateDetails.jsx           # Detail page — uses useParams(), shows similar templates
```

## Data Structure — Template Object
```js
{
  id: Number,           // 1–35
  title: String,        // e.g. "Fitness Reel"
  category: String,     // 'Fitness' | 'Business' | 'Fashion' | 'Food' | 'Travel' | 'Education'
  tags: String[],       // 2–3 tags, lowercased
  thumbnail: String,    // picsum.photos URL
  description: String   // 1 sentence
}
```

## Categories (exported as `CATEGORIES`)
`['All', 'Fitness', 'Business', 'Fashion', 'Food', 'Travel', 'Education']`

35 total: Fitness(6), Business(6), Fashion(6), Food(6), Travel(6), Education(5)

## localStorage Shape (key: `templateMarketplaceActivity`)
```json
{
  "viewed": [{ "templateId": 1, "timestamp": 1734000000000 }],
  "liked": [1, 5, 12],
  "searches": [{ "query": "gym", "timestamp": 1734000200000 }]
}
```

## Routing
| Path | Component | Notes |
|---|---|---|
| `/` | Home | Index page |
| `/template/:id` | TemplateDetails | useParams() to read id |

## Recommendation Algorithms

### Content-Based Filtering (`getSimilarTemplates`)
1. Exclude current template
2. Score each candidate: +10 same category, +5 per matching tag
3. Filter score > 0, sort desc, return top 6
4. Reasons built from category + tag matches + localStorage user preferences

### Personalized Recommendations (`getPersonalizedRecommendations`)
1. Read category view counts from localStorage
2. If no history → return first 4 templates as fallback
3. Score: `categoryViews * 8` + `3` if liked + small tag overlap boost
4. Filter score > 0, sort desc, return top 4

### Trending (`getTrendingTemplates`)
Returns recently viewed templates in reverse chronological order.

### Most Viewed (`getMostViewedTemplates`)
Counts view occurrences, sorts desc, returns top N.

### Search (`filterTemplates`)
Checks query against `title`, `description`, `tags`, `category`. Also filters by category (passes "All" through).

## Routing & Navigation Rules
- Use `<Link to="/template/:id">` from react-router-dom for navigation
- Use `useParams()` to read `:id` from URL
- Use `useNavigate()` if programmatic navigation is needed
- Wrap with `<BrowserRouter>` in main.jsx (already done)
- Do NOT add new routes outside `/` and `/template/:id` unless explicitly asked

## Coding Conventions
- **No comments in code** — let code be self-documenting
- **No emojis** in code or UI unless explicitly asked by user
- All components are functional components with hooks
- State is managed via `useState` / `useContext` — no Redux or external state libs
- Performance optimizations use `useMemo` and `useCallback` where appropriate
- Use Tailwind utility classes exclusively for styling
- Search is controlled via `SearchContext` — use `useContext(SearchContext)` to read/write `searchQuery`
- `TemplateCard` receives `{ template, score, showScore }` — render with `<Link>` to `/template/:id`
- `RecommendationSection` receives `{ title, subtitle, items, showScore, emptyMessage }` — render a grid of `TemplateCard`

## Build & Linting
- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- No linter or type checker is configured — do not run lint/typecheck commands
