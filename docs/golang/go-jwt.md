### 什么是jwt

```tex
Json web token (JWT), 是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准（(RFC 7519).该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。
```

### jwt的组成

* **header**
  * jwt的头部承载两部分信息：
  * 声明类型，这里是jwt
  * 声明加密的算法 通常直接使用 HMAC SHA256

完整的头部就像下面这样的JSON：

```json
{
  'typ': 'JWT',
  'alg': 'HS256'
}
```

将头部的信息序列化后转化为base.

* ### playload

  * 载荷就是存放有效信息的地方。这个名字像是特指飞机上承载的货品，这些有效信息包含三个部分

    - 标准中注册的声明
    - 公共的声明
    - 私有的声明
  * 标准中注册的声明** (建议但不强制使用) ：
  
    - **iss**: jwt签发者
    - **sub**: jwt所面向的用户
    - **aud**: 接收jwt的一方
    - **exp**: jwt的过期时间，这个过期时间必须要大于签发时间
    - **nbf**: 定义在什么时间之前，该jwt都是不可用的.
    - **iat**: jwt的签发时间
    - **jti**: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
  * 公共的声明** ：
       公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.
  * **私有的声明** ：
       私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。

定义一个`payload`

```go
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

然后将其进行base64加密，得到Jwt的第二部分。

* **signature**
  * header (base64后的)
  * payload (base64后的)
  * secret

这个部分需要base64加密后的header和base64加密后的payload使用`.`连接组成的字符串，然后通过header中声明的加密方式进行加盐`secret`组合加密，然后就构成了jwt的第三部分。

#### `iris框架中使用jwt`

* `jwt`在`iris`中是以一个`middleware`的形式存在的
* 其中的生成`jwt`的过程和上面的描述的类似

```go
package main

import (
	"github.com/iris-contrib/middleware/jwt"
	"github.com/kataras/iris/v12"
)

func getTokenHandler(ctx iris.Context) {
	token := jwt.NewTokenWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "1234567890",
		"name": "John Doe",
		"admin": true,
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, _ := token.SignedString([]byte("My Secret"))

	ctx.HTML(`Token: ` + tokenString + `<br/><br/>
    <a href="/secured?token=` + tokenString + `">/secured?token=` + tokenString + `</a>`)
}

func myAuthenticatedHandler(ctx iris.Context) {
	user := ctx.Values().Get("jwt").(*jwt.Token)

	ctx.Writef("This is an authenticated request\n")
	ctx.Writef("Claim content:\n")

	foobar := user.Claims.(jwt.MapClaims)
	for key, value := range foobar {
		ctx.Writef("%s = %s", key, value)
	}
}

func main() {
	app := iris.New()

	j := jwt.New(jwt.Config{
		// Extract by "token" url parameter.
		Extractor: jwt.FromParameter("token"),

		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte("My Secret"), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	app.Get("/", getTokenHandler)
	app.Get("/secured", j.Serve, myAuthenticatedHandler)
	app.Listen(":8081")
}

```

`生成jwt`:

```json
// 设置head 和payload
token := jwt.NewTokenWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "1234567890",
		"name": "John Doe",
		"admin": true,
	})

// add salt
tokenString, _ := token.SignedString([]byte("My Secret"))
```

底层实现：

```go
var (
	NewToken           = jwt.New
	NewTokenWithClaims = jwt.NewWithClaims
)
// 生成一个未加盐的token
func NewWithClaims(method SigningMethod, claims Claims) *Token {
	return &Token{
		Header: map[string]interface{}{
			"typ": "JWT",
			"alg": method.Alg(),
		},
		Claims: claims,
		Method: method,
	}
}
// 加盐的底层实现
// Get the complete, signed token

func (t *Token) SignedString(key interface{}) (string, error) {
	var sig, sstr string
	var err error
	if sstr, err = t.SigningString(); err != nil {
		return "", err
	}
  // 加盐
	if sig, err = t.Method.Sign(sstr, key); err != nil {
		return "", err
	}
  // 将header和payload转成base64后再和加盐生成的sig拼接形成token
	return strings.Join([]string{sstr, sig}, "."), nil
}
// 将header和payload转成base64并用`.`连接
func (t *Token) SigningString() (string, error) {
	var err error
	parts := make([]string, 2)
	for i, _ := range parts {
		var jsonValue []byte
		if i == 0 {
			if jsonValue, err = json.Marshal(t.Header); err != nil {
				return "", err
			}
		} else {
			if jsonValue, err = json.Marshal(t.Claims); err != nil {
				return "", err
			}
		}

		parts[i] = EncodeSegment(jsonValue)
	}
	return strings.Join(parts, "."), nil
}


// Encode JWT specific base64url encoding with padding stripped
func EncodeSegment(seg []byte) string {
	return strings.TrimRight(base64.URLEncoding.EncodeToString(seg), "=")
}


// 加盐的具体过程
// Implements the Sign method from SigningMethod for this signing method.
// Key must be []byte
func (m *SigningMethodHMAC) Sign(signingString string, key interface{}) (string, error) {
	if keyBytes, ok := key.([]byte); ok {
		if !m.Hash.Available() {
			return "", ErrHashUnavailable
		}

		hasher := hmac.New(m.Hash.New, keyBytes)
		hasher.Write([]byte(signingString))

		return EncodeSegment(hasher.Sum(nil)), nil
	}

	return "", ErrInvalidKeyType
}

```

* 验证生成的token

```go
j := jwt.New(jwt.Config{
  // Extract by "token" url parameter.
  // 从form中提取tokenzi字段
  Extractor: jwt.FromParameter("token"),

  ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
    return []byte("My Secret"), nil
  },
  SigningMethod: jwt.SigningMethodHS256,
})
// j.Serves是一个中间价
app.Get("/secured", j.Serve, myAuthenticatedHandler)


///// Serve the middleware's action
func (m *Middleware) Serve(ctx iris.Context) {
	if err := m.CheckJWT(ctx); err != nil {
		m.Config.ErrorHandler(ctx, err)
		return
	}
	// If everything ok then call next.
	ctx.Next()
}
```

` m.CheckJWT(ctx)`方法：

```go
// CheckJWT the main functionality, checks for token
func (m *Middleware) CheckJWT(ctx iris.Context) error {
	if !m.Config.EnableAuthOnOptions {
		if ctx.Method() == iris.MethodOptions {
			return nil
		}
	}

	// Use the specified token extractor to extract a token from the request
	token, err := m.Config.Extractor(ctx)

	// If debugging is turned on, log the outcome
	if err != nil {
		logf(ctx, "Error extracting JWT: %v", err)
		return err
	}

	logf(ctx, "Token extracted: %s", token)

	// If the token is empty...
	if token == "" {
		// Check if it was required
		if m.Config.CredentialsOptional {
			logf(ctx, "No credentials found (CredentialsOptional=true)")
			// No error, just no token (and that is ok given that CredentialsOptional is true)
			return nil
		}

		// If we get here, the required token is missing
		logf(ctx, "Error: No credentials found (CredentialsOptional=false)")
		return ErrTokenMissing
	}

	// Now parse the token

	parsedToken, err := jwtParser.Parse(token, m.Config.ValidationKeyGetter)
	// Check if there was an error in parsing...
	if err != nil {
		logf(ctx, "Error parsing token: %v", err)
		return err
	}

	if m.Config.SigningMethod != nil && m.Config.SigningMethod.Alg() != parsedToken.Header["alg"] {
		err := fmt.Errorf("Expected %s signing method but token specified %s",
			m.Config.SigningMethod.Alg(),
			parsedToken.Header["alg"])
		logf(ctx, "Error validating token algorithm: %v", err)
		return err
	}

	// Check if the parsed token is valid...
	if !parsedToken.Valid {
		logf(ctx, "Token is invalid")
		// m.Config.ErrorHandler(ctx, ErrTokenInvalid)
		return ErrTokenInvalid
	}
	// 验证token过期
	if m.Config.Expiration {
		if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
			if expired := claims.VerifyExpiresAt(time.Now().Unix(), true); !expired {
				logf(ctx, "Token is expired")
				return ErrTokenExpired
			}
		}
	}

	logf(ctx, "JWT: %v", parsedToken)

	// If we get here, everything worked and we can set the
	// user property in context.
	ctx.Values().Set(m.Config.ContextKey, parsedToken)

	return nil
}
```



[参考博客](https://www.jianshu.com/p/576dbf44b2ae)



​    