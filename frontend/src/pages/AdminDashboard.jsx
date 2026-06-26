import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const initialForm = {
  title: '',
  description: '',
  poster: '',
  trailer: '',
  genre: '',
  year: '',
  rating: 8,
  duration: '',
  cast: '',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState('');
  const navigate = useNavigate();

  const previewMovie = useMemo(() => {
    const genres = form.genre
      ? form.genre.split(',').map((item) => item.trim()).filter(Boolean)
      : ['Action'];
    const cast = form.cast
      ? form.cast.split(',').map((item) => item.trim()).filter(Boolean)
      : ['Lead actor'];

    return {
      title: form.title || 'New Movie Title',
      description: form.description || 'A cinematic experience will appear here as you craft your movie entry.',
      poster: form.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
      genre: genres,
      year: form.year || '2026',
      rating: form.rating || 8,
      duration: form.duration || '120',
      cast,
    };
  }, [form]);

  const loadAdminData = async () => {
    try {
      const [usersRes, reviewsRes, moviesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/reviews'),
        api.get('/admin/movies'),
      ]);
      setUsers(usersRes.data || []);
      setReviews(reviewsRes.data || []);
      setMovies(moviesRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('rax_token');
    const user = JSON.parse(localStorage.getItem('rax_user') || 'null');
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadAdminData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        rating: Number(form.rating),
        duration: Number(form.duration),
        cast: form.cast
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await api.post('/movies', payload);
      setMessage('Movie added successfully.');
      setForm(initialForm);
      await loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add movie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      await loadAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      await loadAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (movieId) => {
    if (!window.confirm('Delete this movie from the catalog?')) return;

    setIsDeleting(movieId);
    try {
      await api.delete(`/admin/movies/${movieId}`);
      setMessage('Movie removed successfully.');
      await loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not remove movie.');
    } finally {
      setIsDeleting('');
    }
  };

  const seedSampleMovies = async () => {
    try {
      setIsSeeding(true);
      setMessage('Seeding sample movies...');
      await api.post('/movies', {
        title: 'Nova Horizon',
        description: 'A daring astronaut crew races to save Earth from a collapsing moon gate in this visually stunning sci-fi adventure.',
        poster: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        genre: ['Sci-Fi', 'Adventure'],
        year: 2024,
        rating: 8.7,
        duration: 132,
        cast: ['Lia Chen', 'Jordan Vale', 'Noah Brooks'],
      });
      await api.post('/movies', {
        title: 'Midnight Harbor',
        description: 'A washed-up detective uncovers a conspiracy beneath the glittering lights of a rain-soaked harbor city.',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        genre: ['Thriller', 'Crime'],
        year: 2023,
        rating: 8.2,
        duration: 118,
        cast: ['Sage Walker', 'Milo Grant', 'Nina Flores'],
      });
      setMessage('Sample movies added successfully.');
      await loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not seed sample movies.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100">
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="mb-8 rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-navy-900 via-navy-900 to-slate-900/90 p-8 shadow-2xl shadow-black/40 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Studio Control</p>
              <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Movie Management Hub</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
                Add new titles, preview how they will appear, and remove any film from your catalog in seconds.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
              <div className="font-semibold">Catalog size</div>
              <div className="text-2xl font-bold text-white">{movies.length}</div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
            {message}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-sky-400/20 bg-navy-900/80 p-6 shadow-2xl shadow-black/30 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Add a new movie</h2>
                  <p className="mt-1 text-sm text-slate-400">Fill the details and publish the movie instantly.</p>
                </div>
                <button
                  type="button"
                  onClick={seedSampleMovies}
                  disabled={isSeeding}
                  className="rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSeeding ? 'Seeding...' : 'Seed sample'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: 'Title', name: 'title' },
                    { label: 'Genre', name: 'genre', placeholder: 'Action, Drama' },
                    { label: 'Year', name: 'year', type: 'number', placeholder: '2026' },
                    { label: 'Rating', name: 'rating', type: 'number', placeholder: '8.7' },
                    { label: 'Duration', name: 'duration', placeholder: '120' },
                    { label: 'Poster URL', name: 'poster', placeholder: 'https://...' },
                    { label: 'Trailer URL', name: 'trailer', placeholder: 'https://...' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="mb-2 block text-sm text-slate-300">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ''}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-sky-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Tell audiences what makes this movie special"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Cast (comma separated)</label>
                  <input
                    name="cast"
                    value={form.cast}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="Actor One, Actor Two"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish movie'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(initialForm)}
                    className="rounded-full border border-slate-700 bg-slate-950/70 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    Reset form
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] border border-sky-400/20 bg-navy-900/80 p-6 shadow-2xl shadow-black/30 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Movie library</h2>
                  <p className="mt-1 text-sm text-slate-400">Manage the current catalog quickly.</p>
                </div>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-300">{movies.length} titles</span>
              </div>

              <div className="mt-6 space-y-3">
                {movies.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                    No movies are in the library yet.
                  </div>
                ) : (
                  movies.map((movie) => (
                    <div key={movie._id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.poster || previewMovie.poster}
                          alt={movie.title}
                          className="h-16 w-12 rounded-lg object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'; }}
                        />
                        <div>
                          <p className="font-semibold text-white">{movie.title}</p>
                          <p className="text-sm text-slate-400">
                            {(Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre) || 'General'} • {movie.year}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMovie(movie._id)}
                        disabled={isDeleting === movie._id}
                        className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDeleting === movie._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-sky-400/20 bg-navy-900/80 p-6 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">Live preview</h2>
              <p className="mt-1 text-sm text-slate-400">See how the movie card will look before publishing.</p>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/80">
                <img src={previewMovie.poster} alt={previewMovie.title} className="h-56 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{previewMovie.title}</h3>
                    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
                      ⭐ {previewMovie.rating}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-3">{previewMovie.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-slate-800 px-2.5 py-1">{previewMovie.year}</span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-1">{previewMovie.duration} min</span>
                    {previewMovie.genre.map((genre) => (
                      <span key={genre} className="rounded-full bg-slate-800 px-2.5 py-1">{genre}</span>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-slate-500">Cast: {previewMovie.cast.join(', ')}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-400/20 bg-navy-900/80 p-6 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white">Users & reviews</h2>
              <div className="mt-6 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-400">No reviews to moderate yet.</p>
                ) : (
                  reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="rounded-2xl bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{review.userId?.username || 'User'}</p>
                        <button onClick={() => deleteReview(review._id)} className="text-sm text-rose-300 hover:text-rose-200">Remove</button>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-3">
                {users.length === 0 ? (
                  <p className="text-sm text-slate-400">No users found.</p>
                ) : (
                  users.slice(0, 3).map((user) => (
                    <div key={user._id} className="flex items-center justify-between rounded-2xl bg-slate-950/60 p-3">
                      <div>
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
