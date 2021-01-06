### TypeScript

TypeScript注意是为了解决js的类型系统的问题而产生的，由于js是一门弱类型、动态类型的语言，所以在类型系统方面存在很大的弊端。由于设计之初是为了处理简单的表单验证问题，强类型反而是代码复杂，而js是脚本语言，没有编译的过程，所以是动态类型的

* 强类型和弱类型

  * 强类型语言有更严格的类型约束，而静态语言几乎没有类型约束
  * 强类型的语言不允许隐式类型转化，弱类型允许隐式类型转化
  * 代码中的类型错误是在运行阶段通过代码检测手动抛出的

  ```js
  console.log(100 + '1') //'1001'
  
  console.log(Math.floor(true)) //1
  
  console.log(Math.floor('asdsa')) //NaN
  // 
  const path = require('path')
  
  console.log(path.dirname(1111)) 
  //TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type number
  
  ```

  ::: tip

  c语言中的0和非0可以转成布尔类型用在if和else中，所以c是弱类型的语言

  :::

*  静态语言和动态语言

  * 静态类型的语言中声明的变量类型不能再修改，而动态类型的语言的类型是在运行阶段确定，变量的类型还可以随时修改

```js
var foo = "abd"

foo =10

console.log(foo) //10

```

* 弱类型、动态语言的缺点
  * 一些错误在运行阶段才能捕获
  * 类型不确定，运行结果可以不符合预期

```js
const a = {}
a.foo() //TypeError: a.foo is not a function
function sum(a, b) {
	return a + b
}

sum(1, 2) //3

sum(1, '2') //12
```

* 强类型、静态语言的好处
  * 代码可以再编译阶段进行代码的静态类型检测，不用等到运行阶段才能发现错误
  * 代码提示更准确
  * 重构代码更牢固
  * 减少了不必要的类型判断

```js
function foo(elem){
  // 不会给出提示，因为不能确定elem的类型
  elem.innerHTML = "aa"
}
// 重构代码中修改对象的属性,如果代码中其他地方有用到o,动态语言可能存在修改不彻底的问题，静态语言会全部以错误的形式报出来
const  o ={
  aa(){
    console.log('aaa')
  }
}
// 需要去判断传入实参的类型
function sum(a, b) {
	if (typeof a !== 'number' && typeof b !== 'number') {
		throw new TypeError('arguments type is invalid')
	}

	return a + b
}
```



