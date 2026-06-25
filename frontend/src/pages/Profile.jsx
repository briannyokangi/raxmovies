import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

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
      setUser(res.data);
      setFavorites(await fetchMovies(res.data.favorites || []));
      setWatchlist(await fetchMovies(res.data.watchlist || []));
    } catch (error) {
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

  useEffect(() => {
    if (!localStorage.getItem('rax_token')) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

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

            <button
              onClick={() => {
                localStorage.removeItem('rax_token');
                localStorage.removeItem('rax_user');
                navigate('/login');
              }}
              className="w-full mt-6 px-4 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all duration-300 active:scale-95"
            >
              Logout
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
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
