### webpack

#### 为什么需要模块打包工具

* 前端环境中使用es module存在浏览器的兼容性问题
* 当模块较多时，每个模块都需要一个http请求去加载
* 支持不同类型的 资源(`*.css`、`*.png`)模块（对图片的处理可以使用require()的方式等）

#### 传统的打包工具和模块化打包工具的区别

* 传统的打包工具是按不同的类型文件处理，而模块化打包工具从入口文件开始，查找对应的依赖进行处理。

* 模块化打包工具和传统的打包工具都可以处理js模块化处理和新特性的编译，不同点在于模块化打包工具还可以处理其他类型的模块

#### webpack简介

* 模块化打包任意类型的文件
* 打包过程中可以对新特性进行处理
* 可以按照不同的需求对代码进行模块化的拆分

#### webapck使用 

创建一个01-webpack-start文件然后进入文件夹
```shell
mkdir 01-webpack-start & cd 01-webpack-start
```

`index.html`文件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script type="module" src="./src/index.js"></script>
</body>

</html>
```

`index.js`文件

```js
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)

```

`heading.js`文件

```js
export default () => {
  const element = document.createElement('h2')

  element.textContent = 'Hello world'
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })

  return element
}
```

在浏览器中打开会在页面上显示一个`Hello world`字符串，点击可以弹出一个`alert`框。使用weback来对上面的引入的js文件进行打包。

首先初始化一个`package.json`文件

```shell
npm init -y
```

安装webpack所需的依赖

```shell
npm install -D webapck webpack-cli
```

运行下面的命令去打包

```shell
npx webpack
```

webpack默认会以src下`index.js`做为入口文件，打包后的内容存在dist下的`main.js`中,可以将这个命令添加到`package.json`的`scripts`中：

```shell
	"scripts": {
		"build": "webpack"
	},
```

webapck4.0之后支持零配置的方式去打包，但是我们有时候需要修改打包的配置项，可以使用配置文件的方式修改默认的配置项。创建一个`webpack.config.js`文件：

```js
//@ts-check
const path = require('path')
/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist')
	}
}
```

上面指定webpack打包的入口位置和打包后输出信息。在打包时会出现一个警告：

```shell
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

原因是因为我们没有设置mode选项，mode可以看作是对打包环境的几种预设，webpack目前支持三种：`none`、`development`	、`production`（默认值）。

* none不会在打包过程中对代码进行压缩优化，也不会添加一些调试信息。
* `development`模式打包的速度会更快，但是不会对代码进行优化，同时会添加一些调试的信息
* `production`模式会对打包进行压缩，但是打包速度会变慢。

设置mode有两种方式：

第一种：

```shell
npx webpack --mode development
```

第二种在配置文件中

```js
module.exports = {
	mode: 'none',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist')
	}
}
```

### webpack的打包过程

```js
/******/ (function(modules) { // webpackBootstrap
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

document.body.append(heading)


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
  const element = document.createElement('h2')

  element.textContent = 'Hello world'
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })

  return element
});


/***/ })
/******/ ]);
```

首先是加载的两个模块被作为函数被放入数组传入自执行函数中：

自执行函数的内容：

```js
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 	}
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 	};
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 	};
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 	};
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
```

函数内容定义了加载函数` __webpack_require__`,然后在函数上定义了一些属性，最后用加载函数加载第一个模块函数。

` __webpack_require__`函数：

```js
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```

` __webpack_require__`执行时会先去判断模块是否已经被加载过，没有加载再去执行加载，执行第一个模块函数，最后返回模块的导出对象。第一个模块函数的：

```js
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

document.body.append(heading)


/***/ })
```

这个模块执行时候首先执行`__webpack_require__.r`函数：

```js
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
```

这个函数给对象的导出属性上添加一个`__esModule`属性，表示这是一个es module模块。然后使用`__webpack_require__`加载第二个模块：

```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
  const element = document.createElement('h2')

  element.textContent = 'Hello world'
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })

  return element
});


/***/ })

```

总结：

* webpack为了使最es module代码可以兼容所有的浏览器，同时维护每个模块的都有自己的作用域，将模块转换成了一个函数。
* 函数接受三个参数`(module, __webpack_exports__, __webpack_require__)`,定义了一个加载模块函数的函数`__webpack_require__`加载模块函数。
* `_webpack_require__`函数执行的时候会对模块函数执行，同时返回导出的对象。
* 模块函数在执行的时候会在导出对象上添加``__esModule`和`default`属性









