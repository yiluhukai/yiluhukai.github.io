#### 手写 webpack源码

我们之前通过对webpack打包命令的分析，发现当我们启用`webpack`去对项目进行打包时，本质上相当于执行了下面的代码：

```js
const webpack = require('webpack')

const options = require('./webpack.config.js')

const compiler = webpack(options)

compiler.run(function (err, stats) {
	console.log(err)
	console.log(stats.toJson())
})
```

通过对该代码进行断点调试，我们来实现一个简单的`webpack`打包器。先进入到`webpack函数内部`：

```js
// node_modules/webpack/lib/webpack.js
const webpack = (options, callback) => {
  
	const webpackOptionsValidationErrors = validateSchema(
		webpackOptionsSchema,
		options
	);
  // 对配置项进行校验
	if (webpackOptionsValidationErrors.length) {
		throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
	}
	let compiler;
  // 根据配置项的类型进行不同的打包操作
	if (Array.isArray(options)) {
		compiler = new MultiCompiler(
			Array.from(options).map(options => webpack(options))
		);
    // 我们的配置项是一个对象
	} else if (typeof options === "object") {
    // webpack会将传入的选项和默认选项进行合并
		options = new WebpackOptionsDefaulter().process(options);
		// 实例化一个compiler对象
		compiler = new Compiler(options.context);
		compiler.options = options;
    // 通过NodeEnvironmentPlugin为compiler对象添加文件读写能力
		new NodeEnvironmentPlugin({
			infrastructureLogging: options.infrastructureLogging
		}).apply(compiler);
    // 挂载我们再配置项中传入的插件
		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
				if (typeof plugin === "function") {
					plugin.call(compiler, compiler);
				} else {
					plugin.apply(compiler);
				}
			}
		}
    // 触发两个hook勾子的执行
		compiler.hooks.environment.call();
		compiler.hooks.afterEnvironment.call();
    // 加载一些默认的插件
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
  // 当传入callback时执行
	if (callback) {
		if (typeof callback !== "function") {
			throw new Error("Invalid argument: callback");
		}
		if (
			options.watch === true ||
			(Array.isArray(options) && options.some(o => o.watch))
		) {
			const watchOptions = Array.isArray(options)
				? options.map(o => o.watchOptions || {})
				: options.watchOptions || {};
			return compiler.watch(watchOptions, callback);
		}
		compiler.run(callback);
	}
  // 返回一个compiler实例对象
	return compiler;
};
```

我们来看待`Compiler`函数内部实现：

```js
// node_modules/webpack/lib/Compiler.js


class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = {
			/** @type {SyncBailHook<Compilation>} */
			shouldEmit: new SyncBailHook(["compilation"]),
			/** @type {AsyncSeriesHook<Stats>} */
			done: new AsyncSeriesHook(["stats"]),
			/** @type {AsyncSeriesHook<>} */
			additionalPass: new AsyncSeriesHook([]),
			/** @type {AsyncSeriesHook<Compiler>} */
			beforeRun: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<Compiler>} */
			run: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			emit: new AsyncSeriesHook(["compilation"]),
			/** @type {AsyncSeriesHook<string, Buffer>} */
			assetEmitted: new AsyncSeriesHook(["file", "content"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			afterEmit: new AsyncSeriesHook(["compilation"]),

			/** @type {SyncHook<Compilation, CompilationParams>} */
			thisCompilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<Compilation, CompilationParams>} */
			compilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<NormalModuleFactory>} */
			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
			/** @type {SyncHook<ContextModuleFactory>}  */
			contextModuleFactory: new SyncHook(["contextModulefactory"]),

			/** @type {AsyncSeriesHook<CompilationParams>} */
			beforeCompile: new AsyncSeriesHook(["params"]),
			/** @type {SyncHook<CompilationParams>} */
			compile: new SyncHook(["params"]),
			/** @type {AsyncParallelHook<Compilation>} */
			make: new AsyncParallelHook(["compilation"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			afterCompile: new AsyncSeriesHook(["compilation"]),

			/** @type {AsyncSeriesHook<Compiler>} */
			watchRun: new AsyncSeriesHook(["compiler"]),
			/** @type {SyncHook<Error>} */
			failed: new SyncHook(["error"]),
			/** @type {SyncHook<string, string>} */
			invalid: new SyncHook(["filename", "changeTime"]),
			/** @type {SyncHook} */
			watchClose: new SyncHook([]),

			/** @type {SyncBailHook<string, string, any[]>} */
			infrastructureLog: new SyncBailHook(["origin", "type", "args"]),

			// TODO the following hooks are weirdly located here
			// TODO move them for webpack 5
			/** @type {SyncHook} */
			environment: new SyncHook([]),
			/** @type {SyncHook} */
			afterEnvironment: new SyncHook([]),
			/** @type {SyncHook<Compiler>} */
			afterPlugins: new SyncHook(["compiler"]),
			/** @type {SyncHook<Compiler>} */
			afterResolvers: new SyncHook(["compiler"]),
			/** @type {SyncBailHook<string, Entry>} */
			entryOption: new SyncBailHook(["context", "entry"])
		};
  }
  .... 
}  
```

我们可以看到`Compiler` 继承了 `Tapable`类，然后构造函数中定义了大量的勾子。所以我们手写`webpack`的时候需要复现这块。

![](/frontEnd/webpack-bundle-process.png)

上面的右边的勾子是我们需要重点关注的，其他钩子我们可以忽略。此外我们在看源代码的时候会经常出现`compiler`和`compilation`.

我们可以认为`compilation`是`compiler`构建过程中的一个具体实例。接下来我们先来实现我们的`webpack`打包器中的这一部分。在项目的根目录中创建`myWebpack`的包(包的目录结构是参照`webpack`的目录结构的)。

```shell
.
├── dist
│   └── index.js
├── myWebpack
│   ├── lib
│   │   └── webpack.js
│   └── package.json
├── package.json
├── run.js
├── src
│   └── index.js
├── webpack.config.js
└── yarn.lock
```

由于`webpack`中用到`NodeEnvironmentPlugin`插件，我们先来看下源码再`NodeEnvironmentPlugin`插件的实现，通过这个插件我们可以让`compiler`获得文件读写的能力。

```js
// node_modules/webpack/lib/node/NodeEnvironmentPlugin.js
class NodeEnvironmentPlugin {
	constructor(options) {
		this.options = options || {};
	}

	apply(compiler) {
    // 编译的日志，我们可以忽略这部分
		compiler.infrastructureLogger = createConsoleLogger(
			Object.assign(
				{
					level: "info",
					debug: false,
					console: nodeConsole
				},
				this.options.infrastructureLogging
			)
		);
    // 文件读写
		compiler.inputFileSystem = new CachedInputFileSystem(
			new NodeJsInputFileSystem(),
			60000
		);
		const inputFileSystem = compiler.inputFileSystem;
		compiler.outputFileSystem = new NodeOutputFileSystem();
    // 暂时不需要用到
		compiler.watchFileSystem = new NodeWatchFileSystem(
			compiler.inputFileSystem
		);
    // 对beforeRun钩子注册事件监听
		compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", compiler => {
			if (compiler.inputFileSystem === inputFileSystem) inputFileSystem.purge();
		});
	}
}
module.exports = NodeEnvironmentPlugin;

```

我们知道`webpack`的插件可以是一个函数或者一个拥有`apply`方法的对象。所以我们自己实现的`NodeEnvironmentPlugin`插件时，只需在`apply`方法中给`compiler`添加文件读写的能力(`inputFileSystem`、`outputFileSystem`)，为了简单，我们使用`fs`模块来实现，同时注册一个`beforeRun`钩子的事件监听即可。

```js
const fs = require('fs')
class NodeEnvironmentPlugin {
	constructor(options) {
		this.options = options || {}
	}

	apply(compiler) {
		compiler.inputFileSystem = fs
		compiler.outputFileSystem = fs
		compiler.hooks.beforeRun.tap('NodeEnvironmentPlugin', compiler => {
			console.log('before run')
		})
	}
}

module.exports = NodeEnvironmentPlugin

```

`myWebpack/lib/webpack.js`文件：

```js
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')
const Compiler = require('./Compiler')
function webpack(options) {
	// 01 实例化compiler对象
	let compiler = new Compiler(options.context)
	compiler.options = options
	// 02 // 通过NodeEnvironmentPlugin为compiler对象添加文件读写能力
	new NodeEnvironmentPlugin().apply(compiler)
	// 03 挂载我们再配置项中传入的插件
	if (options.plugins && Array.isArray(options.plugins)) {
		options.plugins.forEach(plugin => {
			if (typeof plugin === 'function') {
				plugin.call(compiler, compiler)
			} else {
				plugin.apply(compiler)
			}
		})
	}
	// 04 加载webpack内置的默认的插件
	//compiler.options = new WebpackOptionsApply().process(options, compiler)
	// 05返回实例对象
	return compiler
}

module.exports = webpack

```

`myWebpack/lib/Compiler.js`:

```js

const { Tapable, AsyncSeriesHook } = require('tapable')

class Compiler extends Tapable {
	constructor(context) {
		super()
		// 添加一些钩子
		// 用到的时候我们再来添加
		this.hooks = {
			done: new AsyncSeriesHook(['stats']),
			beforeRun: new AsyncSeriesHook(['compiler'])
		}
	}

	run(callback) {
		callback(null, {
			toJson() {
				return {
					entries: [], // 打包的入口
					chunks: [], //当次打包的chunk信息
					modules: [], // 模块信息
					assets: [] //当前打包最终生成的资源
				}
			}
		})
	}
}

module.exports = Compiler
```

我们在`Compiler`类中添加了一些钩子，同时实现了一个简单的`run`方法，目的是让我们的代码可以运行起来。

```js
// run.js
const webpack = require('./myWebpack')

const options = require('./webpack.config.js')

const compiler = webpack(options)

compiler.run(function (err, stats) {
	console.log(err)
	console.log(stats.toJson())
})
```

```shell
$ node run.js
null
{ entries: [], chunks: [], modules: [], assets: [] }
```

上面的`webpack.js`中我们并没有加载`webpack`的默认插件，这个在后续去实现。目前我们的目录结构如下：

```shell
$ tree -I node_modules 
.
├── dist
│   └── index.js
├── myWebpack
│   ├── lib
│   │   ├── Compiler.js
│   │   ├── node
│   │   │   └── NodeEnvironmentPlugin.js
│   │   └── webpack.js
│   └── package.json
├── package.json
├── run.js
├── src
│   └── index.js
├── webpack.config.js
└── yarn.lock
```

下面我们来实现`WebpackOptionsApply`类，通过这个类我们来加载一些`webpack`的默认插件，其中最重要的插件就是：`EntryOptionPlugin`插件：

```js
// webpack.js
// webpack.js中对WebpackOptionsApply的使用
compiler.options = new WebpackOptionsApply().process(options, compiler);
```

`WebpackOptionsApply.js`:

```js
//node_modules/webpack/lib/WebpackOptionsApply.js


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

...
class WebpackOptionsApply extends OptionsApply {
	constructor() {
		super();
	}

	/**
	 * @param {WebpackOptions} options options object
	 * @param {Compiler} compiler compiler object
	 * @returns {WebpackOptions} options object
	 */
	process(options, compiler) {
		...
		new EntryOptionPlugin().apply(compiler);
		compiler.hooks.entryOption.call(options.context, options.entry);
    ...
    return options
	}
}

module.exports = WebpackOptionsApply;

```

`WebpackOptionsApply`中会加载大量的默认插件，但是我们只需要关系`EntryOptionPlugin`插件

```js

"use strict";

const SingleEntryPlugin = require("./SingleEntryPlugin");
const MultiEntryPlugin = require("./MultiEntryPlugin");
const DynamicEntryPlugin = require("./DynamicEntryPlugin");

/** @typedef {import("../declarations/WebpackOptions").EntryItem} EntryItem */
/** @typedef {import("./Compiler")} Compiler */

/**
 * @param {string} context context path
 * @param {EntryItem} item entry array or single path
 * @param {string} name entry key name
 * @returns {SingleEntryPlugin | MultiEntryPlugin} returns either a single or multi entry plugin
 */
const itemToPlugin = (context, item, name) => {
	if (Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
};

module.exports = class EntryOptionPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance one is tapping into
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
};
```

在`EntryOptionPlugin`插件的`apply`方法中，我们注册了一个`entryOption`钩子的事件监听，然后我们`WebpackOptionsApply.js`中对这个钩子的事件监听进行了触发。由于我们的入口文件是一个字符串，所以会执行下面的代码：

```js
itemToPlugin(context, entry, "main").apply(compiler);
```

而`itemToPlugin`中返回了`SingleEntryPlugin`的实例，接下来加载了这个插件

```js
"use strict";
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");
class SingleEntryPlugin {
	constructor(context, entry, name) {
		this.context = context;
		this.entry = entry;
		this.name = name;
	}

	/**
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);

		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}

	/**
	 * @param {string} entry entry request
	 * @param {string} name entry name
	 * @returns {SingleEntryDependency} the dependency
	 */
	static createDependency(entry, name) {
		const dep = new SingleEntryDependency(entry);
		dep.loc = { name };
		return dep;
	}
}

module.exports = SingleEntryPlugin;

```

这个插件中我们为了`compilation`、`make`钩子注册了事件监听，我们上面提到的钩子中不包含`compilation`,所以我们手写的时候只需要实现`make`钩子的事件监听即可。接下来我们来手写这一部分的代码：

```js
//SingleEntryPlugin.js

class SingleEntryPlugin {
	constructor(context, entry, name) {
		this.context = context
		this.entry = entry
		this.name = name
	}

	apply(compiler) {
		compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
			const { entry, name, context } = this
			console.log('make钩子被触发了')
			console.log(entry, name, context)
			callback()
		})
	}
}

module.exports = SingleEntryPlugin

```

`SingleEntryPlugin`插件在`EntryOptionPlugin.js`文件：

```js
const SingleEntryPlugin = require('./SingleEntryPlugin')

function itemToPlugin(context, item, name) {
	return new SingleEntryPlugin(context, item, name)
}
class EntryOptionPlugin {
	apply(compiler) {
		// 注册一个entryOption钩子的事件监听

		compiler.hooks.entryOption.tap('EntryOptionPlugin', function (context, entry) {
			itemToPlugin(context, entry, 'main').apply(compiler)
		})
	}
}

module.exports = EntryOptionPlugin
```

`EntryOptionPlugin`插件在`WebpackOptionsApply.js`中被使用了，`WebpackOptionsApply.js`:

```js

const EntryOptionPlugin = require('./EntryOptionPlugin')
class WebpackOptionsApply {
	process(options, compiler) {
		// 加载EntryOptionPlugin插件
		new EntryOptionPlugin().apply(compiler)
		// 执行`entryOption钩子：
		compiler.hooks.entryOption.call(options.context, options.entry)
		//
		return options
	}
}

module.exports = WebpackOptionsApply

```

然后我们在`webpack.js`中调用`WebpackOptionsApply`实例的`process`方法：

```js

const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')
const Compiler = require('./Compiler')
const WebpackOptionsApply = require('./WebpackOptionsApply')
function webpack(options) {
	// 01 实例化compiler对象
	let compiler = new Compiler(options.context)
	compiler.options = options
	// 02 // 通过NodeEnvironmentPlugin为compiler对象添加文件读写能力
	new NodeEnvironmentPlugin().apply(compiler)
	// 03 挂载我们再配置项中传入的插件
	if (options.plugins && Array.isArray(options.plugins)) {
		options.plugins.forEach(plugin => {
			if (typeof plugin === 'function') {
				plugin.call(compiler, compiler)
			} else {
				plugin.apply(compiler)
			}
		})
	}
	// 04 加载webpack内置的默认的插件
	compiler.options = new WebpackOptionsApply().process(options, compiler)
	// 05返回实例对象
	return compiler
}

module.exports = webpack

```

最后我们在`Compiler.js	`中添加我们刚用的钩子：

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, AsyncParallelHook } = require('tapable')

class Compiler extends Tapable {
	constructor(context) {
		super()
		// 添加一些钩子
		// 用到的时候我们再来添加
		this.hooks = {
			done: new AsyncSeriesHook(['stats']),
			beforeRun: new AsyncSeriesHook(['compiler']),
      // 新增
			entryOption: new SyncBailHook(['context', 'entry']),
       // 新增
			make: new AsyncParallelHook(['compilation'])
		}
	}

	run(callback) {
		callback(null, {
			toJson() {
				return {
					entries: [], // 打包的入口
					chunks: [], //当次打包的chunk信息
					modules: [], // 模块信息
					assets: [] //当前打包最终生成的资源
				}
			}
		})
	}
}

module.exports = Compiler

```

接下来我们对`compiler`的`run`方法进行调试和重写：

```js
run(callback) {
		if (this.running) return callback(new ConcurrentCompilationError());

		const finalCallback = (err, stats) => {
			this.running = false;

			if (err) {
				this.hooks.failed.call(err);
			}

			if (callback !== undefined) return callback(err, stats);
		};

		const startTime = Date.now();

		this.running = true;

		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);

			if (this.hooks.shouldEmit.call(compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stats);
				});
				return;
			}

			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);

						this.hooks.additionalPass.callAsync(err => {
							if (err) return finalCallback(err);
							this.compile(onCompiled);
						});
					});
					return;
				}

				this.emitRecords(err => {
					if (err) return finalCallback(err);

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);
						return finalCallback(null, stats);
					});
				});
			});
		};

		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);

			this.hooks.run.callAsync(this, err => {
				if (err) return finalCallback(err);

				this.readRecords(err => {
					if (err) return finalCallback(err);

					this.compile(onCompiled);
				});
			});
		});
	}
	 
 newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory(),
			compilationDependencies: new Set()
		};
		return params;
 }

createCompilation() {
		return new Compilation(this);
}
newCompilation(params) {
		const compilation = this.createCompilation();
		compilation.fileTimestamps = this.fileTimestamps;
		compilation.contextTimestamps = this.contextTimestamps;
		compilation.name = this.name;
		compilation.records = this.records;
		compilation.compilationDependencies = params.compilationDependencies;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}

 compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}

```

可以看到`run`方法接受一个回调函数，接下来在定义了`finalCallback`函数，函数中调用了这个回调，接下来定义了`onCompiled`函数，函数中触发了`done`钩子的执行，`done`钩子执行完成后回调中调用了`finalCallback`,接下来是`beforeRun`和`run`钩子的执行，然后在

`run`的回调中执行了`this.compile(onCompiled)`,`compile`接受一个回调，然后是`beforeCompile`、`compile`、`make`、`afterCompile`等钩子的执行：

`Compile.js`:

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, AsyncParallelHook, SyncHook } = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation')
class Compiler extends Tapable {
	constructor(context) {
		super()
		// 添加一些钩子
		// 用到的时候我们再来添加
		this.hooks = {
			done: new AsyncSeriesHook(['stats']),
			beforeRun: new AsyncSeriesHook(['compiler']),
			run: new AsyncSeriesHook(['compiler']),
			entryOption: new SyncBailHook(['context', 'entry']),
			make: new AsyncParallelHook(['compilation']),
			beforeCompile: new AsyncSeriesHook(['params']),
			/** @type {SyncHook<CompilationParams>} */
			compile: new SyncHook(['params'])
		}
	}

	run(callback) {
		const finalCallback = (err, stats) => {
			return callback(err, stats)
		}

		const onCompiled = (err, compilation) => {
			const stats = {
				toJson() {
					return {
						entries: [], // 打包的入口
						chunks: [], //当次打包的chunk信息
						modules: [], // 模块信息
						assets: [] //当前打包最终生成的资源
					}
				}
			}

			this.hooks.done.callAsync(stats, err => {
				return finalCallback(null, stats)
			})
		}

		this.hooks.beforeRun.callAsync(this, () => {
			this.hooks.run.callAsync(this, () => {
				this.compile(onCompiled)
			})
		})
	}

	createNormalModuleFactory() {
		const normalModuleFactory = new NormalModuleFactory()
		//this.hooks.normalModuleFactory.call(normalModuleFactory)
		return normalModuleFactory
	}
	newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory()

			// contextModuleFactory: this.createContextModuleFactory(),
			// compilationDependencies: new Set()
		}
		return params
	}

	createCompilation() {
		return new Compilation(this)
	}

	newCompilation(params) {
		const compilation = this.createCompilation()

		return compilation
	}

	compile(callback) {
		const params = this.newCompilationParams()

		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err)

			this.hooks.compile.call(params)

			const compilation = this.newCompilation(params)

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err)
				callback(null, compilation)
			})
		})
	}
}

module.exports = Compiler
```

`NormalModuleFactory.js`:

```js
class NormalModuleFactory {}

module.exports = NormalModuleFactory

```

`Compilation.js`:

```js
class Compilation {}
module.exports = Compilation

```

上面的两个类暂未实现,当我们替换`run.js`的文件为我们的，执行后可以看到`make`钩子被执行了：

```shell
$ node run.js 
before run
make钩子被触发了
./src/index.js main /Users/lijunjie/js-code/webpack-hook/05_webpack_entry
null
{ entries: [], chunks: [], modules: [], assets: [] }
```

#### make钩子触发前流程分析

主要操作步骤

* 创建`compiler`
* 调用`compiler`的`run`方法

`compiler`实例化操作：

1.  `Compiler`类继承`Tapable`，并在构造函数中定义了一堆钩子

2. 通过`NodeEnvironmentPlugin`插件让`compiler`具备了文件读写的能力(我们采用了fs模块来模拟)

3. 将加载配置项中传入的`plugins`

4. 加载`webpack`的默认插件，其中`entryOptionPlugin`插件处理了打包的入口文件：

5. `entryOptionPlugin`内部加载`SingleEntryPlugin`，`SingleEntryPlugin`的`apply`中实现了两个钩子

   1. `compilation`钩子是让`compilation`具备了`normalModuleFactory`工厂创建一个普通模块的能力(未实现)
   2. `make`钩子的触发是在我们调用`compiler.run()`后，当我们开始执行`make`钩子中的事件监听时，证明我们已经完成了模块打包的所有准备工作。
   3. `make`钩子的事件监听中调用了`addEntry()`来完成打包工作

`compiler`实例化完成调用`run`方法

1. `run`方法主要是对我们实例化过程中钩子的触发:`beforeRun`、`run`、`beforeCompiler`、`compilation`、`make`等

2. run方法中调用了`compile()`:

   1. 准备参数：`normalModuleFactory`是为了后序创建模块

   2. 将参数传递给了`beforeCompiler`钩子

   3. 创建`compilation`对象,完成后去触发了`thisCompilation`和`compilation`钩子

3. 接下来就是`make`钩子的触发，当`make`钩子触发后就意味着开始对模块进行打包操作了



​      

























