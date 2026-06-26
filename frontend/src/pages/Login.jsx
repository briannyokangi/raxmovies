import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('rax_token', res.data.token);
      localStorage.setItem('rax_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-slate-900/90 p-10 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-semibold text-white">Welcome back</h1>
          <p className="mt-3 text-slate-400">Log in to manage your profile, favorites, and reviews.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-sm uppercase tracking-[0.25em] text-slate-400">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.25em] text-slate-400">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
              />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" className="w-full rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-400">Login</button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-400">
            <p>
              Forgot your password?{' '}
              <Link to="/forgot-password" className="text-sky-300 hover:text-white">
                Reset it here.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
