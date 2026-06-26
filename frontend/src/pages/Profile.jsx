import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('rax_user') || 'null') : null;
    return storedUser;
  });
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [settings, setSettings] = useState({ username: '', email: '', bio: '', avatar: '' });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('rax_user') || 'null') : null;
  const isAuthenticated = Boolean(typeof window !== 'undefined' && localStorage.getItem('rax_token'));
  const isAdmin = user?.role === 'admin' || storedUser?.role === 'admin';

  const fetchMovies = async (items) => {
    if (!items?.length) return [];
    const isObject = typeof items[0] === 'object';
    if (isObject) return items;

    const movies = await Promise.all(items.map((id) => api.get(`/movies/${id}`)));
    return movies.map((movieRes) => movieRes.data.movie);
  };

  const loadProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      const profileUser = { ...(storedUser || {}), ...(res.data || {}) };
      setUser(profileUser);
      setSettings({
        username: profileUser.username || '',
        email: profileUser.email || '',
        bio: profileUser.bio || '',
        avatar: profileUser.avatar || '',
      });
      localStorage.setItem('rax_user', JSON.stringify(profileUser));
      setFavorites(await fetchMovies(profileUser.favorites || []));
      setWatchlist(await fetchMovies(profileUser.watchlist || []));
    } catch (error) {
      if (storedUser) {
        setUser(storedUser);
        setFavorites(await fetchMovies(storedUser.favorites || []));
        setWatchlist(await fetchMovies(storedUser.watchlist || []));
      }
      console.error(error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await api.post('/auth/favorites/remove', { movieId });
      setFavorites((current) => current.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.post('/auth/watchlist/remove', { movieId });
      setWatchlist((current) => current.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsMessage('');

    try {
      const res = await api.put('/auth/profile', {
        username: settings.username,
        email: settings.email,
        bio: settings.bio,
        avatar: settings.avatar,
      });

      const updatedUser = { ...(user || {}), ...(res.data?.user || {}) };
      setUser(updatedUser);
      localStorage.setItem('rax_user', JSON.stringify(updatedUser));
      setSettingsMessage('Account settings updated.');
    } catch (error) {
      setSettingsMessage(error.response?.data?.message || 'Could not update settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDownloadData = () => {
    const exportData = {
      profile: user,
      favorites: favorites.map((movie) => ({ _id: movie._id, title: movie.title })),
      watchlist: watchlist.map((movie) => ({ _id: movie._id, title: movie.title })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user?.username || 'profile'}-data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const token = localStorage.getItem('rax_token');
    if (!token) {
      setUser(null);
      setFavorites([]);
      setWatchlist([]);
      return;
    }
    loadProfile();
  }, [navigate]);

  if (!localStorage.getItem('rax_token')) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-black/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-3xl font-bold text-white">
              👤
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">Your profile hub</h1>
            <p className="mt-3 text-slate-400">
              Sign in to view your favorites, watchlist, and admin controls in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700">
                Log in
              </Link>
              <Link to="/register" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-white"></div>
          <p className="mt-4 text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Profile Header */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:gap-12 md:grid-cols-[1fr_2fr]">
          {/* User Info Card */}
          <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 h-fit">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {user.username}
                </h1>
                <p className="text-slate-400 mt-1">
                  {user.role === 'admin' ? '🎬 Administrator' : '👤 Member'}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-6 space-y-3 text-slate-300">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Member Since
                </p>
                <p className="mt-1 text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Stats
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-rose-400">
                      {favorites.length}
                    </div>
                    <div className="text-xs text-slate-400">Favorites</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-rose-400">
                      {watchlist.length}
                    </div>
                    <div className="text-xs text-slate-400">Watchlist</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-rose-400">
                      0
                    </div>
                    <div className="text-xs text-slate-400">Reviews</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <form onSubmit={handleSaveSettings} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">Account settings</h3>
                  <button type="submit" disabled={isSavingSettings} className="rounded-full bg-sky-500/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60">
                    {isSavingSettings ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <input
                    value={settings.username}
                    onChange={(e) => setSettings((current) => ({ ...current, username: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                    placeholder="Username"
                  />
                  <input
                    value={settings.email}
                    onChange={(e) => setSettings((current) => ({ ...current, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                    placeholder="Email"
                  />
                  <input
                    value={settings.avatar}
                    onChange={(e) => setSettings((current) => ({ ...current, avatar: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                    placeholder="Avatar URL"
                  />
                  <textarea
                    value={settings.bio}
                    onChange={(e) => setSettings((current) => ({ ...current, bio: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                    placeholder="Bio"
                    rows="3"
                  />
                </div>
                {settingsMessage && <p className="mt-3 text-xs text-sky-300">{settingsMessage}</p>}
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
                <h3 className="font-semibold text-white">Security</h3>
                <p className="mt-3 text-sm text-slate-400">Change your password or reset it if you forgot it.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Link
                    to="/change-password"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
                  >
                    Change password
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
                  >
                    Forgot password
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadData}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Download my data
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
                >
                  Open Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('rax_token');
                  localStorage.removeItem('rax_user');
                  navigate('/login');
                }}
                className="w-full px-4 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all duration-300 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {isAuthenticated && !isAdmin && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400 lg:col-span-3">
                Sign in as an admin account to show the admin dashboard here.
              </div>
            )}
            <Link
              to="/watchlist"
              className="p-6 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-rose-500 transition group"
            >
              <div className="text-3xl mb-2">📺</div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition">
                My Watchlist
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {watchlist.length} movies saved
              </p>
            </Link>
            <Link
              to="/movies"
              className="p-6 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-rose-500 transition group"
            >
              <div className="text-3xl mb-2">🎬</div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition">
                Browse Movies
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Discover more content
              </p>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="p-6 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-sky-500 transition group"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition">
                  Admin Dashboard
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Manage movies, users, and reviews
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            ❤️ Your Favorites
          </h2>
          <p className="text-slate-400 mt-2">
            {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-12 text-center space-y-3">
            <div className="text-4xl">🤍</div>
            <p className="text-slate-400">
              No favorites yet. Find movies you love and save them here!
            </p>
            <a
              href="/movies"
              className="inline-block px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
            >
              Browse Now
            </a>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favorites.map((movie) => (
              <div key={movie._id} className="group relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => removeFromFavorites(movie._id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                  title="Remove from favorites"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Watchlist Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            🎯 My Watchlist
          </h2>
          <p className="text-slate-400 mt-2">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} to watch
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-12 text-center space-y-3">
            <div className="text-4xl">📝</div>
            <p className="text-slate-400">
              Your watchlist is empty. Add movies to keep track of what you want to watch!
            </p>
            <a
              href="/movies"
              className="inline-block px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
            >
              Find Movies
            </a>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {watchlist.map((movie) => (
              <div key={movie._id} className="group relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => removeFromWatchlist(movie._id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                  title="Remove from watchlist"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
