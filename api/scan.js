export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  if (!city) {
    return new Response(JSON.stringify({ error: 'city required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  try {
    // Geocode
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TheONEPlatform/1.0' } }
    )
    const geoData = await geoRes.json()

    if (!geoData.length) {
      return new Response(JSON.stringify({ error: `"${city}" not found — try "Nashville, TN"` }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    }

    const { boundingbox, display_name, lat: cityLat, lon: cityLon } = geoData[0]
    const [s, n, w, e] = boundingbox

    const query = `[out:json][timeout:20];(node["name"][!"website"]["shop"](${s},${w},${n},${e});node["name"][!"website"]["amenity"](${s},${w},${n},${e});node["name"][!"website"]["office"](${s},${w},${n},${e}););out body 200;`
    const body = 'data=' + encodeURIComponent(query)

    const ovRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    if (!ovRes.ok) {
      const detail = await ovRes.text()
      return new Response(JSON.stringify({ error: `Overpass error ${ovRes.status}`, detail: detail.slice(0, 300) }), { status: 502, headers: { 'Content-Type': 'application/json' } })
    }

    const ovData = await ovRes.json()

    const businesses = (ovData.elements || [])
      .filter(el => el.tags?.name && el.lat && el.lon)
      .map(el => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.shop || el.tags.amenity || el.tags.office || 'business',
        street: el.tags['addr:street'] || null,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        lat: el.lat,
        lon: el.lon,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return new Response(JSON.stringify({
      cityLabel: display_name.split(',').slice(0, 2).join(','),
      center: [parseFloat(cityLat), parseFloat(cityLon)],
      businesses,
    }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
