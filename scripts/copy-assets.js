const fs = require('fs');
const path = require('path');

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Skip: ${sourceDir} does not exist`);
    return;
  }
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const srcPath = path.join(sourceDir, entry.name);
    const dstPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

const backendImages = path.join(__dirname, '..', 'backend', 'public', 'images');
const frontendImages = path.join(__dirname, '..', 'frontend', 'public', 'images');

copyDirectory(backendImages, frontendImages);
console.log('Assets copied to frontend/public/images');


