const path = require('path');
const fsp = require('fs/promises');

const bundleName = 'project-dist';
const bundlePath = path.join(__dirname, bundleName);

const assetsName = 'assets';
const assetsPath = path.join(__dirname, assetsName);
const assetsBundlePath = path.join(bundlePath, assetsName);

const templateName = 'template.html';
const template = path.join(__dirname, templateName);

const componentsFolder = 'components';
const components = path.join(__dirname, componentsFolder);

const stylesFolder = 'styles';
const stylesPath = path.join(__dirname, stylesFolder);
const bundleStylesName = 'style.css';
const bundleHtmlName = 'index.html';

const copyFolder = async (srcPath, distPath) => {
  try {
    await fsp.mkdir(distPath, { recursive: true });

    const entries = await fsp.readdir(srcPath, { withFileTypes: true });

    for (const entry of entries) {
      const newPath = path.join(srcPath, entry.name);
      const newPathCopy = path.join(distPath, entry.name);

      if (entry.isDirectory()) {
        copyFolder(newPath, newPathCopy);
      }

      if (entry.isFile()) {
        await fsp.copyFile(newPath, newPathCopy);
      }
    }
  } catch (err) {
    console.log('copyFolder error: ', err);
  }
};

const bundleStyles = async (srcPath, distPath, distName) => {
  try {
    const dist = path.join(distPath, distName);
    const names = ['header.css', 'main.css', 'footer.css'];

    const entries = await fsp.readdir(srcPath, { withFileTypes: true });
    const sortedEntries = entries
      .map((entry) => {
        const filePath = path.join(srcPath, entry.name);
        return { entry, filePath };
      })
      .filter(({ entry, filePath }) => (
        (entry.isFile() && path.extname(filePath) === '.css')
      ))
      .sort((a, b) => {
        if (names.length) {
          return names.indexOf(a.entry.name) - names.indexOf(b.entry.name);
        }
      });

    const ws = await fsp.open(dist, 'w');

    for (const entry of sortedEntries) {
      const data = await fsp.readFile(entry.filePath);
      ws.appendFile(data + '\n');
    }
    ws.close(distPath);
  } catch (err) {
    console.log('bundleStyles error: ', err);
  }
};

const bundleTemplates = async (srcPath, distPath, distName) => {
  try {
    const dist = path.join(distPath, distName);
    let templateFile = await fsp.readFile(srcPath.template, 'utf-8');
    const componentsEntries = new Set(templateFile.match(/{{.+}}/g));

    if (componentsEntries.size) {
      for (const entry of componentsEntries) {
        try {
          const fileName = entry.slice(2, -2) + '.html';
          const componentPath = path.join(srcPath.components, fileName);
          const component = await fsp.readFile(componentPath, 'utf-8');
          templateFile = templateFile.replace(new RegExp(entry, 'g'), component);
        } catch (err) {
          throw new Error(`${entry} not accessed in ${srcPath.components}`);
        }
      }
    }

    await fsp.appendFile(dist, templateFile + '\n');
  } catch (err) {
    console.log('bundleTemplates error: ', err);
  }
};

async function bundlePage() {
  try {
    await fsp.rm(bundlePath, { force: true, recursive: true });
    await fsp.mkdir(bundlePath, { recursive: true });

    await bundleStyles(stylesPath, bundlePath, bundleStylesName);
    await bundleTemplates({ template, components }, bundlePath, bundleHtmlName);
    copyFolder(assetsPath, assetsBundlePath);
  } catch (err) {
    console.log('bundlePage error: ', err);
  }
}

bundlePage();