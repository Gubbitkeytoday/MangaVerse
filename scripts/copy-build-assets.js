const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy .next/static -> .next/standalone/.next/static
copyDirRecursive(
  path.join(__dirname, '../.next/static'),
  path.join(__dirname, '../.next/standalone/.next/static')
);

// Copy public -> .next/standalone/public
copyDirRecursive(
  path.join(__dirname, '../public'),
  path.join(__dirname, '../.next/standalone/public')
);

console.log('✓ Successfully copied build assets cross-platform!');
