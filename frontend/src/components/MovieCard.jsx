import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Handle both TMDB and local MongoDB movie formats
  const id = movie.id || movie._id;
  const poster = movie.posterUrl || movie.poster;
  const title = movie.title;
  const description = movie.overview || movie.description;
  const genres = movie.genres || movie.genre || [];
  const genreText = Array.isArray(genres)
    ? genres.map(g => typeof g === 'string' ? g : g.name).join(', ')
    : genres;
  
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.year;
  
  const rating = movie.vote_average || movie.rating;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-1 hover:shadow-rose-500/30">
      {poster && (
        <img
          src={poster}
          alt={title}
          className="h-72 w-full object-cover brightness-90 transition duration-300 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
      <div className="relative p-5">
        {genreText && (
          <p className="text-xs uppercase tracking-[0.3em] text-rose-400">
            {genreText}
          </p>
        )}
        <h3 className="mt-2 text-xl font-semibold text-white line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          {year && <span>{year}</span>}
          {rating && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-amber-300">
              {Number(rating).toFixed(1)}/10
            </span>
          )}
        </div>
        <Link
          to={`/movies/${id}`}
          className="mt-4 inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
