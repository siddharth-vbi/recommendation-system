import { useEffect, useState } from 'react';
import api from '../api';

export default function SearchBar({
  value,
  onChange,
  onSearch,
  variant = 'default',
}) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get('/templates/suggestions', { params: { query: value } }).then((res) => {
        setSuggestions(res.data);
      }).catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value);
  }

  function handleChange(e) {
    onChange(e.target.value);
  }

  const isNavbar = variant === 'navbar';

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <svg
        className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
          isNavbar ? 'text-slate-400' : 'text-slate-400 left-4 h-5 w-5'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="search"
        list="template-search-suggestions"
        value={value}
        onChange={handleChange}
        placeholder="Search gym, fitness, food..."
        autoComplete="off"
        className={
          isNavbar
            ? 'w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
            : 'w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
        }
      />

      <datalist id="template-search-suggestions">
        {suggestions.map((item) => (
          <option key={`${item.type}-${item.value}`} value={item.value}>
            {item.type === 'tag' ? `#${item.value}` : item.value}
          </option>
        ))}
      </datalist>
    </form>
  );
}
