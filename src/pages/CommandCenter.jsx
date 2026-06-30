import { useState } from 'react'
import { TrendingUp, Users, Mail, MessageSquare, DollarSign, ChevronRight } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import { AGENTS, BUSINESSES } from '../data/agents'

const KPI_CARDS = [
  { label: 'Total Leads', value: '—', sub: 'in pipeline', icon: Users, color: '#C9A84C' },
  { label: 'Emails Sent', value: '—', sub: 'this month', icon: Mail, color: '#9B7FD4' },
  { label: 'Open Rate', value: '—', sub: 'avg across campaigns', icon: TrendingUp, color: '#4A9EE0' },
  { label: 'Reply Rate', value: '—', sub: 'avg across campaigns', icon: MessageSquare, color: '#4AAD8E' },
  { label: 'Revenue', value: '—', sub: 'this month', icon: DollarSign, color: '#E05555' },
]

const ACTIVITY = [
  { text: 'Campaign "Upwork AI Sales Agent" created', time: '2h ago', color: '#C9A84C' },
  { text: 'App deployed to Base44', time: '3h ago', color: '#4AAD8E' },
  { text: 'Joe, Maya, Rex, Flux & Sage joined the crew', time: '4h ago', color: '#9B7FD4' },
]

export default function CommandCenter() {
  const [activeBiz, setActiveBiz] = useState('All Businesses')

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
            THE ONE
          </h1>
          <p className="text-gray-600 text-sm mt-1">Agentic Business Engine</p>
        </div>

        {/* Business switcher */}
        <div className="flex gap-2">
          {BUSINESSES.map(biz => (
            <button key={biz}
              onClick={() => setActiveBiz(biz)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={activeBiz === biz
                ? { background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)' }
                : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }
              }>
              {biz}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-5 gap-4">
        {KPI_CARDS.map(card => (
          <div key={card.label} className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}20` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-600">{card.label}</p>
              <card.icon size={14} style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs text-gray-700 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Agent Workflow */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest uppercase text-gray-600">The Crew — Click any agent</h2>
          <span className="text-xs text-gray-700">All agents active</span>
        </div>
        <div className="rounded-xl p-6 overflow-x-auto scrollbar-hide"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-0 min-w-max">
            {AGENTS.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} isLast={i === AGENTS.length - 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Activity + Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity */}
        <div className="col-span-2 rounded-xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-xs tracking-widest uppercase text-gray-600 mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <p className="text-sm text-gray-400 flex-1">{item.text}</p>
                <p className="text-xs text-gray-700 flex-shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-xs tracking-widest uppercase text-gray-600 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Launch Campaign', color: '#C9A84C' },
              { label: 'Add Lead', color: '#9B7FD4' },
              { label: 'Connect Xero', color: '#4AAD8E' },
              { label: 'Connect Gmail', color: '#4A9EE0' },
            ].map(action => (
              <button key={action.label}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
                style={{ color: action.color, border: `1px solid ${action.color}20` }}>
                {action.label}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
