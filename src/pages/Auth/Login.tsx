import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, TrendingUp, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react'

const perks = [
  'Manage members, loans & contributions',
  'Generate financial reports instantly',
  'Full audit trail & compliance tools',
  'Real-time notifications & reminders',
]

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    if (form.username && form.password) {
      navigate('/dashboard')
    } else {
      setError('Please enter your username and password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex font-sans">

      {/* ══════════ LEFT PANEL with background image ══════════ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col p-12 overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/sacco1.jpg"
            alt="SACCO community"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-slate-900/90 to-violet-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -left-16 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-16">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-900/50">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="font-extrabold text-white text-2xl tracking-tight">SaccoFlow</span>
        </div>

        {/* Main copy */}
        <div className="relative flex-1 flex flex-col justify-center max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-200 text-sm font-semibold mb-8 self-start">
            <Sparkles size={14} />
            Trusted by 500+ SACCOs
          </div>

          <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            The smarter way to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
              manage your SACCO
            </span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10">
            Digital tools built for SACCO administrators. Save time, reduce errors, and keep your members informed — all in one place.
          </p>

          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={15} className="text-emerald-400" />
                </div>
                <span className="text-base text-slate-200 font-medium">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom attribution */}
        <div className="relative flex items-center gap-3 pt-8 border-t border-white/10">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ring-2 ring-slate-900 ${
                  i === 1 ? 'bg-amber-400' : i === 2 ? 'bg-emerald-400' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>
          <p className="text-slate-400 text-sm">
            Join <span className="text-white font-bold">10,000+</span> happy members
          </p>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL — Form ══════════ */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white">
        <div className="w-full max-w-md mx-auto">

          {/* Back to home */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-base mb-12 transition-colors font-medium">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-2xl">SaccoFlow</span>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h1>
          <p className="text-lg text-slate-500 mb-10">Sign in to your SaccoFlow account</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-base font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 text-base text-slate-900 bg-white border-2 border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-150"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-bold text-slate-800">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3.5 pr-12 text-base text-slate-900 bg-white border-2 border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-150"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-base text-slate-700 font-medium">
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-lg font-bold py-4 rounded-xl transition-all duration-150 shadow-xl shadow-indigo-600/30 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in to dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">Demo credentials</p>
                <p className="text-sm text-slate-600 font-mono">admin / password123</p>
              </div>
            </div>
          </div>

          <p className="text-center text-base text-slate-500 mt-8">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-bold">
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
