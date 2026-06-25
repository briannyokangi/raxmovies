import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import SkeletonLoader from '../components/SkeletonLoader';

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    try {
      const res = await api.get('/auth/profile');
      const items = Array.isArray(res.data.watchlist) ? res.data.watchlist : [];
      const movies = await Promise.all(items.map((item) => api.get(`/movies/${item._id || item}`)));
      setWatchlist(movies.map((movieRes) => movieRes.data.movie));
    } catch (error) {
      console.error(error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('rax_token')) {
      navigate('/login');
      return;
    }
    loadWatchlist();
  }, [navigate]);

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.post('/auth/watchlist/remove', { movieId });
      setWatchlist((current) => current.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="space-y-3 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Your Watchlist
          </h1>
          <p className="text-lg text-slate-400">
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved for later
          </p>
        </div>

        {loading ? (
          <SkeletonLoader count={12} variant="poster" />
        ) : watchlist.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-12 md:p-16 text-center space-y-4">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-2xl font-semibold text-white">Your watchlist is empty</p>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Browse movies and add your favorites here to keep track of what you want to watch next.
            </p>
            <a
              href="/movies"
              className="inline-block px-6 md:px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all duration-300 active:scale-95 mt-4"
            >
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="space-y-8">
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

            {/* Bulk Actions */}
            <div className="flex gap-3 pt-8">
              <a
                href="/movies"
                className="px-6 md:px-8 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all duration-300 active:scale-95"
              >
                Continue Browsing
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Watchlist;
