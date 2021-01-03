
### Linux命令

#### linux命令的基本格式

```text
命令名 [选项] [参数]
```

####  liunx中常见的路径

```text
/ 代表根目录
～ 代表用户的根目录
cd 不带参数，回到用户的根目录。
cd - 返回用户上次所以在目录。
```

#### man指令

```text
man man/ls等
man 还可用来查看库函数
man 3(章节，1代表的是shell指令) printf
man -M：指定手册文件的搜索路径，有的时候我们自己安装的软件是带有自己的帮助文件的，通常不在我们的MANPATH 里面，那么我们就可以手动指定man搜索的文件路径。
如 man -M /home/mysql/man mysql
```

#### tar 解压或者压缩文件

```text
用法：tar [选项] 压缩/压缩的文件名称 解压或者压缩的文件
解压文件 tar -zxvf  *.tar.gz
压缩文件 tar -cvfz/j  *.tar.gz/.bz2  文件/目录
```

#### 提高效率的方法

```text
1. 使用tab键补全命令或者文件
2. 使用history查看使用过的命令， history -c清除历史。
3.快速打开终端 shift+alt+t
alt+数字 切换终端
4.control+c 终止当前的命令的执行或废除已经输入的命令。
5.which 命令 :查看命令存在那个目录下
```

#### vi

```text
命令模式下
:w 保存文件
编辑模式
i（insert）光标之前插入
a (append) 光标之后插入
o 下一行进行插入

一般模式下移动光标；
h(左)j(下)k(上)l(右)

w 每次移动一个单词
0 回到行首 $回到行尾
100gg 跳到指定行
gg 第一行
G 最后一行
删除 dh删除当前光标位置前的字符
x 删除光标所在的字符
dw 删除光标后面的单词
dd 删除当前行
d0 删除光标到之前的所有内容
d$ 删除光标之后的所有内容
5dd 删除光标所在位置后的五行（包含当前行）
dgg 删除到第一行(包含)
dG 删除到最后一行（包含）
ggdG 删除真个文件
u 撤销上次操作
复制操作：y替换上面的d
p粘贴到当前光标之后，P粘贴到当前的光标之前。

缩紧 =
    == 当前行和上一行对齐或者缩紧
    gg=G  全文缩进
    # 全文搜素光标下的单词，并高亮显示。
    % 跳到对应的括号上。
vimtutor 查看vim教程
```

#### gcc编辑器

```text
将程序编译成可执行的二进制指令（*.c->*.out），使用 ./*.out执行文件。
用法：gcc hello.c 或者gcc hello.c -o  hello(编译后文件的名字)
gcc -std=c99 设定c语言的版本。
gcc -v
选项：-Wall 编译过程显示警告信息。
编写程序的过程：1.vim编写程序2.gcc编译成可以执行的二进制文件。3。执行 ./*.out文件。
```

#### c语言编程

```text
1. c语言的代码需要写在*.c文件里面。
2. c语言的项目可以由多个*.c文件组成，c文件里面由函数组成，c程序由一堆函数组成，c语言项目里面有且只有一个入口函数。（main函数）
3. c语言的执行顺序：在同一个函数中，代码从上到下执行。
4. 程序的结束：main函数中没有return语句，执行到函数末尾，由return语句，执行到return语句。
5. 编码规范：
            1.一行只写一句代码。
            2.可以在代码中加入适当的空格空行，使代码看起来更加的清晰。
            3.使用缩进规则，使代码看起来更清晰。
            4.写代码时，对关键性代码需要加上注释。
6. c语言中有两种注释，单行注释（//...）和多行注释（/* ... */）
```

hello.c文件

```c
//引入printf函数所在的库文件
#include <stdio.h>
//int 是函数的返回值的类型， main是该函数的名字，因为函数的名字是main，所以定义的同时是一个入口函数。
int main()
{
    // 使用printf函数打印内容
    printf("hello world!");
    //函数的返回值
    return 0;
}
```

练习:
star.c :第一打印一个*，第二行打印* *，... 。
2_3.c :在终端中输出2+3的和。

### c语言中的变量

```text
在c语言中可以通过变量使用内存的空间，变量指向内存中地址，地址上保存的值就是该变量被赋值的值。
```

#### 变量命名

```text
1. 不可以是中文
2. 以字母、_开始，后面可以用数字、字母，下划线。
3. 变量名区分大小写。
4. 非关键字（return、int ...）
5. 同一作用域不能存在同名变量。
6. 命名规范：my_money / myMoney
```

#### 变量的类型（不同类型的变量在内存中分配的大小是不同的）

基本数据类型

```text
char :1byte(字节)
short int :2byte
int  :4byte
long int :8byte
float :4byte
double :8byte
```

复合数据类型

```text
数组、指针、结构体、联合、枚举。
```

通过sizeof打印变量和常量所占用的字节数:demo/01var.c

#### 信息的表示

```text
unsigned char a; 给a变了所在的地址分配了一个字节的空间，表示范围是0-255;
signed char a;分配的空间是-128-127；
char c == >signded char c;
```
查看ascii表；

```text
man ascii;
其中字符'0'(48)和0是不一样的。
可以在char中存放int类型（0-127）；
```

demo02/uc.c  :在char中存放超过范围的整形数字。

#### 进制转换

```text
四位2进制可以转换成以为16进制；
1101 -->  D;
```

#### 定义变量需要初始化

```text
定义一个变量相当于在内存中绑定了一块空间，如果不进行初始化操作，变量中存放的值是不确定的。
int i=10;
```
####  格式化打印变量

```text
printf=print formmat;
变量中存储的二进制的数据，我们可以使用不同的格式符输出变量。
```

demo03/02_printf.c  格式化输出变量。
demo03/03_scanf.c   接受用户的输入并打印变量的值
demo03/big2low.c    将用户输入的大写字符转化成小写
demo03/area.c       用户输入矩形的长和宽，计算出矩形的面积
demo03/04_add.c     计算两个数的和
demo03/05_var.c     C语言中如何存一个负数的

#### sizdeof运算符
sizeof(int)
sizeof(i)
sizeof(3.14)

#### =(赋值运算符)

赋值运算两边的类型不一样，小字节赋值大字节，复制到低位，高位补0，大字节复制到小字节时，将大字节的低位赋值给小字节。将float类型复制int类型，会发生类型转换，将float转成int.

#### +-*/%

运算的两边类型一致，那么运算的结果也是该类型。

int i=10/3;  //3

demo04/02apple.c 

运算符两边的类型不一样，现将类型转成一样的，然后运算的结果类型保持一致。一般会将会转成大类型的，如int * float,现将int 转为float，运算结果是float,有符号×无符号数，结果是无符号数。

#### 符合运算符  += |= &=

a+=1;等价于 a=a+1;

#### i++、i--、++i --i

i++  是先用后加
++i  是先加后用

demo04/increment.c

#### 运算符的优先级 

运算符是有优先级的，如果不知道运算符的优先级，可以使用()来改变运算符的优先级。


i = (1+2)*3 //先运算加法，在运算乘法

```text
一目运算符：一个操作数 eg: +、-、++ 、--
二目运算符：两个操作数 +、-、*、/、%
三目运算符：三个操作数 a>b?a++:b++
```
liunx下查看运算符:man operator

demo04/second.c

## 位运算符（操作比特位）

& 同时为1时结果为1，其他情况结果为0
| 一个为1结果为1，同时为0结果为0
~ bit位上的1变为0,0变为1
^ 异或运算符 相同为0，不同为1
<< 低位补0
'>>' 有符号数高位补符号位，无符号数高位补0

demo04/bit.c


#### 条件运算符

a>b?a++:b++

#### 比较运算符

>、<、>=、<=、==、!==

#### 逻辑运算符

&&、||、!

num >1 && num1<10

demo04/year.c

#### 流程控制语句

1. if、else语句
2. for循环
 特例：死循环
```c
        for(;;)
```
3. break和continue

4. goto语句

        goto语句可以用来跳出双重for循环。
5. 输入输出缓存区
   
6. 数组
        1.内存中连续的大小为某一类型的空间。
        2.数组的声明 int a[10]

7. 数组的初始化
        数组和变量一样，如果不初始化，那么数组中存放的数字是随机的。
```text
        int a[3]={2}; //[2,0,0];
        int a[3]={1,2,3} //[1,2,3]
        int a[3]={[1]=1,[3]=2} //[1,0,3]
        int a[]={1,2,3} //[1,2,3]
```
8. 数组下标越界，编辑器保持沉默
        1.读写其他变量的值
        2.地址非法，段错误程序结束

9. 使用sizeof可以查看数组占用的字节数
```text
int a[] = {1,2,3};
sizeof(a)/sizeof(a[0]);//返回的是数组中元素的个数
```
10. 数组的地址

```text
a == &a //true
````

11.可变长数组
```
c99 中可以用变量来设置数组的长度，但是一旦数组创建成功，数组的长度就不可以变了，此外需要注意可变数组不能被初始化。

int n = 5;
n =3;
int arr[n];
```

```
demo05/03_tinary.c 计算一个整形中包含的2进制1的个数
demo05/05_rand.c 生成随机数
demo05/06_9*9.c 99乘法表
demo05/07_for_2.c  双重for循环解决鸡兔同笼的问题
demo05/08_do_while.c do——while循环
demo05/09_goto.c  使用goto语句和if语句实现循环
demo05/10_buff.c  清理输出缓存区
demo05/11_scanf.c  清理输入缓存区
demo06/_2048.c 使用二维数组实现2048小游戏

```
### 函数

1.函数在定义之前使用的时候需要声明，声明包括函数的返回值、函数名和参数。子函数中可以使用exit(0)来结束函数的执行。
2.函数可以自己调用自己，称之为递归。

#### 递归和循环

基本上循环可以实现的效果递归都可以实现，不同的是，循环代码根据循环变量来实现代码块（循环体）的重复执行，而递归是函数里面的代码块根据参数来不不断的执行，我们可以在递归函数的一开始就调用自己，这种称之为头递归，函数执行所需要的堆栈不会释放，如果使用尾递归（调用自身函数发生在函数的结尾）这种情况不会造成递归堆栈的过度使用，如果我们在函数的中间位置调用递归函数，那么和头递归一样。

循环只能使代码块一次执行的效果，这种情况下和尾递归一样，但是我们可以在递归函数的开始或者中间位置执行递归函数，这个时候代码快被先执行一半或者不执行，当递归函数终止了，函数中的代码被反向执行。
### 变量的作用域和及生命周期

1. 变量是内存中分配的一块存储区域。
2. 变量的作用域指的是变量可以被访问到的范围。
3. 变量的生命周期：变量的分配和回收。
4. 局部变量(函数内部声明的变量)只在函数内部可用，代码块中声明的变量旨在当前代码块中可用。
5. 同一作用域中不能存在同名的变量。

#### 局部变量
局部变量的在函数调用开始时被创建，函数执行结束时被释放。局部变量需要声明在函数里面，默认是auto类型。

```c
void fun(){
    auto int a =10;
}
```

#### 全局变量

全局变量声明在函数体外，整个程序都可以访问到。全局变量和局部变量可以同名，使用时按就近原则，局部变量会遮盖全局变量。

```c
int a= 100;
int main(){
    return a;
}
```
全局作用域变量不能和函数名同名，函数名具有全局特性。所以使用全局变量可能会污染全局空间。同时如果一个函数依赖于外部变量，那么他的复用性会降低。所以建议少用。

#### static变量
static变量在函数第一次调用时被创建，在程序结束时被销毁。可以和全局变量同名。
```c
/* 
  *
  *  静态局部变量
  *
  */
#include "stdio.h"
int i =10;  //全局变量
void stat_func(){ 
    static int i = 10;   
    printf("%d\n",i++);   
    printf("%p\n",&i); //打印地址
}
int main(){
    stat_func(); //10  
    stat_func();//11  
    stat_func();//12  
    return 0;
}
```

### 指针

计算机将bit分配一个编号，计算机对内存的访问时通过编号来实现的，这个编号就是一个内存地址，成为指针。

指针变量，保存地址的变量。

![3570acaefc759fcf80fb54960d181c48](/clang/var_and_point.png)

声明一个指针变量
```c
int a=10;
int *c = &a;
```
使用*运算符读取指针变量保存的地址中保存的值。*p可以像变量一样去使用。

```c
#include <stdio.h>
int main(){   
    int a =10;   
    int *p = &a;   
    printf("%d",*p);//10;  
    printf("%d",*(&a));//10 
    return 0;
}
```


#### 指针的作用

* 指针可以用来修改作用域外的变量的值。这个也是我们使用scanf()函数时为什么要传递一个地址进去。

```c
#include <stdio.h>
void func(int *p){  
    *p =20;
}
int main(){  
    int a =10;   
    int *p = &a;    
    printf("%d\n",a);//10    
    func(p); 
    printf("%d\n",a);//20   
    return 0;
}
```

#### 野指针

野指针指的是声明了一个指针变量，没有让他先指向一个地址，就直接使用这个指针变量。
```c
    int *p;
    //*p的地址是不确定的。
    *p =20;
```
避免野指针的方法：
1. 声明指针变量时对其赋值。
2. 将指针变量指针指向NULL(0存储单元的地址)，对NULL这个地址中值的修改是不允许的 。

#### 不要在函数中返回一个局部变量的地址
因为函数中的局部变量的值会在函数返回时销毁，如果我们使用这个地址操作，可能会对其他的变量的值进行操作。编译器是不允许编译通过的。
```c
#include <stdio.h>
    int* func(){  
    int a =10;   
    return &a;
  }
  int main(){  
    int* p = func(); 
    *p =20;  
    printf("%d",*p); 
    return 0;
  }
```

#### 指针的运算 

1. 取地址  int *p = &a;
2. 取值运算  int b = *p;
3. 加减   int *p = &a ,  p+1;p-1 在p的地址移动一个sizeof(int) 的长度。
4. sizeof()运算，取决与计算机的位数 32=>4 64=>8
5. 
```c
#include <stdio.h>
int main(){ 
    int a = 10;  
    char c = 11; 
    int* p =&a;  
    char* q =&c; 
    printf("%d\n", sizeof(p));  //4  
    printf("%d\n", sizeof(q));  //4  
    return 0;
}
```

#### 数组名相当于一个不能移动的指针。
```
int a[5] ={0};
int* p = a;
p[0] ==a[0] //true;
*p++  ==a[0]
*(p+1) =a[1]
```

### const关键字

1. const关键字可以生命一个只读的变量，项目使用这个值的时候不用担心被修改。
```c
    const int i =10;
   // 或者
   int const i =10;
```
2. const 修饰指针变量,指针不能指向别的地址了，这种指针称之为常指针 。数组名就是一个常指针。

```c
int *  const i =&a; 
```
3. const int * i 是指针是指不能通过指针修改变量，但是可以使用变量名来修改。等价于int const * i; 

```c
 const int  * i = &b;
 *i =50//报错
 b=50 //可以
```
#### 数组和指针的区别

1. 数组名相当于一个常指针。
2. sizeof一个数组时，返回的是当前数组所占用的字节数，而指针返回的是机器字宽度。
3. 可以指定函数的返回值的类型为一个指针，但是不能设置为一个数组。


### 字符和字符串

c语言没有字符串类型，但是可以用一串字符加上字符\0(ascll =0)来表示字符串。\0代表字符串结束。

字符串的三种表现形式:

1. 字符串常量，也就是字符串字面值。eg："hello"，相同的字符串的地址是相等的，使用printf("%p","hello world")这种方式可以打印出字符串的首地址。

2. 字符指针，可以使用一个字符指针去指向一个字符串常量，指针会保存字符串中第一个字符的地址。
```c

#include "stdio.h"
int main(){
    //printf("%p","hello");//00405064 
    char* str = "hello";  
    //为什么是！=0;因为字符串的结尾用'\0'表示，'\0' == 0；  
    while(*str != 0){  
        printf("%c",*str++);
          //hello   
      }
      printf("%d",'\0' == 0);  //1 
      return 0;
  }
```
```c
char *p = "abasdsa";
*p ='A';  //出现段错误，因为指针指向的地址是一个字符串常量。不能修改。
```
3. 字符数组，使用字符数组时必须比字符串长一位用来保存'\0',内存读取字符串的知道字符结束了。

```c
char a[13]="hello world!";
a[0]='c';//可以修改
char c[] = "12345";
sizeof(c) // 6 默认会加'\0'
```
使用数组去存储一个字符串时，数字的长度如果小于字符串，字符串会被截断，在打印字符串的时候会一直输出直到在内存中遇到'\0';

#### 字符串的输出

1. 循环打印字串
2. 使用%s,
```c
    char * str = "badsda";
    char a[10] = "asdsad";
    printf("%s",str);
    printf("%s",a);
```
3.scanf和gets()方法，输入的字符含有回车或者换行的时候会被截断，使用gets方法可以解决这个问题，但是两者都不可以超过存储字符串使用的数组的长度。
```c
#include "stdio.h"
int main(){ 
    char * str= "absd";  
    char a[12] = "sdasdasd";  
    //str指针指向a数组，负责使用指针会修改字符串常量    
    str = a;  
    //输入带有空格或者回车符的字符串会被截断   
    scanf("%s",str);//   hello wor
    printf("%s\n",str); //    hello
    return 0;}
```
### 字符串的运算
#### copy
1.浅拷贝
```c
char * c ="asdasd";
char * b =c;//浅拷贝 两个指针指向同一个位置
或
char a[] = "asdasd";
char* d =a;

a = c;//这个时错误的，a时一个常指针
```
2.深拷贝

```c
#include "stdio.h"
#include "string.h"
int main(){ 
    char* str ="basdasd";  
    char a[]="1234567890";  
    //  str[i]!=0;  
    int i = 0;  
    while(str[i]){       
         a[i]=str[i];      
         i++;   
    }   
    printf("%s\n",a); //basdasd890   
    strcpy(a,str);    //会复制\0
    printf("%s",a); //basdasd   
    return 0;
}
```
不能这样使用上面的strcpy(str,a)函数，因为str指向的变量是一个常量。还有一个和strncpy()函数，可以指定复制的字符个数。
char *strncpy(char *dest, const char *src, size_t n);

#### 字符串的比较（strcmp）

```c
char * c = "sdasda";
char * d = "ADA"
//c>d返回1，小于返回-1，相等返回0
strcmp(c,d)
```
#### strlen(char * str)，不包括'\0';
#### char *strcat(char *dest, const char *src);将b连接在a的后面。

#### memset(char * a ,0,20),清空字符串，使用20个0来填充。

### 指向多个字符串

1. 字符指针数组  char * a[]={"hello","world"};
2. 二维字符数组  char a[2][10] ={"hello","world"}   //  { {"hello"},{"world"} }
3. 字符串指针  char ** p = a;

### main函数的函数原型

1. int main(void){  }
2. int main(int argc,char * argv[]){  }
argc时输入的参数的个数，argv时输入的字符串的数组eg: 

```shell
./a.out test test1
```
输入的参数个数是3个，argv[0] ="./a.out" argv[1] ="test" argv[2] = "test1"

```c
 #include <stdio.h>
 int main(int argc,char * argv[]){  
    //打印命令行输入的参数    
    for(int i = 0;i<argc;i++){       
        printf("%s\n",argv[i]);   
    }   
    return 0;
 }
```

### c程序的编译过程
![04b74ac5a6290c5a629cd530605996ad](/clang/language.png)


```
源文件-->预处理-->编译-->汇编-->链接-->可执行文件
main.c-->main.i-->main.s-->main.o-->printf.o-->a.out
```
#### 1.预处理
1、执行以#号开头的预处理指令，如使用#include <stdio.h>会将这个头文件包含的当前的文件中去，可以在mian.i的文件中看到。
2、忽略程序中的注释。
```shell
gcc -E main.c -o main.i
```
#### 2.编译

使用下面的命令将main.i的文件编译成汇编语言，生成mian.s文件。

```shell
gcc -S main.i
```
#### 3.汇编
将汇编源文件转化为机器指令（2进制文件），编译后的文件名为main.o
```shell
gcc -c main.s
```
#### 4.链接
不能直接对main.o文件进行执行，需要将一些库函数连接进去才能执行。会生成一个a.out的可执行文件。
```
gcc main.o
```
### 预处理指令

#### 1.头文件
 #include  将后面的源文件包含到当前的*.c文件中。
#### 2.宏
 宏变量和宏函数
1. 宏变量并不是真正的变量，不能对其进行赋值操作。他会在预处理阶段被替换为后面的值,宏函数的计算表达式里面可以使用宏变量。

```c
    #define PI 3.14
```

 2. 宏函数是使用后面的函数体的表达式去替换函数的调用；


```c
 #include <stdio.h>
 #define DOUBLE(n)  n+n
 int main(){   
    int s = DOUBLE(5)*2;// 15   
    printf("%d",s);   
    return 0;
 }
```

 上面的结果为什么是15，使用gcc -E *.c -o *.i,然后查看*.i文件，会发现这个表达式被替换为：

```c
 int s = 5+5*2;
```


 为了得到预期的结果，我们可以这样定义宏函数

```c
 #define DOUBLE(n)  (n+n)
```
如果我们在使用的时候传入的n是一个表达式1+2，上面的预处理之后会得到（1+2+1+2);我们计算的值有可能就不是按照预期的来进行的，所以我们最好这样定义；

```c
#define DOUBLE(n)  ((n)+(n))
```
### 条件编译
```
#if  常量
    //常量不为0时编译
#else
    //常量为o时编译
#endif
```
eg:
```c
// 条件编译
#include <stdio.h>
#define WIN 0
int main(){
 #if WIN  
    int s= 10;
 #else 
    int s = 5;
 #endif   
    printf("%d",s); //5  
    return 0;
 }
```
还可以使用这样的条件编译

```c
#ifdef WIN
    //宏变量WIN定义了执行
#else
    // 宏变没有定义执行
#endif
```
```c
#ifndef WIN
    //宏变量WIN没有定义了执行
#else
    // 宏变定义执行
#endif
```
使用#undef WIN可以取消宏定义

```c
#include <stdio.h>
#define WIN 1
#undef WIN
int main(){
#if WIN  
    int s= 10;
#else  
    int s = 5;
#endif 
    printf("%d",s); //5  
    return 0;
}
```
### 内置宏变量

在编译的时候系统提供了一些内置的宏变量：

```
__FILE__  当前的文件名
__LINE__ 所在行的行号
__DATE__ 编译日期
__TIME__ 编译时间
```
eg:
```c
#include <stdio.h>
int main(){   
    printf("%s\n",__FILE__);//.\bilud-in.c    
    printf("%d\n",__LINE__);//10    
    printf("%s\n",__DATE__);//Jun  8 2019   
    printf("%s\n",__TIME__);//22:57:45    
    return 0;
}
```
###  #include <>和 #include ""的区别
 ```
 #include <>只在系统目录下查找 /usr/include/
 #include "" 现在当前的目录下查找，然后在系统目录下查找
 ```
 ### 分文件调用


```c
// 用户登录系统

#include "stdio.h"
#include "string.h"
#include "stdlib.h"
void setPasswd(char * passwd){
    printf("请输出你要使用的密码：\n");
    scanf("%s",passwd);
}

int loginIn(const char*  passwd){
    int i =3;
    //不能使用字符指针去直接保存，会产生野指针（char * str; ）
    char  a[13] ={0};
    while(i>0){
        printf("请输入你的密码：\n");
        scanf("%s",a);
        printf("s=%s",passwd);
        printf("a=%s",a);
        if(strcmp(passwd,a)==0){
            return 1;
        }else{
            i--;
        }
    }
    return 0;
}

void operation(){
    printf("+-----------------+\n");
    printf("+     操作方式：  +\n");
    printf("+   1.设置密码    +\n");
    printf("+   2.去登陆      +\n");
    printf("+   0. 退出系统   +\n");
    printf("+-----------------+\n");
}
int main(){
    char a[13] = {0};
    int c= 0;
    int isEnd = 1;
    while(isEnd){
        operation();
        scanf("%d",&c);
        switch (c){
            case 1:{
                setPasswd(a);
                system("cls");
                break;
            }
            case 2:{
                if(loginIn(a)==1){
                    system("cls");
                    printf("登陆成功");
                }else{
                    system("cls");
                    printf("登陆失败");
                }
                break;
            }
            case 0:{
                printf("退出登录");
                isEnd =0;
                break;
            }
            default:{
                printf("操作有误");
                isEnd = 0;
            }
        }
    }
    return 0;
}

```
我们可以对项目的文件进行分割，login.c中存放设置密码和登录的函数，main.c中存放其他的main函数。

main.c
```c   
//
//  main.c
//

// 用户登录系统

#include "stdio.h"
#include "string.h"
#include "stdlib.h"
#include "login.h"

int main(){
    char a[13] = {0};
    int c= 0;
    int isEnd = 1;
    while(isEnd){
        operation();
        scanf("%d",&c);
        switch (c){
            case 1:{
                setPasswd(a);
                system("cls");
                break;
            }
            case 2:{
                if(loginIn(a)==1){
                    system("cls");
                    printf("登陆成功");
                }else{
                    system("cls");
                    printf("登陆失败");
                }
                break;
            }
            case 0:{
                printf("退出登录");
                isEnd =0;
                break;
            }
            default:{
                printf("操作有误");
                isEnd = 0;
            }
        }
    }
    return 0;
}
```
login.c
```c
//
// login.c
//

// 用户登录系统

#include "stdio.h"
#include "string.h"
#include "stdlib.h"

void setPasswd(char * passwd){
    printf("请输出你要使用的密码：\n");
    scanf("%s",passwd);
}

int loginIn(const char*  passwd){
    int i =3;
    //不能使用字符指针去直接保存，会产生野指针（char * str; ）
    char  a[13] ={0};
    while(i>0){
        printf("请输入你的密码：\n");
        scanf("%s",a);
        printf("s=%s",passwd);
        printf("a=%s",a);
        if(strcmp(passwd,a)==0){
            return 1;
        }else{
            i--;
        }
    }
    return 0;
}

void operation(){
    printf("+-----------------+\n");
    printf("+     操作方式：  +\n");
    printf("+   1.设置密码    +\n");
    printf("+   2.去登陆      +\n");
    printf("+   0. 退出系统   +\n");
    printf("+-----------------+\n");
}
```
login.h

```c
void setPasswd(char * passwd);
int loginIn(const char*  passwd);
void operation();
```
使用命令
```shell
# 编译成机器码
gcc -c main.c
gcc -c login.c
# 链接库函数
gcc main.o login.o
```
或者可以使用

```shell
 gcc main.c login.c
```
### static 和 extern
1. static 可以用来修饰全局变量和函数，使用static修饰的函数只在当前的.c文件中可用,不同文件中使用static修饰的函数可以同名。
2. extern 修饰的全局变量和函数名具有外部链接属性。

3. mian 中声明的全局变量在其他的文件中使用时，需要使用extern int max;来说明变量的类型

### 头文件的引用

头文件中可以包含其他的头文件。
main.h
```c
#include "hello.h"
void printf();
```
如过hello.h中包含main.h,那么就会发生交叉引用。
```c
#include "main.h"
void hello();
```
问了防止发生交叉引用，我们可以使用条件编译来处理这个问题。

main.h
```c
#ifndef __MAIN_H__

#define __MAIN_H__
#include "hello.h"
void printf();
#endif
```

hello.h
```c
#ifndef __HELLO_H__
#define __HELLO_H__
#include "main.h"
void hello();
#endif
```
### make 和makefile

当我们的项目变得很大时，我们每次编译的时候都要去链接多个文件。这是一个很麻烦的事情，所以我们可以使用make这个自动编译工具，为此我们需要配置makefile文件。如果我们修改了一个源文件，使用make工具不会整个编译整个项目，之后重新编译这个文件和对这个文件有依赖的文件。

makefile
```
# 目标可以执行文件

main:main.o login.o
    gcc main.o login.o -o main
# 依赖的头文件和源文件
main.o:login.h main.c
    gcc -c main.c
login.o: login.c
    gcc -c login.c
```
使用make命令去编译
```shell
make
```

























 


​    
​    











