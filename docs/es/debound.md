#### 防抖和节流

* 为什么需要防抖和节流

在一些高频事件触发的场景下，我们不希望对应的监听事件频繁的触发，所以需要防抖和节流来控制事件的触发次数和频率。

:::tip

浏览器中默认的事件的事件监听间隔是(4～6)ms,如果检测到多次事件监听，就不会造成不必要的资源浪费(函数执行需要分配内存空间)

:::

* 常见的需要用到防抖和节流的场景

  * 滚动事件
  * 输入事件
  * 轮播图的切换
  * 点击操作

* 防抖和节流的概念

  * 防抖：在一个高频触发事件的过程，我们只希望事件触发一次，可以是第一次或者最后一次。
  * 节流：在一个高频触发事件的过程，我们可以设置一个频率，让本来会执行很多次的事件按照我们设置的频率去减少触发的次数。

* 防抖函数的实现

  首先的基本思路：我们的防抖函数的需要一个事件处理函数，一个时间间隔来计算是不是需要触发防抖操作，此外我们需要一个标志位来标识我们的事件是第一次执行还是最后一次执行。

  ```js
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=`, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  
  <body>
      <button id="btn">click me!</button>
      <script>
          const btn = document.getElementById('btn')
  
          function debound(fn, wait, immediate) {
              // 处理传入的参数
              if (typeof fn !== 'function') {
                  throw Error('fn must be a function')
              }
              // 当wait是个boolean值的时候
              if (typeof wait === 'boolean' && immediate === undefined) {
                  immediate = wait
                  wait = 300
              }
              // 默认不立即执行
              if (wait && immediate === undefined) {
                  immediate = false
              }
              let timer = null
              return function () {
                  // 不论事件间隔多大，我们都清空上一次的操作
                  clearTimeout(timer)
                  timer = setTimeout(fn, wait)
              }
  
          }
  
          function handle() {
              console.log('click')
          }
  
          btn.addEventListener('click', debound(handle, 3000))
      </script>
  </body>
  
  </html>
  ```

  上面的防抖函数的基本功能已经实现了，但是存在一些问题：

  ```html
  
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=`, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  
  <body>
      <button id="btn">click me!</button>
      <script>
          const btn = document.getElementById('btn')
          function handle(e) {
              console.log(this, e)
              console.log('click')
          }
  
          // btn.addEventListener('click', debound(handle, 3000))
          btn.addEventListener('click', handle)
      </script>
  </body>
  
  </html>
  ```

  我们的`handle`的`this`是指向全局对象的，且我们的处理函数中访问不到事件对象。对此我们可以这样做：

  ```js
      <script>
          const btn = document.getElementById('btn')
  
          function debound(fn, wait, immediate) {
              // 处理传入的参数
              if (typeof fn !== 'function') {
                  throw Error('fn must be a function')
              }
              // 当wait是个boolean值的时候
              if (typeof wait === 'boolean' && immediate === undefined) {
                  immediate = wait
                  wait = 300
              }
              // 默认不立即执行
              if (wait && immediate === undefined) {
                  immediate = false
              }
              let timer = null
              return function (...args) {
                  // 不论事件间隔多大，我们都清空上一次的操作
                  clearTimeout(timer)
                  timer = setTimeout(() => {
                      fn.apply(this, args)
                  }, wait)
              }
  
          }
  
          function handle(e) {
              console.log(this, e)
              console.log('click')
          }
  
          btn.addEventListener('click', debound(handle, 3000))
          // btn.addEventListener('click', handle)
      </script>
  ```

  我们`debound`函数还有一个问题，就是当我们连续触发事件时，不能第一次就触发我们的事件监听函数。

  ```js
  
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Document</title>
  </head>
  
  
  <body>
      <button id="btn">click me!</button>
      <script>
          const btn = document.getElementById('btn')
  
          function debound(fn, wait, immediate) {
              // 处理传入的参数
              if (typeof fn !== 'function') {
                  throw Error('fn must be a function')
              }
              // 当wait是个boolean值的时候
              if (typeof wait === 'boolean' && immediate === undefined) {
                  immediate = wait
                  wait = 300
              }
              // 默认不立即执行
              if (wait && immediate === undefined) {
                  immediate = false
              }
              let timer = null
              return function (...args) {
                  let init = immediate && !timer
                  // 不论事件间隔多大，我们都清空上一次的操作
                  clearTimeout(timer)
                  timer = setTimeout(() => {
                      //当我们结束连续点击的时候才会执行这个地方
                      timer = null
                          // 当我们连续点击第二次时
                          !immediate ? fn.apply(this, args) : false
                  }, wait)
                  // 当init ===true时，我们的timer还未定义 ,连续点击的第二次开始 timer就存在了
                  init ? fn.apply(this, args) : null
              }
  
          }
  
          function handle(e) {
              console.log(this, e)
              console.log('click')
          }
  
          // btn.addEventListener('click', debound(handle, 1000, true))
          btn.addEventListener('click', debound(handle, 1000))
          // btn.addEventListener('click', handle)
      </script>
  </body>
  
  </html>
  ```

  

  

  

  

