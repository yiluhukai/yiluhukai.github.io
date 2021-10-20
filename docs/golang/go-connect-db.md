### golang 链接数据库

## 原理

go 语言 database/sql 包实现了连接数据库的接口，并且自定了连接池。使用 go 连接数据库需要下载对应数据库的驱动。
如连接 postgres 数据库，获取对应的驱动。

```shell
go get github.com/lib/pq
```

mysql 驱动

```mysql
go get github.com/go-sql-driver/mysql
```

打开一个数据库实例

```go
package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

var (
	Db *sql.DB
)
// 打开一个数据库实例
func InitDb() (err error) {
	connStr := "postgres://lijunjie:lijunjie@localhost/lijunjie?sslmode=disable"
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}
    //设置连接池的最大数量和空闲时间的连接数
    Db.SetMaxOpenConns(100)
	Db.SetMaxIdleConns(16)
	err = Db.Ping()
	return
}
```

> 创建的数据库实例不会去建立真正的连接，所以密码错误在这快不会被发现，可以通过 Ping()方法去建立连接。

1.为什么要倒入驱动但是没有调用的驱动中的任何方法？
驱动的 connect.go 文件

```go
func init() {
	sql.Register("postgres", &Driver{})
}
```

init()方法会在 main()之前运行。在这个方法里面调用了 sql 包中的 Register 方法注册驱动。
sql.Register()

```go
func Register(name string, driver driver.Driver) {
	driversMu.Lock()
	defer driversMu.Unlock()
	if driver == nil {
		panic("sql: Register driver is nil")
	}
	if _, dup := drivers[name]; dup {
		panic("sql: Register called twice for driver " + name)
	}
	drivers[name] = driver
}
```

该方法会将驱动放入对应的 map.

drivers 的实现

```go
drivers   = make(map[string]driver.Driver)
```

sql.Open()

```go
func Open(driverName, dataSourceName string) (*DB, error) {
	driversMu.RLock()
	driveri, ok := drivers[driverName]
	driversMu.RUnlock()
	if !ok {
		return nil, fmt.Errorf("sql: unknown driver %q (forgotten import?)", driverName)
	}

	if driverCtx, ok := driveri.(driver.DriverContext); ok {
		connector, err := driverCtx.OpenConnector(dataSourceName)
		if err != nil {
			return nil, err
		}
		return OpenDB(connector), nil
	}

	return OpenDB(dsnConnector{dsn: dataSourceName, driver: driveri}), nil
}
```

这个方法会从对应的 map 中取出驱动去使用。

## 查询数据

1.查询单个数据 Db.QueryRow

```go
type User struct {
	Id       int
	Name     sql.NullString
	Age      int
	Email    string
	Password string
}

// 查询数据从数据库
func testDataQuery() {
	sqlStr := "select id,name,age,email from users where id = $1"
	row := Db.QueryRow(sqlStr, 1)

	var user User
	err := row.Scan(&user.Id,&user.Name,&user.Age,&user.Email)

	if err != nil {
		fmt.Printf("Scan err:%v", err)
	}


	if user.Name.Valid {
		fmt.Printf("user=%#v", user.Name.String)
	}
}
```

上面的 sql.NullString()是一个结构体。

```go
// NullString represents a string that may be null.
// NullString implements the Scanner interface so
// it can be used as a scan destination:
//
//  var s NullString
//  err := db.QueryRow("SELECT name FROM foo WHERE id=?", id).Scan(&s)
//  ...
//  if s.Valid {
//     // use s.String
//  } else {
//     // NULL value
//  }
//
type NullString struct {
	String string
	Valid  bool // Valid is true if String is not NULL
}
```

当这个字段不为 null 是，boo 为 true。当数据库中这个字段可能为 null,使用它。否则使用 string.还有 NullInt 等。

2.查询多行数据 Db.Query()

```go
//查询多行数据

func testQueryMutilRows() {
	sqlStr := "select id,name,age,email from users where id >$1"
	rows, err := Db.Query(sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed:%v", err)
		return
	}
	defer func() {
		// 一定要手动要关闭
		if rows != nil {
			rows.Close()
		}
	}()
	var user User
	for rows.Next() {
		err:= rows.Scan(&user.Id,&user.Name,&user.Age,&user.Email)
		if err!=nil{
			fmt.Printf("err:%v",err)
			return
		}
		fmt.Printf("user=%v\n",user)
	}
}
```

注意事项，上面的需要延迟调用 rows.Close()方法。row.Scan 方法在循环正常结束后会释放连接，但是因为 err 而 return 掉，连接不会释放。这样子将导致连接池一直被占用。
执行 101 次查询切不调用 row.Scan()方法，连接池的数量设置的为 100，程序会挂掉。后面的查询无法被执行。

```go
// 查询数据从数据库
func testDataQuery() {
	for i:=0;i<=100;i++ {

		fmt.Printf("query %v times\n",i)
		sqlStr := "select id,name,age,email from users where id = $1"
		row := Db.QueryRow(sqlStr, 1)
		if row!=nil {
			continue
		}

		var user User
        //一定要调用
		err := row.Scan(&user.Id, &user.Name, &user.Age, &user.Email)

		if err != nil {
			fmt.Printf("Scan err:%v", err)
		}

		if user.Name.Valid {
			fmt.Printf("user=%#v", user.Name.String)
		}
	}
}

```

3.插入数据和删除 Db.Exec()、result.LastInsertId()、result.RowsAffected（）

```go
func insertData(){
	sqlStr := "insert into users(name,password,age,email) values($1,$2,$3,$4)"
	result, err := Db.Exec(sqlStr, "hello12","123456",12,"1231343@qq.com")
	if err != nil {
		fmt.Printf("insert failed:%v", err)
		return
	}
	id,err:=result.LastInsertId()
	if err!=nil {
		fmt.Printf("驱动不支持:%v",err)
		return
	}
	fmt.Printf("inserted Id of  rows %v",id)
}


func deleteData(){
	sqlStr := "delete   from  users where id = $1 "
	result, err := Db.Exec(sqlStr, 3)
	if err != nil {
		fmt.Printf("delete failed:%v", err)
		return
	}
	id,err:=result.RowsAffected()
	if err!=nil {
		fmt.Printf("驱动不支持:%v",err)
		return
	}
	fmt.Printf("affected number of rows %v",id)
}
```

4.更新数据 Db.Exec() 、result.RowsAffected()

```go
func updateData(){
	sqlStr := "update users set name = $1 where id = $2"
	result, err := Db.Exec(sqlStr, "hello",1)
	if err != nil {
		fmt.Printf("update failed:%v", err)
		return
	}
	count,err:=result.RowsAffected()
	if err!=nil {
		fmt.Printf("更新失败")
		return
	}

	fmt.Printf("affected rows :%v",count)
}
```

## 预处理

一般的查询在客户端将数据拼接好，然后直接返回给数据库进行执行。而预处理会将 sql 语句命令部分和数据部分分别发送。先发松 sql 的命令部分，在返送数据部分，服务器端负责替换占位符，可以对同一条 sql 可一直接使用缓存数据，还可以防止 sql 注入。

1. 查询 Db.Prepare()、stmt.Query()

stmt 要手动关闭，负责连接不会被释放

```go
func prepareQuery(){
	sqlStr := "select id,name,age,email from users where id >$1"
	stmt, err := Db.Prepare(sqlStr)
	if err != nil {
		fmt.Printf("query failed:%v", err)
		return
	}
	defer func() {
		// 一定要手动要关闭
		if stmt != nil {
			stmt.Close()
		}
	}()
    //传递数据
	rows,err:=stmt.Query(0)
	var user User
	for rows.Next() {
		err:= rows.Scan(&user.Id,&user.Name,&user.Age,&user.Email)
		if err!=nil{
			fmt.Printf("err:%v",err)
			return
		}
		fmt.Printf("user=%v\n",user)
	}

}

```

2. 插入数据 Db.Prepare()、stmt.Exec()

```go
func insertDataByPrepare(){
	sqlStr := "insert into users(name,password,age,email) values($1,$2,$3,$4)"
	stmt, err := Db.Prepare(sqlStr)
	if err != nil {
		fmt.Printf("insert failed:%v", err)
		return
	}
    //一定要关闭连接
	defer func() {
		if stmt!=nil{
			stmt.Close()
		}
	}()
	result,err := stmt.Exec("lijunjie","1234",25,"jell")
	if err!=nil{
		fmt.Printf("insert failed:%v",err)
		return
	}
	id,err:=result.LastInsertId()
	if err!=nil {
		fmt.Printf("驱动不支持:%v",err)
		return
	}
	fmt.Printf("inserted Id of  rows %v",id)
}
```

## 事务

Db.Begin()、tx.Rollback()、tx.Exec()、tx.Commit()

```go
func updateDataUseTx(){
	//开启事务
	tx,err:=Db.Begin()
	if err!=nil {
		if tx!=nil{
			tx.Rollback()
		}
		fmt.Printf("%v",err)
		return
	}
	defer func() {
		if err!=nil{
			//commit可能报错
			tx.Rollback()
		}

	}()
	sqlStr := "update users set name = $1 where id = $2"
	_, err = tx.Exec(sqlStr, "hello123",1)
	if err != nil {
		tx.Rollback()
		fmt.Printf("update failed:%v", err)
		return
	}
	sqlStr = "update users set name = $1  where id = $2"
	_, err = tx.Exec(sqlStr, "hello",2)
	if err != nil {
		tx.Rollback()
		fmt.Printf("update failed:%v", err)
		return
	}
	err=tx.Commit()
}
```

## sqlx 库

```shell
go get github.com/jmoiron/sqlx
```

sqlx 是一个第三方的对 sql 封装了之后的包。使用起来更简单。 1.不会造成连接未释放的问题。 2.查询出来的数据直接写入到结构体，切片中。
3.api 和 sql.DB 的类似，
sqlx.DB.get()单个查询
sqlx.DB.Select()多个查询
sqlx.DB.Exec()执行其他操作

sqlx.DB.Begin()、sqlx.DB.Rollback()、sqlx.DB.Commit()

```go
import (
	"database/sql"
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

)

var (
	Db *sqlx.DB
)

// 打开一个数据库实例
func InitDb() (err error) {
	connStr := "postgres://lijunjie:lijunjie@localhost/lijunjie?sslmode=disable"
	Db, err = sqlx.Open("postgres", connStr)
	if err != nil {
		return err
	}
	Db.SetMaxOpenConns(100)
	Db.SetMaxIdleConns(16)
	err = Db.Ping()
	return
}

type User struct {
	Id       int
	Name     sql.NullString
	Age      int
	Email    string
	Password string
}

// 查询数据从数据库
func testDataQuery() {

		sqlStr := "select id,name,age,email from users where id = $1"
		var user User
		err := Db.Get(&user,sqlStr, 1)
		if err!=nil{
			fmt.Printf("query failed %v",err)
		}
		fmt.Printf("user=%v\n",user)

}

//查询多行数据

func testQueryMutilRows() {
	sqlStr := "select id,name,age,email from users where id >$1"
	var users []User
	err := Db.Select(&users,sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed:%v", err)
		return
	}
	for _,user := range users{
		fmt.Printf("%v\n",user)
	}

}
```

## sql 注入

```go
func testSqlInject(data string) {
	sqlStr := fmt.Sprintf("select id,name,age,email from users where name = '%s'",data)
	fmt.Println(sqlStr)
	var users []User
	err := Db.Select(&users,sqlStr, 0)
	if err != nil {
		fmt.Printf("query failed:%v", err)
		return
	}
	for _,user := range users{
		fmt.Printf("%v\n",user)
	}

}
```

1. data = "lijunjie' or 1 = 1 #"
   打印出来得 sql 为;
   select id,name,age,email from users where name = 'lijunjie' or 1=1#'
   data 中得单引号闭合了第一个单引号，然后 #注释了第二个单引号。查询得时候会把整个表得数据查询出来。

2. data= "tim' and (select count(\*) from user ) < 10#"

这条 sql 语句可以查询出来 users 表中得用户数量是不是大于 10

3.data= "name=tim' union select name,age,id from user #"

这条语句会把 name=time 得数据和表中得所有得其他数据链接返回。我们将得到全表得数据

## 防止 sql 注入的方法：

不要自己拼接 sql,使用占位符和预处理 sql

## 数据库查询错误

sql.ErrNoRows 错误

调用 sql 包中.QueryRow()方法和 sqlx 中得 Get 方法，当列数据都查询不到时，返回这个错误。调用 sql 中 Query()或者 sqlx.Select()方法.不会报出这个错误。

```go
err := db.QueryRow("SELECT username FROM users WHERE id=?", id).Scan(&username)
switch {
case err == sql.ErrNoRows:
   log.Printf("No user with that ID.")
case err != nil:
   log.Fatal(err)
default:
   fmt.Printf("Username is %s\n", username)
}
```

## 查询的字段值包含关键字

```
sqlStr := "select id,openId,mark,create_time,`add` from records where openId =? order by id desc limit ?,?"
```

这种情况下需要用反引号把关键字引起来。

## 分页查询

```go
func GetAnswerIdList(qid int64, offset int64, limit int64) (answerIdList []int64, err error) {
	sqlStr := "select answer_id from question_answer_rel where question_id = ? order by  id desc limit ?,?"
	err = db.Select(&answerIdList, sqlStr, qid, offset, limit)
	if err != nil {
		logger.LogError("get answerList failed ；%v", err)
		return
	}
	return
}
```

limit 的第一个参数是 offset,第二个是 limit

## in 模糊查询

```go
func GetCategory(categoryIdList []int64) (categoryMap map[int64]*model.Category, err error) {

	if len(categoryIdList) == 0 {
		return
	}
	sqlStr := "select category_id,category_name from category where category_id in (?)"
	var tempIdList []interface{}

	for _, id := range categoryIdList {
		tempIdList = append(tempIdList, id)
	}
	query, args, err := sqlx.In(sqlStr, tempIdList)

	if err != nil {
		logger.LogError("sql has a problem,%v", err)
		return
	}
	var categoryList []*model.Category
	err = db.Select(&categoryList, query, args...)
	if err != nil {
		logger.LogError("query categoryList failed:%v ", err)
		return
	}
	categoryMap = make(map[int64]*model.Category)
	for _, category := range categoryList {
		categoryMap[category.CategoryId] = category
	}
	return
}

```

构建 sql 语句的时候需要的参数个数不确定，所以不能使用占位符。这个时候需要 sqlx.In 去根据参数个数指定占位符。sqlx.In 的第二个参数是[]interface{}类型的签名，可以接受任意数量的参数或者 interface{}切片。

## 错误

> Lock wait timeout exceeded; try restarting transaction 的错误

> 这个一般是由于事务没提交或者回滚，然后下次请求就会出现。
