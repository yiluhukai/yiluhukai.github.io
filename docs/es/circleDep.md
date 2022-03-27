#### 循环依赖

当我们使用`webpack`构建大型项目时，经常会遇到循环依赖的问题，多个文件间项目引用，这经常会造成一种现象，就是我们的引入路径没有问题，但是导入的模块却是`undefined`,甚至一个文件中最外层的时`undefined`,但是函数(不会立即调用)中的却可以找到。这种现象便是模块循环依赖引起的。

假设A,B两个块相互依赖，那么这个时候加载A的时候需要B,加载B的时候需要A，如果是这样子的话会一直加载下去，为了解决这个问题，我们需要给模块系统一个点，在那里“A *反正*是需要 B 的，但是我们不需要先解析 B。把A中的导入的B先暂定为`undfined`,加载完成后再去加载B,完了之后再将A中的B替换成真的B.

```js
//A.js

import B from './B.js'

// B.a()报错，因为此时B是`undefind`
function(){
  // 不会立即被执行
  B.a()
}

export default {}

```

```js
// B.js
import A from './A.js'

export default {
  a(){
    console.err(A)
  }
}

```

我们先讲`A`中的B解析成`undefined`,然后再解析出A模块，B中使用A得到B,然后再将B中的A替换成成B,这个时候调用B的方法就不会报错啦。

有时我们需要模块的的最外层执行`B.a()`。我们可以使用异步加载，

```js
//A.js

imprt('./B.js').then((res)=>{ res.default.a()})


export default {}


```

[Vue组件的循环依赖](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8)

在项目中我们还是要尽量避免循环依赖的产生的，但是循环依赖有经常在不经意间产生，这里推荐一个插件可以检测模块的循环依赖。

[circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin)

基本用法：

```js
// webpack.config.js
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  entry: "./src/index",
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ]
}
```

注意事项：该组件的评分并不高，但是作为开发依赖去检测组件的循环依赖来说够用。