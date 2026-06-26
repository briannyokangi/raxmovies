import { useEffect, useMemo, useRef, useState } from 'react';

const buildYoutubeEmbedUrl = (trailerUrl, autoplay) => {
  if (!trailerUrl) return '';

  if (trailerUrl.includes('youtube.com/watch')) {
    const url = new URL(trailerUrl);
    const videoId = url.searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&rel=0&modestbranding=1&controls=1`;
  }

  if (trailerUrl.includes('youtu.be/')) {
    const videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&rel=0&modestbranding=1&controls=1`;
  }

  if (trailerUrl.includes('youtube.com/embed/')) {
    return `${trailerUrl}${trailerUrl.includes('?') ? '&' : '?'}autoplay=${autoplay}`;
  }

  return trailerUrl;
};

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const embedUrl = useMemo(() => buildYoutubeEmbedUrl(trailerUrl, isPlaying ? 1 : 0), [trailerUrl, isPlaying]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFullscreen = () => {
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 px-3 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-5xl rounded-3xl border border-sky-500/20 bg-slate-900/95 p-3 shadow-2xl shadow-sky-950/60"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Trailer</p>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xl text-slate-200 transition hover:border-sky-400 hover:text-white"
            aria-label="Close trailer"
          >
            ×
          </button>
        </div>

        {trailerUrl ? (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
              <div className="aspect-video w-full">
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  title={`${title} trailer`}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
                >
                  Fullscreen
                </button>
              </div>
              <p className="text-sm text-slate-400">Playback controls work best on supported browsers.</p>
            </div>
          </>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-6 text-center text-slate-300">
            <p className="text-lg font-medium">Trailer coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
