#### Vue.js响应式原理

##### 数据驱动

* 数据响应式
  * 数据模型仅仅是普通的`JavaScript`对象，当我们修改了数据，视图会进行更新，避免了繁琐的`dom`操作，提高了开发效率。
* 双向绑定
  * 数据改变，视图改变，视图改变，数据也随之改变
  * 我们使用`v-model`指令在表单元素上实现双向数据绑定
* 数据驱动是`Vue`最独特的特性之一
  * 开发过程中只需要关注数据，而不用关注它如何渲染到视图

##### Vue响应式的核心原理

###### Vue2.x

* [Vue 2.x的响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
* [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
* `Vue` 不支持 `IE8`以及更低版本浏览器

:::tip

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 `data` 选项，Vue 将遍历此对象所有的 property，并使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 把这些 property 全部转为 [getter/setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#定义_getters_与_setters)。`Object.defineProperty` 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

:::

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
    <div id="app">
        hello world
    </div>
    <script>
        // 原始的数据
        const data = {
            msg:"Hello",
            count:10
        }
        // 使用Object.defineProperty对data进行数据拦截
        const vm = {}
        Object.keys(data).forEach( key =>{
            Object.defineProperty(vm, key,{
                enumerable:true,
                configurable:true,
                set(val){
                    // 更新的data中的值
                    console.log('set val')
                    data[key] =  val 
                    document.querySelector('#app').textContent = val
                },
                get(){
                    console.log('get val')
                    return data[key]
                }
            })
        })
        console.log(vm)
        vm.msg ="hello"
    </script>
</body>
</html>
```

:::tip

我们这里数据还是在原始的data对象中存储着，我们只是使用`Object.defineProperty`对原始数据做了一层拦截。

:::

###### Vue3.x

* [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
* 监听对象中所有属性的变化
* `ES6`新增，IE不支持，性能由浏览器优化

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
    <div id="app">
        app
    </div>

    <script>
        const data ={
            msg:"",
            count:10
        }
        // 使用Proxy拦截data对象
        const vm  = new Proxy(data,{
            get(target,key){
                console.log('get')
                return target[key]
            },
            set(target,key,val){
                if(val === target[key]){
                    return
                }
                console.log('set val')
                target[key] = val
                document.querySelector("#app").textContent =  val
            }
        })
    </script>
</body>
</html>
```

##### 发布/订阅模式和观察者模式

###### 发布/订阅模式

* 发布/订阅模式
  * 发布/订阅模式由发布者、订阅者、信号中心组成
  * 订阅者从信号中心订阅消息
  * 发布者负责向信号中心发布消息
  * 信号中心则负责接收发布消息并向订阅者发送通知
* [Vue中的自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)

```js
const vm = new Vue()
// 订阅事件
vm.$on('doSomething',()=>{})
vm.$on('doSomething',()=>{})

// 发布事件
vm.$emit('doSomething')
vm.$emit('doSomething')
```

:::tip

发布者、订阅者、信号中心都是`vm`对象。

:::

```js
const eventBus = new Vue()

// ComponentA  中订阅

created(){
  eventBus.$on('update',(val)=>{ })
}

// ComponentB 发布
addTodo(){
 	eventBus.$emit('update', '124') 
}
```

:::tip

发布者是`ComponentB`，订阅者是`ComponentA`、信号中心都是`eventBus`对象。

:::

* 模拟实现Vue中的自定义事件

```js

class EventEmitter{
    constructor(){
        // 以键值对的形式存储事件和事件处理函数 { [string]: Array }
        this.hub = {}
    }
    // 订阅事件的方法
    $on(eventName,func){
        if(!this.hub[eventName]){
            this.hub[eventName] = []
        }
        this.hub[eventName].push(func)
    }
    // 发布事件的方法

    $emit(eventName){
        if(this.hub[eventName]){
            this.hub[eventName].forEach( func => {
                func()
            });
        }
    }
}

// test code


const eventBus  =  new EventEmitter()

eventBus.$on('event1',function(){
    console.log('hello')
})

eventBus.$emit('event1')
```
###### 观察者模式

* 观察者(相当于发布/订阅模式中的订阅者) `--watcher`
  * `update()`:当事件触发的时候，具体要做的事情
* 目标(发布者)：`Dep`
  * `subs`:保存所有的观察者
  * `addSub()`：添加观察者
  * `notify()`: 当事件发生时，调用所有观察者的`update`方法。
* 观察者模式和发布/订阅模式的最大差别就是观察者模式没有信号中心。所以发布者需要依赖观察者。

```js
// 目标：发布者
class Dep{
    constructor(){
        this.subs = []
    }
    // 添加观察者
    addSub(sub){
        this.subs.push(sub)
    }

    // 发布消息
    notify(){
        this.subs.forEach( sub => sub && sub.update && sub.update())
    }
}



class Watcher{
    update(){
        console.log('update method')
    }
}


// test Code

const dep = new Dep()

const watcher =  new Watcher()

dep.addSub(watcher)
dep.notify()

```

#### Vue响应式原理模拟

我们自己实现一个简化版的`Vue.js`,大概结构如下：

![Vue结构图](/frontEnd/vue-structure.png)

`Vue`

* 功能
  * 负责接收初始化的`options`参数
  * 负责把`data`中的属性注入到`vue`实例中，转化成`getter/setter`方法
  * 负责调用`observer`监听`data`中属性的变化
  * 负责调用`compiler`去解析指令和差值表达式
* 结构

![Vue实例](/frontEnd/vue-instance.png)

:::tip

`+`代表属性，`-`代表实例方法。

:::

```js

class Vue{
    constructor(options = {} ){
        // 01 保存传入的options属性选项
        this.$options =  options
        this.$data =  options.data || {}
        // 如果是选择器，那么需要自己获取dom 对象，如果是dom对象则直接使用
        this.$el = typeof options.el=== 'string' ? document.querySelector(options.el): options.el 
        // 02 将data中的属性转化为vue实例的getter/setter方法
        this._proxyData(this.$data)

        // 03 调用observer实例的，监听data变化

        // 04 调用compiler解析指令和差值表达式
    
    }

    _proxyData(data){
        Object.keys(data).forEach( key => {
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                set(val){
                    if(val === data[key]){
                        return 
                    }
                    data[key] = val
                },
                get(){
                    return data[key]
                }
            })
        })
    }
}
```

`Observer`

* 功能 
  * 将`data`选项中的属性转化成响应式的
  * 如果`data`中某个属性是对象，那么对象的属性也需要转化成响应式的 
  * 数据变化时发送通知
* 结构

![Observer实例](/frontEnd/observer.png)

:::tip

`walk()`负责遍历对象的属性，调用`defineReactive()`方法将属性变成响应式的。 

:::	

```js
class Observer {
    constructor(data){
        this.walk(data)
    }   
    
    // 遍历对象的属性
    walk(data){
        if(!data || typeof data !=='object'){
            return
        }
        Object.keys(data).forEach(key=> this.defineReactive(data,key,data[key]))
    }
    // 将对象的属性转化成响应式的
    defineReactive(data,key,value){
        // 如果value 是一个对象，对象的属性也要转化成响应式
        const that = this
        this.walk(value)
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:true,
            get(){
                return value
            },
            set(newValue){
                if(newValue === value){
                    return 
                }
                value = newValue
                 // 当我们修改对象中的属性为一个对象的时，这个对象中的数据也要是响应式的
                that.walk(newValue)
         				// 数据变化时发送通知
            }
        })
    }
}
```

:::tip

`defineReactive(data,key,value)`为什么需要第三个参数不是能使用`data[key]`去直接获取呢，原因在于我们将`data`的属性转化为`gettter/setter`方法，当我获取`data`的一个属性`a`时，会去调用对应的`get`方法，方法中再用`data[a]`去获取对象的值，会发生循环调用。此外这里的`value`和`get`、`set`方法形成了一个闭包。

:::

我们在`Vue`类中调用`Observer`实例将`data`变成响应式的。

```js
 constructor(options = {} ){
        // 01 保存传入的options属性选项
        this.$options =  options
        this.$data =  options.data || {}
        // 如果是选择器，那么需要自己获取dom 对象，如果是dom对象则直接使用
        this.$el = typeof options.el=== 'string' ? document.querySelector(options.el): options.el 
        // 02 将data中的属性转化为vue实例的getter/setter方法
        this._proxyData(this.$data)

        // 03 调用observer实例的，监听data变化
        new Observer(this.$data)
        // 04 调用compiler解析指令和差值表达式
    
    }
```

`Compiler`

* 功能
  * 负责编译模版，处理差值表达式和指令
  * 负责页面首次渲染
  * 当数据发生改变时，重新渲染视图
  * 这里我们没有实现虚拟`dom`,仅仅是在数据变化的时候操作dom去更新视图
* 结构

![Compiler类](/frontEnd/compiler.png)

```js

class Compiler{
    constructor(vm){
        this.el = vm.$el
        this.vm =  vm
        this.compile(this.el)
    }
    // 负责编译模版
    compile(el){
        // 获取元素的子节点
        const childNodes  = el.childNodes
        Array.from(childNodes).forEach( childNode => {
            // 根据节点的类型来调用不同的编译方法
            if(this.isTextNode(childNode)){
                this.compileText(childNode)
            }else if(this.isElementNode(childNode)){
                this.compileElement(childNode)
            }
            // 当前节点如果还有子节点，递归调用去编译子节点
            if(childNode.childNodes&&childNode.childNodes.length){
                this.compile(childNode)
            }
        })
    }
    // 编译元素节点
    compileElement(node){
        // 主要是对元素上的指令做解析
        // 获取元素的所有属性
        const attrs  = node.attributes
        Array.from(attrs).forEach(attr => {
            const attrName =  attr.name
            if(this.isDirective(attrName)){
                //是一个指令 v-text 、v-model
                const name = attrName.substring(2)
                this.update(node,name, attr.value)
            }
        })
    }

    update(node,name,key){
        const func = this[name + 'Updater']
        func && func(node,this.vm[key])
    }
    // 处理text指令
    textUpdater(node,value){
        node.textContent = value
    }
    // 处理model指令
    modelUpdater(node,value){
        node.value = value
    }

    // 编译文本节点
    compileText(node){
        // {{ msg }} 使用正则表达式去匹配
        // +号后面的？代表非贪婪匹配
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if(reg.test(value)){
            //是差值表达式
            // 提取其中的msg作为key
            const key =  RegExp.$1.trim()
            // 将 {{ msg}} 替换成具体的值
            node.textContent = value.replace(reg,this.vm[key])
        }
    }

    // 判断是否是指令

    isDirective(attrName){
        return attrName.startsWith('v-')
    }
    // 判断是否是文本节点
    isTextNode(node){
        return node.nodeType === 3
    }
    // 判断是否是元素节点
    isElementNode(node){
        return node.nodeType === 1
    }
}
```

在`Vue类中`加入模版编译，

```js
constructor(options = {} ){
        // 01 保存传入的options属性选项
        this.$options =  options
        this.$data =  options.data || {}
        // 如果是选择器，那么需要自己获取dom 对象，如果是dom对象则直接使用
        this.$el = typeof options.el=== 'string' ? document.querySelector(options.el): options.el 
        // 02 将data中的属性转化为vue实例的getter/setter方法
        this._proxyData(this.$data)

        // 03 调用observer实例的，监听data变化
        new Observer(this.$data)
        // 04 调用compiler解析指令和差值表达式
        new Compiler(this)
    }
```

`Dep(Dependency)`

![Dep](/frontEnd/dep.png)

* 功能 
  * 收集依赖，添加观察者(`watcher`)
  * 通知所有观察者
* 结构

![Dep类](/frontEnd/dep-structure.png)

```js
class Dep{
    constructor(){
        this.subs = []
    }
    // 添加观察者
    addSub(sub){
        if(sub && sub.update){
            this.subs.push(sub)
        } 
    }
    // 发布消息
    notify(){
        this.subs.forEach( sub => sub.update())
    }
}
```

`Watcher`

![Watcher](/frontEnd/watcher.png)

* 功能
  * 当数据变化时触发依赖，`dep`通知所有的`watcher`更新视图
  * 自身实例化时向`dep`对象中添加自己
* 结构

![Watcher类](/frontEnd/watcher-structure.png)

```js
class Watcher{
    constructor(vm,key,cb){
        // vue实例
        this.vm = vm
        // vm对应的key
        this.key =  key
        // 数据更新时更新视图的方法
        this.cb = cb
        // 获取原始数据的时候，会触发data中的get方法
        // 所以可以在data的get方法中添加观察者到dep
        Dep.target = this
        this.oldValue = vm[key]
        Dep.target = null
    }

    update(){
        const newValue = this.vm[this.key]
        if( newValue=== this.oldValue){
            rerurn
        } 
        // 方便下一次的对比
        this.oldValue = newValue
        this.cb(newValue)
    }
}
```

在`Observer`类中为不同的属性添加dep，当属性变化时发送通知 

```js
class Observer {
    constructor(data){
        this.walk(data)
    }   
    
    // 遍历对象的属性
    walk(data){
        if(!data || typeof data !=='object'){
            return
        }
        Object.keys(data).forEach(key=> this.defineReactive(data,key,data[key]))
    }
    // 将对象的属性转化成响应式的
    defineReactive(data,key,value){
        // 如果value 是一个对象，对象的属性也要转化成响应式
        const that = this
        this.walk(value)
        const dep = new Dep()
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue){
                if(newValue === value){
                    return 
                }
                value = newValue
                 // 当我们修改对象中的属性为一个对象的时，这个对象中的数据也要是响应式的
                that.walk(newValue)
                // 发送通知给watcher
                dep.notify()
            }
        })
    }
}
```

```js
  // Compiler
  update(node,name,key){
        const func = this[name + 'Updater']
        func && func.call(this, node, key)
    }
    // 处理text指令
    textUpdater(node,key){
        node.textContent = this.vm[key]
        // 为当前的节点添加一个watcher到对应key的dep中
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent = newValue
        })
    }
    // 处理model指令
    modelUpdater(node, key){
        node.value = this.vm[key]
         // 为当前的节点添加一个watcher到对应key的dep中
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue
        })
    }

    // 编译文本节点
    compileText(node){
        // {{ msg }} 使用正则表达式去匹配
        // +号后面的？代表非贪婪匹配
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if(reg.test(value)){
            //是差值表达式
            // 提取其中的msg作为key
            const key =  RegExp.$1.trim()
            // 将 {{ msg}} 替换成具体的值
            node.textContent = value.replace(reg,this.vm[key])

            // 为当前的节点添加一个watcher到对应key的dep中
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent = newValue
            })

        }
    }
```

:::tip

当我们第一次处理编译模版时，为不同的`dom`节点创建`watcher`,同时`vm.$data`中的不同`key`的`get`方法，将`watcher`保存到`dep`中，同时`dep`位于这个`key`的闭包上，当我们修改了这个key对应的值，会触发`dep`的`notify`方法去通知`watcher`更新视图。

:::

处理`v-model`指令的双向绑定：表单元素的值变化会触发`input`事件，我们只需在这个事件处理函数中修改`data`中对应的`key`即可

```js

  // 处理model指令
    modelUpdater(node, key){
        node.value = this.vm[key]
        // 实现双向数据绑定
        node.addEventListener('input',(e)=>{
            this.vm[key] = node.value //e.target.value
        })
         // 为当前的节点添加一个watcher到对应key的dep中
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue
        })
    }
```

#### 完整代码

* 结构

```shell
.
├── index.html
└── js
    ├── compiler.js
    ├── dep.js
    ├── observer.js
    ├── vue.js
    └── watcher.js
```

```html

<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mini Vue</title>
</head>
<body>
    <div id="app">
    <h1>差值表达式</h1>
    <h3>{{ msg }}</h3>
    <h3>{{ count }}</h3>
    <h1>v-text</h1>
    <div v-text="msg"></div>
    <h1>v-model</h1>
    <input type="text" v-model="msg">
    <input type="text" v-model="count">
    </div>
    <script src="./js/dep.js"></script>
    <script src="./js/watcher.js"></script>
    <script src="./js/compiler.js"></script>
    <script src="./js/observer.js"></script>
    <script src="./js/vue.js"></script>
    <script>
    let vm = new Vue({
        el: '#app',
        data: {
        msg: 'Hello Vue',
        count: 100,
        person: { name: 'zs' }
        }
    })
    console.log(vm.msg)
    // vm.msg = { test: 'Hello' }
    vm.test = 'abc'
</script>
</body>
</html>

```

:::tip

`Watcher`的创建依赖了`Dep`,所以`dep.js`应该在`watcher.js`之前引入。

:::

`dep.js`

```js
class Dep{
    constructor(){
        this.subs = []
    }
    // 添加观察者
    addSub(sub){
        if(sub && sub.update){
            this.subs.push(sub)
        } 
    }
    // 发布消息
    notify(){
        this.subs.forEach( sub => sub.update())
    }
}
```

`watcher.js`

```js
class Watcher{
    constructor(vm,key,cb){
        // vue实例
        this.vm = vm
        // vm对应的key
        this.key =  key
        // 数据更新时更新视图的方法
        this.cb = cb
        // 获取原始数据的时候，会触发data中的get方法
        // 所以可以在data的get方法中添加观察者到dep
        Dep.target = this
        this.oldValue = vm[key]
        Dep.target = null
    }

    update(){
        const newValue = this.vm[this.key]
        if( newValue=== this.oldValue){
            rerurn
        } 
        // 方便下一次的对比
        this.oldValue = newValue
        this.cb(newValue)
    }
}
```

`compiler.js`

```js
/*
 * @Author: your name
 * @Date: 2021-08-01 21:06:00
 * @LastEditTime: 2021-08-01 23:34:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /js-code/vue-observer/vuejs/js/compiler.js
 */
class Compiler{
    constructor(vm){
        this.el = vm.$el
        this.vm =  vm
        this.compile(this.el)
    }
    // 负责编译模版
    compile(el){
        // 获取元素的子节点
        const childNodes  = el.childNodes
        Array.from(childNodes).forEach( childNode => {
            // 根据节点的类型来调用不同的编译方法
            if(this.isTextNode(childNode)){
                this.compileText(childNode)
            }else if(this.isElementNode(childNode)){
                this.compileElement(childNode)
            }
            // 当前节点如果还有子节点，递归调用去编译子节点
            if(childNode.childNodes&&childNode.childNodes.length){
                this.compile(childNode)
            }
        })
    }
    // 编译元素节点
    compileElement(node){
        // 主要是对元素上的指令做解析
        // 获取元素的所有属性
        const attrs  = node.attributes
        Array.from(attrs).forEach(attr => {
            const attrName =  attr.name
            if(this.isDirective(attrName)){
                //是一个指令 v-text 、v-model
                const name = attrName.substring(2)
                this.update(node,name, attr.value)
            }
        })
    }

    update(node,name,key){
        const func = this[name + 'Updater']
        func && func.call(this, node, key)
    }
    // 处理text指令
    textUpdater(node,key){
        node.textContent = this.vm[key]
        // 为当前的节点添加一个watcher到对应key的dep中
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent = newValue
        })
    }
    // 处理model指令
    modelUpdater(node, key){
        node.value = this.vm[key]
        // 实现双向数据绑定
        node.addEventListener('input',(e)=>{
            this.vm[key] = node.value //e.target.value
        })
         // 为当前的节点添加一个watcher到对应key的dep中
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue
        })
    }

    // 编译文本节点
    compileText(node){
        // {{ msg }} 使用正则表达式去匹配
        // +号后面的？代表非贪婪匹配
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if(reg.test(value)){
            //是差值表达式
            // 提取其中的msg作为key
            const key =  RegExp.$1.trim()
            // 将 {{ msg}} 替换成具体的值
            node.textContent = value.replace(reg,this.vm[key])

            // 为当前的节点添加一个watcher到对应key的dep中
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent = newValue
            })

        }
    }

    // 判断是否是指令

    isDirective(attrName){
        return attrName.startsWith('v-')
    }
    // 判断是否是文本节点
    isTextNode(node){
        return node.nodeType === 3
    }
    // 判断是否是元素节点
    isElementNode(node){
        return node.nodeType === 1
    }
}

```

`observer.js`

```js
class Observer {
    constructor(data){
        this.walk(data)
    }   
    
    // 遍历对象的属性
    walk(data){
        if(!data || typeof data !=='object'){
            return
        }
        Object.keys(data).forEach(key=> this.defineReactive(data,key,data[key]))
    }
    // 将对象的属性转化成响应式的
    defineReactive(data,key,value){
        // 如果value 是一个对象，对象的属性也要转化成响应式
        const that = this
        this.walk(value)
        const dep = new Dep()
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue){
                if(newValue === value){
                    return 
                }
                value = newValue
                 // 当我们修改对象中的属性为一个对象的时，这个对象中的数据也要是响应式的
                that.walk(newValue)
                // 发送通知给watcher
                dep.notify()
            }
        })
    }
}
```

`vue.js`

```js
class Vue{
    constructor(options = {} ){
        // 01 保存传入的options属性选项
        this.$options =  options
        this.$data =  options.data || {}
        // 如果是选择器，那么需要自己获取dom 对象，如果是dom对象则直接使用
        this.$el = typeof options.el=== 'string' ? document.querySelector(options.el): options.el 
        // 02 将data中的属性转化为vue实例的getter/setter方法
        this._proxyData(this.$data)

        // 03 调用observer实例的，监听data变化
        new Observer(this.$data)
        // 04 调用compiler解析指令和差值表达式
        new Compiler(this)
    }

    _proxyData(data){
        Object.keys(data).forEach( key => {
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                set(val){
                    if(val === data[key]){
                        return 
                    }
                    data[key] = val
                },
                get(){
                    return data[key]
                }
            })
        })
    }
}
```

