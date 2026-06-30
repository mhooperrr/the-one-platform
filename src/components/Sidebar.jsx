import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Settings, Zap, Map } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/pipeline', icon: Users, label: 'Pipeline' },
  { to: '/mapper', icon: Map, label: 'City Mapper' },
  { to: '/finance', icon: BarChart3, label: 'Finance' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 gap-8 z-50"
      style={{ background: '#111111', borderRight: '1px solid rgba(201,168,76,0.15)' }}>
      {/* Logo */}
      <div className="flex items-center justify-center w-9 h-9 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #C9A84C, #876A1A)' }}>
        <Zap size={18} className="text-black" fill="black" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gold-500/20 text-gold-500'
                  : 'text-gray-600 hover:text-gold-400 hover:bg-white/5'
              }`
            }>
            <Icon size={18} />
            {/* Tooltip */}
            <span className="absolute left-14 bg-dark-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
