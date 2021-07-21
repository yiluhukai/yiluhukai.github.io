#### VueRouter

`VueRouter`有两种模式：`hash`和`history`:

* `hash`:`http://localhost:8080/#/index?id=123`.
* `history`:`http://localhost:8080/index?id=123`.

两种路由都是客户端来实现的：

* `hash`是基于锚点和`onhashchange`事件来实现的。
  * 当`url`中的`#`后面的内容会作为路径地址
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

最上面一层是类的名称，中间是类的属性，最下面是类中的方法，`-`代表是静态方法，`+`代表是实例方法。

:::

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
      breforeCreate() {
        // 只在选项中有router属性的时候执行一次
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
}
```







