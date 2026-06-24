import { useEffect, useState } from 'react';
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
  cast: ''
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    try {
      const [usersRes, reviewsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/reviews')
      ]);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

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
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        rating: Number(form.rating),
        cast: form.cast.split(',').map((item) => item.trim()).filter(Boolean)
      };
      await api.post('/movies', payload);
      setMessage('Movie added successfully.');
      setForm(initialForm);
      loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add movie.');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      loadAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      loadAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-3 text-slate-400">Manage movies, users, and reviews from one control center.</p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
              <h2 className="text-3xl font-semibold text-white">Upload new movie</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: 'Title', name: 'title' },
                    { label: 'Genre', name: 'genre' },
                    { label: 'Year', name: 'year', type: 'number' },
                    { label: 'Rating', name: 'rating', type: 'number' },
                    { label: 'Duration', name: 'duration' },
                    { label: 'Poster URL', name: 'poster' },
                    { label: 'Trailer URL', name: 'trailer' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm text-slate-300">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-slate-300">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">Cast (comma separated)</label>
                  <input
                    name="cast"
                    value={form.cast}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                </div>

                {message && <p className="text-sm text-rose-300">{message}</p>}
                <button className="rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-400">Add movie</button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
              <h2 className="text-3xl font-semibold text-white">Review moderation</h2>
              <div className="mt-6 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-slate-400">No reviews to moderate yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{review.userId.username}</p>
                          <p className="text-sm text-slate-400">{review.movieId.title}</p>
                        </div>
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="mt-3 text-slate-400">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-10">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
              <h2 className="text-3xl font-semibold text-white">User management</h2>
              <div className="mt-6 space-y-4">
                {users.length === 0 ? (
                  <p className="text-slate-400">No users found.</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between rounded-3xl bg-slate-950/80 p-4 text-slate-200">
                      <div>
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="rounded-full bg-slate-800 px-4 py-2 text-slate-100 outline-none"
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
