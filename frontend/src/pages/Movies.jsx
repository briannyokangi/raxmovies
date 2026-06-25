import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { movieAPI } from '../services/api';

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

      let response;
      if (search) {
        response = await movieAPI.searchMovies(search, page);
      } else if (selectedGenre) {
        response = await movieAPI.getMovies({ genre: selectedGenre, page });
      } else {
        response = await movieAPI.getPopularMovies(page);
      }

      setMovies(response.data.movies || []);
      setTotalPages(response.data.totalPages || 1);

      // Update URL params
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedGenre) params.set('genre', selectedGenre);
      if (page > 1) params.set('page', page);
      setSearchParams(params);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error loading movies:', error);
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
    if (selectedGenre === genreStr) {
      setSelectedGenre('');
    } else {
      setSelectedGenre(genreStr);
    }
    setPage(1);
  };

  const selectedGenreName = genres.find(g => String(g.id) === selectedGenre)?.name || '';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Browse Movies
          </h1>
          <p className="text-slate-400 text-lg">
            {search
              ? `Search results for "${search}"`
              : selectedGenreName
              ? `Browse ${selectedGenreName} movies`
              : 'Discover thousands of movies from TMDB'}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearch}
        />

        {/* Genre Filter */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Filter by Genre
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => {
                setSelectedGenre('');
                setPage(1);
              }}
              className={`px-4 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 active:scale-95 ${
                !selectedGenre
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-4 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 active:scale-95 whitespace-nowrap ${
                  selectedGenre === String(genre.id)
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                    : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {genre.emoji} {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="container mx-auto px-4 pb-8">
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        </section>
      )}

      {/* Movies Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <SkeletonLoader count={12} variant="poster" />
        ) : movies.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 md:mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-5 md:px-6 py-2 md:py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 active:scale-95"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm md:text-base">
                    Page
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 md:py-2 rounded-lg bg-rose-600 text-white font-semibold">
                      {page}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="px-3 py-1 md:py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold">
                      {totalPages}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-5 md:px-6 py-2 md:py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 active:scale-95"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-slate-400 text-lg">
              No movies found. Try a different search or filter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Movies;
