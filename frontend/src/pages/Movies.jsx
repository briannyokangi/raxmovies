import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { movieService } from '../services/movieService';

const genres = [
  { id: 28, name: 'Action', emoji: '💥' },
  { id: 18, name: 'Drama', emoji: '🎭' },
  { id: 53, name: 'Thriller', emoji: '😨' },
  { id: 14, name: 'Fantasy', emoji: '✨' },
  { id: 35, name: 'Comedy', emoji: '😂' },
  { id: 878, name: 'Sci-Fi', emoji: '🚀' },
  { id: 27, name: 'Horror', emoji: '👻' },
  { id: 16, name: 'Animation', emoji: '🎨' },
];

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, [search, selectedGenre, page]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { page, genre: selectedGenre, search };
      const response = search
        ? await movieService.searchMovies(search, page)
        : selectedGenre
          ? await movieService.getMovies(params)
          : await movieService.getPopularMovies(page);

      setMovies(response.movies || []);
      setTotalPages(response.totalPages || 1);

      const paramsObj = new URLSearchParams();
      if (search) paramsObj.set('search', search);
      if (selectedGenre) paramsObj.set('genre', selectedGenre);
      if (page > 1) paramsObj.set('page', page);
      setSearchParams(paramsObj);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleGenreClick = (genreId) => {
    const genreStr = String(genreId);
    setSelectedGenre((prev) => (prev === genreStr ? '' : genreStr));
    setPage(1);
  };

  const selectedGenreName = genres.find((g) => String(g.id) === selectedGenre)?.name || '';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto space-y-6 px-4 py-10 md:px-6 md:py-14">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Browse</p>
          <h1 className="text-3xl font-bold text-white md:text-5xl">Watch a premium collection</h1>
          <p className="max-w-2xl text-lg text-slate-400">
            {search ? `Search results for "${search}"` : selectedGenreName ? `Browse ${selectedGenreName} movies` : 'Discover a curated selection of cinematic highlights.'}
          </p>
        </div>

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={handleSearch} />

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">Filter by genre</p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button onClick={() => { setSelectedGenre(''); setPage(1); }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!selectedGenre ? 'bg-sky-600 text-white' : 'border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-white'}`}>
              All Genres
            </button>
            {genres.map((genre) => (
              <button key={genre.id} onClick={() => handleGenreClick(genre.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedGenre === String(genre.id) ? 'bg-sky-600 text-white' : 'border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-white'}`}>
                {genre.emoji} {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && <section className="container mx-auto px-4 pb-6"><div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div></section>}

      <section className="container mx-auto px-4 pb-16 md:px-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SkeletonLoader count={9} variant="poster" />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="rounded-full bg-slate-800 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                  ← Previous
                </button>
                <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                  Page {page} of {totalPages}
                </div>
                <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="rounded-full bg-slate-800 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center text-slate-400">
            No movies found. Try a different search or filter.
          </div>
        )}
      </section>
    </main>
  );
};

export default Movies;
