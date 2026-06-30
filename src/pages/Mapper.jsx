import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, Building, Globe, Phone, AlertCircle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const COLOR = '#3DBE7A'

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 13, { duration: 1.2 }) }, [center])
  return null
}

export default function Mapper() {
  const [city, setCity] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const [selected, setSelected] = useState(null)

  async function scanCity() {
    const q = city.trim()
    if (!q || scanning) return
    setScanning(true)
    setError(null)
    setResults(null)
    setSelected(null)

    try {
      const res = await fetch(`/api/scan?city=${encodeURIComponent(q)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Scan failed — try again')
        return
      }

      setScanCount(c => c + 1)
      setResults(data)
    } catch (err) {
      setError(`Scan error: ${err.message}`)
    } finally {
      setScanning(false)
    }
  }

  function selectBusiness(biz) {
    setSelected(biz.id)
    const el = document.getElementById(`biz-${biz.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 flex flex-col gap-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: COLOR }}>
              Rex — The Mapper
            </h1>
            <p className="text-gray-600 text-xs mt-0.5">Local businesses with no online presence</p>
          </div>
          {scanCount > 0 && results && (
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-lg font-bold" style={{ color: COLOR }}>{scanCount}</p>
                <p className="text-xs text-gray-700">Scanned</p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: COLOR }}>{results.businesses.length}</p>
                <p className="text-xs text-gray-700">Found</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR }} />
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scanCity()}
              placeholder="Nashville, TN · Austin, TX · Denver, CO"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-700 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLOR}40` }}
            />
          </div>
          <button
            onClick={scanCity}
            disabled={scanning || !city.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${COLOR}, #2a8a57)`, color: '#000' }}
          >
            <Search size={13} />
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.2)' }}>
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Map + List */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          {scanning && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(10,10,10,0.7)' }}>
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: `${COLOR}30`, borderTopColor: COLOR }} />
              <p className="text-gray-400 text-sm">Rex is scanning the streets...</p>
            </div>
          )}
          <MapContainer
            center={results?.center || [39.5, -98.35]}
            zoom={results ? 13 : 4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
            {results?.center && <FlyTo center={results.center} />}
            {results?.businesses.map(biz => (
              <Marker
                key={biz.id}
                position={[biz.lat, biz.lon]}
                icon={greenIcon}
                eventHandlers={{ click: () => selectBusiness(biz) }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ fontWeight: 700, marginBottom: 2 }}>{biz.name}</p>
                    <p style={{ color: '#888', fontSize: 12, textTransform: 'capitalize' }}>{biz.type.replace(/_/g, ' ')}</p>
                    {biz.street && <p style={{ color: '#888', fontSize: 12 }}>{biz.street}</p>}
                    {biz.phone && <p style={{ color: '#888', fontSize: 12 }}>{biz.phone}</p>}
                    <p style={{ color: '#e05555', fontSize: 12, marginTop: 4 }}>No website</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {results && (
          <div className="w-80 flex-shrink-0 overflow-y-auto flex flex-col"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#0d0d0d' }}>
            <div className="px-4 py-3 sticky top-0 z-10"
              style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs tracking-widest uppercase text-gray-600">
                {results.businesses.length} businesses · no website
              </p>
              <p className="text-xs text-gray-700 mt-0.5">{results.cityLabel}</p>
            </div>

            {results.businesses.length === 0 && (
              <p className="text-gray-600 text-sm p-6 text-center">No results — try a larger city.</p>
            )}

            <div className="flex flex-col divide-y divide-white/[0.04]">
              {results.businesses.map(biz => (
                <div
                  id={`biz-${biz.id}`}
                  key={biz.id}
                  onClick={() => selectBusiness(biz)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{
                    background: selected === biz.id ? `${COLOR}10` : 'transparent',
                    borderLeft: selected === biz.id ? `2px solid ${COLOR}` : '2px solid transparent',
                  }}
                >
                  <Building size={13} className="flex-shrink-0 mt-0.5" style={{ color: COLOR }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{biz.name}</p>
                    <p className="text-xs text-gray-600 capitalize mt-0.5">{biz.type.replace(/_/g, ' ')}</p>
                    {biz.street && <p className="text-xs text-gray-700 mt-0.5">{biz.street}</p>}
                    {biz.phone && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <Phone size={10} />{biz.phone}
                      </p>
                    )}
                  </div>
                  <Globe size={11} className="flex-shrink-0 mt-1" style={{ color: '#e05555' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
