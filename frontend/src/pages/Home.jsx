import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import ContentRow from '../components/ContentRow';
import SkeletonLoader from '../components/SkeletonLoader';
import { movieAPI } from '../services/api';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const requests = [
        movieAPI.getFeaturedMovies(),
        movieAPI.getPopularMovies(1),
        movieAPI.getMovies({ genre: '28', page: 1 }), // Action
        movieAPI.getMovies({ genre: '18', page: 1 }), // Drama
      ];

      const [featuredRes, popularRes, actionRes, dramaRes] = await Promise.all(requests);

      setFeaturedMovies(featuredRes.data.movies || []);
      setTrendingMovies(popularRes.data.movies?.slice(0, 12) || []);
      setPopularMovies(popularRes.data.movies || []);
      setActionMovies(actionRes.data.movies?.slice(0, 12) || []);
      setDramaMovies(dramaRes.data.movies?.slice(0, 12) || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/movies?search=${encodeURIComponent(search)}`;
    }
  };

  const featuredMovie = featuredMovies[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[600px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 py-12 md:py-24 flex flex-col justify-center items-start">
          <div className="max-w-2xl space-y-6">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200 border border-rose-500/30">
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              Trending Now
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
              Stream the next
              <span className="block bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                blockbuster
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              Explore thousands of movies handpicked for you. Build your watchlist, save favorites, and discover films by genre in our sleek cinematic interface.
            </p>

            {/* Search Bar */}
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={handleSearch}
            />

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/movies"
                className="px-6 md:px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
              >
                Browse Movies
              </a>
              <a
                href="/movies?genre=28"
                className="px-6 md:px-8 py-3 rounded-lg border border-slate-600 hover:border-rose-400 text-slate-300 hover:text-white font-semibold transition-all duration-300 active:scale-95"
              >
                Action Films
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured/Top Pick Section */}
      {!loading && featuredMovie && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 md:p-8 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr_1.5fr]">
              {/* Featured Movie Poster */}
              <div className="hidden md:block relative rounded-xl overflow-hidden aspect-[2/3] shadow-xl">
                {featuredMovie.posterUrl || featuredMovie.poster ? (
                  <img
                    src={featuredMovie.posterUrl || featuredMovie.poster}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="text-6xl">🎬</span>
                  </div>
                )}
              </div>

              {/* Featured Movie Info */}
              <div className="space-y-4">
                <div>
                  <span className="inline-block text-xs md:text-sm uppercase tracking-widest text-rose-400 font-bold mb-2">
                    Top Pick
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {featuredMovie.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                  {featuredMovie.release_date && (
                    <span className="text-slate-300">
                      {new Date(featuredMovie.release_date).getFullYear()}
                    </span>
                  )}
                  {featuredMovie.vote_average && (
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="font-semibold text-white">
                        {Number(featuredMovie.vote_average).toFixed(1)}/10
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed line-clamp-3">
                  {featuredMovie.overview || featuredMovie.description}
                </p>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`/movies/${featuredMovie.id || featuredMovie._id}`}
                    className="px-6 md:px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
                  >
                    <span>▶</span> Watch Now
                  </a>
                  <button className="px-6 md:px-8 py-3 rounded-lg border border-slate-600 hover:border-white text-slate-300 hover:text-white font-semibold transition-all duration-300">
                    + Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      <section className="space-y-8 md:space-y-12 pb-16">
        {/* Trending Now */}
        {loading ? (
          <div className="container mx-auto px-4">
            <SkeletonLoader count={8} variant="row" />
          </div>
        ) : (
          <div className="container mx-auto px-0">
            <ContentRow
              title="🔥 Trending Now"
              movies={trendingMovies}
              loading={loading}
            />
          </div>
        )}

        {/* Popular Movies */}
        {loading ? (
          <div className="container mx-auto px-4">
            <SkeletonLoader count={8} variant="row" />
          </div>
        ) : (
          <div className="container mx-auto px-0">
            <ContentRow
              title="⭐ Popular Movies"
              movies={popularMovies}
              loading={loading}
            />
          </div>
        )}

        {/* Action */}
        {loading ? (
          <div className="container mx-auto px-4">
            <SkeletonLoader count={8} variant="row" />
          </div>
        ) : (
          <div className="container mx-auto px-0">
            <ContentRow
              title="💥 Action"
              movies={actionMovies}
              loading={loading}
            />
          </div>
        )}

        {/* Drama */}
        {loading ? (
          <div className="container mx-auto px-4">
            <SkeletonLoader count={8} variant="row" />
          </div>
        ) : (
          <div className="container mx-auto px-0">
            <ContentRow
              title="🎭 Drama"
              movies={dramaMovies}
              loading={loading}
            />
          </div>
        )}
      </section>

      {/* Error Message */}
      {error && (
        <section className="container mx-auto px-4 pb-8">
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            {error}
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;