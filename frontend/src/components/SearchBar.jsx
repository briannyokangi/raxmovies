import { useMemo, useState } from 'react';

const SearchBar = ({
  value = '',
  onChange = () => {},
  onSubmit = () => {},
  suggestions = [],
  onSuggestionSelect,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const term = String(value ?? '').trim().toLowerCase();
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

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange({ target: { value: transcript } });
      setShowSuggestions(true);
    };
    recognition.start();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="flex w-full items-center gap-2 rounded-xl border border-navy-800 bg-navy-900/80 px-4 py-3 shadow-glow-sky backdrop-blur-xl transition-all duration-300 hover:border-sky-400/60 hover:bg-navy-900 focus-within:border-sky-400 md:gap-3 md:px-5 md:py-4"
      >
        <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          placeholder="Search titles, genres, actors, or years..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 md:text-base"
        />
        
        {/* Voice Search Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`btn-icon shrink-0 ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-sky-400'}`}
          title="Voice search"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.2 0-4.2-.9-5.7-2.36M9 18.9c0 .58.45 1.06 1.05 1.09C10.92 20.22 11.44 20.29 12 20.29s1.08-.07 1.95-.2c.6-.03 1.05-.51 1.05-1.09v-2.3H9v2.3z"/>
          </svg>
        </button>

        <button type="submit" className="btn-primary text-sm shrink-0">
          Search
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-navy-800 bg-navy-950/95 backdrop-blur-sm shadow-2xl">
          {filteredSuggestions.map((item) => (
            <li key={`${item.type}-${item.label}`}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(item)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-navy-800"
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-xs uppercase tracking-wider text-sky-300">
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
