

##  JS性能优化

### 什么是性能优化

所谓的性能优化就是提升代码的运行效率、减少代码运行时资源消耗。而JS性能优化就是在这门语言中优化代码的性能。

### JS的内存管理

内存:可读写单元，表示一片可操作的区域。

管理:人为的操作一片空间的申请、使用和释放

内存管理：开发者主动去申请内存空间、使用内存空间、和释放内存空间

JS不能想C语言那样主动去申请和释放内存空间，但是我们我还能还是可通过执行脚本来观察JS中内存使用的生命周期变化

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
  * 对象不能从根上去访问到是垃圾

当JS的垃圾回收器认为对象是一个垃圾时，就会自动对对象占用的内存地址进行回收。

* JS中的可达对象
  * 可以被访问到对象就是可达对象(引用和作用域)
  *  可达的标准就是从根(全局对象)上出发可以能被找到。
  * JS中的根可以理解为全局对象

```js
/**
 * 可达对象
 */

function objGroup(obj1, obj2) {
	obj1.prev = obj2
	obj2.next = obj1
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

Reflect.deleteProperty(obj.o2, 'next')
```

![reachable](/frontEnd/garbage.png)