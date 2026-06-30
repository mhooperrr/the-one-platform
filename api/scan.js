// Kept for future use — scanning now runs client-side in Mapper.jsx
export default function handler(req, res) {
  res.status(410).json({ error: 'Use client-side scan' })
}
