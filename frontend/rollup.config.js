import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [
    html({
      publicPath: '/'
    }),
    typescript(),
    nodeResolve({
      browser: true
    }),
    commonjs(),
    serve({
      open: false,
      historyApiFallback: true,
      contentBase: 'dist',
      port: 3000,
      watch: true
    })
  ]
};
