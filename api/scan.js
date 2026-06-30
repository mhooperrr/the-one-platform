export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  if (!city) {
    return json({ error: 'city required' }, 400)
  }

  try {
    // Geocode city → bounding box
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TheONEPlatform/1.0' } }
    )
    const geoData = await geoRes.json()

    if (!geoData.length) {
      return json({ error: `"${city}" not found — try "Nashville, TN"` }, 404)
    }

    const { boundingbox, display_name, lat: cityLat, lon: cityLon } = geoData[0]
    const [s, n, w, e] = boundingbox

    // Raw QL with text/plain — this is what Overpass actually accepts
    const query = `[out:json][timeout:20];(node["name"][!"website"]["shop"](${s},${w},${n},${e});node["name"][!"website"]["amenity"](${s},${w},${n},${e});node["name"][!"website"]["office"](${s},${w},${n},${e}););out body 200;`

    const ovRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' },
    })

    if (!ovRes.ok) {
      return json({ error: `Overpass error ${ovRes.status}` }, 502)
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

    return json({
      cityLabel: display_name.split(',').slice(0, 2).join(','),
      center: [parseFloat(cityLat), parseFloat(cityLon)],
      businesses,
    })

  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
