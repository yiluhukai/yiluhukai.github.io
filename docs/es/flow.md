## flow

flow是一个javascript的类型检测器

### flow的使用

* 在项目的根目录下安装flow的依赖

```shell
mkdir flow & cd flow

yarn init -y

yarn add flow-bin --dev
```

* 创建`.flowconfig`文件

  ```js
  yarn flow init
  ```

  * 会生成一个`.flowconfig`文件

  ```
  [ignore]
  
  [include]
  
  [libs]
  
  [lints]
  
  [options]
  
  [strict]
  ```

* 在跟目录下创建src文件，编写代码

```js
/**
 * demo
 * @flow
 */

function sum(a: number, b: number) {
	return a + b
}

sum(1, 3)

sum('1', '3')
```

:::warning

1.需要关闭vscode中对js语法的校验，settings ->搜索 javascript validate ->关闭javascript验证

2 .@flow在文件中是必须的

:::

* 启动flow服务器检测代码

```shell
yarn flow 
```

:::tip

yarn flow start/stop去启动flow服务器，yarn flow命令第一运行也会去启动flow服务器，启动之后我们在终端中看到对应的错误信息.

更多的flow命令可以通过yarn flow --help去查看

:::

```js
yarn run v1.22.4
$ /Users/lijunjie/js-code/flow/node_modules/.bin/flow
Error ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ flow-01.js:12:5

Cannot call sum with 'abd' bound to a because string [1] is incompatible with number [2]. [incompatible-call]

 [2]  6│ function sum(a: number, b: number) {
      7│        return a + b
      8│ }
      9│
     10│ sum(1, 3)
     11│
 [1] 12│ sum('abd', '13')
     13│


Error ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ flow-01.js:12:12

Cannot call sum with '13' bound to b because string [1] is incompatible with number [2]. [incompatible-call]

 [2]  6│ function sum(a: number, b: number) {
      7│        return a + b
      8│ }
      9│
     10│ sum(1, 3)
     11│
 [1] 12│ sum('abd', '13')
     13│



Found 2 errors
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

* 上面的代码并不是标准的js语法，我们需要在生产环境中删除对应的类型注解

  * 使用babel中提供的插件也可以移除我们添加的类型注解

    ```shell
     #@babel/cli 让我们可以直接在终端中使用babel命令  @babel/preset-flow是移除类型注解的插件
     yarn add @babel/core @babel/cli @babel/preset-flow --dev
    ```

    * 添加babel的配置文件`.babelrc`

    ```
    {
        "presets": [
            "@babel/preset-flow"
        ]
    }
    ```

    * 运行命令去移除类型注解

    ```shell
    yarn babel src -d dist
    ```

    ```js
    function sum(a, b) {
      return a + b;
    }
    
    sum(1, 3);
    sum('abd', '13');
    ```

  * 使用官方提供的flow-remove-types 包来删除类型注解

    ```shell
    yarn add flow-remove-types --dev
    
    # 删除对应的代码注解，将处理后的代码放入到dist目录下
    # src 代码我们代码的源文件
    
    yarn flow-remove-types src -d dist
    ```

    * 处理后的代码

    ```js
    /**
     *
     *      
     */
    
    function sum(a        , b        ) {
    	return a + b
    }
    
    sum(1, 3)
    
    sum('abd', '13')
    
    ```

* 使用vscode插件检测flow中的类型错误
  
  * 每次都去运行yarn flow命令检测代码中的类型错误很麻烦，vscode中有对应的插件可以直接去查看错误，安装flow的编辑器插件Flow Language Support

      

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

      
    
      
    
    ​	



​			



