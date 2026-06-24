import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const MovieDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(8);
  const [user, setUser] = useState(null);

  const loadMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    loadMovie();
    loadProfile();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { movieId: id, comment, rating });
      setComment('');
      loadMovie();
      loadProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async () => {
    try {
      await api.post(`/movies/${id}/favorite`);
      loadProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleWatchlist = async () => {
    try {
      await api.post(`/movies/${id}/watchlist`);
      loadProfile();
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div className="min-h-screen bg-slate-950 text-slate-100">Loading...</div>;

  const { movie, reviews, similar } = data;
  const favoriteIds = user?.favorites?.map((item) => (item?._id ? item._id.toString() : item?.toString?.())) || [];
  const watchlistIds = user?.watchlist?.map((item) => (item?._id ? item._id.toString() : item?.toString?.())) || [];
  const isFavorite = favoriteIds.includes(id);
  const isWatchlist = watchlistIds.includes(id);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-6 lg:flex-row">
              <img src={movie.poster} alt={movie.title} className="h-96 w-full rounded-3xl object-cover md:w-1/2" />
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-white">{movie.title}</h1>
                <p className="text-slate-400">{movie.description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">Year: {movie.year}</div>
                  <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">Genre: {movie.genre}</div>
                  <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">Duration: {movie.duration || 'N/A'}</div>
                  <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">Rating: {movie.rating}/10</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={handleFavorite} className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
                    {isFavorite ? 'Remove favorite' : 'Save favorite'}
                  </button>
                  <button onClick={handleWatchlist} className="rounded-full border border-rose-500 px-5 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10">
                    {isWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  </button>
                  {movie.trailer && <a href={movie.trailer} target="_blank" rel="noreferrer" className="rounded-full border border-rose-500 px-5 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10">Watch trailer</a>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">Cast</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {movie.cast.map((actor) => <span key={actor} className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">{actor}</span>)}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Reviews</h2>
              {reviews.length === 0 ? <p className="text-slate-400">No reviews yet.</p> : reviews.map((review) => (
                <div key={review._id} className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{review.userId.username}</p>
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 text-sm text-rose-200">{review.rating}/10</span>
                  </div>
                  <p className="mt-3 text-slate-400">{review.comment}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleReview} className="rounded-3xl bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold text-white">Leave a review</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                placeholder="Share your thoughts"
                className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-900 p-4 text-slate-100 outline-none"
              />
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="text-sm text-slate-300">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-full bg-slate-800 px-4 py-3 text-slate-100 outline-none">
                  {Array.from({ length: 11 }, (_, i) => i).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">Submit review</button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">Movie details</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                <p>{movie.description}</p>
                <p><span className="font-semibold text-white">Rating:</span> {movie.rating}/10</p>
                <p><span className="font-semibold text-white">Genre:</span> {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                <p><span className="font-semibold text-white">Year:</span> {movie.year}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Similar movies</h2>
              <div className="space-y-4">
                {similar.map((item) => <MovieCard key={item._id} movie={item} />)}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default MovieDetails;
