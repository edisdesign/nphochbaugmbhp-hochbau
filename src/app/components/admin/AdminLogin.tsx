import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { checkPassword, setAuth } from '@/app/lib/dataStore';

import logoWhite from '@/assets/bc2e48b7921d8873d5b86d52150de03fe4507903.png';

export function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (checkPassword(password)) {
        setAuth();
        navigate('/admin/dashboard');
      } else {
        setError('Pogrešna šifra.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden font-['Inter']">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#F4B400]/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazad
        </motion.button>

        <div className="bg-[#111111] border border-white/[0.06] rounded-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logoWhite} alt="NP Hochbau" className="h-10 w-auto mb-4 opacity-80" />
            <span className="text-white/20 text-[10px] uppercase tracking-[0.25em]">Admin</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">
                Šifra
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full bg-[#0A0A0A] border border-white/[0.08] rounded-sm px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#F4B400]/50 transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#F4B400] text-black py-3.5 rounded-sm uppercase tracking-widest text-xs font-semibold hover:bg-[#F4B400]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Pristupi
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
