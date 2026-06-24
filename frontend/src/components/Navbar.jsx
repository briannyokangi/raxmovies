import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('rax_token');
  const user = JSON.parse(localStorage.getItem('rax_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('rax_token');
    localStorage.removeItem('rax_user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-slate-950 text-slate-100 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-rose-400">RaxMovies</Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm md:text-base">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Browse</NavLink>
          {token && <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Profile</NavLink>}
          {token && <NavLink to="/watchlist" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Watchlist</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Admin</NavLink>}
          {!token && <NavLink to="/login" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Login</NavLink>}
          {!token && <NavLink to="/register" className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Register</NavLink>}
          {token && <button onClick={handleLogout} className="rounded-lg bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-400">Logout</button>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
