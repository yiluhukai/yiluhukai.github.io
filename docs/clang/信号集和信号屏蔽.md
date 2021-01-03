#### 信号阻塞

通常我们发送一个信号给进程，当进程收到这个信号时，使用注册的信号处理函数来对信号进行处理，但是我们还可以设置进程对某些信号进行阻塞。如何设置进程对某些信号阻塞？
sigprocmask（2）
![f82ca643998b67c825f80e2c03af3fd6](/clang/block——mask.png)

```c
typedef struct
{
  unsigned long int __val[(1024 / (8 * sizeof (unsigned long int)))];
} __sigset_t;

typedef __sigset_t sigset_t;

```
进程对不同信号的阻塞掩码保存在sigset_t类型中，我们可以通过sigsetops(3)来查看对该类型的操作。

```
#include <signal.h>

int sigemptyset(sigset_t *set);

* 描述
initializes the signal set given by set to empty, with all signals excluded from the set.
初始化一个信号集，将信号集设置为空
* 参数
set:一个信号集的地址
* 返回值
return 0 on success and -1 on error.


int sigfillset(sigset_t *set);
* 描述
sigfillset() initializes set to full, including all signals.
* 参数
set:一个信号集的地址
* 返回值
return 0 on success and -1 on error.


int sigaddset(sigset_t *set, int signum);
* 描述
add  respectively signal signum from set.
* 参数
set:一个信号集的地址
signum:信号值
* 返回值
return 0 on success and -1 on error.


int sigdelset(sigset_t *set, int signum);
* 描述
delete  respectively signal signum from set.
* 参数
set:一个信号集的地址
signum:信号值
* 返回值
return 0 on success and -1 on error.

int sigismember(const sigset_t *set, int signum);
* 描述
tests whether signum is a member of set.
* 参数
set:一个信号集的地址
signum:信号值
* 返回值
sigismember() returns 1 if signum is a member of set, 0 if signum is not a member, and -1 on error.
```

设置进程对某些信号阻塞，注意：9号信号不可以阻塞
```
#include <signal.h>

/* Prototype for the glibc wrapper function */
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);

* 描述
sigprocmask()  is  used to fetch and/or change the signal mask of the calling thread.  The signal mask is the set of signals whose delivery is currently blocked for the caller
* 参数
1. how
SIG_BLOCK
The set of blocked signals is the union of the current set and the set argument.
当前的set和参数set的与运算的结果

SIG_UNBLOCK
The signals in set are removed from the current set of blocked signals.  It is permissible to attempt to unblock a signal which is not blocked.
将set集合中的信号从当前信号集中移除

SIG_SETMASK
The set of blocked signals is set to the argument set.
用参数set作为当前的阻塞掩码
2. set 
3. oldset

If oldset is non-NULL, the previous value of the signal mask is stored in oldset.
If set is NULL, then the signal mask is unchanged (i.e., how is ignored), but the current value of the signal mask is nevertheless returned in oldset (if it is not NULL).
* 返回值
sigprocmask() returns 0 on success and -1 on error.  In the event of an error, errno is set to indicate the cause.

```

代码参见:
对2号信号进行阻塞
```c
#include <stdio.h>
#include <signal.h>
int main(){
        sigset_t set;

        //初始化set
        sigemptyset(&set);
        // 添加2号信号到set
        sigaddset(&set,2);
        int res = sigprocmask(SIG_BLOCK,&set,NULL);
        if(res == -1){
                perror("sigprocmask");
                return -1;
        }
        // 对进程发送2号信号，不会有任何反映
        while(1){
        }
        // 设置对2号信号阻塞，这样子进程不会对2号信号处理
        return 0;
}
```

#### 可靠信号和不可靠信号

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
void doit(int sig_num){
        printf("sig_num=%d,receive ok\n",sig_num);
}
int main(){
        // 设置信号处理函数
        signal(2,doit);
        signal(45,doit);
        signal(9,doit);
        sigset_t set,old_set;
        //初始化set
        sigemptyset(&set);
        // 添加2号信号到set
        sigaddset(&set,2);
        sigaddset(&set,45);
        //  9号信号不可以被阻塞
        sigaddset(&set,9);
        int res = sigprocmask(SIG_BLOCK,&set,&old_set);
        if(res == -1){
                perror("sigprocmask");
                return -1;
        }
        sleep(20);
        // 用原来的set来设置
        res = sigprocmask(SIG_SETMASK,&old_set,NULL);
        if(res == -1){
                perror("sigprocmask");
                return -1;
        }
        //解除对2，45信号的阻塞,会从未决信号中取出信号，然后执行对应的信号处理函数

        return 0;
}

```


```shell
bruce@bruce-VirtualBox:~$ ps aux|grep a.out 
bruce      13498  0.0  0.0   2356   584 pts/2    S+   12:28   0:00 ./a.out
bruce      13500  0.0  0.0  17668   724 pts/1    S+   12:28   0:00 grep --color=auto a.out
bruce@bruce-VirtualBox:~$ kill -45 13498
bruce@bruce-VirtualBox:~$ kill -45 13498
bruce@bruce-VirtualBox:~$ kill -45 13498
bruce@bruce-VirtualBox:~$ kill -2 13498
bruce@bruce-VirtualBox:~$ kill -2 13498
bruce@bruce-VirtualBox:~$ kill -2 13498
```

执行的结果

```shell
bruce@bruce-VirtualBox:~/C-/uc/net/signal$ ./a.out 
sig_num=45,receive ok
sig_num=45,receive ok
sig_num=45,receive ok
sig_num=2,receive ok
```

可以看出来，2号信号有丢失，而45号信号没有丢失，像这种发送几次最后执行几次的信号我们称之为可靠信号（34～64），而发送多次执行一次的称为不可靠信号（1~31）。



#### 获取未决信号掩码集
信号未决状态：产生了信号，但是信号还没有被处理的状态。


```
#include <signal.h>

int sigpending(sigset_t *set);


* 描述
sigpending() returns the set of signals that are pending  for  delivery  to  the  calling thread (i.e., the signals which have been raised while blocked).  The mask of pending signals is returned in set.

* 参数

1.set

保存未决信号的掩码集


* 返回值

sigpending()  returns  0 on success and -1 on error.  In the event of an error, errno is set to indicate the cause.
```

代码参见:pending_set.c

要看到未决信号，需要阻塞一个信号，然后想这个进程发送信号。

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
void doit(int sig_num){
        printf("sig_num=%d,receive ok\n",sig_num);
}
int main(){
        // 设置信号处理函数
        signal(2,doit);
        signal(45,doit);
        signal(9,doit);
        sigset_t set,old_set,pending_set;
        //初始化set
        sigemptyset(&set);
        // 添加2号信号到set
        sigaddset(&set,2);
        sigaddset(&set,45);
        //  9号信号不可以被阻塞
        sigaddset(&set,9);
        int res = sigprocmask(SIG_BLOCK,&set,&old_set);
        if(res == -1){
                perror("sigprocmask");
                return -1;
        }

        while(1){
                // 当受到被阻塞的信号后，放入未觉队列中
                //  获取未决信号集
                sigpending(&pending_set);

                // 假如发送的是2号型号，检测2号信号是不是未决信号，
                // 可以判断其是不是set的成员
                int r= sigismember(&pending_set,2);
                if(r==1){
                        printf("2号信号在未决队列中\n");
                }
                sleep(2);
        }
        return 0;
}
```


#### 信号从产生到处理的过程

ctrl+c发送2号信号到进程为例。

```
1. 从bash启动一个进程，进程运行
2. 按下ctrl+c产生一个硬件中断。
3. 进程从用户态切换到内核态，由按键驱动程序将案件解释为2号信号。记录到进程的pcb中。
4. 进程用内核态切换到用户态，发现pcb中有信号到达，调用信号处理函数，处理完毕调用sigreturn(2)返回到内核态，并清理信号处理函数的栈帧。然后重复第四部到所以的信号被处理完毕。
```

