export default function CategoryFilter({ selected, onChange, categories = ['All'] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
