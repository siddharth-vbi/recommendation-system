import {
  calculateContentScore,
  buildRecommendationReasons,
  SCORES,
} from './scoring';
import { getCategoryViewCounts, getLikedTemplateIds } from './localStorage';

/**
 * Phase 1 — Content-Based Filtering
 *
 * Given a template the user is viewing, score every other template
 * by category match and tag overlap, then return the top results.
 */
export function getSimilarTemplates(currentTemplate, allTemplates, limit = 6) {
  const scored = allTemplates
    .filter((t) => t.id !== currentTemplate.id)
    .map((candidate) => {
      const score = calculateContentScore(currentTemplate, candidate);
      const userCategoryCounts = getCategoryViewCounts(allTemplates);
      const reasons = buildRecommendationReasons(
        currentTemplate,
        candidate,
        userCategoryCounts
      );

      return { template: candidate, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/**
 * Phase 2 — Personalized Recommendations
 *
 * Profile the user by counting views per category, then recommend
 * templates from their top categories (with tag/like boosts).
 */
export function getPersonalizedRecommendations(allTemplates, limit = 6) {
  const categoryCounts = getCategoryViewCounts(allTemplates);
  const likedIds = new Set(getLikedTemplateIds());

  // No history yet — show a diverse mix from popular categories
  if (Object.keys(categoryCounts).length === 0) {
    return allTemplates.slice(0, limit).map((template) => ({
      template,
      score: 0,
      reasons: ['Browse templates to get personalized picks'],
    }));
  }

  // Rank categories by how often the user views them
  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category);

  const topCategory = sortedCategories[0];

  const scored = allTemplates.map((candidate) => {
    let score = 0;
    const reasons = [];

    const categoryViews = categoryCounts[candidate.category] || 0;
    if (categoryViews > 0) {
      // More views in a category = stronger interest signal
      score += categoryViews * SCORES.USER_CATEGORY_BONUS;
      reasons.push(
        `You frequently view ${candidate.category} templates (${categoryViews} views)`
      );
    }

    if (likedIds.has(candidate.id)) {
      score += SCORES.LIKE_BONUS;
      reasons.push('You liked this template');
    }

    // Small boost if candidate shares tags with templates user already viewed
    const viewedInSameCategory = allTemplates.filter(
      (t) =>
        t.category === candidate.category &&
        categoryCounts[t.category]
    );
    if (viewedInSameCategory.length > 0 && candidate.category === topCategory) {
      score += SCORES.SAME_CATEGORY;
      if (!reasons.some((r) => r.includes('frequently view'))) {
        reasons.push(`Top interest: ${topCategory}`);
      }
    }

    return { template: candidate, score, reasons };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Trending = most viewed recently (weighted by recency in view list order).
 */
export function getTrendingTemplates(allTemplates, limit = 4) {
  const viewOrder = [];
  const seen = new Set();

  // Import dynamically to avoid circular deps — use localStorage read
  const raw = localStorage.getItem('templateMarketplaceActivity');
  if (!raw) return [];

  const activity = JSON.parse(raw);
  activity.viewed.forEach(({ templateId }) => {
    if (!seen.has(templateId)) {
      seen.add(templateId);
      viewOrder.push(templateId);
    }
  });

  return viewOrder
    .slice(0, limit)
    .map((id) => allTemplates.find((t) => t.id === id))
    .filter(Boolean)
    .map((template) => ({
      template,
      score: null,
      reasons: ['Recently viewed by you'],
    }));
}

/**
 * Most viewed templates by total view count across all sessions.
 */
export function getMostViewedTemplates(allTemplates, limit = 4) {
  const raw = localStorage.getItem('templateMarketplaceActivity');
  if (!raw) return [];

  const activity = JSON.parse(raw);
  const counts = {};

  activity.viewed.forEach(({ templateId }) => {
    counts[templateId] = (counts[templateId] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id, count]) => {
      const template = allTemplates.find((t) => t.id === Number(id));
      return {
        template,
        score: count,
        reasons: [`Viewed ${count} time${count > 1 ? 's' : ''}`],
      };
    })
    .filter((item) => item.template);
}

/**
 * Filter templates by search query and category.
 */
export function filterTemplates(templates, searchQuery, category) {
  const query = searchQuery.trim().toLowerCase();

  return templates.filter((template) => {
    const matchesCategory =
      category === 'All' || template.category === category;

    if (!matchesCategory) return false;
    if (!query) return true;

    const inTitle = template.title.toLowerCase().includes(query);
    const inDescription = template.description.toLowerCase().includes(query);
    const inTags = template.tags.some((tag) => tag.toLowerCase().includes(query));
    const inCategory = template.category.toLowerCase().includes(query);

    return inTitle || inDescription || inTags || inCategory;
  });
}
