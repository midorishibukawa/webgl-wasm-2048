module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{wasm,html,js}'
	],
	swDest: 'dist/sw.js',
	swSrc: 'src/ts/sw.ts'
};