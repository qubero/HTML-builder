const path = require('path');
const fsp = require('fs/promises');

const initFolder = 'files';
const initPath = path.join(__dirname, initFolder);
const initPathCopy = initPath + '-copy';

(async function copyFolder(currPath = initPath, copyPath = initPathCopy) {
  try {
    await fsp.rm(copyPath, { force: true, recursive: true });
    await fsp.mkdir(copyPath, { recursive: true });

    for (let entry of await fsp.readdir(currPath, { withFileTypes: true })){
      const newPath = path.join(currPath, entry.name);
      const newPathCopy = path.join(copyPath, entry.name);

      if (entry.isDirectory()) {
        copyFolder(newPath, newPathCopy);
      }

      if (entry.isFile()) {
        fsp.copyFile(newPath, newPathCopy);
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
