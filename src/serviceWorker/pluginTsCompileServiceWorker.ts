import { rollup, InputOptions, OutputOptions } from 'rollup'
import rollupPluginTypescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import pc from 'picocolors';
import fs from 'node:fs';


const formatConsole = (msg: string) => console.log(`${pc.cyan("[vite-plugin-ts-compile-sw]")} ${msg}`);

export default (options: {
  outBuildDir?: 'dist' | string,
}) => ({
  name: 'compile-typescript-service-worker',
  async writeBundle() {
    console.log();
    formatConsole("Plugin initialized");
    const inputOptions: InputOptions = {
      input: 'src/serviceWorker/sw.ts',
      plugins: [
        rollupPluginTypescript({
          outDir: options.outBuildDir ?? 'dist', // Явно указываем outDir внутри dist
          sourceMap: false, // Отключаем генерацию sourcemap для SW
          module: 'ESNext', // Указываем, что это модуль
          declaration: false, // Чтобы не было конфликтов с sourcemap
          declarationMap: false,
        }) as any,
        nodeResolve()
      ],
    }
    const outputOptions: OutputOptions = {
      file: 'dist/sw.js',
      format: 'es',
    }
    fs.readdirSync('dist').forEach(file => {formatConsole(file);});
    const bundle = await rollup(inputOptions);
    formatConsole("Files transpiled");
    await bundle.write(outputOptions);
    await bundle.close();
    formatConsole("Bundle written");
    fs.readdirSync('dist').forEach(file => {formatConsole(file);});
  }
})
