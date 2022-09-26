import fs from 'fs';
import path from 'path';

interface RollupConfigs {
  ts: boolean,
  webServer?: {
    name: string,
    port?: number,
  },
}

const WRAP = '\n';

export const createRollupConfigs = ({
  ts,
  webServer,
}: RollupConfigs) => {
  let content =[
    // `import path from 'path';`,
    `import resolve from '@rollup/plugin-node-resolve';`,
    `import babel from '@rollup/plugin-babel';`,
    `import commonjs from 'rollup-plugin-commonjs';`,
    ts === true ? `import typescript from 'rollup-plugin-typescript';` : '',
    webServer ? `import serve from 'rollup-plugin-serve';` : '',
    webServer ? `import livereload from 'rollup-plugin-livereload';` : '',
    `\nexport default () => [`,
    `  {`,
    `    input: 'src/index.ts',`,
    `    output: {`,
    `      file: 'dist/index.js',`,
    `      format: '${webServer ? 'umd' : 'cjs'}',`,
    webServer ? `      name: '${webServer.name}',` : '',
    `    },`,
    `    plugins: [ `,
    `      resolve(),`,
    `      commonjs(),`,
    ts === true ? `      typescript(),` : '',
    `      babel({`,
    `        babelHelpers: 'bundled',`,
    `      }),`,
    webServer ? [
      `      serve({`,
      `        open: true,`,
      `        openPage: '/public/index.html',`,
      `        port: ${webServer.port ?? 8080},`,
      `        verbose: false,`,
      `      }),`,
      `      livereload({`,
      `        watch: ['dist'],`,
      `        verbose: false,`,
      `      })`,
    ].join(WRAP) : '',
    `    ],`,
    `  }`,
    `];`,
  ].filter(part => part !== '').join(WRAP);
  return {
    get: () => content,
    writeFile: async (dirPath: string) => {
      await fs.promises.writeFile(
        path.join(dirPath, 'rollup.config.js'),
        content,
      );
    },
  }
};