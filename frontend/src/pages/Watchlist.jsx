import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

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
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Your Watchlist</h1>
            <p className="mt-3 text-slate-400">Keep track of movies you want to watch next.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-300">Loading watchlist...</p>
        ) : watchlist.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 text-slate-300 shadow-2xl shadow-black/40">
            <p className="text-lg">No movies in your watchlist yet.</p>
            <p className="mt-3 text-slate-500">Browse movies and add your next watch to the list.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {watchlist.map((movie) => (
              <div key={movie._id} className="group relative overflow-hidden rounded-3xl bg-slate-900/90 shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-1">
                <img src={movie.poster} alt={movie.title} className="h-72 w-full object-cover brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
                <div className="relative p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-400">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{movie.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">{movie.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                    <span>{movie.year}</span>
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-amber-300">{movie.rating}/10</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={() => removeFromWatchlist(movie._id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-400">Remove</button>
                    <a href={`/movies/${movie._id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Watchlist;
