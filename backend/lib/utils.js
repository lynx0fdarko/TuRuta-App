// /lib/utils.js
// Utilidades generales para validación, sanitización y manejo de errores

/**
 * Verifica si una coordenada es válida (latitud / longitud)
 */
export function validCoord(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Limpia un texto para prevenir inyecciones o caracteres peligrosos
 */
export function sanitize(text) {
  if (typeof text !== "string") return text;
  return text.replace(/['";<>]/g, "").trim();
}

/**
 * Responde con un error estandarizado y loguea en consola
 */
export function handleError(res, err, code = 500) {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  return res.status(code).json({
    ok: false,
    error: err.message || "Error interno del servidor",
  });
}

/**
 * Envía una respuesta estándar en formato JSON
 */
export function success(res, data = {}, code = 200) {
  return res.status(code).json({
    ok: true,
    ...data,
  });
}

/**
 * Convierte valores vacíos o indefinidos a null
 */
export function normalize(value) {
  if (value === undefined || value === "" || value === "null") return null;
  return value;
}

/**
 * Formatea fechas a ISO (sin errores si el valor es inválido)
 */
export function safeDate(value) {
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}
