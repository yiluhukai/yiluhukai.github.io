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

#### 使用webpack加载其他的资源

```css
// main.css

body {
	background: blueviolet;
	padding: 40px;
	min-width: 800px;
}

```

`webpack.config.js`中将入口文件改成`main.css`

```js
//@ts-check
const path = require('path')
/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	mode: 'none',
	//entry: './src/index.js',
	entry: './src/main.css',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist')
	}
}
```

```shell
npm run build
...
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
```

启动`webpack`去打包，发现报错了，原因在于webpack默认只能处理js模块文件，如果要处理其他类型的模块文件，需要使用loader,loader是webpack的核心，使用loader可以让webpack去处理其他的资源模块。

![loader工作原理](/frontEnd/webpack-loader.png)

css-loader只会去处理css文件，不会将转会后的模块添加上页面上，为了使css可以使用style-loader将css以style的形式添加到页面中：

```shell
npm install -D css-loader style-loader
```

修改webpack文件：

```js
module.exports = {
	mode: 'none',
	//entry: './src/index.js',
	entry: './src/main.css',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	}
}
```

打包后在浏览器上查看index.html,可以看到刚才的样式被以style的方式添加上了页面上。

上面我们使用css文件作为打包的入口，对于前端应用来说，更常见的是使用js文件作为入口，在我们需要资源的地方导入资源文件，此时依赖资源文件的地方不再是整个应用，而是当前的模块。

![webpack-bundle](/frontEnd/webpack-bundle.png)

`webpack.config.js`文件

```js
module.exports = {
	mode: 'none',
	entry: './src/index.js',
	//entry: './src/main.css',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	}
}
```

`index.js`文件导入css文件：

```js
import createHeading from './heading.js'
import './main.css'
const heading = createHeading()

document.body.append(heading)

```

打包后样式依然存在。

webpack处理图片资源，在index.js中导入图片资源

```js

import createHeading from './heading.js'
import './main.css'
import logo from './logo.png'
const heading = createHeading()

document.body.append(heading)

const img = new Image()

img.src = logo

document.body.append(img)
```

安装处理文件资源的`loader`.

```shell
npm install -D file-loader
```

在webpack中加入如下的内容：

```js
{
				test: /\.png$/,
				use: ['file-loader']
}
```

```shell
npm run build
serve .
```

在页面中打开发现图片不显示，原因是我们打包的过程中没有处理`index.html`文件，而我们以项目的根目录作为网站的根目录，而webpack打包后会将所有的文件放在网站的根目录下面(`dist/`),所以当我们去获取图片资源的时候就会缺少`dist/`目录。处理办法就是在`webpack.config.js`中加入publicPath选项：

```js
output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist'),
		publicPath: 'dist/'
	},
```

重新打包后就可以显示图片了。我们知道webpack会讲资源文件转化为js模块在项目中使用，那么file-loader是如何处理的呢 ？我们导出的图片文件会被转化成js模块导入,`81cc72c63caf7ed30b381766d3df0456.png`是复制我们导入的图片文件到`dist/`并且重新命名。

```js
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "81cc72c63caf7ed30b381766d3df0456.png");

/***/ })

```

```js
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
```

`__webpack_require__.p `是我们配置的publicPath.

```js
/* harmony import */ var _logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);



const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

document.body.append(heading)

const img = new Image()

img.src = _logo_png__WEBPACK_IMPORTED_MODULE_2__["default"]

```

使用的时候我们导入这个模块实质上是导入的图片的路径。

#### Data Urls和url-loader

**Data URLs**，即前缀为 `data:` 协议的URL，其允许内容创建者向文档中嵌入小文件。

![data ulrs格式](/frontEnd/data-urls.png)

表示文本数据：

![data-urls-text](/frontEnd/data-urls-text.png)

表示图片数据:

![data-urls-png](/frontEnd/data-urls-png.png)

使用url-loader可以任意文件类型转化为`data urls`类型，与file-loader对文件做copy来讲，url-loader会将转化后的文件内容以`data-urls`形式放入模块中。

```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAACLlBMVEVMaXFBuINBuIM8enI/fVXv5pzGNfrZxL7gYbCvSs9hX7EOetgXPAz2V....Wquhn3Bw2BfrT7DviRJkiRJkiRJkiRJkiRJkiQNszucKAuToL+DiQAAAABJRU5ErkJggg==");

/***/ })
```

这样子带来的好处会减少资源文件的请求次数，但是当文件过大时，会导致打包后的包文件过大。所以：

* 小文件使用url-loader转换，可以减少请求次数
* 大文件使用file-loader转化，可以提高加载的速度。

使用url-loader加载图片

```shell
npm install -D url-loader 
```

```js
  {
				test: /\.png$/,
				use: ['url-loader']
	}
```

如果想用url-loader处理小文件，file-loader处理大文件可以这么配置

```js
{
				test: /\.png$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10 * 1024 // 10KB
					}
				}
}
```

当文件大于10kB时url-loader会使用file-loader去处理图片文件，所以需要安装file-loader依赖。

#### 资源加载器的分类

* 编译转换类

  ![css-loader](/frontEnd/loader1.png)

* 文件操作类

  ![file-loader](/frontEnd/loader2.png)

* 代码检查类

  ![file-loader](/frontEnd/loader3.png)

#### webpack和ES 2015

webpack会默认处理模块中的import和export关键字，但是并不会处理其他的ES2015的语法，如果要对ES 2015的语法做转换，需要使用babel-loader配合babel去对代码做转换。

安装`babel-loader`和`babel`的依赖：

```shell
npm install babel-loader @babel/core @babel-preset-env -D
```

 然后配置`webpack`

```js
{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
}
```

#### webpack触发模块加载的方式

* js文件

  * 支持 ES Modules 的 import 声明

  ```js
  // // 1. 支持 ES Modules 的 import 声明
  // ////////////////////////////////////////////////////////////////////////////////
  
  import createHeading from './heading.js'
  import better from './better.png'
  import './main.css'
  
  const heading = createHeading()
  const img = new Image()
  img.src = better
  document.body.append(heading)
  document.body.append(img)
  ```

  * 支持 CommonJS 的 require 函数

    ```js
    // // 2. 支持 CommonJS 的 require 函数
    // ////////////////////////////////////////////////////////////////////////////////
    
    const createHeading = require('./heading.js').default
    const better = require('./better.png')
    require('./main.css')
    
    const heading = createHeading()
    const img = new Image()
    img.src = better
    document.body.append(heading)
    document.body.append(img)
    ```

  * AMD规范中的require和define函数

    ```js
    // // 3. 支持 AMD 的 require / define 函数
    // ////////////////////////////////////////////////////////////////////////////////
    
    // define(['./heading.js', './better.png', './main.css'], (createHeading, better) => {
    //   const heading = createHeading.default()
    //   const img = new Image()
    //   img.src = better
    //   document.body.append(heading)
    //   document.body.append(img)
    // })
    
    // require(['./heading.js', './better.png', './main.css'], (createHeading, better) => {
    //   const heading = createHeading.default()
    //   const img = new Image()
    //   img.src = better
    //   document.body.append(heading)
    //   document.body.append(img)
    //})
    ```

* css文件中

  * @import指令
  * url("")

  ```js
  @import url(reset.css);
  /*css-loader 同样支持 sass/less 风格的 @import 指令*/
  /*@import 'reset.css';*/
  
  body {
    min-height: 100vh;
    background: #f4f8fb;
    background-image: url(background.png);
    background-size: cover;
  }
  ```

  * 需要css-loader和file-loader去处理css和图片

* html文件中

  * src
  * href

  ```js
  <footer>
    <!-- <img src="better.png" alt="better" width="256"> -->
    <a href="better.png">download png</a>
  </footer>
  ```

  * 需要html-loader

    ```js
     {
            test: /.html$/,
            use: {
              loader: 'html-loader',
              options: {
                attrs: ['img:src', 'a:href']
              }
            }
      }
    ```

#### webpack的工作原理

* webpack是一个模块打包工具。

![webpack](/frontEnd/webpack-work.png)

* 打包的过程是从一个入口文件开始去查找它的依赖项，将所有的依赖转成一个树，将树中的不同模块使用不同的loader启用处理，将所有的结果放到bundle.js中。

![webpack](/frontEnd/webpack-work-process.png)

#### 开发一个自己的loader

我们要实现一个处理markdown文件的loader.首先我们需要明确loader的一些特性：

* loader应该是一个npm包
* loader是一种管道思想实现的，多个loader可以配合使用
* loader负责文件从输入到输出的转换

为了简单期间我们在项目的根目录下创建一个loader文件，而不是发布一个npm的包。

```shell
mkdir 03-webpack-loader & cd 03-webpack-loader
npm init -y
```

目录树如下：

```shell
├── dist
│   └── bundle.js
├── hello.md
├── index.html
├── markdown-loader.js
├── package-lock.json
├── package.json
└── webpack.config.js
```

* dist目录是打包后的内容

* hello.md文件

  ```markdown
  #### Hello
  
  ​```js
  console.log('hello')
  ​```
  ```

* `index.html`中引入了打包后的内容：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  <body>
      <script src="./dist/bundle.js"></script>
  </body>
  
  </html>
  
  ```

* `markdown-loader`

  ```js
  /**
   *
   * 接受要转换的内容，返回转化后的内容
   *
   */
  module.exports = source => {
  	return source
  }
  ```

* `webpack.config.js`:

  ```js
  //@ts-check
  const path = require('path')
  /**
   * @type {import("webpack").Configuration}
   */
  module.exports = {
  	mode: 'none',
  	entry: './hello.md',
  	//entry: './src/main.css',
  	output: {
  		filename: 'bundle.js',
  		// 绝对路径
  		path: path.join(__dirname, 'dist'),
  		publicPath: 'dist/'
  	},
  	module: {
  		rules: [
  			{
  				test: /\.md$/,
  				use: ['./markdown-loader']
  			}
  		]
  	}
  }
  ```

* 安装`webpack`和`webpack-cli`作为依赖：

  ```shell
  npm install -D webpack webpack-cli
  ```

执行`npm run build`去启动webpack.发现会报错：

```shell
ERROR in ./hello.md 1:29
Module parse failed: Unexpected character '#' (1:29)
File was processed with these loaders:
 * ./markdown-loader.js
You may need an additional loader to handle the result of these loaders.
> module.exports = console.log(#### Hello
```

原因在于我们经过loader处理的内容最终要放入js的模块中，所以我们可以将结果转成js语句或者经过其他的loader转换成js模块。修改`markdown-loader`:

```js
/**
 *
 * 接受要转换的内容，返回转化后的内容
 *
 */
module.exports = source => {
	//#### Hello

	//```js
	//console.log('hello')
	//```
	console.log(source)
	return `console.log("hello")`
}
```

打包后的结果：

```js
/***/ (function(module, exports) {

console.log("hello")

/***/ })
```

可以看到我们返回的结果会作为函数的内容包含的函数中。

我们安装`marked`包去转换`markdown`的内容。

```shell
npm install -D marked
```

修改我们的loader：使用`JSON.stringify`处理html是为了避免语法错误

```js
/**
 *
 * 接受要转换的内容，返回转化后的内容
 *
 */
const marked = require('marked')
module.exports = source => {
	//#### Hello

	//```js
	//console.log('hello')
	//```
	const html = marked(source)
	return `module.exports = ${JSON.stringify(html)}`
}
```

转化后的模块：

```js
/***/ (function(module, exports) {

module.exports = "<h4 id=\"hello\">Hello</h4>\n<pre><code class=\"language-js\">console.log(&#39;hello&#39;)\n</code></pre>\n"

/***/ })
/******/ ]);
```

也可以使用ES module的方式导出：

```js
const marked = require('marked')
module.exports = source => {
	const html = marked(source)
	return `export default ${JSON.stringify(html)}`
}
```

导入后的内容：

```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<h4 id=\"hello\">Hello</h4>\n<pre><code class=\"language-js\">console.log(&#39;hello&#39;)\n</code></pre>\n");

/***/ })
```

上面我们使用方式使用loader返回js语句的形式。

![loader](/frontEnd/one-loader.png)

我们还可以将我们的loader的结果交给其他的loader去处理

![loader](/frontEnd/mult-loaders.png)

```shell
npm install -D html-loader
```

`webpack.config.js`文件：

```js
	module: {
		rules: [
			{
				test: /\.md$/,
				use: ['html-loader', './markdown-loader']
			}
		]
	}
```

html处理后的结果：

```js
/***/ (function(module, exports) {

module.exports = "<h4 id=\"hello\">Hello</h4>\n<pre><code class=\"language-js\">console.log(&#39;hello&#39;)\n</code></pre>\n";

/***/ })
```

#### webpack的plugin

wepack中loader专注于对不同类型的资源文件的加载，而plugin则负责处理其他的自动化任务。

#### 清除输出目录的插件

我们使用webpack打包输出的文件在下一次打包时，只会覆盖输出目录中的同名文件，如果我们想每次打包都只包含该次打包的内容，我们需要使用`clean-webpack-plugin`去清除打包输出文件。

安装`clean-webpack-plugin`插件：

```shell
npm install -D clean-webpack-plugin
```

在配置文件中使用该插件：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	....
  ,
	plugins: [new CleanWebpackPlugin()]
}
```

#### 自动生成包含打包后内容的html文件

之前我们项目项目中创建的index.html文件，然后在文件中引入打包后的内容。这中硬编码的方式存在以下的问题：

* `index.html`和打包后的内容部署时都需要复制出去。
* 当我们修改打包后的输出信息后，我们还需要去修改`index.html`中的引入信息

我们可以借助`html-webpack-plugin`去解决这些问题：

```shell
npm i --save-dev html-webpack-plugin@4
```

在`webpack.config.js`文件中引入并使用：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	mode: 'none',
	entry: './hello.md',
	//entry: './src/main.css',
	output: {
		filename: 'bundle.js',
		// 绝对路径
		path: path.join(__dirname, 'dist'),
		publicPath: 'dist/'
	},
	module: {
		rules: [
			{
				test: /\.md$/,
				use: ['html-loader', './markdown-loader']
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		//index.html配置
		new HtmlWebpackPlugin()
	]
}
```

执行打包命令后会在dist目录下生成`index.html`文件：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
  <script src="dist/bundle.js"></script></body>
</html>
```

现在html都在dist目录下，但是我们的引入路径中却多了一个dist目录，原因是我们之前的`index.html`和打包后的内容不在同一路径下，我们加了`publicPath: 'dist/'`,只需要主调该选项即可。

同时我们可以对我们最终输出的html文件作一些配置：

```js
//index.html配置
	new HtmlWebpackPlugin({
			title: 'html-webpack-plugin',
			meta: {
				viewport: 'width=device-width'
			}
	})
```

生成的html文件:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>html-webpack-plugin</title>
  <meta name="viewport" content="width=device-width"></head>
  <body>
  <script src="bundle.js"></script></body>
</html>
```

对于复杂的配置，还可以通过模版文件的形式实现：

```js
new HtmlWebpackPlugin({
			title: 'Webpack Plugin Sample',
			content: 'custom content',
			meta: {
				viewport: 'width=device-width'
			},
			template: './index.html'
})
```

模版html文件(模版文件中动态内容可以通过loadsh模版的语法来动态生成)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <%= htmlWebpackPlugin.options.title %> </title>
</head>

<body>
</body>

</html>
```

生成的html文件：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Webpack Plugin Sample </title>
<meta name="viewport" content="width=device-width"></head>

<body>
<script src="bundle.js"></script></body>

</html>
```

输入多个文件可以通过配置多个插件实例来实现：

```js
    new HtmlWebpackPlugin({
          title: 'Webpack Plugin Sample',
          content: 'custom content',
          meta: {
            viewport: 'width=device-width'
          },
          template: './index.html'
        }),
		new HtmlWebpackPlugin({
			title: 'About',
			filename: 'about.html'
		})
```

默认的filename是`index.html`,所以第一个配置生成的`index.html`，而第二个生成的是`about.html`

#### copy静态资源到输出目录

项目中的有些静态资源需要拷贝的输出目录下，负责会找不到资源文件，对于这类需求，我们可以使用`copy-webpack-plugin`插件：

```shell
npm install -D copy-webpack-plugin
```

使用时只需要指定copy文件的目录即可：

```js
new CopyWebpackPlugin(['public'])
```

#### 自定义webpack的插件

weback的插件是通过钩子机制实现的，在webpack打包的不同节点上将插件挂载到钩子上去完成特定的任务。接下来我们自定义一个插件：

![webpack-hoos](/frontEnd/webpack-hooks.png)

首先我们需要明白插件是函数或者是一个函数apply方法的对象。函数或者apply方法中将任务挂载到钩子上。webpack的[钩子函数](https://v4.webpack.js.org/api/compiler-hooks/#emit)

```js

/**
 * @type {import('webpack').Plugin}
 */
class MyPlugin {
	/**
	 *
	 * @param { import('webpack').Compiler } compiler
	 */
	apply(compiler) {
		//Executed right before emitting assets to output dir.
		compiler.hooks.emit.tap('myPlugin', function (compilation) {
			for (const name in compilation.assets) {
				// output filename
				//bundle.js
				// index.html
				// about.html
				// logo.png
				//console.log(name)
				// source
				//console.log(compilation.assets[name].source())

				//对输出到js文件的内容中的注释处理
				if (name.endsWith('.js')) {
					// 利用正则表示表达式去替换
					const contents = compilation.assets[name].source()
					const widthoutContents = contents.replace(/\/\*\*\*+\//g, '')
          // 重新定义source()和size()
					compilation.assets[name] = {
						source: () => widthoutContents,
						size: () => widthoutContents.length
					}
				}
			}
		})
	}
}
```

webpack运行时使用插件的大概过程：

```js
const webpack = require('webpack'); //to access webpack runtime
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function(err, stats) {
  // ...
});
```







