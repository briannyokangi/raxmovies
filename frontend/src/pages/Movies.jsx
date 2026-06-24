import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import api from '../services/api';

const genres = ['Action', 'Drama', 'Thriller', 'Fantasy', 'Comedy', 'Sci-fi', 'Horror'];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const loadMovies = async (query = '') => {
    try {
      const res = await api.get(`/movies${query}`);
      setMovies(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const query = selectedGenre ? `?genre=${encodeURIComponent(selectedGenre)}` : '';
    loadMovies(query);
  }, [selectedGenre]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedGenre) params.set('genre', selectedGenre);
    loadMovies(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-white">Browse movies</h1>
          <p className="max-w-2xl text-slate-400">Search by title, discover genres, and filter the latest picks from your collection.</p>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={handleSearch} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
              className={`rounded-full border px-4 py-2 text-sm transition ${selectedGenre === genre ? 'border-rose-400 bg-rose-500/10 text-rose-200' : 'border-slate-700 text-slate-300 hover:border-rose-400 hover:text-white'}`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
        </div>
      </section>
    </main>
  );
};

export default Movies;
