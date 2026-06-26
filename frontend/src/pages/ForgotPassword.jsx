import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    setResetLink('');

    try {
      const res = await authAPI.forgotPassword({ email });
      setMessage(res.data.message || 'If that email exists, a reset link has been sent.');
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-slate-900/90 p-10 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-semibold text-white">Forgot Password</h1>
          <p className="mt-3 text-slate-400">Enter your email and we’ll send a password reset link.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
                placeholder="you@example.com"
              />
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
            {message && <p className="text-sm text-sky-300">{message}</p>}
            {resetLink && (
              <p className="mt-2 text-sm text-slate-300 break-words">
                <span className="font-semibold text-slate-100">Reset URL:</span>{' '}
                <a href={resetLink} className="text-sky-300 underline" target="_blank" rel="noreferrer">
                  {resetLink}
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link to="/login" className="text-sky-300 hover:text-white">
              Back to login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
