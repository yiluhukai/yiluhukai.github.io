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









​	





