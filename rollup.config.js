import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
	entry: 'src/main.js',
	format: 'umd',
	moduleName: 'EventSky',
	plugins: [
		resolve(),
		commonjs(),
		json(),
		babel({
			exclude: 'node_modules/**',
		}),
	],
	dest: 'build.js',
	sourceMap: true,
}
