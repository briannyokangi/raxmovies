import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { movieService } from '../services/movieService';

const normalizeGenreList = (movie) => {
  const raw = movie.genre || movie.genres || '';
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const moodPrompts = [
  { icon: '🔥', label: 'Hot & Trending', query: 'trending' },
  { icon: '😄', label: 'Feel Good', query: 'comedy' },
  { icon: '😱', label: 'Thrills', query: 'thriller' },
  { icon: '🚀', label: 'Sci-Fi', query: 'sci-fi' },
];

const genreOptions = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

const getAssistantResults = (movies, query) => {
  const normalized = query.toLowerCase();
  const explicitGenres = ['action', 'comedy', 'horror', 'romance', 'sci-fi', 'thriller', 'drama', 'adventure'];
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/)?.[0];
  const selectedGenre = explicitGenres.find((genre) => normalized.includes(genre));

  return [...movies]
    .filter((movie) => {
      const genres = normalizeGenreList(movie).map((genre) => genre.toLowerCase());
      const title = (movie.title || '').toLowerCase();
      const matchesGenre = selectedGenre ? genres.some((genre) => genre.includes(selectedGenre)) : true;
      const matchesYear = yearMatch ? Number(movie.year || movie.releaseYear) === Number(yearMatch) : true;
      const matchesText = title.includes(normalized) || genres.some((genre) => genre.includes(normalized));
      return matchesYear && (matchesGenre || matchesText || !query.trim());
    })
    .sort((a, b) => Number(b.rating || b.vote_average || 0) - Number(a.rating || a.vote_average || 0))
    .slice(0, 12);
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

const ContentRow = ({ title, emoji, description, movies, loading }) => {
  if (loading || !movies || movies.length === 0) return null;

  return (
    <section className="py-8 animate-slideUp">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-3xl md:text-4xl mr-2">{emoji}</span>
          <span className="gradient-text">{title}</span>
        </h2>
        {description && <p className="text-gray-400 text-sm md:text-base">{description}</p>}
      </div>
      <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
        {movies.map((movie) => (
          <div key={movie._id || movie.id} className="flex-shrink-0 w-40 md:w-48">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResults, setAssistantResults] = useState([]);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [feedMovies, setFeedMovies] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedContinueWatching = localStorage.getItem('rax_continue_watching');
    if (storedContinueWatching) {
      try {
        setContinueWatching(JSON.parse(storedContinueWatching).slice(0, 6));
      } catch {
        setContinueWatching([]);
      }
    }
    loadContent();
  }, []);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    try {
      setLoadingMore(true);
      const result = await movieService.getPopularMovies(feedPage);
      const nextMovies = result.movies || [];

      if (nextMovies.length === 0) {
        setHasMore(false);
        return;
      }

      setFeedMovies((prev) => [...prev, ...nextMovies]);
      setFeedPage((prev) => prev + 1);
      setHasMore((result.totalPages || 1) > feedPage);
    } catch (err) {
      console.error('Error loading more movies:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [feedPage, hasMore, loadingMore, loading]);

  useEffect(() => {
    if (!sentinelRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreMovies();
        }
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadMoreMovies]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      const [featured, popular1, popular2] = await Promise.all([
        movieService.getFeaturedMovies(),
        movieService.getPopularMovies(1),
        movieService.getPopularMovies(2),
      ]);

      const allMovies = [...(popular1.movies || []), ...(popular2.movies || [])];
      const initialFeedMovies = (popular1.movies || []).slice(0, 12);
      
      setFeaturedMovie(allMovies[0] || featured[0]);
      setMovies(allMovies);
      setFeedMovies(initialFeedMovies);
      setFeedPage(2);
      setHasMore((popular1.totalPages || 1) > 1);
      setTrendingMovies(allMovies.slice(0, 8));
      setTopRatedMovies([...allMovies].sort((a, b) => (b.rating || b.vote_average || 0) - (a.rating || a.vote_average || 0)).slice(0, 8));
      setNewReleases([...allMovies].filter(m => (m.year || m.releaseYear) >= 2024).slice(0, 8));
      setRecommendedMovies(allMovies.slice(8, 16));
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodClick = (query) => {
    setAssistantQuery(query);
    const results = getAssistantResults(movies, query);
    setAssistantResults(results);
    setAssistantMessage(`AI found ${results.length} picks for "${query}".`);
  };

  const handleAssistantSearch = (e) => {
    e.preventDefault();
    if (assistantQuery.trim()) {
      const results = getAssistantResults(movies, assistantQuery);
      setAssistantResults(results);
      setAssistantMessage(
        results.length > 0
          ? `AI found ${results.length} matches for "${assistantQuery}".`
          : `No matches found for "${assistantQuery}".`
      );
    }
  };

  const handleWatchNow = () => {
    if (featuredMovie) {
      navigate(`/movies/${featuredMovie._id || featuredMovie.id}`);
    }
  };

  const heroImageUrl = featuredMovie?.poster || featuredMovie?.posterUrl || '/placeholder-hero.jpg';
  const heroGradient = 'linear-gradient(to bottom, rgba(5,11,24,0) 30%, rgba(5,11,24,0.8) 100%)';

  return (
    <div className="min-h-screen bg-navy-950">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 mx-4 mt-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Hero Section */}
      {featuredMovie && !loading && (
        <section className="relative h-96 md:h-[500px] overflow-hidden group">
          <img
            src={heroImageUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div
            style={{ backgroundImage: heroGradient }}
            className="absolute inset-0"
          />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="max-w-2xl animate-slideUp">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredMovie.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base">
                {featuredMovie.year && (
                  <span className="text-gray-300">{featuredMovie.year}</span>
                )}
                {normalizeGenreList(featuredMovie).length > 0 && (
                  <span className="text-gray-300">{normalizeGenreList(featuredMovie).slice(0, 2).join(', ')}</span>
                )}
                {(featuredMovie.rating || featuredMovie.vote_average) && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span>⭐ {Math.round((featuredMovie.rating || featuredMovie.vote_average) * 10) / 10}</span>
                  </div>
                )}
                {featuredMovie.duration && (
                  <span className="text-gray-300">{featuredMovie.duration} min</span>
                )}
              </div>

              <p className="text-gray-200 text-sm md:text-lg line-clamp-3 mb-8 max-w-xl">
                {featuredMovie.description || featuredMovie.overview}
              </p>

              <div className="flex gap-4">
                <button onClick={handleWatchNow} className="btn-primary">
                  ▶ Watch Now
                </button>
                <button className="btn-secondary">
                  🎬 Watch Trailer
                </button>
                <button className="btn-secondary">
                  ❤️ Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* AI Assistant Section */}
        <section className="mb-12 animate-slideUp">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 md:p-8 border border-navy-800">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🤖</span>
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">AI Discovery</h2>
            </div>

            <p className="text-gray-300 mb-6">Describe your mood or what you're in the mood for, and I'll find perfect matches for you.</p>

            <form onSubmit={handleAssistantSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                placeholder="e.g., 'thrilling action movies' or 'romantic comedies from 2024'"
                className="flex-1 px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white focus:border-sky-400 focus:outline-none"
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>

            {/* Mood Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {moodPrompts.map((mood) => (
                <button
                  key={mood.query}
                  onClick={() => handleMoodClick(mood.query)}
                  className="px-4 py-2 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-all duration-200"
                >
                  {mood.icon} {mood.label}
                </button>
              ))}
            </div>

            {/* Assistant Results */}
            {assistantResults.length > 0 && (
              <div className="mt-8">
                <p className="text-sky-400 mb-4 text-sm">{assistantMessage}</p>
                <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                  {assistantResults.map((movie) => (
                    <div key={movie._id || movie.id} className="flex-shrink-0 w-40 md:w-48">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            emoji="👀"
            description="Pick up where you left off"
            movies={continueWatching}
            loading={loading}
          />
        )}

        {/* Trending Section */}
        <ContentRow
          title="Trending Now"
          emoji="🔥"
          description="What everyone's watching right now"
          movies={trendingMovies}
          loading={loading}
        />

        {/* Top Rated Section */}
        <ContentRow
          title="Top Rated"
          emoji="⭐"
          description="The highest-rated movies of all time"
          movies={topRatedMovies}
          loading={loading}
        />

        {/* New Releases */}
        <ContentRow
          title="New Releases"
          emoji="🎬"
          description="Fresh content just added"
          movies={newReleases}
          loading={loading}
        />

        {/* Recommended */}
        <ContentRow
          title="Recommended For You"
          emoji="❤️"
          description="Personalized picks based on your taste"
          movies={recommendedMovies}
          loading={loading}
        />

        {/* Genre Collections */}
        {!loading && (
          <>
            <ContentRow
              title="Action & Adventure"
              emoji="💥"
              description="High-octane thrills and epic adventures"
              movies={movies.filter(m => normalizeGenreList(m).some(g => g.toLowerCase().includes('action'))).slice(0, 8)}
            />
            <ContentRow
              title="Sci-Fi Worlds"
              emoji="🚀"
              description="Futuristic visions and mind-bending concepts"
              movies={movies.filter(m => normalizeGenreList(m).some(g => g.toLowerCase().includes('sci'))).slice(0, 8)}
            />
            <ContentRow
              title="Romance & Drama"
              emoji="💝"
              description="Heartfelt stories and emotional journeys"
              movies={movies.filter(m => normalizeGenreList(m).some(g => g.toLowerCase().includes('romance') || g.toLowerCase().includes('drama'))).slice(0, 8)}
            />

            <section className="py-8 animate-slideUp">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    <span className="text-3xl md:text-4xl mr-2">🌌</span>
                    <span className="gradient-text">Endless Discovery</span>
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base">Keep scrolling to uncover more movies automatically.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {feedMovies.map((movie) => (
                  <div key={`${movie._id || movie.id}-${movie.title}`}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              <div ref={sentinelRef} className="mt-6 flex justify-center py-4">
                {loadingMore ? (
                  <p className="text-sm text-sky-300">Loading more movies...</p>
                ) : hasMore ? (
                  <p className="text-sm text-gray-400">Scroll down for more</p>
                ) : (
                  <p className="text-sm text-gray-500">You&apos;ve reached the end of the catalog.</p>
                )}
              </div>
            </section>
          </>
        )}

        {loading && (
          <div className="py-8">
            <SkeletonLoader count={4} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;