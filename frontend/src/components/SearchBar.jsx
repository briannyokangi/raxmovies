const SearchBar = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex w-full max-w-2xl items-center gap-3 rounded-full bg-slate-900/80 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-sm">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search movies, genres, cast..."
      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
    />
    <button type="submit" className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">
      Search
    </button>
  </form>
);

export default SearchBar;
