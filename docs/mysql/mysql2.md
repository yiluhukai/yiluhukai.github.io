### mysql 的使用（2）

2. 数字函数

#### round(number,d)

对 number 进行四舍五入，保留 d 位小数。

```
select round(1.65) #2

# 1.7
select round(1.65,1)
```

#### floor(number)、ceil(number)

分别是向下或者向上取整

```
# 1
select floor(1.65);

# 2
SELECT ceil(1.65);
```

#### truncate(number,d)

截断字符串

```
SELECT truncate(1.677,2); # 1.67
```

#### mod

mod 函数用来对一个数字进行取余操作，相当%运算符。

```
SELECT mod(10,3); # 1


SELECT 10%3; # 1
```

3. 日期函数

#### now()

查询当前的时间和日期

```
select now(); #'2020-05-07 21:44:08'
```

#### current_da

e()

查询当前的日期。

```
SELECT current_date(); #'2020-05-07'
```

#### current_date()

查询当前的时间

```
SELECT current_date(); #'21:45:56'
```

#### year,month,monthname...

```
SELECT year(now()); # 2020

SELECT month(now());  #5

SELECT monthname(now()); #May
```

#### str_to_date()

STR_TO_DATE(str,format)函数是将时间格式的字符串（str），按照所提供的显示格式（format）转换为 DATETIME 类型的值。

![fe09a477b065f223df0feca2b8b30708.png](evernotecid://48BC2FAB-231C-4AC6-BF8E-D98489F70F11/appyinxiangcom/24780240/ENResource/p28)

```
SELECT STR_TO_DATE(now(),'%Y-%m-%d %H:%i:%s') AS result;

SELECT * from employees where hiredate=str_to_date('1992/4/3','%Y/%m/%d')
```

#### date_format

将日期对象格式化成字符串,格式化的字符串和上面的相同。

```
SELECT date_format(now(),"%Y年%m月%d日");
```

4. 其他函数

```
SELECT version(); # 查询数据库的版本
USE myemployees;
SELECT database(); # 查询数据库的名字

SELECT user(); # 查询用户
```

5. 流程控制函数
