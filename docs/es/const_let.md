### let和const



### let和var的区别

* 块级作用域

```js
if (true) {
	var a = 10
}

console.log(a) //10

if (true) {
	let b = 11
}

console.log(b) //ReferenceError: b is not defined
```

* var会变量提升,const不会

```js
console.log(typeof a) //"undefined"

var a = 10

console.log(typeof b) //Cannot access 'b' before initialization

let b = 10

```

* let不能重复声明

```js

let a = 10
let a = 11 //SyntaxError: Identifier 'a' has already been declared

var b = 11
let b = 20 //SyntaxError: Identifier 'a' has already been declared

```

* for循环中使用

```js
for (let i = 0; i < 2; i++) {
	for (let i = 0; i < 3; i++) {
		console.log(i) // 0 1 2 0 1 2
	}
}
```

>  两个for循环中声明的变量在不同的作用域

* 闭包问题

```js
const elems = [{}, {}, {}]

for (var i = 0; i < 3; i++) {
	elems[i].onClick = function () {
		console.log(i)
	}
}

elems[0].onClick() //3

// 使用闭包

const elems = [{}, {}, {}]

for (var i = 0; i < 3; i++) {
	elems[i].onClick = (function (i) {
		return function () {
			console.log(i)
		}
	})(i)
}

elems[0].onClick() //0


// 使用let
const elems = [{}, {}, {}]

for (let i = 0; i < 3; i++) {
	elems[i].onClick = function () {
		console.log(i)
	}
}

elems[0].onClick() //0
```

> 函数会把var声明的变量报错自己的作用域上，随着 i的不断变化，闭包中的值也在变化，为了解决这个问题，我们可以使用自指向函数穿参数的方法copy当前的i值，此时函数访问到闭包中的值就是不变的。let声明的变量，循环体和变量的声明位置数据不同的作用域。

* for循环中let和循环体中的let属于不同的作用域,而var不会做作用域隔离

```js
for (let i = 0; i < 3; i++) {
	let i = 'hello'
	console.log(i) // "hello"
}
let i = 0
// 相当于
if (i < 3) {

 
// 相当于
let i = 0
// 相当于
while (i < 3) {
	;(function (k) {
		let i = 'hello'
		console.log(i)
	})(i)
	i++
}

```

###  const

* const必须初始化

```js
const a = 10s
const  b // Missing initializer in const declaration
```

* const声明的变量不能重新赋值

```js
const a =10
a= 20 // Assignment to constant variable.

const a = {a:10}
a.a =11
a ={} // TypeError: Assignment to constant variable.
```

* 其他方面和let一样

