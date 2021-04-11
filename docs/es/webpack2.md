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



