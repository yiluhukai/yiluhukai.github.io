### 结构体

将其他的基本类型组合起来形成一个新的类型。

```c
#include <stdio.h>
#include <string.h>
int main(){

    //定义一个student类型
    struct student{
        char name[10];
        int age;
        int score;
    };
    //声明一个该类型的变量
    struct student stu1;
    //使用结构体
    // stu1.name="lijunjie"; 不能去修改数组指向的地址
    strcpy(stu1.name,"lijunjie");
    stu1.age =23;
    stu1.score=120;
    printf("%s\n",stu1.name); //"lijunjie"
    printf("%d\n",stu1.age); //23
    printf("%d\n",stu1.score); //120
    return 0;
}
```
声明一个结构体变量：
方法1:
```c
   struct student{
        char name[10];
        int age;
        int score;
    };
    //声明一个该类型的变量
    struct student stu1;
```
方法2：
```c
   struct student{
        char name[10];
        int age;
        int score;
    } stu1,stu2;
```
方法3：


```c
//struct后面的student可以省略

 typedef struct student{
        char name[10];
        int age;
        int score;
    } Student;
    Student a;
```
#### 结构体的初始化

初始化结构体除了上面的方法外，还可以使用
```c
 typedef struct student{
        char name[10];
        int age;
        int score;
    } Student;
    Student a={ "lijunjie",20,120 };
```
#### 结构指针

```c
  Student * ps = &stu1;
    printf("%d\n",ps->age);
    (*ps).age = 20;
    printf("%d\n",ps->age);
```
使用指针访问和修改结构体的内容可以使用上面的两种方式：

#### 结构体的大小

```c
struct student{
    char c;
    int age;
    int score;
}stu;
sizeof(stu);//12
```
结构体的所占用的字节数为每个成员所占用的字节数的大小之和，且为结构体中最大类型的倍数，不够的向上扩张；
#### 结构体中包含结构体
结构体中可以包含其他的类型的结构体，不能包含自身类型的结构体，但是可以包含自身类型的结构体指针。

```c
 typedef struct student{
        char name[10];
        int age;
        int score;
        struct student * s;
    } Student;
```
### 结构体

结构体变量可以作为函数的参数传递和返回，在c语言中，结构体和普通变量一样是值传递，和数组、指针不一样。如果要在函数中修改一个结构体变量，需要传递一个结构体指针。

```c
#include <stdio.h>

typedef  struct student {
    char name[20];
    int age;
    int score;
} Student;
Student fixStudent (Student s){
    s.age=30;
    return s;
}
int main(){
    Student stu ={0};
    stu=fixStudent(stu);
    printf("%s\n",stu.name);
    printf("%d\n",stu.age);//30
    printf("%d\n",stu.score);
    return 0;
}
```

### 结构体数组

```c
Student a[10];
Student * s =a;
s[0].age;
```

### vim中打开多个文件

```shell
# 打开的两个文件以标签的形式存在
vim hello.c main.c -p
#切换标签
gt
#切换指定的标签
1gt
#打开一个新的标签
:tabe 文件名  
#保存所有文件
wall
#退出所有的编辑
qall
```
### 查看项目中函数的定义

1 . 生成tags文件：ctags -R 为所有.c文件生成tag
2. 将光标定位到函数上，ctrl+]跳入指定的函数上，ctrl+o跳回去。
3. 将光标放到指定头文件名上，gf可打开头文件（系统目录或者当前文件下）

### c语言的数据类型
#### 基本数据类型
整形：char、short int、int 、long int;
浮点：float、double
#### 扩展数据类型
数组、指针、自定义数据类型（结构体、联合、枚举）

### 枚举类型

定义枚举类型：
枚举类型的本质还是整形，声明枚举类型是为了代码的可读性更高。

```c
//定义枚举类型
enum SEASON  {
    Spring,Summer,Autumn=5,Winter
}
//这块Spring的值为0 
//声明枚举类类型变量；
enum SEASON s =Spring ;
enum SEASON s =7；//c语言中不会报错,C++中会
```
使用typedef给枚举类型定义别名

```c
// SEASON 可以省略
typedef enum SEASON{
    Spring,Summer,Autumn,Winter
}Season;

Season s = Spring;
```

### 联合体
 联合体只要用来声明一种可以在多种类型之前切换的类型，他们在内存中使用同一块内存空间，所以同一时间只能有一种类型存在。
 
 ```c
 union Score {
    int i_score;
    double d_socre;
    char level;
 }
 
 union Score s;
 
 s.i_score =10;
 ```
 sizeof计算公用体的大小时，返回的时里面占用空间最大的类型8个字节。
 
 //使用别名
 
 ```c
// Score 可以省略
typedef union Score{
    int i_score;
    double d_score;
} MyScore;
MyScore s;
s.i_score =10;
 ```
 ### c中的32关键字：
 
 1. 自定义类型 union、enum、struct、 void的类型
 2. 数据的存储特性 auto、static、const、regiser、volatile.
 3. 计算字节数 sizeof ,别名 typedef
 4. 流程控制语句 if、else、switch、case、default、break,while,for,do,continue,return,goto.
 5.  extern 外部链接属性。
 6. 基本数据类型 char,int,short,long.float,double,signed,unsigned.
 
 
 
 


