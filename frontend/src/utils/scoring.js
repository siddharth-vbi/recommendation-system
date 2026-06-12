// Content-based scoring: same category + matching tags

export const SCORES = {
  SAME_CATEGORY: 10,
  MATCHING_TAG: 5,
  USER_CATEGORY_BONUS: 8, // Phase 2: boost categories user views often
  LIKE_BONUS: 3,
};

/**
 * Count how many tags overlap between two templates.
 */
export function countMatchingTags(tagsA, tagsB) {
  const setB = new Set(tagsB);
  return tagsA.filter((tag) => setB.has(tag)).length;
}

/**
 * Calculate content-based score between a source template and a candidate.
 *
 * Scoring rules (Phase 1):
 * - Same category = +10 points
 * - Each matching tag = +5 points
 */
export function calculateContentScore(sourceTemplate, candidateTemplate) {
  if (sourceTemplate.id === candidateTemplate.id) return 0;

  let score = 0;

  if (sourceTemplate.category === candidateTemplate.category) {
    score += SCORES.SAME_CATEGORY;
  }

  const matchingTags = countMatchingTags(
    sourceTemplate.tags,
    candidateTemplate.tags
  );
  score += matchingTags * SCORES.MATCHING_TAG;

  return score;
}

/**
 * Build human-readable reasons for why a template was recommended.
 */
export function buildRecommendationReasons(
  sourceTemplate,
  candidateTemplate,
  userCategoryCounts = {}
) {
  const reasons = [];

  if (sourceTemplate.category === candidateTemplate.category) {
    reasons.push('Same category');
  }

  const matchingTags = countMatchingTags(
    sourceTemplate.tags,
    candidateTemplate.tags
  );
  if (matchingTags > 0) {
    reasons.push(
      matchingTags === 1
        ? '1 matching tag'
        : `${matchingTags} matching tags`
    );
  }

  // Phase 2: explain personalization from view history
  const categoryViews = userCategoryCounts[candidateTemplate.category] || 0;
  if (categoryViews >= 2) {
    reasons.push(
      `You frequently view ${candidateTemplate.category} templates (${categoryViews} views)`
    );
  }

  if (reasons.length === 0) {
    reasons.push('Popular in this marketplace');
  }

  return reasons;
}
