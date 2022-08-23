#### formik

`formik`是用来增强表单功能，简化表单处理流程的库。

##### 1.1 基本使用

```js
import React from 'react'
import { useFormik } from 'formik'
function App() {
	const formik = useFormik({
		// 处理值
		initialValues: {
			username: 'bruce',
			password: '123456'
		},
		// 提交后执行的毁掉函数
		onSubmit: values => {
			console.log(values)
		}
	})

	return (
		<div className="App">
			<form onSubmit={formik.handleSubmit}>
				<input
					type="text"
					name="username"
					value={formik.values.username}
					onChange={formik.handleChange}
				/>

				<input
					type="password"
					name="password"
					value={formik.values.password}
					onChange={formik.handleChange}
				/>
				<input type="submit" />
			</form>
		</div>
	)
}

export default App

```
* 将数据和表单控件绑定时，控件上的`name`属性是必须的，而且必须和`initialValues`和`formik.values[key]`的key保持一致。
* 我们提交后的回调函数不用去处理表单提交的默认事件。