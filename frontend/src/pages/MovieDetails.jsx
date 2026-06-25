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

    console.log('Movie:', data.movie);
    console.log('Videos:', data.movie?.videos);

    setMovie(data.movie);
    setReviews(data.reviews || []);
    setSimilar(data.similar || []);
    setError('');
  } catch (error) {
    console.error('Error loading movie:', error);
    setError('Failed to load movie details');
  } finally {
    setLoading(false);
  }
};

  const loadProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
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
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await movieAPI.toggleFavorite(id);
      loadMovie();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWatchlist = async () => {
    try {
      await movieAPI.toggleWatchlist(id);
      loadMovie();
    } catch (error) {
      console.error('Error toggling watchlist:', error);
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
          <div className="p-6 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            {error}
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
  
  // Handle both TMDB and local movie data
  const posterUrl = movie.posterUrl || movie.poster;
  const backdropUrl = movie.backdropUrl || movie.backdrop;
  const title = movie.title;
  const description = movie.overview || movie.description;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year;
  const voteAverage = movie.vote_average || movie.rating;
  const genres = movie.genres || movie.genre || [];
  const cast = movie.credits?.cast?.slice(0, 10) || movie.cast || [];
  const runtime = movie.runtime || movie.duration;

  const trailer =
  movie.trailer ||
  movie.videoUrl ||
  null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="relative h-96 w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(15,23,42,1)), url(${backdropUrl})`,
          }}
        />
      )}

      <section className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-6 lg:flex-row">
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={title}
                  className="h-96 w-full rounded-3xl object-cover md:w-1/2"
                />
              )}
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-white">{title}</h1>
                <p className="text-green-500">
                 Trailer: {movie.trailer}
                </p>
                <p className="text-slate-400 line-clamp-4">{description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {releaseYear && (
                    <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">
                      Year: {releaseYear}
                    </div>
                  )}
                  {Array.isArray(genres) && genres.length > 0 && (
                    <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">
                      Genre: {genres.map(g => typeof g === 'string' ? g : g.name).join(', ')}
                    </div>
                  )}
                  {runtime && (
                    <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">
                      Duration: {runtime} min
                    </div>
                  )}
                  {voteAverage && (
                    <div className="rounded-3xl bg-slate-950/70 p-4 text-slate-300">
                      Rating: {Number(voteAverage).toFixed(1)}/10
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleFavorite}
                    className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                  >
                    {isFavorite ? '❤ Remove favorite' : '🤍 Save favorite'}
                  </button>
                  <button
                    onClick={handleWatchlist}
                    className="rounded-full border border-rose-500 px-5 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
                  >
                    {isWatchlist ? '✓ Remove from watchlist' : '+ Add to watchlist'}
                  </button>
                  {trailer && (
                   <a
                    href={trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-500"
                 >
                   ▶ Play Movie
                 </a>
                 )}
                </div>
              </div>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white">Cast</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300"
                    >
           
                   {typeof actor === 'string' ? actor : actor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-slate-400">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">
                        {review.userId?.username || 'Anonymous'}
                      </p>
                      <span className="rounded-full bg-rose-500/10 px-3 py-1 text-sm text-rose-200">
                        {review.rating}/10
                      </span>
                    </div>
                    <p className="mt-3 text-slate-400">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleReview} className="rounded-3xl bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold text-white">Leave a review</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                placeholder="Share your thoughts about this movie..."
                className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-900 p-4 text-slate-100 outline-none placeholder-slate-500"
                disabled={submitting}
              />
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="text-sm text-slate-300">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="rounded-full bg-slate-800 px-4 py-3 text-slate-100 outline-none"
                  disabled={submitting}
                >
                  {Array.from({ length: 11 }, (_, i) => i).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit review'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">Movie details</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                {description && <p>{description}</p>}
                {voteAverage && (
                  <p>
                    <span className="font-semibold text-white">Rating:</span>{' '}
                    {Number(voteAverage).toFixed(1)}/10
                  </p>
                )}
                {genres && genres.length > 0 && (
                  <p>
                    <span className="font-semibold text-white">Genre:</span>{' '}
                    {genres.map(g => typeof g === 'string' ? g : g.name).join(', ')}
                  </p>
                )}
                {releaseYear && (
                  <p>
                    <span className="font-semibold text-white">Year:</span> {releaseYear}
                  </p>
                )}
                {movie.status && (
                  <p>
                    <span className="font-semibold text-white">Status:</span> {movie.status}
                  </p>
                )}
              </div>
            </div>

            {/* Similar Movies */}
            {similar.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Similar movies</h2>
                <div className="space-y-4">
                  {similar.slice(0, 3).map((item) => (
                    <MovieCard key={item.id || item._id} movie={item} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
      {showTrailer && trailer && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    onClick={() => setShowTrailer(false)}
  >
    <div
      className="relative w-[90%] max-w-5xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowTrailer(false)}
        className="absolute -top-12 right-0 text-4xl text-white"
      >
        ✕
      </button>

      <div className="aspect-video overflow-hidden rounded-2xl">
        <iframe
         className="h-full w-full"
         src={
          typeof trailer === 'string'
           ? trailer
           : `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
       }
         title="Movie Player"
         allow="autoplay; encrypted-media"
         allowFullScreen
       />
      </div>
    </div>
  </div>
)}
    </main>
  );
};

export default MovieDetails;
