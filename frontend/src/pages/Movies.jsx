import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { movieAPI } from '../services/api';

const genres = [
  { id: 28, name: 'Action' },
  { id: 18, name: 'Drama' },
  { id: 53, name: 'Thriller' },
  { id: 14, name: 'Fantasy' },
  { id: 35, name: 'Comedy' },
  { id: 878, name: 'Sci-Fi' },
  { id: 27, name: 'Horror' },
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
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-white">Browse movies</h1>
          <p className="max-w-2xl text-slate-400">Search by title, discover genres, and filter thousands of movies from TMDB.</p>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={handleSearch} />
        </div>

        {/* Genre Filter */}
        <div className="mt-8 flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedGenre === String(genre.id)
                  ? 'border-rose-400 bg-rose-500/10 text-rose-200'
                  : 'border-slate-700 text-slate-300 hover:border-rose-400 hover:text-white'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            {error}
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-slate-800 h-64"></div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="text-slate-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 text-center py-12">
            <p className="text-slate-400">No movies found. Try a different search.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Movies;
