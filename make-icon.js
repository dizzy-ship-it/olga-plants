const fs = require('fs');
// Minimal 192x192 PNG - green square with leaf emoji rendered as colored block
// We'll create a valid PNG manually
const { createCanvas } = (() => { try { return require('canvas'); } catch(e) { return null; } })() || {};
if (!createCanvas) {
  // Fallback: write a base64-encoded minimal green PNG icon
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  fs.writeFileSync('icon.png', Buffer.from(b64, 'base64'));
  console.log('minimal icon written');
}
