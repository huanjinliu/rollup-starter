import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import rollupExternalModules from 'rollup-external-modules';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/starter.js',
    format: 'cjs',
    sourcemap: false
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      exclude: 'node_modules/**',
    }),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled' }),
    json(),
  ],
  external: rollupExternalModules
};
