const https = require('https');
const fs = require('fs');
const path = require('path');

const animations = {
  idle: 'https://models.readyplayer.me/animations/idle.glb',
  talking: 'https://models.readyplayer.me/animations/talking.glb'
};

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest);
      reject(err);
    });
  });
};

async function downloadAnimations() {
  const animationsDir = path.join(__dirname, '..', 'public', 'animations');
  
  if (!fs.existsSync(animationsDir)) {
    fs.mkdirSync(animationsDir, { recursive: true });
  }

  console.log('Starting animation downloads...');
  
  for (const [name, url] of Object.entries(animations)) {
    const dest = path.join(animationsDir, `${name}.glb`);
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Error downloading ${name} animation:`, err);
    }
  }
  
  console.log('All animations downloaded successfully!');
}

downloadAnimations().catch(console.error); 