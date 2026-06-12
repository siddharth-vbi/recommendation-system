/**
 * Build datalist-style suggestions from available template data.
 * Matches titles, categories, and tags as the user types.
 */
export function getSearchSuggestions(query, allTemplates, limit = 8) {
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

  // Remove duplicates (same value), keep first match order
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
