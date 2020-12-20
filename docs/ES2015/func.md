### 函数

## 默认值参数

* 函数的默认值参数

```js
function sum(a = 10, b) {
	return a + b
}

console.log(sum(undefined, 3)) // 13
```

* ES2015之前设置默认值

```js
//短路与
function sum(a, b) {
	a = a || 10
	return a + b
}

console.log(sum(undefined, 3)) // 13
// 和我们预期的结果不符，只要出现假值就是会被替换成默认值
console.log(sum(0, 3)) //13

// 和undefined去比较
function sum(a, b) {
	a = a === void 0 ? 10 : a
	return a + b
}

console.log(sum(undefined, 3)) // 13
console.log(sum(0, 3)) //3
```

>短路与无法去适用于我们传入的值是假值的情况，而使用三目运算符去和undefined比较又比较麻烦，默认值参数解决了这两个问题

## 剩余参数

剩余参数主要为了解决一个函数的参数个数不确定的情况

* ES2015之前实现

```js
function restArg() {
	const args = [].slice.apply(arguments)
	console.log(args) //[ 1, 2, 4, 5 ]
}

restArg(1, 2, 4, 5)
```

* ES2015中我们可以使用剩余参数

```
function restArg(...args) {
	console.log(args) //[ 1, 2, 4, 5 ]
}

restArg(1, 2, 4, 5)
```

:::warning

 剩余参数在函数中只能用一次，且只能是函数的最后一个参数

:::

## 数组的解构

* 在es2015之前我们要讲一个数组作为参数传递给函数，需要使用使用apply方法。

```js
function MyConsole(a, b, c, d) {
	console.log(a, b, c, d)
}

MyConsole.apply(this, [1, 2, 3, 4])
```

* ES2015中数组结构

```js
function MyConsole(a, b, c, d) {
	console.log(a, b, c, d)
}

MyConsole(...[1, 2, 3, 4])
```



## 箭头函数

* 箭头函数可以简化函数字面量的声明

```js
const a = function () {
	return 10
}
// 等价于
const a = () => 10
```

* 当函数的参数只有一个时，可以省略箭头函数的()

```js
const b = n => n + 1
```

* 当函数的函数体只有一句时，可以省略return和{}.

```js
// 不需要return {}
const b = n => n + 1
// 当时返回值时对象的时候，需要添加()
const cb = c => ({
	c
})
```

:::warning

当时返回值时对象的时候，需要添加()，原因在于{}在这会有歧义，不知道时函数体还是对象外层括弧。

:::

* 代替匿名函数

```js
const arr = [1, 2, 3]

const res = arr.map(function (item) {
	return item + 1
})

console.log(res) // [2,3,4]

const r = arr.map(item => item + 1)
console.log(res) //[(2, 3, 4)]
```

* 箭头函数没有this,this是父级作用的this.

```js
const obj = {
	name: 'tom',
	getName: function () {
		console.log(this.name)
	},
	get_name: () => {
		console.log(this.name)
	},
	getNameAfter20: function () {
		const _self = this
		setTimeout(function () {
			console.log(_self.name)
		}, 20)
	},
	get_name_after20: function () {
		setTimeout(() => {
			console.log(this.name)
		}, 20)
	}
}

obj.getName() //'tom'
obj.get_name() //undefined

obj.getNameAfter20() //'tom'

obj.get_name_after20() //'tom'
```









