#### webpack源码分析

使用`webpack`构建一个简单的单文件打包项目，目录结构如下：

```shell
├── dist
│   ├── built.js
│   └── index.html
├── package-lock.json
├── package.json
├── src
│   ├── index.html
│   └── index.js
└── webpack.config.js
```

`index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
</head>

<body>

</body>

</html>
```

`index.js`:

```js
console.log('index.js内容')

module.exports = '入口文件导出内容'

```

`webpack.config.js`:

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'none',
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: path.resolve('dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

构建的结果分析：

```js
// dist/build.js

(function (modules) { // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  // 下面的这个方法就是 webpack 当中自定义的，它的核心作用就是返回模块的 exports 
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  /************************************************************************/
  ({
    "./src/index.js":
      /*! no static exports found */
      (function (module, exports) {
        console.log('index.js内容')
        module.exports = '入口文件导出内容'
      })
  });
```

 * 打包后的文件就是一个函数自调用，当前函数调用时传入一个对象
 * 这个对象我们为了方便将之称为是模块定义，它就是一个键值对
 * 这个键名就是当前被加载模块的文件名与某个目录的拼接（）
 * 这个键值就是一个函数，和 node.js 里的模块加载有一些类似，会将被加载模块中的内容包裹于一个函数中
 * 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作
 * 针对于上述的代码就相当于是将 {}（模块定义） 传递给了 modules

代码的具体执行过程可以通过断点调试的方式查看。

接下来我们在入口文件中引入其他的模块，对打包的内容进行分析：

```js
// src/index.js

let name = require('./login.js')

console.log('index.js内容执行了')
console.log(name)

```

`login.js`

```js
module.exports = 'hello'
```

打包后的结果分析：

```js
;(function (modules) {
	// webpackBootstrap
	// The module cache
	// 定义对象用于缓存已加载过的模块
	var installedModules = {}

	// The require function
	// webpack 自定义的一个加载方法，核心功能就是返回被加载模块中导出的内容（具体内部是如何实现的，后续再分析）
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports
		}
		// Create a new module (and put it into the cache)
		var module = (installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		})

		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

		// Flag the module as loaded
		module.l = true

		// Return the exports of the module
		return module.exports
	}

	// expose the modules object (__webpack_modules__)
	// 将模块定义保存一份，通过 m 属性挂载到自定义的方法身上
	__webpack_require__.m = modules

	// expose the module cache
	__webpack_require__.c = installedModules

	// Object.prototype.hasOwnProperty.call
	// 判断被传入的对象 obj 身上是否具有指定的属性 **** ,如果有则返回 true
	__webpack_require__.o = function (object, property) {
		return Object.prototype.hasOwnProperty.call(object, property)
	}

	// define getter function for harmony exports
	__webpack_require__.d = function (exports, name, getter) {
		// 如果当前 exports 身上不具备 name 属性，则条件成立
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter })
		}
	}

	// define __esModule on exports
	__webpack_require__.r = function (exports) {
		// 下面的条件如果成立就说明是一个  esModule
		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			// Object.prototype.toString.call(exports)
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
		}
		// 如果条件不成立，我们也直接在 exports 对象的身上添加一个 __esModule 属性，它的值就是true
		Object.defineProperty(exports, '__esModule', { value: true })
	}

	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function (value, mode) {
		// 01 调用 t 方法之后，我们会拿到被加载模块中的内容 value
		// 02 对于 value 来说我们可能会直接返回，也可能会处理之后再返回
		if (mode & 1) value = __webpack_require__(value)
		if (mode & 8) return value
		if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value
		var ns = Object.create(null)
		__webpack_require__.r(ns)
		Object.defineProperty(ns, 'default', { enumerable: true, value: value })
		if (mode & 2 && typeof value != 'string')
			for (var key in value)
				__webpack_require__.d(
					ns,
					key,
					function (key) {
						return value[key]
					}.bind(null, key)
				)
		return ns
	}

	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function (module) {
		var getter =
			module && module.__esModule
				? function getDefault() {
						return module['default']
				  }
				: function getModuleExports() {
						return module
				  }
		__webpack_require__.d(getter, 'a', getter)
		return getter
	}

	// __webpack_public_path__
	__webpack_require__.p = ''

	// Load entry module and return exports
	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})(
	/************************************************************************/
	{
		'./src/index.js':
			/*! no static exports found */
			function (module, exports, __webpack_require__) {
				let name = __webpack_require__(/*! ./login.js */ './src/login.js')
				console.log('index.js内容执行了')
				console.log(name)
			},
		'./src/login.js':
			/*! no static exports found */
			function (module, exports) {
				module.exports = 'hello'
			}
	}
)
```

可以从上面的代码中看到`webpack`记载`Common.js`的方式很简单，直接将`require`函数替换成了`__webpack_require__`:

```js
	function (module, exports, __webpack_require__) {
				let name = __webpack_require__(/*! ./login.js */ './src/login.js')
				console.log('index.js内容执行了')
				console.log(name)
			},
```

接下来我们使用`require`函数去加载`ES Module`：

```js
// src/login.js	
export default 'zcegg'
export const age = 18
```

`index.js`:

```js
let obj = require('./login.js')

console.log('index.js内容执行了')

console.log(obj.default, '---->', obj.age)

```

打包后的结果：

```js
(function(){  // Load entry module and return exports
  ....
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  /************************************************************************/
  ({
    "./src/index.js":
      (function (module, exports, __webpack_require__) {
        let obj = __webpack_require__(/*! ./login.js */ "./src/login.js")
        console.log('index.js内容执行了')
        console.log(obj.default, '---->', obj.age)

      }),
    "./src/login.js":
      (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "age", function () { return age; });
        __webpack_exports__["default"] = ('zcegg');
        const age = 18
      })
  });
```

`webpack`需要标记模块是`ES Module`:

```
__webpack_require__.r(__webpack_exports__)
```

然后将非默认导出以构造器函数的形式挂载到模块的导出对象上：

```js
 __webpack_require__.d(__webpack_exports__, "age", function () { return age; });
        __webpack_exports__["default"] = ('zcegg');
        const age = 18
```

因为闭包的缘故，这个函数可以获取对`age`的访问。模块定义中传入的函数和上面的其实是一样的，只是换了一个名称：

```js
function (module, __webpack_exports__, __webpack_require__){}
function (module, exports, __webpack_require__) {}

// 传入的参数：

var module = (installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		})

// Execute the module function
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
```

传入第一个参数是为了修改模块中的`this`.函数中的`this`在严格模式下是`undefined`.

我们接下来尝试使用`import`函数导入`CommonJS`模块。

`index.js`:

```
import name from './login.js'

console.log('index.js内容加载了')

console.log(name, '---->')
```

`login.js`:

```js
// 01 采用 cms 导出模块内容
module.exports = 'zce'
```

打包后的结果分析：

```js
(function(){
  ....
	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})(
	/************************************************************************/
	{
		/***/ './src/index.js':
			/*! no exports provided */
			/***/ function (module, __webpack_exports__, __webpack_require__) {
				'use strict'
				__webpack_require__.r(__webpack_exports__)
				/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.js */ './src/login.js')
				/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
					_login_js__WEBPACK_IMPORTED_MODULE_0__
				)
				console.log('index.js内容加载了')
				console.log(_login_js__WEBPACK_IMPORTED_MODULE_0___default.a, '---->')
				/***/
			},

		/***/ './src/login.js': /***/ function (module, exports) {
			// 01 采用 cms 导出模块内容
			module.exports = 'zce'
			/***/
		}
	}
)
```

在入口模块中，会将入口模块标记为了一个`ES Module`模块：

```js
	__webpack_require__.r(__webpack_exports__)

然后去加载模块的`login.js`模块：

​```js
	/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.js */ './src/login.js')
				/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
					_login_js__WEBPACK_IMPORTED_MODULE_0__
				)
				console.log('index.js内容加载了')
				console.log(_login_js__WEBPACK_IMPORTED_MODULE_0___default.a, '---->')
				/***/
```

`_login_js__WEBPACK_IMPORTED_MODULE_0_`是`login.js`导出的结果：`'zce'`.接下来调用`__webpack_require__.n(_login_js__WEBPACK_IMPORTED_MODULE_0__)`函数。作用就是为了模块导出以函数的'a'属性形式返回：

```js
	__webpack_require__.n = function (module) {
		var getter =
			module && module.__esModule
				? function getDefault() {
						return module['default']
				  }
				: function getModuleExports() {
						return module
				  }
		__webpack_require__.d(getter, 'a', getter)
		return getter
	}
```

我们传入的参数是一个字符串，所以`getter`是第二个函数，接下来给函数添加了一个`'a'`属性。通过这个属性去返回模块的导出。

```js
console.log(_login_js__WEBPACK_IMPORTED_MODULE_0___default.a, '---->')// ‘zce’ "--->"
```

接下来我们再用`import`导入一个`ES Module`：

`index.js`:

```js
import name, { age } from './login.js'

console.log('index.js内容加载了')

console.log(name, '---->', age)

```

`login.js`:

```js

// 02 采用 esModule 导出模块
export default 'zce'
export const age = 100
```

打包后的结果：

```js
(function(){
  ...
	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})(
	/************************************************************************/
	{
		/***/ './src/index.js': /***/ function (module, __webpack_exports__, __webpack_require__) {
			'use strict'
			__webpack_require__.r(__webpack_exports__)
			/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.js */ './src/login.js')

			console.log('index.js内容加载了')

			console.log(_login_js__WEBPACK_IMPORTED_MODULE_0__['default'], '---->', _login_js__WEBPACK_IMPORTED_MODULE_0__['age'])

			/***/
		},

		/***/ './src/login.js':
			/*! exports provided: default, age */
			/***/ function (module, __webpack_exports__, __webpack_require__) {
				'use strict'
				__webpack_require__.r(__webpack_exports__)
				/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'age', function () {
					return age
				})
				/* harmony default export */ __webpack_exports__['default'] = 'zce'
				const age = 100

				/***/
			}
	}
)
```

这个模块和使用`require`函数加载`ES Module`类似.

#### 手写webpack的打包函数

````js
;(function (modules) {
	// 01 定义一个对象用于缓存对象
	const installedModules = {}
	// 02 定义一个函数用于加载模块
	function __webpack_require__(moduleId) {
		// 判断是否已经加载过了，如果加载过了，从缓存中读取
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports
		}
		// 将模块放入缓存中
		let module = (installedModules[moduleId] = {
			i: moduleId,
			l: false, // hasloaded?
			exports: {}
		})

		// 执行模块的代码

		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

		// 修改模块为已经加载
		module.l = true
		return module.exports
	}
	// 在__webpack_require__挂在一些属性
	// 03 保存modules
	__webpack_require__.m = modules
	// 04 保存缓存对象
	__webpack_require__.c = installedModules
	// 检查对象有没有这个属性
	__webpack_require__.o = function (exports, name) {
		return Object.prototype.hasOwnProperty.call(exports, name)
	}
	// 06 给导出对象getter属性
	__webpack_require__.d = function (exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter })
		}
	}
	// 07 给对象添加ES Module标记
	__webpack_require__.r = function (exports) {
		if (typeof Symbol !== undefined && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { enumerable: true, value: 'Module' })
		}
		Object.defineProperty(exports, '__esModule', { value: true })
	}

	// 08
	__webpack_require__.t = function () {}

	//09  返回模块的默认导出 从a 属性
	__webpack_require__.n = function (module) {
		let getter =
			module && module.__esModule
				? function getDefault() {
						return module['default']
				  }
				: function getModuleExports() {
						return module
				  }
		__webpack_require__.d(getter, 'a', getter)
		return getter
	}

	// 10  publicPath
	__webpack_require__.p = ''

	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
	/***/ './src/index.js':
		/*!**********************!*\
      !*** ./src/index.js ***!
      \**********************/
		/*! no exports provided */
		/***/ function (module, __webpack_exports__, __webpack_require__) {
			'use strict'
			__webpack_require__.r(__webpack_exports__)
			/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.js */ './src/login.js')
			/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
				_login_js__WEBPACK_IMPORTED_MODULE_0__
			)

			console.log('index.js内容加载了')

			console.log(_login_js__WEBPACK_IMPORTED_MODULE_0___default.a, '---->')

			/***/
		},

	/***/ './src/login.js':
		/*!**********************!*\
      !*** ./src/login.js ***!
      \**********************/
		/*! no static exports found */
		/***/ function (module, exports) {
			// 01 采用 cms 导出模块内容
			module.exports = 'zce'

			// 02 采用 esModule 导出模块
			// export default 'zce'
			// export const age = 100

			/***/
		}

	/******/
})
````
#### 懒加载模块

`index.js`

```js
let oBtn = document.getElementById('btn')

oBtn.addEventListener('click', function () {
  import(/*webpackChunkName: "login"*/'./login.js').then((login) => {
    console.log(login)
  })
})

console.log('index.js执行了')
```

`login.js`:

```js
module.exports = "懒加载导出内容"
```

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
</head>

<body>
  <button id="btn">点击加载</button>
</body>

</html>
```

打包后的结果：

```js
;(function (modules) {
	// webpackBootstrap
	// install a JSONP callback for chunk loading
	function webpackJsonpCallback(data) {
		var chunkIds = data[0]
		var moreModules = data[1]

		// add "moreModules" to the modules object,
		// then flag all "chunkIds" as loaded and fire callback
		var moduleId,
			chunkId,
			i = 0,
			resolves = []
		for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i]
			if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				resolves.push(installedChunks[chunkId][0])
			}
			installedChunks[chunkId] = 0
		}
		for (moduleId in moreModules) {
			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId]
			}
		}
		if (parentJsonpFunction) parentJsonpFunction(data)

		while (resolves.length) {
			resolves.shift()()
		}
	}

	// The module cache
	var installedModules = {}

	// object to store loaded and loading chunks
	// undefined = chunk not loaded, null = chunk preloaded/prefetched
	// Promise = chunk loading, 0 = chunk loaded
	var installedChunks = {
		main: 0
	}

	// script path function
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + '' + chunkId + '.my-built.js'
	}

	// The require function
	function __webpack_require__(moduleId) {
		....
		return module.exports
	}

	// This file contains only the entry chunk.
	// The chunk loading function for additional chunks
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = []

		// JSONP chunk loading for javascript

		var installedChunkData = installedChunks[chunkId]
		if (installedChunkData !== 0) {
			// 0 means "already installed".

			// a Promise means "currently loading".
			if (installedChunkData) {
				promises.push(installedChunkData[2])
			} else {
				// setup Promise in chunk cache
				var promise = new Promise(function (resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject]
				})
				promises.push((installedChunkData[2] = promise))

				// start chunk loading
				var script = document.createElement('script')
				var onScriptComplete

				script.charset = 'utf-8'
				script.timeout = 120
				if (__webpack_require__.nc) {
					script.setAttribute('nonce', __webpack_require__.nc)
				}
				script.src = jsonpScriptSrc(chunkId)
			  ....
				var timeout = setTimeout(function () {
					onScriptComplete({ type: 'timeout', target: script })
				}, 120000)
				script.onerror = script.onload = onScriptComplete
				document.head.appendChild(script)
			}
		}
		return Promise.all(promises)
	}

	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules

	// expose the module cache
	__webpack_require__.c = installedModules

	// define getter function for harmony exports
	__webpack_require__.d = function (exports, name, getter) {
		...
	}

	// define __esModule on exports
	__webpack_require__.r = function (exports) {
		....
	}

	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function (value, mode) {
		....
		return ns
	}

	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function (module) {
		....
	}

	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function (object, property) {
		return Object.prototype.hasOwnProperty.call(object, property)
	}

	// __webpack_public_path__
	__webpack_require__.p = ''

	// on error function for async loading
	__webpack_require__.oe = function (err) {
		console.error(err)
		throw err
	}

	var jsonpArray = (window['webpackJsonp'] = window['webpackJsonp'] || [])
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray)
	jsonpArray.push = webpackJsonpCallback
	jsonpArray = jsonpArray.slice()
	for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i])
	var parentJsonpFunction = oldJsonpFunction

	// Load entry module and return exports
	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})(
	/************************************************************************/
	{
		/***/ './src/index.js':
			/*! no static exports found */
			/***/ function (module, exports, __webpack_require__) {
				let oBtn = document.getElementById('btn')

				oBtn.addEventListener('click', function () {
					__webpack_require__
						.e(/*! import() | login */ 'login')
						.then(__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7))
						.then(login => {
							console.log(login)
						})
				})

				console.log('index.js执行了')

				/***/
			}
	}
)
```

从打包后的结果我们可以看出来`import()`被替换成了`__webpack_require__.e`方法。然后使用`__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7)`去加载`login.js`模块的内容。当我们在页面上点击按钮后，我们会看到`<head>`中会多一个`script`脚本，并重新发起了一个对`login.built.js`的请求。

* `import()`函数可以实现指定模块的懒加载
* 懒加载的核心原理是使用`jsonp`(e方法中有体现)
* t方法可以针对内容进行不同的处理（处理方式取决于传入的mode）

`t方法分析`：

```js
__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7)
```

```js

// create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
	
  __webpack_require__.t = function (value, mode) {
    // 加载模块的内容
    if (mode & 1) value = __webpack_require__(value);
    // mode&8,直接返回加载的值（CommonJS）
    if (mode & 8) return value;
    // mode&4 直接返回加载的值（ES Module)
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    // 标记成`ES Module`
    __webpack_require__.r(ns);
    // 添加`Default`属性
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    // 当value是一个对象的时候，将对象的属性转成ns对应的getter属性
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };
```

手写`t`方法并使用：

```js
//custom_built.js
;(function (modules) {
	// 01 定义一个对象用于缓存对象
	const installedModules = {}
	// 02 定义一个函数用于加载模块
	function __webpack_require__(moduleId) {
		// 判断是否已经加载过了，如果加载过了，从缓存中读取
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports
		}
		// 将模块放入缓存中
		let module = (installedModules[moduleId] = {
			i: moduleId,
			l: false, // hasloaded?
			exports: {}
		})

		// 执行模块的代码

		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

		// 修改模块为已经加载
		module.l = true
		return module.exports
	}
	// 在__webpack_require__挂在一些属性
	// 03 保存modules
	__webpack_require__.m = modules
	// 04 保存缓存对象
	__webpack_require__.c = installedModules
	// 检查对象有没有这个属性
	__webpack_require__.o = function (exports, name) {
		return Object.prototype.hasOwnProperty.call(exports, name)
	}
	// 06 给导出对象getter属性
	__webpack_require__.d = function (exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter })
		}
	}
	// 07 给对象添加ES Module标记
	__webpack_require__.r = function (exports) {
		if (typeof Symbol !== undefined && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { enumerable: true, value: 'Module' })
		}
		Object.defineProperty(exports, '__esModule', { value: true })
	}

	// 08 懒加载使用的方法，value 代表要加载的模块名称
	// mode参数决定了我们如何处理加载后的结果

	__webpack_require__.t = function (value, mode) {
		// 加载模块
		if (mode & 1) value = __webpack_require__(value)
		// CommonJS 模块
		if (mode & 8) return value
		// ES Module
		if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value
		var ns = Object.create(null)
		// 标记成`ES Module`
		__webpack_require__.r(ns)
		// 添加default属性
		Object.defineProperty(ns, 'default', { enumerable: true, value: value })
		// mode&2 && value是个对象，将value的属性复制成ns的getter方法
		if (mode & 2 && typeof value !== 'string') {
			for (const key in value) {
				__webpack_require__.d(
					ns,
					key,
					function (key) {
						return function () {
							return ns[key]
						}
					}.bind(null, key)
				)
			}
		}
		return ns
	}

	//09  返回模块的默认导出 从a 属性
	__webpack_require__.n = function (module) {
		let getter =
			module && module.__esModule
				? function getDefault() {
						return module['default']
				  }
				: function getModuleExports() {
						return module
				  }
		__webpack_require__.d(getter, 'a', getter)
		return getter
	}

	// 10  publicPath
	__webpack_require__.p = ''

	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
	'./src/index.js': function (module, exports, __webpack_require__) {
		let name = __webpack_require__.t(/*! ./login.js */ './src/login.js', 0b0111)
		console.log('index.js执行')
		console.log(name)
	},
	'./src/login.js': function (module, exports) {
		module.exports = 'zce'
	}
})
```

使用：

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试</title>
</head>

<body>
  <button id="btn">点击加载</button>
  <script src="custom_built.js"></script>
</body>

</html>
```

控制台输入的结果：

```js
Module {defult: "zce", __esModule: true, Symbol(Symbol.toStringTag): "Module"}
```

手写`webpack`的懒加载：

```js
/*
 * @Author: yiluhuakai
 * @LastEditors: yiluhuakai
 * @Date: 2021-05-06 00:11:42
 * @LastEditTime: 2021-05-10 23:49:26
 * @FilePath: /js-code/webpack-source/08_wp_source_lazy/dist/custom_built.js
 * @Description: 手写打包的执行函数
 *
 */

;(function (modules) {
	// 12 定义一个json脚本加载时的方法
	function webpackJsonpCallback(data) {
		const chunkIds = data[0]
		const moreModules = data[1]

		// 修改chunk的加载状态
		let chunkId,
			moduleId,
			resolves = []
		for (let i = 0; i < chunkIds.length; i++) {
			chunkId = chunkIds[i]
			// chunk是自身属性且存在 == promise
			if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				//	取出对应模块promise的resolve()
				resolves.push(installedChunks[chunkId][0])
			}
			// 修改chunk的加载状态为以加载
			installedChunks[chunkId] = 0
		}

		// 将加载的chunk合并到installedModules中

		for (moduleId in moreModules) {
			// moreModules的属性
			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId]
			}
		}

		// 执行resolve()方法
		while (resolves.length) {
			resolves.shift()()
		}
	}
	// 13 定义一个变量保存chunk的加载状态
	// object to store loaded and loading chunks
	// undefined = chunk not loaded, null = chunk preloaded/prefetched
	// Promise = chunk loading, 0 = chunk loaded

	const installedChunks = {
		main: 0
	}
	// 01 定义一个对象用于缓存对象
	const installedModules = {}
	// 02 定义一个函数用于加载模块
	function __webpack_require__(moduleId) {
		// 判断是否已经加载过了，如果加载过了，从缓存中读取
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports
		}
		// 将模块放入缓存中
		let module = (installedModules[moduleId] = {
			i: moduleId,
			l: false, // hasloaded?
			exports: {}
		})

		// 执行模块的代码

		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

		// 修改模块为已经加载
		module.l = true
		return module.exports
	}
	// 在__webpack_require__挂在一些属性
	// 03 保存modules
	__webpack_require__.m = modules
	// 04 保存缓存对象
	__webpack_require__.c = installedModules
	// 检查对象有没有这个属性
	__webpack_require__.o = function (exports, name) {
		return Object.prototype.hasOwnProperty.call(exports, name)
	}
	// 06 给导出对象getter属性
	__webpack_require__.d = function (exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter })
		}
	}
	// 07 给对象添加ES Module标记
	__webpack_require__.r = function (exports) {
		if (typeof Symbol !== undefined && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { enumerable: true, value: 'Module' })
		}
		Object.defineProperty(exports, '__esModule', { value: true })
	}

	// 08 懒加载使用的方法，value 代表要加载的模块名称
	// mode参数决定了我们如何处理加载后的结果

	__webpack_require__.t = function (value, mode) {
		// 加载模块
		if (mode & 1) value = __webpack_require__(value)
		// CommonJS 模块
		if (mode & 8) return value
		// ES Module
		if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value
		var ns = Object.create(null)
		// 标记成`ES Module`
		__webpack_require__.r(ns)
		// 添加default属性
		Object.defineProperty(ns, 'default', { enumerable: true, value: value })
		// mode&2 && value是个对象，将value的属性复制成ns的getter方法
		if (mode & 2 && typeof value !== 'string') {
			for (const key in value) {
				__webpack_require__.d(
					ns,
					key,
					function (key) {
						return ns[key]
					}.bind(null, key)
				)
			}
		}
		return ns
	}

	//  11 定义全局对象的webpackJsonp
	const jsonpArr = (window['webpackJsonp'] = window['webpackJsonp'] || [])
	// 修改jsonpArr 和window['webpackJsonp']的push方法
	const oldJsonpFunction = jsonpArr.push.bind(jsonpArr)

	jsonpArr.push = webpackJsonpCallback

	//09  返回模块的默认导出 从a 属性
	__webpack_require__.n = function (module) {
		let getter =
			module && module.__esModule
				? function getDefault() {
						return module['default']
				  }
				: function getModuleExports() {
						return module
				  }
		__webpack_require__.d(getter, 'a', getter)
		return getter
	}
	// 15 jsonpScriptSr函数

	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + '' + chunkId + '.my-built.js'
	}
	// 14 定义__webpack_require__.e

	__webpack_require__.e = function (chunkId) {
		var promises = []
		var installedChunkData = installedChunks[chunkId]

		if (installedChunkData !== 0) {
			if (installedChunkData) {
				// promise
				promises.push(installedChunkData)
			} else {
				// undefined ｜｜ null
				var promise = new Promise(function (resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject]
				})
				// 将promise保存为第三个参数 并放入promises中
				promises.push((installedChunkData[2] = promise))
			}
		}

		// 创建一个script标签
		const script = document.createElement('script')

		script.src = jsonpScriptSrc(chunkId)

		document.head.appendChild(script)

		return Promise.all(promises)
	}

	// 10  publicPath
	__webpack_require__.p = ''

	return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
	/***/ './src/index.js':
		/*! no static exports found */
		/***/ function (module, exports, __webpack_require__) {
			let oBtn = document.getElementById('btn')

			oBtn.addEventListener('click', function () {
				__webpack_require__
					.e(/*! import() | login */ 'login')
					.then(__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7))
					.then(login => {
						console.log(login)
					})
			})

			console.log('index.js执行了')

			/***/
		}
})
```

* 可以使用打断点的方式查看代码的执行过程,下面是懒加载的过程：

* 重写push方法：

  ```js
  //  11 定义全局对象的webpackJsonp
  	const jsonpArr = (window['webpackJsonp'] = window['webpackJsonp'] || [])
  	// 修改jsonpArr 和window['webpackJsonp']的push方法
  	const oldJsonpFunction = jsonpArr.push.bind(jsonpArr)
  
  	jsonpArr.push = webpackJsonpCallback
  ```

* 点击按钮后执行：

  ```js
  	let oBtn = document.getElementById('btn')
  
  			oBtn.addEventListener('click', function () {
  				__webpack_require__
  					.e(/*! import() | login */ 'login')
  					.then(__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7))
  					.then(login => {
  						console.log(login)
  					})
  			})
  ```

* `__webpack_require__.e`方法主要是创建一个promise 和`installedChunks["login"]:[reslove,reject,promise]` ,然后创建一个`script`标签去加载懒加载的文件：

* 懒假的脚本加载完成后开始执行,会调用重写的push方法（`webpackJsonpCallback`）

  ```js
  // login.my-built.js
  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login"], {
    "./src/login.js":
      (function (module, exports) {
        module.exports = "懒加载导出内容"
      })
  }]);
  ```

* `webpackJsonpCallback`方法主要作用：

  * 取出`installedChunks`中保存的`resolve`函数执行
  * 将`installedChunk`中保存的模块状态修改为已加载并且合并到`modules`参数中：



