#### VueRouter

`VueRouter`有两种模式：`hash`和`history`:

* `hash`:`http://localhost:8080/#/index?id=123`.
* `history`:`http://localhost:8080/index?id=123`.

两种路由都是客户端来实现的：

* `hash`是基于锚点和`onhashchange`事件来实现的。
  * `url`中的`#`后面的内容会作为路径地址
  * 监听`onhashchange`事件
  * 根据当前路径地址找到对应的组件重新渲染
* `history`是基于`h5`中的`history API`来实现的
  * `history.pushState()`,`IE` 10以后才支持，所以`history在IE10`以前的浏览器中会有兼容性问题，相比较于`history.push()`方法，该方法不会向浏览器后端发送请求，并将当前路由加入到历史记录中。
  * `history.replaceState()`.
  * 通过`history.pushState()`方法去改变地址栏
  * 监听`popState`事件
  * 根据当前的路径地址找到对应的组件重新去渲染

当我们使用`history`模式来路由时，当我们去改变`url`是没有问题的，但是当我们刷新浏览器的时候，我们的`url`会发送给后端，此时如果后端没有对这个路径做处理，那么可能会返回后端定义的`404`页面或者`page not found`等错误。所以当我们使用`history`模式的路由时，需要后端去配合（在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面）

#### `node`中使用`history`路由模式

```js
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})
```

我们可以借助`connect-history-api-fallback`中间件来实现，只需要将打包后的文件放入`../web`文件下既可。

#### `ngix`中使用`history`模式：

* 安装`nginx`:`brew install nginx`

* 使用`brew info nginx`查看安装的目录：

  ```shell
  $ brew info nginx 
  nginx: stable 1.21.1 (bottled), HEAD
  HTTP(S) server and reverse proxy, and IMAP/POP3 proxy server
  https://nginx.org/
  /usr/local/Cellar/nginx/1.21.1 (25 files, 2.2MB) *
    Poured from bottle on 2021-07-11 at 23:03:10
  From: https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/nginx.rb
  License: BSD-2-Clause
  ==> Dependencies
  Required: openssl@1.1 ✔, pcre ✔
  ==> Options
  --HEAD
          Install HEAD version
  ==> Caveats
  Docroot is: /usr/local/var/www
  
  The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
  nginx can run without sudo.
  
  nginx will load all files in /usr/local/etc/nginx/servers/.
  
  To have launchd start nginx now and restart at login:
    brew services start nginx
  Or, if you don't want/need a background service you can just run:
    nginx
  ==> Analytics
  install: 35,965 (30 days), 122,590 (90 days), 501,389 (365 days)
  install-on-request: 35,870 (30 days), 122,312 (90 days), 497,408 (365 days)
  build-error: 0 (30 days)
  ```

* 将打包的后文件`copy`到`/usr/local/Cellar/nginx/1.21.1/html`下，然后启动`nginx`:

  ```shell
   #(if you don't want/need a background service you can just run:nginx)
   brew services start nginx
  ```

* 然后去访问`http://localhost:8080`,可以看到我们之前打包的文件，当我们改变路由后并刷新时：`404 Not Found`.

* 解决这个问题我们需要去修改配置文件：`/usr/local/etc/nginx/nginx.conf`

  ```shell
     server {
          listen       8080;
          server_name  localhost;
  
          #charset koi8-r;
  
          #access_log  logs/host.access.log  main;
  
          location / {
              root   html;
              index  index.html index.htm;
              try_files $uri $uri/ /index.html;
          }
  
          #error_page  404              /404.html;
  
          # redirect server error pages to the static page /50x.html
          #
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   html;
          }
  
          # proxy the PHP scripts to Apache listening on 127.0.0.1:80
          #
          #location ~ \.php$ {
          #    proxy_pass   http://127.0.0.1;
          #}
  
          # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
          #
          #location ~ \.php$ {
          #    root           html;
          #    fastcgi_pass   127.0.0.1:9000;
          #    fastcgi_index  index.php;
          #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
          #    include        fastcgi_params;
          #}
  
          # deny access to .htaccess files, if Apache's document root
          # concurs with nginx's one
          #
          #location ~ /\.ht {
          #    deny  all;
          #}
      }
  ```

  `try_files $uri $uri/ /index.html`当`$url`对应的路径找不到时，先去`$url`文件夹下找，找不到了在返回`/index.html`.然后我们重启nginx.重复上面额操作，发现``404 Not Found`.`的问题解决了。

  ```shell
  # nginx -s reload
  brew services restart nginx
  ```


#### VueRouter使用的核心代码

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

```

* 上面的使用过程中我们可以看到`VueRouter`是一个`Vue`的`plugin`.同时是一个构造函数或者类。
* 创建`Vue`实例的时候传入`router`是为了在`Vue`的原型上挂载`$router`属性

:::tip

安装 Vue.js 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。

该方法需要在调用 `new Vue()` 之前被调用。

当 install 方法被同一个插件多次调用，插件将只会被安装一次。

:::

#### `VueRouter`类

![VueRouter](/frontEnd/VueRouter.png)

:::tip

最上面一层是类的名称，中间是类的属性，最下面是类中的方法，`_`代表是静态方法，`+`代表是实例方法。

:::

* `options`属性用来保存我们创建`router`实例时传入的选项
* `data`是一个响应式对象，用来保存我们当前的路由地址
* `routeMap`是路由地址和组件相关的键值对对象
* `install`方法是`vue`插件的通用接口
* `constructor`接受选项来创建`VueRouter`实例
* `createRouteMap`方法将`options`中的`routes`数组转换成`routeMap`对象
* `ininComponents`方法用来创建`router-link`和`router-view`组件
* `initEvent`方法用来添加`popstate`事件监听
* `init`方法是对上面三个方法的统一调用

#### 手写VueRouter

`Vue`是一个类且是一个`Vue`的插件，所以他应该实现一个静态的`install`方法：

```js
// VueRouter是一个类，同时拥有一个install方法
let _Vue = null;
export class VueRouter {
  static install(Vue) {
    // 01 保证这个插件只被加载一次
    // 由于webpack再处理模块加载的时候会有缓存，所以导入的VueRouter实质上一个类
    // 而类中的静态方法也是类共享的
    // 所以VueRouter.install.installed是唯一的
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    // 02 将Vue保存到模块外部变量中已备后续去使用
    _Vue = Vue;
    // 03 创建Vue实例时，将选项中的router到Vue的原型上
    // _Vue.prototype.$router = this.$options.router
    // 这里的this是Vue的实例，我们这里访问不到，但是我们可以通过混入的方法
    _Vue.mixin({
      beforeCreate() {
        // 只在选项中有router属性的时候执行一次
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
}
```

实现构造方法：

```js

  // 实现构造函数
  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

```

:::tip

### [Vue.observable( object )](https://cn.vuejs.org/v2/api/#Vue-observable)

一个对象可响应。Vue 内部会用它来处理 `data` 函数返回的对象。

返回的对象可以直接用于[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)和[计算属性](https://cn.vuejs.org/v2/guide/computed.html)内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景：

```
const state = Vue.observable({ count: 0 })

const Demo = {
  render(h) {
    return h('button', {
      on: { click: () => { state.count++ }}
    }, `count is: ${state.count}`)
  }
}
```

:::

实现`createRouteMap`:

```js
 // 将传入的routes转换成转换成键值对的形式
  createRouterMap () {
    this.options.routes.forEach(
      route => (this.routeMap[route.path] = route.component)
    )
  }
```

实现`ininComponents`:

```js
  // 创建router-view和router-link组件
  ininComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      template: '<a :herf="to"> <slot></slot> </a>'
    })
  }
```

`init`方法中统一调用：

```js
init () {
    this.createRouteMap()
    this.ininComponents(_Vue)
 }
```

在`install`方法中调用`init`方法：

```js
  static install (Vue) {
    // 01 保证这个插件只被加载一次
    // 由于webpack再处理模块加载的时候会有缓存，所以导入的VueRouter实质上一个类
    // 而类中的静态方法也是类共享的
    // 所以VueRouter.install.installed是唯一的
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 02 将Vue保存到模块外部变量中已备后续去使用
    _Vue = Vue
    // 03 创建Vue实例时，将选项中的router到Vue的原型上
    // _Vue.prototype.$router = this.$options.router
    // 这里的this是Vue的实例，我们这里访问不到，但是我们可以通过混入的方法
    _Vue.mixin({
      beforeCreate () {
        // 只在选项中有router属性的时候执行一次
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
```

在项目中调用我们的实现：

```js
import Vue from 'vue'
// import VueRouter from "vue-router";
import { VueRouter } from '../vueRouter'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

运行服务会发现报错：

```js
vue.runtime.esm.js?2b0e:619 [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
```

要想搞清楚这个错误的来源，我们需要了解Vue的构建版本

*  运行版本：不支持`template`模块,需要打包的时候提前编译
* 完整版：包含运行时和编译器，体积比运行时版本大10k,程序运行时把模版转换成`render`函数

:::tip

单文件组件为啥可以运行？

当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

预编译模板最简单的方式就是使用[单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 [vue-template-loader](https://github.com/ktsn/vue-template-loader)，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

:::

接下来我们解决使用`Vue-cli`生成的项目中使用`vue`版本是运行时版本而不能使用`template`的问题

方法一：在`vue.config.js`中配置`runtimeCompiler`为`true`

:::tip

### [#](https://cli.vuejs.org/zh/config/#runtimecompiler)runtimeCompiler

- Type: `boolean`

- Default: `false`

  是否使用包含运行时编译器的 Vue 构建版本。设置为 `true` 后你就可以在 Vue 组件中使用 `template` 选项了，但是这会让你的应用额外增加 10kb 左右。

  更多细节可查阅：[Runtime + Compiler vs. Runtime only](https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时)。

### [#](https://cli.vuejs.org/zh/config/#transpiledependencies)

:::

方法二：使用`render`函数(可以直接在运行时版本中使用)

:::tip

### [render](https://cn.vuejs.org/v2/api/#render)

- **类型**：`(createElement: () => VNode) => VNode`

- **详细**：

  字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 `createElement` 方法作为第一个参数用来创建 `VNode`。

  如果组件是一个函数组件，渲染函数还会接收一个额外的 `context` 参数，为没有实例的函数组件提供上下文信息。

  Vue 选项中的 `render` 函数若存在，则 Vue 构造函数不会从 `template` 选项或通过 `el` 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。

:::

我们使用`render`函数来重构我们的`vue-link`组件：

```js
 // 创建router-view和router-link组件
  ininComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      // 第一个参数是标签，第二个参数是属性，第三个参数是子元素(数组)
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          }
        }, [this.$slots.default])
      }
      // template: '<a :herf="to"> <slot></slot> </a>'
    })
  }
```

实现`router-view`组建：

```js

 Vue.component('router-view', {
      // 直接渲染一个组件
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
```

此时我们可以看到路由对应的视图，但是当我们点击跳转链接的时候，会发现每次地址栏的链接修改的同时，会刷新浏览器，这并不是我们想要的效果。我们需要禁用超链接的默认行为，使用`pushState`来改变地址栏的状态。

```js
   Vue.component('router-link', {
      props: {
        to: String
      },
      // 第一个参数是标签，第二个参数是属性，第三个参数是子元素(数组)
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          // 绑定事件
          on: {
            click: this.clickHandle
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandle (e) {
          // 不会触发popstate事件
          history.pushState({}, '', this.to)
          // data是响应式，可以触发视图的重新渲染
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :herf="to"> <slot></slot> </a>'
    })

```

此时我们点击跳转链接已经可以正常的切换路由了。但是当我们点击导航栏的前进和后退按钮，地址栏切换了，但是组件没有更新，这个时候我们需要去监听`popstate`事件：

```js
  init () {
    this.createRouteMap()
    this.ininComponents(_Vue)
    this.initEvent()
  }

  initEvent () {
    // popstate事件是我们点击地址栏历史记录的前进和后退的时候触发的
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }

```

:::tip

`history.pushState()和history.replaceState()`不会触发`popState`事件

:::

完整的代码：

```js
// VueRouter是一个类，同时拥有一个install方法
let _Vue = null
export class VueRouter {
  static install (Vue) {
    // 01 保证这个插件只被加载一次
    // 由于webpack再处理模块加载的时候会有缓存，所以导入的VueRouter实质上一个类
    // 而类中的静态方法也是类共享的
    // 所以VueRouter.install.installed是唯一的
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 02 将Vue保存到模块外部变量中已备后续去使用
    _Vue = Vue
    // 03 创建Vue实例时，将选项中的router到Vue的原型上
    // _Vue.prototype.$router = this.$options.router
    // 这里的this是Vue的实例，我们这里访问不到，但是我们可以通过混入的方法
    _Vue.mixin({
      beforeCreate () {
        // 只在选项中有router属性的时候执行一次
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  // 实现构造函数
  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  // 将传入的routes转换成转换成键值对的形式
  createRouteMap () {
    this.options.routes.forEach(
      route => (this.routeMap[route.path] = route.component)
    )
  }

  // 创建router-view和router-link组件
  ininComponents (Vue) {
    const self = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      // 第一个参数是标签，第二个参数是属性，第三个参数是子元素(数组)
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          // 绑定事件
          on: {
            click: this.clickHandle
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandle (e) {
          // 不会触发popstate事件
          history.pushState({}, '', this.to)
          // data是响应式，可以触发视图的重新渲染
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :herf="to"> <slot></slot> </a>'
    })

    Vue.component('router-view', {
      // 直接渲染一个组件
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  init () {
    this.createRouteMap()
    this.ininComponents(_Vue)
    this.initEvent()
  }

  initEvent () {
    // popstate事件是我们点击地址栏历史记录的前进和后退的时候触发的
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}

```



