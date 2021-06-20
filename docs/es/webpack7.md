#### 处理模块依赖

上面我们已经可以读取模块的源码，并生成`ast`语法树。接下来我们需要处理模块的依赖，然后利用`ast`对模块中的代码进行替换,首先我们对项目中需要打包的模块做一个修改：

```shell
$ tree -I node_modules 
.
├── dist
│   └── index.js
├── myWebpack
│   ├── lib
│   │   ├── Compilation.js
│   │   ├── Compiler.js
│   │   ├── EntryOptionPlugin.js
│   │   ├── NormalModule.js
│   │   ├── NormalModuleFactory.js
│   │   ├── Parser.js
│   │   ├── SingleEntryPlugin.js
│   │   ├── Stats.js
│   │   ├── WebpackOptionsApply.js
│   │   ├── node
│   │   │   └── NodeEnvironmentPlugin.js
│   │   └── webpack.js
│   └── package.json
├── package-lock.json
├── package.json
├── pkg
│   └── mod
│       └── cache
│           ├── download
│           │   └── golang.org
│           │       └── x
│           │           └── tools
│           │               └── gopls
│           │                   └── @v
│           │                       └── v0.6.11.info
│           └── lock
├── run.js
├── src
│   ├── index.js
│   └── title.js
├── webpack.config.js
└── yarn.lock
```

因为我们需要处理模块依赖，所以这里我们在`index.js`中加载`title.js`:

`index.js`:

```js
let title = require('./title')
console.log(title)
console.log('index.js执行了')
```

`title.js`:

```js
module.exports = 'title'
```

前面我们看过`webpack`打包后的内容，会发现我们的`require`被替换成了`__webpack_require__`，其次我们需要将模块中的`./title`替换成`moduleId`:`./src/title.js`，最后我们要保存这个模块的依赖项：我们先来安装一个后面需要用到的模块：

```shell
$ npm install -D @babel/types @babel/generator @babel/traverse
```

这三个模块的作用我们会在后续用到的时候介绍，我们先看下`ast`语法树的知识，这里有一个关于生成`ast`语法树的网站：[ast](https://astexplorer.net/)

```js
let title = require('./title')
```

我们可以使用`@babel/parser`将代码转成对应的语法树：

```json
 "body": [
      {
        "type": "VariableDeclaration",
        "start": 0,
        "end": 30,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 30
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 4,
            "end": 30,
            "loc": {
              "start": {
                "line": 1,
                "column": 4
              },
              "end": {
                "line": 1,
                "column": 30
              }
            },
            "id": {
              "type": "Identifier",
              "start": 4,
              "end": 9,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 4
                },
                "end": {
                  "line": 1,
                  "column": 9
                },
                "identifierName": "title"
              },
              "name": "title"
            },
            "init": {
              "type": "CallExpression",
              "start": 12,
              "end": 30,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 12
                },
                "end": {
                  "line": 1,
                  "column": 30
                }
              },
              "callee": {
                "type": "Identifier",
                "start": 12,
                "end": 19,
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 12
                  },
                  "end": {
                    "line": 1,
                    "column": 19
                  },
                  "identifierName": "require"
                },
                "name": "require"
              },
              "arguments": [
                {
                  "type": "StringLiteral",
                  "start": 20,
                  "end": 29,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 20
                    },
                    "end": {
                      "line": 1,
                      "column": 29
                    }
                  },
                  "extra": {
                    "rawValue": "./title",
                    "raw": "'./title'"
                  },
                  "value": "./title"
                }
              ]
            }
          }
        ],
        "kind": "let"
      }
    ],
```

接下来我们通过对`ast`语法树上的节点进行修改，完成我们对源代码中内容的替换：

```js

const types = require('@babel/types')
const generator = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const path = require('path')
class NormalModule {
	constructor({ context, rawRequest, name, resource, parser }) {
		this.context = context
		this.rawRequest = rawRequest
		this.name = name
		this.resource = resource
		// TODO 其他的
		this._source = null // 保存模块的源码
		this._ast = null // 生成抽象语法树
		// 待实现
		this.parser = parser
		this.dependences = []
	}

	build(compilation, callback) {
		/**
		 *  01 读取文件模块的内容
		 *  02 如果模块是非js文件，使用`loader`对文件的内容做一个转换
		 *  03 将js代码转换成抽象语法树
		 *  04 如果当前模块依赖了其他的模块，需要递归查找依赖
		 *
		 */

		this.doBuild(compilation, err => {
			// 生成ast
			this._ast = this.parser.parse(this._source)
			// 通过对AST语法树上节点的内容进行修改完成对源码中内容的替换
			traverse(this._ast, {
				// 根据节点的类型去遍历，这里查找的是type === 'CallExpression'
				CallExpression: nodePath => {
					let node = nodePath.node
					if (node.callee.name === 'require') {
						let modulePath = node.arguments[0].value // "./title"
						// 使用"/"将modulePath分割
						let moduleName = modulePath.split(path.posix.sep).pop()
						//我们打包器只处理js模块
						moduleName.indexOf('.js') !== -1 ? '' : '.js'
						moduleName += extName
						// 获取文件的绝对路径
						let depResource = path.posix.join(path.dirname(this.resource), moduleName)

						// 生成moduleId  绝对路径 - this.context
						let depModuleId = './' + path.posix.relative(this.context, depResource)

						// console.log(moduleName, depResource, depModuleId)

						//生成依赖
						this.dependences.push({
							name: this.name,
							context: this.context,
							rawRequest: moduleName,
							resource: depResource,
							moduleId: depModuleId
						})

						// 替换节点的内容：
						node.callee.name = '__webpack_require__'
						//	修改节点类型为 "stringLiteral"的内容
						node.arguments = [types.stringLiteral(depModuleId)]
					}
				}
			})
			// 利用修改后的ast去生成新的代码
			let { code } = generator(this._ast)
			this._source = code
			callback(err)
		})
	}
	//
	doBuild(compilation, callback) {
		this.getSource(compilation, (err, source) => {
			this._source = source
			callback(err)
		})
	}

	getSource(compilation, callback) {
		compilation.inputFileSystem.readFile(this.resource, 'utf8', callback)
	}
}

module.exports = NormalModule

```

执行打包命令：

```js
$ node run.js 
before run
make钩子被触发了
./src/index.js main /Users/lijunjie/js-code/webpack-hook/05_webpack_entry
null
Stats {
  modules: [
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: './src/index.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/index.js',
      _source: 'let title = __webpack_require__("./src/title");\n' +
        '\n' +
        'console.log(title);\n' +
        "console.log('index.js执行了');",
      _ast: [Node],
      parser: [Parser],
      dependences: [Array]
    }
  ],
  entry: [
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: './src/index.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/index.js',
      _source: 'let title = __webpack_require__("./src/title");\n' +
        '\n' +
        'console.log(title);\n' +
        "console.log('index.js执行了');",
      _ast: [Node],
      parser: [Parser],
      dependences: [Array]
    }
  ]
}
```

接下来我们需要递归调用去打包依赖模块：

```js

const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const NormalModuleFactory = require('./NormalModuleFactory')
const Parser = require('./Parser')
class Compilation extends Tapable {
	constructor(compiler) {
		super()
		this.compiler = compiler
		this.context = compiler.context
		this.options = compiler.options
		// 让compilation具备文件读写的能力
		this.inputFileSystem = compiler.inputFileSystem
		this.outputFileSystem = compiler.outputFileSystem
		this.entries = [] // 打包的入口
		this.modules = [] //  存放所有模块的数据
		this.hooks = {
			succeedModule: new SyncHook(['module'])
		}
	}
	/**
	 * @param{ * } context 项目的根目录
	 * @param{ * } entry 项目的入口文件
	 * @param{ * } name chunkName
	 * @param { * } 传入的回调
	 */
	addEntry(context, entry, name, callback) {
		this._addModuleChain(context, entry, name, (err, module) => {
			callback(err, module)
		})
	}

	_addModuleChain(context, entry, name, callback) {
		// normalModuleFactory
		let entryModule = new NormalModuleFactory().create({
			name,
			context,
			rawRequest: entry,
			//返回entry的绝对路径
			resource: path.posix.join(context, entry),
			// parser 编译生成ast的编译器
			parser: new Parser()
		})

		const afterBuild = function (err) {
			callback(err, entryModule)
		}

		this.buildModule(entryModule, afterBuild)
		// 完成build后我们需要对我们的模块进行保存
		this.entries.push(entryModule)
		this.modules.push(entryModule)
	}
	/**
	 *
	 * @param {NormalModule} module
	 * @param {*} callback
	 */
	buildModule(module, callback) {
		module.build(this, err => {
			//意味着我们的模块打包已经完成，触发对应的钩子
			this.hooks.succeedModule.call(module)
			callback(err)
		})
	}
}
module.exports = Compilation

```

这里面我们在`build`的回调函数中判断当前模块是否有依赖项没，如果有依赖项，那么就递归调用去打包依赖项，为了不用每次都去创建一个`NormalModuleFactory`实例，我们去提取一个`createModule`方法去处理模块的入口信息（依赖会作为新的入口）：

```js
const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const NormalModuleFactory = require('./NormalModuleFactory')
const Parser = require('./Parser')
const async = require('neo-async')

const normalModuleFactory = new NormalModuleFactory()
const parser = new Parser()
class Compilation extends Tapable {
	constructor(compiler) {
		super()
		this.compiler = compiler
		this.context = compiler.context
		this.options = compiler.options
		// 让compilation具备文件读写的能力
		this.inputFileSystem = compiler.inputFileSystem
		this.outputFileSystem = compiler.outputFileSystem
		this.entries = [] // 打包的入口
		this.modules = [] //  存放所有模块的数据
		this.hooks = {
			succeedModule: new SyncHook(['module'])
		}
	}
	/**
	 * @param{ * } context 项目的根目录
	 * @param{ * } entry 项目的入口文件
	 * @param{ * } name chunkName
	 * @param { * } 传入的回调
	 */
	addEntry(context, entry, name, callback) {
		this._addModuleChain(context, entry, name, (err, module) => {
			callback(err, module)
		})
	}

	_addModuleChain(context, entry, name, callback) {
		// normalModuleFactory
		const resource = path.posix.join(context, entry)

		this.createModule(
			{
				name,
				context,
				rawRequest: entry,
				//返回entry的绝对路径
				resource,
				modildId: './' + path.posix.relative(context, resource),
				// parser 编译生成ast的编译器
				parser
			},
			module => this.entries.push(module),
			callback
		)
	}
	/**
	 *
	 * @param { * } module 要打包的模块的相关信息
	 * @param {Function } doEntry 添加module 到 this.entries
	 * @param {*} callback  整个打包接受的回调函数
	 */
	createModule(data, doEntry, callback) {
		// normalModuleFactory
		let module = normalModuleFactory.create(data)

		const afterBuild = err => {
			if (module.dependences.length) {
				// 存在依赖
				this.buildDependences(module, () => callback(err, module))
			} else {
				callback(err, module)
			}
		}

		this.buildModule(module, afterBuild)
		// 完成build后我们需要对我们的模块进行保存
		// this.entries.push(entryModule)

		doEntry && doEntry(module)
		this.modules.push(module)
	}
	/**
	 *
	 * @param {NormalModule} module
	 * @param {*} callback
	 */
	buildModule(entryModule, callback) {
		entryModule.build(this, err => {
			//意味着我们的模块打包已经完成，触发对应的钩子
			this.hooks.succeedModule.call(entryModule)
			callback(err)
		})
	}
	/**
	 *
	 * @param {NormalModule} module
	 * @param {*} callback
	 */
	buildDependences(module, callback) {
		// 所以依赖都处理完成后，在执行callback
		const dependences = module.dependences
		// 如何知道所以依赖项都完成了打包操作呢  (neo-async)
		async.forEach(
			dependences,
			(dependence, done) => {
				this.createModule({ ...dependence, parser }, null, done)
			},
			callback
		)
	}
}
module.exports = Compilation


```

这块需要安装`neo-async`作为依赖，我们使用`async`的目的是为了等待所以`createModule`执行结束在执行`callback`(createModule方法是异步，因为里面异步读取文件的操作)。

执行`run.js`去查看打包的结果：

```shell
$ node run.js
before run
make钩子被触发了
./src/index.js main /Users/lijunjie/js-code/webpack-hook/05_webpack_entry
null
Stats {
  modules: [
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: './src/index.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/index.js',
      _source: 'let title = __webpack_require__("./src/title.js");\n' +
        '\n' +
        'console.log(title);\n' +
        "console.log('index.js执行了');",
      _ast: [Node],
      parser: [Parser],
      dependences: [Array]
    },
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: 'title.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/title.js',
      _source: "module.exports = 'title';",
      _ast: [Node],
      parser: [Parser],
      dependences: []
    }
  ],
  entry: [
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: './src/index.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/index.js',
      _source: 'let title = __webpack_require__("./src/title.js");\n' +
        '\n' +
        'console.log(title);\n' +
        "console.log('index.js执行了');",
      _ast: [Node],
      parser: [Parser],
      dependences: [Array]
    }
  ]
}
```

上面我们已经完成了模块依赖的处理，接下来我们开始去生成`chunk`.我们处理入口文件和它的依赖都是在`make`钩子中执行的，所以我们可以再`make`钩子执行完成后的回调中出去生成`chunk`的工作：

```js
// Compiler.js
compile(callback) {
		const params = this.newCompilationParams()

		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err)

			this.hooks.compile.call(params)

			const compilation = this.newCompilation(params)

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err)
				// callback(null, new Stats(compilation))
				// 完成生成chunk的工作
				// seal 封上(信封); 密封(容器);这块是将不同的模块放入同一个chunk块中
				compilation.seal(() => callback(null, new Stats(compilation)))
			})
		})
	}
```

`Compilation.js`:

```js
// Compilation.js
seal(callback) {
		//  这块我们的钩子并没有对应的事件监听函数，但是我们依旧设置这些钩子，目的是为了直到我们这些操作对应的钩子的位置
		//  此外我们在外部向钩子上挂载事件监听
		this.hooks.seal.call()
		this.hooks.beforeChunks.call()

		// 我们当前的所有打包入口都存放在this.entries中
		// 所谓的chunk就是将入口文件和他的依赖提取到一块，然后再做合并
		for (const entryModule of this.entries) {
			const chunk = new Chunk(entryModule)
			// 处理chunk中包含的模块
			chunk.module = entryModule.dependences.filter(module => module.name === chunk.name)
			// 保存chunk块
			this.chunks.push(chunk)
		}
		callback()
	}
```

`Chunk.js`:

```js
class Chunk {
	constructor(entryModule) {
		this.entryModule = entryModule
		this.name = entryModule.name
		// 记录我们打包完成后存在chunK的文件信息
		this.files = []
		//  组成chunk的所有的模块
		this.modules = []
	}
}

module.exports = Chunk
```

我们已经完成了`chunk`的梳理工作，接下来就是根据`chunk`信息去生成`chunks.js`.本质上就是利用我们之前手写的`webpack`源文件(webpack源码分析)作为模块去替换我们`chunk`中的源文件：

```js
function(){
  ....
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
}({
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

我们需要是`ejs`模块引擎来完成对模块文件中内容的替换：`template/main.js`(这后缀名不重要，语法是`ejs`语言即可)

```ejs
return __webpack_require__((__webpack_require__.s = '<%- entryModuleId %>'))
})({
	// /***/ './src/index.js':
	// 	/*! no static exports found */
	// 	/***/ function (module, exports, __webpack_require__) {
	// 		let oBtn = document.getElementById('btn')

	// 		oBtn.addEventListener('click', function () {
	// 			__webpack_require__
	// 				.e(/*! import() | login */ 'login')
	// 				.then(__webpack_require__.t.bind(null, /*! ./login.js */ './src/login.js', 7))
	// 				.then(login => {
	// 					console.log(login)
	// 				})
	// 		})

	// 		console.log('index.js执行了')

	// 		/***/
	// 	}
	
	<%for(let i=0;i < modules.length;i++){%>
		'<%- modules[i].moduleId %>':
		function(module, exports, __webpack_require__){
			<%- modules[i]._source %>	
		},
	<%}%>
})

```

我们使用`ejs`模版来完成替换：

```js
// Compilation.js
seal(callback) {
		//  这块我们的钩子并没有对应的事件监听函数，但是我们依旧设置这些钩子，目的是为了直到我们这些操作对应的钩子的位置
		//  此外我们在外部向钩子上挂载事件监听
		this.hooks.seal.call()
		this.hooks.beforeChunks.call()

		// 我们当前的所有打包入口都存放在this.entries中
		// 所谓的chunk就是将入口文件和他的依赖提取到一块，然后再做合并
		for (const entryModule of this.entries) {
			const chunk = new Chunk(entryModule)
			// 处理chunk中包含的模块
			chunk.module = this.modules.filter(module => module.name === chunk.name)
			// 保存chunk块
			this.chunks.push(chunk)
		}

		// 利用我们之前手写的	webpack打包后的内容作为模版文件，将模版文件和我们chunk中的模块的源码进行替换，
		// 生成我们需要的chunk.js

		// 这个钩子和我们上面的钩子一样
		this.hooks.afterChunks.call(this.chunks)
		// 生成chunk.js的内容
		this.createChunkAssets()
		callback()
	}

	createChunkAssets() {
		for (let i = 0; i < this.chunks.length; i++) {
			const chunk = this.chunks[i]
			const chunkName = chunk.name + '.js'
			chunk.files.push(chunkName)
			// 生成具体的内容
			// 01 获取模版文件的路径
			let tempPath = path.posix.join(__dirname, `./template/main.ejs`)
			// 02 读取模版文件的内容
			const tempCode = this.inputFileSystem.readFileSync(tempPath, 'utf8')
			// 03  获取渲染函数
			const tempRender = ejs.compile(tempCode)
			// 04 渲染数据
			const source = tempRender({
				entryModuleId: chunk.entryModule.moduleId,
				modules: chunk.modules
			})
			// 将chunk生成的assets保存起来
			this.emitAssets(chunkName, source)
		}
	}

	emitAssets(chunkName, source) {
		this.files.push(chunkName)
		this.assets.push(source)
	}
```

最后我们更新一下`Stats.js`文件：

```js
class Stats {
	constructor(compilation) {
		const { modules, entries, chunks, assets } = compilation
		this.modules = modules
		this.entry = entries
		this.chunks = chunks
		this.assets = assets
	}
	toJson() {
		return this
	}
}

module.exports = Stats
```

只想`node run.js`会输出`chunks`和`assets`的内容.接下来需要将`assets`的内容输出到具体的文件中：

```js
//Compiler.js
emitAssets(compilation, callback) {
		// 创建dist目录，然后将chunks中的内容写入文件
		let outputPath = this.options.output.path
		const assets = compilation.assets
		//  工具方法；将chunk中的内容写入文件
		const emitFiles = err => {
			for (const file in assets) {
				let source = assets[file]
				let targetPath = path.posix.join(outputPath, file)
				this.outputFileSystem.writeFileSync(targetPath, source, 'utf8')
			}
			callback(err)
		}

		// 调用上面定义的方法写入文件
		this.hooks.emit.callAsync(compilation, () => {
			mkdirp(outputPath).then(emitFiles)
		})
	}
	run(callback) {
		const finalCallback = (err, stats) => {
			return callback(err, stats)
		}

		const onCompiled = (err, compilation) => {
			// 生成打包后的文件：
			this.emitAssets(compilation, () => {
				const stats = new Stats(compilation)
				this.hooks.done.callAsync(stats, err => {
					return finalCallback(err, stats)
				})
			})
		}

		this.hooks.beforeRun.callAsync(this, () => {
			this.hooks.run.callAsync(this, () => {
				this.compile(onCompiled)
			})
		})
	}

compile(callback) {
		const params = this.newCompilationParams()

		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err)

			this.hooks.compile.call(params)

			const compilation = this.newCompilation(params)

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err)
				// callback(null, new Stats(compilation))
				// 完成生成chunk的工作
				// seal 封上(信封); 密封(容器);这块是将不同的模块放入同一个chunk块中
				compilation.seal(() => callback(null, compilation))
			})
		})
	}

```

我们在`run`方法中的`run`钩子中执行`emitAssets`方法来完文件的生成.

