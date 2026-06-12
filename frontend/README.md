# Instagram Template Marketplace — Recommendation System Demo

A beginner-friendly React demo for learning recommendation systems **without** databases, backends, AI, or machine learning.

## Tech Stack

- React (JavaScript)
- Tailwind CSS
- Vite
- React Router
- Local JSON data + localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

### Phase 1 — Content-Based Filtering
When viewing a template, similar templates are scored by:
- **Same category** → +10 points
- **Each matching tag** → +5 points

### Phase 2 — Personalized Recommendations
Tracks viewed templates in localStorage and recommends from categories you browse most.

### User Activity (localStorage)
- `trackView(templateId)` — records template views
- `trackLike(templateId)` — toggles likes
- `trackSearch(query)` — saves recent searches

### Bonus Sections
- Trending Templates (recently viewed)
- Most Viewed Templates
- Recent Searches
- Recommendation score display

## Project Structure

```
src/
├── components/     # UI components
├── pages/          # Home & Template Details
├── data/           # 35 sample templates
├── utils/          # Recommendation engine & localStorage
└── App.jsx
```

## Learn More

Open `src/utils/scoring.js` and `src/utils/recommendationEngine.js` — comments explain the ranking logic step by step.
