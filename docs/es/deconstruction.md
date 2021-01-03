### 解构

##  数组的解构

> 数组的解构是根据下标的位置去匹配的

* 解构数组的元素到指定的变量

```js
const arr = ['hello', 'world', 'baz']

const [a, b, c] = arr

console.log(a, b, c) // hello', 'world', 'baz'
```

* 只获取需要的参数

```js
const arr = ['hello', 'world', 'baz']

const [, b] = arr

console.log(b) //world
```

* 接受剩余的参数

> rest用来接受剩余参数，那么rest只能放在最后位置

```js
const arr = ['hello', 'world', 'baz']

const [a, ...res] = arr

console.log(res) //[ 'world', 'baz' ]
```

* 多余的变量会赋值undefined

```js
const arr = ['hello', 'world', 'baz']

const [a, b, c, d] = arr
// d相当于arr[3] 
console.log(d) //undefined
```

* 设置默认值，当解构出来的变量默认值为undefined时使用默认值

```js
const arr = ['hello', 'world', 'baz']

const [a, b, c, d = '12'] = arr

console.log(d) //undefined

```

*  使用

```js
const path = 'root/user/li'

const [, centerStr] = path.split('/')

console.log(centerStr) // user
```

## 对象的解构

>  对象的结构是根据属性去匹配的

* 属性和解构出来的变量同名，当解构出来的变量为undefined时，使用默认值

```js
const obj = { a: 'name', b: 'hello' }

const { a, b, c = 'world' } = obj

console.log(a, b, c) // "name" "hello" "world"
```

* 属性和解构出来的变量不同名

```js
const obj = { a: 'name', b: 'hello' }

const { a: name, b: hello } = obj
console.log(name, hello)//"name" "hello"
```

> 此时我们只声明了两个变量name和hello

* 多层级结构

```js
const obj = {
	a: 'name',
	b: 'hello',
	c: {
		h: 'wolrd'
	}
}

const {
	a: name,
	b: hello,
	c: { h: h1, g = 'zz' }
} = obj
console.log(name, hello, h1, g) //"name" "hello" "wolrd" "zz"
```

> 此处只声明了name, hello,h1,g,对应的属性不是变量名。

## 字符串的解构

> 字符串的解构是根据字符所在的下标去解构

```js
const str = 'hello world'

const [a, b] = str

console.log(a, b) //h e
//与数组和对象的解构类似，也可以使用默认值
const str = 'he'

const [a, b, c = 's'] = str

console.log(a, b, c) //h e s
```

