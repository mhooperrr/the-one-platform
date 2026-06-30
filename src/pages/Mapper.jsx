import { useState } from 'react'
import { MapPin, Search, Building, Globe, Phone, AlertCircle } from 'lucide-react'

const COLOR = '#3DBE7A'

export default function Mapper() {
  const [city, setCity] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [scanCount, setScanCount] = useState(0)

  async function scanCity() {
    const q = city.trim()
    if (!q || scanning) return
    setScanning(true)
    setError(null)
    setResults(null)

    try {
      // Geocode city → bounding box
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'TheONEPlatform/1.0' } }
      )
      const geoData = await geoRes.json()

      if (!geoData.length) {
        setError(`"${q}" not found. Try a full city name like "Nashville, TN".`)
        return
      }

      const { boundingbox, display_name } = geoData[0]
      const [s, n, w, e] = boundingbox // south, north, west, east

      // Overpass: businesses with name but no website
      const overpassQuery = `
[out:json][timeout:30];
(
  node["name"][!"website"]["shop"](${s},${w},${n},${e});
  node["name"][!"website"]["amenity"](${s},${w},${n},${e});
  node["name"][!"website"]["office"](${s},${w},${n},${e});
  node["name"][!"website"]["craft"](${s},${w},${n},${e});
);
out body 300;
      `.trim()

      const ovRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
      })
      const ovData = await ovRes.json()

      const businesses = (ovData.elements || [])
        .filter(el => el.tags?.name)
        .map(el => ({
          id: el.id,
          name: el.tags.name,
          type: el.tags.shop || el.tags.amenity || el.tags.office || el.tags.craft || 'business',
          street: el.tags['addr:street'] || null,
          phone: el.tags.phone || el.tags['contact:phone'] || null,
          email: el.tags.email || el.tags['contact:email'] || null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      setScanCount(c => c + 1)
      setResults({
        cityLabel: display_name.split(',').slice(0, 2).join(','),
        businesses,
      })
    } catch {
      setError('Scan failed — Overpass may be busy. Try again in a moment.')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: COLOR }}>
            Rex — The Mapper
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Scan any city for local businesses with no website
          </p>
        </div>
        {scanCount > 0 && (
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-lg font-bold" style={{ color: COLOR }}>{scanCount}</p>
              <p className="text-xs text-gray-700">Cities Scanned</p>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: COLOR }}>
                {results?.businesses.length ?? '—'}
              </p>
              <p className="text-xs text-gray-700">Found</p>
            </div>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR }} />
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && scanCity()}
            placeholder="Nashville, TN · Austin, TX · Denver, CO"
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-700 outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${COLOR}40`,
            }}
          />
        </div>
        <button
          onClick={scanCity}
          disabled={scanning || !city.trim()}
          className="px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${COLOR}, #2a8a57)`, color: '#000' }}
        >
          <Search size={14} />
          {scanning ? 'Scanning...' : 'Scan City'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl p-4"
          style={{ background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.2)' }}>
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {scanning && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: `${COLOR}30`, borderTopColor: COLOR }} />
          <p className="text-gray-500 text-sm">Rex is scanning the streets...</p>
        </div>
      )}

      {/* Results */}
      {results && !scanning && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase text-gray-600">
              {results.businesses.length} businesses · no website
            </p>
            <p className="text-xs text-gray-700">{results.cityLabel}</p>
          </div>

          {results.businesses.length === 0 && (
            <p className="text-gray-600 text-sm py-8 text-center">
              No results — try a larger city or different name.
            </p>
          )}

          {results.businesses.map(biz => (
            <div key={biz.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/[0.03]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>

              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${COLOR}15` }}>
                <Building size={14} style={{ color: COLOR }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{biz.name}</p>
                <p className="text-xs text-gray-600 mt-0.5 capitalize">
                  {biz.type.replace(/_/g, ' ')}{biz.street ? ` · ${biz.street}` : ''}
                </p>
              </div>

              {biz.phone && (
                <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                  <Phone size={11} />
                  {biz.phone}
                </div>
              )}

              <div className="flex items-center gap-1 text-xs flex-shrink-0"
                style={{ color: '#e05555' }}>
                <Globe size={12} />
                No site
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
