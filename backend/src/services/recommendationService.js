const SCORES = {
  SAME_CATEGORY: 10,
  MATCHING_TAG: 5,
  USER_CATEGORY_BONUS: 8,
  LIKE_BONUS: 3,
};

const CATEGORIES = [
  'All',
  'Fitness',
  'Business',
  'Fashion',
  'Food',
  'Travel',
  'Education',
];

function countMatchingTags(tagsA, tagsB) {
  const setB = new Set(tagsB);
  return tagsA.filter((tag) => setB.has(tag)).length;
}

function calculateContentScore(sourceTemplate, candidateTemplate) {
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

function buildRecommendationReasons(
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

function getSimilarTemplates(currentTemplate, allTemplates, limit = 6) {
  const userCategoryCounts = {};

  const scored = allTemplates
    .filter((t) => t.id !== currentTemplate.id)
    .map((candidate) => {
      const score = calculateContentScore(currentTemplate, candidate);
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

function getPersonalizedRecommendations(
  allTemplates,
  categoryCounts,
  likedIds,
  viewedIds,
  limit = 6
) {
  if (Object.keys(categoryCounts).length === 0) {
    return allTemplates.slice(0, limit).map((template) => ({
      template,
      score: 0,
      reasons: ['Browse templates to get personalized picks'],
    }));
  }

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category);

  const topCategory = sortedCategories[0];

  const scored = allTemplates
    .filter((candidate) => !viewedIds.has(candidate.id))
    .map((candidate) => {
      let score = 0;
      const reasons = [];

      const categoryViews = categoryCounts[candidate.category] || 0;
      if (categoryViews > 0) {
        score += categoryViews * SCORES.USER_CATEGORY_BONUS;
        reasons.push(
          `You frequently view ${candidate.category} templates (${categoryViews} views)`
        );
      }

      if (likedIds.has(candidate.id)) {
        score += SCORES.LIKE_BONUS;
        reasons.push('You liked this template');
      }

      if (candidate.category === topCategory) {
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

function getTrendingTemplates(allTemplates, viewedIds, limit = 4) {
  const viewOrder = [];
  const seen = new Set();

  viewedIds.forEach((id) => {
    if (!seen.has(id)) {
      seen.add(id);
      viewOrder.push(id);
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

function getMostViewedTemplates(allTemplates, viewCounts, limit = 4) {
  return Object.entries(viewCounts)
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

function filterTemplates(templates, searchQuery, category) {
  const query = searchQuery.trim().toLowerCase();

  return templates.filter((template) => {
    const matchesCategory =
      category === 'All' || template.category === category;

    if (!matchesCategory) return false;
    if (!query) return true;

    const inTitle = template.title.toLowerCase().includes(query);
    const inDescription = template.description.toLowerCase().includes(query);
    const inTags = template.tags.some((tag) =>
      tag.toLowerCase().includes(query)
    );
    const inCategory = template.category.toLowerCase().includes(query);

    return inTitle || inDescription || inTags || inCategory;
  });
}

function getSearchSuggestions(query, allTemplates, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const suggestions = [];

  allTemplates.forEach((template) => {
    if (template.title.toLowerCase().includes(q)) {
      suggestions.push({ value: template.title, type: 'title' });
    }

    if (template.category.toLowerCase().includes(q)) {
      suggestions.push({ value: template.category, type: 'category' });
    }

    template.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(q)) {
        suggestions.push({ value: tag, type: 'tag' });
      }
    });
  });

  const seen = new Set();
  const unique = [];

  suggestions.forEach((item) => {
    const key = item.value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  });

  return unique.slice(0, limit);
}

export {
  SCORES,
  CATEGORIES,
  countMatchingTags,
  calculateContentScore,
  buildRecommendationReasons,
  getSimilarTemplates,
  getPersonalizedRecommendations,
  getTrendingTemplates,
  getMostViewedTemplates,
  filterTemplates,
  getSearchSuggestions,
};
