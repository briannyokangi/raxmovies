import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      setMessage(res.data.message || 'Password updated successfully.');
      setTimeout(() => navigate('/profile'), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-slate-900/90 p-10 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-semibold text-white">Change Password</h1>
          <p className="mt-3 text-slate-400">Update your current password to keep your account secure.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-slate-400">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
                placeholder="Current password"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-slate-400">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
                placeholder="New password"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.25em] text-slate-400">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none"
                placeholder="Confirm new password"
              />
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
            {message && <p className="text-sm text-sky-300">{message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ChangePassword;
