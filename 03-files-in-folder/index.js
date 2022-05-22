const path = require('path');
const fsp = require('fs/promises');

const root = 'secret-folder';
const rootPath = path.join(__dirname, root);
const bytesPerKilo = 1024;

const createFileInfo = async(filePath) => {
  const stat = await fsp.stat(filePath);
  const name = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).slice(1) || 'NOEXT';
  const size = (stat.size/bytesPerKilo).toFixed(3) + 'kb';

  return {name, ext, size};
};

(async function getFilesInfo(currentPath = rootPath, isRecursive = false) {
  for (let entry of await fsp.readdir(currentPath, { withFileTypes: true })){
    const newPath = path.join(currentPath, entry.name);

    if (entry.isDirectory() && isRecursive) {
      getFilesInfo(newPath, isRecursive);
    }

    if (entry.isFile()) {
      const {name, ext, size} = await createFileInfo(newPath);
      console.log(`${name} - ${ext} - ${size}`);
    }
  }
})();
