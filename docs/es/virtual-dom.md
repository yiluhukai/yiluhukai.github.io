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

* `init`函数
  * `init`函数是一个高阶函数。
  * 接受`moudle`数组和`domApi`作为参数
  * 返回`patch`函数
  * `domApi`默认是操作`html`的`api`,我们可以提供其他平台的`api`来将虚拟`dom`转成其他平台的`dom`

```tsx

// init.ts
export function init (modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number
  let j: number
  // 保存模块中的勾子函数
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  }
 // 设置api的值，默认是htmlDomApi
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi
	// 外层循环没有意义，设置的就是默认值和上面初始化的值一样，都是[]
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      //将模块中的勾子函数依次放入到对应的数组中
      // cbs['create'].push(fn1)
      const hook = modules[j][hooks[i]]
      if (hook !== undefined) {
        (cbs[hooks[i]] as any[]).push(hook)
      }
    }
  }
	//下面是一些patch函数需要用到的内部函数
  function emptyNodeAt (elm: Element) {
    ....
  }

  function createRmCb (childElm: Node, listeners: number) {
    ...
  }
  // 返回一个patch:用来将后面的虚拟dom替换前面的dom
  return function patch (oldVnode: VNode | Element, vnode: VNode): VNode {
    ....
    return vnode
  }
    
 //   上面的Module
 export type Module = Partial<{
  pre: PreHook
  create: CreateHook
  update: UpdateHook
  destroy: DestroyHook
  remove: RemoveHook
  post: PostHook
}>   

//  htmlDomApi.ts 
function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node | null): void {
  parentNode.insertBefore(newNode, referenceNode)
}

function removeChild (node: Node, child: Node): void {
  node.removeChild(child)
}
  
 export const htmlDomApi: DOMAPI = {
  createElement,
  createElementNS,
  createTextNode,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment,
}
```

* `patch`函数
  * `patch(oldVNode,newVode)`
  * 把新节点渲染到真实`dom`中去，返回新的`VNode`作为下次的处理的`oldVNode`
  * 对比新旧节点是否相同(`key`和`sel`)
  * 如果不同，删除之前的节点重新创建
  * 如果相同，判断新的`VNode`是否有文本节点，如果有并且和旧的`VNode`的文本不同，直切更新文本的内容
  * 如果新的`VNode`有子节点，对比子节点是否有变化

```tsx
function patch (oldVnode: VNode | Element, vnode: VNode): VNode {
    let i: number, elm: Node, parent: Node
    // 保存要插入的虚拟dom的列表，当插入到真实dom中后执行insert虚拟dom的insert勾子
    const insertedVnodeQueue: VNodeQueue = []
    // 执行pre勾子
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()
    // 如果不是vNode,将真实dom转成虚拟dom
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode)
    }
    // 判断vNode和原来的老的vNode是否相同
    if (sameVnode(oldVnode, vnode)) {
      // 更新他的子节点
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      elm = oldVnode.elm!
      parent = api.parentNode(elm) as Node
      // 将vNode转成真实的dom，并将vnode保存到insertedVnodeQueue
      createElm(vnode, insertedVnodeQueue)
      // 将新的dom插入到原来dom的后面
      // 删除原来的dom
      if (parent !== null) {
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }
    // 执行插入的vNode的insert勾子
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      // ！.类似js的?.(可选链) 
      insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
    }
     // 执行 post勾子
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
    return vnode
  }

// 内部的一些函数

function sameVnode (vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}

function isVnode (vnode: any): vnode is VNode {
  return vnode.sel !== undefined
}

function emptyNodeAt (elm: Element) {
  const id = elm.id ? '#' + elm.id : ''
  const c = elm.className ? '.' + elm.className.split(' ').join('.') : ''
  return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm)
}
// 其他的函数可以去源码中找
```

可以对上面我们搭建的`snabbdom-demo`进行断点调试来观察`patch`函数的执行过程,打包后的源文件位于控制台->`source`->`http://localhost:1234/`->`src/*`,可以对其设置断点。

![patch-source](/frontend/parcel-source.png)

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
</html
```

:::warning

`div`后面的兄弟节点是文本节点而不是`script`节点

:::

* `createElm`函数
  * 将`VNode`转换成`dom`对象保存到`VNode.elm`属性中
  * `createElm`函数在创建真实`dom`对象的时候会执行我们设置的`hook`函数
  * `createElm`可以创建注释节点、元素节点、文本节点
  * 当我们传入的`VNode`对象有`insert`勾子时，会被加入到`insertedVnodeQueue`里

```tsx

  function createElm (vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    let i: any
    let data = vnode.data
    if (data !== undefined) {
      // 执行我们在创建VNode的时候传入的data的init勾子函数
      const init = data.hook?.init
      if (isDef(init)) {
        init(vnode)
        // init函数可能会修改data
        data = vnode.data
      }
    }
    // 获取VNode对象的children 和sel属性
    // sel == "!"" 是注释节点
    // sel !== "!" && sel !== undefined 是元素节点
    // 否则是文本节点 
    const children = vnode.children
    const sel = vnode.sel
    if (sel === '!') {
      // 讲注释内容修改成字符串
      if (isUndef(vnode.text)) {
        vnode.text = ''
      }
      vnode.elm = api.createComment(vnode.text!)
    } else if (sel !== undefined) {
      // Parse selector
      // 将我们传入的选择器解析成tag,id,class 
      const hashIdx = sel.indexOf('#')
      const dotIdx = sel.indexOf('.', hashIdx)
      const hash = hashIdx > 0 ? hashIdx : sel.length
      const dot = dotIdx > 0 ? dotIdx : sel.length
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
      // data.ns存在的是svg
      const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
        ? api.createElementNS(i, tag)
        : api.createElement(tag)
      // 向创建的元素节点上添加id和class  
      if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
      if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
      // 执行模块的create勾子
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)
      // 如果children存在，那么该节点含有子元素，负责元素的内容是文本节点
      // children和text只能存在一个
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i]
          // 递归调用createElm来创建子元素
          if (ch != null) {
            api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
          }
        }
      } else if (is.primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text))
      }
      // 执行VNode的create勾子
      const hook = vnode.data!.hook
      if (isDef(hook)) {
        hook.create?.(emptyNode, vnode)
        // insert勾子存在，将对应的Vnode放入insertedVnodeQueue里面
        if (hook.insert) {
          insertedVnodeQueue.push(vnode)
        }
      }
    } else {
      // 创建文本节点
      vnode.elm = api.createTextNode(vnode.text!)
    }
    // 返回我们创建的dom对象
    return vnode.elm
  }
```

`我们可以使用下面的代码来调试`：

```js
// 04-basicusage.js 
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数是元素的内容
const vNode = h("div#container.test",{ 
    hook:{ 
        init(){ console.log('init hook') },
        create(){ console.log('create hook') }   
    }    
},"Hello world") 


// 第一个参数可以是旧的vNode，也可以是真实dom
// 第一个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
patch(el,vNode)

```

* `removeVnodes.ts`函数
  * 批量删除`VNode`从`dom`上

```tsx
  /**
   * 批量删除VNode
   * @param parentElm 父节点，真实dom 
   * @param vnodes  VNode的列表
   * @param startIdx 删除的开始下标 
   * @param endIdx  删除的结束下标
   */
  function removeVnodes (parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number
      let rm: () => void
      const ch = vnodes[startIdx]
      if (ch != null) {
        if (isDef(ch.sel)) {
          // 调用VNode中的destroy勾子，如果有children,递归调用invokeDestroyHook
          invokeDestroyHook(ch)
          // 一个计数器,当计数器的数字变成0时，去掉用下面的rm
          listeners = cbs.remove.length + 1
          // createRmCb返回一个高阶函数，返回rm函数，rm函数执行一次，--listeners
          // 当listeners == 0时,从ch.elm的父元素上移除该节点
          rm = createRmCb(ch.elm!, listeners)
          // 执行chs.remove勾子函数(全局模块中提供的)
          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
          const removeHook = ch?.data?.hook?.remove
          // 如果ch这个VNode有remove勾子函数，触发它的勾子函数
          // 这里再次执行rm时因为我们`init`函数可能没接受modules,那么我们也要确保rm执行一次

          if (isDef(removeHook)) {
            removeHook(ch, rm)
          } else {
            // 当我们没有提供模块和Vnode中的romove勾子，也要去删除该节点
            rm()
          }
        } else { // Text node
          api.removeChild(parentElm, ch.elm!)
        }
      }
    }
  }

  function createRmCb (childElm: Node, listeners: number) {
    return function rmCb () {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm) as Node
        api.removeChild(parent, childElm)
      }
    }
  }
  /**
   * 调用VNode中的destroy勾子，如果有children,递归调用invokeDestroyHook
   * @param vnode 
   */
  function invokeDestroyHook (vnode: VNode) {
    const data = vnode.data
    if (data !== undefined) {
      data?.hook?.destroy?.(vnode)
      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j]
          if (child != null && typeof child !== 'string') {
            invokeDestroyHook(child)
          }
        }
      }
    }
  }
```

* `addVnodes`函数
  * 批量添加`VNode`到`dom`上

```tsx

  /**
   * 
   * @param parentElm 父元素
   * @param before 插入节点的在before节点之前
   * @param vnodes  要插入的VNode的列表
   * @param startIdx VNodes中 的开始下标
   * @param endIdx  VNodes中 的结束下标
   * @param insertedVnodeQueue 记录要提供了insert勾子的VNode列表
   */
  function addVnodes (
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      // 直接将Vnode创建成真实dom然后插入
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
      }
    }
  }
```

* `patchVnode`函数
  * 当发现两个新旧dom相同(key和选择器相同)，那么对比两个虚拟dom的子节点和文本节点的内容
  ![patchVnode](/frontEnd/patchVode.png)

```tsx
/**
   * 当发现两个新旧dom相同(key和选择器相同)，那么对比两个虚拟dom的子节点和文本节点的内容
   * @param oldVnode 旧的虚拟dom
   * @param vnode 新的虚拟dom
   * @param insertedVnodeQueue 需要执行insert勾子的VNode的数组
   * @returns 
   */
  function patchVnode (oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
    // 先执行新的VNode的prepatch勾子
    const hook = vnode.data?.hook
    hook?.prepatch?.(oldVnode, vnode)
    // 这里我们使用旧的dom进行更新
    const elm = vnode.elm = oldVnode.elm!
    const oldCh = oldVnode.children as VNode[]
    const ch = vnode.children as VNode[]
    // 两个VNode相同应用，那么直接返回
    if (oldVnode === vnode) return
    // 触发moduels中的update勾子和新的VNode的update勾子
    if (vnode.data !== undefined) {
      for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      vnode.data.hook?.update?.(oldVnode, vnode)
    }
    // 新的VNode没有文本节点
    if (isUndef(vnode.text)) {
      // 那么新的VNode的children应该存在
      if (isDef(oldCh) && isDef(ch)) {
        // 新旧VNode的children都存在且不相等
        // 调用updateChildren函数去跟旧VNode的children
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
      } else if (isDef(ch)) {
        // 新的VNode的children存在而旧的Vnode的children不存在
        // 移除文本节点
        if (isDef(oldVnode.text)) api.setTextContent(elm, '')
        // 创建新的VNode的children的并添加到elm
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 旧的VNode有children而新的VNode没有children,也没有文本节点
        // 直接删除旧的VNode的children
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 如果新旧VNode的children都不存在，但是旧的VNode有text而新的没有
        // 直接删除旧的VNode的文本节点即可
        api.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 新的VNode有文本节点且和旧的VNode的文本节点不同
      // 旧的VNode有子元素
      if (isDef(oldCh)) {
        // 删除子元素，这样子可以触发destory和remove勾子
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      }
      // 更新文本节点
      api.setTextContent(elm, vnode.text!)
    }
    // 执行新的Vnode的postpatch勾子
    hook?.postpatch?.(oldVnode, vnode)
  }
```

当发现两个`vnode`的`key`和`sel`是相同的时候，但是他们的`children`都存在且不相同时，我们会执行`updateChildren`函数

* `updateChildren(elm, oldCh, ch, insertedVnodeQueue)`
  * 对比两个`key`和`sel`相同的`vnode`的`children`(都存在)
  * 其他情况我们都是使用`patchVnode`来对比更新的两个vnode
  * 是diff算法的核心

```tsx
  /**
   * 对比两个vnode的children
   * @param parentElm 
   * @param oldCh 
   * @param newCh 
   * @param insertedVnodeQueue 
   */
  function updateChildren (parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue) {
    // 对比过程中需要使用到的变量  
    let oldStartIdx = 0 // 旧的vnode的children的开始索引
    let newStartIdx = 0 //新的vnode的children的开始索引
    let oldEndIdx = oldCh.length - 1 //旧的vnode的children的结束索引
    let oldStartVnode = oldCh[0] // 旧的vnode的children中的第一个vnode
    let oldEndVnode = oldCh[oldEndIdx] //旧的vnode的children中的最后一个vnode
    let newEndIdx = newCh.length - 1 //新的vnode的children的结束索引
    let newStartVnode = newCh[0] //新的vnode的children中的第一个vnode
    let newEndVnode = newCh[newEndIdx] //新的vnode的children中的最后一个vnode
    let oldKeyToIdx: KeyToIndexMap | undefined  // 通过索引去查找下标的对象
    let idxInOld: number //索引
    let elmToMove: VNode //需要移动的元素
    let before: any //
    // 整个diff算法的核心  
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 忽律children中为null的vnode
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx]
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx]  
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 对比两个开始节点，当新旧vnode的children元素的中的开始节点相同时
        // 使用patchVode对比更新两个vnodo的内部(children 或者 text)
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        // 两个下标同时后移
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 当开始节点不同时，对比children中的最后面的节点，当新旧vnode的children元素的中的结束节点相同时
        // 使用patchVode去对比跟新两个vnodo的内部(children 或者 text)
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        //  下标前移
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 当新旧vnode的chilren中开始和开始，结束和结束位置对比失败时
        // 开始对你旧的开始节点和新的结束节点，当相同时，使用使用patchVode对比跟新两个vnodo的内部(children 或者 text)
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        // 将vnode插入oldEndVnode元素的后面
        api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!))
        // 然后一个前移，一个后移去继续对比
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        //  当新旧vnode的chilren中开始和开始，结束和结束位置，旧的开始和新的结束对比失败时
        //  对比新的开始和旧的结束节点
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        // 将元素前移
        api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
        // 继续跟新下标对比
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 上面的四种情况都对比失败了，那么应该去查找新的节点在旧的旧的节点列表中是否存在
        // 建立key和下标的映射在旧的未对比的vnode.children中
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        }
        // 使用key去查找
        idxInOld = oldKeyToIdx[newStartVnode.key as string]
        if (isUndef(idxInOld)) { // New element
          // 当没找到，我们创建新的节点
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        } else {
          // 当找到了
          elmToMove = oldCh[idxInOld]
          // 我们还需要对比sel属性
          if (elmToMove.sel !== newStartVnode.sel) {
            // 当key相同但是sel不同，我们需要去新建节点
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
          } else {
            //当key和sel相同的时候，我们认为是相同的节点
            // 对比跟新子节点
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            // 将这个位置设置为undefined
            oldCh[idxInOld] = undefined as any
            // 插入跟新后的节点到旧的开始节点的前面
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
          }
        }
        // 移动新的开始指针
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 对比完成后我们的收尾工作
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      // 此时说明新的vnode的children中还有没有创建的元素
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
        // 插入新的节点到
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
      } else {
        // 说明旧的vnode中有剩余的节点需要去删除
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
      }
    }
  }
```

##### `diff算法`

* 使用diff算法的目的
  * 操作`dom`会引起浏览器的重绘和重排，比较耗性能
  * 使用`diff`算法可以对比两个`vnode`,最小化去更新`dom`

传统的对比两个树结构的算法：

* 需要遍历每个节点去和另一个`dom`树做对比(事件复杂度O(n*n))

![diff](/frontEnd/old-diff.png)

* `snabbdom`的`diff`算法对传统的`diff`算法做了优化：
  * `dom`操作时很少跨级别操作节点
  * 只比较同级别的节点

![snabbdom-diff](/frontEnd/snabbdom-diff.png)

具体对比过程

* `vnode`中的开始节点和`oldVnode`的开始节点对比

  ![diff](/frontEnd/start-start.png)

* `vnode`中的接受节点和`oldVnode`的结束节点对比(和第一种类似)

* `vnode`中的结束节点和`oldVnode`的开始节点对比

  ![diff](/frontEnd/start-end.png)

* `vnode`中的开始节点和`oldVnode`的结束节点对比

  ![diff](/frontEnd/end-start.png)

* 当上面四种情况对比失败后，根据`key`去旧的`vnode`中查找

  * 当找不到key对应的节点或者找到了但是`sel`不同，新建节点
  * 当找到且sel相同，调用`pacthVnode`去对比子节点

  ![](/frontEnd/other-diff.png)

当比较结束；我们还需要去检查新旧`vnode`中有没有未对比到的元素:

```tsx
    // 对比完成后我们的收尾工作
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      // 此时说明新的vnode的children中还有没有创建的元素
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
        // 插入新的节点到
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
      } else {
        // 说明旧的vnode中有剩余的节点需要去删除
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
      }
    }
```

调用上面的`updateChildren`

```js

import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数是元素的内容
const vNode = h('ul',[h('li','首页'),h('li','电影'),h('li','微博')])
 


// 第一个参数可以是旧的vNode，也可以是真实dom
// 第一个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
const oldVnode = patch(el,vNode)

// 继续跟新节点



patch(oldVnode,h('ul',[h('li','首页'),h('li','微博'),h('li','电影')]))
```

* 我们的再第二次调用`patch`函数会触发到（可以设置断点）
* `updateChildren`的调试我们可以发现：
  * 这个三个`li`元素的只会去对比开始位置(`key=li,sel=undefined`)，然后去更新文本节点的内容

更新上面的调试代码：

```js
import { h } from "snabbdom/build/package/h";
import { init } from "snabbdom/build/package/init";  

const patch = init([]);

// 第一个参数是元素的标签和选择器
// 第二个参数是元素的内容
const vNode = h('ul',[h('li',{key:'a'},'首页'),h('li',{key:'b'},'电影'),h('li',{key:'c'},'微博')])
 


// 第一个参数可以是旧的vNode，也可以是真实dom
// 第一个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
const oldVnode = patch(el,vNode)

// 继续跟新节点

patch(oldVnode,h('ul',[h('li',{key:'a'},'首页'),h('li',{key:'c'},'微博'),h('li',{key:'b'},'电影')]))
```

* 当我们设置`key`后，这个三个`li`元素是通过调换`dom`元素的位置来实现更新的

我们设置key的意义：

```js

import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { attributesModule } from 'snabbdom/build/package/modules/attributes'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

let patch = init([attributesModule, eventListenersModule])

const data = [1, 2, 3, 4]
let oldVnode = null

function view (data) {
  let arr = []
  data.forEach(item => {
    // 不设置 key
    // arr.push(h('li', [h('input', { attrs: { type: 'checkbox' } }), h('span', item)]))
    // 设置key
    arr.push(h('li', { key: item }, [h('input', { attrs: { type: 'checkbox' } }), h('span', item)]))
  })
  let vnode = h('div', [ h('button', { on: { click: function () {
    data.unshift(100)
    vnode = view(data)
    oldVnode = patch(oldVnode, vnode)
  } } }, '按钮') , h('ul', arr)])
  return vnode
}


let app = document.querySelector('#app')
// 首次渲染
oldVnode = patch(app, view(data))
```

* 当我们不设置`key`的时候，选中第一个复选框，然后点击按钮添加新的元素，发现选中的还是第一个的元素
* 所以给相同的`vnode`的子元素设置唯一的`key`可以解决子元素渲染错误

















