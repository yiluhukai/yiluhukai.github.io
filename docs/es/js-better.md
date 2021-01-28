

##  JS性能优化

### 什么是性能优化

所谓的性能优化就是提升代码的运行效率、减少代码运行时资源消耗。而JS性能优化就是在这门语言中优化代码的性能。

### JS的内存管理

内存:可读写单元，表示一片可操作的区域。

管理:人为的操作一片空间的申请、使用和释放

内存管理：开发者主动去申请内存空间、使用内存空间、和释放内存空间

JS不能像C语言那样主动去申请和释放内存空间，但是我们我还是可通过执行脚本来观察JS中内存使用的生命周期变化

```js
/**
 *
 * 内存管理
 *
 */

// 申请内存

let a = {}

// 使用内存

a.name = 'tom'

// 释放内存

a = null

```

### JS的垃圾回收

* JS中的垃圾
  * JS的内存管理是自动的
  * 对象不再被引用是就是垃圾
  * 对象不能从根上去访问到就是垃圾

当JS的垃圾回收器认为对象是一个垃圾时，就会自动对对象占用的内存地址进行回收。

* JS中的可达对象
  * 可以被访问到对象就是可达对象(引用和作用域链)
  *  可达的标准就是从根(全局对象)上出发可以能被找到。
  * JS中的根可以理解为全局对象

```js
/**
 * 可达对象
 */

function objGroup(obj1, obj2) {
	obj1.next = obj2
	obj2.prev = obj1
	return {
		o1: obj1,
		o2: obj2
	}
}

const obj = objGroup({ name: 'obj1' }, { name: 'obj2' })
```

上面的三个对象都是可达对象，他们之间的关系如下

![reachable](/frontEnd/reachable.png)

当我们断开obj1对象的引用时，obj1就会变成一个垃圾对象

```js
Reflect.deleteProperty(obj, 'o1')

Reflect.deleteProperty(obj.o2, 'prev')
```

![reachable](/frontEnd/garbage.png)

### GC的定义与作用

* GC就是垃圾回收机制的简写

* GC可以找到内存中的垃圾并释放和回收

### GC里面的垃圾

* 程序中不再需要使用到的对象

  ```js
  function Str() {
  	name = 'hello'
  	return `${name} world`
  }
  ```

* 程序中不能再访问到的对象

  ```js
  function Str() {
  	const name = 'hello'
  	return `${name} world`
  }
  ```

### GC算法

* GC是一种机制，垃圾回收器去完成具体的工作
* 工作的内容就是查找垃圾、释放空间、回收空间
* 算法就是工作时查找和回收所遵循的规则

### 常见的GC算法

* 引用计数
* 标记清除
* 标记整理
* 分代回收

### 引用计数算法

引用计数算法的核心就是就是为变量设置引用计数器。当变量的引用计数器为0被GC回收。

```js
/**
 *
 * 引用计数
 *
 */

const a = { name: 'a' }

const b = { name: 'b' }

const list = [a.name, b.name]

function f() {
	const a = 1
	const b = 1
}

f()
```

根据引用计数的算法:全局变量a,b，list一直有引用全局对象指向他们，所以它们不会被回收.而f执行的时候创建的变量a,b在函数执行过程位于函数的作用域链上，当函数执行结束后不再有引用指向他们，他们就会被回收掉。

* 引用计数算法的好处

  * 发现垃圾时立马回收(引用计数为0)
  * 最大限度减少程序暂停

* 引用计数算法的坏处

  * 时间开销大(要不断的去检测引用数的变化)
  * 无法回收循环引用的对象

  ```js
  function fun() {
  	const a = { name: 'a' }
  	const b = { name: 'b' }
  	a.b = b
  	b.a = a
  	return ''
  }
  // a和b对象相互引用，引用计数器不为0
  fun()
  ```

### 标记清除算法

* 标记清除算法分标记和清除两个阶段完成
* 遍历所有对象去找活动对象(可达对象)
* 遍历所有对象去清除没有标记的对象，将所有清除对象的内存释放并放入空闲链表中，方便下次直接使用。

![标记清除算法示意图](/frontEnd/sign.png)

:::tip

标记清除算法会遍历所有的对象并标记处可达对象，像局部作用域中的对象a1和a2是不可达的，即使循环引用，依旧会被回收。

:::

* 算法的优缺点

  * 优点是可以发现循环引用的不可达对象并回收
  * 缺点是:会造成内存空间碎片,回收后的空间在内存中可能不连续且大小不固定，我们下次要分配的空间不一定满足。
  * 不可以立即回收内存空间

  ![标记清除算法的缺点](/frontEnd/memory.png)

### 标记整理算法

* 标记整理算法是对标记清除算法的增强
* 标记阶段和清除阶段是一样的
* 清除之前会先执行整理操作，移动对象的位置

* 标记阶段

![标记阶段](/frontEnd/before_clear.png)

* 整理阶段

![整理阶段](/frontEnd/arrange.png)

* 清除阶段

![清除阶段](/frontEnd/cleared.png)

* 优缺点：
  * 可以减少内存碎片
  * 不可以立即回收内存空间

### V8介绍

* v8是一款主流的JS执行引擎
* v8采用的即时编译(直接编译成机器码)
* v8内存设限(64 ->1.5G 32->800M),这样子可以快速回收垃圾

### v8的垃圾回收

JS中有基础数据类型和对象数据类型，v8的垃圾回收主要是针对在堆区中分配对象类型的内存空间进行回收,其他的内存空间的回收由语言自身来实现。

* v8的垃圾回收策略

  * v8采用的是分代回收的思想

  * 内存分为新生代和老生代

  * 针对不同的对象采用不同的算法

    ![v8内存回收策略](/frontEnd/v8-gc.png)

* v8中常用的垃圾回收算法

  * 分代回收
  * 空间复制
  * 标记清除
  * 标记整理
  * 增量标记

* v8的内存空间

  * v8会将内存空间分成两部分
  * 小空间用于存储新生代对象(白色部分)（32M|16M，取决于计算机的位数），大空间用于存储老生代对象
  * 新生代对象指的是存活时间较短的对象
  * 老生代对象指的是存活时间比较长的对象
  * 老生代对象存放在老生代区域，64位操作系统的区域是1.4G。32位的操作系统的区域是700M.

  ![v8的内存空间分配](/frontEnd/v8-new.png)

* v8新生代对象的回收策略

  * 回收中采用复制算法+标记整理算法

  * 新生代区域被分成两个等大小的部分From和To

  * 活动对象存储于From区域

  * 标记整理完成后会将From中的对象复制到To中

  * From和To交换空间完成释放原来的From，原来的From会变成To,To变成From

  * 复制的过程中可能会出现晋升(将对象复制到老生代区域)

  * 有两种情况会出现晋升：

    * 新生代对象在一轮GC后依然存在
    * To空间的使用率超过了25%(小于25%当To变成From的后From可以存入新的活动对象)

* v8老生代对象的回收策略
  * 主要用的GC算法有标记清除、标记整理、增量标记算法
  * 当空间充足时使用的是标记清除算法（不用关心内存碎片）
  * 当新生代对象晋升后老生代对象存放不下时，使用标记整理算法同时清除内存碎片
  * 采用增量标记算法进行效率优化
    * 增量标记算法是在程序执行过程中去分段对老生代内存对象进行标记
    * 这样可以程序运行过程中长时间的卡顿,由于内存只有1.4G,直接标记最多不超过1.5秒，使用增量标记每个间隙不会超过50ms.

  ![增量标记算法](/frontEnd/increament.png)

### 使用performance

* 为什么要使用performance
  * GC是为了实现内存空间的良好循环
  * 良好循环的基础是合理使用
  * 时刻关注才能确定是否使用合理
  * 而performance提供了多种监控方式
  
* performance的使用方式
  * 打开浏览器输入网址
  * 进入开发人员工具面板，选择性能
  * 开启录制功能，访问具体的页面
  * 执行用户的行为，一段时间后停止录制
  
* 内存问题的外在表现
  * 页面出现延迟加载或者经常性暂停
  * 页面持续性出现糟糕的性能
  * 页面的性能随时间越来越差
  
* 界定内存问题的标准
  * 内存泄露：内存使用持续升高
  * 内存膨胀：在大多数设备上都存在性能问题
  * 频繁的垃圾回收：通过内存变化图进行分析
  
* 监控内存的几种方式
  * 浏览器任务管理器
  * Timeline时序图记录
  * 堆快照查找分离dom

*  使用任务管理器监控内存

  * 创建一个html文件,文件中嵌入js脚本

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>创建数组</title>
  </head>
  
  <body>
      <button id="btn">创建数组</button>
      <script>
          const btn = document.getElementById("btn")
          btn.addEventListener("click", function () {
              console.log("click")
              let array = Array(10000).fill(1)
          })
      </script>
  </body>
  
  </html>
  ```

  * 在浏览器中执行后打开浏览器的任务管理器(更多工具里面选择任务管理器)

    ![image-20210122211653612](/frontEnd/manager.png)

  * 前面的内存占用的dom占用的内存空间，后面的js使用的内存，其中`()`中的js中所有可达对象占用的内存。
  * 如果前面的内存空间一直变化，说明存在频发的dom操作，而后面`()`中的内存一直增长，说明我们在创建对象。

* 使用timeline工具

  * 使用timeline工具可以实时的检测内存的变化,更方便的定位问题

  * html文件

    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <body>
        <button id="btn">add</button>
        <script>
            const arrList = []
            const fun = function () {
                //  向dom元素上添加新的dom节点
                for (let i = 0; i < 10000; i++) {
                    document.body.append(document.createElement("p"))
                }
                //  向数组中存放字符串
                arrList.push(new Array(10000).join('x'))
            }
            document.getElementById("btn").addEventListener('click', fun)
        </script>
    </body>
    
    </html>
    ```

    ![timeline](/frontEnd/timeline.png)
  
  * 由于我们创建了一个很大的数组去生成字符串，数组不是活动对象，在函数执行完成后会被回收掉，当我们点击几次按钮，会看到js堆上的内存在上下起伏。
  
* 堆快照查找分离dom

  * 堆快照位于浏览器工具的memory下

  * ![堆快照](/frontEnd/heapsnap.png)

  * 分离dom和垃圾dom

    * 界面元素存在于dom树上
    * 分离dom指的是没有挂载在页面的dom树上但是有其他的引用指向它的dom节点
    * 垃圾dom指的是没有挂载在页面的dom树上，也没有其他的引用指向它，会被GC回收。
    
  * html

    * ```html
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      
      <body>
          <!-- 分离dom -->
          <button id="btn"></button>
      
          <script>
              var temp
      
              function test(params) {
                  let ul = document.createElement('ul')
      
                  for (let i = 0; i < 10; i++) {
                      let li = document.createElement('li')
                      ul.appendChild(li)
                  }
      
                  temp = ul
              }
      
              document.getElementById("btn").addEventListener("click", test)
          </script>
      </body>
      
      </html>
      ```

    * 在我们点击按钮之前，先生成一张js堆快照。然后搜索deta搜索不到，说明没有分离dom对象

    * 点击按钮后我们再去生成一张快照，然后搜索deta搜索不到，可以分离的dom节点

      ![分离对象](/frontEnd/deta.png)

    * 我们可以将temp赋值null后，上面的对象会变成垃圾dom被回收

  ### 如何判断是否存在频繁的GC

  * 任务管理器监控内存频繁的增加和减小
  * timelIne中内存频繁的升降

  ### 频繁GC的带来的问题

  * GC工作时应用程序是停止工作的 

  * 频繁且过长的GC会导致应用假死

  * 用户使用中会感觉到卡顿

  

  

  

  

  

  

  

  
