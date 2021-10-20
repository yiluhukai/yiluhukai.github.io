### mysql 的使用（2）

2. 数字函数

* `round(number,d)`

对 number 进行四舍五入，保留 d 位小数。

```sql
select round(1.65) #2

# 1.7
select round(1.65,1)
```

* `floor(number)`、`ceil(number)`

分别是向下或者向上取整

```sql
# 1
select floor(1.65);

# 2
SELECT ceil(1.65);
```

* `truncate(number,d)`

截断字符串

```sql
SELECT truncate(1.677,2); # 1.67
```

* `mod`

`mod` 函数用来对一个数字进行取余操作，相当%运算符。

```sql
SELECT mod(10,3); # 1

SELECT 10%3; # 1
```

3. 日期函数

* `now(`)

查询当前的时间和日期

```sql
select now(); #'2020-05-07 21:44:08'
```

* `current_date()`

查询当前的日期。

```sql
SELECT current_date(); #'2020-05-07'
```

* `current_time()`

查询当前的时间

```sql
SELECT current_date(); #'21:45:56'
```

* `year,month,monthname`...

```sql
SELECT year(now()); # 2020

SELECT month(now());  #5

SELECT monthname(now()); #May
```

* `str_to_date()`

STR_TO_DATE(str,format)函数是将时间格式成字符串（str），按照所提供的显示格式（format）转换为 DATETIME 类型的值。

```sql
SELECT STR_TO_DATE(now(),'%Y-%m-%d %H:%i:%s') AS result;

SELECT * from employees where hiredate=str_to_date('1992/4/3','%Y/%m/%d')
```

* `date_format`

将日期对象格式化成字符串,格式化的字符串和上面的相同。

```sql
SELECT date_format(now(),"%Y年%m月%d日");
```

4. 其他函数

```sql
SELECT version(); # 查询数据库的版本
USE myemployees;
SELECT database(); # 查询数据库的名字

SELECT user(); # 查询用户
```

5. 流程控制函数if()

`if()`函数相当于一个三木运算符

```sql
# 当奖金为null的时候显示哈哈，不会null的时候显示嘻嘻
select commission_pct,if(commission_pct is null,"哈哈","嘻嘻") as 备注 from employees;

# 当10>5 显示"1",否则显示"0"
SELECT if(10>5,"1","0") as `index`;  
```

6. 流程控制函数`case()`

```sql
# 第一种用法 switch

SELECT salary 工资,department_id,
case department_id 
when 30 then salary*1.1
when 40 then salary*1.2 
else salary 
end as 新工资 from  employees;

# 第二种 if-else if-else

SELECT 
salary 工资,
case 
when salary>10000 then "A"
when salary>15000 then "B" 
when salary >20000 then "C"
else "D" 
end as 新工资 from  employees;
```

### 分组函数

常用的分组函数有`sum()`、`avg()`、`count()`、`min()`、`max()`.

* 对指定字段使用

```sql

SELECT count(salary) as 'count',avg(salary) as average,
min(salary) as 'min',max(salary) as 'max',sum(salary) as 'sum' from employees;
```

* `sum()`和`avg()`只对数字类型的字段有效,`min()`、`max()`、`count()`可以作用于其他类型的字段
* 这些函数在统计的时候，可以和distinct搭配使用

```sql
SELECT count(DISTINCT salary) from employe;
```

* 这些函数会忽略为`null`的行
* `count(`)函数还可以传入一个*或者一个常数

```sql
SELECT count(*) from employees;
SELECT count(1) from employees;
```

:::tip

当传入的为常数时，会在当前表中临时添加一列，列中的值全部为这个常数，然后统计列的总数，和count(*)返回相同的结果。

在mysql5.5之前采用的是MYIASM引擎，count(*)的效率是最高的 

后面的版本使用的是InnoDB引擎，count(*)和count(0)的效率差不多

:::

* 和分组函数一起查询的字段要求是group by之后的

```sql
SELECT count(*),department_id from employees; //error
```

### 分组查询 group by

分组查询一般用来分组统计数据，如查询不同部门的员工的平均工资等。语法：

```
select 分组函数，列(group by 后面的列) from 表 【where 筛选条件】 group by 分组列表 【having 筛选条件】 【order by 字句】

```

* 查询的列必须是`group by`后面的列
* where和having都能实现对数据筛选，where用于分组前的筛选，having用于分组后的筛选，能用分组前筛选的优先使用分组前筛选。
* `group`后支持多个字段、函数和表达式（用的较少）
* `Having` 和`order by` 对分组后的结果进行排序，可以使用别名

```sql
# 不使用别名
# 查询各个没有奖金的部门的平均工资，且平均工资大于10000的平均工资和部门,按生序排序

SELECT avg(salary) as avg_salary,department_id
	from employees
	where commission_pct is null
    group by department_id  
    having avg(salary) > 10000
    order by avg(salary) asc;
```

* 使用别名

```sql
SELECT avg(salary) as avg_salary,department_id
	from employees
	where commission_pct is null
    group by department_id  
    having avg_salary > 10000
    order by avg_salary asc;
```

* group by 后面是函数的

```sql
SELECT avg(salary) as avg_salary,department_id,length(first_name)
	from employees
	where commission_pct is null
    group by department_id,length(first_name)  
    having avg_salary > 10000
    order by avg_salary asc;
```

### 连接查询

`beauty`表

```sql
CREATE TABLE `beauty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sex` char(1) DEFAULT '女',
  `borndate` datetime DEFAULT '1987-01-01 00:00:00',
  `phone` varchar(11) NOT NULL,
  `photo` blob,
  `boyfriend_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

```

`boys`表

```sql
CREATE TABLE `boys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `boyName` varchar(20) DEFAULT NULL,
  `userCP` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

```

* 无条件链接

```sql
SELECT name,boyName FROM beauty,boys;
```

:::tip

如果`beauty`中有`m`列，`boys`中有`n`列，那么最终的查询结果就是m*n列，这个现象称为笛卡尔乘积现象。造成这种错误的原因是由于两个表没有连接条件。

:::

添加连接条件

```sql
# 查询有朋友的人的名字和男朋友的名字
SELECT name,boyName FROM beauty,boys where beauty.boyfriend_id = boys.id;
```

:::tip

此时的查询结果是`beauty`表中有`boyfriend_id`存在且等于`boys.id`的所有列。

:::

* 连接查询的分类
  * 按年代分：可以分为`sql92`和`sql99`标准
  * 按功能分：内连接、外连接、交叉连接
  * 内连接可以分为：等值连接、非等值连接、自连接
  * 外连接可以分为：左外链接、右外链接、全外连接
  * `sql92`只支持内连接
  * `sql99`支持内连接+外链接（左外链接、右外链接）+交叉连接，所以推荐使用`sql99`
* 等值连接查询

等值连接的查询结果是多个表的交集，查询时与表的顺序没有关系，n个表最少需要n-1个连接条件

```sql
SELECT name,boyName FROM beauty,boys where beauty.boyfriend_id = boys.id ;
```

为表名设置别名：

1. 提高语句的简洁度
2. 区分多个重名的字段(连接的表中)

```sql
SELECT g.`name`,b.boyName FROM beauty g,boys b where g.boyfriend_id = b.id ;
```

:::warning

这条`sql`语句和上面的`sql`语句是等价效果的，不同的是我们在查询的条件中使用了别名。

当我们为表设置了别名后，就不能使用表的名称了。

:::

等值连接还可以添加筛选条件、`group by`、`order by` 等

```sql
SELECT avg(salary) as avg_salary,e.department_id, d.department_name,commission_pct
	from employees e,departments d
    where e.department_id =d.department_id and  commission_pct is not null
    group by e.department_id，d.department_name
    order by avg_salary asc;
```

三个表连接

```sql
SELECT first_name, department_name,city from employees e,departments d,locations l
where e.department_id = d.department_id and d.location_id = l.location_id;

```

* 非等值连接查寻
  * 只要连接条件不是等于的都属于非等值连接
  * 非等值连接查询添加筛选条件、`group by`、`order by` 等

```sql
select e.first_name,e.salary,j.grade_level grade_level from employees e, job_grades j
where e.salary between  j.lowest_sal and j.highest_sal and grade_level = 'A';
```

* 自连接查询
  * 自连接查询是一种特殊的等值连接查询
  * 连接的两张表都是自己

```sql
select e.first_name `employee_name`,m.first_name `manager_name` from employees e,employees m
where e.manager_id = m.employee_id 
```

:::tip

员工和领导都在员工表中，我们查询的时候连接这张表，然后查询员工和它领导的名字

:::

* `sql99`连接查询

```
select 查询列表 from table1 aslias <连接类型> table2 aslias on <连接条件>
[where 筛选条件] 
[group by 分组]
[having 筛选条件] 
[order by 排序列表] 
```

`sql99`支持的连接类型

* 内连接(`inner join| inner`)

  *  等值连接
  * 非等值连接查寻
  * 自链接查询

* 外连接

  * 左外(`left [outer] join`)
  * 右外(`right [outer] join`)
  * 全外(`full [outer] join`)

* 交叉连接（`cross join`）

`sql99`中的内连接:

* 等值连接

```sql
SELECT 
    name, boyName
FROM
    beauty g
        JOIN
    boys b ON g.boyfriend_id = b.id;
    
SELECT 
    AVG(salary), department_name
FROM
    employees e
        JOIN
    departments d ON e.department_id = d.department_id
GROUP BY department_name
ORDER BY department_name DESC;  
# 多表连接
SELECT 
    first_name, department_name, city
FROM
    employees e
        JOIN
    departments d ON e.department_id = d.department_id
        JOIN
    locations l ON d.location_id = l.location_id;
```

* 非等值连接

```sql
SELECT 
    e.first_name, e.salary, j.grade_level grade_level
FROM
    employees e
        JOIN
    job_grades j ON e.salary BETWEEN j.lowest_sal AND j.highest_sal
WHERE
    grade_level = 'A';
```

* 自连接

```sql
SELECT 
    e.first_name `employee_name`, m.first_name `manager_name`
FROM
    employees e
        JOIN
    employees m ON e.manager_id = m.employee_id
```

* 外连接

内连接是根据连接条件去取两个表的交集，而外连接查询会有主表和分表，查询会包含主表中的全部行，左外连接的主表是左边的 ，右外连接的主表是右边的。

* 左外连接

```sql
#表中没有男朋友的行中对应在b.*为null
SELECT 
    name,b.*
FROM
    beauty g
        LEFT JOIN
    boys b ON g.boyfriend_id = b.id;
```

* 右外连接

```sql
# 表中包含boy的全部行
SELECT 
    name,b.*
FROM
    beauty g
        right JOIN
    boys b ON g.boyfriend_id = b.id;
```

  

  

  

  









