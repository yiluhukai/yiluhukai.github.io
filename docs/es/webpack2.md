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

如果想在`webpack`中对`js`文件开启`hmr`,`HotModuleReplacementPlugin`提供了一些api可供上使用,在`main.js`加入下面的代码：

```js
module.hot.accept('./editor', () => {
	console.log('editor模块热替换的处理程序')
})
```

修改了`editor.js`文件。发现我们浏览器中没有刷新，原因是我们`module.hot.accept`设置对模块热更新的替换方案。我们知道`editor`中定义的是一个函数，这个函数负责创建一个可编辑的元素。所以我们可以这么修改我们替换方案：

```js
// 保存上次的结果，在hmr生效时直接移除
let hotEditor = editor
module.hot.accept('./editor.js', () => {
	// console.log('editor模块热替换的处理程序')
	document.body.removeChild(hotEditor)
	// 重新生成一个新的editor元素
	hotEditor = createEditor()
	document.body.appendChild(hotEditor)
})
```

在`editor`区域输入文本，然后修改`editor.js`文件，发现输入的文本不见了，这是我们`hmr`处理函数的问题，原因我们删除原来的`editor`元素，新建了一个新的

`editor`元素。为了保留原来的输入内容，我们需要在删除前缓存原来的文本。

```js
// 保存上次的结果，在hmr生效时直接移除
let hotEditor = editor
module.hot.accept('./editor.js', () => {
	const value = hotEditor.innerHTML
	document.body.removeChild(hotEditor)
	hotEditor = createEditor()
	hotEditor.innerHTML = value
	document.body.appendChild(hotEditor)
})
```

然后修改`editor.js`文件会发现我们输入的内容依旧存在。通过这个例子我们就知道`webpack`为什么不会主动对我们的`js`模块作`hmr`.接下来我们对图片文件作`hmr`处理。

```js
module.hot.accept('./better.png', () => {
	img.src = background
	console.log('hmr for png')
})
```

对于图片文件，我们只需简单的对图片的src作修改即可。

#### `hmr`的注意事项

* 当我们对`devServer`的hot设置为true,我们的`hmr`处理程序报错后，页面会直接刷新，这样子不利于问题的发现，更好的方式是使用`hotOnly:true`代替`hot:true`,此时我们的文件报错时，会在控制台打印出来(修改配置后需要重新启动服务)。

* 如果我们没有开始`hmr`,那么使用`module.hot.accept`会报错，我们可以使用条件判断的方式来处理这个问题：

  ```js
  if (module.hot) {
  	let hotEditor = editor
  	module.hot.accept('./editor.js', () => {
  		const value = hotEditor.innerHTML
  		document.body.removeChild(hotEditor)
  		hotEditor = createEditor()
  		hotEditor.innerHTML = value
  		document.body.appendChild(hotEditor)
  	})
  	module.hot.accept('./better.png', () => {
  		img.src = background
  		console.log('hmr for png')
  	})
  }
  
  ```

* 我们使用`hmr`编写的多余代码不会对生产环境有影响，当我们关闭`hmr`并移除`hmr`的插件(生产环境不需要)后对代码打包(此时的mode默认是`development`).

  ```js
  // 打包后的代码
  // 保存上次的结果，在hmr生效时直接移除
  if (false) {}
  ```

  * 我们关于`hmr`的代码被处理成了上面的简单判断，当我们在生产环境打包时，可以利用`tree shaking`去除这种无用的代码。

#### webpack生产环境的优化

生产环境和开发环境有很大的不同，生产环境注重的是代码的执行效率，而开发环境注重的是开发效率。`webpck`中提供了`mode`来区分不同的打包环境，并建议我们在不同的环境中使用不同的打包配置。此外，`webpack`会在生产环境的打包中加入一些优化。

webpck主要有两种方式根据不同的环境导出不同的配置：

* 在配置文件里根据环境变量去判断，然后导出不同的配置项

  * 使用下面的命令执行：

  ```shell
  # production
  yarn webpack --env production
  # development
  yarn webpack
  ```

  ```js
  const configs = {
  	mode: 'development',
  	entry: './src/main.js',
  	output: {
  		filename: 'js/bundle.js'
  	},
  	devtool: 'source-map',
  	devServer: {
  		//hot: true
  		//hotOnly: true
  	},
  	module: {
  		rules: [
  			{
  				test: /\.css$/,
  				use: ['style-loader', 'css-loader']
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
  		})
  	]
  }
  // env是打包时通过命令行传入的--env 参数
  // argv打包时通过命令行传入的所有参数
  module.exports = (env, argv) => {
  	if (env === 'production') {
  		configs.mode = 'production'
  		configs.devtool = 'none'
  		// 引入生产环境需要的插件
  		configs.plugins = [...configs.plugins, new CleanWebpackPlugin(), new CopyPlugin(['public'])]
  	}
  	return configs
  }
  ```

* 为不同的运行环境配置单独的打包文件

  ```js
  // 公共的配置项
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  module.exports = {
  	mode: 'development',
  	entry: './src/main.js',
  	output: {
  		filename: 'js/bundle.js'
  	},
  	module: {
  		rules: [
  			{
  				test: /\.css$/,
  				use: ['style-loader', 'css-loader']
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
  		})
  	]
  }
  ```

  ```js
  // webpack.dev.js
  const common = require('./webpack.common')
  const { merge } = require('webpack-merge')
  // @ts-ignore
  module.exports = merge(common, {
  	devtool: 'source-map',
  	mode: 'development',
  	devServer: {
  		//hot: true
  		// hotOnly: true
  	}
  })
  
  ```

  ```js
  // webpack.prod.js
  const common = require('./webpack.common')
  const { merge } = require('webpack-merge')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const CopyPlugin = require('copy-webpack-plugin')
  
  // @ts-ignore
  module.exports = merge(common, { mode: 'production', plugins: [new CleanWebpackPlugin(), new CopyPlugin(['public'])] })
  
  ```

  * `merge`函数的效果类似于`lodash`中的`merge`函数，可以用来合并两个对象
  * 执行命令时需要指定打包的配置文件

  ```js
  	"scripts": {
  		"build:dev": "webpack --config webpack.dev.js",
  		"build:prod": "webpack --config webpack.prod.js"
  	}
  ```

  `webpack`在生产模式下会开启一些打包优化，我们接下来看一下常见的优化配置：

* `DefinePlugin`插件
  * 这个插件是`webpack`的内置插件
  * 这个插件会为我们注入一个常量：`process.env.NODe_ENV`，很多插件会依赖这个常量执行，如判断是否需要打印日志等
  * 我们可以自己使用这个插件来替换一些全局变量,如替换接口的api的路径等
  * 配置项的值需要是一个可执行的js代码段,可以使用`JSON.stringify('hello')//""hello""`来构建一个值

```js

plugins: [
		...
		new DefinePlugin({
			base_url: '"http://localhost/api"'
		})
	]
```

```js
// main.js
console.log(base_url)

// 打包后
console.log("http://localhost/api")
```

* Tree-shaking(摇树) 
  * Tree-shaking会在生产模式下自动开启
  * Tree-shaking会删除代码中的无用代码(从树上摇落枯黄的叶子)
  * Tree-shaking是一组功能搭配使用后的结果

* Tree-shaking的使用

```js
//src/components.js

export const Button = () => {
  return document.createElement('button')
	// 无用代码
  console.log('dead-code')
}
// 无用代码
export const Link = () => {
  return document.createElement('a')
}
// 无用代码
export const Heading = level => {
  return document.createElement('h' + level)
}
```

```js
// src/index.js
import { Button } from './components'

document.body.appendChild(Button())
```

```js
//webpack.config.js

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true
  }
}
```

上面的`components.js`包含了很多无用的代码，我们使用`tree-shaking`去除无用的代码，首先将`mode`设置为`none`,`production`模式下回自己开启`tree-shaking`.首先只使用` usedExports: true`,运行打包后得到的结果是：

```js

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
/* unused harmony export Link */
/* unused harmony export Heading */
const Button = () => {
  return document.createElement('button')
	// 灰色
  console.log('dead-code')
}
// 灰色
const Link = () => {
  return document.createElement('a')
}
//灰色
const Heading = level => {
  return document.createElement('h' + level)
}


/***/ })
/******/ ]);
```

可以看到打包后的模块中只有`Button`模块被导出了，其他的模块不会被导出且会被标记成灰色。为了在打包后删除无用的代码，我们需要加入`minimize: true`的配置到`optimization`,打包后的结果：

```js
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=n(1);document.body.appendChild(Object(r.a)())},function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));const r=()=>document.createElement("button")}]);
```

打包后的代码被压缩到一行中，其中被标记未使用的代码被移除掉了。所以：

* `usedExports: true`在`tree-shaking`中扮演的标记"枯树叶"的角色
* `minimize: true`在`tree-shaking`中扮演的是"摇树"的工作

#### Scope Hoisting(作用域提升)

* 使用这个特性可将代码尽可能的合并到一个模块中，配合``minimize: true`可以将代码的体积压缩到更小

使用：

```js
	optimization: {
		// 模块只导出被使用的成员
		// usedExports: true,
		// 尽可能合并每一个模块到一个函数中
		concatenateModules: true,
		// 压缩输出结果
		//minimize: true
	}
```

查看打包后的结果：

```js
/******/ (function(modules) { // webpackBootstrap
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/components.js
const Button = () => {
  return document.createElement('button')

  console.log('dead-code')
}

const Link = () => {
  return document.createElement('a')
}

const Heading = level => {
  return document.createElement('h' + level)
}

// CONCATENATED MODULE: ./src/index.js


document.body.appendChild(Button())


/***/ })
/******/ ]);
```

可以看到将模块合并到一个模块中，不器用压缩特性是为了让打包的结果更直观，实际使用中应该启用压缩特性。

#### babel-loader造成tree-shaking失效

在早起的webpack中使用`babel-loader`和`tree-shaking`会造成tree-shaking失效，原因tree-shaking特性只会在`es-module`模块下生效，而`babel-loader`配置了将`es-module`转成`CommonJS`模块的特性插件：

```json
//package.json
{
	"name": "29-tree-shaking",
	"version": "0.1.0",
	"main": "index.js",
	"author": "zce <w@zce.me> (https://zce.me)",
	"license": "MIT",
	"scripts": {
		"build": "webpack"
	},
	"devDependencies": {
		"webpack": "^4.41.2",
		"webpack-cli": "^3.3.9",
		"@babel/core": "^7.6.4",
		"@babel/preset-env": "^7.6.3",
		"babel-loader": "^8.0.6"
	}
}
```

```js
module.exports = {
	mode: 'none',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							// 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
							// ['@babel/preset-env', { modules: 'commonjs' }]
							// ['@babel/preset-env', { modules: false }]
							// 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
							['@babel/preset-env', { modules: 'auto' }]
						]
					}
				}
			}
		]
	},
	optimization: {
		// 模块只导出被使用的成员
		usedExports: true
		// 尽可能合并每一个模块到一个函数中
		//concatenateModules: true
		// 压缩输出结果
		//minimize: true1`
	}
}
```

查看`babel-loader`源码：

```js
//injectCaller.js
module.exports = function injectCaller(opts, target) {
  if (!supportsCallerOption()) return opts;
  return Object.assign({}, opts, {
    caller: Object.assign({
      name: "babel-loader",
      // Provide plugins with insight into webpack target.
      // https://github.com/babel/babel-loader/issues/787
      target,
      // Webpack >= 2 supports ESM and dynamic import.
      supportsStaticESM: true,
      supportsDynamicImport: true,
      // Webpack 5 supports TLA behind a flag. We enable it by default
      // for Babel, and then webpack will throw an error if the experimental
      // flag isn't enabled.
      supportsTopLevelAwait: true
    }, opts.caller)
  });
}; // TO
```

`supportsStaticESM`配置中模式是支持`ES Module`的，然后查看`@babel-preset-env`下的源码：

```js
 shouldTransformESM: modules !== "auto" || !(api.caller != null && api.caller(supportsStaticESM)),
```

高版本的`babel-loader`已经处理了这种问题，为了复现这个问题，我们可以修改`babel-loader`中对`babel-preset-env`的配置，对`@babel/preset-env`需要将`@babel/preset-env`放入到一个数组中。

```js
	{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							// 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
						  ['@babel/preset-env', { modules: 'commonjs' }]
							// ['@babel/preset-env', { modules: false }]
							// 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
							// ['@babel/preset-env', { modules: 'auto' }]
						]
					}
				}
			}
```

这样子就会将`ES Module`转换成`CommonJS`模块，此时在使用webapck打包，会发现`tree-shaking`中配置的`usedExports: true`失效

```js
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Heading = exports.Link = exports.Button = void 0;

var Button = function Button() {
  return document.createElement('button');
  console.log('dead-code');
};

exports.Button = Button;

var Link = function Link() {
  return document.createElement('a');
};

exports.Link = Link;

var Heading = function Heading(level) {
  return document.createElement('h' + level);
};

exports.Heading = Heading;

/***/ })
/******/ ]);
```

如果不确定`babel-loader`是否开启了对`ES-module`的转化，可以对`@babel/preset-env`作如下的配置：

```js
presets: [					
							// 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
							// ['@babel/preset-env', { modules: 'auto' }]
					]

```

#### SideEffects(副作用)

副作用指的是模块除了导出之外成员之外，还做了其他的事情。

```js
// src/components/button.js

export default () => {
  return document.createElement('button')

  console.log('dead-code')
}
```

```js
// src/components/heading.js
export default level => {
  return document.createElement('h' + level)
}

```

```js
// src/components/link.js
export default () => {
  return document.createElement('a')
}
```

```js
// src/components/index.js
export { default as Button } from './button'
export { default as Link } from './link'
export { default as Heading } from './heading'
```

```js
//src/index.js
import { Button } from './components'
document.body.appendChild(Button())
```

`webpack.config.js`

```js
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    // 消除代码中的副作用
    sideEffects: true
  }
}
```

此外，我们需要在`package.json`文件中标识我们的代码没有副作用。此时我们代码中没有被用到的代码的地方就会被删除。

```json
{
  "name": "31-side-effects",
  "version": "0.1.0",
  "main": "index.js",
  "author": "zce <w@zce.me> (https://zce.me)",
  "license": "MIT",
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "css-loader": "^3.2.0",
    "style-loader": "^1.0.0",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.9"
  },
  "sideEffects": false
}
```

打包后的结果：

```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


document.body.appendChild(Object(_components__WEBPACK_IMPORTED_MODULE_0__["default"])())


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
  return document.createElement('button')

  console.log('dead-code')
});
```

使用`SideEffects`优化代码的前提是保证我们的代码中真的没有副作用。如修改`/src/index.js`

```js
import { Button } from './components'

// 样式文件属于副作用模块
import './global.css'

// 副作用模块
import './extend'

console.log((8).pad(3))

document.body.appendChild(Button())

```

在文件中引入`extent.js`和`global.css`文件：

```js
// 为 Number 的原型添加一个扩展方法
Number.prototype.pad = function (size) {
  // 将数字转为字符串 => '8'
  let result = this + ''
  // 在数字前补指定个数的 0 => '008'
  while (result.length < size) {
    result = '0' + result
  }
  return result
}
```

```css
body {
  background-color: #fff;
}
```

上面的`css`文件和`js`文件都是属于有副作用的，在打包后会被移除：

```js
/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


// 样式文件属于副作用模块


// 副作用模块


console.log((8).pad(3))

document.body.appendChild(Object(_components__WEBPACK_IMPORTED_MODULE_0__["default"])())


/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
  return document.createElement('button')

  console.log('dead-code')
});

```

我们可以标识那些文件是有副作用的：

```js
function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// 为 Number 的原型添加一个扩展方法
Number.prototype.pad = function (size) {
  // 将数字转为字符串 => '8'
  let result = this + ''
  // 在数字前补指定个数的 0 => '008'
  while (result.length < size) {
    result = '0' + result
  }
  return result
}
/***/ }),
```

####  Code Splitting代码分割

webpack可以将多个文件打包后一个文件输出(减少请求数)，但是当这个文件过大时，会在应用首次加载时耗费更多的时间，同时有些模块我们没有用到也被请求过来，造成网络资源的浪费。所以有的时候我们需要对我们的代码进行分割，分割成多个模块。目前常用的分割代码的方式有：

* 多入口打包
* 动态导入打包

多入口打包一般用于根据不同页面打包到不同的包中。

```shell
├── dist
│   ├── album.bundle.js
│   ├── album.html
│   ├── index.bundle.js
│   └── index.html
├── package.json
├── src
│   ├── album.css
│   ├── album.html
│   ├── album.js
│   ├── fetch.js  // 公共模块
│   ├── global.css // 公共模块
│   ├── index.css
│   ├── index.html
│   └── index.js
├── webpack.config.js
└── yarn.lock

```

上面的两个页面`album.html`和`index.html`,我们可以在`webpack.config.js`配置多个打包入口：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ]
}
```

上面配置`chunks`的目的是为了不让打包的结果注入到同一个`html`文件中，启动`webpack`打包后，在生成两个文件：`index.bundle.js`和`album.bundle.js`,为了提取两个模块的公共部分，我们可以这么配置：

```js

optimization: {
		// 开启代码分割
		splitChunks: {
			chunks: 'all'
		}
	},
```

启用打包后会多出一个`album~index.bundle.js`文件，这个文件中就是两个模块的公共模块。

动态导入(按需引入)：

```shell

├── dist
│   ├── components.bundle.js
│   ├── index.html
│   └── main.bundle.js
├── package.json
├── src
│   ├── album
│   │   ├── album.css
│   │   └── album.js
│   ├── common
│   │   ├── fetch.js
│   │   └── global.css
│   ├── index.html
│   ├── index.js
│   └── posts
│       ├── posts.css
│       └── posts.js
├── webpack.config.js
└── yarn.lock
```

`webpack.config.js`:

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}
```

```js
//src/index.js


// import posts from './posts/posts'
// import album from './album/album'

const render = () => {
  const hash = window.location.hash || '#posts'

  const mainElement = document.querySelector('.main')

  mainElement.innerHTML = ''

  if (hash === '#posts') {
    // mainElement.appendChild(posts())
    import(/* webpackChunkName: 'components' */'./posts/posts').then(({ default: posts }) => {
      mainElement.appendChild(posts())
    })
  } else if (hash === '#album') {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
      mainElement.appendChild(album())
    })
  }
}

render()

window.addEventListener('hashchange', render)

```

上面使用`important`函数动态引入模块，配合`/* webpackChunkName: 'components' */'`魔法注释指定最终打包的文件，默认是`1.bundle.js`，`2.bundle.js`,`3.bundle.js`的形式。其中有一个文件是提取的公共文件。

使用`MiniCssExtractPlugin`插件提取`css`文件到单独的文件中，然后使用`MiniCssExtractPlugin.loader`去加载以`link`的方式加载：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
	mode: 'none',
	entry: {
		main: './src/index.js'
	},
	output: {
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					//'style-loader', 以style的方式插入文件
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Dynamic import',
			template: './src/index.html',
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin()
	]
}
```

`MiniCssExtractPlugin`k可以将`css`文件单独提取出来，但是当我们在生产环境打包，会发现`css`文件并没有压缩。这个时候我们需要` optimize-css-assets-webpack-plugin `插件来对提取出来的`css`文件进行压缩。

```shell
npm install --save-dev optimize-css-assets-webpack-plugin
```

在webpack.config.js中引入并使用：

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
.... 
plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Dynamic import',
			template: './src/index.html',
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin(),
		new OptimizeCssAssetsPlugin()
	]
```

这种配置方式对所有的打包环境都是适用的，还有一种打包方式，就是在生产环境中使用：

```js
optimization: {
		// 指定压缩使用的插件
		minimizer: [new OptimizeCssAssetsPlugin()]
},
```

在生产环境执行时，会自动使用`minimize:true`,然后利用指定的压缩器去压缩代码，但是由于我们指定了压缩器的插件，webpack就不回使用我们默认压缩`js`的压缩器，所以我们需要去加入压缩`js`的压缩器：

```shell
npm install terser-webpack-plugin --save-dev
```

将插件加入到`minimizer`中：

```js
const TerserPlugin = require("terser-webpack-plugin");
...
optimization: {
		// 指定压缩使用的插件
		minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()]
	},
```

此时就可以对`css`文件开启压缩了 。

#### webpack输出文件名hash

我们的项目部署后客户端会对静态文件进行缓存，当我们更新文件的时候 ，由于缓存的存在并不会立即生效，这个时候输出文件名的hash就派上用场了，当我们的文件名改变后，缓存的静态文件就会重新加载。输出文件名的hash适用于`webpack`中插件输出中有`filename`的地方，常用的hash有三种：

* 项目级别的`hash`

```js
....
/**
 *
 * @type {import("webpack").Configuration}
 *
 */
module.exports = {
	output: {
		filename: '[name]-[hash].bundle.js'
	},
	plugins: [
		....
		new MiniCssExtractPlugin({
			filename: '[name]-[hash].bundle.css'
		})
		//new OptimizeCssAssetsPlugin()
	]
}
```

当文件中有任何文件的修改，打包时都会生成新的`hash`.

* chunkhash

```js
module.exports = {
	output: {
		filename: '[name]-[chunkhash].bundle.js'
	},
	plugins: [
		....
		new MiniCssExtractPlugin({
			filename: '[name]-[chunkhash].bundle.css'
		})
		//new OptimizeCssAssetsPlugin()
	]
}
```

文件中有三种chunk:入口文件，动态引入的模块，由于`css`文件被单独提取出来，他和`js`文件是一路chunk,所`chunkhash`相同。

```js
// index.js
const render = () => {
	const hash = window.location.hash || '#posts'

	const mainElement = document.querySelector('.main')

	mainElement.innerHTML = ''

	if (hash === '#posts') {
		// mainElement.appendChild(posts())
		import(/* webpackChunkName: 'posts' */ './posts/posts').then(({ default: posts }) => {
			mainElement.appendChild(posts())
		})
	} else if (hash === '#album') {
		// mainElement.appendChild(album())
		import(/* webpackChunkName: 'album' */ './album/album').then(({ default: album }) => {
			mainElement.appendChild(album())
		})
	}
}

render()

window.addEventListener('hashchange', render)
```

当我们修改`index.js`文件，之后修改`index.js`对应文件的`chunkhash`,我们修改`posts`模块的文件，`posts`对应的`js`、`css`文件的`hash`改变。同时`index.js`对应的`hash`也改变，这是因未对`posts`的引入路径的修改导致的。

* `contenthash`

文件级别的`hash`,hash是根据文件的内容来生成的，只有文件的内容修改了才会重新生成`hash`.修改`index.js`文件，只会改动`index.js`的`hash`，修改`posts`下`css`的hash,只会改变`posts`打包后`css`的`hash`,不会改变`js`的`hash`,同时入口文件的`hash`回受`css`引入路径的改变`hash`改变。

```js

module.exports = {
	output: {
		filename: '[name]-[chunkhash].bundle.js'
	},
	plugins: [
		....
		new MiniCssExtractPlugin({
			filename: '[name]-[chunkhash].bundle.css'
		})
		//new OptimizeCssAssetsPlugin()
	]
}
```

基本上使用`chunkhash`就可以精准控制到文件改变。同时上面的三种`hash`还支持设置`hash`长度：

```js
module.exports = {
	output: {
		filename: '[name]-[chunkhash:8].bundle.js'
	},
	plugins: [
		....
		new MiniCssExtractPlugin({
			filename: '[name]-[chunkhash:8].bundle.css'
		})
		//new OptimizeCssAssetsPlugin()
	]
}

```

































