import { useMemo, useState } from 'react';
import { templates } from '../data/templates';
import CategoryFilter from '../components/CategoryFilter';
import TemplateCard from '../components/TemplateCard';
import RecommendationSection from '../components/RecommendationSection';
import {
  filterTemplates,
  getPersonalizedRecommendations,
  getTrendingTemplates,
  getMostViewedTemplates,
} from '../utils/recommendationEngine';
import { trackSearch, getRecentSearches } from '../utils/localStorage';
import { useSearch } from '../context/SearchContext';

export default function Home() {
  const { searchQuery, setSearchQuery, recentSearches, setRecentSearches } =
    useSearch();
  const [category, setCategory] = useState('All');

  const filteredTemplates = useMemo(
    () => filterTemplates(templates, searchQuery, category),
    [searchQuery, category]
  );

  const personalized = useMemo(
    () => getPersonalizedRecommendations(templates, 4),
    [recentSearches]
  );

  const trending = useMemo(() => getTrendingTemplates(templates, 4), [recentSearches]);
  const mostViewed = useMemo(() => getMostViewedTemplates(templates, 4), [recentSearches]);

  function handleRecentSearchClick(term) {
    setSearchQuery(term);
    trackSearch(term);
    setRecentSearches(getRecentSearches());
  }

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-6 py-10 text-white shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Instagram Template Marketplace
        </h1>
        <p className="mt-2 max-w-2xl text-indigo-100">
          Browse social media templates and discover personalized recommendations
          powered by content-based filtering. Use the navbar search — type
          &quot;gym&quot; to see matching tags and templates.
        </p>
      </section>

      {recentSearches.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(({ query }) => (
              <button
                key={query}
                type="button"
                onClick={() => handleRecentSearchClick(query)}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <CategoryFilter selected={category} onChange={setCategory} />
      </section>

      <RecommendationSection
        title="Recommended For You"
        subtitle="Based on categories you view most often"
        items={personalized}
        showScore
      />

      <RecommendationSection
        title="Trending For You"
        subtitle="Templates you've viewed recently"
        items={trending}
        emptyMessage="Open a few templates to see trending picks here."
      />

      <RecommendationSection
        title="Most Viewed"
        subtitle="Your most opened templates"
        items={mostViewed}
        emptyMessage="Your most viewed templates will appear here."
      />

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : category === 'All'
                  ? 'All Templates'
                  : `${category} Templates`}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="rounded-xl bg-white px-6 py-16 text-center ring-1 ring-slate-200">
            <p className="text-lg font-medium text-slate-700">No templates found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
