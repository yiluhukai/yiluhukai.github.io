#### Function.prototype.bind()

```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用,返回一个原函数的拷贝，并拥有指定的 **`this`** 值和初始参数。

* 绑定this

```js
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();
// 返回 9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```

* 偏函数 
  * 为返回的函数提供预设的参数

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var list1 = list(1, 2, 3); // [1, 2, 3]

var result1 = addArguments(1, 2); // 3

// 创建一个函数，它拥有预设参数列表。
var leadingThirtysevenList = list.bind(null, 37);

// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = addArguments.bind(null, 37);

var list2 = leadingThirtysevenList();
// [37]

var list3 = leadingThirtysevenList(1, 2, 3);
// [37, 1, 2, 3]

var result2 = addThirtySeven(5);
// 37 + 5 = 42

var result3 = addThirtySeven(5, 10);
// 37 + 5 = 42 ，第二个参数被忽略
```

* 创建构造函数
  * 当`bind`的返回值函数作为构造函数被`new`调用时，会忽略`bind`函数传入的第一个参数,其他的参数会做为预置参数传入。
  * `F.bind(this).prototype`等于`undefined`
  * `a instanceof F.bind(this)`返回`true`,`a instanceof F`,返回`true`.

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return this.x + "," + this.y;
};

const XPoint = Point.bind({ a: 10 }, 10);

const p = new XPoint(20);

console.error(p); //Point { x: 10, y: 20 }

console.log(p instanceof Point); // true
console.log(p instanceof XPoint); // true
```

::: info

`instanceof`的工作机制是后面的函数的`prototype`属性是否在前面的对象的原型上，所以``a instanceof F.bind(this)`返回`true`比较特殊

:::

* `bind`无参数或者参数为`null`或`undefined`
  * 此时函数中的`this`取决与函数的执行环境的`this`，相当于原函数原本的`this`指向
  * 一个误区是我们经常认为当`F.bind(null)`是该函数的`this`一定是全局对象，这是错误的，出现这种情况，是因为函数的this没有指定的时候是全局对象，当我们修改函数的`this`指向时，当前的`this`就不一定时全局对象啦。

```js

function Point(x, y) {
  console.log(this); // 当前Point执行时的this时global,可以设置成其他的对象
  this.x = x;
  this.y = y;
}


const nullPoint = Point.bind(null, 10);

nullPoint();
```

* 当我们使用`bind`函数时，第一个参数是原始值会转化为对应的对象。

```js
const a = function () {
  console.dir(this); //[Number: 10]
}.bind(10);

a();

const b = function () {
  console.dir(this); // [String: '10']
}.bind("10");
b();
```

