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

```js
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

