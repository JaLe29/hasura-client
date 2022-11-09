module.exports = {
	plugins: ['babel', '@typescript-eslint', 'prettier'],
	extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'prettier'],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					'{}': false,
				},
			},
		],
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{
				allowExpressions: true,
			},
		],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/member-delimiter-style': 'error',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'@typescript-eslint/semi': ['error'],
		'arrow-parens': 'off',
		'babel/no-unused-expressions': [
			'error',
			{
				allowShortCircuit: true,
				allowTernary: true,
			},
		],
		camelcase: 'off',
		curly: ['error', 'all'],
		'class-methods-use-this': 'off',
		'default-case': 'off',
		eqeqeq: 'error',
		'import/extensions': 'off',
		'import/no-cycle': 'off',
		'import/prefer-default-export': 'off',
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1,
				outerIIFEBody: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1,
				},
				FunctionExpression: {
					parameters: 1,
					body: 1,
				},
				CallExpression: {
					arguments: 1,
				},
				ArrayExpression: 1,
				ObjectExpression: 1,
				ImportDeclaration: 1,
				flatTernaryExpressions: false,
			},
		],
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/label-has-associated-control': 'off',
		'jsx-a11y/label-has-for': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'lines-between-class-members': 'off',
		'max-classes-per-file': ['off'],
		'max-len': [
			'error',
			{
				code: 150,
				ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
				ignoreUrls: true,
			},
		],
		'require-await': 'error',
		'no-alert': 'off',
		'no-await-in-loop': 'warn',
		'no-case-declarations': 'warn',
		'no-continue': 'off',
		'no-console': 'error',
		'no-dupe-class-members': 'off',
		'no-shadow': 'off',
		'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/webpack.*.ts'] }],
		'no-mixed-operators': 'off',
		'no-param-reassign': 'error',
		'no-plusplus': 'off',
		'no-prototype-builtins': 'off',
		'no-restricted-globals': 'off',
		'no-tabs': 'off',
		'no-undef': 'off',
		'no-underscore-dangle': 'off',
		'no-unused-expressions': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
		'no-useless-constructor': 'off',
		'object-curly-newline': 'off',
		radix: 'off',
		'react/jsx-filename-extension': [
			'warn',
			{
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		],
		'react/jsx-indent': [
			'error',
			'tab',
			{
				checkAttributes: true,
				indentLogicalExpressions: true,
			},
		],
		'react/jsx-indent-props': ['error', 'tab'],
		'react/jsx-key': ['error', { checkFragmentShorthand: true }],
		'react/jsx-one-expression-per-line': [
			'error',
			{
				allow: 'single-child',
			},
		],
		'react/jsx-props-no-spreading': 'off',
		'react/sort-comp': 'off',
		semi: 'off',
		'prettier/prettier': 'error',
	},
	overrides: [
		{
			files: ['**/*.tsx'],
			rules: {
				'react/prop-types': 0,
				'react/no-unused-prop-types': 0,
				'react/require-default-props': 'off',
			},
		},
		{
			files: ['**/*.test.ts', '**/*.test.tsx'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
		{
			files: ['*.js', '*.es6'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
		{
			files: ['*.d.ts'],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
	],
	globals: {},
	env: {
		es6: true,
		node: true,
		browser: true,
		jest: true,
	},
};
