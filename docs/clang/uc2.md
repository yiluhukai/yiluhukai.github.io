### uc2

segment/segment.c 产生端错误

### 哈弗结构和冯诺依曼结构

哈弗结构得指令和数据是分开的。
冯诺依曼结构的指令和数据是不分开的。所以只能线性执行，效率比较低，而哈弗结构在读取数据执行的同时可以去缓存下一条指令。

CS 寄存器中保存的是程序的代码段（segment）在内存中的的首地址(虚拟地址)。
DS 寄存器保存的程序数据段在内存中的开始地址。
SS 寄存器保存的是程序在栈段在内存中的首地址。

```shell
gcc -S file.c -o file.s
vim file.s
```
可以看到

![80473776b0368443a04b835bef6cba79](/clang/DB01BEC0-69FF-4589-8FB0-DD9BF525A5AC.png)

位于.section  .rodata和text之间的就是数据section
![47e36789ba94c95cff6b5ab8968275c6](/clang/F1BB67D4-8B96-4F45-903B-2D24C60A9288.png)
位于text和section .note gnu-stack  之间的是代码section

gnu-stack下面的是栈section


当我们在链接时，会把不同的目标文件的数据section和并到一块。形成数据segment。指令section和栈section也会合并成对应的代码segment和栈segment.当我们执行这个可执行文件的时候，cpu的ss、ds、cs寄存器器会指向程序在内存中不同的段的开始地址。


代码段 只读 可执行

数据段 读写 不可执行

栈段


### 查看进程的内存中的段地址

#include <sys/types.h>
#include <unistd.h>

getpid(2) 
pid_t getpid(void); returns the process ID of the calling process.

pid_t是int的别名。可以通过下面的方法去查看

文件中包含这两个头文件，然后执行预处理指令操作。完成之后用vim代开对应*.i文件。
然后 /pid_t去查找。

memory_04/memory.c

```c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>

int main(void){
        char*  str1 = "hello world";
        char*  str2 = "hello world";
        char arr[]  = "hello world";
        printf("pid = %d\n",getpid());
        // str1的空间分配在哪里
        printf("str1 address =%p\n",&str1);
        // str1的内容在什么位置
        printf("str1 content =%p\n",str1);
        // str1和str2的内容是否相同
        printf("str2 content =%p\n",str2);
        printf("arr content =%p\n",arr);
        getchar();
        return 0;
}
```
运行上面的文件，结果如下：

![d6a5fa42325d4c9b605c4054667fac03](/clang/2B82A5B3-AF1C-4E31-806A-11825A27A891.png)

运行对应的指令去查看进程内存地址

![f0c6398723e511ac2b2f46b505aafd12](/clang/18939E10-47ED-4CB6-AAE8-6678B02CEE88.png)


其中第一个a.out的执行权限是可读可执行的是代码段，我们对比可以发现str1和str2的内容相同且在代码段。而str1、str2内存空间在栈段（stack）.而arr的内容在栈段，当我们用hello wolrd初始化字符数组时，其实并没有把数组名这个字符指针指向代码段的hello wolrd.而是在栈段开辟内存空间，然后把这个"hello wolrd"这个字符串copy到了这个空间里。

![660eb6c1db39024664ff5baf5a1e9b95](/clang/memory.png)

```c

char arr[];
arr = "hello wolrd";
```

这个语句会报错，是因为arr时一个常指针，不能将他指向代码段的内存空间。

```c
char arr[];
strcpy(arr,"hello wolrd");
```

### 栈段的内容

栈段是由栈帧组成的，每个函数对应这一个栈帧，当调用一个函数的，会将一些变量的数据保存在栈帧中，函数调用结束，会将这个栈帧出栈，保存的变量信息会被销毁。这种变量的生命周期是由函数的生命周期决定的。这种变量包含auto局部变量和函数的形参。

```c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>

void count(){
        int i = 1;
        printf("%d\t%p\n",++i,&i);
}

int main(){
        printf("PID:%d\n",getpid());
        int j =0;
        for(j;j<5;j++){
                count();
        }
        getchar();
        return 0;
}

```

执行结果
```
PID:7428
2	0x7fff3969590c
2	0x7fff3969590c
2	0x7fff3969590c
2	0x7fff3969590c
2	0x7fff3969590c
```
查看当前进程的内存信息 cat /proc/7428/maps

```
559220448000-559220449000 r-xp 00000000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
559220648000-559220649000 r--p 00000000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
559220649000-55922064a000 rw-p 00001000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
559222570000-559222591000 rw-p 00000000 00:00 0                          [heap]
7f035b127000-7f035b2bc000 r-xp 00000000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f035b2bc000-7f035b4bc000 ---p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f035b4bc000-7f035b4c0000 r--p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f035b4c0000-7f035b4c2000 rw-p 00199000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f035b4c2000-7f035b4c6000 rw-p 00000000 00:00 0 
7f035b4c6000-7f035b4e9000 r-xp 00000000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f035b6cc000-7f035b6ce000 rw-p 00000000 00:00 0 
7f035b6e9000-7f035b6ea000 r--p 00023000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f035b6ea000-7f035b6eb000 rw-p 00024000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f035b6eb000-7f035b6ec000 rw-p 00000000 00:00 0 
7fff39677000-7fff39698000 rw-p 00000000 00:00 0                          [stack]
7fff396bf000-7fff396c1000 r--p 00000000 00:00 0                          [vvar]
7fff396c1000-7fff396c3000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
```
我们可以看到变量的内存地址是位于栈段中的。


当我们将上面的变量i改成static类型的。

```c

#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>

void count(){
        static int i = 1;
        printf("%d\t%p\n",++i,&i);
}

int main(){
        printf("PID:%d\n",getpid());
        int j =0;
        for(j;j<5;j++){
                count();
        }
        getchar();
        return 0;
}
```
```
PID:7438
2	0x55ffec246040
3	0x55ffec246040
4	0x55ffec246040
5	0x55ffec246040
6	0x55ffec246040
```
内存使用
```
55ffec045000-55ffec046000 r-xp 00000000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
55ffec245000-55ffec246000 r--p 00000000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
55ffec246000-55ffec247000 rw-p 00001000 08:01 1574689                    /home/yiluhuakai/C-/uc/memory_04/a.out
55ffecb8b000-55ffecbac000 rw-p 00000000 00:00 0                          [heap]
7f583042d000-7f58305c2000 r-xp 00000000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f58305c2000-7f58307c2000 ---p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f58307c2000-7f58307c6000 r--p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f58307c6000-7f58307c8000 rw-p 00199000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f58307c8000-7f58307cc000 rw-p 00000000 00:00 0 
7f58307cc000-7f58307ef000 r-xp 00000000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f58309d2000-7f58309d4000 rw-p 00000000 00:00 0 
7f58309ef000-7f58309f0000 r--p 00023000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f58309f0000-7f58309f1000 rw-p 00024000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f58309f1000-7f58309f2000 rw-p 00000000 00:00 0 
7ffdfb243000-7ffdfb264000 rw-p 00000000 00:00 0                          [stack]
7ffdfb3f7000-7ffdfb3f9000 r--p 00000000 00:00 0                          [vvar]
7ffdfb3f9000-7ffdfb3fb000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
```

我们看出static变量是分配在数据段上，他的生命周期和进程的生命周期相同。每次执行函数，会在数据段上查找是否存在变量i,找到则不会初始化，直接使用这个变量去运算。所以结果是递增的。


```c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
const int var_g = 100;
int var_global =1000;
void count(){
        static int i = 1;
        printf("%d\t%p\n",++i,&i);
}

int main(){
        printf("var_g address=%p\n",&var_g);
        printf("var_global address=%p\n",&var_global);

        const int s = 20;
        int * const  p = &s;
        *p =100;
        printf("s =%d\n",s);
        printf("s address %p\n",&s);
        printf("PID:%d\n",getpid());
        getchar();
        return 0;
}
```
结果：
```
ar_g address=0x55b4464108a4
var_global address=0x55b446611040
s =100
s address 0x7fffdb355184
PID:7872
```

内存分布：

```
55b446410000-55b446411000 r-xp 00000000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55b446610000-55b446611000 r--p 00000000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55b446611000-55b446612000 rw-p 00001000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55b446830000-55b446851000 rw-p 00000000 00:00 0                          [heap]
7fbc32d46000-7fbc32edb000 r-xp 00000000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7fbc32edb000-7fbc330db000 ---p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7fbc330db000-7fbc330df000 r--p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7fbc330df000-7fbc330e1000 rw-p 00199000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7fbc330e1000-7fbc330e5000 rw-p 00000000 00:00 0 
7fbc330e5000-7fbc33108000 r-xp 00000000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7fbc332eb000-7fbc332ed000 rw-p 00000000 00:00 0 
7fbc33308000-7fbc33309000 r--p 00023000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7fbc33309000-7fbc3330a000 rw-p 00024000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7fbc3330a000-7fbc3330b000 rw-p 00000000 00:00 0 
7fffdb336000-7fffdb357000 rw-p 00000000 00:00 0                          [stack]
7fffdb3ee000-7fffdb3f0000 r--p 00000000 00:00 0                          [vvar]
7fffdb3f0000-7fffdb3f2000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
```

全局变量var_global是位于数据段的，生命周期和当前进程一致。全局常量var_g位于代码段，只读。局部常量位于stack段，通过变量名称去访问时是只读的，但是我们可以使用指针指向这片内存，然后去修改数据，因为stack段是可读写的。



```c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>


int main(void){
        int* mp =(int *) malloc(sizeof(int)*10);
        //在堆上分配内存空间
        printf("PID = %d\n",getpid());
        //打印内存地址
        printf("mp point address =%p\n",mp);

        free(mp);
        printf("map oint address =%p\n",mp);
        getchar();
        return 0;
}
```

结果
```
PID = 8115
mp point address =0x55a7b30e9010
map oint address =0x55a7b30e9010
```

内存分配

```
55a7b112f000-55a7b1130000 r-xp 00000000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55a7b132f000-55a7b1330000 r--p 00000000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55a7b1330000-55a7b1331000 rw-p 00001000 08:01 1574511                    /home/yiluhuakai/C-/uc/memory_04/a.out
55a7b30e9000-55a7b310a000 rw-p 00000000 00:00 0                          [heap]
7f2c2ea51000-7f2c2ebe6000 r-xp 00000000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f2c2ebe6000-7f2c2ede6000 ---p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f2c2ede6000-7f2c2edea000 r--p 00195000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f2c2edea000-7f2c2edec000 rw-p 00199000 08:01 262152                     /lib/x86_64-linux-gnu/libc-2.24.so
7f2c2edec000-7f2c2edf0000 rw-p 00000000 00:00 0 
7f2c2edf0000-7f2c2ee13000 r-xp 00000000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f2c2eff6000-7f2c2eff8000 rw-p 00000000 00:00 0 
7f2c2f013000-7f2c2f014000 r--p 00023000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f2c2f014000-7f2c2f015000 rw-p 00024000 08:01 262147                     /lib/x86_64-linux-gnu/ld-2.24.so
7f2c2f015000-7f2c2f016000 rw-p 00000000 00:00 0 
7ffdd63cf000-7ffdd63f0000 rw-p 00000000 00:00 0                          [stack]
7ffdd63f3000-7ffdd63f5000 r--p 00000000 00:00 0                          [vvar]
7ffdd63f5000-7ffdd63f7000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
```

我们可以看到使用malloc分配的内存在heap上。当我们呢调用free函数释放后，该片内存可以被其他资源占用。但是指针还是指向该片内存，所以我们要把指针指向NULL.


### 每个进程都会分配独立的4G内存空间。

![98b7063b9314aed18afbda54ad70ff88](/clang/FF5F7E1A-71CA-4186-85D9-4851468BB615.png)



### 将物理地址（物理内存）映射到虚拟地址（虚拟内存）

1.将物理地址映射到内存中
```
#include <sys/mman.h>
void *
     mmap(void *addr, size_t len, int prot, int flags, int fd, off_t offset);
```
函数的功能： allocate memory, or map files or devices into memory。分配或映射文件或设备到虚拟地址。

函数的参数：

addr 指定映射的开始地址,当为NULL时由系统指定。
len  映射中page的长度,不足一页安一页的大小算。
prot 指定映射地址的访问权限

 PROT_NONE   Pages may not be accessed.
 PROT_READ   Pages may be read.
 PROT_WRITE  Pages may be written.
 PROT_EXEC   Pages may be executed.

flag  指定映射地址的修改对其他进程是否可见和映射的类型


MAP_PRIVATE       Modifications are private (copy-on-write).
对虚拟地址的更新对其他进程不可见，且不会同步到底层物理地址。

MAP_SHARED        Modifications are shared.
进程间可见，且会同步到底层的物理空间中。

MAP_ANON （匿名映射:不可以和MAP_SHARED或，且fd和offset被忽略。
此时fd一般被设置为-1，offset一般是页大小的（4k）的整数倍，可以为0.
匿名映射指的是映射到虚拟地址物理地址是匿名的，不与任何文件关联。

参数fd：要映射到内存中的文件描述符。如果使用匿名内存映射时，即flags中设置了MAP_ANONYMOUS，fd设为-1。

参数offset：文件映射的偏移量，通常设置为0，代表从文件最前方开始对应，offset必须是分页大小的整数倍。

返回值：
Upon successful completion, mmap() returns a pointer to the mapped region.  Otherwise, a value of MAP_FAILED is returned
and errno is set to indicate the error.

2.取消映射
```
#include <sys/mman.h>
int munmap(void *addr, size_t len);
```


### 文件操作的函数

1.open

fopen、fclose等库函数都是对系统函数(open(2) 、close(2))的封装.
```
 #include <fcntl.h>
 int open(const char *path, int oflag, ...);
```


功能：open or create a file for reading or writing

参数：

* path代表文件的路径

* oflag代表文件指定文件的访问权限。可以是下面的值。

```
 O_RDONLY        open for reading only
 O_WRONLY        open for writing only
 O_RDWR          open for reading and writing
```
同时可以文件的创建或者状态标记安位或。
```
O_APPEND        append on each write
O_CREAT         create file if it does not exist and need third arguement mode（mode of user）.

O_TRUNC         truncate size to 0 if file exist
O_EXCL          error if O_CREAT and the file exists，
和O_CREAT一块使用的时候且文件存在会报错，文件不存在，创建新的文件。
```

* ... 可变参数

该函数中用来指定当创建一个新的文件时指定执行文件的权限（mode）

mode.
 linux文件包括所有者，所在组和其他组用户对文件的权限。
 rwx-rwx-rwx.
 指定文件的权限：

 ```shell
u代表所有者，g代表所有组，o代表其他组，a代表所有人
    eg：设置权限
    chmod u=rw,g=w,o=wx 文件或者目录
    eg:chomd u+r 文件或者目录
    eg：chmod u-r  文件或者目录
    eg:chmod a+x 文件或者目录
 ```


 用三位二进制表示文件权限。

 111  =  rwx 

 100 = r__


 ```shell
r=4，w=2,x=1 rwx=7
    eg:chomd u=rwx,g=rw,a=x aa.txt
    等价于：
    chmod 761 aa.txt
 ```
rwx中xxx会构成一组新的权限，权限的值可以位01234567.

默认为0，我们可以通过chmod 1644中的第一个数去指定,ls -ahl可以看到其他组权限变成了S.


















