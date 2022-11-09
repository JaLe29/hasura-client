module.exports = {
	collectCoverage: false,
	transform: {
		'^.+\\.ts?$': 'ts-jest',
		'^.+\\.tsx?$': 'ts-jest',
	},
	reporters: ['default'],
	// moduleNameMapper: {
	// 	'^@apengine/(.*)$': '<rootDir>/../$1/dist',
	// },
	// automock: false,
	// setupFiles: ['<rootDir>/../../jest.setup.js'],
	// cacheDirectory: '<rootDir>/.cache/jest',
	// modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
