#### session
[session](https://beego.me/docs/mvc/controller/session.md)

beego 内置了 session 模块，目前 session 模块支持的后端引擎包括 memory、cookie、file、mysql、redis、couchbase、memcache、postgres，用户也可以根据相应的 interface 实现自己的引擎。

beego 中使用 session 相当方便，只要在 main 入口函数中设置如下：

```
beego.BConfig.WebConfig.Session.SessionOn = true
```
或者通过配置文件配置如下：

```
sessionon = true
```
通过这种方式就可以开启 session，如何使用 session，请看下面的例子：

```go
func (this *MainController) Get() {
    v := this.GetSession("asta")
    if v == nil {
        this.SetSession("asta", int(1))
        this.Data["num"] = 0
    } else {
        this.SetSession("asta", v.(int)+1)
        this.Data["num"] = v.(int)
    }
    this.TplName = "index.tpl"
}
```
session 有几个方便的方法：

```
SetSession(name string, value interface{})
GetSession(name string) interface{}
DelSession(name string)
SessionRegenerateID()
DestroySession()
```
session 操作主要有设置 session、获取 session、删除 session。

session模块的其他设置
```
beego.BConfig.WebConfig.Session.SessionOn
```

设置是否开启 Session，默认是 false，配置文件对应的参数名：sessionon。

```
beego.BConfig.WebConfig.Session.SessionProvider
```

设置 Session 的引擎，默认是 memory，目前支持还有 file、mysql、redis 等，配置文件对应的参数名：sessionprovider。

```
beego.BConfig.WebConfig.Session.SessionName
```

设置 cookies 的名字，Session 默认是保存在用户的浏览器 cookies 里面的，默认名是 beegosessionID，配置文件对应的参数名是：sessionname。

```
beego.BConfig.WebConfig.Session.SessionGCMaxLifetime
```

设置 Session 过期的时间，默认值是 3600 秒，配置文件对应的参数：sessiongcmaxlifetime。

```
beego.BConfig.WebConfig.Session.SessionProviderConfig
```

设置对应 file、mysql、redis 引擎的保存路径或者链接地址，默认值是空，配置文件对应的参数：sessionproviderconfig。

```
beego.BConfig.WebConfig.Session.SessionHashFunc
```

默认值为 sha1，采用 sha1 加密算法生产 sessionid

```
beego.BConfig.WebConfig.Session.SessionHashKey
```

默认的 key 是 beegoserversessionkey，建议用户使用的时候修改该参数

```
beego.BConfig.WebConfig.Session.SessionCookieLifeTime
```

设置 cookie 的过期时间，cookie 是用来存储保存在客户端的数据。

#### 过滤器
beego 支持自定义过滤中间件，例如安全验证，强制跳转等。

过滤器函数如下所示：

```
beego.InsertFilter(pattern string, position int, filter FilterFunc, params ...bool)
```
InsertFilter 函数的三个必填参数，一个可选参数

pattern 路由规则，可以根据一定的规则进行路由，如果你全匹配可以用 *
position 执行 Filter 的地方，五个固定参数如下，分别表示不同的执行过程
BeforeStatic 静态地址之前
BeforeRouter 寻找路由之前
BeforeExec 找到路由之后，开始执行相应的 Controller 之前
AfterExec 执行完 Controller 逻辑之后执行的过滤器
FinishRouter 执行完逻辑之后执行的过滤器
```
filter filter 函数 type FilterFunc func(*context.Context)
```
params
设置 returnOnOutput 的值(默认 true), 如果在进行到此过滤之前已经有输出，是否不再继续执行此过滤器,默认设置为如果前面已有输出(参数为true)，则不再执行此过滤器

是否重置 filters 的参数，默认是 false，因为在 filters 的 pattern 和本身的路由的 pattern 冲突的时候，可以把 filters 的参数重置，这样可以保证在后续的逻辑中获取到正确的参数，例如设置了 /api/* 的 filter，同时又设置了 /api/docs/* 的 router，那么在访问 /api/docs/swagger/abc.js 的时候，在执行 filters 的时候设置 :splat 参数为 docs/swagger/abc.js，但是如果不清楚 filter 的这个路由参数，就会在执行路由逻辑的时候保持 docs/swagger/abc.js，如果设置了 true，就会重置 :splat 参数.

如下例子所示，验证用户是否已经登录，应用于全部的请求：
```go
var FilterUser = func(ctx *context.Context) {
    _, ok := ctx.Input.Session("uid").(int)
    if !ok && ctx.Request.RequestURI != "/login" {
        ctx.Redirect(302, "/login")
    }
}

beego.InsertFilter("/*",beego.BeforeRouter,FilterUser)
```


#### url构建
UrlFor() 函数就是用于构建指定函数的 URL 的。它把对应控制器和函数名结合的字符串作为第一个参数，其余参数对应 URL 中的变量。未知变量将添加到 URL 中作为查询参数
 
```go
type TestController struct {
    beego.Controller
}

func (this *TestController) Get() {
    this.Data["Username"] = "astaxie"
    this.Ctx.Output.Body([]byte("ok"))
}

func (this *TestController) List() {
    this.Ctx.Output.Body([]byte("i am list"))
}

func (this *TestController) Params() {
    this.Ctx.Output.Body([]byte(this.Ctx.Input.Params()["0"] + this.Ctx.Input.Params()["1"] + this.Ctx.Input.Params()["2"]))
}

func (this *TestController) Myext() {
    this.Ctx.Output.Body([]byte(this.Ctx.Input.Param(":ext")))
}

func (this *TestController) GetUrl() {
    this.Ctx.Output.Body([]byte(this.UrlFor(".Myext")))
}
```

对应的router

```go
beego.Router("/api/list", &TestController{}, "*:List")
beego.Router("/person/:last/:first", &TestController{})
beego.AutoRouter(&TestController{})
```
后端去获取url
```go
beego.URLFor("TestController.List")
// 输出 /api/list

beego.URLFor("TestController.Get", ":last", "xie", ":first", "asta")
// 输出 /person/xie/asta

beego.URLFor("TestController.Myext")
// 输出 /Test/Myext

beego.URLFor("TestController.GetUrl")
// 输出 /Test/GetUrl

```

前端模版中去使用

```html
<form  action='{{urlfor "TestController.List"}}'> 

</form>
```
为什么不在把 URL 写死在模板中，反而要动态构建？有两个很好的理由：
反向解析通常比硬编码 URL 更直观。同时，更重要的是你可以只在一个地方改变 URL ，而不用到处乱找。
URL 创建会为你处理特殊字符的转义和 Unicode 数据，不用你操心


#### 表单验证是用于数据验证和错误收集的模块。

安装：

```
go get github.com/astaxie/beego/validation
```
测试：

```
go test github.com/astaxie/beego/validation
```

直接校验字段


```go
import (
    "github.com/astaxie/beego/validation"
    "log"
)

type User struct {
    Name string
    Age int
}

func main() {
    u := User{"man", 40}
    valid := validation.Validation{}
    valid.Required(u.Name, "name")
    valid.MaxSize(u.Name, 15, "nameMax")
    valid.Range(u.Age, 0, 18, "age")

    if valid.HasErrors() {
        // 如果有错误信息，证明验证没通过
        // 打印错误信息
        for _, err := range valid.Errors {
            log.Println(err.Key, err.Message)
        }
    }
    // or use like this
    if v := valid.Max(u.Age, 140, "age"); !v.Ok {
        log.Println(v.Error.Key, v.Error.Message)
    }
    // 定制错误信息
    minAge := 18
    valid.Min(u.Age, minAge, "age").Message("少儿不宜！")
    // 错误信息格式化
    valid.Min(u.Age, minAge, "age").Message("%d不禁", minAge)
}
```

使用tag

```go
import (
    "log"
    "strings"

    "github.com/astaxie/beego/validation"
)

// 验证函数写在 "valid" tag 的标签里
// 各个函数之间用分号 ";" 分隔，分号后面可以有空格
// 参数用括号 "()" 括起来，多个参数之间用逗号 "," 分开，逗号后面可以有空格
// 正则函数(Match)的匹配模式用两斜杠 "/" 括起来
// 各个函数的结果的 key 值为字段名.验证函数名
type user struct {
    Id     int
    Name   string `valid:"Required;Match(/^Bee.*/)"` // Name 不能为空并且以 Bee 开头
    Age    int    `valid:"Range(1, 140)"` // 1 <= Age <= 140，超出此范围即为不合法
    Email  string `valid:"Email; MaxSize(100)"` // Email 字段需要符合邮箱格式，并且最大长度不能大于 100 个字符
    Mobile string `valid:"Mobile"` // Mobile 必须为正确的手机号
    IP     string `valid:"IP"` // IP 必须为一个正确的 IPv4 地址
}

// 如果你的 struct 实现了接口 validation.ValidFormer
// 当 StructTag 中的测试都成功时，将会执行 Valid 函数进行自定义验证
func (u *user) Valid(v *validation.Validation) {
    if strings.Index(u.Name, "admin") != -1 {
        // 通过 SetError 设置 Name 的错误信息，HasErrors 将会返回 true
        v.SetError("Name", "名称里不能含有 admin")
    }
}

func main() {
    // 可以接受一个错误信息的map去修改err.Message
    valid := validation.Validation{}
    u := user{Name: "Beego", Age: 2, Email: "dev@beego.me"}
    b, err := valid.Valid(&u)
    if err != nil {
        // handle error
    }
    if !b {
        // validation does not pass
        // blabla...
        for _, err := range valid.Errors {
            log.Println(err.Key, err.Message)
        }
    }
}
```
StructTag 可用的验证函数：
```
Required 不为空，即各个类型要求不为其零值
Min(min int) 最小值，有效类型：int，其他类型都将不能通过验证
Max(max int) 最大值，有效类型：int，其他类型都将不能通过验证
Range(min, max int) 数值的范围，有效类型：int，他类型都将不能通过验证
MinSize(min int) 最小长度，有效类型：string slice，其他类型都将不能通过验证
MaxSize(max int) 最大长度，有效类型：string slice，其他类型都将不能通过验证
Length(length int) 指定长度，有效类型：string slice，其他类型都将不能通过验证
Alpha alpha字符，有效类型：string，其他类型都将不能通过验证
Numeric 数字，有效类型：string，其他类型都将不能通过验证
AlphaNumeric alpha 字符或数字，有效类型：string，其他类型都将不能通过验证
Match(pattern string) 正则匹配，有效类型：string，其他类型都将被转成字符串再匹配(fmt.Sprintf(“%v”, obj).Match)
AlphaDash alpha 字符或数字或横杠 -_，有效类型：string，其他类型都将不能通过验证
Email 邮箱格式，有效类型：string，其他类型都将不能通过验证
IP IP 格式，目前只支持 IPv4 格式验证，有效类型：string，其他类型都将不能通过验证
Base64 base64 编码，有效类型：string，其他类型都将不能通过验证
Mobile 手机号，有效类型：string，其他类型都将不能通过验证
Tel 固定电话号，有效类型：string，其他类型都将不能通过验证
Phone 手机号或固定电话号，有效类型：string，其他类型都将不能通过验证
ZipCode 邮政编码，有效类型：string，其他类型都将不能通过验证

```

#### 错误处理


```go
func (this *MainController) Get() {
    this.Abort("401")
    v := this.GetSession("asta")
    if v == nil {
        this.SetSession("asta", int(1))
        this.Data["Email"] = 0
    } else {
        this.SetSession("asta", v.(int)+1)
        this.Data["Email"] = v.(int)
    }
    this.TplName = "index.tpl"
}
```

这样 this.Abort("401") 之后的代码不会再执行，而且会默认显示给用户如下页面
beego 框架默认支持 401、403、404、500、503 这几种错误的处理

##### Controller 定义 Error
```go
package controllers

import (
    "github.com/astaxie/beego"
)

type ErrorController struct {
    beego.Controller
}

func (c *ErrorController) Error404() {
    c.Data["content"] = "page not found"
    c.TplName = "404.tpl"
}

func (c *ErrorController) Error501() {
    c.Data["content"] = "server error"
    c.TplName = "501.tpl"
}


func (c *ErrorController) ErrorDb() {
    c.Data["content"] = "database is now down"
    c.TplName = "dberror.tpl"
}
```


通过上面的例子我们可以看到，所有的函数都是有一定规律的，都是 Error 开头，后面的名字就是我们调用 Abort 的名字，例如 Error404 函数其实调用对应的就是 Abort("404")

我们就只要在 beego.Run 之前采用 beego.ErrorController 注册这个错误处理函数就可以了


```go
package main

import (
    _ "btest/routers"
    "btest/controllers"

    "github.com/astaxie/beego"
)

func main() {
    beego.ErrorController(&controllers.ErrorController{})
    beego.Run()
}
```

