

#### rollup

`rollup` 是一个 `ES Module`模块打包器，可以将小块代码编译成大块复杂的代码，`rollup`设计的初衷并不是为了和`webpack`竞争，而是为了以将小块代码编译成大块复杂的代码，例如 library 或应用程序

#### rollup的使用

项目的结构：

```shell
├── package.json
├── src
│   ├── index.js
│   ├── logger.js
│   └── messages.js
└── yarn.lock
```

`index.js`:

```js
// 导入模块成员
import { log } from './logger'
import messages from './messages'

// 使用模块成员
const msg = messages.hi

log(msg)
```

`logger.js`:

```js
export const log = msg => {
  console.log('---------- INFO ----------')
  console.log(msg)
  console.log('--------------------------')
}

export const error = msg => {
  console.error('---------- ERROR ----------')
  console.error(msg)
  console.error('---------------------------')
}
```

`messages.js`:

```js
export default {
  hi: 'Hey Guys, I am zce~'
}
```

安装`rollup`作为开发依赖：

```shell
yarn install rollup --dev
```

查看`rollup`的使用说明：

```shell
$ yarn rollup 
yarn run v1.22.10
warning ../../package.json: No license field
$ /Users/lijunjie/js-code/rollup-demo/01-getting-started/node_modules/.bin/rollup

rollup version 1.32.1
=====================================

Usage: rollup [options] <entry file>

Basic options:

-c, --config <filename>     Use this config file (if argument is used but value
                              is unspecified, defaults to rollup.config.js)
-d, --dir <dirname>         Directory for chunks (if absent, prints to stdout)
-e, --external <ids>        Comma-separate list of module IDs to exclude
-f, --format <format>       Type of output (amd, cjs, esm, iife, umd)
-g, --globals <pairs>       Comma-separate list of `moduleID:Global` pairs
-h, --help                  Show this help message
-i, --input <filename>      Input (alternative to <entry file>)
-m, --sourcemap             Generate sourcemap (`-m inline` for inline map)
-n, --name <name>           Name for UMD export
-o, --file <output>         Single output file (if absent, prints to stdout)
-p, --plugin <plugin>       Use the plugin specified (may be repeated)
-v, --version               Show version number
-w, --watch                 Watch files in bundle and rebuild on changes
--amd.id <id>               ID for AMD module (default is anonymous)
--amd.define <name>         Function to use in place of `define`
--assetFileNames <pattern>  Name pattern for emitted assets
--banner <text>             Code to insert at top of bundle (outside wrapper)
--chunkFileNames <pattern>  Name pattern for emitted secondary chunks
--compact                   Minify wrapper code
--context <variable>        Specify top-level `this` value
--dynamicImportFunction <name>         Rename the dynamic `import()` function
--entryFileNames <pattern>  Name pattern for emitted entry chunks
--environment <values>      Settings passed to config file (see example)
--no-esModule               Do not add __esModule property
--exports <mode>            Specify export mode (auto, default, named, none)
--extend                    Extend global variable defined by --name
--no-externalLiveBindings   Do not generate code to support live bindings
--footer <text>             Code to insert at end of bundle (outside wrapper)
--no-freeze                 Do not freeze namespace objects
--no-hoistTransitiveImports Do not hoist transitive imports into entry chunks
--no-indent                 Don't indent result
--no-interop                Do not include interop block
--inlineDynamicImports      Create single bundle when using dynamic imports
--intro <text>              Code to insert at top of bundle (inside wrapper)
--namespaceToStringTag      Create proper `.toString` methods for namespaces
--noConflict                Generate a noConflict method for UMD globals
--no-strict                 Don't emit `"use strict";` in the generated modules
--outro <text>              Code to insert at end of bundle (inside wrapper)
--preferConst               Use `const` instead of `var` for exports
--preserveModules           Preserve module structure
--preserveSymlinks          Do not follow symlinks when resolving files
--shimMissingExports        Create shim variables for missing exports
--silent                    Don't print warnings
--sourcemapExcludeSources   Do not include source code in source maps
--sourcemapFile <file>      Specify bundle position for source maps
--no-stdin                  do not read "-" from stdin
--strictDeprecations        Throw errors for deprecated features
--no-treeshake              Disable tree-shaking optimisations
--no-treeshake.annotations  Ignore pure call annotations
--no-treeshake.propertyReadSideEffects Ignore property access side-effects
--treeshake.pureExternalModules        Assume side-effect free externals
```

所以我们可以这么使用：

```shell
cd 01-getting-started
yarn rollup -f iife ./src/index.js
yarn run v1.22.10
warning ../../package.json: No license field
$ /Users/lijunjie/js-code/rollup-demo/01-getting-started/node_modules/.bin/rollup -f iife ./src/index.js

./src/index.js → stdout...
(function () {
  'use strict';

  const log = msg => {
    console.log('---------- INFO ----------');
    console.log(msg);
    console.log('--------------------------');
  };

  var messages = {
    hi: 'Hey Guys, I am zce~'
  };

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi;

  log(msg);

}());
created stdout in 34ms
✨  Done in 0.38s.
```

上面的`iife`指的是打包结果以立即执行函数形式输出，还可以指定其他的类型：` Type of output (amd, cjs, esm, iife, umd)`,打包的结果默认在控制台输出。可以看到结果在立即执行函数中包裹，并自动删除了没有使用的代码，这是因为`rollup`回默认启动`tree-shaking`功能。

#### `rollup`配置文件

我们可以像使用`webpack`一样为`rollup`提供一个配置文件，`rollup`的配置文件可以采用`CommonJS`规范(`node环境的首选`)，也可以使用`ES Module`规范。

```js
// rollup.config.js

// @ts-check
/**
 *
 * @type {import("rollup").RollupOptions}
 */
module.exports = {
	input: './src/index.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife'
	}
}
```

`rollup`使用配置文件时需要指定：

```shell
yarn rollup --config rollup.config.js ./src/index.js
```

#### rollup的插件

`rollup`本身只是一个`ES Module`模块的合并工具，如果需要处理其他类型的文件、加载`CommonJS`模块、完成`JS`语法的转换等工作，都需要配合`rollup`的插件来完成。插件机制是`rollup`扩展功能的唯一途径。

1.使用`rollup-plugin-json`加载`json`文件：

首先安装依赖：

```shell
yarn add rollup-plugin-json --dev
```

`rollup.config.js`:

```js
import json from 'rollup-plugin-json'
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json()
  ]
}
```

`index.js`中使用：

```js
// 导入模块成员
import { log } from './logger'
import messages from './messages'
import { name, version } from '../package.json'

// 使用模块成员
const msg = messages.hi

log(msg)

log(name)
log(version)

```

执行打包命令：

```shell
yarn rollup -c rollup.config.js ./src/index.js 
```

2. 使用`rollup-plugin-node-resolve`加载三方的模块

`rollup`使用使用模块时只能通过完整的路径去加载，并不能像`webpack`中直接使用模块的名称去加载，锁了抹平这个差异，我们需要使用这个插件：

```shell
yarn add rollup-plugin-node-resolve --dev
```

配置文件：

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve()
  ]
}
```

`index.js`文件：

```js
// 导入模块成员
import _ from 'lodash-es'
import { log } from './logger'
import messages from './messages'
import { name, version } from '../package.json'

// 使用模块成员
const msg = messages.hi

log(msg)

log(name)
log(version)
log(_.camelCase('hello world'))
```

执行构建命令：

```shell
yarn rollup -c rollup.config.js ./src/index.js 
```

3. 使用`rollup-plugin-commonjs`插件加载`CommonJS`模块

上面我们没有使用`lodash`模块而是`lodash-es`模块是因为`rollup`默认只支持加载`ES Module`模块。

```shell
yarn add rollup-plugin-commonjs --dev
```

修改配置文件：

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}
```

`index.js`:

```js
// 导入模块成员
import _ from 'lodash-es'
import { log } from './logger'
import messages from './messages'
import { name, version } from '../package.json'
import cjs from './cjs-module'

// 使用模块成员
const msg = messages.hi

log(msg)

log(name)
log(version)
log(_.camelCase('hello world'))
log(cjs)

```

`cjs-module`.js:

```js
module.exports = {
  foo: 'bar'
}

```

执行构建命令：

```shell
yarn rollup -c rollup.config.js ./src/index.js 
```

#### `rollup`代码拆分（code splitting）

`rollup`可以像`webpack`一样以动态导入的方式引入模块，从而达到对代码拆分的目的：

`index.js`文件：

```js
import('./logger').then(({ log }) => {
  log('code splitting~')
})
```

配置文件：

```js
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist',
    format: 'amd'
  }
}
```

由于使用代码拆分，所以输出不能使用`iife`的输出格式，而是需要使用`amd`或者`cjs`这种类型，同时由于会生成多个文件，所以不能在执行输出文件的名称。

```shell
yarn rollup -c rollup.config.js ./src/index.js 
```

打包后的文件组织形式：

```shell
$ tree -I node_modules 
.
├── dist
│   ├── index.js
│   └── logger-98b2bd18.js
├── package.json
├── rollup.config.js
├── src
│   ├── index.js
│   ├── logger.js
│   └── messages.js
└── yarn.lock
```

#### rollup多入口打包

`rollup`支持多入口的打包方式,入口文件需要以数组或者对象的形式传入：

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
```

项目结构：

```shell
├── dist
│   ├── bar.js
│   ├── foo.js
│   ├── index.html
│   └── logger-635770a8.js
├── package.json
├── rollup.config.js
├── src
│   ├── album.js
│   ├── fetch.js
│   ├── index.js
│   └── logger.js
└── yarn.lock
```

` fetch.js`和`logger.js`是一个公共模块，在`album`.js和`index.js`中都会使用到：

`index.js`:

```js
import fetchApi from './fetch'
import { log } from './logger'

fetchApi('/posts').then(data => {
  data.forEach(item => {
    log(item)
  })
})
```

`album.js`:

```js
import fetchApi from './fetch'
import { log } from './logger'

fetchApi('/photos?albumId=1').then(data => {
  data.forEach(item => {
    log(item)
  })
})
```

`fetch.js`:

```js
export default endpoint => {
  return fetch(`https://jsonplaceholder.typicode.com${endpoint}`)
    .then(response => response.json())
}
```

`rollup`的配置文件：

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
```

最终的打包结果在`dist`目录下：

`bar.js`和`foo.js`是不是两个入口文件对应的打包结果，`logger-635770a8.js`对应的是公共模块的提取结果，由于打包的结果是`amd`规范的，我们如果要在浏览器执行，需要引入`require.js`。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <!-- AMD 标准格式的输出 bundle 不能直接引用 -->
  <!-- <script src="foo.js"></script> -->
  <!-- 需要 Require.js 这样的库 -->
  <script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>
</body>
</html>

```

`data-main`指定的是入口文件。

#### rollup的选用原则

较于`webpack`优点：

* 输入结果更加的扁平
* 默认开启`tree-shaking`，移除了未引用的代码
* 打包的结果依然可读

较于`webpack`缺点：

* 加载非`ES Module`模块比较复杂
* 最终输出结果在一个文件中，无法实现`hmr`
* 浏览器环境中，代码拆分功能依赖`AMD`规范

所以`rollup`更适合框架和类库的开发，而`webpack`更合适应用程秀的开发。

#### parcel

Parcel 是 Web 应用打包工具，适用于经验不同的开发者。它利用多核处理提供了极快的速度，并且不需要任何配置。

#### parcel使用

首先创建一个项目`01-parcel-started`,安装`parcel`所需的开发依赖：

```shell
mkdir 01-parcel-started & cd 01-parcel-started
yarn init -y
yarn global add parcel-bundler
```

Parcel 可以使用任何类型的文件作为入口，但是最好还是使用 HTML 或 JavaScript 文件。如果在 HTML 中使用相对路径引入主要的 JavaScript 文件，Parcel 也将会对它进行处理将其替换为相对于输出文件的 URL 地址。

项目结构如下：

```shell
├── dist
│   ├── index.html
│   ├── jquery.33ab1c93.js
│   ├── jquery.33ab1c93.js.map
│   ├── main.4cb6f353.js
│   ├── main.4cb6f353.js.map
│   ├── main.adcbcf8a.css
│   ├── main.adcbcf8a.css.map
│   └── zce.5ae36a59.png
├── package.json
├── src
│   ├── foo.js
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   └── zce.png
└── yarn.lock
```

入口文件：`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Parcel Tutorials</title>
</head>
<body>
  <script src="main.js"></script>
</body>
</html>

`main.js`:

```js
// import $ from 'jquery'
import foo from './foo'
import './style.css'

foo.bar()


```

启动`parcel`:

```shell
yarn parcel ./src/index.html
yarn run v1.22.10
warning ../../package.json: No license field
$ /Users/lijunjie/js-code/parcel-demo/01-parcel-started/node_modules/.bin/parcel ./src/index.html
Server running at http://localhost:1234 
✨  Built in 1.22s.
```

`parce`会默认启动一个开发服务器，当我们修改文件的内容，服务器回自动刷新。`parcel`同时也支持`hmr`,不过与`webpack`中提供的`api`有一点不同的地方在于，只可以接受一个函数作为参数，当当前模块或者当前模块依赖的模块发生改变时，会执行这个函数：

```js
// src/index.js
// import $ from 'jquery'
import foo from './foo'


foo.bar()


if (module.hot) {
	module.hot.accept(() => {
		console.log('hmr')
	})
}
```

`parcel`可以自动安装依赖,比如我们需要使用一个`Jquery`的类库，我们并不需要去手动安装，只需要在代码中引入即可，`parcel`会帮助我们完成自动安装的工作。

```js
// src/index.js
import $ from 'jquery'
import foo from './foo'
import './style.css'
import logo from './zce.png'

foo.bar()


$(document.body).append('<h1>Hello Parcel</h1>')

$(document.body).append(`<img src="${logo}" />`)


if (module.hot) {
	module.hot.accept(() => {
		console.log('hmr')
	})
}

```

在`parcel`中，我们加载其他类型的文件，也不需要去添加配置,如我们引入图片和样式文件：

```js
// src/index.js
import $ from 'jquery'
import foo from './foo'
import './style.css'
import logo from './zce.png'

foo.bar()
```

此外，`parcel`也支持代码分割：

```js

// import $ from 'jquery'
import foo from './foo'
import './style.css'
import logo from './zce.png'

foo.bar()

import('jquery').then($ => {
	$(document.body).append('<h1>Hello Parcel</h1>')

	$(document.body).append(`<img src="${logo}" />`)
})

if (module.hot) {
	module.hot.accept(() => {
		console.log('hmr')
	})
}
```

我们动态引入的`jquery`会被作为一个单独的文件打包输出。我们需要打包到生产环境代码，我们可以使用下面的命令：

```shell
yarn parcel build ./src/index.html 
```

`parcel`的打包速度比`webpack`快很多，原因就是`parcel`打包可以使用多核cpu同时打包，如果想要在`webpack`也实现类似的功能，可以使用`happypack`插件。

#### parcel总结

虽然`parcel`真正意义上实现了零配置打包，但是目前大多数项目还是使用`webpack`作为了构建工具，了解`parcel`这样的开发工具的意义在于让我们对新生的技术保持敏感度。

​	











