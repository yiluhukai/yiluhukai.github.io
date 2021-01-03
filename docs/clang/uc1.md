### 复习:uc1

1.大端小端

```
所谓的大端模式（Big-endian），是指数据的高字节，保存在内存的低地址中，而数据的低字节，保存在内存的高地址中.
记忆方法: 地址的增长顺序与值的增长顺序相反
所谓的小端模式（Little-endian），是指数据的高字节保存在内存的高地址中，而数据的低字节保存在内存的低地址中，
记忆方法: 地址的增长顺序与值的增长顺序相同
```
eg:unsigned int value = 0x12345678




| 内存地址 | 大端 | 小端 |
| --- | --- | --- |
| 0x4000 | 0x12 |  0x78|
| 0x4001 | 0x34  | 0x56 |
| 0x4002 | 0x56 | 0x34 |
| 0x4003 | 0x78 | 0x12 |

大小端判断

```c
#include <stdio.h>


int main(void){
        unsigned int val = 0x12345678;
        unsigned char * c = (unsigned char *)&val;
        if(*c == 0x12){
                printf("your system is big\n");
        }else{
                printf("your system is little\n");
        }
        return 0;
}
```

2.数组
```
int arr_t[3]    // 类型是int[3] arr_t 是数组名称
typedef int arr_t[3] // 给int[3]起别名为arr_t
arr_t a //  相当于 int a[3] 
arr_t b[2]   // 相当于 int b[2][3]
//  二维数组的初始化
int b[2][3]   = { {1,2,3},{4,5,6}}
// 二维数组在内存中的表现
[1,2,3,4,5,6]
b为数组名称，长度为2，每个元素是一个int[3]类型的数组
// 所以
*(b+1) == b[1] 指向数组第二个元素{3,4,5}的地址
b[0]  == *b
// b[0][3]  b[0]相当于数组的名称,他的元素是int类型的
b[0]+1  == // 指向的是数组的2的地址

// 访问上面数组中元素5
*(*(b+1)+1)
*(*b+4)
*(*(b+2)-2)
```
3. 字符串列表

char * str[3]  // str[0] 是一个字符指针，如果指向一个字符串，则是一个字符串数组

4. 数组指针

int (*p) [3]  
// p是一个指针变量，指向的是一个int[3]类型的地址

*p获取这个int[3]类型的数组
p+1 // p指向的类型是int[3] , 所以p+1会将地址增加12个字节


5. 函数
函数是一种类型。

int add (int x,int y)

//add是函数名，也是函数的入口地址 ， 类型为int (int x,int y)

typedef int add (int x, int y);

add p // 函数类型的变量p 

add * p // 函数指针

typedef int (*func) (int x,int y);

func是函数指针类型。

func a //  ===  add* p;

int (* func) (int x, int y)  // func时函数指针

int (* func[3]) (int x,int y) //  func 是数组名称，数组有4个元素，元素的类型是函数指针
6.结构体

struct  node{
    int data,
    struct node * next
};

typedef struct node node_p

typdef node_p * node_point


node_point m,n //  node_p * m,node_p* n


### 什么是操作系统

操作系统是一个管理计算机软件和硬件的一款软件。软件是逻辑的虚拟的，硬件是物理存在的。
软件是对硬件的控制。硬件为软件的运行的支撑。

计算机包括那些系统
1. cpu 管理cpu 进程
2.内存 管理内存 内存管理
3.硬盘 管理硬盘 文件系统
4.网卡 管理网卡 网络通讯
5.显卡、声卡
6.线程管理、进程管理
7. 中断管理  信号

### uc时干什么的

标准库函数时c语言提供的一些和系统无关的函数，我们写代码的时候可以调用
unix系统也提供了一部分系统调用相关的函数，我们使用uc就时调用这些函数。

查看标准库函数 man 3 printf
查看系统调用函数 man 2 open


### 头文件的内容

#ifndef HEAD___H__
#define HEAD__H__
    // 函数的声明
    // 类型的定义
    // 宏定义
    // 文件的包含
    //变量的声明
#endif


int a ; // 变量的定义

extern int a ; //  变量的声明

变量的定义是给变量分配内容空间，而变得声明是给变量扩充作用域，并不会给变量分配内存空间。

### 大型项目目录结构

1.先创建一个文件夹

```shell
mkdir kmath
```
2.在kmath下编写头文件kmath.h

```c
#ifndef __KMATH__H__
#define __KMATH__H__
int  k_add(int,int);
int  k_sub(int,int);
int  k_div(int,int);
int  k_mux(int,int);
#endif
```
3.现在可以分工实现main.c 和 k_add.c、mux.c
main.c
```c
#include <stdio.h>
#include "kmath.h"

int main(void){
        int a =10,b=11;
        printf("a+b=%d\n",k_add(a,b));
        printf("a*b=%d\n",k_div(a,b));
}
```

k_add.c

```c
int k_add(int a,int b){
        return a+b;
}
int k_sub(int a,int b){
        return a-b;
}
```
mux.c

```c
int k_div(int a,int b){
        return a*b;
}
int k_mux(int a,int b){
        return a/b;
}
```

gcc -c main.c、gcc -c k_add.c、gcc -c mux.c分别对单个文件进行单元测试。

gcc *.o 或者gcc *.c对程序进行集成测试。

4.gcc *.o 将目标文件和可执行得环境链接起来。

nm a.o 可以查看二进制文件中得符号表
符号表包含函数得名称、全局变量得名称、静态局部文件得名字
其中U表示函数在当前文件中未实现。T表示在当前文件中存在函数得实现。T前面得地址是函数在当前文件中地址。

链接发生前：

![d3b7ac9b27e338b14b09eb7cc9258d14](/clang/D132B234-93F2-4789-9A1E-478E9A65B5BD.png)

链接后

![ce5cee00c873eff8b9f09e7df0a2ef14](/clang/D181481D-861A-41A7-AF66-09F54AA857AA.png)

链接就是将多个二进制文件的符号表合并。发生在生成可执行文件之前的链接称之为静态链接。
可执行文件在执行得需要加载到内存中，在加载内存得之前，需要链接可以执行文件依赖得动态库。这时候得链接称之为动态链接或者延迟链接。



查看链接过程中发生的事情：gcc *.o -v,运行这个命令可以看待一个运行时文件。


可以看到里面有个crt1.o的目标文件。执行 nm .../crt1.o
![74da45445ef7e85b8bfa49eda68f8fcf](/clang/22D0ADE8-44DB-441F-897A-BB307DEB366A.png)

可以看到这个文件中存在一个_start函数，该函数中用到了main函数，所以我们所写的main函数是在_start中调用的，所以main函数必须存在。


### include ""和<>

<> 从系统指定的路径下找头文件
“” 先从当前路径下找头文件，找不到再去系统指定目录下

系统制定的路径：

gcc -E main.c o main.i -v


![4265a6c238e8f287b568505d54a1b861](/clang/C5912FB5-FFF4-4C9A-8A59-26BBFC3438E1.png)

我们可以把自己的头文件放到系统指定路径下，然后通过<>去包含。

我们可以把当前头文件这些文件放到指定目录下制作第三方的包。
![10cece503aa2c501a747f638e74ded4d](/clang/2E66CC50-EF92-4103-82EA-14B927D117C1.png)

#### 制作静态库文件

为什么要制作静态库文件？
将多个*.o文件打包成一个文件，便于携带使用，可以把这个静态交给别人调用

1.文件的目录接口

![0b8bb0e4a8270c1b018e57bbf327ca1a](/clang/F954A844-36E2-4372-96FB-96515F2210B5.png)

2.将要加入的动态库的源文件编译为目标文件
![74a3a28164283ff99183138262735c53](/clang/81DCE7F9-7558-4CB2-821B-FAB007089860.png)

3.将目标文件打包到静态库文件中
![b9c8f4c99bc097fca38346c60098d791](/clang/A93699CB-A853-4918-9393-9CA8DEA0249F.png)


4.使用静态库文件链接生成可执行文件

![4f07cb7b5ee58981ad1789159b3ef717](/clang/1D7D2A35-4972-42CE-AF1A-29417EBE5BB1.png)

-L路径 
-l代表使用的静态库的名字
链接后的可执行文件不再依赖于静态库。


#### 环境变量的初步认识

程序和进程

程序是计算机指令的集合，存放在磁盘中。
进程是程序运行的实例。每个进程都有自己的pid,操作系统使用pid来管理进程，进程是动态的。进程运行期间需要和操作系统之间不断的打交道，操作系统为和进程的运行提供了一些环境。进程通过环境变量的方式去访问系统的环境。环境变量是进程的一部分。
env指令可以用来查看环境变量。

echo $name 可以输出名字为name的环境变量
name=value可以用来设置环境变量的值。注意=号的两边不允许出现空格。
env|grep USER

grep "字符串" 文件名

在指定的文件中查找包含字符串的额行。讲结果输出的显示器上。

｜ 管道命令，将前一个命令的执行结果传递给后一个命令，作为后一个命令的默认文件。


bash进程除了环境变量还可以有自定义的环境变量。


自定义的环境变量是bash进程私有的，不可以被儿子进程继承。环境变量是可以被儿子进程继承的。
使用export可以将自定义变量转换成环境变量。

在一个bash进程中修改环境变量的值在另一个bash进程中是不可见的。
![ffce0161c3f96604fa8dd07121aa96fd](/clang/E069AC6A-5A47-4AA3-95A1-7CF8899AC92E.png)

使用export将自定义变量转化为环境变量，该环境变量只在当前的bash中可见。
![aeab16994c9908f89a9feb12c262a344](/clang/6E8473F9-A426-4832-A073-7F8B11B14F3E.png)

为了让这个环境变量对所有的bash生效，我们可以在～/.bashrc中配置自定义变量和环境变量。

```shell
vim ~/.bashrc
# 设置自定义变量
caption="beijing"
# 将自定义变量设置成环境变量
export caption


# 或者
export name="hello"

#
:wq

# 
source ~/.bashrc
```


#### PS1='\W\$'

这个命令会将bash命令行的路径改成当前文件夹的最后的路径名；如果设置为环境变量，那么每次打开bash都会这样。

#### PATH

/Users/lijunjie/.nvm/versions/node/v12.13.1/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/Users/lijunjie/development/flutter/bin


当你在BASH中输入一个命令时，后在PATh环境变量中以：分割的环境变量中去查找可执行程序，找到会执行当前程序，找不到会报错。

当我们有一个可执行程序。我们希望他在任何路径下都可以访问。我们可以
1.将当前程序所在的路径加入到环境变量中。
2.将可执行程序放到上面的任意路径下。
我们执行可执行程序前面需要加./,可以采用export PATH=$PATH:.的方式，将当前路径加入到环境变量中。

#### 动态库(共享库)文件

命名规则：lib库名.so

制作动态库文件
1.将要加入动态库的源文件编译成与位置无关的目标文件。
```shell
#-fPIC 与位置无关的
gcc -c -fPIC *.c 
```
2.将第一步生成的可执行文件打包到动态库文件
```shell

gcc -shared -o libkmath.so *.o
```
3.链接生成可执行文件

```shell
gcc main.o -Lkmath -lkmath
#报错
./a.out
```

![00aeed146b84425be347feef0fe6a0ea](/clang/00DBF552-35F3-41D8-BE7F-F3DC8E244752.png)
可以看到缺少开k_add和k_div的实现

查看可执行文件缺少的动态库
```shell
ldd ./a.out
```

![6aee49a40161e9c6af16c1ed89912311](/clang/76AE21ED-7DFA-4762-81EC-E36C277333EF.png)
生成可执行文件的时候发生的是一个虚的链接，真实的链接发生在可执行文件执行的时候。这个真实的链接称为动态链接。

错误原因：加载器找不到要链接的动态库。

1.加载器的默认路径
\usr\lib 或者\lib
```shell
sudo mv libkamth.so /usr/lib
./a.out 
```
链接器的默认路径也在这个下面
```shel

#不用指定路径，去默认路径下找
gcc main.o -lkmath
```
2.使用环境变量告诉加载器去哪里找
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:kmath/

#### 动态链接和静态链接的区别
动态链接发生在可执行文件执行的时候。依赖动态库。当修改动态库的源文件，重新打包成动态库。不需要重新链接生成可执行文件（客户端软件的升级）
静态链接发生在生成可执行文件的时候。不再依赖静态库


#### 动态加载

动态加载时在需要这个动态库的时候手动加载，不需要的时候不加载。动态加载时动态库和可执行文件在生成可执行文件之前没有依赖关系（include库文件）。


动态加载相关的函数：
#include <dlfcn.h>
dlopen(3) dlclose(3)

1.dlopen()

void *dlopen(const char *filename, int flags);

filename时动态库的名称，flag时加载模式

1.RTLD_LAZY （只对函数符号表有效，在函数执行的时候引用了这个库中的函数时引用这个库）
```
        Perform lazy binding.  Resolve symbols only as the code that references them is executed.  If the symbol is never referenced, then it is never resolved.  (Lazy binding is performed only for function references; references to variables are always immediately bound when the shared object is loaded.)  Since glibc 2.1.1, this flag is overridden by the  effect  of the LD_BIND_NOW environment variable.
          

2 RTLD_NOW （这个库在dlopen的时候被加载）
​```text
              If  this  value  is specified, or the environment variable LD_BIND_NOW is set to a nonempty string, all undefined symbols in the shared object are resolved before dlopen() returns.
              If this cannot be done, an error is returned.
```
返回值：加载成功返回void *类型的handle.负责返回Null

2. dlclose()
int dlclose(void *handle);

接收上面返回的handle每次关闭时。这个动态库被引用的次数减1.当为0时这个动态库被卸载。成功返回0 ，失败返回非0数字。

```text
 dlclose()
       The function dlclose() decrements the reference count on the dynamically loaded shared object referred to by handle.  If the reference count drops to zero, then the  object  is  unloaded.
       All shared objects that were automatically loaded when dlopen() was invoked on the object referred to by handle are recursively closed in the same manner.

       A  successful  return  from  dlclose()  does  not  guarantee that the symbols associated with handle are removed from the caller's address space.  In addition to references resulting from
       explicit dlopen() calls, a shared object may have been implicitly loaded (and reference counted) because of dependencies in other shared objects.   Only  when  all  references  have  been
       released can the shared object be removed from the address space.
````
动态加载tmath.so这个动态库。

gcc dlopen_demo.c -ldl 

```c
#include <stdio.h>
#include <dlfcn.h>


int main(void){
        void * handle = dlopen("libtmath.so",RTLD_NOW);
        if(handle == NULL){
                printf("load error\n");
                return -1;
        }
        printf("load successfully\n");
        dlclose(handle);
        return 0;
}
```
需要手动设置加载动态库的环境变量。
```shell
exprot LD_LIBRARY_PATH=$LD_LIBRARY_PATH:kmath/
```

3. 加载动态库时的错误信息

char *dlerror(void);

当加载动态库失败时返回错误信息

4. 调用动态库的函数
symbol可以时全局变量、静态局部变量、函数，成功返会函数的地址，失败返回NULL,通l过dlerror()获取错误信息。
void *dlsym(void *handle, const char *symbol);


### 错误处理

调用系统函数或者库函数失败时，我们需要获取错误信息。这个时候我们通过系统提供的全局变量errno来获取错误的错误码，使用strerror()函数获取错误的信息。

1. errno

* errno - number of last error
* #include <errno.h>
* 返回一些库函数或者系统函数出错得错误码。
* errno 是可以修改得  Eg:errno =-1

2.char *strerror(int errnum);

* errnum是上面得errno.
* 返回值是错误信息或者"Unknown error nnn”

3.void perror(const char *s);
* #include <stdio.h>
* perror - print a system error message
* 错误信息得格式为形参s+: +error message. 
* perror("fopen"),出错得情况下或返回下面得格式fopen: No such file or directory

### 内存

1.内存分为ram(random access memory)和rom(random only memory).
2.虚拟地址和物理地址(真正的内存)

CPU在启动的时候是运行在实模式的，Bootloader以及内核在初始化页表之前并不使用虚拟地址，而是直接使用物理地址的。如果CPU寄存器中的分页标志位被设置，那么执行内存操作的机器指令时，CPU（准确来说，是MMU，即Memory Management Unit，内存管理单元）会自动根据页目录和页表中的信息，把虚拟地址转换成物理地址，完成该指令。每个进程有4GB的虚拟地址空间。基于分页机制，这4GB地址空间的一些部分被映射了物理内存，一些部分映射硬盘上的交换文件，一些部分什么也没有映射。当我们访问的虚拟地址不能转成实际的物理地址或者我们没有权限去访问这个虚拟地址对象的物理地址时，就会发生段错误。


为什么要用虚拟地址映射到物理地址

直接访问将程序加载到内存中，进程间的内存是不隔离的。进程有可能修改其他进程在内存中地址。
为什么是4G

32位机的一个指针是四个字节，可以分配4G个虚拟地址空间。每个页的大小是4k。那么可以分成1M个页。地址中的前20位用来表示页号。后面的10位可以用来表示偏移的地址。使用页表将一个页对应到物理地址中的同样大小的框。


虚拟地址转物理地址：使用虚拟地址的页号找到对应的物理地址的起始地址。然后利用偏移找出对应的物理地址。


一个4g虚拟地址空间对应的包含1M个大小为4k的页，如果每个页号在页表中占1B,那么总共占用1MB.


![150c334ae4c7d6391d01804fceaa54bd](/clang/01CBF822-7C7C-4018-BD73-255539652433.png)



































