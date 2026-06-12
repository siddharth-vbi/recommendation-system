import { Link } from 'react-router-dom';

export default function TemplateCard({ template, score, showScore = false }) {
  return (
    <Link
      to={`/template/${template.id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={template.thumbnail}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
          {template.category}
        </span>
        {showScore && score != null && score > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
            Score: {score}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {template.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {template.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
