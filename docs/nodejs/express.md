### 使用 ts+express 搭建一个简单的 api 服务

首先创建一个空的项目，并初始化依赖

```shell
mkdir node-api & cd node-api
yarn  init -y
```

安装我们需要的依赖：

```shell
yarn add -D ts-node typescript
yarn add express
```

:::tip

默认情况下将`ts`文件编译成`js`文件，然后使用`node`去执行，`ts-node`的好处就是我们可以直接去运行`*.ts`文件。

:::

项目的结构：

```shell
$ tree -I node_modules 
.
├── api-server.ts
├── data.ts
├── list.json
├── package.json
├── tsconfig.json
├── yarn-error.log
└── yarn.lock

```

创建`typescipt`的配置文件：

```shell
yarn tsc --init
```

编写我们的的服务器代码`api-server`：

```ts
import express from 'express'
import { DataStore } from './data'
const app = express()

app.get("/",(req,res)=>{
    res.json(DataStore.list)
})

app.listen("8080",()=>{
    console.log("服务已启动了")
})
```

:::tip

当我们直接在`ts`文件中导入`express`会报错，原因是没有对应的声明文件，我们可以直接用官方提供的声明文件：

`yarn add @types/express -D`即可安装`express`类型声明文件

:::

我们的数据从`data.ts`中获取：

```tsx
import list from './list.json'

export class DataStore{
    static list =  list
}
```

`list.json`:

```json
[
    {"name":"zce", "age":19 },
    {"name":"yyz", "age":30 }
]
```

:::tip

`tsc`的编译的配置项中没有打开`resolveJsonModule`选项，我们需要加载`json`文件，在配置文件中手动打开该配置项即可。

:::

启动我们的服务器：

```shell
yarn node-ts ./api-server.ts
```

当我们在浏览器访问`http://localhost:8080/`，即可获取到服务器端返回的`json`数据。

