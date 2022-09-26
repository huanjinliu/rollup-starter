import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import rollupExternalModules from 'rollup-external-modules';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/starter.js',
    format: 'cjs',
    sourcemap: false
  },
  plugins: [
    copy({
      targets: [
        {
          src: 'src/templates',
          dest: 'lib/',
        }
      ]
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled' }),
    json(),
  ],
  external: rollupExternalModules
};
