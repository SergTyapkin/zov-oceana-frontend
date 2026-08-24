import pc from 'picocolors';
import * as fs from 'node:fs';

const formatConsole = (msg: string) => console.log(`${pc.cyan("[vite-plugin-assets-list-generator]")} ${msg}`);

export default (options: {
  outBuildDir?: 'dist' | string,
  fileName?: 'assetsList.js' | string,
  assetsFolder?: 'assets' | string,
  additionalDirs?: [] | string[],
  additionalFiles?: [] | string[],
}) => ({
  name: 'plugin-assets-list-generator',
  closeBundle: {
    order: 'post', // После всех плагинов
    sequential: true, // Последовательно, после завершения всех плагинов

    async handler() {
      const fsOutBuildDir = options.outBuildDir || 'dist';

      const webAssetsDir = `${options.assetsFolder || 'assets'}`;
      const fsAssetsDir = `${fsOutBuildDir}/${webAssetsDir}`;

      const webAdditionalDirs = options.additionalDirs || [];
      const fsAdditionalDirs = webAdditionalDirs.map(folderPath => `${fsOutBuildDir}/${folderPath}`);

      const webAdditionalFiles = options.additionalFiles || [];

      const webResultFileName = options.fileName || 'assetsList.js';
      const fsResultFilePath = `${fsOutBuildDir}/${webResultFileName}`;

      formatConsole("Plugin initialized");

      const assetsList: string[] = [];
      assetsList.push(`index.html`);

      fs.readdirSync(fsAssetsDir).forEach(fileName => {
        assetsList.push(`${webAssetsDir}/${fileName}`);
      });

      fsAdditionalDirs.forEach((fsDirPath, idx) => {
        const webDirPath = webAdditionalDirs[idx];
        fs.readdirSync(fsDirPath).forEach(fileName => {
          assetsList.push(`${webDirPath}/${fileName}`);
        });
      });

      assetsList.push(...webAdditionalFiles);

      const assetsListUnique = Array.from(new Set(assetsList));
      formatConsole(`📊 Listed assets: ${assetsListUnique.length}`);
      fs.writeFileSync(fsResultFilePath, `export default ${JSON.stringify(assetsListUnique)};`);
    }
  }
});
