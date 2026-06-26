import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailerModal from './TrailerModal';
import { movieAPI } from '../services/api';

const MovieCard = ({ movie }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(Boolean(movie.isWatchlisted));
  const navigate = useNavigate();
  const id = movie.id || movie._id;
  const poster = movie.posterUrl || movie.poster || movie.poster_url || '';
  const title = movie.title || movie.name || 'Untitled movie';
  const rating = movie.vote_average || movie.rating || movie.score || 0;
  const releaseYear = movie.releaseYear || movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '') || movie.year || '';
  const genre = Array.isArray(movie.genre) ? movie.genre[0] : (movie.genre || movie.genres || movie.category || 'General');
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

  const handleCardClick = () => {
    navigate(`/movies/${id}`);
  };

  return (
    <>
      <article className="card-premium cursor-pointer animate-scaleIn" onClick={handleCardClick}>
        <div className="relative aspect-[2/3] overflow-hidden bg-navy-800 group">
          {poster ? (
            <img src={poster} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-4xl text-gray-600">🎬</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
          
          {/* Rating Badge */}
          {rating ? (
            <div className="absolute right-3 top-3 rounded-full bg-navy-950/90 px-3 py-1 text-sm font-semibold text-yellow-400 backdrop-blur">
              ⭐ {Number(rating).toFixed(1)}
            </div>
          ) : null}

          {/* Hover Actions */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/80 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setIsTrailerOpen(true); }} 
              className="btn-primary"
            >
              ▶ Watch Trailer
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleWatchlist(e); }} 
              className={`btn-secondary ${isWatchlisted ? 'bg-sky-500/30 border-sky-400 text-sky-300' : ''}`}
            >
              {isWatchlisted ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
            </button>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <h3 className="text-base font-semibold text-white line-clamp-2 hover:text-sky-400 transition-colors">{title}</h3>
          
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400">
            {releaseYear && <span>{releaseYear}</span>}
            {genre && <span>•</span>}
            {genre && <span className="line-clamp-1">{genre}</span>}
            {duration && <span>•</span>}
            {duration && <span>{duration}m</span>}
          </div>

          {/* Match Badge (AI) */}
          <div className="pt-2">
            <div className="inline-block px-2 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              95% AI Match
            </div>
          </div>
        </div>
      </article>

      <TrailerModal isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} trailerUrl={trailerUrl} title={title} />
    </>
  );
};

export default MovieCard;
