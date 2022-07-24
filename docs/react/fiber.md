### 3. Fiber 算法

Fiber 算法是 diff 算法中对比虚拟 dom 的一部分。

`1. 开发环境配置

#### 1.1 文件夹结构

```shell
├── babel.config.json           // babel 配置文件
├── build                       // 存储服务端代码打包文件
│   └── server.js
├── dist                        // 存储客户端代码打包文件
│   ├── bundle.js
│   └── bundle.js.map
├── package-lock.json
├── package.json                // 项目工程文件
├── server.js                   // 存储服务器端代码
├── src                         // 存储源文件
│   └── index.js
├── webpack.config.client.js    // 服务端 webpack 配置文件
└── webpack.config.server.js    // 客户端 webpack 配置文件

3 directories, 10 files
```

创建 package.json 文件：`npm init -y`

#### 1.2 安装项目依赖

开发依赖：

```shell
npm install webpack webpack-cli webpack-node-externals @babel/core @babel/preset-env @babel/preset-react babel-loader nodemon npm-run-all -D
```

项目依赖：`npm install express`

| 依赖项                 | 描述                                               |
| ---------------------- | -------------------------------------------------- |
| webpack                | 模块打包工具                                       |
| webpack-cli            | 打包命令                                           |
| webpack-node-externals | 打包服务器端模块时剔除 node_modules 文件夹中的模块 |
| @babel/core            | JavaScript 代码转换工具                            |
| @babel/preset-env      | babel 预置，转换高级 JavaScript 语法               |
| @babel/preset-react    | babel 预置，转换 JSX 语法                          |
| babel-loader           | webpack 中的 babel 工具加载器                      |
| nodemon                | 监控服务端文件变化，重启应用                       |
| npm-run-all            | 命令行工具，可以同时执行多个命令                   |
| express                | 基于 node 平台的 web 开发框架                      |

#### 1.3 环境配置

##### 1.3.1 创建 web 服务器

```javascript
// server.js
import express from "express";
const app = express();
app.use(express.static("dist"));
const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
			<script src="bundle.js"></script>
    </body>
  </html>
`;
app.get("*", (req, res) => {
    res.send(template);
});
app.listen(3000, () => console.log("server is running"));
```

##### 1.3.2 服务端 webpack 配置

```javascript
// webpack.config.server.js
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    target: "node",
    mode: "development",
    entry: "./server.js",
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    // 只打包 server.js文件，它的依赖在node_module中不处理
    externals: [nodeExternals()],
};
```

##### 1.3.3 babel 配置

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

##### 1.3.4 客户端 webpack 配置

```javascript
const path = require("path");

module.exports = {
    target: "web",
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
```

##### 1.3.5 启动命令

```json
"scripts": {
  "start": "npm-run-all --parallel dev:*",
  "dev:server-compile": "webpack --config webpack.config.server.js --watch",
  "dev:server": "nodemon ./build/server.js",
  "dev:client-compile": "webpack --config webpack.config.client.js --watch"
},
```

### 2. [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

#### 2.1 核心 API 功能介绍

利用浏览器的空余时间执行任务，如果有更高优先级的任务要执行时，当前执行的任务可以被终止，优先执行高级别任务。

```javascript
requestIdleCallback(function(deadline) {
    // deadline.timeRemaining() 获取浏览器的空余时间
});
```

#### 2.2 浏览器空余时间

页面是一帧一帧绘制出来的，当每秒绘制的帧数达到 60 时，页面是流畅的，小于这个值时， 用户会感觉到卡顿

1s 60 帧，每一帧分到的时间是 1000/60 ≈ 16 ms，如果每一帧执行的时间小于 16ms，就说明浏览器有空余时间

如果任务在剩余的时间内没有完成则会停止任务执行，继续优先执行主任务，也就是说 requestIdleCallback 总是利用浏览器的空余时间执行任务

#### 2.3 API 功能体验

页面中有两个按钮和一个 DIV，点击第一个按钮执行一项昂贵的计算，使其长期占用主线程，当计算任务执行的时候去点击第二个按钮更改页面中 DIV 的背景颜色。

使用 requestIdleCallback 就可以完美解决这个卡顿问题。

```html
<div class="playground" id="play">playground</div>
<button id="work">start work</button>
<button id="interaction">handle some user interaction</button>
```

```css
<style>
  .playground {
    background: palevioletred;
    padding: 20px;
    margin-bottom: 10px;
  }
</style>
```

```javascript
var play = document.getElementById("play");
var workBtn = document.getElementById("work");
var interactionBtn = document.getElementById("interaction");
var iterationCount = 100000000;
var value = 0;

var expensiveCalculation = function(IdleDeadline) {
    while (iterationCount > 0 && IdleDeadline.timeRemaining() > 1) {
        value =
            Math.random() < 0.5 ? value + Math.random() : value + Math.random();
        iterationCount = iterationCount - 1;
    }
    // 中断后需要再次调用才会继续执行
    requestIdleCallback(expensiveCalculation);
};

workBtn.addEventListener("click", function() {
    requestIdleCallback(expensiveCalculation);
});

interactionBtn.addEventListener("click", function() {
    play.style.background = "palegreen";
});
```

### 3 Fiber

#### 3.1 问题

React 16 之前的版本比对更新 VirtualDOM 的过程是采用循环加递归实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树比对更新完成之后主线程才能被释放，主线程才能执行其他任务。这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿, 非常的影响用户体验。

核心问题：递归无法中断，执行重任务耗时长。 JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。

#### 3.2 解决方案

1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程
2. 放弃递归只采用循环，因为循环可以被中断
3. 任务拆分，将任务拆分成一个个的小任务

#### 3.3 实现思路

在 Fiber 方案中，为了实现任务的终止再继续，DOM 比对算法被分成了两部分：

1. 构建 Fiber (可中断)
2. 提交 Commit (不可中断)

DOM 初始渲染: virtualDOM -> Fiber -> Fiber[] -> DOM

DOM 更新操作: newFiber vs oldFiber -> Fiber[] -> DOM

#### 3.4 Fiber 对象

fiber 对象也是一个`js`对象.

```
{
  type         节点类型 (元素, 文本, 组件)(具体的类型)
  props        节点属性
  stateNode    节点 DOM 对象 | 组件实例对象
  tag          节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)
  effects      数组, 存储需要更改的 fiber 对象
  effectTag    当前 Fiber 要被执行的操作 (新增, 删除, 修改)
  parent       当前 Fiber 的父级 Fiber
  child        当前 Fiber 的子级 Fiber
  sibling      当前 Fiber 的下一个兄弟 Fiber
  alternate    Fiber 备份 fiber 比对时使用
}
```

<img src="/react/fiber/3.png"/>
如何将虚拟`dom`对象转换成一个`fiber`对象？
从dom树的最外面开始，将dom树根节点转成fiber对象，然后该节点的第一个子节点对应的`fiber`对象是该`fiber`对象的孩子，从第二个孩子开始，是前一个孩子的`fiber`对象的兄弟节点。

#### 3.5 fiber 的使用

接下来我们实现一个`demo`,将虚拟`dom`先转成`fiber`对象，最后利用`fiber`对象来生成和跟新真实`dom`。

项目结构：

```shell
src
├── index.js // 测试代码
└── react
    ├── CreateElement // React.createElement方法
    │   └── createElement.js
    ├── Misc  // 一些工具方法
    │   ├── CreateTaskQueue // 创建任务队列的方法
    │   │   └── index.js
    │   └── index.js
    ├── index.js  // 整个react项目的出口
    └── reconciliation // render方法
        └── index.js

```

`src/index.js`:

```jsx
import React, { render } from "./react";

const jsx = <div>Hello wolrd!</div>;

console.log(jsx);

const root = document.getElementById("root");

render(jsx, root);
```

`Misc/CreateTaskQueue/index.js`:

```js
/**

* 导入一个生成任务队列的方法

*/

export const createTaskQueue = () => {
    const queue = [];
    return {
        push: (task) => queue.push(task),
        pop: () => queue.shift(),
    };
};
```

`CreateElement/createElement.js`:

```js
export function createElement(type, props, ...children) {
    // 当我们的子元素是一个数组是需要拆分
    const childElements = [].concat(...children).reduce((result, child) => {
        // 忽略布尔值和null
        if (child !== true && child !== false && child !== null) {
            // 不是对象的时候是文本节点
            if (child instanceof Object) {
                result.push(child);
            } else {
                //文本节点
                result.push(createElement("text", { textContent: child }));
            }
        }
        return result;
    }, []);

    return {
        type,
        props: Object.assign({ children: childElements }, props),
        children: childElements,
    };
}
```

`reconciliation/index.js`:

```js
/**
 *
 * 实现render方法：
 *
 * render方法主要功能：1.向任务队列中添加任务
 *                  2. 浏览器空闲的时候从任务队列中取出任务执行
 *
 * 任务：这里的任务就是通过vdom对象构建fiber对象
 *
 */

import { createTaskQueue } from "../Misc";

const taskQueue = createTaskQueue();

/**
 * render方法的参数，第一个element代表虚拟dom，第二个参数代表根元素
 */
export function render(element, dom) {
    // 向任务队列中添加任务，
    taskQueue.push({ dom, props: { chilren: element } });

    // 取出我们刚刚添加的任务

    console.log(taskQueue.pop());
}
```

添加任务的调用逻辑：

```js
*/

import { createTaskQueue } from "../Misc";

const taskQueue = createTaskQueue();

let subTask = null;

const getFirstTask = () => {};

const executeTask = (fiber) => {};

const workLoop = (deadline) => {
    if (!subTask) {
        subTask = getFirstTask();
    }

    while (subTask && deadline.timeRemaining() > 1) {
        // 执行任务
        subTask = executeTask(subTask);
    }
};

// 执行任务
const performTask = (deadline) => {
    // 开启任务循环
    workLoop(deadline);
    // 当任务执行中断后中心执行
    if (subTask || !taskQueue.isEmpty()) {
        requestIdleCallback(performTask);
    }
};

/**
 * render方法的参数，第一个element代表虚拟dom，第二个参数代表根元素
 */
export function render(element, dom) {
    // 向任务队列中添加任务，
    taskQueue.push({ dom, props: { chilren: element } });

    // 取出我们刚刚添加的任务

    console.log(taskQueue.pop());

    // 取出任务队列中的任务执行
    requestIdleCallback(performTask);
}
```

`createTask`中追加判空的方法

```js
export const createTaskQueue = () => {
    const queue = [];
    return {
        push: (task) => queue.push(task),
        pop: () => queue.shift(),
        isEmpty: () => queue.length === 0,
    };
};
```

`getFirstTask`方法用于从任务队列中获取第一个子任务.

```JavaScript
const getFirstTask = () => {
    /**
     * 获取任务队列队列中第一个任务的子任务
     *
     */

    const subTask = taskQueue.pop();
    console.error(subTask);

    /**
     * 构建fiber对象(最晚层元素root对应的fiber对象)
     */

    return {
        props: subTask.props,
        stateNode: subTask.dom, //当前fiber对象对应的dom
        tag: "hostRoot", //根节点
        effects: [],
        child: null, //后面构建了子fiber节点再去设置
    };
};
```

调用`executeTask`方法执行任务并返回新的任务。`reconcileChildren`方法用来将子节点的虚拟对象转化成`fiber`对象。

```JavaScript
/**
 *
 * @param {*} fiber 父fiber对象
 * @param {Array | Object} children 虚拟dom
 */
const reconcileChildren = (fiber, children) => {
    //当children是根fiber对象时，children是对象，当是用creaeElement方法创建的，则是数组
    // 将children转成数组统一处理
    const arrifiedChildren = arrified(children);
    let index = 0,
        element = null,
        length = arrifiedChildren.length,
        newFiber = null,
        prevFiber = null;

    while (index < length) {
        element = arrifiedChildren[index];
        // 将当前的虚拟dom构建成fiber对象
        newFiber = {
            type: element.type,
            props: element.props,
            tag: "host_component",
            effects: [],
            effectTag: "placement", // 添加节点
            stateNode: null,
            parent: fiber,
        };

        if (index == 0) {
            // 作为当前节点的child
            fiber.child = newFiber;
        } else {
            //作为前一个兄弟节点的邻居节点
            prevFiber.subling = newFiber;
        }
        prevFiber = newFiber;
        index++;
    }
};

const executeTask = (fiber) => {
    /**
     * 构建当前fiber对象的子fiber对象
     */
    reconcileChildren(fiber, fiber.props.children);
    console.error(fiber);
};
```

`fiber`对象的`stateNode`属性中保存的是当前 fiber 对象对应生成的`dom`元素，当`fiber`对象的`tag`类型不同，生成`dom`的方式也不同，我们可以使用`createStateNode`去生成`fiber`对象的`stateNode`属性：

```JavaScript
		// 将当前的虚拟dom构建成fiber对象
        newFiber = {
            type: element.type,
            props: element.props,
            tag: "host_component",
            effects: [],
            effectTag: "placement", // 添加节点
            // stateNode: null,
            parent: fiber,
        };
        // 给新创建的fiber对象添加stateNode属性
        newFiber.stateNode = createStateNode(newFiber);
```

`fiber`对象的`tag`属性应该是动态变化的：

```js
newFiber = {
    type: element.type,
    props: element.props,
    tag: getTag(element),
    effects: [],
    effectTag: "placement", // 添加节点
    // stateNode: null,
    parent: fiber,
};
```

`getTag`方法：

```js
// MISC/getTag/index.js
const getTag = (vdom) => {
    // 文本节点和元素节点
    if (typeof vdom.type === "string") {
        return "host_component";
    }
};
export default getTag;
```

目前我们只完成了最外层节点和其子节点的对 fiber 对象的转化工作，我们还需要完成下层节点的转化，以及使用`effects`收集子节点的`fiber`对象。

```js
const executeTask = (fiber) => {
    /**
     * 构建当前fiber对象的子fiber对象
     */
    reconcileChildren(fiber, fiber.props.children);

    // 下次任务时继续构建fiber.child对象,z这块只处理了子节点，没有处理兄弟节点
    if (fiber.child) {
        return fiber.child;
    }

    // 当没有子节点的时候，开始去查找兄弟节点并构建fiber对象
    let currentFiber = fiber;

    while (currentFiber.parent) {
        // 存放当前节点下的所有fiber对象，包含自身
        currentFiber.parent.effects = currentFiber.parent.effects.concat(
            currentFiber.effects.concat([currentFiber])
        );
        if (currentFiber.subling) {
            return currentFiber.subling; // 基于该节点去构建
        }
        currentFiber = currentFiber.parent;
        // 向上去处理父节点subling节点
    }
    console.dir(fiber);
};
```

完成了`fiber`对象的构建，接下来开始使用`fiber`对象完成初始渲染。

````js
let pendingCommit = null;

const executeTask = (fiber) => {
    /**
     * 构建当前fiber对象的子fiber对象
     */
    reconcileChildren(fiber, fiber.props.children);

    // 下次任务时继续构建fiber.child对象,z这块只处理了子节点，没有处理兄弟节点
    if (fiber.child) {
        return fiber.child;
    }

    // 当没有子节点的时候，开始去查找兄弟节点并构建fiber对象
    let currentFiber = fiber;

    while (currentFiber.parent) {
        // 存放当前节点下的所有fiber对象，包含自身
        currentFiber.parent.effects = currentFiber.parent.effects.concat(
            currentFiber.effects.concat([currentFiber])
        );
        if (currentFiber.subling) {
            return currentFiber.subling; // 基于该节点去构建
        }
        currentFiber = currentFiber.parent;
        // 向上去处理父节点subling节点
    }
    // 执行完成后，currentFiber指向的最外层的fiber对象
    console.dir(currentFiber);
    pendingCommit = currentFiber;
};```

`pendingCommit`用来接受最外层存储最外层的`fiber`对象。

```js
const workLoop = (deadline) => {
    if (!subTask) {
        subTask = getFirstTask();
        // console.log(subTask);
    }

    while (subTask && deadline.timeRemaining() > 1) {
        // 执行任务并返回一个新的任务,这里的任务是构建好的fiber对象
        subTask = executeTask(subTask);
    }

    // 当上面的fiber对象构建完成，subTask === undefined

    if (pendingCommit) {
        commitAllWork(pendingCommit);
    }
};


// fiber对象是最外层的fiber对象
const commitAllWork = (fiber) => {
    fiber.effects.forEach((subFiber) => {
        if (subFiber.effectTag === "placement") {
            // 添加节点
            subFiber.parent.stateNode.appendChild(subFiber.stateNode);
        }
    });
};

````

调用`commitAllWork`来完成渲染，此时已经完成了普通的节点的渲染。

目前我们只完成了普通节点的处理，接下来完成类组件和函数时组件的更新,添加一个`Component`l 类供类组件继承：

```js
// Component/index.js
export default class Component {
    constructor(props) {
        this.props = props;
    }
}
```

```js
// react_fiber/src/index.js

import React, { render, Component } from "./react";
// const jsx = (
//     <div>
//         <p>Hello wolrd!</p>
//         <h1>subling</h1>
//     </div>
// );

// console.log(jsx);

const root = document.getElementById("root");

// render(jsx, root);

class MyComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div> Hello,{this.props.name}!</div>;
    }
}
// function MyComponent(props) {
//     return <div> Hello,{props.name}!</div>;
// }

render(<MyComponent name="zce" />, root);
```

首先在于`tag`的处理：

```js
//getTag.js

import Component from "../../Component";
const getTag = (vdom) => {
    // 文本节点和元素节点
    if (typeof vdom.type === "string") {
        return "host_component";
    } else if (Object.getPrototypeOf(vdom.type) === Component) {
        // 类组件
        return "class_component";
    } else {
        return "function_component";
    }
};
export default getTag;
```

类组件和函数组件对应的`stateNode`分别为`类实例对象`和函数本身：

```js
// createStateNode.js

import { createDOMElement } from "../../DOM";
import { createReactInstance } from "../CreateReactInstance";
const createStateNode = (fiber) => {
    // 文本节点和元素节点
    if (fiber.tag === "host_component") {
        return createDOMElement(fiber);
    } else {
        return createReactInstance(fiber);
    }
};

export default createStateNode;
```

`CreateReactInstance.js`文件：

```js
export const createReactInstance = (fiber) => {
    let instance = null;
    if (fiber.tag === "class_component") {
        instance = new fiber.type(fiber.props);
    } else {
        instance = fiber.type;
    }
    return instance;
};
```

接下来需要修改处理子组件的方法,不同的类型的`fiber`.获取子节点的虚拟对象的方式不同

```js
const executeTask = (fiber) => {
    /**
     * 构建当前fiber对象的子fiber对象
     */
    if (fiber.tag === "class_component") {
        reconcileChildren(fiber, fiber.stateNode.render());
    } else if (fiber.tag === "function_component") {
        reconcileChildren(fiber, fiber.stateNode(fiber.props));
    } else {
        reconcileChildren(fiber, fiber.props.children);
    }

    // 下次任务时继续构建fiber.child对象,z这块只处理了子节点，没有处理兄弟节点
    if (fiber.child) {
        return fiber.child;
    }

    // 当没有子节点的时候，开始去查找兄弟节点并构建fiber对象
    let currentFiber = fiber;

    while (currentFiber.parent) {
        // 存放当前节点下的所有fiber对象，包含自身
        currentFiber.parent.effects = currentFiber.parent.effects.concat(
            currentFiber.effects.concat([currentFiber])
        );
        if (currentFiber.subling) {
            return currentFiber.subling; // 基于该节点去构建
        }
        currentFiber = currentFiber.parent;
        // 向上去处理父节点subling节点
    }
    // 执行完成后，currentFiber指向的最外层的fiber对象
    // console.dir(currentFiber);
    pendingCommit = currentFiber;
};
```

修改`commitAllWork`函数，当我们添加元素时，需要去忽略父元素时类组件和函数式组件的`fiber`对象。

```js
// fiber对象是最外层的fiber对象
const commitAllWork = (fiber) => {
    fiber.effects.forEach((subFiber) => {
        // 添加的过程中忽略掉类组件和函数组件的fiber对象

        if (subFiber.effectTag === "placement") {
            let parentFiber = subFiber.parent;

            while (
                parentFiber.tag === "class_component" ||
                parentFiber.tag === "function_component"
            ) {
                parentFiber = parentFiber.parent;
            }
            if (subFiber.tag === "host_component") {
                // 添加节点
                parentFiber.stateNode.appendChild(subFiber.stateNode);
            }
        }
    });
};
```

节点更新操作：

测试代码：

```js
import React, { render, Component } from "./react";
const jsx = (
    <div>
        <p>Hello world!</p>
        <h1>subling</h1>
    </div>
);

// console.log(jsx);

const root = document.getElementById("root");

render(jsx, root);

setTimeout(() => {
    render(
        <div>
            <div>奥利给</div>
            <h1>subling</h1>
        </div>,
        root
    );
}, 2000);
```

我们需要去缓存上一次的`fiber`对象，然后利用两次的`fiber`对象做比较去完成 dom 节点更新：

```js
const commitAllWork = (fiber) => {
    fiber.effects.forEach((subFiber) => {
        if (subFiber.effectTag === "update") {
            // 更新dom节点
            if (subFiber.type !== subFiber.alternate.type) {
                /**
                 * dom节点的类型不同，创建一个新的节点去替换旧的节点
                 */
                subFiber.parent.stateNode.replaceChild(
                    subFiber.stateNode,
                    subFiber.alternate.stateNode
                );
            } else {
                /**
                 * 类型相同，更新节点的内容
                 */
                updateElementNode(
                    subFiber,
                    subFiber.stateNode,
                    subFiber.alternate
                );
            }
        } else if (subFiber.effectTag === "placement") {
            // 添加的过程中忽略掉类组件和函数组件的fiber对象
            let parentFiber = subFiber.parent;

            while (
                parentFiber.tag === "class_component" ||
                parentFiber.tag === "function_component"
            ) {
                parentFiber = parentFiber.parent;
            }
            if (subFiber.tag === "host_component") {
                // 添加节点
                parentFiber.stateNode.appendChild(subFiber.stateNode);
            }
        }

        /**
         * 缓存旧的的fiber节点，为下次比对准备
         */

        fiber.stateNode.__rootFiberContainer = fiber;
    });
};
```

每次生成新的`dom`后，我们都需要去存储旧的`fiber对象`。在每次创建新的`fiber`对象时获取：

```js
const getFirstTask = () => {
    /**
     * 获取任务队列队列中第一个任务的子任务
     *
     */

    const subTask = taskQueue.pop();
    // console.error(subTask);

    /**
     * 构建fiber对象(最晚层元素root对应的fiber对象)
     */

    return {
        props: subTask.props,
        stateNode: subTask.dom, //当前fiber对象对应的dom
        tag: "hostRoot", //根节点
        effects: [],
        child: null, //后面构建了子fiber节点再去设置,
        alternate: subTask.dom.__rootFiberContainer, // 替换的节点对应的fiber对象
    };
};
```

然后构建子`fiber`对象是找出对应的旧`fiber`对象去对比,然后重新创建`stateNode`属性还是去更新
`stateNode`属性：

```js

const reconcileChildren = (fiber, children) => {
    //当children是根fiber对象时，children是对象，当是用creaeElement方法创建的，则是数组
    // 将children转成数组统一处理
    const arrifiedChildren = arrified(children);
    let index = 0,
        element = null,
        length = arrifiedChildren.length,
        newFiber = null,
        prevFiber = null;
    let alternate = null; // 存储每一个子节点对应的旧fiber节点
    if (fiber.alternate && fiber.alternate.child) {
        alternate = fiber.alternate.child;
    }

    while (index < length) {
        element = arrifiedChildren[index];
        if (element && alternate) {
            // 节点的类型不同
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: "update", // 更新节点
                // stateNode: null,
                parent: fiber,
                alternate, // 当前节点对应的旧的fiber对象
            };
            // 更新节点
            if (element.type !== alternate.type) {
                // 给新创建的fiber对象添加stateNode属性
                newFiber.stateNode = createStateNode(newFiber);
            } else {
                // 节点的类型相同，用旧的几点代替新的节点
                newFiber.stateNode = alternate.stateNode;
            }
        } else if (element && !alternate) {
            // 初始渲染
            // 将当前的虚拟dom构建成fiber对象
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: "placement", // 添加节点
                // stateNode: null,
                parent: fiber,
            };
            // 给新创建的fiber对象添加stateNode属性
            newFiber.stateNode = createStateNode(newFiber);
        }

        // 更新胡后续的child节点对应的alternate
        if (alternate && alternate.subling) {
            alternate = alternate.subling;
        } else {
            alternate = null;
        }

        if (index == 0) {
            // 作为当前节点的child
            fiber.child = newFiber;
        } else {
            //作为前一个兄弟节点的邻居节点
            prevFiber.subling = newFiber;
        }
        prevFiber = newFiber;
        index++;
    }
};

```

更新完成在后续提交中更新`dom`;

```js

// fiber对象是最外层的fiber对象
const commitAllWork = (fiber) => {
    fiber.effects.forEach((subFiber) => {
        if (subFiber.effectTag === "update") {
            // 更新dom节点
            if (subFiber.type !== subFiber.alternate.type) {
                /**
                 * dom节点的类型不同，创建一个新的节点去替换旧的节点
                 */
                subFiber.parent.stateNode.replaceChild(
                    subFiber.stateNode,
                    subFiber.alternate.stateNode
                );
            } else {
                /**
                 * 类型相同，更新节点的内容
                 */
                updateElementNode(
                    subFiber,
                    subFiber.stateNode,
                    subFiber.alternate
                );
            }
        } else if (subFiber.effectTag === "placement") {
            // 添加的过程中忽略掉类组件和函数组件的fiber对象
            let parentFiber = subFiber.parent;

            while (
                parentFiber.tag === "class_component" ||
                parentFiber.tag === "function_component"
            ) {
                parentFiber = parentFiber.parent;
            }
            if (subFiber.tag === "host_component") {
                // 添加节点
                parentFiber.stateNode.appendChild(subFiber.stateNode);
            }
        }

        /**
         * 缓存旧的的fiber节点，为下次比对准备
         */

        fiber.stateNode.__rootFiberContainer = fiber;
    });
};

```

由于`updateElementNode`方法只能更新元素节点，我们需要添加对文本节点的更新：

```js
export default function updateElementNode(
    virtualDom,
    newElement,
    oldVirtualDom = {}
) {
    const propsObj = virtualDom.props || {};
    const oldPropsObj = oldVirtualDom.props || {};

    // 对文本节点的更新
    if (virtualDom.type === "text") {
        // 文本的属性不同
        if (propsObj.textContent !== oldPropsObj.textContent) {
            // 更新的时候需要去对比父元素的类型,为什么呢 ，因为父元素的类型不同，更新完子节点后回去创建新的父节点替换节点时找不到子文本节点，替换失败，
            // 因为原来的子节点oldVirtualDom.stateNode，不存在virtualDom.parent.stateNode上
            if (virtualDom.parent.type !== oldVirtualDom.parent.type) {
                // 父元素的类型不同
                virtualDom.parent.stateNode.appendChild(
                    document.createTextNode(propsObj.textContent)
                );
            } else {
                // 父元素的类型相同
                virtualDom.parent.stateNode.replaceChild(
                    document.createTextNode(propsObj.textContent),
                    oldVirtualDom.stateNode
                );
            }
        }
        return;
    }

    Object.keys(propsObj).forEach((prop) => {
        const propValue = propsObj[prop];
        const oldPropValue = oldPropsObj[prop];
        if (propValue !== oldPropValue) {
            if (prop.slice(0, 2) === "on") {
                // 当我们要添加的属性是元素的事件
                const eventName = prop.slice(2).toLowerCase();
                if (oldPropValue) {
                    // 删除旧的事件
                    newElement.removeEventListener(eventName, oldPropValue);
                }
                newElement.addEventListener(eventName, propValue);
            } else if (prop === "value" || prop === "checked") {
                // bool属性
                newElement[prop] = propValue;
            } else if (prop !== "children") {
                // class属性和其他的属性
                if (prop === "className") {
                    newElement.setAttribute("class", propValue);
                } else {
                    newElement.setAttribute(prop, propValue);
                }
            }
        }
    });
    // 判断属性被删除的情况(旧的虚拟上有但是新的没有)

    Object.keys(oldPropsObj).forEach((prop) => {
        const propValue = propsObj[prop];
        const oldPropValue = oldPropsObj[prop];
        if (!propValue) {
            if (prop.slice(0, 2) === "on") {
                const eventName = prop.slice(2).toLowerCase();
                newElement.removeEventListener(eventName, oldPropValue);
            } else if (prop !== "children") {
                newElement.removeAttribute(prop);
            }
        }
    });
    newElement._virtualDom = virtualDom;
}

```

删除节点操作：

```js
const reconcileChildren = (fiber, children) => {
    //当children是根fiber对象时，children是对象，当是用creaeElement方法创建的，则是数组
    // 将children转成数组统一处理
    const arrifiedChildren = arrified(children);
    let index = 0,
        element = null,
        length = arrifiedChildren.length,
        newFiber = null,
        prevFiber = null;
    let alternate = null; // 存储每一个子节点对应的旧fiber节点
    if (fiber.alternate && fiber.alternate.child) {
        alternate = fiber.alternate.child;
    }
    // 保证我们删除的时候可以进入
    while (index < length || alternate) {
        element = arrifiedChildren[index];
        if (!element && alternate) {
            //说明子节点中有删除
            alternate.effectTag = "delete";
            // 将删除操作添加到新的fiber对象中
            fiber.effects.push(alternate);
        } else if (element && alternate) {
            // 更新节点
            // 节点的类型不同
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: "update", // 更新节点
                // stateNode: null,
                parent: fiber,
                alternate, // 当前节点对应的旧的fiber对象
            };
            // 更新节点
            if (element.type !== alternate.type) {
                // 给新创建的fiber对象添加stateNode属性
                newFiber.stateNode = createStateNode(newFiber);
            } else {
                // 节点的类型相同，用旧的几点代替新的节点
                newFiber.stateNode = alternate.stateNode;
            }
        } else if (element && !alternate) {
            // 初始渲染
            // 将当前的虚拟dom构建成fiber对象
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: "placement", // 添加节点
                // stateNode: null,
                parent: fiber,
            };
            // 给新创建的fiber对象添加stateNode属性
            newFiber.stateNode = createStateNode(newFiber);
        }

        // 更新胡后续的child节点对应的alternate
        if (alternate && alternate.subling) {
            alternate = alternate.subling;
        } else {
            alternate = null;
        }

        if (index == 0) {
            // 作为当前节点的child
            fiber.child = newFiber;
        } else if (element) {
            //避免删除节点的时候去添加过去的节点
            //作为前一个兄弟节点的邻居节点
            prevFiber.subling = newFiber;
        }
        prevFiber = newFiber;
        index++;
    }
};

```

`alternate`存在时且`element`不存在时(本质上是子节点的数量减少，先更新同位置的子节点，再去删除多余子节点)。然后在`commit`的时候去处理`dom`:

```js

const commitAllWork = (fiber) => {
    fiber.effects.forEach((subFiber) => {
        if (subFiber.effectTag === "delete") {
            // 删除节点
            subFiber.parent.stateNode.removeChild(subFiber.stateNode);
        } else if (subFiber.effectTag === "update") {
            // 更新dom节点
            if (subFiber.type !== subFiber.alternate.type) {
                /**
                 * dom节点的类型不同，创建一个新的节点去替换旧的节点
                 */
                subFiber.parent.stateNode.replaceChild(
                    subFiber.stateNode,
                    subFiber.alternate.stateNode
                );
            } else {
                /**
                 * 类型相同，更新节点的内容
                 */
                updateElementNode(
                    subFiber,
                    subFiber.stateNode,
                    subFiber.alternate
                );
            }
        } else if (subFiber.effectTag === "placement") {
            // 添加的过程中忽略掉类组件和函数组件的fiber对象
            let parentFiber = subFiber.parent;

            while (
                parentFiber.tag === "class_component" ||
                parentFiber.tag === "function_component"
            ) {
                parentFiber = parentFiber.parent;
            }
            if (subFiber.tag === "host_component") {
                // 添加节点
                parentFiber.stateNode.appendChild(subFiber.stateNode);
            }
        }

        /**
         * 缓存旧的的fiber节点，为下次比对准备
         */

        fiber.stateNode.__rootFiberContainer = fiber;
    });
};
```