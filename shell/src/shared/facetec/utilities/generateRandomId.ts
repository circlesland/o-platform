export function generateRandomId() {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer)
  return Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
}