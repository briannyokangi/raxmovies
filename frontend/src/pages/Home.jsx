import { useEffect, useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { movieService } from '../services/movieService';

const genreOptions = ['Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi', 'Drama', 'Thriller', 'Animation'];
const moodPrompts = [
  { label: 'I’m in the mood for horror', query: 'horror' },
  { label: 'Show me funny action movies', query: 'funny action' },
  { label: 'Give me a cozy romance', query: 'romance' },
  { label: 'Something thrilling from 2024', query: 'thriller 2024' },
];

const normalizeGenreList = (movie) => {
  const raw = movie.genre || movie.genres || '';
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const buildHistoryRecommendations = (movies, historyItems) => {
  const historyGenres = historyItems.flatMap((item) => normalizeGenreList(item).map((genre) => genre.toLowerCase()));
  const historyYears = historyItems.map((item) => Number(item.releaseYear)).filter(Boolean);

  return [...movies]
    .map((movie) => {
      const genres = normalizeGenreList(movie).map((genre) => genre.toLowerCase());
      const genreMatches = genres.reduce((score, genre) => score + (historyGenres.includes(genre) ? 2 : 0), 0);
      const yearMatch = historyYears.includes(Number(movie.releaseYear)) ? 1 : 0;
      const ratingBoost = Number(movie.rating || movie.vote_average || 0) / 10;
      return { movie, score: genreMatches + yearMatch + ratingBoost };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ movie }) => movie);
};

const getAssistantResults = (movies, query) => {
  const normalized = query.toLowerCase();
  const genreMatches = normalizeGenreList(movies[0] || {}).length > 0 ? [] : [];

  const explicitGenres = ['action', 'comedy', 'horror', 'romance', 'sci-fi', 'thriller', 'drama', 'adventure'];
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/)?.[0];
  const selectedGenre = explicitGenres.find((genre) => normalized.includes(genre));
  const moodKeyword = normalized.includes('horror') ? 'Horror' : normalized.includes('funny') || normalized.includes('comedy') ? 'Comedy' : normalized.includes('romance') ? 'Romance' : normalized.includes('thriller') ? 'Thriller' : normalized.includes('sci-fi') || normalized.includes('sci fi') ? 'Sci-Fi' : selectedGenre ? selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1) : '';

  return [...movies]
    .filter((movie) => {
      const genres = normalizeGenreList(movie).map((genre) => genre.toLowerCase());
      const title = (movie.title || '').toLowerCase();
      const matchesGenre = moodKeyword ? genres.some((genre) => genre.includes(moodKeyword.toLowerCase())) : false;
      const matchesYear = yearMatch ? Number(movie.releaseYear) === Number(yearMatch) : true;
      const matchesText = title.includes(normalized) || genres.some((genre) => genre.includes(normalized));
      return matchesYear && (matchesGenre || matchesText || !query.trim());
    })
    .sort((a, b) => Number(b.rating || b.vote_average || 0) - Number(a.rating || a.vote_average || 0))
    .slice(0, 8);
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [search, setSearch] = useState('');
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResults, setAssistantResults] = useState([]);
  const [assistantMessage, setAssistantMessage] = useState('Try: “Show me funny action movies from 2024”');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const storedContinueWatching = localStorage.getItem('rax_continue_watching');
    if (storedContinueWatching) {
      try {
        setContinueWatching(JSON.parse(storedContinueWatching));
      } catch {
        setContinueWatching([]);
      }
    }

    const storedRecentlyViewed = localStorage.getItem('rax_view_history');
    if (storedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      } catch {
        setRecentlyViewed([]);
      }
    }

    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const [featuredResult, popularResult, nextPopularResult] = await Promise.all([
        movieService.getFeaturedMovies(),
        movieService.getPopularMovies(1),
        movieService.getPopularMovies(2),
      ]);

      const popularMovies = popularResult.movies || [];
      const nextPageMovies = nextPopularResult.movies || [];
      const sortedTopRated = [...popularMovies].sort((a, b) => (b.rating || b.vote_average || 0) - (a.rating || a.vote_average || 0));

      setFeaturedMovies(featuredResult);
      setMovies(popularMovies);
      setTrendingMovies(popularMovies.slice(0, 8));
      setLatestMovies(nextPageMovies.slice(0, 8));
      setTopRatedMovies(sortedTopRated.slice(0, 8));
      setRecommendedMovies(popularMovies.slice(0, 8));
      setHasMore((popularResult.totalPages || 1) > 1);
      setPage(1);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async (nextPage = 1) => {
    try {
      setLoading(true);
      const result = await movieService.getPopularMovies(nextPage);
      const incomingMovies = result.movies || [];
      setMovies((prev) => (nextPage === 1 ? incomingMovies : [...prev, ...incomingMovies]));
      setHasMore((result.totalPages || 1) > nextPage);
      setPage(nextPage);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.trim()) {
      window.location.href = `/movies?search=${encodeURIComponent(search)}`;
    }
  };

  const handleAssistantSearch = (event) => {
    event.preventDefault();
    const query = assistantQuery.trim();
    const results = getAssistantResults(movies, query || 'recommended');
    setAssistantResults(results);
    setAssistantMessage(
      results.length > 0
        ? `AI picked ${results.length} matches for “${query || 'your mood'}”.`
        : `No exact matches for “${query || 'your mood'}”, so I’m showing broader picks.`
    );
  };

  const suggestions = useMemo(() => {
    const baseSuggestions = movies.slice(0, 10).map((movie) => ({
      label: movie.title,
      type: 'Title',
    }));

    const genreSuggestions = genreOptions.map((genre) => ({ label: genre, type: 'Genre' }));
    const yearSuggestions = movies.slice(0, 6).map((movie) => ({ label: movie.releaseYear || '', type: 'Year' })).filter((item) => item.label);

    return [...baseSuggestions, ...genreSuggestions, ...yearSuggestions].slice(0, 15);
  }, [movies]);

  const featuredMovie = featuredMovies[0];
  const historyRecommendations = useMemo(() => buildHistoryRecommendations(movies, recentlyViewed), [movies, recentlyViewed]);
  const discoveryRows = useMemo(() => {
    const comingSoon = [...movies].filter((movie) => Number(movie.releaseYear) >= 2024).slice(0, 4);
    const editorPicks = featuredMovies.slice(0, 4);
    const awardWinning = [...topRatedMovies].slice(0, 4);
    const collections = [
      {
        title: 'Sci-Fi Picks',
        description: 'Futuristic adventures and mind-bending worlds.',
        movies: [...movies].filter((movie) => normalizeGenreList(movie).some((genre) => genre.toLowerCase().includes('sci'))).slice(0, 4),
      },
      {
        title: 'Thriller Nights',
        description: 'Fast-paced twists and suspenseful stories.',
        movies: [...movies].filter((movie) => normalizeGenreList(movie).some((genre) => genre.toLowerCase().includes('thrill'))).slice(0, 4),
      },
      {
        title: 'Feel-Good Romance',
        description: 'Soft, warm, and heart-lifting stories.',
        movies: [...movies].filter((movie) => normalizeGenreList(movie).some((genre) => genre.toLowerCase().includes('romance'))).slice(0, 4),
      },
    ];

    return [
      { title: 'Trending today', movies: trendingMovies.slice(0, 4) },
      { title: 'Coming soon', movies: comingSoon },
      { title: 'Editor’s picks', movies: editorPicks },
      { title: 'Award-winning movies', movies: awardWinning },
      { title: 'Recently added', movies: latestMovies.slice(0, 4) },
      ...collections.map((collection) => ({ title: collection.title, description: collection.description, movies: collection.movies })),
    ];
  }, [movies, featuredMovies, topRatedMovies, trendingMovies, latestMovies]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/70 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)]">
        <div className="container mx-auto flex flex-col px-4 py-10 md:px-6 md:py-16 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" /> AI-powered discovery
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Discover your next <span className="block text-sky-400">blue-rush favorite</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              Browse a polished collection of movies with instant trailer previews, smart recommendations, and a cinematic blue theme.
            </p>
            <div className="max-w-2xl pt-2">
              <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} onSubmit={handleSearch} suggestions={suggestions} onSuggestionSelect={(item) => { setSearch(item.label); window.location.href = `/movies?search=${encodeURIComponent(item.label)}`; }} />
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem] border border-sky-500/20 bg-slate-900/70 shadow-2xl shadow-slate-950/60">
              <div className="relative aspect-[16/9] overflow-hidden">
                {featuredMovie?.poster ? (
                  <img src={featuredMovie.poster} alt={featuredMovie.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-800 text-5xl text-slate-500">🎬</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">Featured</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1">{featuredMovie?.releaseYear || 'Now streaming'}</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">{featuredMovie?.title || 'Featured release'}</h2>
                <p className="text-slate-400">{featuredMovie?.description || 'A cinematic highlight ready for your next watch.'}</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/movies" className="rounded-full bg-sky-600 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-500">Browse movies</a>
                  <a href="/movies?genre=28" className="rounded-full border border-slate-700 px-5 py-2.5 font-semibold text-slate-300 transition hover:border-sky-400 hover:text-white">Action picks</a>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Genres</h3>
                <span className="text-sm text-slate-400">Tap to explore</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <a key={genre} href={`/movies?genre=${genre.toLowerCase()}`} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400 hover:text-white">
                    {genre}
                  </a>
                ))}
              </div>
              <div className="mt-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>AI picks ready</span>
                  <span className="font-semibold text-white">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Instant trailers</span>
                  <span className="font-semibold text-white">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile ready</span>
                  <span className="font-semibold text-white">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-sky-500/20 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">AI assistant</p>
                <h2 className="text-2xl font-semibold text-white">Find me a movie</h2>
              </div>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-300">Natural language</span>
            </div>
            <form onSubmit={handleAssistantSearch} className="mt-5 flex flex-col gap-3 md:flex-row">
              <input value={assistantQuery} onChange={(event) => setAssistantQuery(event.target.value)} placeholder="Show me funny action movies from 2024" className="flex-1 rounded-full border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" />
              <button type="submit" className="rounded-full bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-500">Ask AI</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {moodPrompts.map((prompt) => (
                <button key={prompt.query} type="button" onClick={() => { setAssistantQuery(prompt.query); const results = getAssistantResults(movies, prompt.query); setAssistantResults(results); setAssistantMessage(`AI picked ${results.length} matches for “${prompt.query}”.`); }} className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400 hover:text-white">
                  {prompt.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400">{assistantMessage}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(assistantResults.length > 0 ? assistantResults : historyRecommendations.slice(0, 4)).map((movie) => (
                <div key={movie.id || movie._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="font-semibold text-white">{movie.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{movie.genre || 'General'} • {movie.releaseYear || 'Coming soon'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Personalized</p>
                <h2 className="text-2xl font-semibold text-white">Recommended from your history</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-sm text-slate-300">Smart picks</span>
            </div>
            <div className="mt-5 space-y-3">
              {historyRecommendations.length > 0 ? (
                historyRecommendations.slice(0, 4).map((movie) => (
                  <div key={movie.id || movie._id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                    <div>
                      <p className="font-semibold text-white">{movie.title}</p>
                      <p className="text-sm text-slate-400">{movie.genre || 'General'} • {movie.releaseYear || 'Coming soon'}</p>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-300">AI match</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Watch a few titles to unlock deep personalization.</p>
              )}
            </div>
          </div>
        </div>

        {continueWatching.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Continue watching</h2>
              <a href="/profile" className="text-sm text-sky-300 transition hover:text-sky-200">View profile</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {continueWatching.slice(0, 4).map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Recently viewed</h2>
              <span className="text-sm text-slate-400">Your recent activity</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recentlyViewed.slice(0, 4).map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Trending now</h2>
            <a href="/movies" className="text-sm text-sky-300 transition hover:text-sky-200">View all</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Latest releases</h2>
            <a href="/movies" className="text-sm text-sky-300 transition hover:text-sky-200">View all</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {latestMovies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Top rated</h2>
            <a href="/movies" className="text-sm text-sky-300 transition hover:text-sky-200">View all</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Recommended for you</h2>
            <a href="/movies" className="text-sm text-sky-300 transition hover:text-sky-200">View all</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-6">
          {discoveryRows.map((row) => (
            <div key={row.title} className="rounded-[2rem] border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{row.title}</h2>
                  {row.description ? <p className="text-sm text-slate-400">{row.description}</p> : null}
                </div>
                <a href="/movies" className="text-sm text-sky-300 transition hover:text-sky-200">Explore</a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {row.movies.length > 0 ? row.movies.map((movie) => <MovieCard key={movie.id || movie._id} movie={movie} />) : <p className="text-sm text-slate-400">More titles are on the way.</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Collection</p>
            <h2 className="text-2xl font-semibold text-white">More to explore</h2>
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            {movies.length} movies loaded
          </div>
        </div>

        {loading && movies.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SkeletonLoader count={6} variant="poster" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>

            {error && <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button onClick={() => fetchMovies(page + 1)} className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-500">
                  {loading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;