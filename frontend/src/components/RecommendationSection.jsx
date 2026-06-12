import TemplateCard from './TemplateCard';

export default function RecommendationSection({
  title,
  subtitle,
  items,
  showScore = false,
  emptyMessage,
  children,
}) {
  if (!items || items.length === 0) {
    if (children) {
      return (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
          {children}
        </section>
      );
    }
    if (!emptyMessage) return null;

    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
        <p className="mt-4 rounded-xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(({ template, score, reasons }) => (
          <div key={template.id}>
            <TemplateCard
              template={template}
              score={score}
              showScore={showScore}
            />
            {reasons && reasons.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {reasons.slice(0, 2).map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-1.5 text-xs text-emerald-700"
                  >
                    <span className="mt-0.5 text-emerald-500">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
