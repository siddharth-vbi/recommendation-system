import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const refreshRecentSearches = useCallback(() => {
    api.get('/activity/recent-searches').then((res) => {
      setRecentSearches(res.data);
    }).catch(() => {});
  }, []);

  const submitSearch = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    api.post('/activity/search', { query: trimmed }).catch(() => {});
    refreshRecentSearches();
  }, [refreshRecentSearches]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        recentSearches,
        setRecentSearches,
        submitSearch,
        refreshRecentSearches,
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
