import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import TemplateCard from '../components/TemplateCard';
import RecommendationSection from '../components/RecommendationSection';

export default function TemplateDetails() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [liked, setLiked] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    api.get(`/templates/${id}`).then((res) => {
      setTemplate(res.data);
      api.get('/activity/liked-ids').then((lres) => {
        setLiked(lres.data.includes(res.data.id));
      }).catch(() => {});
      api.post('/activity/view', { templateId: res.data.id }).catch(() => {});
      api.get(`/recommendations/similar/${id}`).then((sres) => setSimilar(sres.data)).catch(() => {});
    }).catch(() => setTemplate(null));
  }, [id]);

  function handleLike() {
    if (!template) return;
    api.post('/activity/like', { templateId: template.id }).then((res) => {
      setLiked(res.data.liked);
    }).catch(() => {});
  }

  if (!template) {
    return (
      <div className="rounded-xl bg-white px-6 py-16 text-center ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Template not found</h1>
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
        >
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <img
            src={template.thumbnail}
            alt={template.title}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div>
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            {template.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {template.title}
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {template.description}
          </p>

          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Tags
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLike}
            className={`mt-6 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              liked
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {liked ? '♥ Liked' : '♡ Like this template'}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <RecommendationSection
          title="Similar Templates"
          subtitle="Content-based filtering: same category + matching tags"
          items={similar}
          showScore
        />
      </div>

      {similar.length > 0 && (
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Why Recommended?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Top pick: <strong>{similar[0].template.title}</strong> (score:{' '}
            {similar[0].score})
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Scoring breakdown
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {template.category === similar[0].template.category && (
                  <li>✓ Same category (+10 points)</li>
                )}
                {template.tags.filter((t) =>
                  similar[0].template.tags.includes(t)
                ).map((tag) => (
                  <li key={tag}>✓ Matching tag &quot;{tag}&quot; (+5 points)</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="text-sm font-semibold text-emerald-800">
                Recommendation reasons
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                {similar[0].reasons.map((reason) => (
                  <li key={reason}>✓ {reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Algorithm: Content-based filtering ranks candidates by category match
            (+10) and shared tags (+5 each), then sorts by highest score.
          </p>
        </section>
      )}
    </div>
  );
}
