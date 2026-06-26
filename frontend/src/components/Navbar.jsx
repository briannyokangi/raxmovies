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
    `px-3 md:px-4 py-2 rounded-full transition-all duration-200 ${
      isActive
        ? 'bg-sky-500/15 text-sky-300 font-semibold shadow-sm shadow-sky-500/10'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,8,23,0.4)]">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">▶</span>
            <span className="hidden bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent sm:inline">
              RaxMovies
            </span>
            <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent sm:hidden">RAX</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex lg:gap-3">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/movies" className={navLinkClass}>Browse</NavLink>
            {token && <NavLink to="/watchlist" className={navLinkClass}>Watchlist</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full border border-slate-800 p-2 text-slate-300 transition hover:border-sky-400 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {token ? (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={handleLogout} className="rounded-full bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-500">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className="rounded-full bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-500">
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <nav className="mt-4 space-y-2 border-t border-slate-800 pt-4 md:hidden">
            <NavLink to="/" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/movies" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Browse</NavLink>
            {token && <NavLink to="/watchlist" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Watchlist</NavLink>}
            {token && <NavLink to="/profile" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Profile</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}
            <div className="space-y-2 border-t border-slate-800 pt-2">
              {!token ? (
                <>
                  <NavLink to="/login" className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/register" className="block rounded-xl bg-sky-600 px-3 py-2 text-center font-semibold text-white" onClick={() => setIsMenuOpen(false)}>Sign up</NavLink>
                </>
              ) : (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full rounded-xl bg-sky-600 px-3 py-2 font-semibold text-white">Logout</button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
