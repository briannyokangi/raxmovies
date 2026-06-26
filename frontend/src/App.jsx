import { BrowserRouter as Router, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

function AppContent() {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('rax_token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('rax_user') || 'null') : null;

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
      isActive ? 'bg-sky-500/15 text-sky-300' : 'text-gray-300 hover:bg-navy-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-800 bg-navy-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <NavLink to="/" className={`${navLinkClass({ isActive: location.pathname === '/' })} min-w-[72px]`}>
            <span className="text-xl">🏛</span>
            <span>Home</span>
          </NavLink>

          <div className="flex-1 flex justify-center">
            <NavLink to="/movies" className={`${navLinkClass({ isActive: location.pathname.startsWith('/movies') })} min-w-[72px]`}>
              <span className="text-xl">🎬</span>
              <span>Movies</span>
            </NavLink>
          </div>

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={`flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                location.pathname.startsWith('/profile') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
                  ? 'bg-sky-500/15 text-sky-300'
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <span className="text-xl">👤</span>
              <span>Profile</span>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-navy-800 bg-navy-950/95 p-2 shadow-2xl">
                <NavLink to="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-navy-800" onClick={() => setShowProfileMenu(false)}>
                  Profile
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
