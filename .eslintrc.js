module.exports = {
  root: true,
  env: {
	node: true,
	jquery: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
	'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	"vue/no-use-v-if-with-v-for": 0,
	"no-unused-vars": 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
