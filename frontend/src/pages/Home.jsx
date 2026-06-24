import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import api from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  const fetchMovies = async (query = '') => {
    try {
      const res = await api.get(`/movies${query}`);
      setMovies(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    fetchMovies(query);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,74,111,0.2),_transparent_40%),_linear-gradient(180deg,_#020617,_#0f172a)] text-slate-100">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">Cinematic discovery</span>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">Stream the next blockbuster, explore cult favorites, and curate your watchlist.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">Browse original movie picks, build your profile, save favorites, and discover films by genre in a sleek cinematic interface.</p>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={handleSearch} />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Featured movie</h2>
            <p className="mt-4 text-slate-300">Get inspired by top trends and streamer favorites handpicked for your next movie night.</p>
            <div className="mt-8 space-y-5">
              <div className="rounded-3xl bg-slate-900 p-5 shadow-xl shadow-black/40">
                <p className="text-sm uppercase tracking-[0.35em] text-rose-400">Top pick</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">Shadow Harbor</h3>
                <p className="mt-4 text-slate-300">A thrilling neo-noir film about a detective chasing the truth through city lights and hidden secrets.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900 p-5 text-slate-300 shadow-xl shadow-black/30">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Genre</p>
                  <p className="mt-2 text-xl font-semibold text-white">Mystery</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-5 text-slate-300 shadow-xl shadow-black/30">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Rating</p>
                  <p className="mt-2 text-xl font-semibold text-white">8.7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Popular movies</h2>
            <p className="mt-2 text-slate-400">Browse crowd favorites, latest releases, and top-rated titles.</p>
          </div>
          <p className="text-sm uppercase tracking-[0.35em] text-rose-400">Updated daily</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.slice(0, 6).map((movie) => <MovieCard key={movie._id} movie={movie} />)}
        </div>
      </section>
    </main>
  );
};

export default Home;
