#### webpack的打包入口

首先我们创建一个简单项目：

```shell
05_webpack_entry
├── package.json
├── src
│   └── index.js
├── webpack.config.js
└── yarn.lock
```

`package.json`文件：

```json
{
	"name": "05_webpack_entry",
	"version": "1.0.0",
	"main": "index.js",
	"license": "MIT",
	"devDependencies": {
		"webpack": "^4.44.2",
		"webpack-cli": "^3.3.12"
	}
}
```

`src/index.js`:

```js
console.log('index.js执行了')
```

`webpack.config.js`:

```js
const path = require('path')

module.exports = {
	context: process.cwd(),
	devtool: 'none',
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve('dist')
	}
}
```

使用`webpack`去打包：

```shell
yarn webpack
```

此时会在项目根目录下生成`dist`文件夹。

```shell
$ tree -I node_modules 05_webpack_entry
05_webpack_entry
├── dist
│   └── index.js
├── package.json
├── src
│   └── index.js
├── webpack.config.js
└── yarn.lock
```

当我们使用`npx webpack`时到底执行了什么呢？我们先在项目的根目录下创建一个`run.js`文件：

```js
// run.js
const webpack = require('webpack')

const options = require('./webpack.config.js')

const compiler = webpack(options)

compiler.run(function (err, stats) {
	console.log(err)
	console.log(stats.toJson())
})
```

然后使用`node`去执行上面的代码：

```shell
node run.js
```

如果我们在执行上面的命令之前已经删除了`dist`目录，那么我们会发现上面命令会重新生成`dist`目录。我们为什么可以直接这么做去打包呢？我们知道我们使用

`yarn webpack`实际上调用的是`webpack`包下面的`bin/webpack.js`文件：

```json
//node_module/webpack/package.json
 "bin": "./bin/webpack.js",
```

`yarn webpack`实际上是在项目的根目录下对这个`shell`脚本的执行：

```shell
$ node_modules/webpack/bin/webpack.js 
Hash: 979b9d9db0b10093ff26
Version: webpack 4.46.0
Time: 38ms
Built at: 2021-06-03 22:58:18
   Asset      Size  Chunks             Chunk Names
index.js  3.75 KiB    main  [emitted]  main
Entrypoint main = index.js
[./src/index.js] 33 bytes {main} [built]
```

`bin/webpack.js`的文件：

```js

#!/usr/bin/env node

....

/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = packageName => {
	try {
		require.resolve(packageName);

		return true;
	} catch (err) {
		return false;
	}
};

/** @type {CliOption[]} */
const CLIs = [
	{
		name: "webpack-cli",
		package: "webpack-cli",
		binName: "webpack-cli",
		alias: "cli",
		installed: isInstalled("webpack-cli"),
		recommended: true,
		url: "https://github.com/webpack/webpack-cli",
		description: "The original webpack full-featured CLI."
	},
	{
		name: "webpack-command",
		package: "webpack-command",
		binName: "webpack-command",
		alias: "command",
		installed: isInstalled("webpack-command"),
		recommended: false,
		url: "https://github.com/webpack-contrib/webpack-command",
		description: "A lightweight, opinionated webpack CLI."
	}
];

const installedClis = CLIs.filter(cli => cli.installed);

if (installedClis.length === 0) {
	 ....
} else if (installedClis.length === 1) {
	const path = require("path");
	const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
	// eslint-disable-next-line node/no-missing-require
	const pkg = require(pkgPath);
	// eslint-disable-next-line node/no-missing-require
	require(path.resolve(
		path.dirname(pkgPath),
		pkg.bin[installedClis[0].binName]
	));
} else {
	....
}

```

因为我们只需要去关注核心的流程，所以我们隐藏了代码中了很多不重要的代码.我们安装`webpack`的同时也安装了`webpack-cli`，所以`installedClis`的长度为1.

```js
/*
[
  {
    name: "webpack-cli",
    package: "webpack-cli",
    binName: "webpack-cli",
    alias: "cli",
    installed: true,
    recommended: true,
    url: "https://github.com/webpack/webpack-cli",
    description: "The original webpack full-featured CLI.",
  },
]
*/
const installedClis = CLIs.filter(cli => cli.installed);
if (installedClis.length === 0) {
	 ....
} else if (installedClis.length === 1) {
	const path = require("path");
  // installedClis[0].package} === ""webpack-cli""
  //"/Users/...../05_webpack_entry/node_modules/webpack-cli/package.json"
	const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
 
	// eslint-disable-next-line node/no-missing-require
  //
	const pkg = require(pkgPath);
	// eslint-disable-next-line node/no-missing-require
	require(path.resolve(
		path.dirname(pkgPath),
		pkg.bin[installedClis[0].binName]
	));
} else {
	....
}
```

上面的`pkgPath`项目与去获取`webpack-cli.package.json`的绝对路径，然后加载这个`package.json`文件：

```json
// webpack-cli/package.json
{
  ...
    "bin": {
    "webpack-cli": "./bin/cli.js"
  },
  "main": "./bin/cli.js",
  ...
}
```

所以：

```js
path.dirname(pkgPath) // /Users/...../05_webpack_entry/node_modules/webpack-cli/
pkg.bin[installedClis[0].binName] // ./bin/cli.js
```

然后使用`require`去执行这个文件：

```js
//node_modules/webpack-cli/.bin/cli.js

#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const { NON_COMPILATION_ARGS } = require("./utils/constants");

(function() {
	// wrap in IIFE to be able to use return

 ....

const yargs = require("yargs").usage(`webpack-cli ${require("../package.json").version}

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]

For more information, see https://webpack.js.org/api/cli/.`);

	require("./config/config-yargs")(yargs);

	// yargs will terminate the process early when the user uses help or version.
	// This causes large help outputs to be cut short (https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4#process).
	// To prevent this we use the yargs.parse API and exit the process normally
	yargs.parse(process.argv.slice(2), (err, argv, output) => {
		Error.stackTraceLimit = 30;

	  ....

		let options;
		try {
			options = require("./utils/convert-argv")(argv);
		} catch (err) {
		  ....
		}

		....
    //
		function processOptions(options) {
			
      /*
      {
          context: '/.../05_webpack_entry',
          devtool: 'none',
          mode: 'development',
          entry: './src/index.js',
          output: {
            filename: 'index.js',
            path: '/.../05_webpack_entry/dist'
          }
			}
      */
			....

			const webpack = require("webpack");

			let lastHash = null;
			let compiler;
			try {
				compiler = webpack(options);
			} catch (err) {
				if (err.name === "WebpackOptionsValidationError") {
					if (argv.color) console.error(`\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`);
					else console.error(err.message);
					// eslint-disable-next-line no-process-exit
					process.exit(1);
				}

				throw err;
			}

			....

		function compilerCallback(err, stats) {
        if (firstOptions.watch || options.watch) {
           ...
        } else {
          compiler.run((err, stats) => {
            if (compiler.close) {
              compiler.close(err2 => {
                compilerCallback(err || err2, stats);
              });
            } else {
              compilerCallback(err, stats);
            }
          });
        }
		}
		processOptions(options);
	});
})();

```

`cli`文件一般做的工作就是去加载配置项然后传递给业务代码，这块我们将`options`传递给`processOptions`,然后`compiler = webpack(options);`在`webpack`加载完选项后执行`compilerCallback`代码，所以我们上面可以用简单的代码去模拟这个过程。



