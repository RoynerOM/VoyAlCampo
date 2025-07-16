import crypto from 'crypto'

/**
 * Genera un hash tipo ETag desde una cadena (ej: JSON serializado)
 * @param {string} data - El string a hashear (ej. JSON.stringify(obj))
 * @returns {string} - Hash tipo ETag (ej: "a1b2c3d4...")
 */
function generateHash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

export default {generateHash}
