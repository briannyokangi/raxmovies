import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const token = localStorage.getItem('rax_token');
  const user = JSON.parse(localStorage.getItem('rax_user') || 'null');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('rax_token');
    localStorage.removeItem('rax_user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 md:px-4 py-2 rounded-full transition-all duration-200 ${
      isActive
        ? 'bg-sky-500/20 text-sky-300 font-semibold'
        : 'text-gray-300 hover:text-white hover:bg-navy-800'
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-navy-800 bg-navy-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-navy-950 font-bold">▶</span>
              <span className="gradient-text hidden sm:inline font-bold text-lg">
                RaxMovies
              </span>
              <span className="gradient-text sm:hidden font-bold text-lg">RAX</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center justify-end gap-1 md:flex lg:gap-3">
              {token && <NavLink to="/watchlist" className={navLinkClass}>❤️ Watchlist</NavLink>}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full p-2 text-gray-300 transition hover:text-white hover:bg-navy-800 md:hidden"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="hidden items-center gap-2 md:flex">
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                {token && (
                  <button onClick={handleLogout} className="btn-primary text-sm">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="mt-4 space-y-2 border-t border-navy-800 pt-4 md:hidden">
              <NavLink to="/" className={({ isActive }) => `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>🏠 Home</NavLink>
              <NavLink to="/movies" className={({ isActive }) => `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>🎬 Movies</NavLink>
              {token && <NavLink to="/watchlist" className={({ isActive }) => `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>❤️ Watchlist</NavLink>}
              <NavLink to="/profile" className={({ isActive }) => `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Profile</NavLink>
              {token && (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full rounded-lg btn-primary text-sm">Logout</button>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Full-width Search Bar */}
      <div className="border-b border-navy-800 bg-navy-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <SearchBar />
          <div className="mt-3 flex flex-wrap gap-2">
            {['Trending', 'Movie', 'Animation', 'Kids', 'Education'].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-100 transition hover:border-sky-400/40 hover:bg-sky-500/20"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
