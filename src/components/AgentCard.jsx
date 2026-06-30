import { useState } from 'react'
import AgentDetail from './AgentDetail'

export default function AgentCard({ agent, isLast }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Card */}
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex-shrink-0"
          style={{
            width: 160,
            border: `1px solid ${agent.color}40`,
            background: 'rgba(255,255,255,0.03)',
            boxShadow: `0 0 20px ${agent.color}15`,
          }}
        >
          {/* Portrait */}
          <div className="relative" style={{ height: 200 }}>
            <img
              src={agent.image}
              alt={agent.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Status dot */}
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-400"
              style={{ boxShadow: '0 0 6px #4ade80' }} />
          </div>

          {/* Info */}
          <div className="p-3" style={{ borderTop: `1px solid ${agent.color}30` }}>
            <p className="font-bold text-sm tracking-wide" style={{ color: agent.color }}>
              {agent.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{agent.title}</p>
          </div>
        </div>

        {/* Arrow connector */}
        {!isLast && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="h-px w-6" style={{ background: 'rgba(201,168,76,0.4)' }} />
            <div className="w-0 h-0"
              style={{
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '7px solid rgba(201,168,76,0.5)',
              }} />
          </div>
        )}
      </div>

      {open && <AgentDetail agent={agent} onClose={() => setOpen(false)} />}
    </>
  )
}
