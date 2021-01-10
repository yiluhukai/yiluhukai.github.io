## flow

flow是一个javascript的类型检测器

### flow的使用

* 在项目的根目录下安装flow的依赖

```shell
mkdir flow & cd flow

yarn init -y

yarn add flow-bin --dev
```

* 创建`.flowconfig`文件

  ```js
  yarn flow init
  ```

  * 会生成一个`.flowconfig`文件

  ```
  [ignore]
  
  [include]
  
  [libs]
  
  [lints]
  
  [options]
  
  [strict]
  ```

* 在跟目录下创建src文件，编写代码

```js
/**
 * demo
 * @flow
 */

function sum(a: number, b: number) {
	return a + b
}

sum(1, 3)

sum('1', '3')
```

:::warning

1.需要关闭vscode中对js语法的校验，settings ->搜索 javascript validate ->关闭javascript验证

2 .@flow在文件中是必须的

:::

* 启动flow服务器检测代码

```shell
yarn flow 
```

:::tip

yarn flow start/stop去启动flow服务器，yarn flow命令第一运行也会去启动flow服务器，启动之后我们在终端中看到对应的错误信息.

更多的flow命令可以通过yarn flow --help去查看

:::

```js
yarn run v1.22.4
$ /Users/lijunjie/js-code/flow/node_modules/.bin/flow
Error ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ flow-01.js:12:5

Cannot call sum with 'abd' bound to a because string [1] is incompatible with number [2]. [incompatible-call]

 [2]  6│ function sum(a: number, b: number) {
      7│        return a + b
      8│ }
      9│
     10│ sum(1, 3)
     11│
 [1] 12│ sum('abd', '13')
     13│


Error ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ flow-01.js:12:12

Cannot call sum with '13' bound to b because string [1] is incompatible with number [2]. [incompatible-call]

 [2]  6│ function sum(a: number, b: number) {
      7│        return a + b
      8│ }
      9│
     10│ sum(1, 3)
     11│
 [1] 12│ sum('abd', '13')
     13│



Found 2 errors
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

* 上面的代码并不是标准的js语法，我们需要在生产环境中删除对应的类型注解

  * 使用babel中提供的插件也可以移除我们添加的类型注解

    ```shell
     #@babel/cli 让我们可以直接在终端中使用babel命令  @babel/preset-flow是移除类型注解的插件
     yarn add @babel/core @babel/cli @babel/preset-flow --dev
    ```

    * 添加babel的配置文件`.babelrc`

    ```
    {
        "presets": [
            "@babel/preset-flow"
        ]
    }
    ```

    * 运行命令去移除类型注解

    ```shell
    yarn babel src -d dist
    ```

    ```js
    function sum(a, b) {
      return a + b;
    }
    
    sum(1, 3);
    sum('abd', '13');
    ```

  * 使用官方提供的flow-remove-types 包来删除类型注解

    ```shell
    yarn add flow-remove-types --dev
    
    # 删除对应的代码注解，将处理后的代码放入到dist目录下
    # src 代码我们代码的源文件
    
    yarn flow-remove-types src -d dist
    ```

    * 处理后的代码

    ```js
    /**
     *
     *      
     */
    
    function sum(a        , b        ) {
    	return a + b
    }
    
    sum(1, 3)
    
    sum('abd', '13')
    
    ```

* 使用vscode插件检测flow中的类型错误
  
  * 每次都去运行yarn flow命令检测代码中的类型错误很麻烦，vscode中有对应的插件可以直接去查看错误，安装flow的编辑器插件Flow Language Support

### flow的语法规则

* 类型推断

```js
/**
 * 类型推断
 * @flow
 */

function multip(n) {
  //Cannot perform arithmetic operation because  string [1] is not a number.Flow(unsafe-addition)
	return n * n
}

multip(10)

multip('10')
```

:::tip

上面的n在函数中做了乘法操作，所以参数会被推断成number类型。当我们穿入字符串类型的参数时会报出错误。

:::

* 类型注解
  * 类型注解可以用在变量的声明，函数的参数和返回值位置
  * flow的类型注解不是强制使用的

```js
/**
 * 类型注解
 * @flow
 */

function sum(n: number): number {
	return n + 1
}

let a: string = 'abc'
```

* flow中支持的原始类型

  * flow支持js中的原始数据类型

  * boolean、string、number、undefined、null、symbol
```js
/**
 * 原始类型
 * flow
 */

let n: number = 10 //NaN //Infinity

let str: string = 'abs'

let b: boolean = true //false

let nu: null = null

let un: void = undefined

let s: Symbol = Symbol()
```

*  数组类型

```js
/**
 * 数组类型
 *
 * @flow
 */

const arr: Array<number> = [1, 2, 3, 4]

const arr1: string[] = ['ab', 'cd']

// 固定长度的数组 -> 元组

const a: [string, number] = ['', 11]

```

* 对象

```js

/**
 * 对象
 *
 * @flow
 */

const o: { foo: string, bar: number } = {
	foo: 'foo',
	bar: 10
}

// 可选的属性

const obj: { foo?: string, bar: number } = {
	bar: 10
}

const obj1: { foo?: string, bar: number } = {
	bar: 10,
	foo: 'ss'
}

// 限定对应中键值对的类型

const objs: { [string]: string } = {}

objs['bar'] = 'bar'
obj.foo = '10'

```

* 函数类型

```js
/**
 * 函数类型
 *
 * @flow
 */

function foo(callback: (number, string) => void) {
	callback(10, 'a')
}

foo(function (n, str) {
	// n => number
	// str=> string
})

```

:::tip

传入foo中的函数的参数会被推断成number和string

:::

* 特殊类型

  * 自定义类型

  * 联合类型

  * 类型别名

  * maybe类型
```js
/**
 * 特殊类型
 *
 * @flow
 */
//变量的值只能是'foo’
const a: 'foo' = 'foo'

//联合类型，值只能是其中的几个

const t: 'foo' | 'bar' | 'far' = 'foo'

//类型别名

type StringOrNumber = string | number

let s: StringOrNumber = '10'

s = 10

// maybe类型

const m: ?number = undefined //null//10

// 上面的maybe类型等价于下面的联合类型

const m1: number | null | void = undefined
```


  * mixed和any类型

    * mixed和any都可以表示任意类型
    * mixed是类型安全的，而any不是
    * mixed中使用对应的类型前必须使用typeof去判断
    * any可以使用任意类型的方法而不会报错，只有在运行阶段才能发现错误，使用any主要是为了兼容老代码

```js
/**
 * mixed和any
 *
 * @flow
 */

function postMixed(val: mixed) {
	if (typeof val === 'string') {
		val.substr(1)
	}
	if (typeof val === 'number') {
		val * val
	}
}

function postAny(val: any) {
	val.substr(1)
	val * val
}

postMixed(100)
postMixed('foo')

postAny(100)
postAny('foo')

```

### flow类型文档

* [官方类型文档](https://flow.org/en/docs/types/)

* [第三方的类型文档](https://www.saltycrane.com/cheat-sheets/flow-type/latest/) 需要翻墙才能访问到

### 运行环境api

* js需要执行需要运行环境(browser/node)的支持,不同的环境提供了不同的api,api中的内置对象也是有类型的。

```js
/**
 * 内置对象类型
 * @flow
 *
 */

const element: HTMLElement | null = document.getElementById('app')

```

* 这些类型声明可以官网的中找到对应的类型文档
  * [js标准类型](https://github.com/facebook/flow/blob/master/lib/core.js)
  * [Js浏览器对象](https://github.com/facebook/flow/blob/master/lib/dom.js) 
  * [js中dom类型](https://github.com/facebook/flow/blob/master/lib/dom.js)
  * [node环境内置类型](https://github.com/facebook/flow/blob/master/lib/node.js)









​		

  

  





  

​    

​      

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    

​    


​    
​    
​    
​    
​    
​      
​    
​      
​    
​    	



​			



