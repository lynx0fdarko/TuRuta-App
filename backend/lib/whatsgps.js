const BASE = process.env.WHATSGPS_BASE_URL || 'https://www.whatsgps.com'
const USERNAME = process.env.WHATSGPS_USERNAME
const PASSWORD = process.env.WHATSGPS_PASSWORD

let cache = null

async function getToken() {
  if (cache && Date.now() < cache.exp) return cache.token

  const url = new URL('/user/login.do', BASE)
  url.searchParams.set('name', USERNAME)
  url.searchParams.set('password', PASSWORD)

  const r = await fetch(url, { method: 'GET' })
  if (!r.ok) throw new Error(`WhatsGPS login ${r.status}`)
  const data = await r.json()

  if (data.ret !== 1) throw new Error(`Login ret != 1: ${JSON.stringify(data)}`)

  const token = data.data?.token
  const userId = data.data?.userId
  if (!token || !userId) throw new Error('Login no devolvió token o userId')

  // Cachear 45 minutos
  cache = { token, userId, exp: Date.now() + 45 * 60 * 1000 }
  return token
}

export async function getUserId() {
  if (cache?.userId) return cache.userId
  await getToken()
  return cache.userId
}

export async function getCarsByUser(userId) {
  const token = await getToken()
  const url = new URL('/car/getByUserId.do', BASE)
  url.searchParams.set('token', token)
  url.searchParams.set('userId', String(userId))

  const r = await fetch(url)
  if (!r.ok) throw new Error(`getByUserId ${r.status}`)
  const data = await r.json()

  if (data.ret !== 1) throw new Error(`getByUserId ret != 1: ${JSON.stringify(data)}`)
  return data.data || []
}

export async function getStatusesByUser(userId, { mapType } = {}) {
  const token = await getToken()
  const url = new URL('/carStatus/getByUserId.do', BASE)
  url.searchParams.set('token', token)
  url.searchParams.set('targetUserId', String(userId))
  if (mapType != null) url.searchParams.set('mapType', String(mapType)) // 2=Google

  const r = await fetch(url)
  if (!r.ok) throw new Error(`carStatus/getByUserId ${r.status}`)
  const data = await r.json()

  if (data.ret !== 1) throw new Error(`carStatus ret != 1: ${JSON.stringify(data)}`)
  return data.data || []
}

export async function getHistory({ carId, startTime, endTime, mapType }) {
  const token = await getToken()
  const url = new URL('/position/queryHistory.do', BASE)
  url.searchParams.set('token', token)
  url.searchParams.set('carId', String(carId))
  url.searchParams.set('startTime', startTime) // ej: "2025-09-27 10:00:00"
  url.searchParams.set('endTime', endTime)     // ej: "2025-09-27 11:00:00"
  if (mapType != null) url.searchParams.set('mapType', String(mapType))

  const r = await fetch(url)
  if (!r.ok) throw new Error(`queryHistory ${r.status}`)
  const data = await r.json()

  if (data.ret !== 1) throw new Error(`queryHistory ret != 1: ${JSON.stringify(data)}`)
  return data.data || []
}
