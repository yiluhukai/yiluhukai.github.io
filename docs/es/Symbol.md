### Symbol

#### 1.Symbol

es5中引入了中包含了5中原始类型：字符串、数字、布尔、null、underfined.es6中引入了第6中原始类型:Symbol.Symbol用来给对象添加非字符串属性。

* Symbol为对象增加独一无二的属性

```js
const sy = Symbol()

const sy1 = Symbol()

const obj = {
	[sy]: 'name1',
	[sy1]: 'symbol'
}

console.log(obj) //{ [Symbol()]: 'name1', [Symbol()]: 'symbol' }

```

* 为对象添加私有属性
  * 以前为对象添加的私有属性都是通过`_name`的方式来约定的，我们还是可以通过`_name`的方式来访问。
  * 使用Symbol可以给对象添加私有属性
  * In 和Object.keys()方法都不能检测到对象的Symbol属性，需要通过Object.getOwnPropertySymbols()方法获取

```js
let o = (function () {
	const _name = Symbol('_name')
	return {
		[_name]: 'tim cat',
		set name(val) {
			this[_name] = val
		},
		get name() {
			return this[_name]
		}
	}
})()

console.log(o) //{ name: [Getter/Setter], [Symbol(_name)]: 'tim cat' }
console.log(o.name) "tim cat"


for (const key in o) {
	console.log(key) // "name"
}

console.log(Object.keys(o)) //[ 'name' ]
```

#### 2.创建Symbol和辨识

Symbol不像其他的原始类型拥有原始值，需要通过全局的函数Symbol()来创建它。Symbol可以接受一个可选的描述字符串作为参数。通过Symbol()创建的每一个

Symbol都是唯一的。

``` js

let firstName = Symbol();
console.log(firstName) //Symbol()
let lastName = Symbol('lastname');
console.log(lastName) //Symbol(lastname)
let lastName1 = Symbol('lastname');
console.log(lastName === lastName1) //false
```

使用Symbol.for()创建全局可共享的Symbol,需要提供一个字符串标识作为参数，同时该参数也是字符串描述。调用该方法创建Symbol时，首先在全局注册标准中查找是否有该字符串辨识，如果有，直接返回该Symbol,否则再创建。

```js
    
let firstName = Symbol.for('Name');
let lastName = Symbol.for('Name');
console.log(firstName === lastName) //true
console.log(firstName) //"Symbol(Name)"

```
使用Symbol.keyFor()可以返回全局注册的Symbol的字符串辨识。

```js

let firstName = Symbol.for('Name');
let lastName = Symbol.for('Name');
let sym =Symbol("a Symbol");
console.log(Symbol.keyFor(firstName)) //"Name"
console.log(Symbol.keyFor(lastName)) //"Name"
console.log(Symbol.keyFor(sym)) //undefined
```
es6中扩展了typeof运算符，可以用来辨识Symbol.

```js

let firstName = Symbol();
console.log(typeof firstName) //"symbol"

```
用Symbol来创建对象的属性。Symbol属性只能通过变量作为计算属性来访时属性值。

```js

let firstName = Symbol('firstName');
const o = { }
o[firstName] = "hello ketty"
console.log(o[firstName]) // "hello ketty"
```
#### 3.Symbol的使用

所有可以使用计算属性的地方都可以使用Symbol.如对象字面量和Object.defineProperty().

```js

let firstName = Symbol('firstName');
let lastName = Symbol('lasttName');
const o = {
[firstName]: "hello ketty"
}
Object.defineProperty(o, lastName, {
writable: true
})

```

#### 4.Symbol的类型转换

Symbol不能强制转换成Nubmer类型，String()方法会调用toString()方法,。Symbol的描述字符串保存在内部的[[description]]属性中，只有调用toString()的方法才能获取到该属性。console.log()也会默认调用该方法。
```js

let firstName = Symbol.for('Name');
console.log(String(firstName)) //Symbol(Name)
console.log(Boolean(firstName)) //true

```
Symbol的不能隐式转化为字符串或数字。
```js

let firstName = Symbol.for('Name');
console.log(firstName+"") //Error
console.log(Boolean(firstName/1)) //Error

```
但是可以隐式转化为boolean类型。

```js

let firstName = Symbol.for('Name');
if(firstName){
    console.log(firstName) //Symbol(Name)
}

```

#### 5.属性检索

Object.keys()和Object.getOwnPropertyNames()方法不能获取到对象的Symbol属性。需要通过Object.getOwnPropertySymbols()方法来获取，其结果时值为Symbol的数字。

```js

let firstName = Symbol.for('Name');
var o = {
[firstName]: 123
}
const symArr = Object.getOwnPropertySymbols(o)
console.log(symArr[0] === firstName ) //true

```

#### 6.well-known Symbol

es6中通过Symbol暴漏了一些语言的内部逻辑。我们把这些Symbol称之为well-known Symbol。下面来看Symbol.hasInstance这个well-known Symbol.

* Symbol.hasInstance

  Symbol.hasInstance这个方法在Function.prototype上定义的，每个函数默认都会继承这个默认方法。该方法是不可枚举，不可写，不可配置的 。intanceof 是该方法的简写。

```js
//obj 必须为对象
obj instanceof  Array
//等价于
Array[Symbol.hasInstance](obj)
```
​	 如果我们想把一个函数定义为一个无实例的函数，我们可以使用Object.definePrototype()方法来修改他的Symbol.hasInstance方法。该方法可以改写一个不可写的方法。

```js

function MyObject(){ };
Object.defineProperty(MyObject,Symbol.hasInstance,{
    value:function(obj){
            return false;
     }
})
const o = new MyObject();
console.log(o instanceof MyObject) //false

```






