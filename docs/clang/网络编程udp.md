
#### udp编程模型

![3c86bb5595df53a1f6e51f87de6bf9ab](/clang/udp编程模型.png)


服务器端:

1. 创建一个通讯设置socket,返回socket对应的文件描述符。
2. 绑定地址空间到socket.
3. while(1){
    4. 等待接受客户端发来的消息 recvfrom(2)
    5. 处理客户端发来的消息
    6. 向客户端返回消息 sendto(2)
}

客户端：

1. 创建一个通讯设置socket,返回socket对应的文件描述符。
2. 向服务器端发送消息
3. 等待服务器端返回消息
4. 将服务器端的消息处理
5. 关闭客户端socket.

1.recvfrom
```
#include <sys/types.h>
#include <sys/socket.h>

ssize_t recvfrom(int sockfd, void *buf, size_t len, int flags,struct sockaddr *src_addr, socklen_t *addrlen);

* 描述

从socket上接受消息
The  recv(),  recvfrom(), and recvmsg() calls are used to receive messages from a socket.  They may be used to receive data on both connectionless and connection-oriented sockets.

* 参数
1. sockfd：指定获取消息的socket,
2. buf 
3.len
places the received message into the buffer buf.  The caller must specify the size of the buffer in len.

4. flags: 0

5.src_addr 当不为NULL时，用来接受消息的源地址到src_addr指向的buffer中，addrlen用来保存保存地址buffer的大小。

If the caller is not interested in the source address, src_addr and addrlen should be specified as NULL.

* 返回值

These calls return the number of bytes received, or -1 if an error occurred.  In the event of an error, errno is set to indicate the error.


```

2.sendto

```
#include <sys/types.h>
#include <sys/socket.h>


ssize_t sendto(int sockfd, const void *buf, size_t len, int flags,const struct sockaddr *dest_addr, socklen_t addrlen);

* 描述

The system calls sendto() are used to transmit a message to another socket.

* 参数
1. sockfd
发出消息的socket

2. buf

保存消息内容的buf

3. len 发送消息的长度

4. flag:0

5.dest_addr

接受消息的socket的地址空间

6.addrlen

dest_addr指向的结构体的大小

* 返回值

On success, these calls return the number of bytes sent.  On error,  -1 is returned, and errno is set appropriately.
```

#### 信号

什么是信号？

信号是软中断，软件实现的终端机制。进程收到信号时，交给我信号中断程序去处理，不会影响主程序的执行。

系统提供了多少个信号

```shell
kill -l


1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
63) SIGRTMAX-1	64) SIGRTMAX
```

man 7 signal可以查看信号的具体信息

```
 Signal      Standard   Action   Comment
────────────────────────────────────────────────────────────────────────
SIGABRT      P1990      Core    Abort signal from abort(3)
SIGALRM      P1990      Term    Timer signal from alarm(2)
SIGBUS       P2001      Core    Bus error (bad memory access)
SIGCHLD      P1990      Ign     Child stopped or terminated
SIGCLD         -        Ign     A synonym for SIGCHLD
SIGCONT      P1990      Cont    Continue if stopped
SIGEMT         -        Term    Emulator trap
SIGFPE       P1990      Core    Floating-point exception
SIGHUP       P1990      Term    Hangup detected on controlling terminal
                               or death of controlling process
SIGILL       P1990      Core    Illegal Instruction
SIGINFO        -                A synonym for SIGPWR
SIGINT       P1990      Term    Interrupt from keyboard
SIGIO          -        Term    I/O now possible (4.2BSD)
SIGIOT         -        Core    IOT trap. A synonym for SIGABRT
SIGKILL      P1990      Term    Kill signal
SIGLOST        -        Term    File lock lost (unused)
SIGPIPE      P1990      Term    Broken pipe: write to pipe with no
                               readers; see pipe(7)
SIGPOLL      P2001      Term    Pollable event (Sys V).
                                   Synonym for SIGIO
SIGPROF      P2001      Term    Profiling timer expired
SIGPWR         -        Term    Power failure (System V)
SIGQUIT      P1990      Core    Quit from keyboard
SIGSEGV      P1990      Core    Invalid memory reference
SIGSTKFLT      -        Term    Stack fault on coprocessor (unused)
SIGSTOP      P1990      Stop    Stop process
SIGTSTP      P1990      Stop    Stop typed at terminal
SIGSYS       P2001      Core    Bad system call (SVr4);
                               see also seccomp(2)
SIGTERM      P1990      Term    Termination signal
SIGTRAP      P2001      Core    Trace/breakpoint trap
SIGTTIN      P1990      Stop    Terminal input for background process
SIGTTOU      P1990      Stop    Terminal output for background process

SIGUNUSED      -        Core    Synonymous with SIGSYS
SIGURG       P2001      Ign     Urgent condition on socket (4.2BSD)
SIGUSR1      P1990      Term    User-defined signal 1
SIGUSR2      P1990      Term    User-defined signal 2
SIGVTALRM    P2001      Term    Virtual alarm clock (4.2BSD)
SIGXCPU      P2001      Core    CPU time limit exceeded (4.2BSD);
                               see setrlimit(2)
SIGXFSZ      P2001      Core    File size limit exceeded (4.2BSD);
                               see setrlimit(2)
SIGWINCH       -        Ign     Window resize signal (4.3BSD, Sun)

```

其中32和33没有实现。

#### 信号的生命周期

1. 信号产生
2. 信号没进程阻塞(进程可以设置不接收那些信号)
3. 信号抵达进程
3. 信号处理程序

信号未决状态：产生了信号，但是信号还没有被处理的状态。

#### 向进程注册信号处理程序

进程默认会从父进程继承信号处理程序。从bash启动的程序时bash进程的子进程，或继承bash的信号处理程序，大部分信号默认程序是终止进程。此外我们还可以重新注册指定信号的处理程序，所以对一个信号会有三种不同的处理方式。

1. 默认继承的处理程序
2. 注册处理程序忽略对该信号的处理
3. 注册自己的信号处理程序

向进程注册信号处理程序signal(2)

```
#include <signal.h>
typedef void (*sighandler_t)(int);
sighandler_t signal(int signum, sighandler_t handler);

* 描述

signal() sets the disposition of the signal signum to handler, which is either SIG_IGN, SIG_DFL, or the address of a programmer-defined function (a "signal handler").

* 参数

1. signnum:信号值

2. handler： 信号处理程序

 *  If the disposition is set to SIG_IGN, then the signal is ignored.

 *  If the disposition is set to SIG_DFL, then the default action associated with the signal (see signal(7)) occurs.

 *  If  the disposition is set to a function, then first either the disposition is reset to SIG_DFL, or the signal is blocked (see Portability below), and then handler is called with argument
signum. If invocation of the handler caused the signal to be blocked, then the signal is unblocked upon return from the handler.

The signals SIGKILL and SIGSTOP cannot be caught or ignored.

* 返回值

signal() returns the previous value of the signal handler, or SIG_ERR on error.  In the event of an error, errno is set to indicate the cause.
```


代码参见：
signal/signal.c

```c
#include <signal.h>
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
void doit(int signal_num){
        printf("signal=%d\n",signal_num);
}


int main(){
        signal(2,doit);
        // The signals SIGKILL and SIGSTOP cannot be caught or ignored. 
        signal(9,doit);

        pid_t  pid = fork();

        if(pid == -1){
                perror("fork");
                return -1;
        }
        if(pid == 0){
                //  kill -2 pid in shell
                printf("pid=%d\n",getpid());
                while(1){
                }
        }else{

                wait(NULL);
        }

        return 0;
}
```
在终端向子进程发送信号

```shell
kill -2 pid
kill -9 pid
```

当子进程接受到信号值为2的信号，会触发从父进程继承的信号处理函数，当子进程接受到信号值为9的信号，从父进程继承的信号处理函数出被忽略。所以子进程结束，接着wait执行，父进程结束。


#### 向进程发送信号
1. 通过硬件的方式：control+c(2),control+/(3)
2. 通过终端：kill -signal_num pid
3. 通过系统调用或者库函数的方式

kill(2)
```
#include <sys/types.h>
#include <signal.h>

int kill(pid_t pid, int sig);

* 描述

The kill() system call can be used to send any signal to any process group or process.
If pid is positive, then signal sig is sent to the process with the ID specified by pid.


* 参数

1. pid
为正数时，向该进程发送信号
2.sig

发送的信号值

* 返回值

On success (at least one signal was sent), zero is returned.  On error, -1 is returned, and errno is set appropriately.

```

实现一个类似kill -9 pid的命令tkill 9 pid.代码参见net/siganl/tkill.c

```c
#include <stdlib.h>
#include <sys/types.h>
#include <signal.h>
#include <stdio.h>
int main(int argc,char *argv[]){
        int signal_num = atoi(argv[1]);
        int pid = atoi(argv[2]);

        int res = kill(pid,signal_num);
        if(res ==-1){
                perror("kill");
                return -1;
        }
        //向自己发送信号
        //kill(getpid(),signal_num); 
        return 0;
}

```

raise(3)

```

 #include <signal.h>

 int raise(int sig);
 
 * 描述
The raise() function sends a signal to the calling process or thread.
In a single-threaded program it is equivalent to kill(getpid(), sig);

In a multithreaded program it is equivalent to

pthread_kill(pthread_self(), sig);

If the signal causes a handler to be called, raise() will return only after the signal handler has returned.

* 参数
sig: 发送的信号值

* 返回值

raise() returns 0 on success, and nonzero for failure.

```


alarm(2)


```
#include <unistd.h>

unsigned int alarm(unsigned int seconds);


* 描述

alarm()  arranges for a SIGALRM signal to be delivered（派送） to the calling
process in seconds seconds.

If seconds is zero, any pending alarm（未决闹钟） is canceled.

In any event any previously set alarm() is canceled.


* 参数

seconds： 指定多少秒内发送

* 返回值


alarm() returns the number of seconds remaining until any  previously
scheduled alarm was due to be delivered, or zero if there was no previously scheduled alarm.

返回之前的未决闹钟剩余的触发时间，之前没有设置返回0；

```
检测机器一秒中可以输入多少次 alarm.c
```c

#include <unistd.h>
#include <stdio.h>
int main(){
        //  1秒后向当前进程发送SIGALRM signal，然后进程处理会终止当前进程。
        alarm(1);
        int i= 1;
        while(i>0){
                printf("%d\n",i++);
        }
        return 0;
}
```

取消之前设置的闹钟

```c
#include <unistd.h>
#include <stdio.h>
int main(){
        //  1秒后向当前进程发送SIGALRM signal，然后进程处理会终止当前进程。
        alarm(6);
        int i= 1;
        while(i<320000){
                printf("%d\n",i++);
        }
        // 取消之前的alerm
        int r =alarm(0);
        printf("r=%d\n",r);
        return 0;
}
```
r会返回之前设置闹钟的剩余时间。


pause(2)     等待一个信号

```
#include <unistd.h>

int pause(void);

* 描述
pause()  causes the calling process (or thread) to sleep until a signal is delivered that either terminates the process or causes the invocation of a signal-catching function.

等待一个造成进程终止或者信号处理函数被执行的信号

* 参数
void

* 返回值

pause() returns only when a signal was caught and the signal-catching function returned.  In this case, pause() returns -1,  and  errno  is set to EINTR.

信号被捕获或者处理后pause返回。

```

代码参见：pause.c

```c
#include <unistd.h>
#include <stdio.h>
#include <signal.h>
void handle(int sid){

        printf("sid=%d\n",sid);
}
int main(){
        // 为了让进程不直接终止，查看pause的返回值
        signal(2,handle);
        int res = pause();
        printf("return value =%d\n",res);
        return 0;

}

```

处理并发最常用的技术是多路复用，科技在unix/c网络编程中找到。

使用pause(2)和alarm(2)实现sleep(3)的功能
```
#include <unistd.h>

unsigned int sleep(unsigned int seconds);

使用需要的时间用完返回0；如果被一个信号被信号处理函数处理且不会造成信号中断，那么返回剩余的时间。

```
思想：1首先就是要处理这个alarmh函数发送来的信号，让程序不要被终止
     2.先调用alarmz在调用pause,
     3. 时间用完了返回0，信号不会总段程序的时候返回剩余睡眠时间，所以用return alarm(0)来返回。
```c
#include <signal.h>
#include <unistd.h>
#include <stdio.h>

void doit(int signal_id){
}
unsigned int tsleep(unsigned int second){
        // 闹钟信号处理函数不会打断进程
        signal(SIGALRM,doit);
        alarm(second);
        pause();
        //  取消之前的闹钟并返回剩余的时间
        return alarm(0);

}


int main(){

        while(1){
                tsleep(2);
                printf("hello\n");
        }

        return 0;

}
```











