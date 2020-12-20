### 对象

## 对象字面量的增强

* 当对象的key和value相同时，我们可以可以简写

```js
const name = 'tom'

const o = { name: name }
const o1 = { name }
```

* 计算属性名

```js
const name = 'tom'

const obj = { [name]: '123' }

console.log(obj) // { tom: '123' }
```

* 对象的方法简写

```js
const obj = {
	[name]: '123',
	sayName() {
		console.log(this.name)
	}
}
```

## Object.assign

将对象属性从源对象复制到目标对象,返回目标对象

```js
const source = {
	a: 1,
	b: 2
}

const target = {
	a: 2,
	c: 3
}
const res = Object.assign(target, source)
console.log(res) //{ a: 1, c: 3, b: 2 }
console.log(target) // { a: 1, c: 3, b: 2 }
console.log(res == target) //true
```

* 可以接受任意多个source对象

```js
const result = Object.assign({}, target, source) //{ a: 1, c: 3, b: 2 }
// 等价于
const res = { ...target, ...source }

console.log(result) // { a: 1, c: 3, b: 2 }
console.log(res) //{ a: 1, c: 3, b: 2 }
```

## Object.is

在ES2015之前判断两个数相等有两种方法：==、===，==在比较时候会进行类型转换，而===不会。

```js
console.log(2 == '2') //  true
console.log(2 === '2') // false
```

当时这两个方法在对NaN时返回false,而+0和-0的比较时会返回true.Object.is就是为了解决这个问题而产生的，其他情况下和===一样

```js
console.log(+0 === -0) // true
console.log(NaN === NaN) //false

console.log(Object.is(+0, -0)) // false
console.log(Object.is(NaN, NaN)) // true
```

## Proxy

为目标对象设置代理可以检测对象的改变，这个代理对象相等于一个门禁，对目标对象的操作等必须经过这个代理对象。

* ES2015之前监视对象的属性的读写需要使用使用Object.defineProperty().

```
const o = {}

Object.defineProperty(o, 'name', {
	set(name) {
		console.log('set name')
		this._name = name
	},
	get() {
		console.log('get name')
		return this._name
	}
})

o.name = 'tim' // set name
o.name //get name
```

* ES2015中提供了更强大的方法：Proxy

```js
const o = {}
const proxy = new Proxy(o, {
	get(target, property) {
		return target[property] || 'default value'
	},
	set(target, property, value) {
		if (property === 'age') {
			// 检验value是不是一个int类型的
			if (!Number.isInteger(value)) {
				throw new TypeError(`${value} is int type`)
			}
		}
		target[property] = value
	}
})

//proxy.age = '10' //TypeError: 10 is int type

proxy.age = 10

console.log(o) // { age: 10 }

console.log(proxy.name) //default value
```

* Object.defineProperty和Proxy对比

  *  Object.defineProperty检测对象的时候一次只能检测一个，Proxy可以检测任意属性的变化
  * Proxy还能检测对象的其他的变化，例如删除对象的属性

  ```js
  const o = {}
  
  const proxy = new Proxy(o, {
  	deleteProperty(target, property) {
  		console.log('delete')
  		delete target[property]
  	}
  })
  
  //proxy.age = '10' //TypeError: 10 is int type
  
  proxy.age = 10
  proxy.name = 'name'
  delete proxy.age // delete
  ```

  * Proxy对象的检测是非入侵的，不用对目标对象进行修改

* 使用Proxy对象检测数组的变化

```js

const arr = [1, 2, 3]

const proxy = new Proxy(arr, {
	set(target, property, value) {
		console.log('set', property, value)
		//set 3 20
		//set length 4
		target[proxy] = value
		return true
	}
})

proxy.push(20)
```

> 可以自动检测属性的变化，比如数组的下标















