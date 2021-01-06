## for..of 和迭代器

### for ... of 循环

* 使用for..of 循环可以遍历所有实现了可迭代接口的对象（见下文）。内部已经实现该接口的对象有Array,Map,Set,String等对象。

```js
const arr = [1, 3, 5]
for (const item of arr) {
	console.log(item)
	//1
	// 3
	// 5
}
```

* 相对于传统的forEach方法，for..of 循环可以使用break关键字进行中断

```js
const arr = [1, 3, 5]
for (const item of arr) {
	if (item == 3) {
		break
	}
	console.log(item)
	//1
}

arr.forEach(element => {
	console.log(element)
	//1
	// 3
	// 5
})
```

* 遍历set和map

```js
const myset = new Set()
myset.add(1).add(5).add(12)

for (const item of myset) {
    console.log(item)
//1
//5
//12  
}


const mymap = new Map([
	['a', 1],
	['b', 23]
])

for (const item of mymap) {
	console.log(item)
	// [ 'a', 1 ]
	// [ 'b', 23 ]
}

// 使用解构

for (const [key, val] of mymap) {
	console.log(key, val)
	// a 1
	// b 23
}
```

:::tip

使用for...of遍历map的时候可以对变量进行解构操作

:::

* 遍历对象
  * 普通的对象是不能被直接遍历，
  * 如果想使用for...of去遍历对象，我们需要让对象实现可迭代接口
  * 通过Symbol.iterator

```js
const mymap = new Map([
	['a', 1],
	['b', 23]
])

console.dir(mymap[Symbol.iterator])

// 为对象实现可迭代接口

const values = ['aaa', 'bbb', 'ccc']

const it = {
	[Symbol.iterator]() {
		let index = 0
		return {
			next() {
				return {
					value: values[index],
					done: index++ >= values.length
				}
			}
		}
	}
}

for (const item of it) {
    console.log(item)
    
    // aaa
    // bbb
    // ccc
}
```

:::tip

对象 it实现了可迭代接口(iterable),有,Symbol.iterator方法 ,Symbol.iterator对应的函数返回的对象实现了迭代器接口(iterator)，有next()方法，next方法返回的对象实现了iteratorResult接口,有value和done属性。

:::

### 迭代器模式和迭代器

迭代器模式要求提供一个方法顺序去访问聚合对象的各个元素，而不需要暴露该对象的内部表示。

* 使用each方法实现迭代器模式

```js

const vals = {
	values: ['aaa', 'bbb', 'ccc'],
	each(cb) {
		values.forEach(e => {
			cb(e)
		})
	}
}
vals.each(console.log)

//aaa
// bbb
// ccc
```

* 使用for...of实现迭代器模式

```js
const vals = {
	values: ['aaa', 'bbb', 'ccc'],
	[Symbol.iterator]() {
		let index = 0
		return {
			next: () => {
				return {
					value: this.values[index],
					done: index++ >= this.values.length
				}
			}
		}
	}
}

for (const item of vals) {
	console.log(item)
	// aaa
	// bbb
	// ccc
}
```

### 生成器函数

```js
function* gen() {
	console.log('11')
	yield 11
	console.log('22')
	yield 22
}

const g = gen()

console.log(g.next())

console.log(g.next())

console.log(g.next())
// 11
// { value: 11, done: false }
// 22
// { value: 22, done: false }
// { value: undefined, done: true }
```

:::tip

生成器函数执行会返回一个生成器对象，生成对象调用next方法去执行生成器函数。

:::

* 生成器函数可以处理异步编程
* 生成器函数返回的生成器对象可以用来作为发号器

```js
function* createIdMaker() {
	let index = 0

	while (true) {
		yield index++
	}
}

const idMaker = createIdMaker()

console.log(idMaker.next().value) //0
console.log(idMaker.next().value) //1
```

* 生成器函数返回的生成器对象实现了迭代器接口，可以用来实现对象的可迭代接口

```js
const vals = {
	values: ['aaa12', 'bbb12', 'ccc12'],
	each(cb) {
		values.forEach(e => {
			cb(e)
		})
	},
	[Symbol.iterator]: function* () {
		for (const it of this.values) {
			yield it
		}
	}
}

for (const item of vals) {
	console.log(item)
	// aaa
	// bbb
	// ccc
}

```







