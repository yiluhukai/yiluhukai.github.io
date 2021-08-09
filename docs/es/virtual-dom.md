#### 虚拟dom

#####  什么是虚拟dom

* 真实的`dom`
  * `document.querySelector("#app")`
  * 真实的`dom`上会保存很多的属性和方法

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
* MVVM框架本质上是基于模版引擎的，没有虚拟`dom`,没法跟踪状态(每次状态变化都要销毁重新渲染)
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
  * 代码大约200行
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
// 第一个参数是新vNode
// 返回值是的新的vNode

const el =  document.querySelector("#app")
// 为下一次更新去使用
const oldVnode = patch(el,vNode)

// 继续跟新节点

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





