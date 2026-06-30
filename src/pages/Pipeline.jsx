import { Plus, Search } from 'lucide-react'

const COLUMNS = [
  { id: 'new', label: 'New Lead', agent: 'Joe', color: '#C9A84C', leads: [] },
  { id: 'contacted', label: 'Contacted', agent: 'Joe', color: '#C9A84C', leads: [] },
  { id: 'nurturing', label: 'Nurturing', agent: 'Maya', color: '#9B7FD4', leads: [] },
  { id: 'proposal', label: 'Proposal', agent: 'Rex', color: '#E05555', leads: [] },
  { id: 'won', label: 'Closed Won', agent: 'Rex', color: '#4AAD8E', leads: [] },
  { id: 'lost', label: 'Closed Lost', agent: 'Rex', color: '#666', leads: [] },
]

export default function Pipeline() {
  return (
    <div className="flex flex-col gap-6 p-8 h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
            CRM Pipeline
          </h1>
          <p className="text-gray-600 text-sm mt-1">Joe → Maya → Rex workflow</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-gray-600" />
            <input placeholder="Search leads..." className="bg-transparent text-sm text-gray-400 outline-none w-40"
              style={{ fontFamily: 'inherit' }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #876A1A)', color: '#000' }}>
            <Plus size={14} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide flex-1 pb-4">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-shrink-0 flex flex-col rounded-xl"
            style={{ width: 220, background: 'rgba(255,255,255,0.02)', border: `1px solid ${col.color}20` }}>
            {/* Column header */}
            <div className="flex items-center justify-between p-3"
              style={{ borderBottom: `1px solid ${col.color}20` }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</p>
                <p className="text-xs text-gray-700 mt-0.5">via {col.agent}</p>
              </div>
              <span className="text-xs text-gray-700 bg-white/5 px-2 py-0.5 rounded-full">
                {col.leads.length}
              </span>
            </div>

            {/* Lead cards */}
            <div className="flex-1 p-3 flex flex-col gap-2 min-h-32">
              {col.leads.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <p className="text-xs text-gray-700">No leads here yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state banner */}
      <div className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.15)' }}>
          <span className="text-sm">⚡</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>
            1 Campaign Ready — "AI SDR Upwork Sales Agent"
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Activate the campaign in Instantly to start filling this pipeline with real leads
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #876A1A)', color: '#000' }}>
          Launch Campaign
        </button>
      </div>
    </div>
  )
}
