### this 的指向

#### this总结

* JS 中 this 的指向不取决于函数定义的时候，而是在函数执行的时候动态绑定的。
* 几种常见的 this 指向
  * 函数调用的this,指向全局对象，严格模式下指向画undefined
  * 作为方法调用的时候，this指向的是调用方法的对象，`foo.getAge()`,`foo['getAge']()`,`foo[0]()`
  * 使用apply、call、bind来调用时取决于我们传入的参数
  * 当不在函数内部执行的时候，this指向的是全局对象，node环境的模块例外。
  * 箭头函数的没有this,所以this引用的时候当前箭头函数所在的环境的this.

题目：

```js

var length = 10
function fn () {
  console.log(this.length)
}

const obj = {
  length: 5,
  method (fn) {
    fn() //10
    // arguments[0] === fn // TRUE
    // arguments[0]()
    arguments[0]() //3
  }
}

obj.method(fn, 1, 2)

```

上面的argument[0]指向的是函数fn,当时当我们argument[0]()来执行的时候相当于调用了一个方法，所以this指向的argument对象。

