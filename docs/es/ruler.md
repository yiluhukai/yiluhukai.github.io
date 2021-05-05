#### 前端规范化

项目的开发往往是一个团队协作的过程，项目中的每个开发人员可能都有自己的编码喜好和个人习惯，但是这样子会增加项目的维护成本，降低代码的质量，所以每个团队都需要一套明确统一的开发规范。

#### 那些地方需要规范化

* 代码、开发文档甚至是提交的日志
* 开发过程中认为的编写的成果物
* 其中代码的规范化最为重要

#### 实施规范化的方法

* 编写代码前人为的标准约定
* 通过工具实现`lint`

#### 常用的规范化实现方式

* `ESLint`工具的使用
* 定制`ESLint`的检验规则
* `ESLint`对`TypeScript`的支持
* `ESlint`结合自动化工具或`webpack`
* 基于`ESLint`的衍生工具
* `StyleLint`的使用

#### ESLint介绍

* `ESLint`是目前最为主流的`JavaScript Lint`工具
* `ESLint`可以监测代码的质量
* `ESLint`很容易统一开发者的编程风格
* `ESLint`可以提升开发者的编程能力

#### `ESLint`安装

* 首先初始化项目
* 安装`ESLint`作为开发依赖：`yarn add eslint --dev`
* 通过cli命令验证安装结果：`yarn eslint --version `

#### ESLint的具体使用

在项目中安装`ESLint`

```shell
yarn add eslint --dev
```

初始化配置文件：

```shell
yarn eslint --init
```

对问题代码进行检测：

```shell
yarn eslint ./index.js
# 自动修复代码的风格
yarn eslint ./index.js --fix
```

#### ESLint的配置文件解析

```js
module.exports = {
  env: {
    browser: false,
    es6: false
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2015
  },
  rules: {
    'no-alert': "error"
  },
  globals: {
    "jQuery": "readonly"
  }
}
```

首先是`env`，这个配置项决定了我们代码的监测环境，可以为：

```tex
An environment provides predefined global variables. The available environments are:

browser - browser global variables.
node - Node.js global variables and Node.js scoping.
commonjs - CommonJS global variables and CommonJS scoping (use this for browser-only code that uses Browserify/WebPack).
shared-node-browser - Globals common to both Node.js and Browser.
es6 - enable all ECMAScript 6 features except for modules (this automatically sets the ecmaVersion parser option to 6).
es2017 - adds all ECMAScript 2017 globals and automatically sets the ecmaVersion parser option to 8.
es2020 - adds all ECMAScript 2020 globals and automatically sets the ecmaVersion parser option to 11.
es2021 - adds all ECMAScript 2021 globals and automatically sets the ecmaVersion parser option to 12.
worker - web workers global variables.
amd - defines require() and define() as global variables as per the amd spec.
mocha - adds all of the Mocha testing global variables.
jasmine - adds all of the Jasmine testing global variables for version 1.3 and 2.0.
jest - Jest global variables.
phantomjs - PhantomJS global variables.
protractor - Protractor global variables.
qunit - QUnit global variables.
jquery - jQuery global variables.
prototypejs - Prototype.js global variables.
shelljs - ShellJS global variables.
meteor - Meteor global variables.
mongo - MongoDB global variables.
applescript - AppleScript global variables.
nashorn - Java 8 Nashorn global variables.
serviceworker - Service Worker global variables.
atomtest - Atom test helper globals.
embertest - Ember test helper globals.
webextensions - WebExtensions globals.
greasemonkey - GreaseMonkey globals.
These environments are not mutually exclusive, so you can define more than one at a time.

```

不同的为我们提供了不同全局变量，当我们修改配置为：

```js
 env: {
    browser: false,
    es6: false
  },
```

然后被检测的代码：

```js
document.getElementById('ele')
```

正常来说当我们设置了这个配置项`browser: false,`，像`window，document`这种配置项应该不能再使用了，但是我们执行`eslint`的监测，发现正常运行：这是因为我们继承了`eslint-plugin-standard`中的配置:

```js
// eslint-plugin-standard 
  "globals": {
    "document": "readonly",
    "navigator": "readonly",
    "window": "readonly"
  },
```

所以这些全局变量可以通过监测。

`extend`指定我们`eslint`继承 的配置，可以指定多个，这块我们继承的是`eslint-plugin-standard`.

` parserOptions`指定的是语法监测的版本：

```js
 parserOptions: {
    ecmaVersion: 2015
 },
```

监测的代码：

```js
const a = 100
```

执行`eslint`:

```shell
$ npx eslint 02-configuration.js

/Users/lijunjie/js-code/eslint-demo/03-eslint-configurations/02-configuration.js
  0:0  error  Parsing error: sourceType 'module' is not supported when ecmaVersion < 2015. Consider adding `{ ecmaVersion: 2015 }` to the parser options
```

原因是`eslint-plugin-standard`的`sourceType: 'module'`,而`ES5`并不支持这个语法特性：

```js
"parserOptions": {
    "ecmaVersion": 2020,
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
```

我们修改配置文件在执行：

```js
module.exports = {
	env: {
		browser: false,
		es6: false
	},
	extends: ['standard'],
	parserOptions: {
		ecmaVersion: 5,
		sourceType: 'script'
	},
	rules: {
		'no-alert': 'error'
	},
	globals: {
		jQuery: 'readonly'
	}
}
```

```shell
$ npx eslint 02-configuration.js

/Users/lijunjie/js-code/eslint-demo/03-eslint-configurations/02-configuration.js
  1:1  error  Parsing error: The keyword 'const' is reserved

✖ 1 problem (1 error, 0 warnings)
```

但我们将`ecmaVersion:2015`的时候再次执行：

```shell
$ npx eslint 02-configuration.js

/Users/lijunjie/js-code/eslint-demo/03-eslint-configurations/02-configuration.js
  1:7  error  'a' is assigned a value but never used  no-unused-vars
```

这个是因我们变量为使用的缘故，而语法监测已经通过了。当我们在代码中使用`Promise`时还会报错：

```js
let foo2 = 2
let a = new Promise()
```

```shell
$ npx eslint 02-configuration.js

/Users/lijunjie/js-code/eslint-demo/03-eslint-configurations/02-configuration.js
  1:5   error  'foo2' is assigned a value but never used        no-unused-vars
  1:5   error  'foo2' is never reassigned. Use 'const' instead  prefer-const
  2:5   error  'a' is assigned a value but never used           no-unused-vars
  2:5   error  'a' is never reassigned. Use 'const' instead     prefer-const
  2:13  error  'Promise' is not defined                         no-undef

✖ 5 problems (5 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

原因在于：

```js
or ES6 syntax, use { "parserOptions": { "ecmaVersion": 6 } }; for new ES6 global variables, use { "env": { "es6": true } }. { "env": { "es6": true } } enables ES6 syntax automatically, but { "parserOptions": { "ecmaVersion": 6 } } does not enable ES6 globals automatically.
```

所以我们需要设置：`{ "env": { "es6": true } }`,`Promise`不会报出为定义的错误了。

```shell
$ npx eslint 02-configuration.js

/Users/lijunjie/js-code/eslint-demo/03-eslint-configurations/02-configuration.js
  1:5  error  'foo2' is assigned a value but never used        no-unused-vars
  1:5  error  'foo2' is never reassigned. Use 'const' instead  prefer-const
  2:5  error  'a' is assigned a value but never used           no-unused-vars
  2:5  error  'a' is never reassigned. Use 'const' instead     prefer-const

✖ 4 problems (4 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

`ruler`执行我们自定义的规则：

```js
rules: {
		'no-alert': 'error'
	},
```

上面的`no-alert`可以有三种取值：`off,error,warn`，分别对应的是:关闭，报错，警告。

`globals`可以指定一些全局变量，如我们项目中使用了`jQuery`，我们就可以这么设置：

```
globals: {
		jQuery: 'readonly'
	}

```js
Query("#abc")
```

代码监测就不会报错。

#### ESLint 配置注释

我们代码中有时候可能存在一些违反规则的地方，我们不能为了这几行代码推翻这些规则，更好的做饭是使用`ESlint`的注释对这些代码绕过检测：

```js
const str1 = "${name} is a coder" 

console.log(str1)

```

执行`ESLint`:

```shell
$ npx eslint ./eslint-configuration-comments.js

/Users/lijunjie/js-code/eslint-demo/04-eslint-configuration-comments/eslint-configuration-comments.js
  1:14  error  Unexpected template string expression  no-template-curly-in-string

```

如果我们真的需要这样子，我们可以使用注释对该行绕过检测：

```js
const str1 = '${name} is a coder' // eslint-disable-line

console.log(str1)
```

或者只是绕过某个规则：

```js
const str1 = '${name} is a coder' // eslint-disable-line no-template-curly-in-string

console.log(str1)

```

#### ESLint和自动化工具的集成

将`ESLint`和自动化构建工具集成起来，主要有两个好处：

* 保证`ESLint`一定会执行
* 与项目统一，更加好管理

我们选择在`gulp`构建的项目(https://github.com/zce/zce-gulp-demo)中集成`ESLint`，所以前置工具需要一个`gulp`项目，然后安装`ESlint`

```shell
yarn add eslint --dev
```

安装`gulp-eslint`插件：

```shell
yarn add gulp-eslint --dev
```

在`gulpfile.js`中加入对`gulp-eslint`的使用：

```js

...

const script = () => {
	return (
		src('src/assets/scripts/*.js', { base: 'src' })
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failAfterError last.
			.pipe(eslint.failAfterError())
			.pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
			.pipe(dest('temp'))
			.pipe(bs.reload({ stream: true }))
	)
}

....
const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(clean, parallel(series(compile, useref), image, font, extra))

const develop = series(compile, serve)

module.exports = {
	clean,
	build,
	develop
}

```

执行对应的构建任务,发现缺少`ESLint`的配置文件：

```
$ yarn gulp develop  
yarn run v1.22.10
warning ../../../package.json: No license field
$ /Users/lijunjie/js-code/eslint-demo/06-eslint-gulp/zce-gulp-demo/node_modules/.bin/gulp develop
[21:32:51] Using gulpfile ~/js-code/eslint-demo/06-eslint-gulp/zce-gulp-demo/gulpfile.js
[21:32:51] Starting 'develop'...
[21:32:51] Starting 'style'...
[21:32:51] Starting 'script'...
[21:32:51] Starting 'page'...
[21:32:52] 'script' errored after 203 ms
[21:32:52] Error: No ESLint conf
```

创建一个`ESLint`的配置文件：

```shell
$ npx gulp develop   
[22:01:20] Using gulpfile ~/js-code/eslint-demo/06-eslint-gulp/zce-gulp-demo/gulpfile.js
[22:01:20] Starting 'develop'...
[22:01:20] Starting 'style'...
[22:01:20] Starting 'script'...
[22:01:20] Starting 'page'...
[22:01:21] 
/Users/lijunjie/js-code/eslint-demo/06-eslint-gulp/zce-gulp-demo/src/assets/scripts/main.js
  3:1  error  '$' is not defined  no-undef

✖ 1 problem (1 error, 0 warnings)

[22:01:21] 'script' errored after 979 ms
[22:01:21] ESLintError in plugin "gulp-eslint"
Message:
    Failed with 1 error
Details:
    domainEmitter: [object Object]
    domainThrown: false

[22:01:21] 'develop' errored after 981 ms
```

上面检查出来`error  '$' is not defined  no-undef`,这里我们只需要将`$`放进全局变量中即可：

```js
module.exports = {
	env: {
		browser: true,
		es2020: true
	},
	extends: ['standard'],
	parserOptions: {
		ecmaVersion: 11
	},
	rules: {},
	globals: {
		$: 'readonly'
	}
}
```

#### ESLint配合webpack

准备一个`webpack`构建的项目（https://github.com/zce/zce-react-app），然后安装`eslint`:

```shell
yarn add eslint --dev
```

安装`eslint-loader`:

```shell
yarn add eslint-loader --dev
```

初始化`eslint`的配置文件：

```shell
yarn eslint --init
```

安装其他的依赖：

```shell
yarn
```

`webpack.config.js`：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader'
      },
      {
        test: /\.css$/, 
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}
```

我们需要使用`ESlint`去校验源代码，所以我们需要添加`eslint-loader`在`babel-loader`之前，有两种方法可以实现：

```js
	{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
	},
```

或者：

```js
		{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'eslint-loader',
				enforce: 'pre'
			},
```

配置完成后启动项目：

```shell
yarn run dev
...
ERROR in ./src/components/App.js
Module Error (from ./node_modules/eslint-loader/dist/cjs.js):

/Users/lijunjie/js-code/eslint-demo/07-eslint-webpack/zce-react-app/src/components/App.js
  1:8   error  'React' is defined but never used          no-unused-vars
  4:28  error  Missing space before function parentheses  space-before-function-paren

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.

 @ ./src/main.js 4:0-35 5:107-110

ERROR in ./src/main.js
Module Error (from ./node_modules/eslint-loader/dist/cjs.js):

/Users/lijunjie/js-code/eslint-demo/07-eslint-webpack/zce-react-app/src/main.js
  1:8  error  'React' is defined but never used  no-unused-vars
  4:8  error  'App' is defined but never used    no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```

可以看到错误，由于这是一个`React`项目：

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './global.css'
import App from './components/App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

```

里面的`React`是必须要导入的。针对这个问题，`ESLint`提供了一个插件：

```shell
yarn add eslint-plugin-react --dev
```

这个插件里面提供了很多校验规则供我们使用：

```js
const allRules = {
  'boolean-prop-naming': require('./lib/rules/boolean-prop-naming'),
  'button-has-type': require('./lib/rules/button-has-type'),
  'default-props-match-prop-types': require('./lib/rules/default-props-match-prop-types'),
  'destructuring-assignment': require('./lib/rules/destructuring-assignment'),
  'display-name': require('./lib/rules/display-name'),
  'forbid-component-props': require('./lib/rules/forbid-component-props'),
  ....
}  
```

接下来我们在`ESLint`中引入这个插件并使用校验规则：

```js
// eslintrc.js

module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['standard'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	rules: {
        // 2 === error, 这个配置项是忽律对React为使用的校验的
        'jsx-uses-react':2
        // App 为使用
        'jsx-uses-vars': 2
    },
	// 插件中可以省略前缀`eslint-plugin-`
	plugins: ['react']
}
```

对于大多数的`ESlint`插件，都会提供一个共享的配置来降低我们使用的成本，所以我们还可以这么使用：

```js
// eslintrc.js
module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['standard', 'plugin:react/recommended'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	}
}
```

#### 现代化项目中集成`ESlint`

现在的很多框架的脚手架中都有对`ESlint`的集成选项，我们可以使用脚手架很方便的生成对项目中`ESLint`的配置,如使用`vue-cli`生成一个`Vue项目`：

```shell
vue create eslint-vue
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter
? Choose a version of Vue.js that you want to start the project with 2.x
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save, Lint and fix on commit
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) 
```

#### ESLint校验TypeScript

`ESLint`支持对`TypeScript`的校验，在一个`TypeScript`项目中使用`ESlint`去生成一个配置文件:(需要提前安装`TypeScript`)

```shell
npm install -D eslint
npx eslint --init
```

生成的`eslint`配置文件：

```js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}
```

`parser`选项用来制定一个语法解析器,然后我们使用执行对`TypeScript`的校验：

```shell
$ npx eslint ./index.ts 

/Users/lijunjie/js-code/eslint-demo/eslint-typescript/index.ts
  1:13  error  Missing space before function parentheses      space-before-function-paren
  1:31  error  Missing space before opening brace             space-before-blocks
  2:15  error  'msg' is not defined                           no-undef
  2:19  error  Extra semicolon                                semi
  2:20  error  Block must not be padded by blank lines        padded-blocks
  3:1   error  Trailing spaces not allowed                    no-trailing-spaces
  6:5   error  Strings must use singlequote                   quotes
  6:25  error  Newline required at end of file but not found  eol-last

✖ 8 problems (8 errors, 0 warnings)
  7 errors and 0 warnings potentially fixable with the `--fix` option.
```

#### StyleLint的使用介绍

* 提供了默认的代码检查规则
* 提供了`cli`程序,快速调用
* 通过插件支持`Sass`、`Less`、`postCss`
* 支持`gulp`和`webpack`的集成

使用上基本可以参考`eslint`.首先我们在需要使用的项目中安装`stylelint`作为开发依赖：

```shell
npm install -D stylelint
```

手动创建一个`styleLint`的配置文件：`stylelintrc.js`

```js
module.exports = {
	extends: ['stylelint-config-standard']
}
```

`stylelint-config-standard`一个关于`stylelint`的共享配置插件：

```shell
npm install -D stylelint-config-standard
```

然后执行对`css`文件的检验：

```shell
$ npx stylelint style.css 

style.css
 5:1  ✖  Expected empty line before rule   rule-empty-line-before
```

如果需要对`sass`文件进行校验，需要安装对应的插件：

```shell
npm install -D stylelint-config-sass-guidelines
```

然后将这个插件添加到配置文件中：

```shell
module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines']
}
```

执行对`sass`文件的校验：

```shell
$ npx stylelint ./style.scss                     

style.scss
 11:1  ✖  Unexpected missing end-of-source newline   no-missing-end-of-source-newline

```

`stylelint`也可以和`gulp`或`webpack`集成，具体参照`eslint`.

#### prettier格式化代码

`Prettier`是一个前端非常流行的代码格式化工具，几乎可以用来格式化我们前端遇到的各种类型的代码，使用起来也是非常的简单：

```shell 
npm install -D prettier
```

`prettier`可以不用配置文件直接使用(推荐配置自己的规则)：

```shell
$ npx prettier style.css 
body {
  background-color: #f4f6fb;
  color: #23262b;
}
header {
  height: 100px;
}
```

`prettier`将格式化后的代码输出到了控制台，如果需要覆盖原来的文件，可以使用

```shell
$ npx prettier style.css -w
style.css 32ms
```

可以指定一个目录一次格式化多个文件：

```shell
$ npx prettier . -w        
app.vue 77ms
index.html 36ms
package-lock.json 4ms
package.json 3ms
react.jsx 10ms
readme.md 23ms
script.js 6ms
style.css 7ms
style.scss 5ms
```

#### git hooks

`git hooks`指的是git的钩子，每个钩子都对应一个任务。可以通过`shell`脚本来指定任务的具体操作。

```shell
# lijunjie @ 192 in ~/js-code/.git/hooks on git:master o [22:04:48] 
$ ls
applypatch-msg            post-merge                pre-commit                pre-receive
applypatch-msg.sample     post-receive              pre-commit.sample         pre-receive.sample
commit-msg                post-rewrite              pre-merge-commit          prepare-commit-msg
commit-msg.sample         post-update               pre-merge-commit.sample   prepare-commit-msg.sample
fsmonitor-watchman.sample post-update.sample        pre-push                  push-to-checkout
post-applypatch           pre-applypatch            pre-push.sample           sendemail-validate
post-checkout             pre-applypatch.sample     pre-rebase                update
post-commit               pre-auto-gc               pre-rebase.sample         update.sample
```

上面提供了一些`git hook`的例子，如果我们需要代码提交前触发，可以使用` pre-commit钩子 `：

```shell
#!/bin/sh
# husky

# Hook created by Husky
#   Version: 3.1.0
#   At: 2021-2-16 20:43:23
#   See: https://github.com/typicode/husky#readme

# From
#   Directory: /Users/lijunjie/js-code/yeoman/node_sample/node_modules/husky
#   Homepage: https://github.com/typicode/husky#readme

scriptPath="yeoman/node_sample/node_modules/husky/run.js"
hookName=`basename "$0"`
gitParams="$*"

debug() {
  if [ "${HUSKY_DEBUG}" = "true" ] || [ "${HUSKY_DEBUG}" = "1" ]; then
    echo "husky:debug $1"
  fi
}

debug "husky v3.1.0 (created at 2021-2-16 20:43:23)"
debug "$hookName hook started"
debug "Current working directory is '`pwd`'"

if [ "${HUSKY_SKIP_HOOKS}" = "true" ] || [ "${HUSKY_SKIP_HOOKS}" = "1" ]; then
  debug "HUSKY_SKIP_HOOKS is set to ${HUSKY_SKIP_HOOKS}, skipping hook"
  exit 0
fi

if [ "${HUSKY_USE_YARN}" = "true" ] || [ "${HUSKY_USE_YARN}" = "1" ]; then
  debug "Calling husky through Yarn"
  yarn husky-run $hookName "$gitParams"
else

  if ! command -v node >/dev/null 2>&1; then
    echo "Info: can't find node in PATH, trying to find a node binary on your system"
  fi

  if [ -f "$scriptPath" ]; then
    # if [ -t 1 ]; then
    #   exec < /dev/tty
    # fi
    if [ -f ~/.huskyrc ]; then
      debug "Sourcing '~/.huskyrc'"
      . ~/.huskyrc
    fi
    yeoman/node_sample/node_modules/run-node/run-node "$scriptPath" $hookName "$gitParams"
  else
    echo "Can't find Husky, skipping $hookName hook"
    echo "You can reinstall it using 'npm install husky --save-dev' or delete this hook"
  fi
fi
```

#### `ESLint`结合`git hooks`

我们希望在代码提交之前执行`ESLint`的操作，那么可以将`ESlint`和`git hooks`结合起来，对于大多数的程序员来说，并不熟悉`shell`脚本，所以产生了一些`npm`包可以帮我们集成这些功能：

```shell
npm install -D husky
```

然后修改我们的`package.json`文件：

```js
"husky": {
		"hooks": {
			"pre-commit": "npm run lint"
		}
}
```

那么当我们提交代码的时候就会自动去`lint`,但是如果我们需要再`lint`之后再去做一些事情(格式化代码并添加到`stage`),那么我们需要其他的`npm `模块：

```shell
npm install -D lint-staged 
```

修改`package.json`文件：

```js
	"scripts":{
    "preCommit":"lint-staged"
  },
	"husky": {
		"hooks": {
			"pre-commit": "npm run preCommit"
		}
  },
  "lint-staged": {
		"*.js": [
			"eslint",
			"git add"
		]
	},
```

`husky` ->`npm scripts` -> `lint-staged` -> `eslint`.



