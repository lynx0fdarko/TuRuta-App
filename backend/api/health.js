export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    url: process.env.SUPABASE_URL ? 'loaded' : 'missing',
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'loaded' : 'missing',
  })
}
