import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { movieAPI, reviewAPI, authAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(8);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getMovie(id);
      const data = response.data;

      setMovie(data.movie);
      setReviews(data.reviews || []);
      setSimilar(data.similar || []);
      setError('');
    } catch (err) {
      console.error('Error loading movie:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    loadMovie();
    loadProfile();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      await reviewAPI.createReview(id, { comment, rating });
      setComment('');
      setRating(8);
      loadMovie();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await movieAPI.toggleFavorite(id);
      loadMovie();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleWatchlist = async () => {
    try {
      await movieAPI.toggleWatchlist(id);
      loadMovie();
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-white"></div>
          <p className="mt-4 text-slate-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="p-6 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-16">
          <p className="text-slate-400">Movie not found</p>
        </div>
      </div>
    );
  }

  const isFavorite = user?.favorites?.includes(id);
  const isWatchlist = user?.watchlist?.includes(id);

  const posterUrl = movie.posterUrl || movie.poster;
  const backdropUrl = movie.backdropUrl || movie.backdrop;
  const title = movie.title;
  const description = movie.overview || movie.description;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year;
  const voteAverage = movie.vote_average || movie.rating;
  const genres = movie.genres || movie.genre || [];
  const cast = movie.credits?.cast?.slice(0, 10) || movie.cast || [];
  const runtime = movie.runtime || movie.duration;
  const trailer = movie.trailer || movie.videoUrl || null;

  const openTrailer = (e) => {
    if (typeof trailer === 'string') return; // external link handled by anchor
    setShowTrailer(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className="relative h-96 md:h-[500px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(15,23,42,0.9)), url(${backdropUrl || posterUrl})`,
        }}
      />

      <section className="container mx-auto px-4 -mt-32 md:-mt-40 relative z-10 pb-16">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_1.2fr]">
          {posterUrl && (
            <div className="hidden md:block">
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[2/3]">
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">{title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                {releaseYear && <span className="text-lg text-slate-400">{releaseYear}</span>}
                {runtime && <span className="text-lg text-slate-400">{runtime} min</span>}
                {voteAverage && (
                  <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
                    <span className="text-xl">★</span>
                    <span className="font-bold text-amber-300">{Number(voteAverage).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {description && <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">{description}</p>}

            {genres && genres.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300">{typeof genre === 'string' ? genre : genre.name}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4">
              {trailer && typeof trailer === 'string' ? (
                <a href={trailer} target="_blank" rel="noopener noreferrer" className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/30">
                  <span className="text-xl">▶</span> Watch Now
                </a>
              ) : trailer ? (
                <button onClick={openTrailer} className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/30">
                  <span className="text-xl">▶</span> Play Trailer
                </button>
              ) : null}

              <button onClick={handleFavorite} className={`px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 active:scale-95 ${isFavorite ? 'bg-red-600 hover:bg-red-700 text-white' : 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'}`}>
                {isFavorite ? '❤ Remove Favorite' : '🤍 Add to Favorites'}
              </button>

              <button onClick={handleWatchlist} className={`px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 active:scale-95 ${isWatchlist ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'}`}>
                {isWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>

            {cast.length > 0 && (
              <div className="space-y-3 pt-4">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Cast</p>
                <div className="flex flex-wrap gap-2">{cast.map((actor, idx) => (<span key={idx} className="px-3 py-2 rounded-full bg-slate-800/50 text-sm text-slate-300">{typeof actor === 'string' ? actor : actor.name}</span>))}</div>
              </div>
            )}

            <section className="mt-16 md:mt-20 space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Reviews</h2>
                <p className="text-slate-400">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {reviews.length === 0 ? (
                  <p className="col-span-full text-slate-400 text-center py-8">No reviews yet. Be the first to review this movie!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 md:p-6 hover:border-slate-700 transition">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="font-semibold text-white text-lg">{review.userId?.username || 'Anonymous'}</p>
                        <span className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full text-sm font-bold text-amber-300"><span>★</span> {review.rating}/10</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 flex items-center gap-3"><span>⚠️</span><span>{error}</span></div>
              )}

              <form onSubmit={handleReview} className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white">Leave a Review</h3>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" placeholder="Share your thoughts about this movie..." className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-100 outline-none placeholder-slate-500 focus:border-rose-500 transition" disabled={submitting} />

                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Your Rating</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-slate-100 outline-none focus:border-rose-500 transition" disabled={submitting}>
                      {Array.from({ length: 11 }, (_, i) => i).map((value) => (<option key={value} value={value}>{value === 0 ? 'Select a rating' : `${value}/10`}</option>))}
                    </select>
                  </div>
                  <button type="submit" disabled={submitting} className="px-6 md:px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 active:scale-95">{submitting ? 'Submitting...' : 'Submit Review'}</button>
                </div>
              </form>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">Movie details</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                {description && <p>{description}</p>}
                {voteAverage && (<p><span className="font-semibold text-white">Rating:</span> {Number(voteAverage).toFixed(1)}/10</p>)}
                {genres && genres.length > 0 && (<p><span className="font-semibold text-white">Genre:</span> {genres.map(g => typeof g === 'string' ? g : g.name).join(', ')}</p>)}
                {releaseYear && (<p><span className="font-semibold text-white">Year:</span> {releaseYear}</p>)}
                {movie.status && (<p><span className="font-semibold text-white">Status:</span> {movie.status}</p>)}
              </div>
            </div>

            {similar.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Similar movies</h2>
                <div className="space-y-4">{similar.slice(0, 3).map((item) => (<MovieCard key={item.id || item._id} movie={item} />))}</div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowTrailer(false)}>
          <div className="relative w-[90%] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowTrailer(false)} className="absolute -top-12 right-0 text-4xl text-white">✕</button>
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe className="h-full w-full" src={typeof trailer === 'string' ? trailer : `https://www.youtube.com/embed/${trailer.key}?autoplay=1`} title="Movie Player" allow="autoplay; encrypted-media" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MovieDetails;
