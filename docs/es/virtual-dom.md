#### 虚拟dom

#####  什么是虚拟dom

* 真实的`dom`
  * `document.querySelector("#app")`
  * 真实的`dom`上会存在很多的属性和方法

```js
const el = document.querySelector("#app")
undefined
let s =""
undefined
for (const key in el){ console.log( s+=`${key},`  ) }
// 输出一个很长的字符串
```

* 虚拟`dom`
  * 虚拟`dom`本质上是用一个`JavaScript`对象来描述真实的`dom`对象

```js
{
  sel:'div',
  data: {},
  children:undefined,
  text:"hello",
  ele: undefined,
  key: undefined  
}
```

* 所以创建一个虚拟`dom`比创建一个真实的`dom`的成本要小

##### 为什么需要虚拟`dom`

前端开发的过程：

* 使用`js`操作`dom`和数据来维护视图，需要考虑兼容性问题
* 使用`jQuery`操作`dom`和数据来维护视图,解决浏览器兼容性的问题
* MVVM框架的出现解决了视图和状态同步的问题
* MVVM框架本质上是基于模版引擎的，如果没有虚拟`dom`,没法跟踪状态(每次状态变化都要销毁重新渲染)
* 参考`github`上的`virtual-dom`的动机描述：
  * 虚拟`dom`可以维护程序的状态，跟踪上一次的状态
  * 通过比较前后两次状态差异更新真实`dom`

##### 虚拟`dom`的作用

* 维护视图和状态的关系
* 复杂的情况下可以提高渲染性能(简单情况下初次渲染因为需要创建虚拟`dom`会更慢)
* 跨平台
  * 浏览器端渲染`dom`
  * 服务器端渲染`ssr`(`Nuxt.js`和`Next.js`)
  * 原生应用(`Weex`,`RN`)
  * 小程序(`mpvue`和`uni-app`)

##### 虚拟`dom`库

* `Snabbdom`
  * `Vue2.X`内部的虚拟`dom`是改良的`Snabbdom`
  * 核心代码大约200行
  * 通过模块可扩展
  * 源码使用`TypeScript`开发
  * 最快的虚拟`dom`之一
  * [文档](https://github.com/snabbdom/snabbdom)
* `virtual-dom`

##### 使用虚拟dom

我们首先创建一个项目

```shell
mkdir snabbdom-demo & cd snabbdom-demo

npm init -y
# 使用parcel作为打包工具
npm install parcel-bundler -D
```

添加构建的命令在`package.json`中：

```js
"scripts": {
    "dev": "parcel index.html --open",
    "build":"parcel build index.html"
 },
```

项目结构：

```shell
├── index.html
├── package-lock.json
├── package.json
└── src
    └── 01-basicusage.js
```

`inde.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="./src/01-basicusage.js"></script>
</body>
</html>
```

导入`snabbdom`

```shell
npm install snabbdom@2.1.0
```

:::tip

使用parcel的自动导包功能，我们无须自己手动安装依赖，这里是为了指定版本。

:::

`01-basicusage.js`导入

```js
import { h } from "snabbdom/h";
import { init } from "snabbdom/init";  

const patch = init([]);

```

:::tip

`h`函数是用来创建虚拟`dom`的，而`patch`函数是将虚拟`dom`转化成真实的`dom`的函数

:::

运行保错：

```shell
$ npm run dev

> snabbdom-demo@1.0.0 dev /Users/lijunjie/js-code/virtual-dom/snabbdom-demo
> parcel index.html --open

Server running at http://localhost:1234 
🚨  /Users/lijunjie/js-code/virtual-dom/snabbdom-demo/src/01-basicusage.js:10:21: Cannot resolve dependency 'snabbdom/init'
   8 |  */
   9 | import { h } from "snabbdom/h";
> 10 | import { init } from "snabbdom/init";  
     |                     ^
  11 |
  12 | const patch = init([]);
```

查看`snabbdom`包，会发现我们的`h`和`init`都在`/build/package`下:

```js
  "exports": {
    "./init": "./build/package/init.js",
    "./h": "./build/package/h.js",
    "./helpers/attachto": "./build/package/helpers/attachto.js",
    "./hooks": "./build/package/hooks.js",
    "./htmldomapi": "./build/package/htmldomapi.js",
    "./is": "./build/package/is.js",
    "./jsx": "./build/package/jsx.js",
    "./modules/attributes": "./build/package/modules/attributes.js",
    "./modules/class": "./build/package/modules/class.js",
    "./modules/dataset": "./build/package/modules/dataset.js",
    "./modules/eventlisteners": "./build/package/modules/eventlisteners.js",
    "./modules/hero": "./build/package/modules/hero.js",
    "./modules/module": "./build/package/modules/module.js",
    "./modules/props": "./build/package/modules/props.js",
    "./modules/style": "./build/package/modules/style.js",
    "./thunk": "./build/package/thunk.js",
    "./tovnode": "./build/package/tovnode.js",
    "./vnode": "./build/package/vnode.js"
  },
```

:::warning

`exports`是`node12.x`开始支持的，`webpack4.x`和`parcel`并不能识别该字段，我们需要使用完整路径来导入。

:::

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

```

修改代码去使用这两个函数：

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数是元素的内容
const vNode = h("div#container.test","Hello world") 


// 第一个参数可以是旧的vNode，也可以是真实dom
// 第一个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
const oldVnode = patch(el,vNode)
```

获取将页面的元素替换成

```html
<div id="container" class="test">Hello world</div>
```

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数是元素的内容
const vNode = h("div#container.test","Hello world") 


// 第一个参数可以是旧的vNode，也可以是真实dom
// 第二个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
const oldVnode = patch(el,vNode)

// 继续更新节点

patch(oldVnode,h("div.xxx","Hello,Snabbsom"))
```

更新后的`dom`元素

```js
<div class="xxx">Hello,Snabbsom</div>
```

`h`函数的第二个参数还可以是子元素的数组，这些子元素可以是`vNode`:

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数可以是子元素
const vNode = h("div#container.test",[h("p","helo snabbdom"),h("h1","------")]) 

const el = document.querySelector('#app')

const oldVnode = patch(el,vNode)


setTimeout(()=>{
    const vNode = h("div#container.test",[h("p","helo world"),h("h1","zzzzz")]) 
    patch(oldVnode,vNode)
},2000)
```

`h`函数可以接受一个`!`作为参数，这样子可以创建一个注释节点：

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数可以是子元素
const vNode = h("div#container.test",[h("p","helo snabbdom"),h("h1","------")]) 

const el = document.querySelector('#app')

const oldVnode = patch(el,vNode)


setTimeout(()=>{
    // const vNode = h("div#container.test",[h("p","helo world"),h("h1","zzzzz")]) 
    // patch(oldVnode,vNode)
    // 替换成空的注释节点
    patch(oldVnode,h("!"))
},2000)
```

`2s`后元素的内容被替换成一个空注释：

```html
<!---->
```

##### snabbdom的模块

* `snabbdom`的作用
  * `snabbdom`核心库并不能处理`dom`元素的属性、样式和事件等。可以通过注册`snabbdom`默认提供的模块来实现
  * `snabbdom`中的模块可以用来扩展`snabbdom`的功能
  * `snabbdom`中的模块是通过注册全局的钩子函数来实现的
* 官方提供的模块
  * `attributes`:使用`setAttribute/removeAttribute`等标准`api`来设置`dom`的属性，支持`boolean`类型的属性
  * `props`通过给`dom`对象添加属性来实现的，不支持`boolean`类型的属性
  * `dataset`是用来给`dom`元素设置自定义属性(data-*)的.
  * `style`使用来给元素添加行内样式，且可以添加过渡动画
  * `class`可以元素添加便于切换的样式
  * `eventlisteners`给元素绑定事件
* `snabbdom`的使用
  * 导入需要使用的模块
  * `init`函数中注册模块
  * `h`函数的第二个参数处使用模块

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";

const patch = init([styleModule,eventListenersModule]);

// 第一个参数是元素的标签和选择器
// 第三个参数可以是子元素
const vNode = h("div#container.test", { style: { color: 'red' },on: { click: function(){  console.log('click')} } }, "hello world") 

const el = document.querySelector('#app')

const oldVnode = patch(el,vNode)
```

生成的真实`dom`:

```html
<div id="container" class="test" style="color: red;">hello world</div>
```

元素上有一个点击事件，这里没有体现。

##### 如何学习源码

* 宏观了解
* 带着目标看源码
* 看源码的过程要不求甚解
* 调试
* 参考资料

##### snabbdom的核心

* 使用`init`设置模块，创建`patch`函数
* 使用`h`函数创建虚拟`VNode`
* 使用`patch`函数比较两个新旧虚拟`dom`,将变化的内容更新成真实`dom`
  * 当`patch`函数的第一个参数不是虚拟`dom`时，会将它转成虚拟`dom`

##### snabbdom源码

* 源码地址
  * [github地址](https://github.com/snabbdom/snabbdom)
  * 当前版本[v3.0.3]
* 克隆代码
  * `git clone -b v2.1.0 --depth 1 https://github.com/snabbdom/snabbdom.git` 
  * 我们没有拉取最新的版本
  *  `-b <name>, --branch <name>`,`--depth <depth>`指定我们克隆的深度，这里只克隆最近的提交

##### `snabbdom的项目结构`

```shell
snabbdom
├── examples  //使用例子
│   ├── carousel-svg
│   ├── hero
│   ├── reorder-animation
│   └── svg
├── perf //性能测试
└── src	// 源码
    ├── package
    └── test
```

我们先来看`reorder-animation`(带有动画的列表)这个例子：

```shell
snabbdom/examples
├── carousel-svg
│   ├── README.md
│   ├── index.html
│   └── index.js
├── hero
│   ├── index.html
│   └── index.js
├── reorder-animation
│   ├── index.html
│   └── index.js
└── svg
    ├── index.html
    └── index.js
```

`index.js`:

```js
import { init } from '../../build/package/init.js'
import { classModule } from '../../build/package/modules/class.js'
import { propsModule } from '../../build/package/modules/props.js'
import { styleModule } from '../../build/package/modules/style.js'
import { eventListenersModule } from '../../build/package/modules/eventlisteners.js'
import { h } from '../../build/package/h.js'
```

例子中使用的依赖时从`snabbdom/build`中获取的，我们需要去手动编译

`snabbdom/package.json`:

```json
"scripts": {
    "mark-pr-head-as-trusted": "node --unhandled-rejections=strict mark-pr-head-as-trusted.cjs",
    "docs": "remark . --output",
    "check-clean": "git diff --exit-code",
    "lint:js": "eslint --ext .ts,.tsx,.cjs,.md,.mjs --ignore-path .gitignore .",
    "lint:editorconfig": "editorconfig-checker",
    "lint": "run-s lint:editorconfig lint:js",
    "unit": "cross-env FILES_PATTERN=\"test-bundles/unit/**/*.js\" karma start karma.conf.cjs",
    "benchmark": "cross-env FILES_PATTERN=\"test-bundles/benchmark/**/*.js\" karma start karma.conf.cjs --concurrency=1",
    "make-release-commit": "standard-version",
    "test": "run-s lint compile bundle-tests unit",
    "compile": "ttsc --build src/test/tsconfig.json",
    "bundle-tests": "webpack --config tests.webpack.config.cjs",
    "prepublishOnly": "npm run compile"
 }
```

```shell
cd snabbdom
npm install
npm run compile
```

编译完成后会生成一个`build`文件：

```js
.
├── build
├── examples
├── node_modules
├── perf
└── src
```

然后打开这个例子：

```shell
cd snabbdom 
serve .
```

然后在浏览器中找到`example/reorder-animation`：

:::tip

`serve`可以让我们快速创建一个`http`服务,需要`npm install -g serve`去安装

:::

例子中的删除和排序有问题：

```js

function remove (movie) {
  data = data.filter((m) => {
    return m !== movie
  })
  render()
}

function movieView (movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
  }, [
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', { on: { click: [remove, movie] } }, 'x'),
  ])
}
```

```js

function changeSort (prop) {
  sortBy = prop
  data.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1
    }
    if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  })
  render()
}
...
function view (data) {
  return h('div', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', { on: { click: add } }, 'Add'),
      'Sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', { class: { active: sortBy === 'rank' }, on: { click: [changeSort, 'rank'] } }, 'Rank'),
        h('a.btn.title', { class: { active: sortBy === 'title' }, on: { click: [changeSort, 'title'] } }, 'Title'),
        h('a.btn.desc', { class: { active: sortBy === 'desc' }, on: { click: [changeSort, 'desc'] } }, 'Description'),
      ]),
    ]),
    h('div.list', { style: { height: totalHeight + 'px' } }, data.map(movieView)),
  ])
}
```

原因是高版本中不支持这种方式绑定事件：我们可以修改成：

```js

function view (data) {
  return h('div', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', { on: { click: add } }, 'Add'),
      'Sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', { class: { active: sortBy === 'rank' }, on: { click: ()=> changeSort('rank') } }, 'Rank'),
        h('a.btn.title', { class: { active: sortBy === 'title' }, on: { click: ()=> changeSort('title') } }, 'Title'),
        h('a.btn.desc', { class: { active: sortBy === 'desc' }, on: { click:  ()=> changeSort('desc') } }, 'Description'),
      ]),
    ]),
    h('div.list', { style: { height: totalHeight + 'px' } }, data.map(movieView)),
  ])
}


function movieView (movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
  }, [
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', { on: { click: ()=> remove(movie) } }, 'x'),
  ])
}
```

`src`/package/*下的内容：

```shel
$ tree snabbdom/src/package 
snabbdom/src/package
├── h.ts  //创建虚拟dom的函数
├── helpers
│   └── attachto.ts
├── hooks.ts
├── htmldomapi.ts
├── init.ts //注册模块，返回patch函数
├── is.ts
├── jsx-global.ts
├── jsx.ts
├── modules // 内置模块和自定义模块
│   ├── attributes.ts
│   ├── class.ts
│   ├── dataset.ts
│   ├── eventlisteners.ts
│   ├── hero.ts //自定义的模块
│   ├── module.ts
│   ├── props.ts
│   └── style.ts
├── thunk.ts
├── tovnode.ts
├── ts-transform-js-extension.cjs
├── tsconfig.json
└── vnode.ts //h中生成虚拟dom时具体调用的方法
```

* `h`函数
  * 定义在`h.ts`中
  * 处理传入的参数然后创建`VNode`对象
  * 函数的定义用到了函数的重载(函数名称相同但是参数类型或者个数不同)

```tsx
export function h (sel: string): VNode
export function h (sel: string, data: VNodeData | null): VNode
export function h (sel: string, children: VNodeChildren): VNode
export function h (sel: string, data: VNodeData | null, children: VNodeChildren): VNode
export function h (sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}
  var children: any
  var text: any
  var i: number
  if (c !== undefined) {
    if (b !== null) {
      data = b
    }
    if (is.array(c)) {
      children = c
    } else if (is.primitive(c)) {
      text = c
    } else if (c && c.sel) {
      children = [c]
    }
  } else if (b !== undefined && b !== null) {
    if (is.array(b)) {
      children = b
    } else if (is.primitive(b)) {
      text = b
    } else if (b && b.sel) {
      children = [b]
    } else { data = b }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined)
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel)
  }
  return vnode(sel, data, children, text, undefined)
};
```

* vnode函数
  * 定义在`vnode.ts`中
  * 接受参数去创建`vnode`对象

```js

import { Hooks } from './hooks'
import { AttachData } from './helpers/attachto'
import { VNodeStyle } from './modules/style'
import { On } from './modules/eventlisteners'
import { Attrs } from './modules/attributes'
import { Classes } from './modules/class'
import { Props } from './modules/props'
import { Dataset } from './modules/dataset'
import { Hero } from './modules/hero'

export type Key = string | number

export interface VNode {
  sel: string | undefined
  data: VNodeData | undefined
  children: Array<VNode | string> | undefined
  elm: Node | undefined
  text: string | undefined
  key: Key | undefined
}

export interface VNodeData {
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  hero?: Hero
  attachData?: AttachData
  hook?: Hooks
  key?: Key
  ns?: string // for SVGs
  fn?: () => VNode // for thunks
  args?: any[] // for thunks
  [key: string]: any // for any other 3rd party module
}

export function vnode (sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined): VNode {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}

```

* `patch`函数
  * `patch(oldVNode,newVode)`
  * 把新节点渲染到真实`dom`中去，返回新的`VNode`作为下次的处理的`oldVNode`
  * 对比新旧节点是否相同(`key`和`sel`)
  * 如果不同，删除之前的节点重新创建
  * 如果相同，判断新的`VNode`是否有文本节点，如果有并且和旧的`VNode`的文本不同，直切更新文本的内容
  * 如果新的`VNode`有子节点，对比子节点是否有变化
* 













