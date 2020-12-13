#### cookie 和 session

> 1.cookies 存在于浏览器端，用来存储用户登录的 session_id.当用户登录时，会在服务器端数据库中保存一个 session 的信息。代表当前的用户是登陆状态的。

```go
func authenticate(writer http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	user, err := data.UserByEmail(request.PostFormValue("email"))
	if err != nil {
		danger(err, "Cannot find user")
	}
	if user.Password == data.Encrypt(request.PostFormValue("password")) {
		session, err := user.CreateSession()
		if err != nil {
			danger(err, "Cannot create session")
		}
		cookie := http.Cookie{
			Name:     "_cookie",
			Value:    session.Uuid,
            //只能通过http/https的方式获得
			HttpOnly: true,
		}
       // 在浏览器端设置cookie
		http.SetCookie(writer, &cookie)
		http.Redirect(writer, request, "/", 302)
	} else {
		http.Redirect(writer, request, "/login", 302)
	}

}

```

> 2.用户登录后，每次发送的请求中都会在请求头重携带 cookie.可以在请求中获取 cookis 中对应 cookie 的值。如果通过这个值可以在数据库中查到 session.代表这个用户已经登录了。负责代表用户没有登录。

```go

func session(writer http.ResponseWriter, request *http.Request) (sess data.Session, err error) {
	cookie, err := request.Cookie("_cookie")
	if err == nil {
		sess = data.Session{Uuid: cookie.Value}
		if ok, _ := sess.Check(); !ok {
			err = errors.New("Invalid session")
		}
	}
	return
}
// sess.check()
func (session *Session) Check() (valid bool, err error) {
	err = Db.QueryRow("SELECT id, uuid, email, user_id, created_at FROM sessions WHERE uuid = $1", session.Uuid).
		Scan(&session.Id, &session.Uuid, &session.Email, &session.UserId, &session.CreatedAt)
	if err != nil {
		valid = false
		return
	}
	if session.Id != 0 {
		valid = true
	}
	return
}
```

> 3.当用户退出登录的时候，我们需要删除这个用户在数据库中的 session.

```go
func logout(writer http.ResponseWriter, request *http.Request) {
	cookie, err := request.Cookie("_cookie")
	if err != http.ErrNoCookie {
		warning(err, "Failed to get cookie")
        //包装成结构体
		session := data.Session{Uuid: cookie.Value}
		session.DeleteByUUID()
	}
	http.Redirect(writer, request, "/", 302)
}
func (session *Session) DeleteByUUID() (err error) {
	statement := "delete from sessions where uuid = $1"
	stmt, err := Db.Prepare(statement)
	if err != nil {
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(session.Uuid)
	return
}
```
