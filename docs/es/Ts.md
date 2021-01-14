## TypeScript

### 强类型和弱类型

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

### TypeScript简介

* 为了解决javascript的中糟糕的类型系统，我们可以可以使用flow或者TypeScript
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
* 当我们的编辑器默认语言为英文，但是我们想编译时提示中文消息，我们可以在编译选项后面添加`--local`选项

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

  * 使用枚举类型可以是代码可读性更高

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

  * 如果在可以通过枚举的值获取枚举变量的名称，当确定不使用枚举变量时，可以使用常量枚举

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

  







​	





