import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
  <div className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-1 hover:shadow-rose-500/30">
    <img src={movie.poster} alt={movie.title} className="h-72 w-full object-cover brightness-90 transition duration-300 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
    <div className="relative p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-rose-400">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{movie.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">{movie.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{movie.year}</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-amber-300">{movie.rating}/10</span>
      </div>
      <Link to={`/movies/${movie._id}`} className="mt-4 inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400">
        View details
      </Link>
    </div>
  </div>
);

export default MovieCard;
