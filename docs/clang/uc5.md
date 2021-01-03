### uc5

#### 进程的终止

1.return 调用从当前函数返回，结束函数的执行，main函数调用，当前进程并没有退出。main函数返回的值可以用echo $?在shell中查看。

2.exit(3)函数

```
 #include <stdlib.h>

 void exit(int status);

```

* 描述
The exit() function causes normal process termination and the value of status & 0xFF is returned to the parent。

* 参数status

status和& 0xFF的结果被传递给父进程bash.可以通过echo $?查看。
$? 是一个特殊变量，用来获取上一个命令的退出状态，或者上一个函数的返回值。


当status是一个负数时，它在计算机中以补码的形式存在。


```
-1   1000 ... 0000  0001
     1111    1111  1110
     1111    1111  1111
oxFF         1111  1111 
~           1111 1111 ->255              
```
当exit(-1)返回255。

使用pstree查看当前进程的父进程。

在代码中加入getchar(),让当前进程不退出。然后新打开一个shell终端，执行pstree命令。pstree user可以查看当前用户打开的进程。

####  遗言函数

遗言函数就时进程终止的时候调用的函数。需要在当前进程中注册遗言函数。


1.遗言函数注册atexit(3)

```
#include <stdlib.h>

int atexit(void (*function)(void));

```

* 描述
The atexit() function registers the given function to be called at normal process termination, either via exit(3) or via return from the pro‐gram's main()。

* 参数
function时一个函数指针，指向遗言函数的入口地址。

* 返回值
成功返回0，失败返回一个非零的值。

* 注意事项
1. 遗言函数的执行顺序是注册的反序。
2. 注册多个相同的遗言函数，每注册一次调用一次。
3. 当调用fork创建一个子进程，子进程会继承父进程的遗言函数。当子进程调用exec函数，所有的遗言函数被移除。

2.遗言函数的注册on_exit(3)

```
#include <stdlib.h>
int on_exit(void (*function)(int , void *), void *arg);
```
* 描述
 The on_exit() function registers the given function  to  be  called  at normal  process termination, whether via exit(3) or via return from the program's main().  The function is passed the status argument given  to the last call to exit(3) and the arg argument from on_exit().

* 参数
function 遗言函数指针
arg 传递给遗言函数的第二个参数
* 返回值
成功返回0，失败返回一个非零的值。

代码参见uc/thread/on_exit.c

#### 进程资源回收


进程终止的时候，需要对其占用的计算机资源回收。

父进程负责回收子进程的资源。

回收子进程占用的资源

 ```
 #include <sys/types.h>
 #include <sys/wait.h>

 pid_t wait(int *wstatus);
 
 ```

 * 描述 
等待子进程状态改变，当进程状态改变时回收子进程所占用的资源。如果子进程没有wait函数，会变成僵尸状态。

     All  of  these  system  calls  are used to wait for state changes in a child of the calling process, and obtain information about  the  child
whose  state  has  changed. <u>A  state change is considered to be: the child terminated; the child was stopped by a signal; or the child  was resumed  by a signal.</u>  In the case of a terminated child, performing a wait allows the system to release the resources  associated  with  the child;  if  a wait is not performed, then the terminated child remains in a "zombie" state (see NOTES below).


* 参数
wstatus 子进程改变后的状态，
If  wstatus is not NULL, wait() and waitpid() store status information in the int to which it points.

* 返回值
on success, returns the process ID of the terminated child; on error, -1 is returned.


通过下面的宏可以检查返回值的status.
```
WIFEXITED(wstatus)
returns true if the child  terminated  normally,  that  is,  by calling exit(3) or _exit(2), or by returning from main().

WEXITSTATUS(wstatus)
returns  the  exit  status  of the child.  This consists of the least significant 8 bits of the status argument that the  child specified  in  a call to exit(3) or _exit(2) or as the argument
for a return statement in main().  This  macro  should  be  em‐ployed only if WIFEXITED returned true.

WIFSIGNALED(wstatus)
returns true if the child process was terminated by a signal.

WTERMSIG(wstatus)
returns  the number of the signal that caused the child process to terminate.  This macro should be employed  only  if  WIFSIG‐NALED returned true.
```


#### 想进程发送一个中断信号

```shell
kill -2|3|5 pid
```


#### 僵尸进程（zombie）


子进程终止时父进程没有回收子进程占用的资源，这时候子进程处于僵尸状态。


```c
#include <sys/wait.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
int  main(void){
        //  创建一个子进程
        int s;
        pid_t  pid = fork();

        if( pid == -1){
                perror("fork");
                return -1;
        }
        if( pid ==0){
                printf("child process....%d\n",getpid());
                // getchar();

                exit(-1);
        }else{
                // 等待子进程终止
                getchar();
                wait(&s);
                sleep(10);
                printf("parent process.....\n");

                if(WIFEXITED(s)){
                        printf("normal terminal,status = %d\n",WEXITSTATUS(s));
                }

                if(WIFSGNALED(s)){
                        printf("signal terminal,signal number =%d\n",WTERMSIG(s));
                }
        }
        return 0;
}
```

首先编译后执行a.out.子进程已经终止，父进程等待用户输入，此时子进程处于僵尸状态。

```shell
ps aux|grep a.out
bruce      24318  0.0  0.0   2488   588 pts/1    S+   21:39   0:00 ./a.out
bruce      24319  0.0  0.0      0     0 pts/1    Z+   21:39   0:00 [a.out] <defunct>
bruce      24321  0.0  0.0  17680   740 pts/0    S+   21:40   0:00 grep --color=auto a.out

```


S+ === sleep. Z+ ===zombie


然后在控制台输入字符串，父进程wait()函数去回收子进程资源,然后父进程睡眠10秒。查看进程的状态。

```shell
ps aux|grep a.out
bruce      24318  0.0  0.0   2488   588 pts/1    S+   21:39   0:00 ./a.out
bruce      24399  0.0  0.0  17680   736 pts/0    S+   21:46   0:00 grep --color=auto a.out
```

10秒后，父进程被回收（bash）

```shell
ps aux|grep a.out
bruce      24425  0.0  0.0  17680   736 pts/0    S+   21:48   0:00 grep --color=auto a.out
```

#### 孤儿进程（orphan）

孤儿进程指的是父进程已经终止了，子进程还没终止，这时候子进程会过继给1号进程。

```c
#include <sys/wait.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
int  main(void){
        //  创建一个子进程
        int s;
        pid_t  pid = fork();

        if( pid == -1){
                perror("fork");
                return -1;
        }
        if( pid ==0){
                printf("child process....%d\n",getpid());
                printf("parent process....%d\n",getppid());
                getchar();
                printf("parent process....%d\n",getppid());

        }else{
                // 等待子进程终止
                printf("parent sleep has died\n");
                sleep(1);
        }
        return 0;
}
```


```shell
bruce@bruce-VirtualBox:~/C-/uc/thread$ ./a.out 
parent sleep has died
child process....24765
parent process....24764
bruce@bruce-VirtualBox:~/C-/uc/thread$ parent process....1349
```

ubuntu高版本是过继给了1349号进程。

#### waitpid(2)

```
#include <sys/types.h>
#include <sys/wait.h>

pid_t wait(int *wstatus);
pid_t waitpid(pid_t pid, int *wstatus, int options);
```

* 描述
等待指定pid的子进程终止。

* 参数

1.pid

```
< -1   meaning  wait  for  any  child process whose process group ID is equal to the absolute value of pid.

-1     meaning wait for any child process.

0      meaning wait for any child process whose  process  group  ID  is equal  to that of the calling process at the time of the call to waitpid().

> 0    meaning wait for the child whose process  ID  is  equal  to  the value of pid.
```

父进程和子进程组属于同一个进程组。


2. wstatus 

保存子进程传过来的状态

3. option

The  value  of  options  is an OR of zero or more of the following con‐stants:

0 阻塞知道子进程退出

WNOHANG     return immediately if no child has exited.

。。。。其他的不掌握

so waitpid(-1,&s,0) === wait(&s)

* 返回值

on success, returns the process ID of the child whose state has changed; if WNOHANG was specified and one or more child(ren) specified by pid ex‐
ist, but have not yet changed state, then 0 is returned.  On error, -1 is returned.

成功返回子进程的pid,如果非阻塞且没有子进程退出，返回0；失败了返回-1.















 












