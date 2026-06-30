import { DollarSign, TrendingUp, TrendingDown, CreditCard, ExternalLink } from 'lucide-react'

const KPI = [
  { label: 'Monthly Revenue', value: '—', icon: DollarSign, color: '#4AAD8E', trend: null },
  { label: 'MRR', value: '—', icon: TrendingUp, color: '#C9A84C', trend: null },
  { label: 'Expenses', value: '—', icon: TrendingDown, color: '#E05555', trend: null },
  { label: 'Net Profit', value: '—', icon: CreditCard, color: '#4A9EE0', trend: null },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

export default function Finance() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
            Finance Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">Powered by Sage — The Strategist</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(74,173,142,0.15)', color: '#4AAD8E', border: '1px solid rgba(74,173,142,0.3)' }}>
          <ExternalLink size={14} />
          Connect Xero
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPI.map(card => (
          <div key={card.label} className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}20` }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-600">{card.label}</p>
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs text-gray-700 mt-2">Connect Xero to see live data</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart (placeholder bars) */}
      <div className="rounded-xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs tracking-widest uppercase text-gray-600">Revenue (6 months)</h3>
          <span className="text-xs text-gray-700">Awaiting Xero connection</span>
        </div>
        <div className="flex items-end gap-4 h-40">
          {MONTHS.map(month => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-sm"
                style={{ height: `${Math.random() * 60 + 10}%`, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)' }} />
              <p className="text-xs text-gray-700">{month}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 flex items-center gap-3 rounded-lg p-3"
          style={{ background: 'rgba(74,173,142,0.05)', border: '1px solid rgba(74,173,142,0.2)' }}>
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <p className="text-xs text-gray-500">Connect Xero to replace placeholder bars with real revenue data</p>
          <button className="ml-auto text-xs flex items-center gap-1" style={{ color: '#4AAD8E' }}>
            Connect now <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* Businesses breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {['Plumbing Co', 'Marketing', 'Investments'].map(biz => (
          <div key={biz} className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs tracking-widest uppercase text-gray-600 mb-4">{biz}</p>
            <div className="flex flex-col gap-2">
              {['Revenue', 'Expenses', 'Profit'].map(metric => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{metric}</span>
                  <span className="text-sm font-semibold text-gray-500">—</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
