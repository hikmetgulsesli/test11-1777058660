/**
 * Generates a short code for a shortened URL.
 * @param length - The length of the code to generate (default: 5)
 * @returns A short alphanumeric code
 */
export function generateShortCode(length: number = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}