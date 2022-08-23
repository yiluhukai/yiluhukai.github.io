## Jest使用

#### 什么是测试

测试就是对已有的功能和模块的验证，在前端开发过程中，我们不可避免的要写一些函数、方法、甚至一个包。当我们完成这个功能后，我们需要去对他们验证，这个过程就是一个测试的过程，作为开发来说，最后的验证方式就是通过代码去完成。

加入我们写了两个函数：

```js
// math.js
function sum (a, b) {
  return a * b
}

function subtract (x, y) {
  return x - y
}

module.exports = {
  add,
  subtract
}
```

为了验证他们的正确性，我们去编写代码测试它

```js
// math.test.js

const { add, subtract } = require('./math')

const result = add(1, 2)
const expected = 3

if (result !== expected) {
  throw new Error(`1 + 2 应该等于 ${expected}，但是结果却是 ${result}`)
}

const result2 = subtract(2, 1)
const expected2 = 1

if (result2 !== expected2) {
  throw new Error(`2 - 1 应该等于 ${expected2}，但是结果却是 ${result2}`)
}

```

我们可以实现一个函数来简化上面的测试过程：

```js
expect(add(1, 2)).toBe(3)
expect(subtract(2, 1)).toBe(-1)
```
上面的测试代码就像自然语言说话一样，很舒服。接下来我们去实现expect函数：

```js
expect(add(1, 2)).toBe(3)
expect(subtract(2, 1)).toBe(1)

function expect (result) {
  return {
    toBe (actual) {
      if (result !== actual) {
        throw new Error(`预期值和实际值不相等，预期 ${result}，结果确实 ${actual}`)
      }
    }
  }
}
```

`expect`函数可以简化我们要写的测试代码，但是还是存在错误信息不全的问题，比如不能提现出那个函数有问题。我们实现一个函数来补全错误信息。

```js
const { add, subtract } = require("./math")

test('测试加法', () => {
  expect(add(1, 2)).toBe(3)
})

test('测试减法', () => {
  expect(subtract(2, 1)).toBe(1)
})
// 
function test (description, callback) {
  try {
    callback()
    console.log(`${description} 通过测试`)
  } catch (err) {
    console.error(`${description} 没有通过测试：${err}`)
  }
}

function expect (result) {
  return {
    toBe (actual) {
      if (result !== actual) {
        throw new Error(`预期值和实际值不相等，预期 ${result}，结果确实 ${actual}`)
      }
    }
  }
}
```

`test`的使用是一个测试用例函数，而`expect`则是一个断言函数。当我执行代码调用test函数时，完成对测试用例的执行。


