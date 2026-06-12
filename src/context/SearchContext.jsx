import { createContext, useContext, useState, useCallback } from 'react';
import { trackSearch, getRecentSearches } from '../utils/localStorage';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  const submitSearch = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    trackSearch(trimmed);
    setRecentSearches(getRecentSearches());
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        recentSearches,
        setRecentSearches,
        submitSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}
