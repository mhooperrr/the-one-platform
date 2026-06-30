import { X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AgentDetail({ agent, onClose }) {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div
        className="h-full w-full max-w-md flex flex-col overflow-y-auto"
        style={{ background: '#111111', borderLeft: `1px solid ${agent.color}40` }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-bold tracking-wide" style={{ color: agent.color }}>
            {agent.name} — {agent.title}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Portrait */}
        <div className="relative" style={{ height: 320 }}>
          <img src={agent.image} alt={agent.name}
            className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, #111111 0%, transparent 50%)' }} />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Role & tagline */}
          <div>
            <span className="text-xs tracking-widest uppercase text-gray-500">{agent.role}</span>
            <p className="text-gray-300 mt-2 leading-relaxed italic">"{agent.tagline}"</p>
          </div>

          {/* Stats */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Live Stats</p>
            <div className="grid grid-cols-3 gap-3">
              {agent.stats.map(stat => (
                <div key={stat.key} className="rounded-lg p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${agent.color}25` }}>
                  <p className="text-xl font-bold" style={{ color: agent.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-700 mt-3 text-center">
              Connect {agent.connector} to see live data
            </p>
          </div>

          {/* Connector badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500">{agent.connector} — not connected</span>
            <button className="ml-auto text-xs flex items-center gap-1"
              style={{ color: agent.color }}>
              Connect <ExternalLink size={10} />
            </button>
          </div>

          {/* Action */}
          <button
            onClick={() => {
              if (agent.id === 'rex') { onClose(); navigate('/mapper') }
            }}
            className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)`, color: '#000' }}>
            {agent.action}
          </button>
        </div>
      </div>
    </div>
  )
}
