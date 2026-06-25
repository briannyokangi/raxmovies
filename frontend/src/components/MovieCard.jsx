import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Handle both TMDB and local MongoDB movie formats
  const id = movie.id || movie._id;
  const poster = movie.posterUrl || movie.poster;
  const title = movie.title;
  const rating = movie.vote_average || movie.rating;

  return (
    <Link
      to={`/movies/${id}`}
      className="group relative overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 transform hover:scale-105 hover:z-10 shadow-lg hover:shadow-2xl hover:shadow-black/50 active:scale-95"
    >
      {/* Poster Image with 2:3 aspect ratio */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-900">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <span className="text-slate-500 text-4xl">🎬</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition duration-300">
          <div className="text-6xl text-white opacity-0 group-hover:opacity-100 transition duration-300 transform scale-75 group-hover:scale-100 drop-shadow-lg">
            ▶
          </div>
        </div>

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2 right-2 rounded-full bg-black/80 px-3 py-1 text-sm font-bold text-amber-300 backdrop-blur-sm">
            {Number(rating).toFixed(1)}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
      </div>

      {/* Title Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black via-black/80 to-transparent transform translate-y-2 group-hover:translate-y-0 transition duration-300">
        <h3 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default MovieCard;
