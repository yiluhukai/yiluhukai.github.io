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






























