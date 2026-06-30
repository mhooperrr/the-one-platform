export default async function handler(req, res) {
  const { city } = req.query
  if (!city) return res.status(400).json({ error: 'city param required' })

  try {
    // Geocode city name → bounding box
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TheONEPlatform/1.0' } }
    )
    const geoData = await geoRes.json()

    if (!geoData.length) {
      return res.status(404).json({ error: `"${city}" not found — try "Nashville, TN"` })
    }

    const { boundingbox, display_name, lat: cityLat, lon: cityLon } = geoData[0]
    const [s, n, w, e] = boundingbox

    const query = `[out:json][timeout:25];(node["name"][!"website"]["shop"](${s},${w},${n},${e});node["name"][!"website"]["amenity"](${s},${w},${n},${e});node["name"][!"website"]["office"](${s},${w},${n},${e});node["name"][!"website"]["craft"](${s},${w},${n},${e}););out body 300;`

    // Overpass expects form-encoded: data=<query>
    const body = 'data=' + encodeURIComponent(query)

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ]

    let ovData = null
    for (const endpoint of endpoints) {
      try {
        const ovRes = await fetch(endpoint, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        if (ovRes.ok) {
          ovData = await ovRes.json()
          break
        }
      } catch {
        // try next
      }
    }

    if (!ovData) {
      return res.status(502).json({ error: 'Map data unavailable — try again in a moment' })
    }

    const businesses = (ovData.elements || [])
      .filter(el => el.tags?.name && el.lat && el.lon)
      .map(el => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.shop || el.tags.amenity || el.tags.office || el.tags.craft || 'business',
        street: el.tags['addr:street'] || null,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        lat: el.lat,
        lon: el.lon,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    res.json({
      cityLabel: display_name.split(',').slice(0, 2).join(','),
      center: [parseFloat(cityLat), parseFloat(cityLon)],
      businesses,
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Scan failed' })
  }
}
