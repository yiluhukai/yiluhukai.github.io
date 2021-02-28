## 前端工程化

### 前端工程化的目的

* 随着前端的发展，现在的前端应用已经不像以前只是为了后端提供视图模版。

* 由于前端项目日益复杂，前端项目中面临着许多问题

  * 想要使用ES6+的新特性，但是有兼容性问题
  * 想要使用更具有表达力的Less、Scss、PostCss等增强css,但是运行环境不能直接支持
  * 想要使用模块化方式提高项目的可维护性，但是运行环境不支持
  * 部署上线前需要手动压缩代码和资源文件,部署过程中需要手动上传代码到服务器	
  * 多人协作时无法硬性统一大家的编码风格，从仓库pull回来的代码质量无法保证
  * 部分功能开发时需要等待后端接口提前完成 	

* 前端工程化主要解决了的问题

  ![problems](/frontEnd/problems.png)

### 前端工程化的表现

* 一切以提高效率、降低成本、质量保证为目的的手段都属于工程化
* 项目工程化不等于使用某个工具
* Node.js是前端工程化的基石
* 项目中的具体表现

![project](/frontEnd/project.png)

* 创建项目:
  * 创建项目结构
  * 创建特定类型文件
* 编码
  * 格式化代码
  * 校验代码风格
  * 编译/构建/打包
* 预览/测试
  * Web Server/mock
  * Live Reloading/HMR
  * Source Map
* 提交
  * git Hooks
  * Lint-staged
  * 持续集成
* 部署
  * CI/CD
  * 自动部署发布

### 一些成熟的工程化集成

* create-react-app
* vue-cli
* angular-cli
* gatsby-cli

### 脚手架工具

* 脚手架工具的本质作用：创建项目基础结构、提供项目规范和约定
  * 相同的组织结构
  * 相同的开发范式
  * 相同的模块依赖
  * 相同的工具配置
  * 相同的基础代码

### 常用的脚手架工具

* create-react-app、vue-cli、angular-cli特定框架的脚手架
* yeoman是通用的脚手架工具，可以用来生成特定模版的脚手架

### yeoman的使用

1. 全局安装yeoman的命令行工具

   ```shell
   # yarn global add yo
   npm install -g yo 
   ```

2. 安装一个generator,yo会使用generator生成特定类型的项目

   ```shell
   #yarn global add generator-node
   npm install -g generator-node
   ```

3. 进入要生成项目的文件夹下，使用`yo generator`去创建项目,回答完制定的问题后，就可以创建一个项目

   ```shell
   cd node_sample
   yo node
   ```

4. 使用generator的sub generator去为已有的项目添加一些新的配置文件或者特性，如generator-node有一个sub  generator叫cli，我们可以使用它将项目变成一个cli应用。

   ```shell
   yo node:cli
   ```

   运行后会在package.json中新增如下的文件

   ```json
    "bin": "lib/cli.js",
     "dependencies": {
       "meow": "^3.7.0"
     }
   ```

   安装开发依赖并链接一个包到全局使用

   ```shell
   # 安装依赖
   yarn
   
   yarn link
   # 若不成功可尝试使用npm link,安装时刚开始yarn link确实不可用，但是用了npm link后，在回过来使用yarn link确实可以了 
   node_sample --help 
   ```

   并不是每个generator都有sub generator,下面是generator-node的sub generator.

   * `node:boilerplate`
   * `node:cli`
   * `node:editorconfig`
   * `node:eslint`
   * `node:git`
   * `node:readme`

   ###  自定义generator

* yeoman的generator本质上是一个npm模块

* yeoman的generator有自己的命名规则，自定义generator必须遵从这个规则,

* generator必须以generator-开头，基本形式为generator-name

* 自定义generator是对整个包的文件夹也是有要求的

   * ![generator](/frontEnd/generator.png)
   * 上面的是只有一个generator的，下面的是包含其他的sub generator的

   * yeoman-generator包中提供了一个generator的基类，提供了一些声明周期方法，可以帮助创建生成器

   * ```shell
     mkdir generator-sample
     cd generator-sample
     mkdir app
     cd app
     touch index.js
     ```

   * ```js
     /**
      * yeoman-generator中导出一个生成器的基类，基类中提供了生命周期函数和一些方法
      * index.js 
      */
     
     const Generator = require('yeoman-generator')
     module.exports = class extends Generator {
     	writing() {
     		//生成文件阶段调用此方法
     		// 向项目的目录中写入文件
     		// wirte方法接受两个参数：一个生成的文件的绝对路径，一个文件的内容
     		this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
     	}
     }
     ```

   * ```
     npm link
     mkdir my-proj & cd my-proj
     yo sample
     ```

   * 使用模版创建文件

     * generator可以使用模版去创建一个复杂的文件

     * 模版文件完全遵守ejs模版引擎的规则

     * 模版文件需要放置在app/templates/ 下，下面是一个模版文件foo.txt

     * ```js
       这是一个模版文件
       
       <%= title %>
       
       
       
       <% if(success) {%>
       哈哈哈
       <% } %>
       
       ```

     * 修改index.js

     * ```js
       /**
        * yeoman-generator中导出一个生成器的基类，基类中提供了生命周期函数和一些方法
        *
        */
       
       const Generator = require('yeoman-generator')
       module.exports = class extends Generator {
       	writing() {
       		//生成文件阶段调用此方法
       		// 向项目的目录中写入文件
       		// wirte方法接受两个参数：一个生成的文件的绝对路径，一个文件的内容
       		//this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
       		// 模版文件的路径
       		const temp = this.templatePath('foo.txt')
       
       		// 输出目标的路径
       		const output = this.destinationPath('foo.txt')
       
       		//模版数据上下文
       		const contents = { title: 'foo.txt', success: true }
       
       		this.fs.copyTpl(temp, output, contents)
       	}
       }
       ```

     * ```shell
       cd my-proj
       // 重新创建文件
       yo sample
       ```

   * 创建模版时接受用户的输入

     * ```html
       <!DOCTYPE html>
       <html lang="en">
       
       <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title> <%= name %></title>
       </head>
       
       <body>
           <h1><%= name %></h1>
       </body>
       
       </html>
       
       ```

     * 上面是一个bar.html文件，我们希望在用户创建模版时根据用户的输入填充模版的名称

     * ```js
       
       /**
       index.js
       */
       const Generator = require('yeoman-generator')
       module.exports = class extends Generator {
       	prompting() {
       		// 创建模版时提问
       		//https://github.com/SBoudrias/Inquirer.js/blob/master/README.md
       		return this.prompt({
       			type: 'input',
       			name: 'name',
       			message: 'Please input your file name!',
       			default: 'project'
       		}).then(answer => {
       			//answer = { name: 'val' }
       			this.answer = answer
       		})
       	}
       	writing() {
       		//生成文件阶段调用此方法
       		// 向项目的目录中写入文件
       		// wirte方法接受两个参数：一个生成的文件的绝对路径，一个文件的内容
       		//this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
       		// 模版文件的路径
       		// const temp = this.templatePath('foo.txt')
       		// // 输出目标的路径
       		// const output = this.destinationPath('foo.txt')
       		// //模版数据上下文
       		// const contents = { title: 'foo.txt', success: true }
       		// this.fs.copyTpl(temp, output, contents)
       
       		const temp = this.templatePath('bar.html')
       		// 输出目标的路径
       		const output = this.destinationPath('bar.html')
       		//模版数据上下文
       		const contents = this.answer
       		this.fs.copyTpl(temp, output, contents)
       	}
       }
       ```

     * ```
       去根据模版生成文件
       yo sample
       ```

   ###  创建一个vue.js的脚手架

   * 首先创建一个生成器目录generator-my-vue，进入该模块，安装yeoman的依赖文件yeoman-generator.

   * 将我们已经定义好的模版文件copy到app/template目录下面,将要修改的文件定义成ejs的模版引擎

     * <%%= BASE_URL %是不需要转移的 

     * ```html
       <!DOCTYPE html>
       <html>
       
       <head>
         <meta charset="utf-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
         <meta name="renderer" content="webkit">
         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
         <link rel="icon" href="<%%= BASE_URL %>favicon.ico">
         <title><%= name %></title>
         </style>
       </head>
       
       <body>
         <div id="app">
       
         </div>
       </body>
       
       </html>
       ```

   * 在app/index.js中将目录文件引入模版文件

   * ```js
     
     const Generator = require('yeoman-generator')
     
     module.exports = class extends Generator {
     	// 接受用户的输入
     	prompting() {
     		return this.prompt({
     			type: 'input',
     			name: 'name',
     			massage: 'please input your name of project',
     			default: 'vue-demo'
     		}).then(answer => {
     			//answer ={ name:'your input'}
     			this.answer = answer
     		})
     	}
     	writing() {
     		const templates = [
     			'build/index.js',
     			'public/favicon.ico',
     			'public/index.html',
     			'src/App.vue',
     			'src/main.js',
     			'babel.config.js',
     			'jsconfig.json',
     			'package-lock.json',
     			'package.json',
     			'postcss.config.js',
     			'vue.config.js',
     			'README.md'
     		]
     
     		templates.forEach(item => {
     			this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), this.answer)
     		})
     	}
     }
     
     ```

   * ```shell
     # 将包引入到全局
     npm link
     //
     mkdir my-vue-project & cd my-vue-project
     // 创建一个项目
     yo my-vue
     ```

   * 发布我们的generator到npm

     * 创建一个git仓库，并向远端(github)提交一次代码
     * 使用npm publish去发布我们的包
     * 发布成功后可以去npm的官方查看我们的包
     * npm发布的时候需要登陆npm账号，可以通过npm adduser去添加账户
     * 注册的npm账户需要验证邮箱，同时报名不能和已经存在的报名相同，否则会发布失败

   ### plop脚手架

   * plop是一个小型的脚手架工具
   * 主要的作用是在项目中创建相同类型的文件

   

   ### plop的使用

   * 将plop作为开发依赖在项目中安装
   * 在项目中创建一个plopfile.js文件
   * 在plop file.js中定义脚手架任务
   * 在plop-templates/编写用于生成特定类型文件的模版
   * 通过plop的提供的cli执行脚手架任务(npx plop /yarn plop)

   ### 使用plop在react中创建组件

   * 使用create-react-app生成一个项目

   * 在项目中安装开发依赖plop,配置入口文件plopfile.js

     * ```shell
       npm install -D plop
       ```

     * ```js
       /**
        * plop的入口文件，需要导出一个函数
        * 函数执行的时候时会传入plop对象，用于创建生成器任务
        */
       
       module.exports = plop => {
       	/**
       	 * 第一个参数时生成器的名字
       	 * 第二个参数用于描述生成器的对象
       	 */
       	plop.setGenerator('component', {
       		description: 'create a react component',
       		// 创建过程中的询问环节
       		prompts: [
       			{
       				type: 'input',
       				name: 'name',
       				message: 'component name',
       				default: 'MyComponent'
       			}
       		],
       
       		actions: [
       			{
       				// 生成模版环节
       				type: 'add',
       				// name 来自上面的答案,使用hbs的模版引擎
       				path: 'src/components/{{name}}/{{name}}.js',
       				templateFile: 'plop-templates/component.js.hbs'
       			},
       			{
       				// 生成模版环节
       				type: 'add',
       				// name 来自上面的答案,使用hbs的模版引擎
       				path: 'src/components/{{name}}/{{name}}.css',
       				templateFile: 'plop-templates/component.css.hbs'
       			},
       			{
       				// 生成模版环节
       				type: 'add',
       				// name 来自上面的答案,使用hbs的模版引擎
       				path: 'src/components/{{name}}/{{name}}.test.js',
       				templateFile: 'plop-templates/component.test.js.hbs'
       			}
       		]
       	})
       }
       
       ```

   * 复制3个模版文件到plop-templates目录下

     * ```js
       // component.css.hbs
       .{{name}} {
       
       }
       //component.js.hbs
       import React from 'react';
       
       import './{{name}}.css';
       
       export default () => (
         <div className="{{name}}">
       
         </div>
       )
       //component.test.js.hbs
       import React from 'react';
       import ReactDOM from 'react-dom';
       import {{name}} from './{{name}}';
       
       it('renders without crashing', () => {
         const div = document.createElement('div');
         ReactDOM.render(<{{name}} />, div);
         ReactDOM.unmountComponentAtNode(div);
       });
       
       ```

   * 使用`npx plop`命令去生成文件 

   ### 脚手架的工具原理

   * 脚手架是一个cli应用
   * 脚手架一般包含询问和根据模版生成文件两个过程

   ### 脚手架具体实现

   * 创建一个目录cli-demo

   * ```shell
     npm init -y
     ```

     * 修改package.json文件

     * ```json
       {
       	"name": "cli-demo",
       	"version": "1.0.0",
       	"description": "",
       	"main": "index.js",
       	"bin": "cli.js",
       	"scripts": {
       		"test": "echo \"Error: no test specified\" && exit 1"
       	},
       	"keywords": [],
       	"author": "",
       	"license": "ISC"
       }
       
       ```

     * ```js
       // cli.js
       
       
       #!/usr/bin/env node
       console.log("hello")
       ```

   * 执行命令将包链接到全局

     * ```shell
       npm link
       # 执行 正常输出hello
       cli-demo
       ```

   * 修改cli.js

     * ```js
       #!/usr/bin/env node
       
       // Node CLI 应用入口文件必须要有这样的文件头
       // 如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
       // 具体就是通过 chmod 755 cli.js 实现修改
       
       // 脚手架的工作过程：
       // 1. 通过命令行交互询问用户问题
       // 2. 根据用户回答的结果生成文件
       
       const fs = require('fs')
       const path = require('path')
       const inquirer = require('inquirer')
       const ejs = require('ejs')
       
       inquirer
       	.prompt([
       		{
       			type: 'input',
       			name: 'name',
       			message: 'Project name?'
       		}
       	])
       	.then(anwsers => {
       		// console.log(anwsers)
       		// 根据用户回答的结果生成文件
       
       		// 模板目录
       		const tmplDir = path.join(__dirname, 'templates')
       		// 目标目录
       		const destDir = process.cwd()
       
       		// 将模板下的文件全部转换到目标目录
       		fs.readdir(tmplDir, (err, files) => {
       			if (err) throw err
       			files.forEach(file => {
       				// 通过模板引擎渲染文件
       				ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
       					console.log(file)
       					if (err) throw err
       
       					// 将结果写入目标文件路径
       					fs.writeFileSync(path.join(destDir, file), result)
       				})
       			})
       		})
       	})
       
       ```

     * 将模版文件放入到templates/

     * ```js
       // comnponet.js
       
       import React from 'react'
       
       import './<%= name %>.css'
       
       export default () => <div className="<%= name %>"></div>
       
       
       // componnets.test.js
       
       import React from 'react';
       import ReactDOM from 'react-dom';
       import <%= name %> from './<%= name %>';
       
       it('renders without crashing', () => {
         const div = document.createElement('div');
         ReactDOM.render(<<%= name %> />, div);
         ReactDOM.unmountComponentAtNode(div);
       });
       ```

     * 在需要创建文件的目录下执行`cli-demo`去创建文件

### 自动化构建

* 自动化构建指的是利用机器去代替手工去完成代码转化的工作
* 从源代码自动化构建到生产环境代码的过程叫自动化构建工作流
* 自动化构建的目的是为了将运行环境不支持的语法、语言转化到可以直接在运行环境执行的代码，提高开发效率。

![自动化构建](/frontEnd/auto-build.png)

### 自动化构建初体验

* 在开发过程中使用scss代替css.

* 首先在项目中创建一个index.html和index.sass文件 

  * ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="index.css">
    </head>
    
    <body>
        <h1>scss</h1>
    </body>
    
    </html>
    ```

  * ```scss
    $body-color:red;
    
    h1 {
        color: $body-color
    }
    ```

* scss文件不能直接在浏览器中使用，我们使用sass(npm包)将scss编译成css.

  * ```shell
    npm install -D sass
    npx sass index.scss index.css 
    ```

  * 在浏览器直接打开html文件可以看到我们样式生效了

* 但是我们可以看到每次都要手动去构建比较麻烦，我们可以使用`npm script`,在package.json中加入下面的代码

  * ```json
    ....
    
    "scripts": {
    		"build": "sass index.scss index.css"
     },
    
    ...
    ```

* 同时我们还想代码可以在浏览器中直接打开

  * 安装browser-sync

    * ```shell
      npm install -D browser-sync
      ```

  * 在package.json中加入新的脚本

    * ```json
      "serve": "browser-sync ."
      ```

    * 上面的.代表当前目录，执行脚本会自动启动一个服务

* 此外，我们还想在每次启动服务之前都先构建一次，可以使用npm钩子

  * 在package.json中加入如下的代码

  * ```json
    "scripts": {
        "build": "sass index.scss index.css",
        "preserve":"npm run build",
    		"serve": "browser-sync ."
    	},
    ```

  * preserve会在serve之前执行，所以当我们启动这个服务时总会先去构建一次scss文件

* 我们还想在修改scss文件之后可以自动构建，那么我们可以这么修改package.json文件

  * ```json
    "scripts": {
        "build": "sass index.scss index.css --watch",
        "preserve":"npm run build",
    		"serve": "browser-sync ."
    	},
    ```

  * 此时执行npm run serve会发现不能启动一个新的服务,原因是加入--watch后阻塞后续命令的执行，为了让两个命令都执行，我们需要借助一个npm包

  * ```shell
    npm i -D npm-run-all
    ```

  * 然后重新修改package.json文件

  * ```json
    "scripts": {
    		"build": "sass index.scss index.css --watch",
    		"serve": "browser-sync .",
    		"start": "run-p build serve"
    	},
    ```

* 使用上面的`npm run start`我们会发现改变了scss文件后重新生成了css文件，但是服务没有刷新去重新加载

  * 为此我们需要服务去监听项目下css文件变化，我们可以修改脚本

  * ```json
    	"scripts": {
    		"build": "sass index.scss index.css --watch",
    		"serve": "browser-sync . --files \"*.css\"",
    		"start": "run-p build serve"
    	},
    ```

  * 此时我们修改scss文件就会自动刷新页面

### 常用的自动化构建工具

* grunt

  * grunt的插件生态非常丰富，几乎支持所以你要想要的自动化任务
  * grunt的构建过程是基于临时文件的，构建过程中每一步都会产生临时文件，下一个步骤读取这个临时文件继续执行其他的任务
  * 由于临时文件的原因需要频繁的io操作，所以当项目比较大的时候构建比较慢

* gulp

  * gulp是基于流去实现的，相比grunt构建更快

  * gulp支持同时多任务

  * gulp的使用相比grunt也更简单直观，插件生态也同样丰富

* FIS
  * FIS是一个大而全的构建工具，
  * FIS对很多的需求都做了集成，可以很容易的完成资源加载、模块化开发、代码部署、性能优化等
  * 更适合新手

### grunt的基本使用

* 创建一个项目grunt-sample,然后执行npm init去初始化package.json

* ```
  npm install -D grunt
  ```

* 创建grunt的入口文件grunt file.js

  * ```js
    /**
     *
     * gruntfile.js是grunt的入口文件，让我们定义一些自动化任务
     * 需要导出一个函数，函数接受grunt作为形参，里面提供了一些构建任务可以用的api
     *
     */
    
    module.exports = function (grunt) {
    	// 定义一个简单的任务
    	// 第一个参数是任务的名称
    	// npx grunt bar
    	grunt.registerTask('foo', function () {
    		console.log('hello')
    	})
    	//第二个参数是一个任务描述
    	grunt.registerTask('baz', 'this is task', function () {
    		console.log('hello')
    	})
    
    	// 定义一个默认任务
    	//  npx grunt
    	// grunt.registerTask('default', function () {
    	// 	console.log('this is default task')
    	// })
    
    	// 使用默认任务去串联其他的任务
    
    	grunt.registerTask('default', ['foo', 'baz'])
    
    	// 异步任务
    	// grunt的任务默认是同步执行的，所以不会执行console.log
    	grunt.registerTask('async-task', function () {
    		setTimeout(() => {
    			console.log('async task')
    		}, 1000)
    	})
    
    	// 想要执行异步的任务，需要使用this.async获取一个函数，执行这个函数grunt才回去结束任务
    	grunt.registerTask('async-task', function () {
    		const done = this.async()
    		setTimeout(() => {
    			console.log('async task')
    			done()
    		}, 1000)
    	})
    }
    ```

  * gruntfile.js是grunt的入口文件，让我们定义一些自动化任务

  * gruntfile.js需要导出一个函数，函数接受grunt作为形参，里面提供了一些构建任务可以用的api

  * grunt中使用grunt.registerTask()去注册任务。

  * 使用`npx grunt [taskName]`去执行任务，当为默认任务时可以省略任务的名称

  * 使用`npx grunt --help`可以查看到可以使用的任务名称

  * grunt的任务默认是同步执行的，也就是说不会等待异步任务执行就会结束当前的任务

  * 想要执行一个异步任务，需要在异步任务结束时调用this.返回的回调函数去告知grunt接受任务。

* grunt使用任务函数的返回值为false来标记任务失败，当任务失败后，后续的任务不会继续执行,可以用`npx grunt [taskName] --force`去执行后续的任务

* 当为异步任务时，无法直接返回false来告诉grunt任务失败，但是我们可以借助this.async()返回的回调函数来传递失败信息给grunt.

  * ```js
    grunt.registerTask('bad', 'this is task', function () {
    		console.log('hello')
    		return false
    	})
    
    // 异步使用done(false)来告知grunt任务执行失败
    	grunt.registerTask('async-bad-task', function () {
    		const done = this.async()
    		setTimeout(() => {
    			console.log('async task')
    			done(false)
    		}, 1000)
    	})
    ```
  
* 使用grunt.initConfig()为任务添加选项，grunt.config()在具体的任务中获取配置选项

  * ```js
  grunt.initConfig({
    		// foo在这里代表的是任务名
  		foo: {
    			baz: 123
  		}
    	})
    
    	grunt.registerTask('foo', function () {
    		console.log(grunt.config('foo.baz')) //123
    		console.log(grunt.config('foo').baz) //123
    	})
    ```

* 多目标任务
  
  * ```js
    grunt.initConfig({
    		build: {
    			// build任务的选项
    			options: {
    				top: 'top'
    			},
    			css: {
    				options: {
    					baz: 'baz'
    				}
    			},
          // data
    			js: 1 
    		}
    	})
    	grunt.registerMultiTask('build', function () {
    		console.log(this.options())
    		console.log(`target:${this.target},data:${this.data}`)
    	})
    ```
    
  * 上面使用grunt.registerMultiTask注册了一个build的多模式任务。
  
  * 多模式任务必须使用grunt.initConfig()方法去初始化目标任务，build对象中的options属性会作为任务选项，其他的键会成为子任务
  
  *  所以上面实质是注册了三个任务任务:build、build:css、build:js。
  
  * 使用`npx gurnt build`会执行两个子任务
  
    ```shell
    $ npx grunt build
    Running "build:css" (build) task
    { top: 'top', baz: 'baz' }
    target:css,data:[object Object]
    
    Running "build:js" (build) task
    { top: 'top' }
    target:js,data:1
    
    Done.
    ```
    
  * 子任务的this.options()和this.data由grunt.initConfig配置
  
* grunt插件的使用

  * grunt的插件实际上对常用的构建任务的封装

  * 使用npm安装插件:`npm install grunt-contrib-clean --save-dev`

  * 在gruntfile.js中使用:grunt.loadNpmTasks('grunt-contrib-clean');

  * 使用grunt.initConfig()添加插件配置：

  * ```js
    module.exports = grunt => {
    	// 使用grunt插件
    	grunt.initConfig({
    		clean: {
    			// 删除当前目录下的所有txt文件
    			txt: ['*.txt'],
    			// 删除src基src下子目录中的文件
    			src: ['src/**']
    		}
    	})
    	grunt.loadNpmTasks('grunt-contrib-clean')
    }
    
    ```

  * `npx grunt [plugin-name]`运行任务：`npx grunt clean`

    > grunt的插件一般`grunt-contrib-`/`grunt-`开头。

### grunt常用插件的使用

* grunt-sass

  * 编译sass到css
  
* grunt-babel

  * 将ES6语法编译ES5
  
* grunt-contrib-watch
	
* 	检测文件的变化
	
* 创建项目grunt-often-plugins,执行`npm init -y`创建package.json.

* 安装grunt的依赖

  * ```shell
    npm install --save-dev grunt
    ```

* 安装grunt-sass的依赖

  * ```shell
    npm install --save-dev node-sass grunt-sass
    ```

* 创建grunt的入口文件grunt file.js

  * ```js
    const sass = require('node-sass')
    module.exports = grunt => {
    	grunt.initConfig({
    		sass: {
    			options: {
    				//  制定编译sass的模块
    				implementation: sass,
    				sourceMap: true
    			},
    			//
    			dist: {
    				files: {
    					// 目标文件：源文件
    					'./dist/css/main.css': 'scss/main.scss'
    				}
    			}
    		}
    	})
    	grunt.loadNpmTasks('grunt-sass')
    }
    ```
  
* 安装grunt-babel的依赖

  * ```shell
    npm install --save-dev grunt-babel @babel/core @babel/preset-env
    ```
  
* 在grunt-file中加入配置

  * ```js
  const sass = require('node-sass')
    module.exports = grunt => {
  	grunt.initConfig({
    		//sass任务
    		sass: {
    			options: {
    				//  制定编译sass的模块
    				implementation: sass,
    				sourceMap: true
    			},
    			//
    			dist: {
    				files: {
    					// 目标文件：源文件
    					'./dist/css/main.css': 'scss/main.scss'
    				}
    			}
    		},
    		// babel任务
    		babel: {
    			options: {
    				sourceMap: true,
    				presets: ['@babel/preset-env']
    			},
    			dist: {
    				files: {
    					// 目标文件：源文件
    					'dist/js/app.js': 'src/app.js'
    				}
    			}
    		}
    	})
    	grunt.loadNpmTasks('grunt-sass')
    	grunt.loadNpmTasks('grunt-babel')
    }
    ```
  
* 安装grunt-contrib-watch的依赖

  * ```shell
    npm install grunt-contrib-watch --save-dev
    ```

* 在gruntfile中加入如下的配置

  * ```js
  watch: {
    			scripts: {
  			//检测文件的变化
    				files: ['src/*.js', 'scss/*.scss'],
  			// 文件变化执行的任务
    				tasks: ['babel', 'sass'],
  				options: {
    					spawn: false
    				}
    			}
    		}
    
    ....
    grunt.loadNpmTasks('grunt-contrib-watch')
    ```
  
* 每次都使用grunt.loadNpmTasks()加载grunt插件比较麻烦，我们可以使用load-grunt-tasks去自动加载grunt插件

* 我们还可以将上面的任务配置到默认任务中方便启动

* ```js
  const sass = require('node-sass')
  const loadGruntTasks = require('load-grunt-tasks')
  module.exports = grunt => {
  	grunt.initConfig({
  		//sass任务
  		sass: {
  			options: {
  				//  制定编译sass的模块
  				implementation: sass,
  				sourceMap: true
  			},
  			//
  			dist: {
  				files: {
  					// 目标文件：源文件
  					'./dist/css/main.css': 'scss/main.scss'
  				}
  			}
  		},
  		// babel任务
  		babel: {
  			options: {
  				sourceMap: true,
  				presets: ['@babel/preset-env']
  			},
  			dist: {
  				files: {
  					// 目标文件：源文件
  					'dist/js/app.js': 'src/app.js'
  				}
  			}
  		},
  		watch: {
  			scripts: {
  				//检测文件的变化
  				files: ['src/*.js', 'scss/*.scss'],
  				// 文件变化执行的任务
  				tasks: ['babel', 'sass'],
  				options: {
  					spawn: false
  				}
  			}
  		}
  	})
  	// grunt.loadNpmTasks('grunt-sass')
  	// grunt.loadNpmTasks('grunt-babel')
  	// grunt.loadNpmTasks('grunt-contrib-watch')
  	//  自动加载grunt插件
  	loadGruntTasks(grunt)
  	// 每次启动先执行一次sass和babel任务，文件变化的时候再执行sass和babel任务
  	grunt.registerTask('default', ['sass', 'babel', 'watch'])
  }
  ```
### gulp的使用

#### 创建项目目录并进入

```shell
mkdir gulp-sample & cd gulp sample
```

#### 在项目目录下创建 package.json 文件

```shell
npm init -y
```

#### 安装 gulp，作为开发时依赖项

```shell
npm install --save-dev gulp
```

#### 创建 gulpfile 文件

在项目大的根目录下创建一个名为 gulpfile.js 的文件，并在文件中输入以下内容：

```js
/***
 *
 * gulp的入口文件
 *
 */

exports.foo = function (done) {
	console.log('foo')
	done()
}

exports.default = function (done) {
	console.log('default task')
	done()
}

// gulp4.0之前注册任务

const gulp = require('gulp')

gulp.task('baz', function (done) {
	console.log('baz')
	done()
})
```

* gulp的任务默认时异步执行的，需要调用done()去告诉gulp这个任务结束了。
* gulp4.0之前注册任务需要使用gulp.task()方法

#### 测试

```shell
npx gulp default foo baz
```

* gulp后面可以接多个任务名称，如果只想执行default任务，可以省略default。

#### gulp的组合任务

* gulp使用 `series()` 和 `parallel()` 来创建组合任务。

```js
const { series, parallel } = require('gulp')

function foo(done) {
	console.log('foo task')
	done()
}

function baz(done) {
	console.log('foo task')
	done()
}
// 串行任务
exports.task1 = series(foo, baz)

exports.task2 = parallel(foo, baz)
```

#### 测试

执行task1任务，可以看到foo执行完成后baz才开始执行

```shell
$ npx gulp task1
[17:23:40] Using gulpfile ~/js-code/auto-build/gulp-sample/gulpfile.js
[17:23:40] Starting 'task1'...
[17:23:40] Starting 'foo'...
foo task
[17:23:40] Finished 'foo' after 598 μs
[17:23:40] Starting 'baz'...
foo task
[17:23:40] Finished 'baz' after 273 μs
[17:23:40] Finished 'task1' after 2.42 ms
```

执行task2任务，可以看到foo启动后baz也开始启动

```shell
$ npx gulp task2
[17:27:49] Using gulpfile ~/js-code/auto-build/gulp-sample/gulpfile.js
[17:27:49] Starting 'task2'...
[17:27:49] Starting 'foo'...
[17:27:49] Starting 'baz'...
foo task
[17:27:49] Finished 'foo' after 860 μs
foo task
[17:27:49] Finished 'baz' after 1.07 ms
[17:27:49] Finished 'task2' after 2.25 ms
```

#### gulp的异步任务

gulp中所有任务都是异步执行的，任务结束后如何通知gulp这个任务接受了 ，常用的有下面几种方式

* 执行回调函数

```js

exports.callback = function (done) {
	console.log('done task')
	done()
}

exports.callback_error = function (done) {
	console.log('done task')
	done(new Error('task failed'))
}
```

当任务执行失败时可以通过回调函数传递一个错误给gulp.

* 使用promise的方式

```js
exports.promise = function () {
	console.log('promise task')
	//  传递的值会被忽略
	return Promise.resolve('helo')
}

exports.promise_error = function () {
	console.log('promise task')
	//  传递的值会被忽略
	return Promise.reject(new Error('task failed'))
}

```

传递给成功的Promise值会被忽略，传递给失败的promise的值会传递给gulp.

* await

```js
exports.await = async function () {
	console.log('await done')
	await Promise.resolve()
}
```

当promise变成成功状态下，是通知gulp任务接受

* 返回一个流的方式

```js

exports.stream = function () {
	const readStream = fs.createReadStream('package.json')
	const writeStream = fs.createWriteStream('temp.txt')
	readStream.pipe(writeStream)
	return readStream
}

exports.stream = function (done) {
	const readStream = fs.createReadStream('package.json')
	const writeStream = fs.createWriteStream('temp.txt')
	readStream.pipe(writeStream)
	readStream.on('end', function () {
		done()
	})
}
```

返回流的方式实质上和gulp自己监听流的end事件，当流的end时间被触发的时候，调用done通知gulp().

### gulp的核心工作原理

gulp是一个基于流的自动构建工具,它的工作原理就是读取文件到文件流，然后对文件流做转化操作，最终要文件流写入到目标文件中。

![gulp的工作原理](/frontEnd/gulp.png)

例如我们需要压缩一个cssw文件,假如我们手动操作的过程，就是复制这个文件到一个可以压缩css的文件的网站对css压缩的结果复制到一个新的文件中。

我们使用gulp来完成这个工作。

```js
/**
 *
 * 使用gulp来压缩css文件
 *
 */
const fs = require('fs')
const { Transform } = require('stream')
exports.miniCss = function () {
	// 读取css文件

	const read = fs.createReadStream('./normalize.css')

	//创建一个转换流对流的内容做修改

	const myTransform = new Transform({
		transform(chunk, encoding, callback) {
			// 对流的内容做修改
			const output = chunk
				.toString()
				.replace(/\s+/g, '')
				.replace(/\/\*.+?\*\//g, '')
			callback(null, output)
		}
	})

	const write = fs.createWriteStream('./normalize.min.css')
	read.pipe(myTransform).pipe(write)
	return read
```

### gulp中关系文件的API

* [src(globs, [options])](https://www.gulpjs.com.cn/docs/api/src/)
  * 创建一个可读流，用于从文件系统读取 [Vinyl](https://www.gulpjs.com.cn/docs/api/concepts#vinyl) (Vinyl 是描述文件的元数据对象)对象。
  * globs可以是一个字符串，也可以是一个字符串数组。
  * gobs的字符串可以包含通配符，如`src/*.css`代表src文件下的所有css文件
* [dest(directory, [options])](https://www.gulpjs.com.cn/docs/api/dest/)
  * 创建一个用于将 [Vinyl](https://www.gulpjs.com.cn/docs/api/concepts#vinyl) 对象写入到文件系统的写入流。
  * directory可以是一个代表写入文件的输出目录的路径字符串，也可以是一个函数。如果使用一个函数，该函数将与每个 Vinyl 对象一起调用，并且必须返回一个字符串目录路径。

使用gulp提供的api完成对css文件的压缩构建

```js

/**
 *
 * 使用gulp提供的文件相关的api
 *
 */

const { src, dest } = require('gulp')
const clean = require('gulp-clean-css')
const rename = require('gulp-rename')
exports.miniCss = function () {
	//clean是一个转换流，用于css的压缩
	// rename也是一个转换流，用于修改文件名(文件的元信息)
	return src('./normalize.css')
		.pipe(clean())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(dest('dist'))
}
```

### 使用gulp构架一个web项目

```shell
gulp-build-demo/
├── .gitignore
├── LICENSE
├── README.md
├── gulpfile.js
├── package.json
├── public
│   └── favicon.ico
└── src
    ├── about.html
    ├── assets
    │   ├── fonts
    │   │   ├── pages.eot
    │   │   ├── pages.svg
    │   │   ├── pages.ttf
    │   │   └── pages.woff
    │   ├── images
    │   │   ├── brands.svg
    │   │   └── logo.png
    │   ├── scripts
    │   │   └── main.js
    │   └── styles
    │       ├── _icons.scss
    │       ├── _variables.scss
    │       ├── demo.scss
    │       └── main.scss
    ├── features.html
    ├── index.html
    ├── layouts
    │   └── basic.html
    └── partials
        ├── footer.html
        ├── header.html
        └── tags.html

```

我们需要使用gulp对src目录下的的样式、脚本、页面、图片等文件做构建处理。

#### 安装gulp的依赖

```shell
npm install --save-dev gulp
```

#### 使用gulp-sass插件对样式文件做处理

```shell
npm install node-sass gulp-sass --save-dev
```

#### 配置gulpfile.js文件

```js

const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')

const data = {
	menus: [
		{
			name: 'Home',
			icon: 'aperture',
			link: 'index.html'
		},
		{
			name: 'Features',
			link: 'features.html'
		},
		{
			name: 'About',
			link: 'about.html'
		},
		{
			name: 'Contact',
			link: '#',
			children: [
				{
					name: 'Twitter',
					link: 'https://twitter.com/w_zce'
				},
				{
					name: 'About',
					link: 'https://weibo.com/zceme'
				},
				{
					name: 'divider'
				},
				{
					name: 'About',
					link: 'https://github.com/zce'
				}
			]
		}
	],
	pkg: require('./package.json'),
	date: new Date()
}

function styles() {
	//由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
	return src('src/assets/styles/*.scss', { base: 'src' }).pipe(sass({ outputStyle: 'expanded' })).pipe(dest('dist'))
}

module.exports = {
	styles
}
```

* 由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
* scss编译的时候会忽略以_开头的文件
* sass函数中的`outputStyle: 'expanded' `可以解决css结束标签不换行的问题

```css
.icon-aperture:before {
  content: '\e900'; }

.icon-aperture:before {
  content: '\e900';
}
```

#### 测试

```shell
$ npx gulp styles
[22:17:13] Using gulpfile ~/js-code/auto-build/gulp-build-demo/gulpfile.js
[22:17:13] Starting 'styles'...
[22:17:13] Finished 'styles' after 25 ms
```

#### 使用gulp-babel转换ES语法，安装依赖

```shell
npm install --save-dev gulp-babel @babel/core @babel/preset-env
```

#### 在gulpfile.js中加入下面的内容

```js
// 处理js脚本
function scripts() {
	return src('src/assets/scripts/*.js', { base: 'src' })
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(dest('dist'))
}

//处理html文件
module.exports = {
	styles,
	scripts
}
```

#### 测试

```shell
$ npx gulp scripts
[22:28:03] Using gulpfile ~/js-code/auto-build/gulp-build-demo/gulpfile.js
[22:28:03] Starting 'scripts'...
[22:28:03] Finished 'scripts' after 339 ms
```

#### 使用gulp-swim处理html模版文件

```html
{% set current = 'about' %}
{% extends 'layouts/basic.html' %}

{% block body %}
<main class="site-main" role="main">

  <section class="jumbotron text-center">
    <div class="container">
      <h1 class="jumbotron-heading">ABOUT ME</h1>
      <p class="lead text-muted">MAKE IT BETTER!</p>
      <p>
        <a href="{{ pkg.author.url }}" class="btn btn-secondary my-3">Follow me</a>
      </p>
    </div>
  </section>

  <div class="py-5 bg-light">
    <div class="container text-center">
      <img class="img-fluid w-50" src="assets/images/logo.png" alt="{{ pkg.name }}'s logo">
    </div>
  </div>

</main>
{% endblock %}
```

#### 安装gulp-swim的依赖

```shell
npm install --save-dev gulp-swig
```

#### 修改gulpfile.js文件

```js
const data = {
	menus: [
		{
			name: 'Home',
			icon: 'aperture',
			link: 'index.html'
		},
		{
			name: 'Features',
			link: 'features.html'
		},
		{
			name: 'About',
			link: 'about.html'
		},
		{
			name: 'Contact',
			link: '#',
			children: [
				{
					name: 'Twitter',
					link: 'https://twitter.com/w_zce'
				},
				{
					name: 'About',
					link: 'https://weibo.com/zceme'
				},
				{
					name: 'divider'
				},
				{
					name: 'About',
					link: 'https://github.com/zce'
				}
			]
		}
	],
	pkg: require('./package.json'),
	date: new Date()
}
//处理html文件

function pages() {
	// data是模版数据的填充
	return src('src/*.html').pipe(swig(data)).pipe(dest('dist'))
}

module.exports = {
	styles,
	scripts,
	pages
}

```

#### 测试

```shell
$ npx gulp pages
[22:40:32] Using gulpfile ~/js-code/auto-build/gulp-build-demo/gulpfile.js
[22:40:32] Starting 'pages'...
```

#### 让上面的三个任务同时执行

```js

const compile = parallel(styles, scripts, pages)

module.exports = {
	compile
}
```

#### 测试

```shell
$ npx gulp compile
[22:44:25] Using gulpfile ~/js-code/auto-build/gulp-build-demo/gulpfile.js
[22:44:25] Starting 'compile'...
[22:44:25] Starting 'styles'...
[22:44:25] Starting 'scripts'...
[22:44:25] Starting 'pages'...
[22:44:25] Finished 'scripts' after 483 ms
[22:44:25] Finished 'pages' after 485 ms
[22:44:25] Finished 'styles' after 486 ms
[22:44:25] Finished 'compile' after 487 ms
```




















​    

  

  

​    

​    

​    

  

  

  

  

  

  

  

  

​    

​    

​    




























