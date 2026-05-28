import { Link } from 'react-router-dom'
import {
  ArrowRight, Users, CreditCard, PiggyBank, BarChart3,
  Bell, ShieldCheck, TrendingUp, CheckCircle, Star, Quote,
  Sparkles, Zap, Globe,
} from 'lucide-react'

const features = [
  { icon: Users,       title: 'Member Management',     desc: 'Register, verify and manage every SACCO member in one place. Track status, history and contributions.',     color: 'bg-violet-100 text-violet-700' },
  { icon: CreditCard,  title: 'Loan Processing',       desc: 'Streamline loan applications, approvals, disbursements and repayments — end-to-end automation.',             color: 'bg-blue-100 text-blue-700' },
  { icon: PiggyBank,   title: 'Contribution Tracking', desc: 'Record and monitor member contributions with automatic reconciliation and instant receipt generation.',      color: 'bg-emerald-100 text-emerald-700' },
  { icon: BarChart3,   title: 'Financial Reports',     desc: 'Generate monthly, quarterly and annual reports. Export to PDF or Excel with a single click.',                color: 'bg-amber-100 text-amber-700' },
  { icon: Bell,        title: 'Smart Notifications',   desc: 'Automated SMS and email reminders for contributions, loan repayments and important announcements.',          color: 'bg-rose-100 text-rose-700' },
  { icon: ShieldCheck, title: 'Audit & Compliance',    desc: 'Full audit trail on every action. Know exactly who did what, when — for total accountability.',              color: 'bg-teal-100 text-teal-700' },
]

const stats = [
  { value: '10,000+', label: 'Active Members' },
  { value: 'KES 50M+', label: 'Contributions Tracked' },
  { value: '3,200+',  label: 'Loans Processed' },
  { value: '99.9%',   label: 'System Uptime' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ═══════════ NAV ═══════════ */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-2xl tracking-tight">SaccoFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'How it works', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 text-base text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-base font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl px-5 py-3 shadow-lg shadow-indigo-600/30 transition-all duration-150 active:scale-95">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8">
                <Sparkles size={14} />
                Trusted by 500+ SACCOs across Kenya
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-7">
                The modern way to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  run your SACCO
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                Replace spreadsheets and manual ledgers with a powerful digital platform. Manage members, process loans, track contributions, and generate reports — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl px-8 py-4 shadow-xl shadow-indigo-600/30 transition-all duration-150 active:scale-95">
                  Start free trial <ArrowRight size={20} />
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-lg font-bold rounded-xl px-8 py-4 border-2 border-slate-200 transition-all duration-150">
                  Watch demo
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {['No credit card required', 'Free onboarding', '14-day free trial'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-600 text-base font-medium">
                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero image with floating cards */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200/40 to-violet-200/40 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/80">
                <img
                  src="/images/sacco1.jpg"
                  alt="SACCO members meeting in community circle"
                  className="w-full h-[540px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>

              {/* Floating stat card 1 */}
              <div className="absolute -left-6 top-12 bg-white rounded-2xl shadow-2xl p-5 ring-1 ring-slate-100 max-w-[230px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">+24%</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">vs last quarter</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-semibold">Member growth this year</p>
              </div>

              {/* Floating stat card 2 */}
              <div className="absolute -right-4 bottom-10 bg-white rounded-2xl shadow-2xl p-5 ring-1 ring-slate-100 max-w-[250px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <PiggyBank size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">KES 4.2M</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">this month</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-semibold">Total contributions</p>
              </div>

              {/* Floating "Live" badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg ring-1 ring-white/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-800">Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAND ═══════════ */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl lg:text-5xl font-extrabold text-white mb-2">{s.value}</p>
              <p className="text-base text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DIGITAL FIRST (sacco2) ═══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl -rotate-2" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
              <img
                src="/images/sacco2.jpg"
                alt="Financial dashboard on a laptop"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
                  <Zap size={26} />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 leading-none">Real-time</p>
                  <p className="text-base text-slate-600 font-medium mt-1">Financial insights</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-indigo-600 text-base font-bold uppercase tracking-widest mb-4">Digital first</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Every transaction recorded, reconciled and reflected — instantly.
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              From the moment a member contributes to the second a loan is disbursed, your dashboard updates in real-time. No more spreadsheets, no more chasing receipts.
            </p>
            <ul className="space-y-4">
              {[
                'Live financial summaries updated every second',
                'Drill down into any member or transaction',
                'Export reports to PDF or Excel in one click',
                'Mobile-friendly — access from anywhere',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-lg text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-indigo-600 text-base font-bold uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
              Everything a modern SACCO needs
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Built specifically for cooperatives in East Africa — from member registration to financial reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-200">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ EMPOWER MEMBERS (sacco4) ═══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="order-2 lg:order-1">
            <p className="text-indigo-600 text-base font-bold uppercase tracking-widest mb-4">For your members</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Empower every member with self-service tools
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              Members can check their savings, apply for loans, view repayment schedules, and download statements anytime — without a single phone call to the office.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="border-l-4 border-indigo-500 pl-5">
                <p className="text-5xl font-extrabold text-slate-900 mb-1">85%</p>
                <p className="text-base text-slate-600 font-medium">Fewer support calls</p>
              </div>
              <div className="border-l-4 border-violet-500 pl-5">
                <p className="text-5xl font-extrabold text-slate-900 mb-1">3x</p>
                <p className="text-base text-slate-600 font-medium">Faster loan approval</p>
              </div>
            </div>

            <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-xl px-8 py-4 transition-all duration-150 active:scale-95">
              Get started <ArrowRight size={20} />
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 rounded-3xl rotate-3" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
              <img
                src="/images/sacco4.jpg"
                alt="Happy SACCO member with savings"
                className="w-full h-[600px] object-contain"
              />
            </div>
            <div className="absolute -left-6 bottom-12 bg-white rounded-2xl shadow-2xl p-5 ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Globe size={22} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900 leading-none">24 / 7</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">Member access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ACCOUNTABILITY (sacco3) ═══════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/sacco3.jpg" alt="Coins and savings" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-indigo-400 text-base font-bold uppercase tracking-widest mb-4">Total accountability</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Every shilling tracked, verified, and accounted for.
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Bank-grade audit trails on every transaction. Know exactly who did what, when, and from where — for total transparency with your members and regulators.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: '100%', label: 'Audit coverage' },
                { value: '24/7',  label: 'Live monitoring' },
                { value: 'Bank',  label: 'Grade security' },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-indigo-500 pl-4">
                  <p className="text-3xl lg:text-4xl font-extrabold text-white mb-1">{item.value}</p>
                  <p className="text-sm text-slate-400 font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            <Link to="/login" className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 text-lg font-bold rounded-xl px-8 py-4 shadow-xl transition-all duration-150 active:scale-95">
              See it in action <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-indigo-600 text-base font-bold uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            Up and running in minutes
          </h2>
          <p className="text-xl text-slate-600">No IT team required. We'll guide you every step.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create your SACCO', desc: 'Sign up and configure your organization details, contribution rules, and loan policies.' },
            { step: '02', title: 'Import members',    desc: 'Bulk import existing members from a spreadsheet or add them one by one with ease.' },
            { step: '03', title: 'Go live',           desc: 'Start recording contributions, processing loans, and generating reports immediately.' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white p-8 pt-12 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-200">
              <span className="absolute -top-7 left-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-lg font-extrabold shadow-xl shadow-indigo-600/40">
                {item.step}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ TESTIMONIAL ═══════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote size={52} className="mx-auto text-indigo-300 mb-8" />
          <p className="text-2xl lg:text-3xl text-slate-800 font-medium leading-relaxed mb-10">
            "SaccoFlow has completely transformed how we run our cooperative. What used to take days now takes minutes. Our members trust us more because everything is transparent."
          </p>
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-lg font-bold text-slate-900">Margaret Wanjiru</p>
          <p className="text-base text-slate-600">Chairperson, Umoja SACCO — Nakuru</p>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to digitize your SACCO?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 500+ SACCOs already saving time, reducing errors, and growing faster with SaccoFlow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-2xl">
                Start your free trial <ArrowRight size={20} />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg border border-white/20 backdrop-blur-sm">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg">SaccoFlow</span>
            </div>
            <p className="text-base text-slate-500">© 2026 SaccoFlow. Built for SACCO operators in East Africa.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-base text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
