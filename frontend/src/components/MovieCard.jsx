import { useState } from 'react';
import TrailerModal from './TrailerModal';
import { movieAPI } from '../services/api';

const MovieCard = ({ movie }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(Boolean(movie.isWatchlisted));
  const id = movie.id || movie._id;
  const poster = movie.posterUrl || movie.poster || movie.poster_url || '';
  const title = movie.title || movie.name || 'Untitled movie';
  const rating = movie.vote_average || movie.rating || movie.score || 0;
  const releaseYear = movie.releaseYear || movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '') || movie.year || '';
  const genre = movie.genre || movie.genres || movie.category || 'General';
  const duration = movie.duration || movie.runtime || movie.length || '';
  const trailerUrl = movie.trailerUrl || movie.trailer_url || movie.trailer || movie.video_url || '';

  const handleWatchlist = async (event) => {
    event.preventDefault();
    try {
      await movieAPI.toggleWatchlist(id);
      setIsWatchlisted((prev) => !prev);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 shadow-[0_15px_40px_rgba(2,8,23,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(56,189,248,0.18)]">
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
          {poster ? (
            <img src={poster} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-4xl text-slate-500">🎬</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          {rating ? <div className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-sm font-semibold text-sky-300 backdrop-blur">★ {Number(rating).toFixed(1)}</div> : null}

          <button type="button" onClick={(event) => { event.preventDefault(); setIsTrailerOpen(true); }} className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-sky-400/60 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-sky-200 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span>▶</span> Preview
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-base font-semibold text-white line-clamp-2">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{releaseYear || 'Coming soon'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">{genre}</span>
            {duration ? <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{duration} min</span> : null}
          </div>

          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setIsTrailerOpen(true)} className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Play Trailer
            </button>
            <button type="button" onClick={handleWatchlist} className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isWatchlisted ? 'border-rose-500 bg-rose-500/15 text-rose-300' : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-sky-400 hover:text-white'}`}>
              {isWatchlisted ? '♥ Added' : '♡ Add to Watchlist'}
            </button>
          </div>
        </div>
      </article>

      <TrailerModal isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} trailerUrl={trailerUrl} title={title} />
    </>
  );
};

export default MovieCard;
