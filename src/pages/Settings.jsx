import { ExternalLink, Check, AlertCircle } from 'lucide-react'

const CONNECTORS = [
  { name: 'Instantly', desc: 'Cold email campaigns & lead outreach', status: 'connected', color: '#C9A84C', agent: 'Joe' },
  { name: 'Gmail', desc: 'Inbox management & nurture replies', status: 'disconnected', color: '#9B7FD4', agent: 'Maya' },
  { name: 'Xero', desc: 'Financial data & accounting', status: 'disconnected', color: '#4AAD8E', agent: 'Sage' },
  { name: 'n8n', desc: 'Workflow automation backbone', status: 'disconnected', color: '#4A9EE0', agent: 'Flux' },
  { name: 'Google Calendar', desc: 'Scheduling & appointments', status: 'disconnected', color: '#E05555', agent: 'Rex' },
  { name: 'moomoo', desc: 'Investment portfolio & trading', status: 'disconnected', color: '#4AAD8E', agent: 'Sage' },
  { name: 'Shopify', desc: 'E-commerce store management', status: 'disconnected', color: '#9B7FD4', agent: 'Flux' },
  { name: 'Google Drive', desc: 'Document storage & sharing', status: 'disconnected', color: '#C9A84C', agent: 'Maya' },
]

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
          Connectors
        </h1>
        <p className="text-gray-600 text-sm mt-1">Wire your tools into the crew</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CONNECTORS.map(c => (
          <div key={c.name} className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${c.status === 'connected' ? c.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
              <span className="text-lg font-bold" style={{ color: c.color }}>{c.name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-200">{c.name}</p>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${c.color}15`, color: c.color }}>
                  {c.agent}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{c.desc}</p>
            </div>
            {c.status === 'connected' ? (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4AAD8E' }}>
                <Check size={12} /> Live
              </div>
            ) : (
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>
                Connect <ExternalLink size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
