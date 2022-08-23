## React Hooks

### 1. React Hooks 介绍 

#### 1.1 React Hooks 是用来做什么的

对函数型组件进行增强, 让函数型组件可以存储状态, 可以拥有处理副作用的能力. 让开发者在不使用类组件的情况下, 实现相同的功能.

```
用类组件不行吗，使用hooks相对类组件有什么好处？
```
#### 1.2 类组件的不足 (Hooks 要解决的问题)

1. 缺少逻辑复用机制

    * 为了复用逻辑(高阶组件)增加无实际渲染效果的组件，增加了组件层级 显示十分臃肿 增加了调试的难度以及运行效率的降低

2. 类组件经常会变得很复杂难以维护
   
    * 将一组相干的业务逻辑拆分到了多个生命周期函数中
    * 在一个生命周期函数内存在多个不相干的业务逻辑

3. 类成员方法不能保证this指向的正确性


### React的使用

Hooks 意为钩子, React Hooks 就是一堆钩子函数, React 通过这些钩子函数对函数型组件进行增强, 不同的钩子函数提供了不同的功能.
*  useState()
*  useEffects() 
*  useReducer() 
*  useRef() 
*  useCallback() 
*  useContext()
*  useMemo()

#### 2.1 useState
用于为函数式组件引入状态
```js
import React, { useState } from 'react'

export default function UseState() {
	const [count, setCount] = useState(0)
	return (
		<div>
			<span>{count}</span>
			<button
				onClick={() => {
					setCount(count + 1)
				}}
			>
				+1
			</button>
		</div>
	)
}

```

useState() 使用细节

1. 接收唯一的参数即状态初始值. 初始值可以是任意数据类型.
2. 返回值为数组. 数组中存储状态值和更改状态值的方法. 方法名称约定以set开头, 后面加上状态名称.
3. 方法可以被调用多次. 用以保存不同状态值.
4. 参数可以是一个函数, 函数返回什么, 初始状态就是什么, 函数只会被调用一次, 用在初始值是动态值的情况.（和引用类型无关）

```js

import React, { useState } from 'react'

export default function UseState(props) {
	// const initialCount = props.count || 0 // 只需要被执行一次
	const [count, setCount] = useState(() => props.count || 0)
	return (
		<div>
			<span>{count}</span>
			<button
				onClick={() => {
					setCount(count + 1)
				}}
			>
				+1
			</button>
		</div>
	)
}
```

关于设置值方法的细节：

1. 设置值的方法可以接受一个值或者一个函数。
```js
import React, { useState } from 'react'

export default function UseState(props) {
	// const initialCount = props.count || 0 // 只需要被执行一次
	const [count, setCount] = useState(() => props.count || 0)

	const handleClick = count => {
		return count + 1
	}
	return (
		<div>
			<span>{count}</span>
			<button onClick={setCount(handleClick)}>+1</button>
		</div>
	)
}
```
2. 设置值的方法是异步的(面试被问过)

```js
import React, { useState } from 'react'

export default function UseState(props) {
	// const initialCount = props.count || 0 // 只需要被执行一次
	const [count, setCount] = useState(() => props.count || 0)

	const handleClick = () => {
		setCount(count + 1)
		document.title = count // 去的还是前一次的值
	}

	return (
		<div>
			<span>{count}</span>
			<button onClick={handleClick}>+1</button>
		</div>
	)
}

```
3. 可以使用函数作为参数解决这个问题：
```js
import React, { useState } from 'react'

export default function UseState(props) {
	// const initialCount = props.count || 0 // 只需要被执行一次
	const [count, setCount] = useState(() => props.count || 0)

	const handleClick = () => {
		setCount(count => {
			const newCount = count + 1
			document.title = newCount // 去的还是前一次的值
			return newCount
		})
	}

	return (
		<div>
			<span>{count}</span>
			<button onClick={handleClick}>+1</button>
		</div>
	)
}

```
#### 2.1 useReducer

`useReducer`更想一个组件级别的store.

```js
function App() {
  function reducer (state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      default:
        return state;
    }
  }
  const [count, dispatch] = useReducer(reducer, 0);
  return <div>
    {count}
    <button onClick={() => dispatch({type: 'increment'})}>+1</button>
    <button onClick={() => dispatch({type: 'decrement'})}>-1</button>
  </div>;
}
export default App;
```

#### 2.1 useContext

在跨组件传输时简化获取数据的过程。


```js
// 未简化的使用方法
import React, { createContext } from 'react'
import './App.css'

const context = createContext()

function App() {
	return (
		<div className="App">
			{/* <UseState></UseState> */}
			<context.Provider value={100}>
				<Foo />
			</context.Provider>
		</div>
	)
}

function Foo() {
	return (
		<div>
			<context.Consumer>
				{value => {
					return <div>Foo,{value}</div>
				}}
			</context.Consumer>
		</div>
	)
}
```
使用`useContext`:

```js
import React, { createContext, useContext } from 'react'
import './App.css'

const context = createContext()

function App() {
	return (
		<div className="App">
			<context.Provider value={100}>
				<Foo />
			</context.Provider>
		</div>
	)
}

function Foo() {
	const value = useContext(context)
	return (
		<div>
			<div>Foo,{value}</div>
		</div>
	)
}

export default App

```


#### 2.4 useEffect()
`useEffect` 钩子是用来执行副作用的（与视图的渲染无关的都是副作用），可以把 useEffect 看做 componentDidMount, componentDidUpdate 和 componentWillUnmount 这三个函数的组合.
* useEffect(() => {})，挂在和数据更新都会执行

```js
import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
	useEffect(() => {
		console.log(123)
	})
	const [count, setCount] = useState(0)
	return (
		<div className="App">
			<button onClick={() => setCount(count + 1)}>add one</button>
		</div>
	)
}

```
* useEffect(() => {}, [])，只在组件挂载的时候执行
```js
import React, { useEffect, useState } from 'react'
import './App.css'
function App() {
	useEffect(() => {
		console.log(123)
	}, [])
	const [count, setCount] = useState(0)
	return (
		<div className="App">
			<button onClick={() => setCount(count + 1)}>add one</button>
		</div>
	)
}
```
* useEffect(() => () => {})，返回的函数在组件销毁前执行

```js
import React, { useEffect, useState } from 'react'
// import UseState from './hooks/useState'
import './App.css'
import root from './index'

// const context = createContext()

function App() {
	useEffect(() => {
		return () => {
			console.log('unmounted')
		}
	})
	const [count, setCount] = useState(0)
	return (
		<div className="App">
			<button onClick={() => setCount(count + 1)}>add one</button>
			<button
				onClick={() => {
					// React v18.x不支持
					// ReactDom.unmountComponentAtNode(document.getElementById('root')) 
					root.unmount()
				}}
			>
				unmount self
			</button>
		</div>
	)
}
```
`useEffect`的使用：

* 监听页面的滚动
* 使用定时器使`count`自增
  
```js

import React, { useEffect, useState } from 'react'
import root from '.'
// import UseState from './hooks/useState'
import './App.css'

// const context = createContext()

function App() {
	useEffect(() => {
		const onScroll = () => {
			console.log('scrolling')
		}
		window.addEventListener('scroll', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	},[])

	const [count, setCount] = useState(0)

	useEffect(() => {
		const timerId = setInterval(() => {
			setCount(count => count + 1)
		}, 1000)
		return () => {
			clearInterval(timerId)
		}
	},[])

	return (
		<div className="App">
			<button
				onClick={() => {
					root.unmount()
				}}
			>
				unmounted App
			</button>

			{count}
		</div>
	)
}

````
使用`useEffect`带来的好处：

* 不同的功能可以放置到不同的副作用函数中。
* 可以简化代码：更新和挂载生命周期经常有相同的功能。

`useEffect`数据检测

```js
useEffect(()=>{ 
	document.title = count 
},[count])
```
当`count`数据发生变化的时候才执行。

`useEffect`中结合异步函数：

* 不能直接使用`async`函数，以为`async`函数会返回一个`Promise`.而`effect`要求一个参数返回一个清理函数。
```js
import React, { useEffect, useState } from 'react'
import root from '.'
// import UseState from './hooks/useState'
import './App.css'

// const context = createContext()
const getName = () => Promise.resolve('bruce')

function App() {
	useEffect(async () => {
		const name = await getName()
		console.log(name)
	})

	return (
		<div className="App">
			<button
				onClick={() => {
					root.unmount()
				}}
			>
				unmounted App
			</button>
		</div>
	)
}

```
这种情况可以使用`Promise`或者自执行函数：

```js

import React, { useEffect, useState } from 'react'
import root from '.'
// import UseState from './hooks/useState'
import './App.css'

// const context = createContext()
const getName = () => Promise.resolve('bruce')

function App() {
	useEffect(() => {
		;(async () => {
			const name = await getName()
			console.log(name)
		})()
	})

	return (
		<div className="App">
			<button
				onClick={() => {
					root.unmount()
				}}
			>
				unmounted App
			</button>
		</div>
	)
}
```

#### `useMemo`
* `useMmeo`类似于Vue中的计算属性，可以监测某个值的变化，根据变化值重新计算结果
* `useMemo`会缓存计算结果，如果检测的值没有变化，即使组件重新渲染，也不会重新计算，此行为有助于避免在每次渲染时进行昂贵的计算。

```js
import React, { useMemo, useState } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	const [name, setName] = useState('zce')
	const doubleCount = useMemo(() => {
		console.log('run')
		return 2 * count
	}, [count])
	return (
		<div className="App">
			<button
				onClick={() => {
					setCount(count => count + 1)
				}}
			>
				count++
			</button>
			value:{count};name:{name};double count:{doubleCount}
			<button
				onClick={() => {
					setName('bruce')
				}}
			>
				change name
			</button>
		</div>
	)
}
export default App
```  
`name`的变化并不会触发`memo()`的执行；

#### `memo`方法

* 性能优化，如果本组建中的数据没有发生变化，组织组件更新，类似类组件中的`PureComponent`和`shouComponentUpdate`生命周期。

```js
import React, { memo, useMemo, useState } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	const doubleCount = useMemo(() => {
		console.log('run')
		return 2 * count
	}, [count])
	return (
		<div className="App">
			<button
				onClick={() => {
					setCount(count => count + 1)
				}}
			>
				count++
			</button>
			value:{count};double count:{doubleCount}
			<Foo />
		</div>
	)
}

const Foo = memo(() => {
	console.log('update')
	return (
		<div>
			<div>Foo</div>
		</div>
	)
})

export default App


```
当不对`Foo`组件使用`memo`函数，那么父组件`App`的每次重新渲染都会引起`Foo`的重新渲染。

#### 2.7 useCallback()
* 性能优化, 缓存函数, 使组件重新渲染时得到相同的函数实例.

```js
import React, { memo, useState } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	const resetCount = () => {
		setCount(0)
	}
	return (
		<div className="App">
			<button
				onClick={() => {
					setCount(count => count + 1)
				}}
			>
				count++
			</button>
			value:{count};
			<Foo resetCount={resetCount} />
		</div>
	)
}

const Foo = memo(props => {
	console.log('update')
	return (
		<div>
			<div>Foo</div>
			<button onClick={props.resetCount}>reset count</button>
		</div>
	)
})

export default App

```

当我们点击按钮使`count`+1是，组件会重新渲染，这个时候冲生成新的`resetCount`函数，下层的`memo`失效,`Foo`组件被更新了。

解决上面的问题，我们可以使用`useCallback()`来缓存	`resetCount`函数，每次都返回原来的应用，这样子`Foo`组件就不会每次都更新了。

```js
import React, { memo, useState, useCallback } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	const resetCount = useCallback(() => {
		setCount(0)
	}, [setCount])

	return (
		<div className="App">
			<button
				onClick={() => {
					setCount(count => count + 1)
				}}
			>
				count++
			</button>
			value:{count};
			<Foo resetCount={resetCount} />
		</div>
	)
}

const Foo = memo(props => {
	console.log('update')
	return (
		<div>
			<div>Foo</div>
			<button onClick={props.resetCount}>reset count</button>
		</div>
	)
})

export default App

```
#### 2.8 useRef()
2.8.1 获取DOM元素对象

```js
import React, { useRef } from 'react'

import './App.css'
function App() {
	const buttonRef = useRef()

	return (
		<div className="App">
			<button
				ref={buttonRef}
				onClick={() => {
					console.log(buttonRef)
				}}
			>
				按钮
			</button>
		</div>
	)
}

```
`buttonRef.current`指向了`button`元素对象。

2.8.2 保存数据 (跨组件周期)

* 即使组件重新渲染, 保存的数据仍然还在. 
* 保存的数据被更改不会触发组件重新渲染.

```js
import React, { useState, useEffect } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	let timer = null
	useEffect(() => {
		timer = setInterval(() => {
			setCount(count => count + 1)
		}, 1000)
	}, [])

	const resetTimer = () => {
		clearInterval(timer)
	}

	return (
		<div className="App">
			<button onClick={resetTimer}>reset timer</button>
			value:{count}
		</div>
	)
}

```

上面的代码不能清楚计时器`timer`，原因在于在我们点击之前，计时器已经开始运行了，每次运行都更新组件的`count`，导致组件重新渲染，然后timer被修改成了`null`.我们点击时清除的计数器也是`null`.

```js
import React, { useState, useEffect, useRef } from 'react'

import './App.css'
function App() {
	const [count, setCount] = useState(0)
	let timer = useRef()
	useEffect(() => {
		timer.current = setInterval(() => {
			setCount(count => count + 1)
		}, 1000)
	}, [])

	const resetTimer = () => {
		clearInterval(timer.current)
	}

	return (
		<div className="App">
			<button onClick={resetTimer}>reset timer</button>
			value:{count}
		</div>
	)
}
```
我们使用`useRef`去保存的数据，由于`useRef`只执行一次，所以反悔的`timer`对象不会被修改，当我们修改`timer.current`的时候，也不会导致组件被重新渲染。


#### 3. 自定义 Hook
* 自定义 Hook 是标准的封装和共享逻辑的方式.
* 自定义 Hook 是一个函数, 其名称以 use 开头.
* 自定义 Hook 其实就是逻辑和内置 Hook 的组合.

3.1 自定义`hook`的使用

```js
import React, { useState } from 'react'

import './App.css'

// 自定义hook来共享逻辑
const useBindValue = initValue => {
	const [value, setValue] = useState(initValue)
	return {
		value,
		onChange: event => {
			setValue(event.target.value)
		}
	}
}

function App() {
	const usernameInput = useBindValue('')
	const passwordInput = useBindValue('')
	const handleSubmit = event => {
		event.preventDefault()
		console.error(usernameInput.value, passwordInput.value)
	}
	return (
		<div className="App">
			<form onSubmit={handleSubmit}>
				username:
				<input type="text" {...usernameInput} name="username" />
				password:
				<input type="password" {...passwordInput} name="password" />
				<input type="submit" />
			</form>
		</div>
	)
}

export default App

```

`使用hook`去共享绑定数据的逻辑。

#### 4.`useState`实现

* 这里得实现只是实现大致功能，并不等于源码的实现。
* 代码中使用到了闭包，我们常说的闭包可以缓存参数的作用在这里被提现出来了。

```js
import React from 'react'
import root from '.'
import './App.css'

let states = []
let settters = []
let index = 0

const render = () => {
	index = 0
	root.render(<App />)
}
const setter = index => newValue => {
	states[index] = newValue
	// 调用render函数，当数据更新时重新渲染组件
	render()
}

function useState(initialValue) {
	states[index] = states[index] ?? initialValue
	// 必须使用必报去缓存index的值，负责更新前的指向数组的length,取不到对应的setter.
	settters[index] = setter(index)
	const state = states[index]
	const setState = settters[index]
	index++
	return [state, setState]
}

function App() {
	const [count, setCount] = useState(10)
	const [name, setName] = useState('bac')
	return (
		<div className="App">
			{count},{name}
			<button onClick={() => setCount(count + 1)}> setButton </button>
			<button onClick={() => setName('bruce')}> setButton </button>
		</div>
	)
}

export default App

```


#### 5.`useEffect`实现

* 实现了多个`useEffect`的使用
* 实现了第二个参数传递和不传递的区别

```js
import React from 'react'
import root from '.'
import './App.css'

let states = []
let settters = []
let index = 0
// ++
let preDepArr = []
let effectIndex = 0
function useEffect(callback, depArr) {
	if (typeof callback !== 'function') {
		throw Error('useEffect的第一个参数必须是一个函数')
	}

	if (depArr === undefined) {
		// 每次都执行
		callback()
	} else {
		if (Array.isArray(depArr)) {
			// 检测依赖是否变化,当 preDepArr[effectIndex]不存在，表示第一次执行
			const hasChange = preDepArr[effectIndex]
				? depArr.some((dep, index) => dep !== preDepArr[effectIndex][index])
				: true
			if (hasChange) {
				callback()
			}
		} else {
			throw Error('useEffect的第二个参数必须是一个数组')
		}
	}
	preDepArr[effectIndex] = depArr
	effectIndex++
}

const render = () => {
	index = 0
	// ++
	effectIndex = 0
	root.render(<App />)
}
const setter = index => newValue => {
	states[index] = newValue
	// 调用render函数，当数据更新时重新渲染组件
	render()
}

function useState(initialValue) {
	states[index] = states[index] ?? initialValue
	// 必须使用必报去缓存index的值，负责更新前的指向数组的length,取不到对应的setter.
	settters[index] = setter(index)
	const state = states[index]
	const setState = settters[index]
	index++
	return [state, setState]
}

function App() {
	const [count, setCount] = useState(10)
	const [name, setName] = useState('bac')

	useEffect(() => {
		console.log('Hello')
	}, [count])

	useEffect(() => {
		console.log('world')
	}, [name])

	return (
		<div className="App">
			{count},{name}
			<button onClick={() => setCount(count + 1)}> setButton </button>
			<button onClick={() => setName('bruce')}> setButton </button>
		</div>
	)
}

export default App


```


#### 6.`useReducer`实现

* 可以借助`useState`来实现`useReducer`.

```js

import React, { useState } from 'react'
import './App.css'

function useReducer(reducer, initialValue) {
	const [store, setStore] = useState(initialValue)
	const dispatch = action => {
		setStore(reducer(store, action))
	}
	return [store, dispatch]
}

function App() {
	const reducer = (state, action) => {
		switch (action && action.type) {
			case 'increment': {
				return state + 1
			}
			case 'decrement': {
				return state + 1
			}
			default:
				return state
		}
	}

	const [count, dispatch] = useReducer(reducer, 1)
	
	return (
		<div className="App">
			{count}
			{/* {name} */}
			<button
				onClick={() => {
					dispatch({ type: 'increment' })
				}}
			>
				+1
			</button>
			<button onClick={() => dispatch({ type: 'decrement' })}> -1 </button>
		</div>
	)
}
```































