import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ContentRow = ({ title, movies, loading, onNext, onPrev }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-6 md:py-8">
      <h2 className="px-4 mb-4 text-xl md:text-2xl font-bold text-white">
        {title}
      </h2>

      {loading ? (
        <div className="px-4 space-y-4">
          <div className="h-6 bg-slate-800 rounded-lg w-32 animate-pulse" />
          <div className="flex gap-3 overflow-x-hidden pb-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-32 h-48 rounded-lg bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="relative group px-4">
          {/* Left scroll button */}
          {showLeftButton && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/3 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/70 text-white transition hover:bg-rose-500 group-hover:opacity-100 opacity-0"
              aria-label="Scroll left"
            >
              ‹
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {movies.map((movie) => {
              const id = movie.id || movie._id;
              const poster = movie.posterUrl || movie.poster;
              const title = movie.title;
              const rating = movie.vote_average || movie.rating;

              return (
                <Link
                  key={id}
                  to={`/movies/${id}`}
                  className="relative flex-shrink-0 w-32 md:w-40 h-48 md:h-60 group/item rounded-lg overflow-hidden bg-slate-800 transition transform hover:scale-105 hover:z-20"
                >
                  {poster && (
                    <img
                      src={poster}
                      alt={title}
                      className="w-full h-full object-cover brightness-90 group-hover/item:brightness-110 transition duration-300"
                    />
                  )}

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/item:bg-black/40 transition duration-300">
                    <div className="text-4xl md:text-5xl text-white opacity-0 group-hover/item:opacity-100 transition duration-300 transform scale-75 group-hover/item:scale-100">
                      ▶
                    </div>
                  </div>

                  {/* Rating badge */}
                  {rating && (
                    <div className="absolute top-2 right-2 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-amber-300">
                      {Number(rating).toFixed(1)}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                    <p className="text-xs md:text-sm font-semibold text-white line-clamp-2">
                      {title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right scroll button */}
          {showRightButton && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/3 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/70 text-white transition hover:bg-rose-500 group-hover:opacity-100 opacity-0"
              aria-label="Scroll right"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-slate-400">
          No content available
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ContentRow;
