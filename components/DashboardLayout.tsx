'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/types/news'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-bg text-ink flex">

      {/* Sidebar */}
      <aside className="w-[200px] flex-shrink-0 border-r border-faint flex flex-col sticky top-0 h-screen">

        {/* Brand */}
        <div className="px-5 py-4 border-b border-faint">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-accent">CRYPTO</div>
          <div className="text-[9px] font-mono tracking-[0.16em] text-muted uppercase">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map(item => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-[11px] tracking-[0.08em] border-l-2 transition-all ${
                  isActive
                    ? 'border-accent text-ink bg-[rgba(230,51,41,0.06)]'
                    : 'border-transparent text-muted hover:text-[#888] hover:border-border'
                }`}
              >
                <span className="text-[10px] w-4 text-center flex-shrink-0 font-mono">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-faint">
          <div className="text-[8px] font-mono text-muted tracking-[0.1em] uppercase">v1.0.0</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>

    </div>
  )
}
