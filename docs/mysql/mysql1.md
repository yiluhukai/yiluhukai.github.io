### mysql 的使用（一）

## 一、启动 mysql 服务

```shell
#windows
net stop mysql
net start mysql
```

```shell
#macos

#通过homebrew
brew services list  // 查看服务列表

brew services restart  mysql // 重启mysql

brew services stop mysql // 关闭mysql

brew services start mysql // 启动mysql服务

#使用mysql命令
mysql.server start/stop/restart
```

## 二、通过命令行连接 mysql

```shell
#连接
mysql [-h localhost] [-P 3306] -u root -p [password]

#退出
exit或者ctrl+C
```

## 三、常用的 mysql 指令

```shell
#查看所有的数据库
mysql>show databases

# 使用一个数据库

mysql>use database

# 查看当前数据库下的表
mysql>show tables


#查看其他数据库的表
mysql>show tables from database

#查看表结构
mysql>desc table


#查看mysql的版本
mysql>select version()
#命令行中
$mysql -V


#创建表

mysql>create table tableName(
id int primary key,
#最后一行不需要逗号
name varchar(11)
)engine =InnoDB default charset = utf8;
```

## 四、修改 mysql 的配置

```shell
 #windows
 安装目录下的my.ini文件，修改后需要重新启动mysql服务

 #macos
 my.cnf默认不存在，需要手动创建。mysql启动的时候会从下面的路径查找配置文件

 #返回查找配置文件的路径
 mysql --help|grep 'my.cnf'

 order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /usr/local/etc/my.cnf ~/.my.cnf
sudo vim  /etc/my.cnf
#将配置粘贴进去保存退出

#修改/etc/my.cnf的权限
sudo chmod 664 my.cnf

#重启服务
mysql.server restart
```

配置内容

```shell
# Example MySQL config file for small systems.
#
# This is for a system with little memory (<= 64M) where MySQL is only used
# from time to time and it's important that the mysqld daemon
# doesn't use much resources.
#
# MySQL programs look for option files in a set of
# locations which depend on the deployment platform.
# You can copy this option file to one of those
# locations. For information about these locations, see:
# http://dev.mysql.com/doc/mysql/en/option-files.html
#
# In this file, you can use all long options that a program supports.
# If you want to know which options a program supports, run the program
# with the "--help" option.

# The following options will be passed to all MySQL clients
[client]
default-character-set=utf8
#password   = your_password
port        = 3306
socket      = /tmp/mysql.sock

# Here follows entries for some specific programs

# The MySQL server
[mysqld]
default-storage-engine=INNODB
character-set-server=utf8
collation-server=utf8_general_ci
port        = 3306
socket      = /tmp/mysql.sock
skip-external-locking
key_buffer_size = 16K
max_allowed_packet = 1M
table_open_cache = 4
sort_buffer_size = 64K
read_buffer_size = 256K
read_rnd_buffer_size = 256K
net_buffer_length = 2K
thread_stack = 128K

# Don't listen on a TCP/IP port at all. This can be a security enhancement,
# if all processes that need to connect to mysqld run on the same host.
# All interaction with mysqld must be made via Unix sockets or named pipes.
# Note that using this option without enabling named pipes on Windows
# (using the "enable-named-pipe" option) will render mysqld useless!
#
#skip-networking
server-id   = 1

# Uncomment the following if you want to log updates
#log-bin=mysql-bin

# binary logging format - mixed recommended
#binlog_format=mixed

# Causes updates to non-transactional engines using statement format to be
# written directly to binary log. Before using this option make sure that
# there are no dependencies between transactional and non-transactional
# tables such as in the statement INSERT INTO t_myisam SELECT * FROM
# t_innodb; otherwise, slaves may diverge from the master.
#binlog_direct_non_transactional_updates=TRUE

# Uncomment the following if you are using InnoDB tables
#innodb_data_home_dir = /usr/local/mysql/data
#innodb_data_file_path = ibdata1:10M:autoextend
#innodb_log_group_home_dir = /usr/local/mysql/data
# You can set .._buffer_pool_size up to 50 - 80 %
# of RAM but beware of setting memory usage too high
#innodb_buffer_pool_size = 16M
#innodb_additional_mem_pool_size = 2M
# Set .._log_file_size to 25 % of buffer pool size
#innodb_log_file_size = 5M
#innodb_log_buffer_size = 8M
#innodb_flush_log_at_trx_commit = 1
#innodb_lock_wait_timeout = 50

[mysqldump]
quick
max_allowed_packet = 16M

[mysql]
no-auto-rehash
# Remove the next comment character if you are not familiar with SQL
#safe-updates

[myisamchk]
key_buffer_size = 8M
sort_buffer_size = 8M

[mysqlhotcopy]
interactive-timeout
```

## 五、mysql 语法规范

1. 不区分大小写，但是建议关键字大写，列名和表名小写。

2. 每条语句最好用分号结尾。
3. 每条语句可以根据需要换行缩进。 
4. 注释
   * 单行注释：#注释内容
   * 单行注释：-- 注释内容（中间有空格）
   * 多行注释：/_ 注释文字_/
   * eg:mysql>#select \* from user;// 这条语句被注释，执行后没有任何效果。

## 六、sql 中的分类

1. SQL（Structure Query Language）结构化查询语言
2. DQL（data query language）数据查询语言 select 操作
3. DML（data manipulation language）数据操作语言，主要是数据库增删改三种操作
4. DDL（data defination language）数据库定义语言，主要是建表、删除表、修改表字段等操作
5. DCL（data control language）数据库控制语言，如 commit，revoke 之类的，在默认状态下，只有 sysadmin,dbcreator,db_owner 或 db_securityadmin 等人员才有权力执行 DCL

## 七、DQL

#### select 查询对象 [from table];

查询的对象可以可以是表格的字段，一个常量或者表达式，一个函数。查询的结果将以一个虚拟的表格输出。表格中的列名是字段名、常量和表达式、函数.

```sql
#建议先指定所使用的数据库
use myemployees;
#单个字段的查询
select first_name from employees;
#查询多个字段
select first_name,last_name from employees;
# 查询所有的字段
select first_name,last_name,salary,hiredate from employees;
#还可以使用* (*中代表的字段顺序和表格的字段顺序一致)
select * from employees;

# 查询常量

select 100; // 列名为100切有一行数据为100
select 100 from employees;//列名为100且输出总数100条，内容也为100

# 查询一个表达式
select 100*98;
select  salary * 12 from employees;

# 查询一个函数
select version()
```

当查询的字段中包含有关键字的时候，可以使用着重符(`)将关键字转为字段。

```sql
select `name` from user;
```

查询的结果输出时，表格的列名可能是常量、表达式、函数名、字段名。有时候可读性不好。可以使用 as 给他们起一个别名。

```sql
# 别名
select first_name as 名,last_name as 姓 from employees;

# 当别名有关键字或者中间有空格时，可以使用单引号或者双引号引起来。

select salary as "out put" from employees;
```

使用 distict 对查询结果去重

```sql
select distinct department_id from employees;
```

加号运算符和 concat(a,b)函数.

1. 加号的两边数字，相当于查询一个数字常量：
   select 10+20 ==> select 30; 
2. 当一边是数字一边是字符串时，字符串可以被转化为数字。相当于查询一个数字常量。
   select 10+'30' ==> select 40;

3. 当一边是数字一边是字符串时，字符串不可以被转化为数字时，会将字符串转为数字 0.
   select 10+'john' ==> select 10;

4. 当一边为 null 时，相当于查询 null

   select 1+null ==> select null;

```sql
# select 30 from employees;
select 10+20 from employees;
```

如果相见查询的多个字段（大于等于 2）连接起来，可以使用 concat().

```sql
select concat(first_name,' ',last_name) as 姓名 from employees;
```

会讲 first_name 和 last_name 用空格连接起来作为姓名列的结果输出。

ifnull()函数可以用来给字段默认值。

```sql
select  ifnull(commission_pct,0) as 奖金率,commission_pct from employees;
```

当 commission_pct 列中的值为 null,奖金率中的只为 0.

concat 函数会吧多个字段连接成一个新的字段输出，当其中一个字段为 null 时，查询结构就为 null.我们可以将 concat()函数和 ifnull()结合起来使用。

```sql
select concat(first_name,ifnull(last_name,'')) from employees;
```

* 条件查询

select 查询列表 from table where 条件；

```sql
简单的条件查询：>,<,=,!=,<>(相当于!=),>=,<=

逻辑运算符：and(&&) ,or(||),not(!)

模糊查询：like、in、between.. and .. 、is null.
```

简单的条件查询

```sql
select * from employees where salary > 12000;
select last_name,department_id from employees where department_id <> 90;
```

使用运算符可以将多个查询条件连接起来

```sql
select * from employees where salary >1200 and department_id = 90;

select * from employees where salary >1200 or department_id = 90;
# salary <=12000
select * from employees where not salary >12000;
```

 like 和通配符进行模糊查询

* 通配符：%,*
* %代表任意多个字符，包括 0 个字符
* *代表一个字符

```
# 查询last_name第二个字母是a/A的所有记录。
select  * from employees where last_name like '_a%'
```

当需要查询的字段中含有字符\_’时，可以使用转义字符为\或者自定义转义字符。

```sql
select  * from employees where last_name like 'K\_ing%';
#指定$作为转义字符
select  * from employees where last_name like 'K$_ing%' escape '$';
```

between...and...

```sql

select * from employees where salary between 12000 and 20000;
#和下面的语句等价

select * from employees where salary >=12000 and salary <=20000;
```

:::warning

between... and ...包含两个临界值，且两个临界值顺序不能颠倒。

:::

in 可以一次匹配同一字段的多个值。值的类型应该和字段的类型一致，否则没有意义。

```sql
select * from employees where job_id  = 'AD_VP' or job_id = 'AC_MGR' or job_id =100;

#相当于 上面的查询语句
select * from employees where job_id in('AD_VP','AC_MGR',19);
```

= 和 <>不能判断 null,我们需要查询某个字段为 null 时，可以使用 is null,不为 null,使用 is not null;

```sql
select * from employees where commission_pct is null;

select * from employees where commission_pct is not null;
```

安全等于 <=>

安全等于几可以判断 null 又可以判断普通值，相当于 = 和 is null 的结合体。

```sql
select  * from employees where commission_pct <=> null;

select  * from employees where salary <=> 12000;
```

isnull(exp)

当数据库中有这个字段不为 null 时返回 1，否则返回 0.

```sql
select isnull(commission_pct),commission_pct from employees;
```

查询结果是否一样

select \* from employees;

select \* from employees where commisson_pct like "%%";

:::tip

当 commission_pct 中有 null 时，结果不一样，没有 null 时，查询结果一样。

:::

* 排序查询

asc(ascending order)/ （descending order）
默认使用升序排列的。不需要 where,字段在 asc/desc 前面。
order by 字句后面可以跟单个字段、多个字段、表达式、别名、函数。
order by 字句一般放到查询结果的最后面。limit 字句除外。

```sql
#asc 可以省略
select * from employees order by salary desc/（asc）;

#查询工资大于12000并按照入职时间降序排列

select * from employees where salary >12000 order by hiredate desc;

# 查询员工的信息和年薪并按照年薪的升序排序
select *,(1+ifnull(commission_pct,0))*salary as 年薪 from employees order by  (1+ifnull(commission_pct,0))*salary asc;


# 上面的例子可以用按别名排序

select *,(1+ifnull(commission_pct,0))*salary as 年薪 from employees order by  年薪 asc;


#查询员工的姓名和工资按姓名的长度升序排列

select salary,last_name,length(last_name) as length from employees order by length asc;



#查询所有员工的信息，按照工资从低到高，入职时间逆序排列。

select * from employees order by salary asc,hiredate desc;
```

#### mysql 常用函数

单行函数和分组函数。

单行函数：函数接受一个或者多个参数 ，最终会有一个函数值，作用于一行。
ifnull(),concat()

分组函数：传入一组值，最终返回一个值。又称为统计函数或者聚合函数。作用于多行。
sum,count,avg.

1. 字符函数

* length 返回字符串所占用的字节数(和说使用的字符集有关系)

```sql
#查看字符集
show variables like '%char%';
#  使用length返回字节长度
select length("hello 北京") as 'length'; // 12
```

* concat() 拼接多个字符串

```sql
select concat(first_name,'-',last_name)  as 姓名 from employees;s
```

* upper,lower

```sql
select upper('john') // JOH0N

select lower('joHN') // john

```

* substr,substring

两个函数是一样，字符串的下标是从 1 开始的，第二个参数是截取的开始位置。第三个参数是截取的字符个数。

```sql

select substring("hello",3) as 'len'; // llo

select substring("hello",1,3) as 'len';//hel
```

* instr

返回子串开始的下标，找不到返回 0.

```sql
select instr('hello wolrd','lr') as 'index';
```

* trim 默认是去除字符两个的空格，但是可以去除字符两边的其他字符。

```sql
select trim(" hello      ") as 'str';// hello

#去除其他的字符
select trim('aa' from "aaaHelloaaa") as 'str'; // aHelloa

```

* lpad、rpad

左填充和右填充:当字符大于要填充的字符会被截断

```sql
select lpad('li', 10,'***') as 'name'; // ********li

select rpad('li',10,'***') as 'name';// li********
```

* replace

全局替换子串中的特定的字符。

```sql
select replace('aaabbbaaa','a','c') as 'str'; //cccbbbccc
```
