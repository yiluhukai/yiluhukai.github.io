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











