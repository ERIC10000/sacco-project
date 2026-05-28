import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer whenever the user navigates
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ─── Sidebar: sticky pane on lg+, slide-in drawer on mobile ── */}
      <Sidebar
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* ─── Mobile backdrop (only visible when drawer is open) ──── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* ─── Main area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
