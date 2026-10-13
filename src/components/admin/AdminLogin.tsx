import React, { useState } from 'react';
import { api, User } from '../../services/api';
import { GluckGifyLogo } from '../brand/GluckGifyLogo';

interface AdminLoginProps {
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@giftora.lk');
  const [password, setPassword] = useState('GiftoraAdmin2027!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      if (res.user.role !== 'admin' && res.user.role !== 'staff') {
        setError('Access denied: You do not have administrative privileges.');
        return;
      }
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@giftora.lk');
    setPassword('GiftoraAdmin2027!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2D2F]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E2E8D8] relative animate-scaleUp">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EAEFE5] text-[#4A5568] flex items-center justify-center hover:bg-[#DCE5D8] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex justify-center">
            <GluckGifyLogo size="md" glow={true} />
          </div>
          <span className="text-[11px] font-bold text-[#4CAF50] uppercase tracking-[0.2em] block">
            Command Center
          </span>
          <h2 className="font-serif text-[22px] text-[#2B2D2F] font-bold mt-1">
            GLÜCK GIFY Atelier Portal
          </h2>
          <p className="text-[12.5px] text-[#7A8276] mt-1">
            Sign in to manage Gify assets, accessories, custom maker requests, and inventory.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] border border-[#ffdad6]/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@giftora.lk"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[14px] text-[#221a19] focus:outline-none focus:ring-2 focus:ring-[#5e0b29]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#5e0b29] mb-1">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#dac0c4]/60 text-[14px] text-[#221a19] focus:outline-none focus:ring-2 focus:ring-[#5e0b29]"
            />
          </div>

          {/* Quick Credential Hint */}
          <div className="p-3 rounded-lg bg-[#fff0ef] border border-[#dac0c4]/40 flex items-center justify-between text-[11.5px]">
            <div>
              <span className="font-bold text-[#5e0b29] block">Verified Admin Credentials:</span>
              <span className="text-[#4A5568]">admin@giftora.lk / GiftoraAdmin2027!</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-2.5 py-1 rounded-lg bg-white text-[#2D6A4F] font-bold border border-[#E2E8D8] hover:bg-[#EAF5EC] cursor-pointer shadow-2xs"
            >
              Fill Demo
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#4A5568] hover:bg-[#EAEFE5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] text-white text-[13px] font-semibold hover:bg-[#3d9140] shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  <span>Enter Portal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
