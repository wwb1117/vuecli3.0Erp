const path = require('path');
const webpack = require("webpack")
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
	baseUrl: process.env.MY_ENV === 'test' ? 'https://dev.cdn.mamaqunaer.com/erp/' : 'https://cdn.mamaqunaer.com/erp/',
	devServer: {
		host: '0.0.0.0',
		disableHostCheck: true,
		compress: true,
        port: 8099,
		proxy: {
			'/api': {
				// target: 'http://192.168.1.192:8055',
				target: 'http://dev.erp1.mamaqunaer.com',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: "jquery",
				$: "jquery"
			})
		]
    },
	chainWebpack: config => {
		// 添加别名
		config.resolve.alias
			.set('@', resolve('src'))
			.set('views', resolve('src/views'))
			.set('directive', resolve('src/directive'))
			.set('api', resolve('src/api'))
			.set('utils', resolve('src/utils'))
			.set('assets', resolve('src/assets'))
			.set('components', resolve('src/components'))

		config.module  //解决字体文件跨域问题
			.rule('fonts')
			.use('url-loader')
			.loader('url-loader')
			.tap(args => {
				args.limit = 100000000000
				return args
			})
	}
}