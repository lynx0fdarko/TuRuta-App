export function withCors(handler, { methods = ['GET'], origin = '*' } = {}) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', methods.join(','))
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.status(204).end()
    if (!methods.includes(req.method)) return res.status(405).json({ error: 'Method Not Allowed' })
    return handler(req, res)
  }
}
