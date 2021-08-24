## TypeScript

### 强类型和弱类型

TypeScript是为了解决JS类型系统的问题而产生的，由于JS是一门弱类型、动态类型的语言，所以在类型系统方面存在很大的弊端。由于设计之初是为了处理简单的表单验证问题，强类型反而使代码复杂；而JS是脚本语言，没有编译的过程，所以是动态类型的。

* 强类型和弱类型

  * 强类型语言有更严格的类型约束，而弱类型语言几乎没有类型约束
  * 强类型的语言不允许隐式类型转化，弱类型允许隐式类型转化
  * 弱类型语言代码中的类型错误是在运行阶段通过代码检测手动抛出的

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

* 静态语言和动态语言
	
	* 静态类型的语言中声明的变量类型不能再修改，而动态类型的语言中变量的类型是在运行阶段确定，变量的类型还可以随时修改。

```js
var foo = "abd"

foo =10

console.log(foo) //10

```

* 弱类型、动态语言的缺点
  * 一些错误在运行阶段才能捕获
  * 类型不确定，运行结果可能不符合预期

```js
const a = {}
a.foo() //TypeError: a.foo is not a function
function sum(a, b) {
	return a + b
}

sum(1, 2) //3

sum(1, '2') //'12'
```

* 强类型、静态语言的好处
  * 代码可以在编译阶段进行代码的静态类型检测，不用等到运行阶段才能发现错误
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

### TypeScript简介

* 为了解决javascript的中糟糕的类型系统，我们可以使用flow或者TypeScript
* TypeScript是JS的超集

![ts](/frontEnd/ts.jpg)

* TS在编译成JS的过程中会移除类型系统，将ES6代码转成低版本的JS代码

* TS是渐进式的，你可以在项目中以JS的方式写TS

* TS的缺点

  * 在JS的继承之上引入了新的概念，如接口、枚举等，增加了学习成本
  * 在小项目中使用会增加开发的成本

  

### TypeScript上手

* 创建项目和安装依赖

```shell
mkdir ts_demo & cd ts_demo
yarn init -y
yarn add typescript --dev
```

* 创建`01-ts-get-started.ts`文件并编写代码

```js
const sum = (a, b) => a + b
sum(1, 5)
```

* 上面的代码可以在TS文件中正常编译，为变量添加类型

```js
const sum = (a: number, b: number) => a + b
sum(1, 5)
```

* 编译TS到JS

```shell
yarn tsc ./01-ts-get-started.ts
```

* 编译后得到的JS文件

```js
var sum = function (a, b) { return a + b; };
sum(1, 5);
```

* 上面是编译一个文件，如果要编译整个项目，需要先添加一个tsc的配置文件

```shell
yarn tsc --init
```

* 生成的tsc配置文件如下:`tsconfig.json`

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

配置选项

```
target:指定编译后js的版本
module:指定编译后采用的模块类型
strict：指定是否启用严格类型模式，启用后使用类型的地方不能使用默认推断出来的any类型
outDir：指定输出文件的目录
rootDir：指定带编译的源代码的目录
sourceMap：指定是否生成源码映射文件
```

修改上面的编译选项

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "ES2015",
    /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",
    /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,
    /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "dist",
    /* Redirect output structure to the directory. */
    "rootDir": "src",
    /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,
    /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,
    /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,
    /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  }
}
```

将`01-ts-get-started.ts`移动到src目录下，重新编译

```shell
yarn tsc
```

:::tip

不需要指定编译的文件，会编译src目录下的文件

:::

会在dist目录下生成两个文件`01-ts-get-started.js`和`01-ts-get-started.js.map`,其中`01-ts-get-started.js`文件如下

```js

"use strict";
const sum = (a, b) => a + b;
sum(1, 5);
//# sourceMappingURL=01-ts-get-started.js.map
```

:::tip

编译后的问价中箭头函数没有被转译，是因为我们制定了`"target": "ES2015"`选项

:::

### ts的原始类型

* 当``tsconfig.json`中` "strict": true,`或者`"strictNullChecks": true, `打开时，undefined和null不能设置给其他类型

```js
const s: string = 'hello'

const b: boolean = false

const n: number = Infinity //10 //NaN

const v: void = undefined

const u: undefined = undefined

const nl: null = null
```

* 当关闭上面的选项时,undefined和null可以设置给其他类型

```js
const str: string = null //undefined

const v1: void = null //undefined

const u1: undefined = null
```

* 使用ES2015中的类型
  * 当target设置的是es5时会报错，这个时候的默认标准库文件是`lib.es5.d.ts`文件，不包含Symbol的声明
  * 当我们修改target为ES2015的时候，这个时候的默认标准库文件是`lib.es2015.d.ts`文件，包含Symbol的声明
  * 当我们即想编译到es版本，又想使用使用es2015的语法，我们可以设置配置：   `"lib": ["ES2015","DOM"]`, /* *Specify library files to be included in the compilation.* */,DOM中包含了BOM和DOM的类型声明
  * 高版本的TS好像没有上面的问题，可以自动引用标准库文件
  * 标准库就是内置类型对应的声明文件

```js
const sym: symbol = Symbol()
```

### 中文错误消息

* tsc在编译ts文件的时候，默认会根据开发工具的语言来提示错误信息。
* 当我们的编辑器默认语言为英文，但是我们想编译时提示中文消息，我们可以在编译选项后面添加`--locale`选项

```shell
yarn tsc --locale zh-CN
```

* 编辑器中显示的中文提示可以在vscode ->settings->typescript-locale->zh

### TS作用域问题

`a.ts`文件

```js
const s: string = 'hello'

```

`b.ts`文件

```js
const s: string = 'hello world'
```

这个时候报出错误：Cannot redeclare block-scoped variable 's'.原因他们没有导出，都属于全局作用域

* 方法一:使用自执行函数隔离作用域，修改`a.ts`

```js
;(function () {
	const s: string = 'hello'
})()
```

* 方法二:在文件中导出一个对象，这个时候文件会被作为一个模块对待

```js

const s: string = 'hello'

export = {}

```

### TS中的类型注解

* 对象类型

```js
/**
 *
 * 对象类型
 */

const o: object = [] //function () {} //{}

// 使用对象字面的方式限制对象的类型

const obj: { foo: string; bar: number } = { foo: 'hello', bar: 100 }

```

:::tip

对象类型可以是普通对象、数组、函数。还可以使用对象字面量和接口的方式设置对象的类型

:::

* 数组类型

```js
/**
 *
 * 数组类型
 *
 */

// 范型的方式

const arr: Array<string> = ['a', 'b']

// 第二种方式

const arr1: number[] = [1, 2, 3]

// 使用ts数组类型

function sumArr(...arr: number[]) {
	return arr.reduce((a, b) => a + b, 0)
}

console.log(sumArr(1, 2, 3))
```

* 元组类型

```js

/**
 * 元组类型：长度明确，每个位置元素的类型明确的数组
 *
 */

const tuple: [string, number] = ['foo', 12]

// 返回值是一个元组数组

const res: [string, number][] = Object.entries({ hello: 123 })

```

* 枚举类型

  * 使用枚举类型可以使代码可读性更高

  ```js
  /**
   *
   * 枚举类型
   *
   */
  // 使用对象
  // const postStatus = {
  // 	Draft: 0,
  // 	UnPublished: 1,
  // 	Published: 2
  // }
  
  // 使用TS中的枚举类型
  
  enum postStatus {
  	Draft = 0,
  	UnPublished = 1,
  	Published = 2
  }
  
  const post = {
  	title: 'foo',
  	content: 'foo...',
  	status: postStatus.Draft //0
  }
  postStatus[0]; // Draft
  ```

  * ts中的枚举类型是侵入式的，会在编译后的代码中出现

  ```js
  
  "use strict";
  /**
   *
   * 枚举类型
   *
   */
  // 使用对象
  // const postStatus = {
  // 	Draft: 0,
  // 	UnPublished: 1,
  // 	Published: 2
  // }
  // 使用TS中的枚举类型
  var postStatus;
  (function (postStatus) {
      postStatus[postStatus["Draft"] = 0] = "Draft";
      postStatus[postStatus["UnPublished"] = 1] = "UnPublished";
      postStatus[postStatus["Published"] = 2] = "Published";
  })(postStatus || (postStatus = {}));
  var post = {
      title: 'foo',
      content: 'foo...',
      status: postStatus.Draft //0
  };
  postStatus[0]; // Draft
  //# sourceMappingURL=07-ts-enum.js.map
  
  ```

  * 通过枚举的值获取枚举变量的名称，当确定不使用枚举变量时，可以使用常量枚举

  ```js
  
  /**
   *
   * 枚举类型
   *
   */
  // 使用对象
  // const postStatus = {
  // 	Draft: 0,
  // 	UnPublished: 1,
  // 	Published: 2
  // }
  
  // 使用TS中的枚举类型
  
  const enum postStatus {
  	Draft = 0,
  	UnPublished = 1,
  	Published = 2
  }
  
  const post = {
  	title: 'foo',
  	content: 'foo...',
  	status: postStatus.Draft //0
  }
  
  ```

  * 编译后

  ```js
  "use strict";
  /**
   *
   * 枚举类型
   *
   */
  // 使用对象
  // const postStatus = {
  // 	Draft: 0,
  // 	UnPublished: 1,
  // 	Published: 2
  // }
  var post = {
      title: 'foo',
      content: 'foo...',
      status: 0 /* Draft */ //0
  };
  //# sourceMappingURL=07-ts-enum.js.map
  
  ```

  * 当枚举类型的值是数字时可以自增，当枚举类型的值为字符串时不可以

  ```js
  enum statuses {
  	closed = 1,
  	opened //2
  }
  
  enum others {
  	others = 'other',
  	math = 'math'
  }
  
  statuses.closed
  
  others.math
  
  ```

  ```js
  var statuses;
  (function (statuses) {
      statuses[statuses["closed"] = 1] = "closed";
      statuses[statuses["opened"] = 2] = "opened"; //2
  })(statuses || (statuses = {}));
  var others;
  (function (others) {
      others["others"] = "other";
      others["math"] = "math";
  })(others || (others = {}));
  statuses.closed;
  others.math;
  ```

* 函数类型

  * 函数声明

  ```js
  /**
   *
   *  函数类型
   *
   */
  export = {}
  // 可选参数
  function Hello(a: number, b?: number): string {
  	return 'hello'
  }
  
  Hello(1)
  
  Hello(2)
  
  // 默认值参数
  function Hello1(a: number, b: number = 100): string {
  	return 'hello'
  }
  
  Hello1(1)
  
  Hello1(1, 100)
  
  // 剩余参数
  
  function Hello2(...arg: number[]): string {
  	return 'hello'
  }
  
  ```

  * 函数字面量

  ```js
  //  函数字面量
  // 可以类型推断出来变量f的类型
  const f = function (a: number): string {
  	return 'f'
  }
  //限定形参的类型
  function res(callback: (a: number) => string): string {
  	return callback(10)
  }
  
  ```


* any类型

```js
/***
 *
 *  使用any来接受任意类型值
 *
 */
export = {}

function stringfy(obj: any): string {
	//  JSON.stringify的第一个参数就是any类型的
	return JSON.stringify(obj)
}

stringfy('hello')

stringfy(100)

const obj: any = {}

// 语法上不会报错，所以any类型不是类型安全的
obj.hello()

```

:::warning

TS的any类型不是类型安全的。 

:::

*  隐式类型推断

```js
/**
 *
 *  类型推断
 *
 */

export = {}

let a = 'string' // let a:string="string"
//Type '100' is not assignable to type 'string'
// a = 100

let o // let o:any = undfined

o = 100

o = {}

// 不推荐使用any类型，不利于后期代码维护

```

* 类型断言
  * 类型断言：有时候TS无法去类型推到出变量的具体类型，而开发者可以明确知道变量的类型的，这个时候我们可以使用类型断言
  * 使用<>的方式断言在jsx中是不被允许的，会和标签`<a></a>`产生冲突

```ts

/**
 *
 *  类型断言：有时候TS无法去类型推到出变量的具体类型，而开发者可以明确知道变量的类型的，这个时候我们可以使用类型断言
 *
 */

export = {}

const arr = [1, -2, 10]
// 编辑器会推到成const res:number|undefined
const res = arr.find(item => item > 0)

// 我们根据数组知道肯定不会返回undefined

// Object is possibly 'undefined'.
// const sum = res + res

// 使用类型断言

const sum = (res as number) + (res as number)

// 另一种方式

const sum1 = <number>res + <number>res

```

* 接口

  * 用来约束对象的成员

    ```js
    
    /**
     *
     *  接口：用来约束对象的成员
     *
     */
    
    export = {}
    
    interface person {
    	name: string
    	age: number
    }
    
    function foo(o: person) {
    	console.log(o.name, o.age)
    }
    ```

  * 接口不会存在于编译后的代码中

  * 接口中中可以设置对象的属性可选和只读

  ```js
  interface Post {
  	title: string
  	content: string
  	subTitle?: string
  	readonly author: string
  }
  
  const p: Post = {
  	title: 'ts',
  	content: 'ts is ....',
  	subTitle: '',
  	author: 'yluhuakai'
  }
  // Cannot assign to 'author' because it is a read-only property.ts(2540)
  //p.author = ''
  ```

  * 动态成员

  ```js
  
  interface Caches {
  	[prop: string]: string
  }
  
  const cache: Caches = {
  	name: ''
  }
  ```

* class

  * ts中的类和JS的类语法大致相似，但是也有自己一些特有的地方
  * ts的类的成员在构造前必须声明，且声明或者构造函数中有一个地方要初始化

  ```js
  class Person {
  	name: string
  	age: number = 10
  	constructor(name: string, age: number) {
  		this.name = name
  		this.age = age
  	}
  }
  ```

  * 类的成员可以设置修饰符，public(默认的)、private(类内部访问)、protected(可以被子类继承，只能类和其子类中被访问)

  ```js
  export = {}
  
  class Person {
  	name: string
  	age: number = 10
  	protected gender: boolean
  	constructor(name: string, age: number) {
  		this.name = name
  		this.age = age
  		this.gender = true
  	}
  
  	public sayHi() {
  		console.log(`Hi!,${this.name}`)
  	}
  }
  
  class Student extends Person {
  	studentId: number
  	// 只能通过静态方法创建对象
  	private constructor(name: string, age: number, studentId: number) {
  		super(name, age)
  		this.studentId = studentId
  	}
  
  	public static create(name: string, age: number, studentId: number) {
  		return new this(name, age, studentId)
  	}
  
  	public getGender() {
  		// protected类型的，只能在类和子类中被访问
  		this.gender ? '男' : '女'
  	}
  }
  
  const s = Student.create('li', 26, 157806)
  
  s.sayHi()
  
  ```

  * 类的成员边两可以设置成只读的 ,当设置成只读的，那么只能被初始化一次

  ```js
  
  class Student extends Person {
  	public readonly studentId: number
  	// 只能通过静态方法创建对象
  	private constructor(name: string, age: number, studentId: number) {
  		super(name, age)
  		this.studentId = studentId
  	}
  
  	public static create(name: string, age: number, studentId: number) {
  		return new this(name, age, studentId)
  	}
  
  	public getGender() {
  		// protected类型的，只能在类和子类中被访问
  		this.gender ? '男' : '女'
  	}
  }
  
  ```

* 接口和类
  * 使用接口可以去约束类中需要实现的方法签名
  * 类去实现接口后必须去实现对应的方法
  * 相比较于通过从父类继承方法而言，接口只要求你有这个方法，而继承需要两个子类在方法在父类中有共性。

```js
/**
 *
 *  类和接口
 *
 */
export = {}
interface Runable {
	run(): void
}

interface Eetable {
	eat(food: string): void
}

class Person implements Runable, Eetable {
	public eat(food: string) {
		console.log(`Person eat ${food}`)
	}

	public run() {
		console.log(`Person run on foot`)
	}
}

class Dog implements Runable, Eetable {
	public eat(food: string) {
		console.log(`dog eat ${food}`)
	}

	public run() {
		console.log(`dog run on foot`)
	}
}

const d = new Dog()

d.eat('meat')
d.run()

```

* 抽象类
  * 抽象类和接口类似，可以约束子类中必须有某个成员
  * 抽象类本身不能被实例化
  * 抽象类中定义的方法可以设置修饰符

```js

export = {}
abstract class Animale {
	public abstract run(): void
}

class Dog extends Animale {
	public run() {
		console.log(`dog is runing on the road`)
	}
}

const d = new Dog()

d.run()

```

* 泛型

  * 所谓的泛型就是在定义函数、接口、方法的时候我们不去指定具体的类型，而是在调用的时候传入具体的类型

  * 使用泛型可以减少代码的冗余，增加代码的可复用性

  * 不使用泛型的代码

    ```js
    
    export = {}
    
    // 创建数字数组
    function createArrayNumber(length: number, value: number): number[] {
    	return Array<number>(length).fill(value)
    }
    
    // 创建字符串数组
    
    function createArrayString(length: number, value: string): string[] {
    	return Array<string>(length).fill(value)
    }
    
    const numArr = createArrayNumber(10, 12)
    
    const strArr = createArrayString(10, 'helo')
    
    const boolArr = createAnyArray<boolean>(10, false)
    
    ```

  * 使用泛型

    ```js
    // 创建任意类型的数组并填充
    
    function createAnyArray<T>(length: number, value: T): T[] {
    	return Array<T>(length).fill(value)
    }
    
    const numArr = createAnyArray(10, 12)
    
    const strArr = createAnyArray(10, 'helo')
    
    ```

  * 上面的Array就是TS中用泛型实现的函数，我们调用的时候再传入具体的值。

* 类型声明

  * TS之所以能对类型进行校验，是因为有类型声明文件
  * 当我们安装第三方的npm包时，有可能没有对应的类型声明文件，这时候使用ts就没有强类型的体验了 
  * 我们可以自己手动添加类型声明文件

  ```js
  /**
   *
   * 类型声明文件
   */
  
  export = {}
  
  import { cloneDeep } from 'lodash'
  
  //手动添加类型声明
  
  declare function cloneDeep(params: object): object
  
  // 类型被推断成any
  //warning 'obj' is declared but its value is never read.
  const obj = cloneDeep({})
  ```

  * 更好的方法是：点击上面lodash的警告，我们可以提示我们安装·npm install @types/lodash`.一般常用的第三方包都有了对应类型声明文件，我们可以直接去使用它，直接安装到开发依赖即可。
  * 甚至一些第三方包中已经存在这样的类型声明文件了。我们不需要手动安装，如query-string.
  * 关于ts的类型声明，我们可以去查看[文档](https://www.tslang.cn/docs/handbook/declaration-files/introduction.html)
  
* 函数的重载

  * 多个同名函数同时存在，具有不同的参数个数/类型
  * `TypeScipt`的函数重载是为同一个函数提供多个函数类型定义来进行函数重载。 编译器会根据这个列表去处理函数的调用
  * `TypeScipt`的重载有函数重载列表和函数的具体实现两部分组成
  * 在定义重载的时候，一定要把最精确的重载列表定义放在最前面

  ```js
  // 函数的重载
  function add(a:number,b :number) :number
  
  function add(a :number ,b :string) :string
  // 实现
  function add(a:number ,b:any):any{
      if(typeof b === 'number'){
          return a + b 
      }else if (typeof b === 'string'){
          return a + b
      }
  }
  console.log(add(1 , 2)) // 3
  
  console.log(add( 1 ,"s")) // "1s"
  ```

* 索引类型

  * 使用索引类型，编译器就能够检查使用了动态属性名的代码
  *  索引类型一般由**索引类型查询**和 **索引访问**操作符：

  ```js
  function pluck(o, names) {
      return names.map(n => o[n]);
  }
  ```

  * 使用索引类型来限定上面的函数

  ```tsx
  
  function pluck<T,K extends  keyof T>(o:T, names:K[]):T[K][] {
      return names.map(n => o[n]);
  }
  
  
  interface People {
      name:string,
      age:number
  }
  
  const  p:People = { name : "zzz", age:10 }
  
  
  console.log(pluck(p,['name','age'])) // [ 'zzz', 10 ]
  ```

  * `keyof`是**索引类型查询操作符**，上面的`keyof T `相当于联合类型`"name"|"age"`
  * 操作符是 `T[K]`， **索引访问操作符**,这次T[K]是K在T中对应属性的联合类型，这里相当于`string|number`

* 映射类型
  
  * `TypeScript`提供了从旧类型中创建新类型的一种方式 — **映射类型**
  * 最简单的映射类型
  
  ```js
  
  type keys = "name" | "age"
  
  // 定义映射类型
  // in类似for...in
  // flag类型实质上是 {name:boolean,string:boolean }
  type flags = { [ key in keys]:boolean}
  
  
  const s1:flags = { name:true,age:true}
  ```
  
  * `TypeScript`中预定义的有条件类型(只是部分)，我们可以基于他们创建新的类型
  
  ```tsx
  
  /**
   * Make all properties in T optional
   */
  type Partial<T> = {
      [P in keyof T]?: T[P];
  };
  
  /**
   * Make all properties in T required
   */
  type Required<T> = {
      [P in keyof T]-?: T[P];
  };
  
  /**
   * Make all properties in T readonly
   */
  type Readonly<T> = {
      readonly [P in keyof T]: T[P];
  };
  
  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };
  
  /**
   * Construct a type with a set of properties K of type T
   */
  type Record<K extends keyof any, T> = {
      [P in K]: T;
  };
  
  ```
  
  ```tsx
  interface Person {
      name: string;
      age: number;
  }
  
  const p1:Person = { name:"zz",age: 26 }
  
  // 基于商民的Person创建新的类型
  
  
  type PersonPartial = Partial<Person>;
  type ReadonlyPerson = Readonly<Person>;
  type RequiredPerson = Required<Person>
  
  const p2 : PersonPartial = { name: 'zz' }
  const p3:ReadonlyPerson = p1
  
  
  
  // Cannot assign to 'age' because it is a read-only property.ts(2540)
  p3.age ="zzz"
  
  const  p4: RequiredPerson = p1
  // 'p5' is declared but its value is never read.ts(6133)
  // Type 'Partial<Person>' is not assignable to type 'Required<Person>'.
  //   Types of property 'name' are incompatible.
  const p5:RequiredPerson =p2
  ```
  
  

### TS的polyfill(垫片)

* polyfill就是去添加浏览器不支持的特性

  * ```js
    if(typeof Object.is ==='undefined'){
      Object.is =function(){
        .....
      }
    }
    ```

* 使用tsc 命令去编译TS到JS,这个过程中会对新的语法做转化，但是不会对新的API做转化。
  * ```js
    // ts
    interface People {
    	name: string
    	age: number
    	gender: 'female' | 'male'
    }
    
    const p: People = { name: 'sss', age: 20, gender: 'female' }
    
    for (const [key, value] of Object.entries(p)) {
    	console.log(key, value)
    }
    
    export = {}
    ```
    
  * ```js
    "use strict";
    var p = { name: 'sss', age: 20, gender: 'female' };
    for (var _i = 0, _a = Object.entries(p); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log(key, value);
    }
    module.exports = {};
    
    ```

  * 我们看到const被换成了var,但是Object.entries()这个函数还是存在，再低版本的运行环境中肯定会出错。
  
* 首先Object.entries()是ES2018的新特性，TS的检查器会报错，我们可以`"lib": ["DOM", "ES2018"],`,其中添加DOM是为了让console.log()不报错。

* 使用lib可以让TS语法检查通过，但是并不能对新的API做转化,这个时候我们可以使用polyfile目前最流行的polyfill是core.js

  * 使用core.js首先需要安装，安装完成后再TS中导入即可

  * `core.js`会对能polyfill的api都做替换处理,并不是所有的浏览器`api`都可以做`polyfill`处理，Object.defineProperty就不可以通过polyfill实现。我们可以直接引入core.js,也可以只引入部分我们需要的特性

  * ```js
    npm i core.js
    ```

  * ```js
    //import 'core.js'
    import 'core.js/feature/Object'
    interface People {
    	name: string
    	age: number
    	gender: 'female' | 'male'
    }
    
    const p: People = { name: 'sss', age: 20, gender: 'female' }
    
    for (const [key, value] of Object.entries(p)) {
    	console.log(key, value)
    }
    
    export = {}
    ```

  * ```js
    "use strict";
    //import 'core.js'
    require("core.js/feature/Object");
    var p = { name: 'sss', age: 20, gender: 'female' };
    for (var _i = 0, _a = Object.entries(p); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log(key, value);
    }
    module.exports = {};
    ```

  * 使用polyfill我们仍可以看到Object.entries()，但是我们再执行前引入了polyfill，他会给Object.entries函数做定义，所以我们可以在低版本的运行环境中执行

  * 另一种方式就是我先用tsc将TS的语法转成js,然后让babel去给我们做语法转化，这个时需要将target设置成`esnext`,代表使用最新的ES特性。

  * 我们还可以直接使用`babel`去转化TS,这个时候不会对TS文件做检查。

    * 安装babel

    * ```shell
      npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-typescript
      npm install --save core-js.js
      ```

    * 在项目的根目录下创建一个命名为 `babel.config.js `的配置文件

    * ```js
      module.exports = {
      	presets: [
      		[
      			'@babel/env',
      			{
              //需要时采取polyfill
      				useBuiltIns: 'usage',
              // core-js的版本
      				corejs: {
      					version: 3
      				}
      			}
      		],
      		'@babel/typescript'
      	]
      }
      ```
      
    * ```shell
      npx babel index.ts -o  index.js 
      ```
  
  * 最终的输出结果：
  
    ```js
    "use strict";
    
    require("core-js/modules/es.array.is-array.js");
    
    require("core-js/modules/es.symbol.js");
    
    require("core-js/modules/es.symbol.description.js");
    
    require("core-js/modules/es.object.to-string.js");
    
    require("core-js/modules/es.symbol.iterator.js");
    
    require("core-js/modules/es.array.iterator.js");
    
    require("core-js/modules/es.string.iterator.js");
    
    require("core-js/modules/web.dom-collections.iterator.js");
    
    require("core-js/modules/es.array.slice.js");
    
    require("core-js/modules/es.function.name.js");
    
    require("core-js/modules/es.array.from.js");
    
    require("core-js/modules/es.object.entries.js");
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    var p = {
      name: 'sss',
      age: 20,
      gender: 'female'
    };
    
    for (var _i = 0, _Object$entries = Object.entries(p); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
    
      console.log(key, value);
    }
    ```
  
    

### [在vue项目中加入ts]（https://cn.vuejs.org/v2/guide/typescript.html）

我们先使用vue-cli创建一个vue项目：

```shell
vue create vue-ts-demo
```

* 选择手动添加特性
* 先不选择加入typescript

创建完成后在项目中加入typescript相关的插件：

```shell
vue add typescrip
```

:::tip

如果项目不是新建的项目，不要选择用Vue.extend替换的选项，这样子可能覆盖项目源文件中内容。

:::

执行上面的命令后项目中修改的源文件：

```shell
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   package.json
        modified:   src/components/HelloWorld.vue
        deleted:    src/main.js
        deleted:    src/router/index.js
        deleted:    src/store/index.js
        modified:   src/views/Home.vue
        modified:   yarn.lock

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/main.ts
        src/router/index.ts
        src/shims-tsx.d.ts
        src/shims-vue.d.ts
        src/store/index.ts
        tsconfig.json

```

基本上是将js文件替换成ts文件，此外，项目中加入了两个d.ts文件:

```
shims-tsx.d.ts
```

```js
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
```

```js
shims-vue.d.ts
```

```
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

```

以d.ts文件结尾的是ts的模块声明文件，这两个文件在这里我们只用到shims-vue.d.ts,因为我们的项目中没有jsx类型的文件。上面vue.d.ts的文件是告诉ts把.vue后缀的文件解析成Vue类型的。如果没有这个文件，TS无法确定App文件的类型。

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

当我们使用ts的时候引入第三方的js模块，为了让ts可以获取js模块中方法属性的类型，也需要编写对应的模块声明文件，常用的js库可能已经存在模块声明文件，我们只需要安装即可。关系模块声明，更多可参考[声明文件](https://www.tslang.cn/docs/handbook/declaration-files/introduction.html).

如果提示找不到`vue-property-decorator`模块，手动安装即可。

接下来我们手动创建一个vue组件`Button.vue`

```vue
<!--  -->
<template>
	<div>
		<button>{{ message }}</button>
	</div>
</template>

<script lang="ts">
export default {
	name: "Button",
	data() {
		return {
			message: "foo"
		};
	},
	created() {
		this.message = "123";
	}
};
</script>
<style lang="scss" scoped></style>
```

* `script`标签的`lang="ts"`
* 我们在使用编辑给出提示:this.message,是因为我们使用了Vetur插件，他的下面又个选项：Validation:Script，关闭后则不会有提示。
* 重新运行会发现发现项目中报错

```shell
ERROR in /Users/lijunjie/js-code/vue-ts-demo/src/components/Button.vue(17,8):
17:8 Property 'message' does not exist on type '{ name: string; data(): { message: string; }; created(): void; }'.
    15 |        },
    16 |        created() {
  > 17 |                this.message = "123";
       |                     ^
    18 |        }
    19 | };
    20 | </script>
```

这块找不到message属性的原因是因我们我们导出的是一个普通的对象，ts无法去推断这个对象的属性有哪些。为了更好的ts使用另一种方式去创建组件。

```vue
<!--  -->
<template>
	<div>
		<button>{{ message }}</button>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
export default  Vue.extend( {
	name: "Button",
	data() {
		return {
			message: "foo"
		};
	},
	created() {
        this.message = "123";
        this.
	}
});
</script>
<style lang="scss" scoped></style>

```

上面使用Vue.extend的方式创建的对象可以根据函数签名去推断导出的对象的类型，所以Vue项目使用TS必须使用Vue.extend的方式：

```js
extend<Data, Methods, Computed, PropNames extends string = never>(options?: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>): ExtendedVue<V, Data, Methods, Computed, Record<PropNames, any>>;
  extend<Data, Methods, Computed, Props>(options?: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>): ExtendedVue<V, Data, Methods, Computed, Props>;
  extend<PropNames extends string = never>(definition: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>): ExtendedVue<V, {}, {}, {}, Record<PropNames, any>>;
  extend<Props>(definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>): ExtendedVue<V, {}, {}, {}, Props>;
  extend(options?: ComponentOptions<V>): ExtendedVue<V, {}, {}, {}, {}>;
```

#### [标注 Prop](https://cn.vuejs.org/v2/guide/typescript.html#标注-Prop)

```js
<!--  -->
<template>
	<div>
		<button>{{ message }}</button>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export default Vue.extend({
	name: "Button",
	props: {
		// 类型断言
		size: String as PropType<"small" | "middle" | "big">
	},
	data() {
		return {
			message: "foo"
		};
	},
	created() {
		this.message = "123";
		this.size === "small";
	}
});
</script>
<style lang="scss" scoped></style>
```

* 想要获得类型提示，只能在vscode中打开这个一个项目(根目录是vue-ts-demo)

### 再已有的JS项目中加入类型验https://cloud.tencent.com/developer/article/1006180

直接将js项目改成TS项目需要的成本还是很高，又没有更简单的方式呢？

* JsDoc为TS添加类型校验

```js
// @ts-check
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 *
 *
 * @type { import ("vue-router").RouteConfig[] }
 *
 *
 *
 */
const routes = [
	{
		path: '/',
		redirect: '/dashboard'
	},
	{
		path: '/login',
		component: () => import('@/views/login/Login.vue')
	},
	{
		path: '/dashboard',
		component: () => import('@/views/layout/Layout.vue'),
		children: [
			{
				path: '',
				component: () => import('@/views/Employee/Index.vue')
			},
			{
				path: '/departments',
				component: () => import('@/views/Department/Index.vue')
			},
			{
				path: '/sprite',
				component: () => import('@/views/sprite/Index.vue')
			},
			{
				path: '/echart',
				component: () => import('@/views/echart/Echart.vue')
			},
			{
				path: '/jobs',
				component: () => import('@/views/Jobs/Index.vue')
			}
		]
	}
]
```

```js
//@ts-check
/**
 * @type { import("@vue/cli-service").ProjectOptions}
 *
 */
// vue.config.js
module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
	//	publicPath 会有提示
}

```



* @type为变量设置类型,注意不要直接导出，有可能不会生效。
* @ts-check是开启TS类型校验的注解
* 上面的`import('@/views/sprite/Index.vue')`不能被Ts识别，可以添加一个模块声明文件：`shims-vue.d.ts`

在Vue文件中挂载在Vue原型上的方法可能会没有提示，我们可以添加一个类型声明文件`types.d.ts`,把我们挂载在原型上的方法和属性加入进去，就可以获取提示效果(可能需要重启下编辑器)。

```js
import { AxiosInstance } from 'axios'
import VueI18n from 'vue-i18n'

declare module 'vue/types/vue' {
	interface Vue {
		$title: string
		$axios: AxiosInstance
		$t: VueI18n.PostTranslationHandler
	}
}

```



·









  

​    



