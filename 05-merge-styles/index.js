const path = require('path');
const fsp = require('fs/promises');

const stylesFolder = 'styles';
const distFolder = 'project-dist';
const bundleName = 'bundle.css';
const stylesPath = path.join(__dirname, stylesFolder);
const distPath = path.join(__dirname, distFolder, bundleName);

const checkIsCssFile = (filePath) => {
  return path.extname(filePath) === '.css';
};

(async function bundleStyles(src = stylesPath, dist = distPath) {
  try {
    await fsp.rm(dist, { force: true });

    for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
      const filePath = path.join(src, entry.name);

      if (entry.isFile() && checkIsCssFile(filePath)) {
        const data = await fsp.readFile(filePath);
        await fsp.appendFile(dist, data + '\n');
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
