

#### 创建一个beego应用

##### Create hello directory, cd hello directory
```shell
mkdir hello
cd hello
```

##### Init module
```shell
go mod init
Download and install
go get github.com/astaxie/beego
```

##### Create file hello.go
```go
package main

import "github.com/astaxie/beego"

func main(){
    beego.Run()
}
```

##### Build and run

```shell
go build hello.go
./hello
Go to http://localhost:8080
```


#### 使用bee工具创建一个beego应用

bee 工具是一个为了协助快速开发 beego 项目而创建的项目，通过 bee 您可以很容易的进行 beego 项目的创建、热编译、开发、测试、和部署。

#### bee安装
[bee安装]( https://beego.me/docs/install/bee.md)

```shell
go get github.com/beego/bee
```


#### 使用

```shell
Bee is a Fast and Flexible tool for managing your Beego Web Application.

Usage:

    bee command [arguments]

The commands are:

    version     show the bee & beego version
    migrate     run database migrations
    api         create an api application base on beego framework
    bale        packs non-Go files to Go source files    
    new         create an application base on beego framework
    run         run the app which can hot compile
    pack        compress an beego project
    fix         Fixes your application by making it compatible with newer versions of Beego
    dlv         Start a debugging session using Delve
    dockerize   Generates a Dockerfile for your Beego application
    generate    Source code generator
    hprose      Creates an RPC application based on Hprose and Beego frameworks
    pack        Compresses a Beego application into a single file
    rs          Run customized scripts
    run         Run the application by starting a local development server
    server      serving static content over HTTP on port
    
Use bee help [command] for more information about a command.
    
```

* new命令创建一个web项目
* api命令用来api应用
* run命令用来启动一个项目（修改后不需要重新编译项目）


#### 使用bee创建一个web应用


```shell
bee new myproject
[INFO] Creating application...
/gopath/src/myproject/
/gopath/src/myproject/conf/
/gopath/src/myproject/controllers/
/gopath/src/myproject/models/
/gopath/src/myproject/static/
/gopath/src/myproject/static/js/
/gopath/src/myproject/static/css/
/gopath/src/myproject/static/img/
/gopath/src/myproject/views/
/gopath/src/myproject/conf/app.conf
/gopath/src/myproject/controllers/default.go
/gopath/src/myproject/views/index.tpl
/gopath/src/myproject/main.go
13-11-25 09:50:39 [SUCC] New application successfully created!
```

目录结构

```shellmyproject
├── conf
│   └── app.conf
├── controllers
│   └── default.go
├── main.go
├── models
├── routers
│   └── router.go
├── static
│   ├── css
│   ├── img
│   └── js
├── tests
│   └── default_test.go
└── views
    └── index.tpl

8 directories, 4 files

```

* conf下是项目ip和port的配置信息
* models、views、controllers  对应MVC结构
* routers用来配置路由信息
* main.go 项目的入口文件
* static 项目中用到的静态文件


#### beego项目的执行逻辑

![fbe5539a293a12539c64dec82a7a84ad](/golang/76AAE751-C169-438F-8A04-0275554AB2F0.png)

#### Controller解析

* 在main.go中加在路由，会执行router文件中的init()

```go
package main

import (
	_ "bee_go_demo/routers"
	"github.com/astaxie/beego"
)

func main() {
	beego.Run()
}

```

* router.go

```go
package routers

import (
	"bee_go_demo/controllers"

	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/user", &controllers.UserController{})
}
```


* 根据路由对应不同的controller的地址,根据不同的请求方法调用controller的方法 get->Get post->Post

```go
package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "index.tpl"
}

type UserController struct {
	beego.Controller
}

func (this *UserController) Get() {
	//this.Ctx.WriteString("hello wolrd!")
	this.Data["Name"] = "yiluhuakai"
	this.Data["Age"] = "32"
	this.TplName = "user.html"
}

```

* go中使用组合代替继承，每个controller都包含一个匿名字段beego.Controller


```go
...
type Controller struct {
	// context data
	Ctx  *context.Context
	Data map[interface{}]interface{}

	// route controller info
	controllerName string
	actionName     string
	methodMapping  map[string]func() //method:routertree
	AppController  interface{}

	// template data
	TplName        string
	ViewPath       string
	Layout         string
	LayoutSections map[string]string // the key is the section name and the value is the template name
	TplPrefix      string
	TplExt         string
	EnableRender   bool

	// xsrf data
	_xsrfToken string
	XSRFExpire int
	EnableXSRF bool

	// session
	CruSession session.Store
}
// Get adds a request function to handle GET request.
func (c *Controller) Get() {
	http.Error(c.Ctx.ResponseWriter, "Method Not Allowed", http.StatusMethodNotAllowed)
}

// Post adds a request function to handle POST request.
func (c *Controller) Post() {
	http.Error(c.Ctx.ResponseWriter, "Method Not Allowed", http.StatusMethodNotAllowed)
}

// Delete adds a request function to handle DELETE request.
func (c *Controller) Delete() {
	http.Error(c.Ctx.ResponseWriter, "Method Not Allowed", http.StatusMethodNotAllowed)
}

// Put adds a request function to handle PUT request.
func (c *Controller) Put() {
	http.Error(c.Ctx.ResponseWriter, "Method Not Allowed", http.StatusMethodNotAllowed)
}
...
```

* 当我们不去实现Get方法时，回去调用beego.Controlle中的Get方法
```go

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "index.tpl"
}
```


#### 修改模版目录

beego 中默认的模板目录是 views，用户可以把模板文件放到该目录下，beego 会自动在该目录下的所有模板文件进行解析并缓存，开发模式下每次都会重新解析，不做缓存。当然，用户也可以通过如下的方式改变模板的目录（只能指定一个目录为模板目录）：
```go
beego.SetViewsPath("views")
```

活着在conf下修改配置

```conf
viewsPath = hello
```

#### 指定模版引擎

* 在前面编写 Controller 的时候，我们在 Get 里面写过这样的语句 this.TplName = "index.tpl"，设置显示的模板文件，默认支持 tpl 和 html 的后缀名，如果想设置其他后缀你可以调用 beego.AddTemplateExt 接口设置
    * beego.AddTemplateExt("后缀名")
   
* 当不指定模版，回默认使用controller/<方法名>.tpl
* 数据渲染 c.Data["Website"] = "beego.me" 
    * 模版中使用 \{ \{.Website\} \}  其中.代表上下文


#### 模版语法

[模版语法指南](https://beego.me/docs/mvc/view/tutorial.md)

#### 结构体

```go

type User struct {
	Id   int
	Name string
	Age  int
}

user1 := User{
		Id:   1,
		Name: "yiluhuakai",
		Age:  3,
	}
this.Data["user"] = user1

```


```html
    <p>ID:{{.user.Id}}</p>
	<p>Name:{{.user.Name}}</p>
	<p>Age:{{.user.Age}}</p>
```



#### range … end  用于遍历
* { \{range pipeline}\}{\{.} \}{ {end} }
* pipeline 支持的类型为 array, slice, map, channelrange 循环内部的 
* . 改变为以上类型的子元素,对应的值长度为 0 时，range 不会执行，. 不会改变

```html
pages := []struct {
    Num int
}{{10}, {20}, {30}}

this.Data["Total"] = 100
this.Data["Pages"] = pages
使用 .Num 输出子元素的 Num 属性，使用 $. 引用模板中的根级上下文

{{range .Pages}}
    {{.Num}} of {{$.Total}}
{{end}}
使用创建的变量，在这里和 go 中的 range 用法是相同的。

{{range $index, $elem := .Pages}}
    {{$index}} - {{$elem.Num}} - {{.Num}} of {{$.Total}}
{{end}}
range 也支持 else

{{range .Pages}}
{{else}}
    {{/* 当 .Pages 为空 或者 长度为 0 时会执行这里 */}}
{{end}}
```

#### 静态文件

beego 默认注册了 static 目录为静态处理的目录，注册样式：URL 前缀和映射的目录（在/main.go文件中beego.Run()之前加入）：
```go
StaticDir["/static"] = "static"
```
Go 语言内部其实已经提供了 http.ServeFile，通过这个函数可以实现静态文件的服务。beego 针对这个功能进行了一层封装，通过下面的方式进行静态文件注册：
```go
beego.SetStaticPath("/static","public")
```
第一个参数是路径，url 路径信息
第二个参数是静态文件目录（相对应用所在的目录）
beego 支持多个目录的静态文件注册，用户可以注册如下的静态文件目录：
```go
beego.SetStaticPath("/images","images")
beego.SetStaticPath("/css","css")
beego.SetStaticPath("/js","js")
```

#### 获取query

[请求参数获取](https://beego.me/docs/mvc/controller/params.md)

我们经常需要获取用户传递的数据，包括 Get、POST 等方式的请求，beego 里面会自动解析这些数据，你可以通过如下方式获取数据：

```go
GetString(key string) string
GetStrings(key string) []string
GetInt(key string) (int64, error)
GetBool(key string) (bool, error)
GetFloat(key string) (float64, error)
// 获取一个字段的多个参数
GetString(key string) []string
```
使用例子如下：

```go
func (this *MainController) Post() {
    jsoninfo := this.GetString("jsoninfo")
    if jsoninfo == "" {
        this.Ctx.WriteString("jsoninfo is empty")
        return
    }
}
```
如果你需要的数据可能是其他类型的，例如是 int 类型而不是 int64，那么你需要这样处理：

```go
func (this *MainController) Post() {
    id := this.Input().Get("id")
    intid, err := strconv.Atoi(id)
}
```


#### 获取params
* 路由设置
```go
beego.Router("/user/?:id", &controllers.UserController{})
```
* 获取param
```go
//method1
id := this.Ctx.Input.Param(":id")

fmt.Printf("id=%v\n", id)
//method2
id1 := this.GetString(":id")
fmt.Printf("id=%v\n", id1)
```

##### 解析结构体

* Content-Type：application/x-www-form-urlencoded

```go
type User struct {
	Id   int    `form:"-"`
	Name string `form:"name"`
	Age  string  `form:"age"`
}
user := User{}
err := this.ParseForm(&user)

if err != nil {
    fmt.Printf("err=%v", err)
    this.Ctx.Output.JSON(err, true, true)
    return
}
```

postman 中指定 Content-Type：application/x-www-form-urlencoded
body:name=hello&age=23，不能指定为int.

* application/json
    * 在配置文件里设置 copyrequestbody = true
    * 在 Controller 中
```go
type User struct {
	Id   int    `form:"-"`
	Name string `form:"name"`
	Age  int    `form:"age"`
}

func (this *UserController) Post() {
	//  解析到结构体
	user := User{}
	if err := json.Unmarshal(this.Ctx.Input.RequestBody, &user); err == nil {
		//objectid := models.AddOne(ob)
		fmt.Printf("user=%#v\n", user)
		this.Data["json"] = user
	} else {
		this.Data["json"] = err.Error()
	}
	this.ServeJSON()

}
```

postman 的body

```json
{
  "name":"li",
  "age":23
}
```
#### 多种格式输出

beego 当初设计的时候就考虑了 API 功能的设计，而我们在设计 API 的时候经常是输出 JSON 或者 XML 数据，那么 beego 提供了这样的方式直接输出：

注意 struct 属性应该 为 exported Identifier
首字母应该大写
JSON 数据直接输出：
```GO
func (this *AddController) Get() {
    mystruct := { ... }
    this.Data["json"] = &mystruct
    this.ServeJSON()
}
```
调用 ServeJSON 之后，会设置 content-type 为 application/json，然后同时把数据进行 JSON 序列化输出。

XML 数据直接输出：
```GO
func (this *AddController) Get() {
    mystruct := { ... }
    this.Data["xml"]=&mystruct
    this.ServeXML()
}
```
调用 ServeXML 之后，会设置 content-type 为 application/xml，同时数据会进行 XML 序列化输出。

jsonp 调用
```Go
func (this *AddController) Get() {
    mystruct := { ... }
    this.Data["jsonp"] = &mystruct
    this.ServeJSONP()
}
调用 ServeJSONP 之后，会设置 content-type 为 application/javascript，然后同时把数据进行 JSON 序列化，然后根据请求的 callback 参数设置 jsonp 输出。
```
开发模式下序列化后输出的是格式化易阅读的 JSON 或 XML 字符串；在生产模式下序列化后输出的是压缩的字符串。

使用原生的jsonp请求
```html
<div id="jsonp"></div>

<script>
    function callbackFunction(data) {


        console.log(data)
        var html = '<ul>';
        for (var i = 0; i < data.length; i++) {
            html += '<li>' + data[i] + '</li>';
        }
        html += '</ul>';

        $('#jsonp').html(html);
    }

</script>

<script src="/jsonp?callback=callbackFunction"> 
```

```go
data := []string{"customername1", "customername2"}
this.Data["jsonp"] = &data
this.ServeJSONP()
```
返回的数据
```text
if(window.callbackFunction) callbackFunction(["customername1", "customername2"])
```


使用jquery的方式

```js
function callbackFunction(data) {


			console.log(data)
			var html = '<ul>';
			for (var i = 0; i < data.length; i++) {
				html += '<li>' + data[i] + '</li>';
			}
			html += '</ul>';

			$('#jsonp').html(html);
		}

		$.ajax({
			url: "/jsonp",
			type: "GET",
			dataType: "jsonp", //指定服务器返回的数据类型
			jsonpCallback: "callbackFunction", //指定回调函数
			success: (res) => {
				console.log(res)
			}
		})
```
后端代码
```go
    callback := this.GetString("callback")
	data := []string{"customername1", "customername2"}

	json, _ := json.Marshal(data)
	responseStr := fmt.Sprintf("%s(%s)", callback, string(json))
	this.Ctx.Output.Header("Content-Type", "application/javascript")

	this.Ctx.Output.Body([]byte(responseStr))
```

####  flash数据

这个 flash 与 Adobe/Macromedia Flash 没有任何关系。它主要用于在两个逻辑间传递临时数据，flash 中存放的所有数据会在紧接着的下一个逻辑中调用后清除。一般用于传递提示和错误消息。它适合 Post/Redirect/Get 模式。下面看使用的例子：

```go
// 显示设置信息
func (c *MainController) Get() {
    flash:=beego.ReadFromRequest(&c.Controller)
    if n,ok:=flash.Data["notice"];ok{
        // 显示设置成功
        c.TplName = "set_success.html"
    }else if n,ok=flash.Data["error"];ok{
        // 显示错误
        c.TplName = "set_error.html"
    }else{
        // 不然默认显示设置页面
        c.Data["list"]=GetInfo()
        c.TplName = "setting_list.html"
    }
}

// 处理设置信息
func (c *MainController) Post() {
    flash:=beego.NewFlash()
    setting:=Settings{}
    valid := Validation{}
    c.ParseForm(&setting)
    if b, err := valid.Valid(setting);err!=nil {
        flash.Error("Settings invalid!")
        flash.Store(&c.Controller)
        c.Redirect("/setting",302)
        return
    }else if b!=nil{
        flash.Error("validation err!")
        flash.Store(&c.Controller)
        c.Redirect("/setting",302)
        return
    }
    saveSetting(setting)
    flash.Notice("Settings saved!")
    flash.Store(&c.Controller)
    c.Redirect("/setting",302)
}
```

上面的代码执行的大概逻辑是这样的：

1. Get 方法执行，因为没有 flash 数据，所以显示设置页面。
2. 用户设置信息之后点击递交，执行 Post，然后初始化一个 flash，通过验证，验证出错或者验证不通过设置 flash 的错误，如果通过了就保存设置，然后设置 flash 成功设置的信息。
3. 设置完成后跳转到 Get 请求。
4. Get 请求获取到了 Flash 信息，然后执行相应的逻辑，如果出错显示出错的页面，如果成功显示成功的页面。
默认情况下 ReadFromRequest 函数已经实现了读取的数据赋值给 flash，所以在你的模板里面你可以这样读取数据





​    











