#### webpack和tapable

#### webpack的编译流程

* 配置初始化
* 编译内容
* 输出编译后的内容

`webpack`的工作机制可以看作事件驱动的事件工作流机制，将不同的插件串联了起来。 `webpack`的底层大量用到了`tapable`库，比如负责编译的`compiler`,负责创建`bundles`的`compilation`，都是`tapable`中的实例。

`tapable`本身就是一个独立的库，`tapable`的工作流程：

* 实例化`hook`去注册事件监听
* 通过`hook`去触发事件监听
* 执行懒编译生成的核心代码

#### Hook

`hook`本身就是`tapable`中的实例对象。`hook`根据不同的执行机制可以分成同步和异步`hook`.

`Hook`的执行特点：

* `Hook`:普通钩子，监听器之间互相独立不干扰
* `BailHook`:熔断钩子，某个监听返回非`undefined`时后续不执行
* `WaterfallHook`:瀑布钩子，上一个监听的返回值可以传递到下一个钩子中
* `LoopHook`：如果当前未返回`false`,则一直执行

`tapable`库的同步钩子

* SyncHook
* SyncBailHook
* SyncWaterfallHook
* SyncLoopHook

`tapable`库中的串行异步钩子

* AsyncSeriesHook
* AsyncSeriesBailHook
* AsyncSeriesWaterfallHook

`tapable`库中的并行异步钩子

* AsyncParalleHook
* AsyncParalleBailHook

#### 同步Hook的基本使用

```shell
mkdir syncHook & cd syncHook 
npm init -y
```

安装依赖：

```shell
npm install tapable -D
```

在`01_sync_hook.js`中使用`SyncHook`:

```js
const { SyncHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncHook(['name', 'age'])
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)
```

使用`node`执行：

```shell
$ node 01_sync_hook.js
fn1 yiluhuakai 25
fn2 yiluhuakai 25
fn3 yiluhuakai 25
```

在`02-sync-bail-hook.js`中使用`SyncBailHook`:

```js
const { SyncBailHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncBailHook(['name', 'age'])
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
	return false
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)
```

`node`中执行：

```shell
$ node 02_sync_bail_hook.js 
fn1 yiluhuakai 25
fn2 yiluhuakai 25
```

当一个监听返回非`undefined`后序的钩子终止执行。

在`03-sync-waterfall-hook.js`中使用`SyncWaterfallHook`:

```js
const { SyncWaterfallHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncWaterfallHook(['name', 'age'])
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
	return 'z1'
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
	return 'z2'
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)

```

`node`中的执行结果：

```shell
$ node 03_sync_waterfall_hook.js 
fn1 yiluhuakai 25
fn2 z1 25
fn3 z2 25
```

在`04-sync-loop-hook.js`中使用`SyncLoopHook`:

```js
const { SyncLoopHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncLoopHook(['name', 'age'])

let count1 = 0,
	count2 = 0
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
	if (++count1 === 1) {
		return undefined
	}
	return false
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)
```

`node中的执行结果`：

```shell
$ node 04_sync_loop_hook.js
fn1 yiluhuakai 25
fn2 yiluhuakai 25
fn3 yiluhuakai 25
```

修改代码继续执行：

```js
const { SyncLoopHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncLoopHook(['name', 'age'])

let count1 = 0,
	count2 = 0
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
	if (++count1 === 1) {
		return undefined
	}
	//return false
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
	if (++count2 === 1) {
		//count2 = 0
		return false
	}
	return undefined
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)
```

`node`中的执行结果：

```shell
$ node 04_sync_loop_hook.js
fn1 yiluhuakai 25
fn2 yiluhuakai 25
fn1 yiluhuakai 25
fn2 yiluhuakai 25
fn3 yiluhuakai 25
```

通过断点调试可以发现调用执行的代码是实际上执行的是的下面代码：

```js
(function anonymous(name, age
) {
"use strict";
var _context;
// this_x = [f1,f2,f3] 代表的是上面的监听函数  
var _x = this._x;
var _loop;
do {
    _loop = false;
    var _fn0 = _x[0];
    var _result0 = _fn0(name, age);
    if(_result0 !== undefined) {
				_loop = true;
		} else {
        var _fn1 = _x[1];
        var _result1 = _fn1(name, age);
        if(_result1 !== undefined) {
     		  _loop = true;
				} else {
          var _fn2 = _x[2];
          var _result2 = _fn2(name, age);
          if(_result2 !== undefined) {
             _loop = true;
          } else {
              if(!_loop) {
          }
		 		}
			}
	 }
} while(_loop);

})
```

可以看出来只要函数返回值不等于`undefined`，就会执行循环。

#### 异步钩子的使用

异步钩子的监听有三种方式：`tap`、`tapAsync`、`tapPromise`，对应的执行方式：`callAsync`、`callAsync`、`promise`

* AsyncParallelHook

```js
const { AsyncParallelHook } = require('tapable')

const asyncHook = new AsyncParallelHook(['name'])

console.time('time')

asyncHook.tap('fn1', function (name) {
	setTimeout(() => {
		console.log('fn1', '--->', name)
	}, 1000)
})

asyncHook.tap('fn2', function (name) {
	setTimeout(() => {
		console.log('fn1', '--->', name)
	}, 2000)
})

asyncHook.tap('fn3', function (name) {
	setTimeout(() => {
		console.log('fn1', '--->', name)
	}, 3000)
})

asyncHook.callAsync('ylp', function () {
	console.log('执行了回调函数')
})
```

在`node`中的执行结果：

```shell
$ node 01_async_parallel_hook.js
执行了回调函数
fn1 ---> ylp
fn1 ---> ylp
fn1 ---> ylp
```

代码的触发了钩子的事件监听，但是无法保证回调函数在钩子执行完成后执行。

使用`tapAsync`去注册事件监听：

```js
const { AsyncParallelHook } = require('tapable')

const asyncHook = new AsyncParallelHook(['name'])

console.time('time')

asyncHook.tapAsync('fn1', function (name, callback) {
	setTimeout(() => {
		console.log('fn1', '--->', name)
		callback()
	}, 1000)
})

asyncHook.tapAsync('fn2', function (name, callback) {
	setTimeout(() => {
		console.log('fn2', '--->', name)
		callback()
	}, 2000)
})

asyncHook.callAsync('ylp', function () {
	console.log('最后一个钩子执行了')
	console.timeEnd('time')
})

```

在`node`中执行：

```shell
$ node 01_async_parallel_hook.js
fn1 ---> ylp
fn2 ---> ylp
最后一个钩子执行了
time: 2010.713ms
```

上面的回调用来告诉`hook`,钩子中的任务执行完成了。

使用`tapPromise`来注册事件监听：

```js
console.time('time')

asyncHook.tapPromise('fn1', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn1', '--->', name)
			resolve()
		}, 1000)
	})
})

asyncHook.tapPromise('fn2', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn2', '--->', name)
			resolve()
		}, 2000)
	})
})

asyncHook.promise('ylp').then(function () {
	console.log('最后一个钩子执行了')
	console.timeEnd('time')
})
```

`node`中执行：

```shell
$ node 01_async_parallel_hook.js
fn1 ---> ylp
fn2 ---> ylp
最后一个钩子执行了
```

* `AsyncParalleBailHook`

```js
const { AsyncParallelBailHook } = require('tapable')

const asyncHook = new AsyncParallelBailHook(['name'])

console.time('time')

asyncHook.tapPromise('fn1', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn1', '--->', name)
			resolve()
		}, 1000)
	})
})

asyncHook.tapPromise('fn2', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn2', '--->', name)
			resolve('error')
		}, 2000)
	})
})

asyncHook.tapPromise('fn3', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn3', '--->', name)
			resolve()
		}, 3000)
	})
})

asyncHook.promise('ylp').then(function () {
	console.log('最后一个钩子执行了')
	console.timeEnd('time')
})
```

`node`中执行的结果：

```shell
$ node 02_async_parallel_bailhook.js
fn1 ---> ylp
fn2 ---> ylp
最后一个钩子执行了
time: 2014.157ms
fn3 ---> ylp
```

第二个钩子返回了一个非`undefined`的值，钩子执行完成的回调提前执行。

* AsyncSeriesHook

```js

const { AsyncSeriesHook } = require('tapable')

const asyncHook = new AsyncSeriesHook(['name'])

console.time('time')

asyncHook.tapPromise('fn1', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn1', '--->', name)
			resolve()
		}, 1000)
	})
})

asyncHook.tapPromise('fn2', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn2', '--->', name)
			resolve('error')
		}, 2000)
	})
})

asyncHook.tapPromise('fn3', function (name) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log('fn3', '--->', name)
			resolve()
		}, 3000)
	})
})

asyncHook.promise('ylp').then(function () {
	console.log('最后一个钩子执行了')
	console.timeEnd('time')
})
```

`node`中执行：

```shell
$ node 03_async_series_hook.js      
fn1 ---> ylp
fn2 ---> ylp
fn3 ---> ylp
最后一个钩子执行了
time: 6017.058ms
```

异步串行钩子的执行过程和同步钩子有点类似。

接下来我们对`tapable`中源码进行调试：

```js
const { SyncHook } = require('tapable')

// 创建一个SyncHook实例
const sh = new SyncHook(['name', 'age'])
// 注册监听事件
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
})

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})

sh.call('yiluhuakai', 25)

```

首先执行`new SyncHook(['name', 'age'])`,进入到函数内部：

```js
// SyncHook.js
"use strict";

const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
	throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
	throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;

```

在` SyncHook.js`中我们调用了`Hook.js`的Hook函数：

```js
class Hook {
	constructor(args = [], name = undefined) {
		this._args = args;
		this.name = name;
		this.taps = [];
		this.interceptors = [];
		this._call = CALL_DELEGATE;
		this.call = CALL_DELEGATE;
		this._callAsync = CALL_ASYNC_DELEGATE;
		this.callAsync = CALL_ASYNC_DELEGATE;
		this._promise = PROMISE_DELEGATE;
		this.promise = PROMISE_DELEGATE;
		this._x = undefined;

		this.compile = this.compile;
		this.tap = this.tap;
		this.tapAsync = this.tapAsync;
		this.tapPromise = this.tapPromise;
	}

	compile(options) {
		throw new Error("Abstract: should be overridden");
	}

	_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}

	_tap(type, options, fn) {
		if (typeof options === "string") {
			options = {
				name: options.trim()
			};
		} else if (typeof options !== "object" || options === null) {
			throw new Error("Invalid tap options");
		}
		if (typeof options.name !== "string" || options.name === "") {
			throw new Error("Missing name for tap");
		}
		if (typeof options.context !== "undefined") {
			deprecateContext();
		}
		options = Object.assign({ type, fn }, options);
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tap(options, fn) {
		this._tap("sync", options, fn);
	}

	tapAsync(options, fn) {
		this._tap("async", options, fn);
	}

	tapPromise(options, fn) {
		this._tap("promise", options, fn);
	}
```

我们创建`SyncHook`实例的过程实际上我们先调用`new Hook`创建一个实例，然后对实例上的一些方法、属性做了重写：

```js
function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}
```

然后我们执行`tap`方法去注册第一个事件监听：

```js
sh.tap('fn1', function (name, age) {
	console.log('fn1', name, age)
})
```

```js
// Hook.js
/*
	type:'sync',
	options:'fn1'
	fn:function (name, age) {
	console.log('fn1', name, age)
}) 
*/
_tap(type, options, fn) {
  if (typeof options === "string") {
    options = {
      name: options.trim()
    };
  } else if (typeof options !== "object" || options === null) {
    throw new Error("Invalid tap options");
  }
  if (typeof options.name !== "string" || options.name === "") {
    throw new Error("Missing name for tap");
  }
  if (typeof options.context !== "undefined") {
    deprecateContext();
  }
  options = Object.assign({ type, fn }, options);
  options = this._runRegisterInterceptors(options);
  this._insert(options);
}
tap(options, fn) {
		this._tap("sync", options, fn);
}
```

`_tap`方法会将上面的参数转换成一个`options`对象,然后去执行`this._insert`方法：

```js
options ={
  type:'sync',
  name:'fn1',
  fn:function (name, age) {
		console.log('fn1', name, age)
	}) 
} 
this._insert(options);
```

```js
// Hook.js

	_insert(item) {
		this._resetCompilation();
		let before;
		if (typeof item.before === "string") {
			before = new Set([item.before]);
		} else if (Array.isArray(item.before)) {
			before = new Set(item.before);
		}
		let stage = 0;
		if (typeof item.stage === "number") {
			stage = item.stage;
		}
		let i = this.taps.length;
		while (i > 0) {
			i--;
			const x = this.taps[i];
			this.taps[i + 1] = x;
			const xStage = x.stage || 0;
			if (before) {
				if (before.has(x.name)) {
					before.delete(x.name);
					continue;
				}
				if (before.size > 0) {
					continue;
				}
			}
			if (xStage > stage) {
				continue;
			}
			i++;
			break;
		}
		this.taps[i] = item;
	}
```

执行`_insert`方法，会将上面的`options`放到数组的第一个位置。后面我们继续执行下面的`tap`方法，会将新的`options`添加到`this.taps`中：

```js

sh.tap('fn2', function (name, age) {
	console.log('fn2', name, age)
})

sh.tap('fn3', function (name, age) {
	console.log('fn3', name, age)
})
```

然后我们去触发钩子：

```js
sh.call('yiluhuakai', 25)
```

会进入到`Hook.js`中执行` CALL_DELEGATE `,原因是`new Hook`时执行了` this.call = CALL_DELEGATE;`

```js
// this.call = CALL_DELEGATE;
const CALL_DELEGATE = function(...args) {
	this.call = this._createCall("sync");
	return this.call(...args);
};

_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}

```

执行`this._createCall("sync")`后`this.call`被赋值了`this.compile`的返回值：

```js
this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
```

```js
// SyncHook.js

//hook.compile = COMPILE;
const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};
```

上面的`factory`是`SyncHookCodeFactory`的实例：

```js
// SyncHook.js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncHookCodeFactory();
```

执行`factory.setup(this, options);`:

```js
// 	HookCodeFactory.js

// instance = Hook对象
/* options={
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		}
*/		
setup(instance, options) {
		instance._x = options.taps.map(t => t.fn);
}
```

执行完`setup`方法相当于将`this._x =this.taps.map(t => t.fn);`然后去执行：`return factory.create(options);`

```js
// 	HookCodeFactory.js


	create(options) {
		this.init(options);
		let fn;
		switch (this.options.type) {
			case "sync":
				fn = new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.contentWithInterceptors({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true
						})
				);
				break;
			case "async":
				fn = new Function(
					this.args({
						after: "_callback"
					}),
					'"use strict";\n' +
						this.header() +
						this.contentWithInterceptors({
							onError: err => `_callback(${err});\n`,
							onResult: result => `_callback(null, ${result});\n`,
							onDone: () => "_callback();\n"
						})
				);
				break;
			case "promise":
				let errorHelperUsed = false;
				const content = this.contentWithInterceptors({
					onError: err => {
						errorHelperUsed = true;
						return `_error(${err});\n`;
					},
					onResult: result => `_resolve(${result});\n`,
					onDone: () => "_resolve();\n"
				});
				let code = "";
				code += '"use strict";\n';
				code += this.header();
				code += "return new Promise((function(_resolve, _reject) {\n";
				if (errorHelperUsed) {
					code += "var _sync = true;\n";
					code += "function _error(_err) {\n";
					code += "if(_sync)\n";
					code +=
						"_resolve(Promise.resolve().then((function() { throw _err; })));\n";
					code += "else\n";
					code += "_reject(_err);\n";
					code += "};\n";
				}
				code += content;
				if (errorHelperUsed) {
					code += "_sync = false;\n";
				}
				code += "}));\n";
				fn = new Function(this.args(), code);
				break;
		}
		this.deinit();
		return fn;
	}

	init(options) {
		this.options = options;
		this._args = options.args.slice();
	}

```

首先是执行`this.init()`只要是在`factory(SyncHookCodeFactory实例)`上添加了`options`和`_args`属性：

```js
options={
  taps: [
    {
      type: "sync",
      fn: function (name, age) {
        console.log('fn1', name, age)
      },
      name: "fn1",
    },
    {
      type: "sync",
      fn: function (name, age) {
        console.log('fn2', name, age)
      },
      name: "fn2",
    },
    {
      type: "sync",
      fn: function (name, age) {
        console.log('fn3', name, age)
      },
      name: "fn3",
    },
  ],
  interceptors: [
  ],
  args: [
    "name",
    "age",
  ],
  type: "sync",
}
```

接下来我们去执行`create`方法中的

```js
case "sync":
				fn = new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.contentWithInterceptors({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true
						})
				);
				break;
```

执行完成后`fn`:

```js
function anonymous(name, age
  ) {
  "use strict";
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(name, age);
  var _fn1 = _x[1];
  _fn1(name, age);
  var _fn2 = _x[2];
  _fn2(name, age); 
}
```

接下来返回`fn`:

```js
this.deinit();
return fn;
```

`this.deinit()`是对我们调用`setup`方法是`factory`添加的属性的清除：

```js

deinit() {
		this.options = undefined;
		this._args = undefined;
}
```

然后函数返回：

```js
const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};
```

接着返回到：

```js
_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}
```

接着返回到：

```js
const CALL_DELEGATE = function(...args) {
	this.call = this._createCall("sync");
	return this.call(...args);
};
```

这个时候`this.call = fn`函数,然后执行该函数：

```js
args:[
  "yiluhuakai",
  25,
]

this.call =function anonymous(name, age
  ) {
  "use strict";
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(name, age);
  var _fn1 = _x[1];
  _fn1(name, age);
  var _fn2 = _x[2];
  _fn2(name, age);
  
}
```

通过上面的调试我们可以发现创建`SyncHook`实例的时候我们会在SyncHook构造方法中调用`Hook`的构造函数去保存形参到实例`_args`（["name","age",]）中。然后去覆盖`Hook`实例上一些用不到的方法,然后调用`tap`方法事件处理函数的信息(`options`)保存进`this._taps`中。然后我们调用`call`方法时，会使用到`SyncHookCodeFactory`的实例去生成执行函数到`call`.并将事件监听函数挂载到`hook`的`_x`属性上。最终执行`call`方法。

#### 手写SyncHook源码

* 我们需要一个Hook类让SyncHook去继承，实例上主要保存我们传入的形参(`_args`)和事件处理信息taps([])和注册同步事件的方法`tap`:

  ```js
  class Hook {
  	constructor(args) {
  		this._args = args
  		this.taps = []
  		this._x = undefined
  	}
  
  	_tap(type, options, fn) {
  		if (typeof options === 'string') {
  			options = { name: options }
  		}
  		//  将fn函数合并进去
  
  		options = Object.assign({ fn, type }, options)
  
  		// 掉用this._insert方法去保存options到 this.taps上
  		this._insert(options)
  	}
  
  	/**
  	 * 使用tap方法去注册同步钩子的处理事件
  	 */
  
  	tap(options, fn) {
  		this._tap('sync', options, fn)
  	}
  
  	_insert(item) {
  		this.taps[this.taps.length] = item
  	}
  }
  
  module.exports = {
  	Hook
  }
  ```

* `SyncHook`去继承`Hook`然后实现自己的call方法：

  ```js
  const { Hook } = require('./Hook.js')
  
  class SyncCodeFactory {
  	/**
  	 * 保存钩子的执行函数到钩子实例的_x中，然后生成的执行到代码是对象_x中函数的调用
  	 */
  	setup(instance, options) {
  		instance._x = options.taps.map(option => option.fn)
  	}
  
  	/**
  	 * 保存信息到当前的factory实例上
  	 */
  	init(options) {
  		this.options = options
  		this.args = options.args.slice()
  	}
  
  	/*
      
          我们的factory是单例的，所以我们使用完要清除factory上的信息
      */
  
  	deinit() {
  		this.options = undefined
  		this.args = undefined
  	}
  
  	/**
  	 *
  	 * 生成对钩子的执行代码
  	 */
  
  	create(options) {
  		this.init(options)
  		let content = `var _x =  this._x;`
  		for (let i = 0; i < this.options.taps.length; i++) {
  			content += `var _fn${i} = _x[${i}];_fn${i}(${this.args.join(',')});`
  		}
  		const fn = new Function(this.args.join(','), content)
  		this.deinit()
  		return fn
  	}
  }
  
  const fatcory = new SyncCodeFactory()
  
  class SyncHook extends Hook {
  	constructor(args) {
  		super(args)
  	}
  	/**
  	 * 实现对SyncHook的调用
  	 */
  	call(...args) {
  		let call = this._createCall('sync')
  		return call.apply(this, args)
  	}
  
  	_createCall(type) {
  		// 传递taps和args给factory
  		return this.compile({
  			taps: this.taps,
  			type,
  			args: this._args
  		})
  	}
  
  	/**
  	 *
  	 * @param {*} options
  	 *
  	 * 调用factory的方法生成钩子的执行函数
  	 */
  	compile(options) {
  		fatcory.setup(this, options)
  		return fatcory.create(options)
  	}
  }
  
  module.exports = { SyncHook }
  
  ```

* 测试代码：

  ```js
  const { SyncHook } = require('./SyncHook.js')
  
  // 创建一个SyncHook实例
  const sh = new SyncHook(['name', 'age'])
  // 注册监听事件
  sh.tap('fn1', function (name, age) {
  	console.log('fn1', name, age)
  })
  
  sh.tap('fn2', function (name, age) {
  	console.log('fn2', name, age)
  })
  
  sh.tap('fn3', function (name, age) {
  	console.log('fn3', name, age)
  })
  
  sh.call('yiluhuakai', 25)
  
  ```


#### AsyncParallelHook

`AsyncParallelHook`钩子的`tapAsync`方法和`SyncHook`的`tap`方法基本类似：区别在于传入的`type`是`async`而不是`sync`

```js
//Hook.js

class Hook {
	constructor(args) {
		this._args = args
		this.taps = []
		this._x = undefined
	}

	_tap(type, options, fn) {
		if (typeof options === 'string') {
			options = { name: options }
		}
		//  将fn函数合并进去

		options = Object.assign({ fn, type }, options)

		// 掉用this._insert方法去保存options到 this.taps上
		this._insert(options)
	}

	/**
	 * 使用tap方法去注册同步钩子的处理事件
	 */

	tap(options, fn) {
		this._tap('sync', options, fn)
	}

	_insert(item) {
		this.taps[this.taps.length] = item
	}

	/**
	 * 异步钩子添加事件的方法
	 */
	tapAsync(options, fn) {
		this._tap('async', options, fn)
	}
}

module.exports = {
	Hook
}

```

`AsyncParallelHook`钩子的`callAsync`方法也和SyncHook的`call`类似，区别就在于最终由`CodeFactory`生成的执行代码不一样：

```js

const { Hook } = require('./Hook.js')

class AsyncCodeFactory {
	/**
	 * 保存钩子的执行函数到钩子实例的_x中，然后生成的执行到代码是对象_x中函数的调用
	 */
	_args({ before, after } = {}) {
		let allArgs = this.args
		if (before) allArgs = [before].concat(allArgs)
		if (after) allArgs = allArgs.concat(after)
		return allArgs.join(',')
	}

	setup(instance, options) {
		instance._x = options.taps.map(option => option.fn)
	}

	/**
	 * 保存信息到当前的factory实例上
	 */
	init(options) {
		this.options = options
		this.args = options.args.slice()
	}

	header() {
		return `"use strict"\nvar _context;\nvar _x = this._x;\n`
	}

	/*
    
        我们的factory是单例的，所以我们使用完要清除factory上的信息
    */

	deinit() {
		this.options = undefined
		this.args = undefined
	}

	/**
	 *
	 * 生成对钩子的执行代码
	 */
	// function anonymous(name, _callback) {
	//     "use strict";
	//     var _context;
	//     var _x = this._x;
	//     do {
	//         var _counter = 2;
	//         var _done = (function() {
	//             _callback();
	//         });

	//         if(_counter <= 0) break;

	//         var _fn0 = _x[0];
	//         _fn0(name, function() {   if(--_counter === 0) _done();})
	//         if(_counter <= 0) break;
	//         var _fn1 = _x[1];
	//         _fn1(name, (function(_err1) {   if(--_counter === 0) _done();})
	//     } while(false);
	// }
	create(options) {
		this.init(options)

		console.error(this.header())
		let content = `do {\n _counter = ${options.taps.length};\n var _done = (function() {\n_callback();\n});`

		for (let i = 0; i < this.options.taps.length; i++) {
			content += ` if(_counter <= 0) break; var _fn${i} = _x[${i}];
                _fn${i}(${this.args.join(',')},
				function () {
					if (--_counter === 0) {
						_done()
					}
				});`
		}
		content += '\n} while(false)'
		const fn = new Function(this._args({ after: '_callback' }), this.header() + content)
		this.deinit()
		return fn
	}
}
```









