### 模块化的发展历程

* stage1-文件划分的方式

* 具体做法就是将每个功能及其相关状态数据各自单独放到不同的文件中

* 约定每个文件就是一个独立的模块， 使用某个模块就是将这个模块引入到页面中，然后直接调用模块中的成员（变量 / 函数）

* 缺点十分明显：

* 所有模块都直接在全局工作，

* 没有私有空间，所有成员都可以在模块外部被访问或者修改， 而且模块一段多了过后，容易产生命名冲突

* 另外无法管理模块与模块之间的依赖关系

```html

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta http-equiv="X-UA-Compatible" content="ie=edge">

<title>Modular evolution stage 1</title>

</head>

<body>

<h1>模块化演变（第一阶段）</h1>

<h2>基于文件的划分模块的方式</h2>

<script src="module-a.js"></script>

<script src="module-b.js"></script>

<script>

    // 命名冲突

    method1()

    // 模块成员可以被修改

    name = 'foo'

</script>

</body>

</html>

```

```js

// module a 相关状态数据和功能函数

var name = 'module-a'

function method1 () {

	console.log(name + '#method1')

}

function method2 () {

	console.log(name + '#method2')

}

```

```js

// module b 相关状态数据和功能函数

var name = 'module-b'

function method1 () {

	console.log(name + '#method1')

}

function method2 () {

	console.log(name + '#method2')

}

```

* stage2-命名空间

* 每个模块只暴露一个全局对象，所有模块成员都挂载到这个对象中

* 具体做法就是在第一阶段的基础上，通过将每个模块「包裹」为一个全局对象的形式实现，

* 有点类似于为模块内的成员添加了「命名空间」的感觉。

* 通过「命名空间」减小了命名冲突的可能，

* 但是同样没有私有空间，所有模块成员也可以在模块外部被访问或者修改，

* 而且也无法管理模块之间的依赖关系。

```html

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta http-equiv="X-UA-Compatible" content="ie=edge">

<title>Modular evolution stage 2</title>

</head>

<body>

<h1>模块化演变（第二阶段）</h1>

<h2>每个模块只暴露一个全局对象，所有模块成员都挂载到这个对象中</h2>

<script src="module-a.js"></script>

<script src="module-b.js"></script>

<script>

moduleA.method1()

moduleB.method1()

// 模块成员可以被修改

moduleA.name = 'foo'

</script>

</body>

</html>

```

```js

// module a 相关状态数据和功能函数

var moduleA = {

  name: 'module-a',

  method1: function () {

    console.log(this.name + '#method1')

  },

  method2: function () {

    console.log(this.name + '#method2')

  }

}

```

```js

// module b 相关状态数据和功能函数

var moduleB = {

  name: 'module-b',

  method1: function () {

   console.log(this.name + '#method1')

  },

  method2: function () {

   console.log(this.name + '#method2')

  }

}

```

* stage3-立即执行函数表达式提供私有空间

* 具体做法就是将每个模块成员都放在一个函数提供的私有作用域中，对于需要暴露给外部的成员，通过挂在到全局对象上的方式实现

* 依赖的外部模块可以在自执行函数的参数中传入

* 有了私有成员的概念，私有成员只能在模块成员内通过闭包的形式访问。

```html

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta http-equiv="X-UA-Compatible" content="ie=edge">

<title>Modular evolution stage 3</title>

</head>

<body>

<h1>模块化演变（第三阶段）</h1>

<h2>使用立即执行函数表达式（IIFE：Immediately-Invoked Function Expression）为模块提供私有空间</h2>

<script src="module-a.js"></script>

<script src="module-b.js"></script>

<script>

moduleA.method1()

moduleB.method1()

// 模块私有成员无法访问

console.log(moduleA.name) // => undefined

</script>

</body>

</html>

```

```js

// module a 相关状态数据和功能函数

;(function () {

  var name = 'module-a'

  function method1 () {

    console.log(name + '#method1')

  }

  function method2 () {

    console.log(name + '#method2')

  }

  window.moduleA = {

      method1: method1,

      method2: method2

  }

})()

```

```js

// module b 相关状态数据和功能函数

;(function ($) {

    var name = 'module-b'

    function method1 () {

    Console.log($)

    console.log(name + '#method1')

}

function method2 () {

		console.log(name + '#method2')

}

window.moduleB = {

    method1: method1,

    method2: method2

}

})(Jquery)

```

### 模块化标准和模块加载器

上面的几种方案都不完美，不同的开发者也可能采用不同的模块化规范，对模块的引入也只能通过`script`标签手动的引入，所以需要一个模块化的标准和模块加载器。

常用的模块化标准

* CommonJS

  * 一个文件就是一个模块
  * 每个模块都有自己单独的作用域
  * 通过module.exports导出成员
  * 通过require函数加载模块
  * CommonJS是同步执行的，所以不是和与浏览器端

* require.js+ AMD
  * 	使用起来需要和require.js搭配使用
  * 	使用起来比较复杂
  * 	当依赖的文件比较多是，会请求频繁
  * 	兼容sea.js+CMD规范
  * 	AMD的加载是异步完成的，更适合浏览器端
  * 	AMD是社区提出的规范，现在逐步被ES module取代

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Modular evolution stage 5</title>
</head>
<body>
  <h1>模块化规范的出现</h1>
  <h2>Require.js 提供了 AMD 模块化规范，以及一个自动化模块加载器</h2>
  <script src="lib/require.js" data-main="main"></script>
</body>
</html>
```

```js
// main.js

require.config({
  paths: {
    // 因为 jQuery 中定义的是一个名为 jquery 的 AMD 模块
    // 所以使用时必须通过 'jquery' 这个名称获取这个模块
    // 但是 jQuery.js 并不一定在同级目录下，所以需要指定路径
    jquery: './lib/jquery'
  }
})

require(['./modules/module1'], function (module1) {
  module1.start()
})

```

```js

// 因为 jQuery 中定义的是一个名为 jquery 的 AMD 模块
// 所以使用时必须通过 'jquery' 这个名称获取这个模块
// 但是 jQuery.js 并不在同级目录下，所以需要指定路径
define('module1', ['jquery', './module2'], function ($, module2) {
  return {
    start: function () {
      $('body').animate({ margin: '200px' })
      module2()
    }
  }
})

```

```js
// module2
// 兼容 CMD 规范（类似 CommonJS 规范）
define(function (require, exports, module) {
	// 通过 require 引入依赖
  var $ = require('jquery')
  // 通过 exports 或者 module.exports 对外暴露成员
  module.exports = function () {
    console.log('module 2~')
    $('body').append('<p>module2</p>')
  }
})
```

jquery和require.js位于lib目录下。

* ES Module
  * 使用type="module"的形式开启ES module
  * ES module 默认启用严格模式
  * *每个模块是一个独立的作用域* 
  * 需要在http server的情况下执行，且通过CORS去请求外部脚本的
  * ES Module 会延迟执行脚本，相当于defer

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <!-- 使用type="module"的形式开启ES module -->
    <script type="module">
        const foo = 123
    </script>
    <!-- ES module 默认启用严格模式 -->
    <script type="module">

        console.log(this)
    </script>

    <!-- 每个模块是一个独立的作用域 -->

    <script type="module">
        console.log(foo) //(index):24 Uncaught ReferenceError: foo is not defined
    </script>

    <!-- 需要在http server的情况下执行，且通过CORS去请求外部脚本的  -->

    <script src="https://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js" type="module">
        //Access to script at 'https://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js' from origin
    // 'http://localhost:5000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    </script>

    <!-- ES Module 会延迟执行脚本，相当于defer -->

    <script src="module1.js" type="module"></script>
    <p> alert 不会阻塞加载</p>
</body>

</html>
```

```js
// module1.js
alert('hello world')
```

* ES Module的导入导出

  * 声明式导出

  ```js
  export var name = 'hello'
  
  export function SayHello() {}
  
  export class Person {}
  
  ```

  ```js
  import { name, SayHello, Person } from './moduleA.js'
  console.log(name)
  ```

  * 先声明后导出

  ```js
  var name = 'hello'
  
  function SayHello() {}
  
  class Person {}
  
  export { name, SayHello as sayHello, Person as default }
  
  ```

  ```js
  import { name, sayHello, default as Person } from './moduleA.js'
  console.log(name)
  
  console.log(typeof Person)
  
  ```

  * 默认导出

  ```js
  var name = 'hello'
    
  export default name
  ```

  ```js
  import Name from './moduleA.js'
    
  console.log(Name)
  ```

* ES Module导出的注意事项

  * 导出的`{}`不是对象的缩写形式，导出的时候也不是对象的解构

    ```js
    export { name, SayHello as sayHello, Person as default }
    import { name, SayHello, Person } from './moduleA.js'
    ```

  * `export default`导出的是值类型 ，而export { ... }导出的时候都是导出的引用

    ```js
    var name = 'hello'
    
    var age = 12
    
    export { name }
    
    export default age
    setTimeout(() => {
    	name = 'baz'
    	age = 15
    }, 1000)
    
    ```

    ```js
    import age, { name } from './moduleA.js'
    
    console.log(name, age) //hello 12
    
    setTimeout(() => {
    	console.log(name, age) //baz 12
    }, 5000)
    
    ```

  * 导出的模块的变量不能在导入模块中修改

    ```js
  name = '100' //app.js:9 Uncaught TypeError: Assignment to constant variable.
    ```

  

  

​    






