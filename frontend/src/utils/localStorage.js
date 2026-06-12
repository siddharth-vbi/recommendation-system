// localStorage helpers for tracking user activity
// All data persists in the browser — no backend needed

const STORAGE_KEY = 'templateMarketplaceActivity';

const DEFAULT_ACTIVITY = {
  viewed: [], // { templateId, timestamp }
  liked: [], // templateId[]
  searches: [], // { query, timestamp }
};

function readActivity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ACTIVITY };
    return { ...DEFAULT_ACTIVITY, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ACTIVITY };
  }
}

function writeActivity(activity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
}

/**
 * Record that a user opened/viewed a template.
 * Stores templateId with a timestamp for trending/recent logic.
 */
export function trackView(templateId) {
  const activity = readActivity();
  const id = Number(templateId);

  // Remove duplicate so the latest view moves to the front
  activity.viewed = activity.viewed.filter((v) => v.templateId !== id);
  activity.viewed.unshift({ templateId: id, timestamp: Date.now() });

  writeActivity(activity);
}

/**
 * Toggle like on a template. Returns true if now liked, false if unliked.
 */
export function trackLike(templateId) {
  const activity = readActivity();
  const id = Number(templateId);
  const index = activity.liked.indexOf(id);

  if (index === -1) {
    activity.liked.push(id);
    writeActivity(activity);
    return true;
  }

  activity.liked.splice(index, 1);
  writeActivity(activity);
  return false;
}

/**
 * Save a search query. Keeps recent unique searches (newest first).
 */
export function trackSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const activity = readActivity();

  activity.searches = activity.searches.filter(
    (s) => s.query.toLowerCase() !== trimmed.toLowerCase()
  );
  activity.searches.unshift({ query: trimmed, timestamp: Date.now() });

  // Keep only the 10 most recent searches
  activity.searches = activity.searches.slice(0, 10);

  writeActivity(activity);
}

export function getViewedTemplateIds() {
  return readActivity().viewed.map((v) => v.templateId);
}

export function getLikedTemplateIds() {
  return readActivity().liked;
}

export function isLiked(templateId) {
  return readActivity().liked.includes(Number(templateId));
}

export function getRecentSearches() {
  return readActivity().searches;
}

export function getViewCounts() {
  const activity = readActivity();
  const counts = {};

  activity.viewed.forEach(({ templateId }) => {
    counts[templateId] = (counts[templateId] || 0) + 1;
  });

  return counts;
}

export function getCategoryViewCounts(allTemplates) {
  const viewedIds = getViewedTemplateIds();
  const counts = {};

  viewedIds.forEach((id) => {
    const template = allTemplates.find((t) => t.id === id);
    if (template) {
      counts[template.category] = (counts[template.category] || 0) + 1;
    }
  });

  return counts;
}

export function clearAllActivity() {
  localStorage.removeItem(STORAGE_KEY);
}
