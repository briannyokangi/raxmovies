import { useMemo, useState } from 'react';

const SearchBar = ({ value, onChange, onSubmit, suggestions = [], onSuggestionSelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) {
      return suggestions.slice(0, 6);
    }

    return suggestions.filter((item) => {
      const label = item.label?.toLowerCase() || '';
      const type = item.type?.toLowerCase() || '';
      return label.includes(term) || type.includes(term);
    }).slice(0, 6);
  }, [suggestions, value]);

  const handleSelect = (item) => {
    setShowSuggestions(false);
    onSuggestionSelect?.(item);
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={onSubmit}
        className="flex w-full items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 shadow-[0_12px_35px_rgba(2,8,23,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-sky-400/60 hover:bg-slate-900 md:gap-3 md:px-5 md:py-4"
      >
        <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 140)}
          placeholder="Search titles, genres, or years"
          className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500 md:text-base"
        />
        <button type="submit" className="shrink-0 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 md:px-5">
          Search
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/70">
          {filteredSuggestions.map((item) => (
            <li key={`${item.type}-${item.label}`}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(item)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-900"
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
                  {item.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
