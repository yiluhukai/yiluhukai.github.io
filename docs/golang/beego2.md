#### 配置文件

[beego 配置文件](https://beego.me/docs/mvc/controller/config.md)

https://beego.me/docs/mvc/controller/config.md
beego 默认会解析当前应用下的 conf/app.conf 文件。

通过这个文件你可以初始化很多 beego 的默认参数：

```conf
appname = beepkg
httpaddr = "127.0.0.1"
httpport = 9090
runmode ="dev"
autorender = false
recoverpanic = false
viewspath = "myview"
```

上面这些参数会替换 beego 默认的一些参数, beego 的参数主要有哪些呢？[请参考](https://godoc.org/github.com/astaxie/beego#pkg-constants) 。
BConfig 就是 beego 里面的默认的配置，你也可以直接通过 beego.BConfig.AppName="beepkg"这样来修改，和上面的配置效果一样，只是一个在代码里面写死了，而配置文件就会显得更加灵活。

##### 获取配置信息

AppConfig 的方法如下：

```go
Set(key, val string) error
String(key string) string
Strings(key string) []string
Int(key string) (int, error)
Int64(key string) (int64, error)
Bool(key string) (bool, error)
Float(key string) (float64, error)
DefaultString(key string, defaultVal string) string
DefaultStrings(key string, defaultVal []string)
DefaultInt(key string, defaultVal int) int
DefaultInt64(key string, defaultVal int64) int64
DefaultBool(key string, defaultVal bool) bool
DefaultFloat(key string, defaultVal float64) float64
DIY(key string) (interface{}, error)
GetSection(section string) (map[string]string, error)
SaveConfigFile(filename string) error

beego.AppConfig.String("mysqluser")
beego.AppConfig.String("mysqlpass")
beego.AppConfig.String("mysqlurls")
beego.AppConfig.String("mysqldb")
```

##### 不同级别的配置

在配置文件里面支持 section，可以有不同的 Runmode 的配置，默认优先读取 runmode 下的配置信息，例如下面的配置文件：

```go
appname = beepkg
httpaddr = "127.0.0.1"
httpport = 9090
runmode ="dev"
autorender = false
recoverpanic = false
viewspath = "myview"

[dev]
httpport = 8080
[prod]
httpport = 8088
[test]
httpport = 8888
```

上面的配置文件就是在不同的 runmode 下解析不同的配置，例如在 dev 模式下，httpport 是 8080，在 prod 模式下是 8088，在 test 模式下是 8888。其他配置文件同理。解析的时候优先解析 runmode 下的配置，然后解析默认的配置。

#### 多个配置文件

INI 格式配置支持 include 方式，引用多个配置文件，例如下面的两个配置文件效果同上：

app.conf

```conf
appname = beepkg
httpaddr = "127.0.0.1"
httpport = 9090

include "app2.conf"
```

app2.conf

```go
runmode ="dev"
autorender = false
recoverpanic = false
viewspath = "myview"

[dev]
httpport = 8080
[prod]
httpport = 8088
[test]
httpport = 8888
```

#### 路由设置

[参考](https://beego.me/docs/mvc/controller/router.md)

##### 固定路由

固定路由也就是全匹配的路由，如下所示：

```go
beego.Router("/", &controllers.MainController{})
beego.Router("/admin", &admin.UserController{})
beego.Router("/admin/index", &admin.ArticleController{})
beego.Router("/admin/addpkg", &admin.AddController{})
```

如上所示的路由就是我们最常用的路由方式，一个固定的路由，一个控制器，然后根据用户请求方法不同请求控制器中对应的方法，典型的 RESTful 方式。

##### 正则路由

为了用户更加方便的路由设置，beego 参考了 sinatra 的路由实现，支持多种方式的路由：

```go
beego.Router(“/api/?:id”, &controllers.RController{})
```

默认匹配 //例如对于 URL”/api/123”可以匹配成功，此时变量”:id”值为”123”

```
beego.Router(“/api/:id”, &controllers.RController{})
```

默认匹配 //例如对于 URL”/api/123”可以匹配成功，此时变量”:id”值为”123”，但 URL”/api/“匹配失败

```
beego.Router(“/api/:id([0-9]+)“, &controllers.RController{})
```

自定义正则匹配 //例如对于 URL”/api/123”可以匹配成功，此时变量”:id”值为”123”

```
beego.Router(“/user/:username([\\w]+)“, &controllers.RController{})
```

正则字符串匹配 //例如对于 URL”/user/astaxie”可以匹配成功，此时变量”:username”值为”astaxie”

```
beego.Router(“/download/*.*”, &controllers.RController{})
```

\*匹配方式 //例如对于 URL”/download/file/api.xml”可以匹配成功，此时变量”:path”值为”file/api”， “:ext”值为”xml”

```
beego.Router(“/download/ceshi/*“, &controllers.RController{})
```

\*全匹配方式 //例如对于 URL”/download/ceshi/file/api.json”可以匹配成功，此时变量”:splat”值为”file/api.json”

```
beego.Router(“/:id:int”, &controllers.RController{})
```

int 类型设置方式，匹配 :id 为 int 类型，框架帮你实现了正则 ([0-9]+)

```
beego.Router(“/:hi:string”, &controllers.RController{})
```

string 类型设置方式，匹配 :hi 为 string 类型。框架帮你实现了正则 ([\w]+)

```
beego.Router(“/cms_:id([0-9]+).html”, &controllers.CmsController{})
```

带有前缀的自定义正则 //匹配 :id 为正则类型。匹配 cms_123.html 这样的 url :id = 123

可以在 Controller 中通过如下方式获取上面的变量：

```go
this.Ctx.Input.Param(":id")
this.Ctx.Input.Param(":username")
this.Ctx.Input.Param(":splat")
this.Ctx.Input.Param(":path")
this.Ctx.Input.Param(":ext")
```

#### 自动路由

用户首先需要把需要路由的控制器注册到自动路由中：

```
beego.AutoRouter(&controllers.ObjectController{})
```

那么 beego 就会通过反射获取该结构体中所有的实现方法，你就可以通过如下的方式访问到对应的方法中：

```
/object/login   调用 ObjectController 中的 Login 方法
/object/logout  调用 ObjectController 中的 Logout 方法
```

除了前缀两个 /:controller/:method 的匹配之外，剩下的 url beego 会帮你自动化解析为参数，保存在 this.Ctx.Input.Params 当中：

```
/object/blog/2013/09/12  调用 ObjectController 中的 Blog 方法，参数如下：map[0:2013 1:09 2:12]
```

方法名在内部是保存了用户设置的，例如 Login，url 匹配的时候都会转化为小写，所以，/object/LOGIN 这样的 url 也一样可以路由到用户定义的 Login 方法中。

现在已经可以通过自动识别出来下面类似的所有 url，都会把请求分发到 controller 的 simple 方法：

```
/controller/simple
/controller/simple.html
/controller/simple.json
/controller/simple.xml
```

可以通过 this.Ctx.Input.Param(":ext") 获取后缀名。

#### 自定义方法及 RESTful 规则

上面列举的是默认的请求方法名（请求的 method 和函数名一致，例如 GET 请求执行 Get 函数，POST 请求执行 Post 函数），如果用户期望自定义函数名，那么可以使用如下方式：

```
beego.Router("/",&IndexController{},"*:Index")
```

使用第三个参数，第三个参数就是用来设置对应 method 到函数名，定义如下

\*表示任意的 method 都执行该函数
使用 httpmethod:funcname 格式来展示
多个不同的格式使用 ; 分割
多个 method 对应同一个 funcname，method 之间通过 , 来分割
以下是一个 RESTful 的设计示例：

```
beego.Router("/api/list",&RestController{},"*:ListFood")
beego.Router("/api/create",&RestController{},"post:CreateFood")
beego.Router("/api/update",&RestController{},"put:UpdateFood")
beego.Router("/api/delete",&RestController{},"delete:DeleteFood")
```

以下是多个 HTTP Method 指向同一个函数的示例：

```
beego.Router("/api",&RestController{},"get,post:ApiFunc")
```

以下是不同的 method 对应不同的函数，通过 ; 进行分割的示例：

```
beego.Router("/simple",&SimpleController{},"get:GetFunc;post:PostFunc")
```

#### controller 函数

-   this.StopRun() 提前终止运行,后面的代码不执行
-   this.Request.Method 获取请求方法

#### xsrf

跨站请求伪造
跨站请求伪造(Cross-site request forgery)， 简称为 XSRF，是 Web 应用中常见的一个安全问题。前面的链接也详细讲述了 XSRF 攻击的实现方式。

当前防范 XSRF 的一种通用的方法，是对每一个用户都记录一个无法预知的 cookie 数据，然后要求所有提交的请求（POST/PUT/DELETE）中都必须带有这个 cookie 数据。如果此数据不匹配 ，那么这个请求就可能是被伪造的。

beego 有内建的 XSRF 的防范机制，要使用此机制，你需要在应用配置文件中加上 enablexsrf 设定：

```
enablexsrf = true
xsrfkey = 61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o
xsrfexpire = 3600
```

或者直接在 main 入口处这样设置：

```
beego.EnableXSRF = true
beego.XSRFKEY = "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o"
beego.XSRFExpire = 3600  //过期时间，默认1小时
```

如果开启了 XSRF，那么 beego 的 Web 应用将对所有用户设置一个 \_xsrf 的 cookie 值（默认过期 1 小时），如果 POST PUT DELET 请求中没有这个 cookie 值，那么这个请求会被直接拒绝。如果你开启了这个机制，那么在所有被提交的表单中，你都需要加上一个域来提供这个值。你可以通过在模板中使用 专门的函数 XSRFFormHTML() 来做到这一点：

过期时间上面我们设置了全局的过期时间 beego.XSRFExpire，但是有些时候我们也可以在控制器中修改这个过期时间，专门针对某一类处理逻辑：

```go
func (this *HomeController) Get(){
    this.XSRFExpire = 7200
    this.Data["xsrfdata"]=template.HTML(this.XSRFFormHTML())
}
```

在表单中使用
在 Controller 中这样设置数据：

```go
func (this *HomeController) Get(){
    this.Data["xsrfdata"]=template.HTML(this.XSRFFormHTML())
}
```

然后在模板中这样设置：

```html
<form action="/new_message" method="post">
	{{ .xsrfdata }}
	<input type="text" name="message" />
	<input type="submit" value="Post" />
</form>
```

在 JavaScript 中使用
如果你提交的是 AJAX 的 POST 请求，你还是需要在每一个请求中通过脚本添加上 \_xsrf 这个值。下面是在 AJAX 的 POST 请求，使用了 jQuery 函数来为所有请求都添加 \_xsrf 值：

jQuery cookie 插件：https://github.com/carhartl/jquery-cookie
base64 插件：http://phpjs.org/functions/base64_decode/

```js
jQuery.postJSON = function(url, args, callback) {
	var xsrf, xsrflist
	xsrf = $.cookie('_xsrf')
	xsrflist = xsrf.split('|')
	args._xsrf = base64_decode(xsrflist[0])
	$.ajax({
		url: url,
		data: $.param(args),
		dataType: 'text',
		type: 'POST',
		success: function(response) {
			callback(eval('(' + response + ')'))
		}
	})
}
```

扩展 jQuery
通过扩展 ajax 给每个请求加入 xsrf 的 header

需要你在 html 里保存一个 \_xsrf 值

```go
func (this *HomeController) Get(){
    this.Data["xsrf_token"] = this.XSRFToken()
}
```

放在你的 head 中

```html
<head>
	<meta name="_xsrf" content="{{.xsrf_token}}" />
</head>
```

扩展 ajax 方法，将 \_xsrf 值加入 header，扩展后支持 jquery post/get 等内部使用了 ajax 的方法

```js
var ajax = $.ajax
$.extend({
	ajax: function(url, options) {
		if (typeof url === 'object') {
			options = url
			url = undefined
		}
		options = options || {}
		url = options.url
		var xsrftoken = $('meta[name=_xsrf]').attr('content')
		var headers = options.headers || {}
		var domain = document.domain.replace(/\./gi, '\\.')
		if (!/^(http:|https:).*/.test(url) || eval('/^(http:|https:)\\/\\/(.+\\.)*' + domain + '.*/').test(url)) {
			headers = $.extend(headers, { 'X-Xsrftoken': xsrftoken })
		}
		options.headers = headers
		return ajax(url, options)
	}
})
```

对于 PUT 和 DELETE 请求（以及不使用将 form 内容作为参数的 POST 请求）来说，你也可以在 HTTP 头中以 X-XSRFToken 这个参数传递 XSRF token。

如果你需要针对每一个请求处理器定制 XSRF 行为，你可以重写 Controller 的 CheckXSRFCookie 方法。例如你需要使用一个不支持 cookie 的 API， 你可以通过将 CheckXSRFCookie() 函数设空来禁用 XSRF 保护机制。然而如果 你需要同时支持 cookie 和非 cookie 认证方式，那么只要当前请求是通过 cookie 进行认证的，你就应该对其使用 XSRF 保护机制，这一点至关重要。

支持 controller 级别的屏蔽
XSRF 之前是全局设置的一个参数,如果设置了那么所有的 API 请求都会进行验证,但是有些时候 API 逻辑是不需要进行验证的,因此现在支持在 controller 级别设置屏蔽:

```go
type AdminController struct{
    beego.Controller
}

func (a *AdminController) Prepare() {
    a.EnableXSRF = false
}

```

#### 文件上传

在 beego 中你可以很容易的处理文件上传，就是别忘记在你的 form 表单中增加这个属性 enctype="multipart/form-data"，否则你的浏览器不会传输你的上传文件。

文件上传之后一般是放在系统的内存里面，如果文件的 size 大于设置的缓存内存大小，那么就放在临时文件中，默认的缓存内存是 64M，你可以通过如下来调整这个缓存内存大小:

```
beego.MaxMemory = 1<<22
```

或者在配置文件中通过如下设置：

```
maxmemory = 1<<22
```

Beego 提供了两个很方便的方法来处理文件上传：

```
GetFile(key string) (multipart.File, *multipart.FileHeader, error)
```

该方法主要用于用户读取表单中的文件名 the_file，然后返回相应的信息，用户根据这些变量来处理文件上传：过滤、保存文件等。

```
SaveToFile(fromfile, tofile string) error
```

该方法是在 GetFile 的基础上实现了快速保存的功能
fromfile 是提交时候的 html 表单中的 name

```html
<form enctype="multipart/form-data" method="post">
	<input type="file" name="uploadname" />
	<input type="submit" />
</form>
```

保存的代码例子如下：

```go
func (c *FormController) Post() {
    f, h, err := c.GetFile("uploadname")
    if err != nil {
        log.Fatal("getfile err ", err)
    }
    defer f.Close()
    c.SaveToFile("uploadname", "static/upload/" + h.Filename) // 保存位置在 static/upload, 没有文件夹要先创建

}
```

##### 通过 ajax 的方式上传文件

前端代码

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<script src="/static/js/jquery.js"></script>
	</head>

	<body>
		<form enctype="multipart/form-data" method="post">
			<input type="file" name="uploadname" id="uploadname" />
			<input type="submit" id="btn" />
		</form>

		<script>
			$(document).ready(function() {
				const btn = $('#btn')
				btn.click = function(e) {
					const formData = new FormData()
					const files = $('#uploadname')[0].files
					for (let i = 0; i < files.length; i++) {
						const { name, size, type } = items[i] // get file name

						//formData.append('uploadname', fileData, name)
						formData.append('uploadname', fileData)
					}

					$.ajax({
						type: 'POST',
						processData: false, // 使数据不做处理
						contentType: false, // 不要设置Content-Type请求头

						data: {
							...FormData
						},
						success: data => {
							console.log(data)
						},
						error: err => {
							console.log(err)
						}
					})
				}
			})
		</script>
	</body>
</html>
```

后端代码

```go
func (this *UploadController) Get() {
	this.TplName = "upload.html"
}

// 处理文件上传
func (this *UploadController) Post() {

	f, h, err := this.GetFile("uploadname")
	if err != nil {
		//log.Fatal("getfile err ", err)
		this.Data["json"] = &map[string]string{"code": "1000", "message": err.Error()}
		this.ServeJSON()
		this.StopRun()
	}

	defer f.Close()

	//fmt.Printf("body=%v;header=%v\n", this.Ctx.Request.Body, this.Ctx.Request.Header)

	timeStamp := time.Now().Unix()

	fileName := fmt.Sprintf("%d_%s", timeStamp, h.Filename)

	this.SaveToFile("uploadname", "static/upload/"+fileName) // 保存位置在 static/upload, 没有文件夹要先创建

	this.Data["json"] = &map[string]string{"code": "200", "message": "上传成功"}
	this.ServeJSON()

}

```

##### 文件上传时的请求体

```text
POST /user/12 HTTP/1.1
Host: localhost:8080
Connection: keep-alive
Content-Length: 355
Postman-Token: 8accc128-2875-5e71-970d-622c98a60075
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36
Content-Type: multipart/form-data
Accept: */*
Origin: chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop
Sec-Fetch-Site: none
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9

------WebKitFormBoundary5hme6WdAaqJtAux0
Content-Disposition: form-data; name="upload1"; filename="test_file.txt"
Content-Type: text/plain

hello world

------WebKitFormBoundary5hme6WdAaqJtAux0
Content-Disposition: form-data; name="upload2"; filename="test_file2.txt"
Content-Type: text/plain

happy

------WebKitFormBoundary5hme6WdAaqJtAux0--
```
