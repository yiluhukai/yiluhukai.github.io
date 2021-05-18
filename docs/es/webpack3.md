#### webpack和tapable

#### webpack的编译流程

* 配置初始化
* 编译内容
* 输出编译后的内容

`webpack`的工作机制可以看作事件驱动的时间工作流机制，将不同的插件串联了起来。 `webpack`的底层大量用到了`tapable`库，比如负责编译的`compiler`,负责创建`bundles`的`compilation`，都是`tapable`中的实例。

`tapable`本身就是一个独立的库，`tapable`的工作流程：

* 实例化`hook`去注册事件监听
* 通过`hook`去触发事件监听
* 执行懒编译生成的核心代码

#### Hook

`hook`本身就是`tapable`中的实例对象。`hook`根据不同的执行机制可以分成同步和异步`hook`.

`Hook`的执行特点：

* Hook:普通钩子，监听器之间互相独立不干扰
* BailHook:熔断钩子，某个监听返回非`undefined`时后续不执行
* WaterfallHook:瀑布钩子，上一个监听的返回值可以传递到下一个钩子中
* LoopHook：如果当前未返回`false`,则一直执行

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

#### Hook的基本使用

```shell
mkdir syncHook & cd syncHook 
npm init -y
```

安装依赖：

```shell
npm install tapable
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

通过断点调试可以发现调用执行的代码是实际上执行的是生成的下面代码：

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

看以看出来只要函数返回值不等于`undefined`，就会执行循环。





