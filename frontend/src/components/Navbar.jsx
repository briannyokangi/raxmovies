import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const token = localStorage.getItem('rax_token');
  const user = JSON.parse(localStorage.getItem('rax_user') || 'null');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('rax_token');
    localStorage.removeItem('rax_user');
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'text-rose-400 font-semibold'
        : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/80 backdrop-blur-md border-b border-slate-800/50 shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white"
          >
            <span className="text-rose-500">▶</span>
            <span className="hidden sm:inline bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              RaxMovies
            </span>
            <span className="sm:hidden bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              RAX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3 flex-1 justify-center">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/movies" className={navLinkClass}>
              Browse
            </NavLink>
            {token && (
              <NavLink to="/watchlist" className={navLinkClass}>
                Watchlist
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Profile/Auth Buttons */}
            {token ? (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors duration-200 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors duration-200 active:scale-95"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-slate-300 hover:text-white'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-slate-300 hover:text-white'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </NavLink>
            {token && (
              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Watchlist
              </NavLink>
            )}
            {token && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {!token && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'text-slate-300 hover:text-white'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors text-center ${
                        isActive ? 'bg-rose-700' : ''
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </NavLink>
                </>
              )}
              {token && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
