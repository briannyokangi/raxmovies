import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

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

  if (!user) return <div className="min-h-screen bg-slate-950 text-slate-100">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
            <h1 className="text-3xl font-semibold text-white">{user.username}</h1>
            <p className="mt-3 text-slate-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="mt-8 space-y-4 text-slate-300">
              <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-white">Role:</span> {user.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
              <h2 className="text-2xl font-semibold text-white">Your favorites</h2>
              {favorites.length === 0 ? (
                <p className="mt-4 text-slate-400">No favorites yet. Add movies from the details page.</p>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {favorites.map((movie) => (
                    <div key={movie._id || movie} className="rounded-3xl bg-slate-950/80 p-4 text-slate-200 shadow-lg shadow-black/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{movie.title || 'Unknown movie'}</h3>
                          <p className="mt-2 text-sm text-slate-400">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} · {movie.year}</p>
                        </div>
                        <button onClick={() => removeFromFavorites(movie._id)} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-rose-400">Remove</button>
                      </div>
                      <Link to={`/movies/${movie._id}`} className="mt-4 inline-block rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">View details</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
              <h2 className="text-2xl font-semibold text-white">Your watchlist</h2>
              {watchlist.length === 0 ? (
                <p className="mt-4 text-slate-400">No watchlist movies yet. Save titles to come back later.</p>
              ) : (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {watchlist.map((movie) => (
                    <div key={movie._id || movie} className="rounded-3xl bg-slate-950/80 p-4 text-slate-200 shadow-lg shadow-black/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{movie.title || 'Unknown movie'}</h3>
                          <p className="mt-2 text-sm text-slate-400">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} · {movie.year}</p>
                        </div>
                        <button onClick={() => removeFromWatchlist(movie._id)} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-rose-400">Remove</button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link to={`/movies/${movie._id}`} className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">View details</Link>
                        <Link to="/watchlist" className="inline-flex rounded-full bg-rose-500 px-4 py-2 text-sm text-white transition hover:bg-rose-400">Open watchlist</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
