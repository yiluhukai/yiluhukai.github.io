#### 使用webpack去增强开发体验

对于理想的开发环境：

* 我们需要一个开发服务器去更接近生产环境使用打包后的代码

* 修改源代码后实时更新页面

* 当页面出错了时，使用sourceMap定位错误

为了增强开发体验，我们可以使用`watch`模式去监视要打包的文件，当文件修改后自动去打包,使用`watch`模式很简单，如下

```js
"build": "webpack --watch"
```

但是这样子只能解决自动打包的问题，并不能解决实时刷新页面的问题。如果想自动刷新页面，我们可以使用`browser-sync`去监听打包后的内容：

```shell
npm install -g browser-sync
browser-sync dist --files "**/*"
```

这样子就可以让解决自动刷线浏览器的问题，但是做样子存在以下几一个问题：

* 操作比较麻烦，需要启动开发服务器和启动webpack打包的问题
* 运行比较缓慢，每次刷新页面都要webpack先将文件打包到dist目录

官方提供了一个webpack-dev-server的包，可以完美解决上面的两个问题：

```shell
npm install -D webpack-dev-server
npx webpack-dev-server
```

`webpack-dev-server`在执行的时候，会自动以`watch`模式启用webpack,同时打包的内容位于内存，服务器从每次中读取数据发送到用户的浏览器中。

```shell
npx webpack-dev-server --open
```

这样子执行命令的时候就会自动打开默认浏览器。

#### 执行额外的静态资源路径

之前我们对于不参与打包的静态文件时直接使用`copy-webpack-plugin`去处理的。但是每次打包都要去复制资源文件，这样子会导致打包变慢。所以这个插件更适合生产环境打包使用。当我们不在开发阶段使用这样插件，那么就会存在静态文件资源找不到的问题，为了解决这个问题，`webpack dev-serser`提供了contentBase去指定静态资源的路径：

```js
// webpack.config.js
devServer: {
		contentBase: './public'
}
```

#### 配置api服务代理

我们在开发的时候服务器是`http:localhost`，而我们的api可能位于其他地址，这个时候就存在跨域问题。`webpack-dev-server`中提供了一个代理的方式解决这个问题，配置代理：

```js
devServer: {
		contentBase: './public',
		proxy: {
			// 需要匹配的请求路径
			'/api': {
				//http://localhost:8080/api/users -> http://api.github.com/api/users
				target: 'http://api.github.com/users',
				//http://localhost:8080/api/users -> http://api.github.com/api/users
				pathRewrite: {
					'^/api': ''
				},
				// 不设置的话api服务器便可以从origin中获取到http://localhost:8080/
				changeOrigin: true
			}
		}
	}
```

#### Source Map

我们使用构建工具将代码打包后在浏览器中执行，打包后的代码会被压缩等，当我们需要调试代码的时候，看到的是编译后的代码，调试起来很麻烦，为了更好的调试效果，可以在编译后的代码中引入对应的Source Map文件，这样子就可以看到源文件。

* Source Map文件以JSON格式记录了源代码和打包后代码的映射关系
* 可以在编译后的代码中引入映射文件，然后在浏览器中调试

在`index.html`文件中引入`jquery.min.js`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Source Map 示例</title>
</head>
<body>
  <p>
    打开 Chrome 开发人员工具，确保开启了 Source Map 功能，
    尝试断点调试
  </p>
  <script src="jquery-3.4.1.min.js"></script>
  <script>
    var $body = $(document.body)
    console.log($body)
  </script>
</body>
</html>
```

`jquery-3.4.1.min.js`文件引入`Source Map`文件

```js
...
....
//# sourceMappingURL=jquery-3.4.1.min.map
```

然后在浏览器中断点调试（$()处打断点，然后进入这个函数就可以看到差别）

#### webpack中使用Source Map

`webpack.config.js`

```js
module.exports = {
	mode: 'none',
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist')
	},
	devtool: 'source-map',
 	... 
}  

```

当我们的代码中有错误在控制台输出时，我们可以点击控制台错误信息直接定位到源文件：

```shell
main.js:5 Uncaught TypeError: console.log1 is not a function
    at Module.<anonymous> (main.js:5)
    at __webpack_require__ (bootstrap:19)
    at bootstrap:83
    at bootstrap:83
```

webpack中支持12种类型的`Source Map`,不同类型的`Source Map`在效果和效率上存在差异。

![source Map](/frontEnd/source-map.png)

`eval`模式：

```js
eval('console.log(123)//#sourceMappingURL=./foo/bar.js)')
```

上面的代码被在虚拟机中执行，通过后面的`sourceMappingURL`可以指定代码所在的路径，`eval`模式本质上就是使用eval去执行模块代码然后在代码的后面通过`//#sourceURL`的方式指定文件的位置。

```js
devtool:'eval'
```

生成的源代码：

```js
....
eval("module.exports = __webpack_require__.p + \"aaa0e8af948e470ee7dd81a36b503e18.png\";\n\n//# sourceURL=webpack:///./src/icon.png?");
```

* 优点速度快
* 缺点时不会生成`Source Map`文件，只能确定错误的文件，但是不能确定错误所在的行和列。

其他的`devtool`的配置我们通过下面的方式来测试：我们可以在`webpack.config.js`中导出数组的方式一次配置多种情况:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

const allModes = [
	'eval',
	'cheap-eval-source-map',
	'cheap-module-eval-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map'
]

module.exports = allModes.map(item => {
	return {
		devtool: item,
		mode: 'none',
		entry: './src/main.js',
		output: {
			filename: `js/${item}.js`
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: `${item}.html`
			})
		]
	}
})
```

`src`目录下的文件：

```js
// src/main.js
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)

console.log('main.js running')

console.log111('main.js running')

// src/heading.js
export default () => {
  console.log('Heading~')

  const element = document.createElement('h2')

  element.textContent = 'Hello world'
  element.classList.add('heading')
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })

  return element
}
```

打包完成后使用`serve dist`启动dist下的所有`html`文件。

打开`eval.html`,通过控制台的报错我们只能定位到保存的文件(经过编译的)：

```js
Uncaught TypeError: console.log111 is not a function
    at eval (main.js:7)
    at Module.<anonymous> (eval.js:92)
    at __webpack_require__ (eval.js:20)
    at eval.js:84
    at eval.js:87
// 点击后调入的文件
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
document.body.append(heading);
console.log('main.js running');
console.log111('main.js running');
```

打开`eval-source-map.html`文件，相对于上面的`eval`：

* `eval-source-map`会生成`source map`文件
* 可以通过定位到源文件(不经过编译的源文件)报错的，并且有行和列的信息

```js
console.log111('main.js running')main.js?56d7:9 Uncaught TypeError: console.log111 is not a function
    at eval (main.js?56d7:9)
    at Module.<anonymous> (eval-source-map.js:92)
    at __webpack_require__ (eval-source-map.js:20)
    at eval-source-map.js:84
    at eval-source-map.js:87
// 点击后弹出的页面
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)

console.log('main.js running')

```

打开`cheap-eval-source-map.html`文件，可以看到在编译后的文件报错的行：

```js
main.js?cb06:5 Uncaught TypeError: console.log111 is not a function
    at eval (main.js?cb06:5)
    at Module.<anonymous> (cheap-eval-source-map.js:92)
    at __webpack_require__ (cheap-eval-source-map.js:20)
    at cheap-eval-source-map.js:84
    at cheap-eval-source-map.js:87

//

import createHeading from './heading.js';
var heading = createHeading();
document.body.append(heading);
console.log('main.js running');
console.log111('main.js running');

```

打开`cheap-module-eval-source-map.html`文件：可以看到源文件中报错的行：

```js
main.js?56d7:9 Uncaught TypeError: console.log111 is not a function
    at eval (main.js?56d7:9)
    at Module.<anonymous> (cheap-module-eval-source-map.js:92)
    at __webpack_require__ (cheap-module-eval-source-map.js:20)
    at cheap-module-eval-source-map.js:84
    at cheap-module-eval-source-map.js:87

//

import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)

console.log('main.js running')

console.log111('main.js running')
```

* source-map 决定了能否定位到源文件切有行列的信息,且会生成`source map`文件
* eval代表我们的模块是否在eval中执行
* cheap会取消代码中列信息且不能定位到源文件，但是能增加构建速度
* module会让我们定位到源文件

比如`cheap-module-source-map.html`:不在eval中执行，会生成`source map`文件，可以定位到源代码，但是不能定位到列，可以定位到行。

```js
main.js:9 Uncaught TypeError: console.log111 is not a function
    at Module.<anonymous> (main.js:9)
    at __webpack_require__ (bootstrap:19)
    at bootstrap:83
    at bootstrap:83
// 
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)

console.log('main.js running')

console.log111('main.js running')
```

`inline-source-map`和`source-map`的区别在于`inline-source-map`会`source map`打包到构建的文件中：

```js
//`inline-source-map`
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  console.log('Heading~');
  var element = document.createElement('h2');
  element.textContent = 'Hello world';
  element.classList.add('heading');
  element.addEventListener('click', function () {
    alert('Hello webpack');
  });
  return element;
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s....



//`source-map`

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  console.log('Heading~');
  var element = document.createElement('h2');
  element.textContent = 'Hello world';
  element.classList.add('heading');
  element.addEventListener('click', function () {
    alert('Hello webpack');
  });
  return element;
});

/***/ })
/******/ ]);
//# sourceMappingURL=source-map.js.map
```

`inline-source-map`会增加打包后的代码的体积，但是可以减少请求的次数。

`hidden-source-map`会生成source map文件，但是不会主动使用注释的方式引入，一般用于第三方的库，使用者需要的时候自己引入。

`nosources-source-map` 会在控制台看到错误的文件以及行列信息，但是看不到源文件,可以更好的保护源代码：

```js
Uncaught TypeError: console.log111 is not a function
    at Module.<anonymous> (main.js:9)
    at __webpack_require__ (bootstrap:19)
    at bootstrap:83
    at bootstrap:83
// `nosources-source-map`
Could not load content for webpack:///./src/main.js (HTTP error: status code 404, net::ERR_UNKNOWN_URL_SCHEME)
```

不同环境的选择：

开发环境：

* 一般代码不会超过80个字符，所以定位到行就可以了。
* 代码经过Loader转移后不好阅读，所以需要定位到源文件
* 首次加载的速度不重要，但是后续更新代码后的打包速度更重要(使用`eval`方式再次打包更快)。

所以开发环境比较好的选择时``cheap-module-eval-source-map`

生产环境：

不建议在生产环境去定位问题，所有的问题都应该在生产环境解决，所以推荐`none`,如果非要定位问题，可以使用``nosources-source-map`去定位大致的位置。

#### 页面刷新带来的问题

我们使用`dev Server`配合`watch`可以实现修改模块重新打包并刷新页面，但是自动刷新也会带来新的问题。如我们的项目中有一个编辑器页面，可以在页面输入内容，我们想要调整输入内容的样式，我们手动修改对应的`css`文件,每当我们修改样式文件并保存，页面都会去刷新，我们需要重新输入内容。

解决上面的问题：

*  将编辑器的内容写成死的
* 将编辑器的内容保存起来，后新后重新去拿

上面的方式都需要在业务代码的之外引入新的代码。webpack提供了一种方案：`HMR(hot module replacement)`

* Hot 说明了这种方式不会影响代码的正常执行，像u盘等一样可以直接在电脑运行时实现热拔插。
* `module replacement`说明我们的实现方案是模块的替换

#### webpack中的模块热替换

在webpack中实现模块的热替换，需要在`webpack.config.js`中加入如下配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js'
  },
  devtool: 'source-map',
  devServer: {
		hot: true
	},
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Tutorial',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

*  devServer开启热更新
* 引入`webpack`模块热替换的内置插件`HotModuleReplacementPlugin`

入口文件：

```js
// main.js
import createEditor from './editor'
import background from './better.png'
import './global.css'

const editor = createEditor()
document.body.appendChild(editor)

const img = new Image()
img.src = background
document.body.appendChild(img)
```

`editor.js`:

```js
import './editor.css'

export default () => {
  const editorElement = document.createElement('div')

  editorElement.contentEditable = true
  editorElement.className = 'editor'

  console.log('editor init completed')

  return editorElement
}
```

```js
// editor.css
.editor {
	position: relative;
	padding: 10px;
	outline: 0;
	min-height: inherit;
	z-index: 1;
	color: red;
	line-height: 1.8;
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
</body>
</html>
```

启动服务后修改` editor.css`文件，发现页面没有刷新，但是样式生效了，同样修改`editor.js`，发现页面中页面回自己刷新。为什么css文件可以启用`hmr`,而`js`文件不可以，原因是有`js`的处理情况比较复杂：可以导出对象、数组、字符串等，没有很固定的模块替换方案，而`css`比较简单，只需要通过`style-loader`将样式插入到`html`文件中，所以`webpack`会自己对`css`文件做`hmr`.

```css
....
if (module.hot) {
  if (!content.locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }

  var p;

  for (p in a) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (a[p] !== b[p]) {
      return false;
    }
  }

  for (p in b) {
    if (isNamedExport && p === 'default') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!a[p]) {
      return false;
    }
  }

  return true;
};
```

 打包后的`css`,可以在浏览器中查找打包后的`css`文件，因为我们开启了`source map`.

此外，通过脚手架生成的框架项目，一般都会集成`hmr`,原因是框架的文件比较有规律，比如导出的组件是一个函数或者一个对象等，就有了通用的替换方案。






