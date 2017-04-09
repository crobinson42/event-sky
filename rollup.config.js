import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'

export default {
	entry: 'src/main.js',
	format: 'umd',
	moduleName: "EventSky",
	plugins: [
		json(),
		babel({
			exclude: 'node_modules/**'
		})
	],
	dest: 'bundle.js',
	sourceMap: true,
}