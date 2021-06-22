

#### webpack源码分析（二）

前面我们对`webpack`创建`compiler`和调用`compiler.run()`方法的过程进行了大概的分析，我们知道`run()`中会触发`make`钩子的事件监听。当我们触发`make`钩子的时候，我们会把`compilation`传递过去，在事件监听中会调用`compilation`对象的`addEntry方法`。

```js
// node_module/webpack/lib/SingleEntryPlugin.js
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");

/** @typedef {import("./Compiler")} Compiler */

class SingleEntryPlugin {
	
	constructor(context, entry, name) {
		this.context = context;
		this.entry = entry;
		this.name = name;
	}

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

	static createDependency(entry, name) {
		const dep = new SingleEntryDependency(entry);
		dep.loc = { name };
		return dep;
	}
}

module.exports = SingleEntryPlugin;
```

当前的`this`指向的`SingleEntryPlugin`实例，从对象上结构出来`entry, name, context `。`dep`（被处理成了`SingleEntryDependency`的实例）是对当前入口的依赖进行了处理，然后调用`compilation.addEntry();`

```js
// node_module/webpack/lib/Compilation.js

addEntry(context, entry, name, callback) {
		this.hooks.addEntry.call(entry, name);

		const slot = {
			name: name,
			// TODO webpack 5 remove `request`
			request: null,
			module: null
		};

		if (entry instanceof ModuleDependency) {
			slot.request = entry.request;
		}

		// TODO webpack 5: merge modules instead when multiple entry modules are supported
		const idx = this._preparedEntrypoints.findIndex(slot => slot.name === name);
		if (idx >= 0) {
			// Overwrite existing entrypoint
			this._preparedEntrypoints[idx] = slot;
		} else {
			this._preparedEntrypoints.push(slot);
		}
		this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
				if (err) {
					this.hooks.failedEntry.call(entry, name, err);
					return callback(err);
				}

				if (module) {
					slot.module = module;
				} else {
					const idx = this._preparedEntrypoints.indexOf(slot);
					if (idx >= 0) {
						this._preparedEntrypoints.splice(idx, 1);
					}
				}
				this.hooks.succeedEntry.call(entry, name, module);
				return callback(null, module);
			}
		);
	}
```

在`addEntry`方法的内部调用了`_addModuleChain`去处理依赖

```js
// node_module/webpack/lib/Compilation.js
_addModuleChain(context, dependency, onModule, callback) {
		...
		const Dep = /** @type {DepConstructor} */ (dependency.constructor);
		const moduleFactory = this.dependencyFactories.get(Dep);
		if (!moduleFactory) {
			throw new Error(
				`No dependency factory available for this dependency type: ${dependency.constructor.name}`
			);
		}

		this.semaphore.acquire(() => {
			moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
				(err, module) => {
					if (err) {
						this.semaphore.release();
						return errorAndCallback(new EntryModuleNotFoundError(err));
					}

					let afterFactory;

					if (currentProfile) {
						afterFactory = Date.now();
						currentProfile.factory = afterFactory - start;
					}

					const addModuleResult = this.addModule(module);
					module = addModuleResult.module;

					onModule(module);

					dependency.module = module;
					module.addReason(null, dependency);

					const afterBuild = () => {
						if (addModuleResult.dependencies) {
							this.processModuleDependencies(module, err => {
								if (err) return callback(err);
								callback(null, module);
							});
						} else {
							return callback(null, module);
						}
					};

					if (addModuleResult.issuer) {
						if (currentProfile) {
							module.profile = currentProfile;
						}
					}

					if (addModuleResult.build) {
						this.buildModule(module, false, null, null, err => {
							if (err) {
								this.semaphore.release();
								return errorAndCallback(err);
							}

							if (currentProfile) {
								const afterBuilding = Date.now();
								currentProfile.building = afterBuilding - afterFactory;
							}

							this.semaphore.release();
							afterBuild();
						});
					} else {
						this.semaphore.release();
						this.waitForBuildingFinished(module, afterBuild);
					}
				}
			);
		});
	}
```

`Dep`是`dependency.constructor`(SingleEntryDependency),`moduleFactory`我们`set`的`normalModuleFactory`实例：

```js
const Dep = /** @type {DepConstructor} */ (dependency.constructor);
const moduleFactory = this.dependencyFactories.get(Dep);
```

`this.semaphore.acquire()`让我们并发的执行打包任务，默认的并发数是100.

```js
//node_modules/webpack/lib/util/Semaphore.js
acquire(callback) {
		if (this.available > 0) {
			this.available--;
			callback();
		} else {
			this.waiters.push(callback);
		}
	}
```

`callback`是我们传入的`moduleFactory.create()`:

```js
//node_modules/webpack/lib/NormalModuleFactory.js

	create(data, callback) {
		const dependencies = data.dependencies;
		const cacheEntry = dependencyCache.get(dependencies[0]);
		if (cacheEntry) return callback(null, cacheEntry);
		const context = data.context || this.context;
		const resolveOptions = data.resolveOptions || EMPTY_RESOLVE_OPTIONS;
		const request = dependencies[0].request;
		const contextInfo = data.contextInfo || {};
		this.hooks.beforeResolve.callAsync(
			{
				contextInfo,
				resolveOptions,
				context,
				request,
				dependencies
			},
			(err, result) => {
				if (err) return callback(err);

				// Ignored
				if (!result) return callback();

				const factory = this.hooks.factory.call(null);

				// Ignored
				if (!factory) return callback();

				factory(result, (err, module) => {
					if (err) return callback(err);

					if (module && this.cachePredicate(module)) {
						for (const d of dependencies) {
							dependencyCache.set(d, module);
						}
					}

					callback(null, module);
				});
			}
		);
	}
```

我们在`create`中触发了`beforeResolve`钩子中的回调中会触发`factory`钩子的执行：

```js
//node_modules/webpack/lib/NormalModuleFactory.js	
this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {
			let resolver = this.hooks.resolver.call(null);

			// Ignored
			if (!resolver) return callback();

			resolver(result, (err, data) => {
				if (err) return callback(err);

				// Ignored
				if (!data) return callback();

				// direct module
				if (typeof data.source === "function") return callback(null, data);

				this.hooks.afterResolve.callAsync(data, (err, result) => {
					if (err) return callback(err);

					// Ignored
					if (!result) return callback();

					let createdModule = this.hooks.createModule.call(result);
					if (!createdModule) {
						if (!result.request) {
							return callback(new Error("Empty dependency (no request)"));
						}

						createdModule = new NormalModule(result);
					}

					createdModule = this.hooks.module.call(createdModule, result);

					return callback(null, createdModule);
				});
			});
		});

```

我们可以看到`factory`钩子的事件监听中返回的是一个函数给`factory`变量：然后接下来会执行这个函数，本质上就是把上面的`result`对象和`callback`函数传递给了`factory`钩子的事件监听函数。

```js
const factory = this.hooks.factory.call(null);
if (!factory) return callback();

factory(result, (err, module) => {
  if (err) return callback(err);

  if (module && this.cachePredicate(module)) {
    for (const d of dependencies) {
      dependencyCache.set(d, module);
    }
  }

  callback(null, module);
});
```

`factory`钩子的事件监听函数执行会触发`resolver`钩子的事件监听：事件监听会返回一个函数给`resolver`,`resolver`函数用来处理`loader`的，这块的本质就是把上面的`result`对象和回调函数传递给`resolver`钩子的事件监听回调。当`resolver`执行完成后获取执行`afterResolve`钩子：

```js
	this.hooks.resolver.tap("NormalModuleFactory", () => (data, callback) => {
			const contextInfo = data.contextInfo;
			const context = data.context;
			const request = data.request;

			const loaderResolver = this.getResolver("loader");
			const normalResolver = this.getResolver("normal", data.resolveOptions);

			let matchResource = undefined;
			let requestWithoutMatchResource = request;
			const matchResourceMatch = MATCH_RESOURCE_REGEX.exec(request);
			if (matchResourceMatch) {
				matchResource = matchResourceMatch[1];
				if (/^\.\.?\//.test(matchResource)) {
					matchResource = path.join(context, matchResource);
				}
				requestWithoutMatchResource = request.substr(
					matchResourceMatch[0].length
				);
			}

			const noPreAutoLoaders = requestWithoutMatchResource.startsWith("-!");
			const noAutoLoaders =
				noPreAutoLoaders || requestWithoutMatchResource.startsWith("!");
			const noPrePostAutoLoaders = requestWithoutMatchResource.startsWith("!!");
			let elements = requestWithoutMatchResource
				.replace(/^-?!+/, "")
				.replace(/!!+/g, "!")
				.split("!");
			let resource = elements.pop();
			elements = elements.map(identToLoaderRequest);

			asyncLib.parallel(
				[
					callback =>
						this.resolveRequestArray(
							contextInfo,
							context,
							elements,
							loaderResolver,
							callback
						),
					callback => {
						if (resource === "" || resource[0] === "?") {
							return callback(null, {
								resource
							});
						}

						normalResolver.resolve(
							contextInfo,
							context,
							resource,
							{},
							(err, resource, resourceResolveData) => {
								if (err) return callback(err);
								callback(null, {
									resourceResolveData,
									resource
								});
							}
						);
					}
				],
				(err, results) => {
					if (err) return callback(err);
					let loaders = results[0];
					const resourceResolveData = results[1].resourceResolveData;
					resource = results[1].resource;

					// translate option idents
					try {
						for (const item of loaders) {
							if (typeof item.options === "string" && item.options[0] === "?") {
								const ident = item.options.substr(1);
								item.options = this.ruleSet.findOptionsByIdent(ident);
								item.ident = ident;
							}
						}
					} catch (e) {
						return callback(e);
					}

					if (resource === false) {
						// ignored
						return callback(
							null,
							new RawModule(
								"/* (ignored) */",
								`ignored ${context} ${request}`,
								`${request} (ignored)`
							)
						);
					}

					const userRequest =
						(matchResource !== undefined ? `${matchResource}!=!` : "") +
						loaders
							.map(loaderToIdent)
							.concat([resource])
							.join("!");

					let resourcePath =
						matchResource !== undefined ? matchResource : resource;
					let resourceQuery = "";
					const queryIndex = resourcePath.indexOf("?");
					if (queryIndex >= 0) {
						resourceQuery = resourcePath.substr(queryIndex);
						resourcePath = resourcePath.substr(0, queryIndex);
					}

					const result = this.ruleSet.exec({
						resource: resourcePath,
						realResource:
							matchResource !== undefined
								? resource.replace(/\?.*/, "")
								: resourcePath,
						resourceQuery,
						issuer: contextInfo.issuer,
						compiler: contextInfo.compiler
					});
					const settings = {};
					const useLoadersPost = [];
					const useLoaders = [];
					const useLoadersPre = [];
					for (const r of result) {
						if (r.type === "use") {
							if (r.enforce === "post" && !noPrePostAutoLoaders) {
								useLoadersPost.push(r.value);
							} else if (
								r.enforce === "pre" &&
								!noPreAutoLoaders &&
								!noPrePostAutoLoaders
							) {
								useLoadersPre.push(r.value);
							} else if (
								!r.enforce &&
								!noAutoLoaders &&
								!noPrePostAutoLoaders
							) {
								useLoaders.push(r.value);
							}
						} else if (
							typeof r.value === "object" &&
							r.value !== null &&
							typeof settings[r.type] === "object" &&
							settings[r.type] !== null
						) {
							settings[r.type] = cachedCleverMerge(settings[r.type], r.value);
						} else {
							settings[r.type] = r.value;
						}
					}
				....	
				}
			);
		});
```

```js

			let resolver = this.hooks.resolver.call(null);

			// Ignored
			if (!resolver) return callback();

			resolver(result, (err, data) => {
				if (err) return callback(err);

				// Ignored
				if (!data) return callback();

				// direct module
				if (typeof data.source === "function") return callback(null, data);

				this.hooks.afterResolve.callAsync(data, (err, result) => {
					if (err) return callback(err);

					// Ignored
					if (!result) return callback();

					let createdModule = this.hooks.createModule.call(result);
					if (!createdModule) {
						if (!result.request) {
							return callback(new Error("Empty dependency (no request)"));
						}

						createdModule = new NormalModule(result);
					}

					createdModule = this.hooks.module.call(createdModule, result);

					return callback(null, createdModule);
				});
```

在`resolver`函数里面，我们会触发`afterResolve`钩子，钩子中会使用`new NormalModule(result)`创建`createdModule`,然后调用`callback`返回上一层继续执行`beforeResolve`钩子中`factory`函数的回调：

```js
create(data, callback) {
		const dependencies = data.dependencies;
		const cacheEntry = dependencyCache.get(dependencies[0]);
		if (cacheEntry) return callback(null, cacheEntry);
		const context = data.context || this.context;
		const resolveOptions = data.resolveOptions || EMPTY_RESOLVE_OPTIONS;
		const request = dependencies[0].request;
		const contextInfo = data.contextInfo || {};
		this.hooks.beforeResolve.callAsync(
			{
				contextInfo,
				resolveOptions,
				context,
				request,
				dependencies
			},
			(err, result) => {
				if (err) return callback(err);

				// Ignored
				if (!result) return callback();

				const factory = this.hooks.factory.call(null);

				// Ignored
				if (!factory) return callback();

				factory(result, (err, module) => {
					if (err) return callback(err);

					if (module && this.cachePredicate(module)) {
						for (const d of dependencies) {
							dependencyCache.set(d, module);
						}
					}

					callback(null, module);
				});
			}
		);
	}
```

然后调用`	callback(null, module);`继续向上层返回：

```js

_addModuleChain(context, dependency, onModule, callback) {
		....
		this.semaphore.acquire(() => {
			moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
        //回调返回的地方
				(err, module) => {
					if (err) {
						this.semaphore.release();
						return errorAndCallback(new EntryModuleNotFoundError(err));
					}

					let afterFactory;

					if (currentProfile) {
						afterFactory = Date.now();
						currentProfile.factory = afterFactory - start;
					}
					// here
					const addModuleResult = this.addModule(module);
					module = addModuleResult.module;

					onModule(module);

					dependency.module = module;
					module.addReason(null, dependency);

					const afterBuild = () => {
						if (addModuleResult.dependencies) {
							this.processModuleDependencies(module, err => {
								if (err) return callback(err);
								callback(null, module);
							});
						} else {
							return callback(null, module);
						}
					};

					if (addModuleResult.issuer) {
						if (currentProfile) {
							module.profile = currentProfile;
						}
					}

					if (addModuleResult.build) {
            //here
						this.buildModule(module, false, null, null, err => {
							if (err) {
								this.semaphore.release();
								return errorAndCallback(err);
							}

							if (currentProfile) {
								const afterBuilding = Date.now();
								currentProfile.building = afterBuilding - afterFactory;
							}

							this.semaphore.release();
							afterBuild();
						});
					} else {
						this.semaphore.release();
						this.waitForBuildingFinished(module, afterBuild);
					}
				}
			);
		});
	}

```

调用`addModule`将模块加入缓存中并返回一个模块相关的对象：

```js
addModule(module, cacheGroup) {
		const identifier = module.identifier();
		const alreadyAddedModule = this._modules.get(identifier);
		if (alreadyAddedModule) {
			return {
				module: alreadyAddedModule,
				issuer: false,
				build: false,
				dependencies: false
			};
		}
		const cacheName = (cacheGroup || "m") + identifier;
		if (this.cache && this.cache[cacheName]) {
			const cacheModule = this.cache[cacheName];

			if (typeof cacheModule.updateCacheModule === "function") {
				cacheModule.updateCacheModule(module);
			}

			let rebuild = true;
			if (this.fileTimestamps && this.contextTimestamps) {
				rebuild = cacheModule.needRebuild(
					this.fileTimestamps,
					this.contextTimestamps
				);
			}

			if (!rebuild) {
				cacheModule.disconnect();
				this._modules.set(identifier, cacheModule);
				this.modules.push(cacheModule);
				for (const err of cacheModule.errors) {
					this.errors.push(err);
				}
				for (const err of cacheModule.warnings) {
					this.warnings.push(err);
				}
				return {
					module: cacheModule,
					issuer: true,
					build: false,
					dependencies: true
				};
			}
			cacheModule.unbuild();
			module = cacheModule;
		}
		this._modules.set(identifier, module);
		if (this.cache) {
			this.cache[cacheName] = module;
		}
		this.modules.push(module);
		return {
			module: module,
			issuer: true,
			build: true,
			dependencies: true
		};
	}
```

调用完成上面的函数后继续调用`this.buildModule`函数：

```js
buildModule(module, optional, origin, dependencies, thisCallback) {
		let callbackList = this._buildingModules.get(module);
		if (callbackList) {
			callbackList.push(thisCallback);
			return;
		}
		this._buildingModules.set(module, (callbackList = [thisCallback]));

		const callback = err => {
			this._buildingModules.delete(module);
			for (const cb of callbackList) {
				cb(err);
			}
		};

		this.hooks.buildModule.call(module);
		module.build(
			this.options,
			this,
			this.resolverFactory.get("normal", module.resolveOptions),
			this.inputFileSystem,
			error => {
				const errors = module.errors;
				for (let indexError = 0; indexError < errors.length; indexError++) {
					const err = errors[indexError];
					err.origin = origin;
					err.dependencies = dependencies;
					if (optional) {
						this.warnings.push(err);
					} else {
						this.errors.push(err);
					}
				}

				const warnings = module.warnings;
				for (
					let indexWarning = 0;
					indexWarning < warnings.length;
					indexWarning++
				) {
					const war = warnings[indexWarning];
					war.origin = origin;
					war.dependencies = dependencies;
					this.warnings.push(war);
				}
				const originalMap = module.dependencies.reduce((map, v, i) => {
					map.set(v, i);
					return map;
				}, new Map());
				module.dependencies.sort((a, b) => {
					const cmp = compareLocations(a.loc, b.loc);
					if (cmp) return cmp;
					return originalMap.get(a) - originalMap.get(b);
				});
				if (error) {
					this.hooks.failedModule.call(module, error);
					return callback(error);
				}
				this.hooks.succeedModule.call(module);
				return callback();
			}
		);
	}
```

`this.buildModule`中调用`module.build`方法进行打包.大致的执行过程已经清晰后：调用`moduleFactory.create()`传入模块相关的数据，然后在回调中返回`NormalModule`对象，调用这个对象的`buildModule`方法来完成后序的打包操作。

接下来我们来手写这部分代码`SingleEntryPlugin`

```js
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
			compilation.addEntry(context, entry, name, callback)
		})
	}
}

module.exports = SingleEntryPlugin
```

在`make`钩子的事件监听中加入对`compilation.addEntry`方法的调用，然后需要实现一个`Compilation`类：

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

`addEntry`方法调用了`_addModuleChain`方法，方法中调用`NormalModuleFactory`方法的create方法创建一个`NormalModule`实例。调用

`NormalModule`的`buildModule`方法去完成构建操作。

接下来我们来实现`NormalModuleFactory.js`文件：

```js
const NormalModule = require('./NormalModule')
class NormalModuleFactory {
	create(data) {
		return new NormalModule(data)
	}
}

module.exports = NormalModuleFactory

```

`NormalModule.js`:

```js

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

接下来需要完成的是`Compilation`类的`buildModule`方法调用了`NormalModule`实例的`build`.在`build`方法中我们读去了文件的内容，生成了抽象语法树。

此外我们需要关注的就是`NormalModule`的`parser`属性：

```js
// Parser.js
const { Tapable } = require('tapable')
// 需要手动安装依赖
// webpac中使用的并不是 babylon
const babylon = require('babylon')
class Parser extends Tapable {
	parse(source) {
		return babylon.parse(source, {
			// parse in strict mode and allow module declarations
			sourceType: 'module',
			plugins: [
				// enable import() syntax
				'dynamicImport'
			]
		})
	}
}

module.exports = Parser

```

当我们的`make`钩子执行完成的回调中我们返回一个`Stats`类的实例

```js

const { Tapable, AsyncSeriesHook, SyncBailHook, AsyncParallelHook, SyncHook } = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation')
const Stats = require('./Stats')
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

		const onCompiled = (err, stats) => {
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

	....

	compile(callback) {
		const params = this.newCompilationParams()

		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err)

			this.hooks.compile.call(params)

			const compilation = this.newCompilation(params)

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err)
				callback(null, new Stats(compilation))
			})
		})
	}
}

module.exports = Compiler

```

`Stats.js`:

```js
class Stats {
	constructor(compilation) {
		const { modules, entries } = compilation
		this.modules = modules
		this.entry = entries
	}
	toJson() {
		return this
	}
}

module.exports = Stats
```

然后在外部调用的run方法的回调中，我们就可以使用`toJson`方法来查看打包相关的信息了。目前我们的打包器已经完成了构建中的源码读取，`ast`抽象语法树的生成。

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
      _source: "console.log('index.js执行了')\n",
      _ast: [Node],
      parser: [Parser]
    }
  ],
  entry: [
    NormalModule {
      context: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry',
      rawRequest: './src/index.js',
      name: 'main',
      resource: '/Users/lijunjie/js-code/webpack-hook/05_webpack_entry/src/index.js',
      _source: "console.log('index.js执行了')\n",
      _ast: [Node],
      parser: [Parser]
    }
  ]
}
```















