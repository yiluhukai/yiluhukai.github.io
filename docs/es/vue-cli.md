#### 用webpack构建Vue

首先看下项目的基本结构：

```shell
$ tree -I node_modules 
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── main.js
│   └── style.less
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

安装`webpack`作为开发依赖：

```shell
npm install webpack@4 webpack-cli@3 -D  
```

我们的入口文件是`main.js`

```js

import Vue from 'vue'
import App from './App.vue'

import './style.less'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

```

将打包的入口和输出配置在`webpack.common.js`中：

```js
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */
const path = require('path')
module.exports = {
	context: path.join(__dirname),
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]_[hash:8].js'
	}
}
```

运行打包命令：

```shell
$ npx webpack --config webpack.common.js
Hash: dfc9ca4a1c9917f188bb
Version: webpack 4.46.0
Time: 145ms
Built at: 2021-06-09 22:56:26
 1 asset
Entrypoint main = main_dfc9ca4a.js
[0] ./src/App.vue 319 bytes {0} [built] [failed] [1 error]
[1] ./src/main.js 169 bytes {0} [built]
[2] ./src/style.less 272 bytes {0} [built] [failed] [1 error]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in ./src/main.js
Module not found: Error: Can't resolve 'vue' in '/Users/lijunjie/js-code/webpack-hook/vue-app-base/src'
 @ ./src/main.js 1:0-21 6:0-3 8:4-7

ERROR in ./src/style.less 1:0
Module parse failed: Unexpected character '@' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> @bg-color: #f8f9fb;
| 
| body {
 @ ./src/main.js 4:0-21

ERROR in ./src/App.vue 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <template>
|   <div id="app">
|     <img alt="Vue logo" src="./assets/logo.png">
 @ ./src/main.js 2:0-27 9:17-20

ERROR in main_dfc9ca4a.js from Terser
Invalid assignment [main_dfc9ca4a.js:109,147]
```

根据终端中输出的内容可以看出来几个问题：

* 没有设置`mode`选项：
* 找不到`vue`这个模块
* 没有`处理less`的`loader`
* 无法解析`vue`文件

首先设置`mode`选项，我们这块采用不用环境配置在不同的文件中，将公共模块提取到通用模块中,这块我们需要合并对象,所以要用到`webpack-merge`包

```shell
npm install -d webpack-merge
```

在`webpack.dev.js`和`webpack.prod.js`中导入`webpack.common.js`的配置项进行合并：

```js
// webpack.prod.js
const commonConfigs = require('./webpack.common')
const { merge } = require('webpack-merge')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */

const prodConfigs = {
	mode: 'development'
}
module.exports = merge({}, commonConfigs, prodConfigs)

```

```js
const commonConfigs = require('./webpack.common')
const { merge } = require('webpack-merge')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */

const devConfigs = {
	mode: 'development'
}
module.exports = merge({}, commonConfigs, devConfigs)

```

运行开发环境进行打包：

```js
$ npx webpack --config webpack.dev.js
Hash: 6dfe9e7df32f6c983b5a
Version: webpack 4.46.0
Time: 53ms
Built at: 2021-06-09 23:14:38
           Asset   Size  Chunks                         Chunk Names
main_6dfe9e7d.js  6 KiB    main  [emitted] [immutable]  main
Entrypoint main = main_6dfe9e7d.js
[./src/App.vue] 319 bytes {main} [built] [failed] [1 error]
[./src/main.js] 169 bytes {main} [built]
[./src/style.less] 272 bytes {main} [built] [failed] [1 error]

ERROR in ./src/main.js
Module not found: Error: Can't resolve 'vue' in '/Users/lijunjie/js-code/webpack-hook/vue-app-base/src'
 @ ./src/main.js 1:0-21 6:0-3 8:4-7

ERROR in ./src/style.less 1:0
Module parse failed: Unexpected character '@' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> @bg-color: #f8f9fb;
| 
| body {
 @ ./src/main.js 4:0-21

ERROR in ./src/App.vue 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <template>
|   <div id="app">
|     <img alt="Vue logo" src="./assets/logo.png">
 @ ./src/main.js 2:0-27 9:17-20
```

可以看到`mode`的问题已经解决了，接下来解决`vue`依赖的问题,因为`package.json`中包含了这个依赖，直接安装下即可

```json
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11"
  },
```

安装：

```shll
npm install
```

继续执行打包命令：

```shell
$ npx webpack --config webpack.dev.js
Hash: d7e30531ffa3b0b9a046
Version: webpack 4.46.0
Time: 227ms
Built at: 2021-06-09 23:24:25
           Asset     Size  Chunks                         Chunk Names
main_d7e30531.js  252 KiB    main  [emitted] [immutable]  main
Entrypoint main = main_d7e30531.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/App.vue] 319 bytes {main} [built] [failed] [1 error]
[./src/main.js] 169 bytes {main} [built]
[./src/style.less] 272 bytes {main} [built] [failed] [1 error]
    + 4 hidden modules

ERROR in ./src/style.less 1:0
Module parse failed: Unexpected character '@' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> @bg-color: #f8f9fb;
| 
| body {
 @ ./src/main.js 4:0-21

ERROR in ./src/App.vue 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <template>
|   <div id="app">
|     <img alt="Vue logo" src="./assets/logo.png">
 @ ./src/main.js 2:0-27 9:17-20
```

可以看出是没有解析`less`文件的`loader`导致的：这里我们需要用到`less-loader`去处理`less`文件，然后将处理后的`css`内容交给`css-loader`处理,最后为了保证样式被挂载，我们可以使用`style-loader`让`css`样式以`style`标签的方式挂载到`html中`：

```shell
npm install -D less-loader css-loader style-loader
```

The `less-loader` requires [less](https://github.com/less/less.js) as [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies). Thus you are able to control the versions accurately.

```shell
npm install -D less
```

一般来说生产环境的代码都需要进行压缩，所以我们先简单配置一下开发环境的

```js
//const commonConfigs = require('./webpack.common')
const { merge } = require('webpack-merge')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */

const devConfigs = {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.less$/,
				loader: ['style-loader', 'css-loader', 'less-loader']
			}
		]
	}
}
module.exports = merge({}, commonConfigs, devConfigs)

```

运行发现`less-loader`报错：安装了`^7.x.x`的版本发现可以正常运行：

```shell
npm install -D less-loader@7
$ npx webpack --config webpack.dev.js
Hash: 53bbf58746c5191d731d
Version: webpack 4.46.0
Time: 378ms
Built at: 2021-06-09 23:43:37
           Asset     Size  Chunks                         Chunk Names
main_53bbf587.js  265 KiB    main  [emitted] [immutable]  main
Entrypoint main = main_53bbf587.js
[./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style.less] 339 bytes {main} [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/App.vue] 319 bytes {main} [built] [failed] [1 error]
[./src/main.js] 169 bytes {main} [built]
[./src/style.less] 367 bytes {main} [built]
    + 6 hidden modules

ERROR in ./src/App.vue 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <template>
|   <div id="app">
|     <img alt="Vue logo" src="./assets/logo.png">
 @ ./src/main.js 2:0-27 9:17-20
```

可以看出来我们已经可以正常去解析`less`文件了，但是并不处理`*.vue`文件：我们需要对项目中的`*.vue`文件做处理，这个时候需要安装对应的`loader`:

```shell
npm install -D vue-loader vue-template-compiler
```

在`webpack.common.js`中进行配置：

```js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */
module.exports = {
	context: path.join(__dirname),
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]_[hash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: ['vue-loader']
			}
		]
	},
	plugins: [new VueLoaderPlugin()]
}
```

运行打包命令：

```shell
$ npx webpack --config webpack.dev.js
Hash: 8321d010466ec03f9f16
Version: webpack 4.46.0
Time: 688ms
Built at: 2021-06-09 23:50:56
           Asset     Size  Chunks                         Chunk Names
main_8321d010.js  294 KiB    main  [emitted] [immutable]  main
Entrypoint main = main_8321d010.js
[./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style.less] 339 bytes {main} [built]
[./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=script&lang=js&] ./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js& 154 bytes {main} [built]
[./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=style&index=0&lang=css&] ./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=style&index=0&lang=css& 345 bytes {main} [built] [failed] [1 error]
[./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90&] ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90& 460 bytes {main} [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/App.vue] 1.11 KiB {main} [built]
[./src/App.vue?vue&type=script&lang=js&] 248 bytes {main} [built]
[./src/App.vue?vue&type=style&index=0&lang=css&] 264 bytes {main} [built]
[./src/App.vue?vue&type=template&id=7ba5bd90&] 195 bytes {main} [built]
[./src/assets/logo.png] 281 bytes {main} [built] [failed] [1 error]
[./src/main.js] 169 bytes {main} [built]
[./src/style.less] 367 bytes {main} [built]
    + 14 hidden modules

ERROR in ./src/App.vue?vue&type=style&index=0&lang=css& (./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=style&index=0&lang=css&) 20:0
Module parse failed: Unexpected character '#' (20:0)
File was processed with these loaders:
 * ./node_modules/vue-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
| 
| 
> #app {
|   font-family: Avenir, Helvetica, Arial, sans-serif;
|   -webkit-font-smoothing: antialiased;
 @ ./src/App.vue?vue&type=style&index=0&lang=css& 1:0-123 1:139-142 1:144-264 1:144-264
 @ ./src/App.vue
 @ ./src/main.js

ERROR in ./src/assets/logo.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
 @ ./src/App.vue?vue&type=template&id=7ba5bd90& (./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90&) 10:39-67
 @ ./src/App.vue?vue&type=template&id=7ba5bd90&
 @ ./src/App.vue
 @ ./src/main.js

ERROR in ./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css& (./node_modules/vue-loader/lib??vue-loader-options!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css&) 44:3
Module parse failed: Unexpected token (44:3)
File was processed with these loaders:
 * ./node_modules/vue-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
| 
| 
> h3 {
|   margin: 40px 0 0;
| }
 @ ./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css& 1:0-157 1:173-176 1:178-332 1:178-332
 @ ./src/components/HelloWorld.vue
 @ ./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js&
 @ ./src/App.vue?vue&type=script&lang=js&
 @ ./src/App.vue
 @ ./src/main.js
```

首先是没有处理`css`文件的`loader`,`webpack.dev.js`加入如下的配置：

```js
...
{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader']
},
..
```

继续运行：

```shell
$ npx webpack --config webpack.dev.js
Hash: bb1e472ce841a0c99315
Version: webpack 4.46.0
Time: 624ms
Built at: 2021-06-09 23:55:18
           Asset     Size  Chunks                         Chunk Names
main_bb1e472c.js  296 KiB    main  [emitted] [immutable]  main
Entrypoint main = main_bb1e472c.js
[./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style.less] 339 bytes {main} [built]
[./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=style&index=0&lang=css&] ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=style&index=0&lang=css& 505 bytes {main} [built]
[./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=script&lang=js&] ./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js& 154 bytes {main} [built]
[./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90&] ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90& 460 bytes {main} [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/App.vue] 1.11 KiB {main} [built]
[./src/App.vue?vue&type=script&lang=js&] 248 bytes {main} [built]
[./src/App.vue?vue&type=style&index=0&lang=css&] 257 bytes {main} [built]
[./src/App.vue?vue&type=template&id=7ba5bd90&] 195 bytes {main} [built]
[./src/assets/logo.png] 281 bytes {main} [built] [failed] [1 error]
[./src/main.js] 169 bytes {main} [built]
[./src/style.less] 367 bytes {main} [built]
    + 14 hidden modules

ERROR in ./src/assets/logo.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
 @ ./src/App.vue?vue&type=template&id=7ba5bd90& (./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90&) 10:39-67
 @ ./src/App.vue?vue&type=template&id=7ba5bd90&
 @ ./src/App.vue
 @ ./src/main.js
```

根据提示可以看出是无法解析图片文件导致的，对于文件类型的处理，我们可以使用`file-loader`去处理较大(一般来说大于1M)的文件资源,小的资源文件我们可以使用`url-loader`来处理：

```js
// webpack.conf.js
{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							// 大于 8K使用file-loader,需要安装file-loader作为依赖
							limit: 8192
						}
					}
				]
}
```

运行我们可以发现打包过程中没有报错信息了。接下老我们需要实现一个开发服务器：

```shell
$ npm install -D webpack-dev-server
```

因为我们的打包结果需要放置到`html`中执行`html-webpack-plugin`可以给我提供一个`html`文件，并把打包的结果以`script`标签的方式注入：

```shell
$ npm install -D html-webpack-plugin@4
```

```js
//webpack.dev.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */
module.exports = {
	context: path.join(__dirname),
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]_[hash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: ['vue-loader']
			}
		]
	},
	plugins: [new VueLoaderPlugin()]
	// resolve: {
	// 	extensions: ['.js', '.vue']
	// }
}
```

```shell
npx webpacl-dev-server --config webpack.dev.js
```

安装`5.x.x`版本可以发现`html-webpack-plugin`中存在了一个`Compiler`中并不存在的钩子.所以猜测是因为`html-webpack-plugin`版本过高的问题，安装`4.x.x`版本的可以启动服务，但是会发现其他的错误：

```js
ERROR in Template execution failed: ReferenceError: BASE_URL is not defined

ERROR in   ReferenceError: BASE_URL is not defined
  
  - loader.js:4 eval
    [index.html?.]/[html-webpack-plugin]/lib/loader.js:4:11
  
  - loader.js:11 module.exports
    [index.html?.]/[html-webpack-plugin]/lib/loader.js:11:3
  
  - index.js:406 
    [vue-app-base]/[html-webpack-plugin]/index.js:406:16
  
  - task_queues.js:93 processTicksAndRejections
    internal/process/task_queues.js:93:5
  
  - async Promise.all
```

这是因为`html`模版中的错误：

```js
 <link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

我们只需要去设置模版参数即可：

```js
new HtmlWebpackPlugin({
			template: './public/index.html',
			title: 'My App',
			templateParameters: {
				BASE_URL: './public/'
			}
})
devServer: {
		port: '8080',
		contentBase: './',
		historyApiFallback: true,
		index: 'index.html'
}
```

执行后会发现我们的图片路径是[object%20Module]的字符串.这看起来更像是是对象调用`toString`方法的结果，然后我们从浏览器中查看源码：

```js

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c("img", {
        attrs: { alt: "Vue logo", src: __webpack_require__(/*! ./assets/logo.png */ "./src/assets/logo.png") }
      }),
      _vm._v(" "),
      _c("HelloWorld", { attrs: { msg: "Welcome to Your Vue.js App" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
})
```

我们使用`__webpack_require__`去加载`./src/assets/logo.png`的模块`Id`,但是`"./src/assets/logo.png"`对应的模块确实一个ES Module的模块。

```js

/***/ "./src/assets/logo.png":
/*!*****************************!*\
  !*** ./src/assets/logo.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "26bd867dd65e26dbc77d1e151ffd36e0.png");

/***/ })
```

我们知道`vue-loader`会将图片处理成`require()`去加载，所以这块的问题应该是对图片模块的处理问题，而我们使用的是`file-loader`和`url-laoder`去处理图片资源，查文档可知高版本的`file-loader`和`url-loader`会将`esModule`选项设置为`true`,这就导致我们打包出来的结果是一个`ES Module`模块,知道原因后修改就简单了。

```js
	{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							// 大于 8K使用file-loader,需要安装file-loader作为依赖
							limit: 8,
							esModule: false
						}
					}
				]
	}
```

然后执行命令启动开发服务器，发现图片正常显示了 

```shell
npx webpack-dev-server --config webpack.dev.js
```

接下来配置`babel`来实现`ES6`语法的转换,先安装依赖

```shell
npm install -D @babel/core @babel/preset-env babel-loader
npm install core-js
```

`babel.config.js`配置选项:

```js
module.exports = {
	presets: [
		// '@vue/cli-plugin-babel/preset'
		[
			'@babel/preset-env',
			{
				corejs: 3,
				useBuiltIns: 'usage',
				targets: {
					chrome: '58',
					ie: '11'
				},
				modules: false
			}
		]
	]
}
```

`webpack.common.js`中加入下面的配置项：

```js
{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
}
```

配置`EsLint`,`package.json`中的配置项：

```js
"eslintConfig": {
		"root": true,
		"env": {
			"node": true
		},
		"extends": [
			"plugin:vue/essential",
			"eslint:recommended"
		],
		"parserOptions": {
			"parser": "babel-eslint"
		},
		"rules": {}
	},
```

安装依赖：

```js
npm install -D eslint eslint-loader eslint-plugin-vue babel-eslint
```

`webpack.dev.js`:

```js
{
				test: /\.(js|vue)/,
				use: 'eslint-loader',
				// 在babel-loader解析前执行
				enforce: 'pre'
}
```

接下来配置`scripts`:

```shell
"scripts": {
		"serve": "webpack-dev-server --config webpack.dev.js",
		"build": "webpack --config webpack.prod.js",
		"lint": "eslint --ext .js,.vue src"
	},
```

`webpack.prod.js`:

```js
const commonConfigs = require('./webpack.common')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 *
 * @type {import("webpack").Configuration}
 *
 *
 */

const prodConfigs = {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.less$/,
				loader: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							// 大于 8K使用file-loader,需要安装file-loader作为依赖
							limit: 8,
							esModule: false
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			title: 'My App',
			templateParameters: {
				BASE_URL: './public/'
			}
		})
	]
}
module.exports = merge({}, commonConfigs, prodConfigs)

```

待优化的地方：提取`css`文件到单独的文件中并压缩。

