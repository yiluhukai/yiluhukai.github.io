## ES中的模版字符串

* 模版字符串使用的`去标记

```js
const str = `hello "world"  \`zz\``

console.log(str) // hello "world"  `zz`
```

> 只需要对反引号做转译，其他的都按原字符输出

* 模版字符串中可以插入值，这个值可以变量或者表达式（有返回值）

```js
const name = 'lilei'
const str = `hello world,${name},${1 + 2}` //hello world,lilei,3
```

* 可以在模版字符串前面加一个tag,这个tag是一个函数的引用

```js
const name = 'lilei'
const str = console.log`hello world,${name}sss${1 + 3}` //[ 'hello world,', 'sss', '' ] lilei 4
```

* 模版字符串被插值表达式分割成一个数组传入tag的第一个参数，插值变量作为参数传入作为tag函数的其他参数

```js
function myTagFunc(strings, name, sum) {
	// 自定义一些逻辑
	let sumStr = ''
	if (sum > 3) {
		sumStr = 3
	}
	console.log(strings[0] + name + strings[1] + sumStr + strings[2]) //h2,lileiss3
	return '123'
}

const name = 'lilei'

const res = myTagFunc`h2,${name}ss${1 + 3}`

console.log(res) //123
```

* tag函数的返回值可以是字符串，还可以是undefined,还可以是一个函数。

```js
function template(strings, ...keys) {
  return (function(...values) {
    var dict = values[values.length - 1] || {};
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}

var t1Closure = template`${0}${1}${0}!`;
t1Closure('Y', 'A');  // "YAY!"
var t2Closure = template`${0} ${'foo'}!`;
t2Closure('Hello', {foo: 'World'});  // "Hello World!"
```

* 原始字符串

在标签函数的第一个参数中，存在一个特殊的属性`raw` ，我们可以通过它来访问模板字符串的原始字符串，而不经过特殊字符的替换

```js
const name = 'lilei'

const res = myTagFunc`h2,${name}ss${1 + 3}`

console.log(res) //123

function tag(strings) {
	console.log(strings.raw[0]) // 'string text line 1 \n string text line 2 '
	console.log(strings[0])
	// 不在一行
	//string text line 1
	//string text line
}

tag`string text line 1 \n string text line 2 ${name}`
```

## ES2015中新增的关于操作字符串的方法

* includes

* endsWith
* startsWith

```js
const str = 'hello world'

console.log(str.endsWith('ld')) //true

console.log(str.startsWith('he')) // true

console.log(str.includes('hello')) //true
```

