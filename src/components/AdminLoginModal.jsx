import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, X, Sparkles, AlertCircle } from 'lucide-react';

// Salted SHA-256 target hash.
// Note: Plaintext username and password are NEVER stored in this file or anywhere in the bundle.
// Even if an attacker inspects DevTools/Sources, only this one-way irreversible cryptographic hash is visible.
const STUDIO_AUTH_SALT = "WithinArt_Faisalabad_2026_Secure_Studio_Key_#!";
const STUDIO_TARGET_HASH = "52a35e5ee277c7545c9763072fb45f4ec1519d493c804beabf4da90f4dc178c1";

export async function verifyStudioCredentials(username, password) {
  try {
    const combined = `${STUDIO_AUTH_SALT}:${username}:${password}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === STUDIO_TARGET_HASH;
  } catch (err) {
    console.error("Crypto verification failed:", err);
    return false;
  }
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // CRITICAL: We preserve all spaces in password, DO NOT trim password!
    const isValid = await verifyStudioCredentials(username.trim(), password);

    setIsLoading(false);

    if (isValid) {
      // Store session authentication so owner doesn't have to re-login on every tab switch
      try {
        sessionStorage.setItem('withinart_studio_session', 'authenticated');
      } catch (e) {
        // Fallback if sessionStorage is disabled
      }
      onSuccess();
    } else {
      setError('Invalid studio credentials. Please check your username and password.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Return to Gallery"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Studio Owner Atelier Access</span>
          </div>

          <h2 className="text-2xl font-cinzel font-bold text-slate-900">
            Withinarts Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Secure authentication for Faisalabad Art Studio management
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Studio Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Password</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm outline-none transition-all font-mono placeholder:text-slate-400"
              />
            </div>
            {password.endsWith(' ') && (
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                ✓ Trailing space detected & preserved
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Cryptographic Hash...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock Owner Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Return */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Gallery</span>
          </button>
          <span className="text-[11px] text-slate-400 font-mono">
            SHA-256 Protected
          </span>
        </div>
      </div>
    </div>
  );
}
