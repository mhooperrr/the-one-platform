import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CommandCenter from './pages/CommandCenter'
import Pipeline from './pages/Pipeline'
import Finance from './pages/Finance'
import Settings from './pages/Settings'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
        <Sidebar />
        <main className="flex-1 ml-16 min-h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
