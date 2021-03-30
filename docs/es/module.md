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

* *export* var foo = 'baz'ES Module导入、导出的注意事项

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

  * 不能省略模块的后缀名，当文娱index.js中，也不能省略index,Common.js可以，在webpack中也可以。

    ```js
    //import { foo } from './util'
    import { foo } from './util/index.js'
    ```

  * 导出的路径可以是相对路径，也可以是绝对路径

    ```js
    import { foo } from './util/index.js'
    import { foo } from '/util/index.js'
    ```

  * 如何不想导出任何变量，只想加载模块，可以像下面这样

    ```js
    import {} from './util/index.js'
    import './util/index.js'
    ```

  * 如果想动态导入模块(模块名字是一个变量或者根据条件导入)，可以使用import()，它返回的是一个Promise.

    ```js
    import('./util/index.js').then(module => {
    	console.log(module.foo) //
    })
    ```

  * 导出多个对象时可以使用将要导出的变量放到一个对象中去

    ```js
    import * as moduleA from './moduleA.js'
    console.log(moduleA.name, moduleA.default) //hello 12
    
    ```

  * 对与默认的导出，我们可以使用下面的方式

    ```js
    import { name, sayHello, default as Person } from './moduleA.js'
    import Person ,{ name, sayHello} from './moduleA.js'
    ```

  * 对导入的模块做导出处理(默认导出要做重命名处理)

    ```js
    import { name, SayHello, default as Person } from './moduleA.js'
    export { name, SayHello, Person }
    
    // 或者
    
    export { name, SayHello, default as Person } from './moduleA.js'
    
    ```

  ### ES Module 浏览器环境的polyfill

  ES Module如果要工作在不支持ES Module的浏览器中，需要我们使用polufill去对处理这种兼容性的问题。

  ```html
  
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>ES Module 浏览器环境 Polyfill</title>
  </head>
  
  <body>
      <script nomodule src="https://unpkg.com/promise-polyfill@8.1.3/dist/polyfill.min.js"></script>
      <script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
      <script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
      <script type="module">
          import { foo } from './module.js'
     			 console.log(foo)
    </script>
  </body>
  
  </html>
  ```

  ```js
  // module.js
  export var foo = 'baz'
  ```

  * 引入`browser-es-module-loader.js`是为了提供在不支持ES Module的浏览器下也可以正常工作。
  * `babel-browser-build.js`是为了处理模块加载完成后对ES6语法的转换
  * `promise-polyfill`是为了解决Promise这个api在浏览器中不存在的问题
  * 当代码运行在支持ES Module的浏览器，模块的代码会被执行两次，为了解决这个问题，需要在这些polyfill上加入`nomodule`属性，这样当浏览器不支持ES Module属性时上面的polufill才会工作。
  * 上面的情况只适用于开发阶段，在生成环境中使用这种方式，需要先去提取模块代码，然后对代码转换，最后再去执行，效率会比较低，应该使用可以直接在浏览器执行的代码。

  ### Node环境中使用ES_Module

  * 导出的模块

    ```js
    export const name = 'hello'
    
    export const age = 12
    ```

  * 导入的模块

    ```js
    import { name, age } from './moduleA.mjs'
    
    console.log(name, age)
    ```

  * 在node环境中使用，需要注意两件事

    * 文件的后缀名必须是`*.mjs`
    * node的执行命令中需要加入选项`--experimental-modules`:`node --experimental-modules index.mjs `

  *  默认导出内置模块和`lodash`模块

    ```js
    import _ from 'lodash'
    import fs from 'fs'
    
    
    console.log(_.map([1, 2, 3], item => item + 1)) //[ 2, 3, 4 ]
    fs.writeFileSync('./foo.txt', 'esm is working')
    ```

    可以使用是因为第三方库和内置模块做了默认导出处理

  * 导出模块中非默认导出

    ```js
    import { map } from 'lodash'
    console.log(map([1, 2, 3], item => item + 1)) // Error
    
    ```

    ```js
    import { writeFileSync } from 'fs'
    
    
    writeFileSync('./foo.txt', 'esm is working') // ok
    ```

    内置模块对非默认导出也做了处理。

  ### ES Module和CommonJS模块的交互

  * ES Module模块加载CommonJS模块

    * ES Module可以加载CommonJS模块
    * CommonJS的导出成员会作为ES Module的默认导出
    * 不能直接导出模块中的成员

    ```js
    //  common.js
    
    
    
    // module.exports = {
    // 	foo: 'hello'
    // }
    
    exports.foo = 'hello'
    
    ```

    ```js
    // esm.mjs
    
    import common from './common.js'
    
    console.log(common) //{ foo: 'hello' }
    ```

    执行运行命令：

    ```shell
    node --experimental-modules esm.mjs 
    (node:3312) ExperimentalWarning: The ESM module loader is experimental.
    { foo: 'hello' }
    ```

  * CommonJS导入ES Module模块

    * 不能在CommonJS模块中使用require加载ES Module模块，但是可以使用import函数。
    * import函数导入成功返回一个Promise,可以获取到ES Module模块导出的所有命名成员。

    ```js
    // common.js
    
    import('./esm.mjs').then(module => {
    	console.log(module) //[Module] { default: 20, name: 'foo' }
    })
    
    ```

    ```js
    // esm.mjs 
    export const name = 'foo'
    
    const age = 20
    export default age
    ```

  ### Node中使用ES Module和CommonJS的差异

  * Node中CommonJS模块拥有一些全局变量(模块中可以直接访问的)

  ```js
  // common.js
  console.log(require)
  
  console.log(module)
  
  console.log(exports)
  
  console.log(__dirname)///Users/lijunjie/js-code/module-scheme/es_module_difference
  
  console.log(__filename)// Users/lijunjie/js-code/module-scheme/es_module_difference/common.js
  
  ```

  * Node使用ES Module模块如何获取这些模块内的全局变量呢 

    * `require`可以使用`import`代替，`module`和`exports`可以替换为`export`.
    * `__dirname`和__`__filename`可以使用下面的方式获取

    ```js
    //esm.mjs
    import { fileURLToPath } from 'url'
    import { dirname } from 'path'
    //__filepath
    
    const filepath = fileURLToPath(import.meta.url)
    console.log(filepath) ///Users/lijunjie/js-code/module-scheme/es_module_difference/esm.mjs
    
    //__dirname
    
    console.log(dirname(filepath)) ///Users/lijunjie/js-code/module-scheme/es_module_difference
    ```

  ### Node新版本中对ES Module的支持

  * 在package.json中`"type":"module"`可以让Node将文件夹下的所有*.js当作es module模块来解析
  * 这个时候如果需要使用CommonJS模块，需要将模块的后缀改成`*.cjs`

  ```js
  // module.js
  
  const name = 'foo'
  export default name
  
  ```

  ```js
  // esm.js
  import name from './module.js'
  import foo from './common.cjs'
  console.log(name) //foo
  
  console.log(foo) //{ foo: 'baz' }
  ```

  ```js
  // common.cjs
  module.exports = {
  	foo: 'baz'
  }
  ```

  还是需要添加选项去执行：`$ node --experimental-modules esm.js`

  ### 早期Node(使用的8.0.0)中使用ES Module

  早期的Node并不支持ES Module,但是我们可以使用babel来对处理这种不兼容的问题。

  ```js
  // common.js
  const name = 'foo'
  
  export default name
  
  ```

  ```js
  // esm.js
  import name from './common.js'
  
  console.log(name)
  ```

  安装babel的依赖

  ```shell
  npm install @babel/node @babel/core @babel/preset-env -D
  ```

  使用babel-node来执行模块文件

  ```shell
  npx babel-node esm.js 
  
  /Users/lijunjie/js-code/module-scheme/es_module_babel/esm.js:1
  (function (exports, require, module, __filename, __dirname) { import name from './common.js';
                                                                ^^^^^^
  
  SyntaxError: Unexpected token import
  ```

  需要制定我们需要的插件：

  ```shell
  $ npx babel-node esm.js --presets @babel/preset-env
  foo
  ```

  每次执行都要设置`--presets`,我们可以将设置放入项目的根目录下

  ```js
  //.babelrc
  
  {
      "presets": ["@babel/preset-env"]
  }
  ```

  然后将在scripts中加入如下的命令,我们就可以使用`npm run build`	去执行代码了

  ```js
  
  "scripts":{
     "build":"babel-node esm.js"
  }
  ```

  ### Babel的基本工作原理

  ![babel-work](/frontEnd/babel-work.png)

  presets是插件的集合，想我们常用的@babel-preset-env就是常用的插件的集合

  ![babel-presets](/frontEnd/babel-preset.png)

  上面我们可以安装一个只包含模块转换的插件：

  ```shell
  npm install @babel/plugin-transform-modules-commonjs -D
  ```

  ```js
  // .babelrc
  {
  	// "presets": ["@babel/plugin-transform-modules-commonjs"]
  	"plugins": ["@babel/plugin-transform-modules-commonjs"]
  }
  ```

  

  

  


​    






