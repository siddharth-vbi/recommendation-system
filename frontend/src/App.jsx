import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TemplateDetails from './pages/TemplateDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchBar from './components/SearchBar';
import { SearchProvider, useSearch } from './context/SearchContext';
import { useAuth } from './context/AuthContext';

function NavbarSearch() {
  const { searchQuery, setSearchQuery, submitSearch } = useSearch();

  return (
    <div className="hidden flex-1 max-w-md mx-6 md:block">
      <SearchBar
        variant="navbar"
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={submitSearch}
      />
    </div>
  );
}

function NavbarSearchMobile() {
  const { searchQuery, setSearchQuery, submitSearch } = useSearch();

  return (
    <SearchBar
      variant="navbar"
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={submitSearch}
    />
  );
}

function AppLayout() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              TM
            </span>
            <span className="hidden text-lg font-bold text-slate-900 sm:inline">
              Template<span className="text-indigo-600">Market</span>
            </span>
          </Link>

          <NavbarSearch />

          <nav className="ml-auto flex shrink-0 items-center gap-4 text-sm">
            <Link
              to="/"
              className="font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Browse
            </Link>
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{user.name}</span>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
            <span className="hidden rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 lg:inline">
              Rec Engine Demo
            </span>
          </nav>
        </div>

        <div className="border-t border-slate-100 px-4 pb-3 md:hidden">
          <NavbarSearchMobile />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/template/:id" element={<TemplateDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          Recommendation System Demo — Content-based filtering &amp; user profiling
          with PostgreSQL
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SearchProvider>
      <AppLayout />
    </SearchProvider>
  );
}
