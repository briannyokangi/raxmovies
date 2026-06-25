const SearchBar = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="flex w-full max-w-2xl items-center gap-2 md:gap-3 rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 md:py-4 shadow-lg shadow-black/30 backdrop-blur-md hover:border-slate-600 hover:bg-slate-900/80 transition-all duration-300 group"
  >
    <svg
      className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search movies, genres, cast..."
      className="w-full bg-transparent text-sm md:text-base text-slate-100 outline-none placeholder:text-slate-500 placeholder:group-focus-within:text-slate-400 transition"
    />
    <button
      type="submit"
      className="px-4 md:px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-sm md:text-base font-semibold text-white transition-all duration-300 hover:from-rose-600 hover:to-pink-600 active:scale-95 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 whitespace-nowrap"
    >
      Search
    </button>
  </form>
);

export default SearchBar;
