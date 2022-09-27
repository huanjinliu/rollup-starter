import fs from 'fs';
import path from 'path';

interface RollupConfigs {
  ts: boolean,
  webServer?: {
    name: string,
    port: number,
  },
}

const WRAP = '\n';

export const createRollupConfigs = ({
  ts,
  webServer,
}: RollupConfigs) => {
  let content =[
    `import resolve from '@rollup/plugin-node-resolve';`,
    `import babel from '@rollup/plugin-babel';`,
    `import commonjs from '@rollup/plugin-commonjs';`,
    ts === true ? `import typescript from '@rollup/plugin-typescript';` : '',
    webServer ? `import serve from 'rollup-plugin-serve';` : '',
    webServer ? `import livereload from 'rollup-plugin-livereload';` : '',
    webServer ? `import copy from 'rollup-plugin-copy';` : '',
    `\nexport default () => [`,
    `  {`,
    `    input: 'src/index.ts',`,
    `    output: {`,
    `      file: 'dist/index.js',`,
    `      format: '${webServer ? 'umd' : 'cjs'}',`,
    webServer
      ? `      name: '${webServer.name}',`
      : `      exports: 'default',`,
    `    },`,
    `    plugins: [ `,
    `      resolve(),`,
    `      commonjs(),`,
    ts === true ? `      typescript(),` : '',
    `      babel({`,
    `        babelHelpers: 'bundled',`,
    `      }),`,
    webServer ? [
      `      copy({`,
      `        targets: [`,
      `          {`,
      `            src: 'public/**',`,
      `            dest: 'dist/'`,
      `          }`,
      `        ]`,
      `      }),`,
      `      serve({`,
      `        contentBase: 'dist/',`,
      `        port: ${webServer.port},`,
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