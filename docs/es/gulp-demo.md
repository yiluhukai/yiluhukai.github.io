## 使用gulp构建一个web项目

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
	return src('src/*.html',{ base: 'src' }).pipe(swig(data)).pipe(dest('dist'))
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

#### 处理图片和字体文件

对图片和字体文件的处理主要是压缩他们的大小。这块可以使用gulp-imagemin.

安装gulp-imagemin的依赖：

```shell
npm install --save-dev gulp-imagemin
```

在gulpfile.js中加入对应的配置

```js
// 压缩图片文件

function images() {
	return src('src/assets/images/**',{ base: 'src' }).pipe(imagemin()).pipe(dest('dist'))
}
//  处理字体文件
function fonts() {
	return src('src/assets/fonts/**',{ base: 'src' }).pipe(imagemin()).pipe(dest('dist'))
}

const compile = parallel(styles, scripts, pages, images, fonts)
```

* 上面的**可以匹配文件下的所有文件

#### 复制public下的文件

不用对public下的文件做处理，直接复制到dist目录下，由于这个任务只是单纯的复制，所以我们把它单独作为一个任务。

```js
function extra() {
	return src('public/**', { base: 'public' }).pipe(dest('dist'))
}

// module.exports = {
// 	styles,
// 	scripts,
// 	pages
// }

const compile = parallel(styles, scripts, pages, images, fonts)

const build = parallel(compile, extra)
module.exports = {
	build
}
```

#### 清除dist目录下的文件

每次构建前我们需要去清除dist目录下的剩余文件。可以使用一个库叫del.

```shell
npm install -D del
```

在gulpfile中加入下面的内容

```js
const del = require('del')
// 删除dist目录下面的文件

function clean() {
	// 返回的是一个promise
	return del(['dist'])
}

// module.exports = {
// 	styles,
// 	scripts,
// 	pages
// }

const compile = parallel(styles, scripts, pages, images, fonts)

const build = series(clean, parallel(compile, extra))

module.exports = {
	build
}
```

#### 自动加载插件

我们每次都需要引入gulp-*的插件，这个样子当插件比较多的时候比较麻烦，我们可以使用gulp-load-plugins插件。gulp-load-plugin会帮你将插件的名称转换成小驼峰的形式。

安装插件

```shell
npm install -D gulp-load-plugins
```

修改gulp file.js文件插件sass替换成plugins.sass,

```js
const sass = require('gulp-sass')
function styles() {
	//由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
	return src('src/assets/styles/*.scss', { base: 'src' })
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(dest('dist'))
}
```

替换成

```js
const plugins = require('gulp-load-plugins')()
function styles() {
	//由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
	return src('src/assets/styles/*.scss', { base: 'src' })
		.pipe(plugins.sass({ outputStyle: 'expanded' }))
		.pipe(dest('dist'))
}
```

其他的类似插件和gulp-sass类似

#### 构建一个开发服务器

我们在开发阶段希望更高的东西在浏览器中立马生效，所以我们需要一个开发服务器，可以使用browser-sync去创建一个开发服务器。我们首先安装依赖

```shell
npm install --save-dev browser-sync
```

我们希望讲这个服务集成到gulp的serve任务中

```js
const bs = require('browser-sync').create()

// 创建一个开发服务器
function serve() {
	bs.init({
		server: {
			//制定对那些文件启动静态服务
			baseDir: './dist'
		}
	})
}
module.exports = {
	build,
	serve
}
```

我们发现html中的一些文件从node_modules下面去获取样式文件(这些依赖在package.json的依赖中，需要先安装下)，而我们只对dist目录启用了静态服务，这个时候，我们的样式文件是取不到的。我们可以给server添加一个路由选项:

```shell
routes: {
        "/bower_components": "bower_components"
}
```

着样子我们就可以获取node_modules下的样式和脚本。

bs.init()还可以接受其他的选项

```js
// 创建一个开发服务器
function serve() {
	bs.init({
		server: {
			//制定对那些文件启动静态服务
			baseDir: './dist',
			routes: {
				'/node_modules': 'node_modules'
			}
		},
		//	制定端口
		port: 3000,
		// 是否在浏览器直接打开
		open: true,
		// 是否显示服务器启动时候的提示信息
		notify: false,
		// 添加那些文件的变化
		files: 'dist/**'
	})
}
```

现在我们可以修改dist目录下的文件，可以看到会重新加载。但是我们开发的时候修改的是src下的文件。所以我们可以使用gulp提供的`watch`api来检测文件的变化。

```js
function serve() {
	watch('src/assets/styles/*.scss', styles)
	watch('src/assets/scripts/*.js', scripts)
	watch('src/*.html', pages)
	watch('src/assets/images/**', images)
	watch('src/assets/fonts/**', fonts)
	watch('public/**', extra)
	bs.init({
		server: {
			//制定对那些文件启动静态服务
			baseDir: './dist',
			routes: {
				'/node_modules': 'node_modules'
			}
		},
		//	制定端口
		port: 3000,
		// 是否在浏览器直接打开
		open: true,
		// 是否显示服务器启动时候的提示信息
		notify: false,
		// 添加那些文件的变化
		files: 'dist/**'
	})
}
```

这样子我们就可以修改src下的文件让服务器去重新加载，但是对于图片和字体文件等，在生产环境中我们不需要每次改变都去构建，这样子可以进少构建的次数。

> 如果修改html页面没有刷新，可以是因为swig模版的缓存问题，需要在swig插件的选项中加入cache:false的设置。

```js
// 创建一个开发服务器
function serve() {
	watch('src/assets/styles/*.scss', styles)
	watch('src/assets/scripts/*.js', scripts)
	watch('src/*.html', pages)
	// watch('src/assets/images/**', images)
	// watch('src/assets/fonts/**', fonts)
	// watch('public/**', extra)
	bs.init({
		server: {
			//制定对那些文件启动静态服务
			baseDir: ['dist', 'src', 'public'],
			routes: {
				'/node_modules': 'node_modules'
			}
		},
		//	制定端口
		port: 3000,
		// 是否在浏览器直接打开
		open: true,
		// 是否显示服务器启动时候的提示信息
		notify: false,
		// 添加那些文件的变化
		files: 'dist/**'
	})
}
```

server加载的文件先去dist下目录下面找，找不到再去后面的目录下查找。这样子就减少对静态资源问价的构建。此外我们需要加构建任务根据环境划分，开发的过程中我们只需要compile任务和serve任务。

```js
const compile = parallel(styles, scripts, pages)

const build = series(clean, parallel(compile, images, fonts, extra))

const develop = series(clean, compile, serve)

module.exports = {
	build,
	serve,
	develop
}
```

我们还需要在修改图片、字体等资源文件下刷新页面，可以这么实现

```js
watch(['src/assets/images/**', 'src/assets/fonts/**', 'public/**'], bs.reload)
```

如果我们不想使用bs.init()中files去检测文件的变化，我们还可以使用流的方式让页面去重新加载 。

```js
const bs = require('browser-sync').create()
function styles() {
	//由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
	return src('src/assets/styles/*.scss', { base: 'src' })
		.pipe(plugins.sass({ outputStyle: 'expanded' }))
		.pipe(dest('dist')).pipe(bs.reload({stream:true}))
}

```

#### 处理生产环境的路径问题

```html
 <!-- build:css assets/styles/vendor.css -->
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  <!-- endbuild -->
  <!-- build:css assets/styles/main.css -->
  <link rel="stylesheet" href="assets/styles/main.css">
  <!-- endbuild -->
```

我们在开发环境中/node_modules下的文件的处理方式是配置一个新的路由，去node_modules文件下找。

```js
routes: {
				'/node_modules': 'node_modules'
}
```

但是当我们在生产环境去使用的时候这些文件是找不到的，最简单的方式对这些文件也以gulp任务的方式copy出来。我们还可以使用gulp-useref插件处理这些问题，gulp-use-ref主要html中的构建注释操作做处理，将注释内引用的资源文件copy到注释中制定的文件中，可以对多个文件做合并操作。

```shell
npm install --save-dev gulp-useref
```

使用gulp-useref插件

```js
// 使用gulp-load-plugins自动加载插件
//const useref = require('gulp-useref');


// 使用gulp-useref处理文件的路径
function useref() {
	// 对构建后的html文件做处理，
	return (
		src('dist/*.html', { base: 'dist' })
			// 搜索引用文件的路径
			.pipe(plugins.useref({ searchPath: ['dist', '.'] }))
			// 处理后的文件有html、js、css三部分，开始路径和目标路径一样可能会导致文件写入不进去的问题，所以又该目标路径为release
			.pipe(dest('release'))
	)
}
```

gulp-useref配合gulp-if、gulp-uglify、gulp-clean-css可以实现对文件压缩操作

```shell
npm install --dev-save gulp-if gulp-uglify gulp-clean-css gulp-htmlmin
```

使用插件压缩文件

```js

// 使用gulp-useref处理文件的路径
function useref() {
	// 对构建后的html文件做处理，
	return (
		src('dist/*.html', { base: 'dist' })
			// 搜索引用文件的路径
			.pipe(plugins.useref({ searchPath: ['dist', '.'] }))
			// 压缩文件
			.pipe(plugins.if('*.js', plugins.uglify()))
			.pipe(plugins.if('*.css', plugins.cleanCss()))
			.pipe(plugins.if('*.html', plugins.htmlmin({ collapseWhitespace: true, minifyCss: true, minifyJs: true })))
			// 处理后的文件有html、js、css三部分，开始路径和目标路径一样可能会导致文件写入不进去的问题，所以又该目标路径为release
			.pipe(dest('release'))
	)
}
```

修改目录结构，之前我们把构建完成的代码放在了dist目录下面，useref后代码移动到了release目录下，这不是我们期望的，我们可以把原本放在dist目录下的文件先放到temp目录下面，最后的所有的文件在用useref任务构建到dist目录下面，然后在clean任务中加入对temp的删除，同时我们需要将useref任务加入到build中，这个任务是要对compile后的内容做处理，所以要和compile串行。最终的文件如下：


```js
cxx  onst { src, dest, parallel, series, watch } = require('gulp')
const bs = require('browser-sync').create()
const plugins = require('gulp-load-plugins')()
const del = require('del')

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
// 处理scss
function styles() {
	//由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
	return src('src/assets/styles/*.scss', { base: 'src' })
		.pipe(plugins.sass({ outputStyle: 'expanded' }))
		.pipe(dest('temp'))
		.pipe(bs.reload({ stream: true }))
}
// 处理js脚本
function scripts() {
	return src('src/assets/scripts/*.js', { base: 'src' })
		.pipe(plugins.babel({ presets: ['@babel/env'] }))
		.pipe(dest('temp'))
		.pipe(bs.reload({ stream: true }))
}

//处理html文件

function pages() {
	// data是模版数据的填充
	return src('src/*.html', { base: 'src' })
		.pipe(plugins.swig({ data, cache: false }))
		.pipe(dest('temp'))
		.pipe(bs.reload({ stream: true }))
}

// 压缩图片文件

function images() {
	return src('src/assets/images/**', { base: 'src' }).pipe(plugins.imagemin()).pipe(dest('dist'))
}
//  处理字体文件
function fonts() {
	return src('src/assets/fonts/**', { base: 'src' }).pipe(plugins.imagemin()).pipe(dest('dist'))
}

// 复制public 的文件
function extra() {
	return src('public/**', { base: 'public' }).pipe(dest('dist'))
}

// 删除dist目录下面的文件

function clean() {
	// 返回的是一个promise
	return del(['dist', 'temp'])
}

// 使用gulp-useref处理文件的路径
function useref() {
	// 对构建后的html文件做处理，
	return (
		src('temp/*.html', { base: 'temp' })
			// 搜索引用文件的路径
			.pipe(plugins.useref({ searchPath: ['temp', '.'] }))
			// 压缩文件
			.pipe(plugins.if('*.js', plugins.uglify()))
			.pipe(plugins.if('*.css', plugins.cleanCss()))
			.pipe(plugins.if('*.html', plugins.htmlmin({ collapseWhitespace: true, minifyCss: true, minifyJs: true })))
			// 处理后的文件有html、js、css三部分，开始路径和目标路径一样可能会导致文件写入不进去的问题，所以又该目标路径为release
			.pipe(dest('dist'))
	)
}

// 创建一个开发服务器
function serve() {
	watch('src/assets/styles/*.scss', styles)
	watch('src/assets/scripts/*.js', scripts)
	watch('src/*.html', pages)
	watch(['src/assets/images/**', 'src/assets/fonts/**', 'public/**'], bs.reload)
	bs.init({
		server: {
			//制定对那些文件启动静态服务
			baseDir: ['temp', 'src', 'public'],
			routes: {
				'/node_modules': 'node_modules'
			}
		},
		//	制定端口
		port: 3000,
		// 是否在浏览器直接打开
		open: true,
		// 是否显示服务器启动时候的提示信息
		notify: false
		// 添加那些文件的变化
		// files: 'dist/**'
	})
}
const compile = parallel(styles, scripts, pages)

const build = series(clean, parallel(series(compile, useref), images, fonts, extra))

const develop = series(clean, compile, serve)

module.exports = {
	build,
	serve,
	develop,
	useref,
	clean
}
```

#### 删除gulpfile中不需要到处的任务

```js
module.exports = {
	build,
	develop
}
```

为了便于使用，使用可以把这几个命令加入到package.json的`scripts`中。

```js
	"scripts": {
		"build": "gulp build",
		"develop": "gulp develop"
	},
```

这样子我们只需要看package.json文件就可以知道如何使用这个自动化的构建工具了。

#### 自动化工作流的复用

上面我们通过gulp创建了一个web项目中常见的自动化构建任务的工作流，我们希望这个工作流可以在其他的项目中服用，如果通过代码粘贴的方式去复用，后续的构建流程修改、依赖修改等升级操作也需要手动去每个项目中修改。我们知道我们这个自动化的构建任务是由gulp提供的构建平台，gulpfile.js中是对构建的任务配置。

![gulp工作流](/frontEnd/workflow.png)

我们可以将gulp的配置文件和依赖封装成一个npm包去使用

![npm包](/frontEnd/gulp-npm.png)

当我们升级工作流中的内容，对应的项目只需要重新安装依赖即刻。

####  工作流的封装

安装一个脚手架去创建一个npm包的通用模版

```shell
npm install -g bruce-cli
```

使用脚手架去生成npm包的通用文件

```shell
zce init nm bruce-page
```

项目的基础结构

```shell
bruce-gulp-workflow
├── CHANGELOG.md
├── LICENSE
├── README.md
├── lib
│   └── index.js
├── package.json
├── test
│   └── bruce-gulp-workflow.test.js
└── yarn.lock
```

将脚手架项目上传到github的仓库中

```shell
cd bruce-page & yarn
git add .
git commit -m "init npm"
git remote add origin https://github.com/yiluhukai/bruce-page.git
git push -u origin master
```

提取前面项目中的gulpfile到我们包根目录下的`lib/index.js`文件中,并将之前项目的`开发依赖`复制到我们这个包的`依赖`中,如果放到开发依赖中这个包在被引用的时候会找不到依赖。

```json
"dependencies": {
    "@babel/core": "^7.13.8",
    "@babel/preset-env": "^7.13.8",
    "browser-sync": "^2.26.14",
    "del": "^5.1.0",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^4.3.0",
    "gulp-htmlmin": "^5.0.1",
    "gulp-if": "^3.0.0",
    "gulp-imagemin": "^6.2.0",
    "gulp-load-plugins": "^2.0.6",
    "gulp-sass": "^4.1.0",
    "gulp-swig": "^0.9.1",
    "gulp-uglify": "^3.0.2",
    "gulp-useref": "^3.1.6"
  },
```

当我们项目还没有发布的时候，我们需要去测试这个包，我们可以将这个包link成全局的包，然后在需要使用的项目再link进去，这样就会创建一个只想这个包的软连接，在项目中测试使用。

```shell
cd bruce-gulp-workflow
# 会自动安装依赖
npm link
```

在我们之前的项目中删除原来的开发依赖和node_modules文件

```shell
cd gulp-build-demo

rm -rf node_modules

npm link bruce-gulp-workflow
# 出新安装依赖
npm install
```

修改 gulp-build-demo的gulp file.js文件

```js
module.exports = require('bruce-gulp-workflow')
```

然后执行`npm run build`.我们会发现缺少gulp模块，这时因为gulp模块的依赖被我们提到bruce-gulp-workflow中，由于这个包还没有发布，所以我们当前项目中不会安装这个包的依赖，当我们这个包发布了，这个依赖就会成为bruce-gulp-workflow的依赖而被安装。解决的办法是手动安装这个包。

```shell
gulp install -D gulp
```

继续执行发现这个找不到`package.json`文件

```shell
Error: Cannot find module './package.json'
Require stack:
- /Users/lijunjie/js-code/auto-build/bruce-gulp-workflow/lib/index.js
```

原因很简单，我们的发布的包的`lib/index.js`中引入的package.json的路径不对

```js
const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};
```

这里的data是作为项目中swig的模版而被导入的，不同的项目中这个会不同，更好的办法是将这个提取出去作为每个项目的配置项，我们在`gulp-build-demo `下创建一个配置文件`workflow.config.js`,导出上面的data.我们在`bruce-gulp-workflow`下的`lib/index.js`中读取对应的数据：

```js
//The process.cwd() method returns the current working directory of the Node.js process.
const cwd = process.cwd();
let data = {
  //default value
};
try {
  data = { ...data, ...require(path.join(cwd, "./workflow.config.js")) };
} catch (error) {}
```

> 当项目中的当前工作目录中不存在workflow.config.js文件，data使用的是默认值。

执行构建命令会发现报错，原因是`Cannot find module '@babel/preset-env'`

```shell
$ npx gulp build
[22:02:32] Using gulpfile ~/js-code/auto-build/gulp-build-demo/gulpfile.js
[22:02:32] Starting 'build'...
[22:02:32] The following tasks did not complete: build
[22:02:32] Did you forget to signal async completion?
/Users/lijunjie/js-code/auto-build/bruce-gulp-workflow/node_modules/async-done/index.js:18
    throw err;
    ^

Error [ERR_UNHANDLED_ERROR]: Unhandled error. ({
  uid: 8,
  name: 'scripts',
  branch: false,
  error: PluginError: Cannot find module '@babel/preset-env'
```

导致这个问题的原因很简单，因为我们构建任务是在执行的时候，会到项目的根目录下`gulp-build-demo `去查找这个模块，模块不存在就报错了。我们可以修改导入模块的方式,以`require`方式引入这个模块，让它去lib/index.js所在的目录下逐层向上去查找node_modules中是否存在这个模块。

```js
// 处理js脚本
function scripts() {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: [require("@babel/preset-env")] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
}
```

现在我们可以执行`npx gulp build`命令了。

> 因为我们只导出了两个任务，所以gulp无法获取lib/index..js中定义的其他的任务的名称，只能打印出当前执行的任务的名字。

将项目中的路径改为可以配置的：

```js
const cwd = process.cwd();

let data = {
  //default value
  //项目中文件的默认值
  build: {
    src: "src",
    dist: "dist",
    temp: "temp",
    public: "public",
    paths: {
      styles: "assets/styles/*.scss",
      scripts: "assets/scripts/*.js",
      pages: "*.html",
      fonts: "assets/fonts/**",
      images: "assets/images/**",
    },
  },
};
try {
  data = { ...data, ...require(path.join(cwd, "./workflow.config.js")) };
} catch (error) {}

// 处理scss
function styles() {
  //由 src() 生成的 Vinyl 实例是用 glob base 集作为它们的 base 属性构造的。当使用 dest() 写入文件系统时，将从输出路径中删除 base ，以保留目录结构。
  return src(data.build.paths.styles, { base: "src", cwd: data.build.src })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest(data.build.temp))
    .pipe(bs.reload({ stream: true }));
}
....

watch(data.build.paths.styles, { cwd: data.build.src }, styles);
  watch(data.build.paths.scripts, { cwd: data.build.src }, scripts);
  watch(data.build.paths.pages, { cwd: data.build.src }, pages);
  // watch('src/assets/images/**', images)
  // watch('src/assets/fonts/**', fonts)
  // watch('public/**', extra)
  watch(
    [
      path.join(data.build.src, data.build.paths.images),
      path.join(data.build.src, data.build.paths.fonts),
      path.join(data.build.public, "**"),
    ],
    bs.reload
 );
```

项目中的路径可以使用path.join()的方式拼接，还可以使用src()和watch()方法这只读取文件的目录，默认是的cwd是项目的根目录。如果我们想要修改路径，可以使用项目的`workflow.config.js`中配置。

我们的npm包封装基本完成了，但是我们每次使用这个包的时候，都需要在项目的根目录下去创建一个gulpfile.js文件，然后写入如下内容：	

```js
module.exports = require('bruce-gulp-workflow')
```

这样子会显得很多余，我们希望直接引入这个包不需要做任何的配置就可以使用。

```shell
cd gulp-build-demo
rm gulpfile.js
npm run build
```

执行上面的命令先删除了gulpfile.js.然后再去执行构建命令，这个时候会报错，找不到`No gulpfile found`.我们可以使用gulp的时候指定我们gulpfile.js的路径。

```shell
$ npx gulp --help    

Usage: gulp [options] tasks

选项：
  --help, -h              Show this help.                                 [布尔]
  --version, -v           Print the global and local gulp versions.       [布尔]
  --require               Will require a module before running the gulpfile.
                          This is useful for transpilers but also has other
                          applications.                                 [字符串]
  --gulpfile, -f          Manually set path of gulpfile. Useful if you have
                          multiple gulpfiles. This will set the CWD to the
                          gulpfile directory as well.                   [字符串]
  --cwd                   Manually set the CWD. The search for the gulpfile, as
                          well as the relativity of all requires will be from
                          here.                                         [字符串]
  --verify                Will verify plugins referenced in project's
                          package.json against the plugins blacklist.
  --tasks, -T             Print the task dependency tree for the loaded
                          gulpfile.                                       [布尔]
  --tasks-simple          Print a plaintext list of tasks for the loaded
                          gulpfile.                                       [布尔]
  --tasks-json            Print the task dependency tree, in JSON format, for
                          the loaded gulpfile.
  --tasks-depth, --depth  Specify the depth of the task dependency tree.  [数字]
  --compact-tasks         Reduce the output of task dependency tree by printing
                          only top tasks and their child tasks.           [布尔]
  --sort-tasks            Will sort top tasks of task dependency tree.    [布尔]
  --color                 Will force gulp and gulp plugins to display colors,
                          even when no color support is detected.         [布尔]
  --no-color              Will force gulp and gulp plugins to not display
                          colors, even when color support is detected.    [布尔]
  --silent, -S            Suppress all gulp logging.                      [布尔]
  --continue              Continue execution of tasks upon failure.       [布尔]
  --series                Run tasks given on the CLI in series (the default is
                          parallel).                                      [布尔]
  --log-level, -L         Set the loglevel. -L for least verbose and -LLLL for
                          most verbose. -LLL is default.                  [计数]
```

我们输入如下指令执行

```shell
$ npx gulp -f node_modules/bruce-gulp-workflow/lib/index.js  build  
[21:27:10] Working directory changed to ~/js-code/auto-build/gulp-build-demo/node_modules/bruce-gulp-workflow/lib
[21:27:11] Using gulpfile ~/js-code/auto-build/gulp-build-demo/node_modules/bruce-gulp-workflow/lib/index.js
[21:27:11] Starting 'build'...
[21:27:11] Starting 'clean'...
[21:27:11] Finished 'clean' after 6.48 ms
[21:27:11] Starting 'images'...
[21:27:11] Starting 'fonts'...
[21:27:11] Starting 'extra'...
[21:27:11] Starting 'styles'...
[21:27:11] Starting 'scripts'...
[21:27:11] Starting 'pages'...
[21:27:11] gulp-imagemin: Minified 0 images
[21:27:11] Finished 'images' after 625 ms
[21:27:11] gulp-imagemin: Minified 0 images
[21:27:11] Finished 'fonts' after 627 ms
[21:27:11] Finished 'extra' after 628 ms
[21:27:11] Finished 'styles' after 559 ms
[21:27:11] Finished 'scripts' after 559 ms
[21:27:11] Finished 'pages' after 560 ms
[21:27:11] Starting 'useref'...
[21:27:11] Finished 'useref' after 158 ms
[21:27:11] Finished 'build' after 798 ms
```

我们发现命令可以执行，但是工作目录改变成了`~/js-code/auto-build/gulp-build-demo/node_modules/bruce-gulp-workflow/lib`,并不是我们想要的当前命令行执行的目录，我们可以使用cwd选项去指定我们的工作目录。

```shell
 npx gulp -f node_modules/bruce-gulp-workflow/lib/index.js --cwd .  build 
```

我们可以直接修改项目目录下package.json中的`scripts`为上面的命令，但是这样子每次导出包都要加入这个命令，这样子并不是我们想要的。我们使用`npx gulp`命令的时候，其实会去当前node_modules下面的gulp包中查找bin下面的文件。

```js
#!/usr/bin/env node

require('gulp-cli')();
```

可以看到执行gulp命令回去调用gulp-cli模块。我们想在我们的npm包中创建一个cli程序，去调用gulp命令并传入参数。首先我们需要在我们的包中创建bin/cli.js文件。

```js
#!/usr/bin/env node

//
process.argv.push("-f");
// 使用main指向的路径
//process.argv.push(require.resolve(".."));
process.argv.push(require.resolve("../lib/index"));

process.argv.push("--cwd");
process.argv.push(process.cwd());
// 调用gulp
require("gulp/bin/gulp");
```

然后在package.json加入如下的内容：

```js
"bin": "bin/cli.js",
```

然后执行命令：

```shell
cd bruce-gulp-workflow 
npm link
bruce-gulp-workflow build
```

如果可以成功，那么证明我们的cli没有问题，在去项目的根目录下面执行

```shell
cd gulp-build-demo 
bruce-gulp-workflow build
```

现在我们我的npm包可以直接全局安装后使用，也可以安装成依赖后使用`npm script`调用。

#### 发布我们的包到npm 

```shell
git add .
git commit -m "finish"
git push 
#切换镜像
nrm use npm 
# 发布
npm publish
# 切换镜像
nrm use taobao
```

包发布后使用淘宝镜像可能找不到包，原因是npm包未同步到淘宝镜像上，可以手动去淘宝镜像同步。

#### 在项目中使用我们发布的包

```shell
cd  gulp-build-demo 
rm -rf node_modules
npm install -D bruce-gulp-workflow
npm i
```

修改package.json文件

```json
"scripts": {
		"build": "bruce-gulp-workflow build",
		"develop": "bruce-gulp-workflow develop"
	},
```

然后执行build命令开始构建

```shell
npm run build
```























