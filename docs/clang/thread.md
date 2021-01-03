#### 线程基础

线程是执行的基本单位，而进程是资源分配的基本单位，线程共享进程的资源，一个进程中至少包含一个线程，这个线程叫做主线程，进程有自己的 pid,还有自己的 pcb,线程有自己的 tid,也有自己的 tcb.

有了进程为什么还有线程？

首先进程之间共享资源比较简单，不需要借助其他的工具，其实进程间切换的开销比较大，需要从用户态到内核态的转化，而线程之间是异步的，切换的代价较小。

#### 创建一个新的线程

```

#include <pthread.h>

int pthread_create(pthread_t *thread, const pthread_attr_t *attr,void *(*start_routine) (void *), void *arg);

Compile and link with -pthread.

使用该函数需要去编译和链接pthead库，

* 描述
The pthread_create() function starts a new thread in the calling process.  The new thread starts execution by invoking start_routine(); arg is passed as the sole argument of start_routine().


* 参数

1.thread 用来保存新创建的线程的tid.
2. attr  一般用NULL -> default attributes
The  attr  argument  points  to  a  pthread_attr_t  structure  whose contents are used at thread creation time to determine attributes for the new thread;If attr is NULL, then the thread is created with default attributes.
3. start_routine

4.arg
The new thread starts execution by invoking start_routine(); arg is passed as the sole argument of start_routine().

* 返回值

On success, pthread_create() returns 0; on error, it returns an error number, and the contents of *thread are undefined.

```

在进程中创建一个新的线程

```c
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
void *doit(void *arg){
        printf("this is %s\n",(char *)arg);
        return NULL;
}
int main(){
        //创建一个新的线程
        pthread_t  pid;
        int r = pthread_create(&pid,NULL,doit,"NEW");
        if(r!=0){
                perror("pthread_create");
                return -1;
        }
        //  在主线程中执行代码
        //  防止主线程提前退出
        sleep(3);
        doit("main");

        return 0;
}
```

```shell
bruce@bruce-VirtualBox:~/C-/uc/ptread$ gcc ptread_create.c -lpthread
bruce@bruce-VirtualBox:~/C-/uc/ptread$ ./a.out
this is NEW
this is main
bruce@bruce-VirtualBox:~/C-/uc/ptread$ ldd a.out
	linux-vdso.so.1 (0x00007ffdccfec000)
	libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007ff3cab0b000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ff3ca919000)
	/lib64/ld-linux-x86-64.so.2 (0x00007ff3cab46000)
```

获取线程的 tid

```

#include <pthread.h>

pthread_t pthread_self(void);

Compile and link with -pthread.


* 描述

获取执行线程的tid

* 返回值

This function always succeeds, returning the calling thread's ID.

```

代码参见：

```c
#include <pthread.h>
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
void *doit(void *arg){
        printf("this is %s thread,pid=%d\ttid=%lu\n",(char *)arg,getpid(),pthread_self());
        return NULL;
}
int main(){
        //创建一个新的线程
        pthread_t  pid;
        int r = pthread_create(&pid,NULL,doit,"NEW");
        if(r!=0){
                perror("pthread_create");
                return -1;
        }
        //  在主线程中执行代码
        //  防止主线程提前退出
        sleep(3);
        doit("main");

        return 0;
}
```

```shell
bruce@bruce-VirtualBox:~/C-/uc/ptread$ gcc ptread_create.c -lpthread
bruce@bruce-VirtualBox:~/C-/uc/ptread$ ./a.out
this is NEW thread,pid=16531	tid=140154763650816
this is main thread,pid=16531	tid=140154763654976
```

可以看出来线程位于同一个进程中，并且每个线程也有自己的 id.

#### 线程的终止 线程的汇合和分离

线程执行期间会占用系统资源，当线程执行结束后，要回收线程占用的资源，
有两种情况：1.等待线程执行结束后，回收线程的资源 —>线程的汇合 2.线程开始执行的时候就被分离，分离出去的线程执行结束后自动释放所占用的资源。 线程的分离

#### return 和 exit(3)的区别

在线程执行函数中用 return,只代表该线程终止，并不会终止该进程，但无论在什么地方使用 exit(),进程都会终止，进程终止了，进程中的所有线程也会终止。

1.pthread_exit(3)终止当前线程

```
#include <pthread.h>

void pthread_exit(void *retval);

Compile and link with -pthread.
* 描述
terminate calling thread，  The  pthread_exit()  function  terminates  the  calling  thread  and returns a value via retval that (if the thread is joinable) is available to another thread in the same process that calls pthread_join(3).When  a  thread terminates, process-shared resources (e.g., mutexes, condition variables, semaphores, and file descriptors) are not released, and functions registered using atexit(3) are not called. After the last thread in a process terminates, the process terminates as by calling exit(3) with an exit status of zero; thus, process-shared resources are released and functions  registered using atexit(3) are called.

终止一个线程，当线程终止后retval可以被进程的其他线程通过pthread_join(3)接受，当线程终止时，进程共享的资源不会被释放，at_exit()注册的遗言函数也不会执行，直到最后一个线程终止才会释放资源和执行遗言函数。

* 参数
retval:传递给其他的终止状态
* 返回值
void
```

2. pthread_cancel(3) 向线程发送取消请求

```
#include <pthread.h>

int pthread_cancel(pthread_t thread);

Compile and link with -pthread.

* 描述
The pthread_cancel() function sends a cancellation request to the thread thread.  Whether and when the target thread reacts to the cancellation request depends on two attributes that are under the control of that thread: its cancelability state and type.

* 参数
thread 取消线程的id

* 返回值
On success, pthread_cancel() returns 0; on error, it returns a nonzero error number.
```

3.pthread_join(3) 汇合终止线程

```
#include <pthread.h>

int pthread_join(pthread_t thread, void **retval);

Compile and link with -pthread.


* 描述
The  pthread_join()  function waits for the thread specified by thread to terminate.  If that thread has already terminated, then pthread_join() returns immediately.  The thread specified by
thread must be joinable.



If multiple threads simultaneously try to join with the same thread, the results are undefined.  If the thread calling pthread_join() is canceled, then the target thread will remain joinable
(i.e., it will not be detached).

等待线程的终止（pthread_exit(3) or pthread_cancel()）

* 参数

1.thread 取消线程的id
2.retval 接受终止线程传过来的状态

If retval is not NULL, then pthread_join() copies the exit status of the target thread (i.e., the value that the target thread supplied to pthread_exit(3)) into the location  pointed  to  by
retval.  If the target thread was canceled, then PTHREAD_CANCELED is placed in the location pointed to by retval.

* 返回值
On success, pthread_join() returns 0; on error, it returns an error number.
```

4. pthread_detach（3）分离当前线程

```
#include <pthread.h>

int pthread_detach(pthread_t thread);

Compile and link with -pthread.
* 描述
The  pthread_detach()  function marks the thread identified by thread as detached.  When a detached thread terminates, its resources are automatically released back to the system without the need for another thread to join with the terminated thread.Attempting to detach an already detached thread results in unspecified behavior.

分离一个线程，分离出去的线程可以自己释放资源，不可以多次分离一个线程

* 参数
thread  线程的id

* 返回值

On success, pthread_detach() returns 0; on error, it returns an error number
```

进程的退出和汇合

```c
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
void* func1(void* retval){
        printf("thread1 is running\n");
        sleep(2);
        return (void*)1;
}
void* func2(void* retval){
        printf("thread2 is running\n");
        sleep(3);
        pthread_exit((void*)3);
}

void* func3(void* retval){
        while(1){
                printf("thread3 is running\n");
                sleep(1);
        }
        pthread_exit(NULL);

}

int main(){
        pthread_t thread1,thread2,thread3;
        void * retval;
        pthread_create(&thread1,NULL,func1,NULL);
        // 等待目标线程的终止,是同步的执行的，所以又叫线程的同步
        pthread_join(thread1,&retval);
        printf("thread1 exit code = %d\n",(int)retval);

        pthread_create(&thread2,NULL,func2,NULL);
        // 等待目标线程的终止,是同步的执行的，所以又叫线程的同步
        pthread_join(thread2,&retval);
        printf("thread2 exit code = %d\n",(int)retval);
        //
        pthread_create(&thread3,NULL,func3,NULL);
        sleep(3);
        //  取消thread3线程
        pthread_cancel(thread3);

        pthread_join(thread3,&retval);
        printf("thread3 exit code = %d\n",(int)retval);

        printf("main thread exit\n");
        return 0;
}

```

#### 线程的同步

一个进程中创建的多个线程处于异步模式，线程的同步指的是异步的线程在访问临界资源时，变为同步访问。
临界资源：被多个线程争夺的资源。
多个线程访问临界资源，需要注意什么？
两个线程访问同一个资源的问题，代码参见：count.c

```c
#include <pthread.h>
#include <stdio.h>
int count = 0;

void* handle(void* args){
        int i;
        for(int j=0;j<5000;j++){
                i=count;
                //  count++ 在汇编成机器指令是多条指令的
                i++;
                printf("args=%s,count = %d\n",(char *)args,i);
                count = i;
        }
        return NULL;
}

int main(){
        pthread_t thread1,thread2;
        pthread_create(&thread1,NULL,handle,"thread1");
        pthread_create(&thread2,NULL,handle,"thread2");
        pthread_join(thread1,NULL);
        pthread_join(thread2,NULL);
        //printf("count=%d\n",count);
        printf("main thread exit...\n");
        return 0;
}

```

保证线程同步的方法：

1. mutex 锁

```
1. 访问临界资源前先试探是否可以加锁，不可以加锁等待或者直接返回
2. 直接加锁
3. 访问临界资源
4. 释放锁
```

2. 条件变量
3. 信号量

#### pthread_mutex_t 类型和操作

```

#include <pthread.h>

1. pthread_mutex_t fastmutex = PTHREAD_MUTEX_INITIALIZER;

Variables  of type pthread_mutex_t can also be initialized statically, using the constants PTHREAD_MUTEX_INITIALIZER (for fast mutexes)


静态初始化mutex

2. int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *mutexattr);
* 描述
pthread_mutex_init initializes the mutex object pointed to by mutex according to the mutex     attributes specified in mutexattr.  If mutexattr is NULL, default attributes are used instead.

* 参数
1. mutex  锁的地址，
2. mutexattr NULL




3. int pthread_mutex_lock(pthread_mutex_t *mutex);
* 描述
pthread_mutex_lock locks the given mutex. If the mutex is currently unlocked, it becomes locked and owned by the calling thread, and pthread_mutex_lock returns immediately. If the  mutex  is already locked by another thread, pthread_mutex_lock suspends the calling thread until the mutex is unlocked.

给mutex加锁，如果mutex已经是加锁状态，那么线程会被阻塞

* 参数 mutex的地址



4. int pthread_mutex_trylock(pthread_mutex_t *mutex);

* 描述
pthread_mutex_trylock behaves identically to pthread_mutex_lock, except that it does not block the calling thread if the mutex is already locked by another thread (or by the  calling  thread
in the case of a ``fast'' mutex). Instead, pthread_mutex_trylock returns immediately with the error code EBUSY.
给mutex加锁，如果mutex已经是加锁状态，那么线程不会被阻塞，而是返回错误码EBUSY。

* 参数

mutex mutex的地址


5. int pthread_mutex_unlock(pthread_mutex_t *mutex);

* 描述
pthread_mutex_unlock  unlocks  the  given  mutex. The mutex is assumed to be locked and owned by the calling thread on entrance to pthread_mutex_unlock.

解除mutex上的锁
* 参数
mutex mutex的地址


6. int pthread_mutex_destroy(pthread_mutex_t *mutex);

* 描述
pthread_mutex_destroy  destroys  a  mutex object, freeing the resources it might hold. The mutex must be unlocked on entrance.
* 参数
mutex mutex的地址

* 返回值

pthread_mutex_init always returns 0. The other mutex functions return 0 on success and a non-zero error code on error.

```

用 mutex 锁去解决线程同步的问题

```c
#include <pthread.h>
#include <stdio.h>
int count = 0;
// 初始化一个mutex

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
void* handle(void* args){
        int i;
        for(int j=0;j<5000;j++){
                pthread_mutex_lock(&mutex);
                i=count;
                // 在汇编成机器指令是多条指令的
                i++;
                printf("args=%s,count = %d\n",(char *)args,i);
                count = i;
                pthread_mutex_unlock(&mutex);
        }
        return NULL;
}

int main(){
        pthread_t thread1,thread2;
        pthread_create(&thread1,NULL,handle,"thread1");
        pthread_create(&thread2,NULL,handle,"thread2");
        pthread_join(thread1,NULL);
        pthread_join(thread2,NULL);
        //printf("count=%d\n",count);
        printf("main thread exit...\n");
        //  销毁一个mutex
        pthread_mutex_destroy(&mutex);
        return 0;
}
```

#### 条件变量

什么是条件变量

两个线程 a 和 b,线程 a 由于不满足某个条件而阻塞，等待条件变为真执行，线程 b 在执行的过程中会将条件变为真让线程 a 继续执行，这个条件就是条件变量类型的一个变量。

pthread_cond_t 类型的一些操作

```
#include <pthread.h>

1.pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

静态初始化一个条件变量

2.int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);

* 描述
pthread_cond_init initializes the condition variable cond, using the condition attributes specified in cond_attr, or default attributes if cond_attr is NULL.
* 参数

cond 条件变量类型的地址
cond_attr NULL

3.int pthread_cond_signal(pthread_cond_t *cond);

* 描述
pthread_cond_signal  restarts  one of the threads that are waiting on the condition variable cond. If no threads are waiting on cond, nothing happens. If several threads are waiting on cond,
exactly one is restarted, but it is not specified which.

* 参数

cond 条件变量类型的地址

4.int pthread_cond_broadcast(pthread_cond_t *cond);

* 描述
pthread_cond_broadcast restarts all the threads that are waiting on the condition variable cond. Nothing happens if no threads are waiting on cond.
* 参数
cond 条件变量类型的地址

5.int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mutex);

* 描述
pthread_cond_wait atomically unlocks the mutex (as per pthread_unlock_mutex) and waits for the condition variable cond to be signaled. The thread execution is suspended and does not  consume
any  CPU  time  until  the  condition  variable  is  signaled.  The  mutex  must  be  locked  by  the calling thread on entrance to pthread_cond_wait. Before returning to the calling thread,
pthread_cond_wait re-acquires mutex (as per pthread_lock_mutex).

1. 这个函数原子的取消mutex上的锁，等待cond北singal
2. 在这个线程返回前重新获取锁。

* 参数
cond 条件变量类型的地址
mutex 一个mutex锁



6.int pthread_cond_timedwait(pthread_cond_t *cond, pthread_mutex_t *mutex, const struct timespec *abstime);

* 描述
和pthread_cond_wait，不用的是有时间的限制，超过时间范围自动返回，If cond has not been signaled within the amount of time specified by abstime, the mutex mutex is re-acquired and pthread_cond_timedwait returns the error ETIMEDOUT.
* 参数

1. cond
2. mutex
3. abstime

The abstime parameter specifies an absolute time, with the same  origin  as
time(2) and gettimeofday(2): an abstime of 0 corresponds to 00:00:00 GMT, January 1, 1970.


7.int pthread_cond_destroy(pthread_cond_t *cond);

* 描述
销毁一个条件变量
* 参数

1. cond


* 返回值

All condition variable functions return 0 on success and a non-zero error code on error.


```

#### 信号量

信号量一般用于同一个资源,多个。

信号量类型 sem_t,相关的操作

1.sem_init(3) 初始化一个匿名信号量

```
#include <semaphore.h>

int sem_init(sem_t *sem, int pshared, unsigned int value);

Link with -pthread.

* 描述
initialize an unnamed semaphore

* 参数
1. sem
unnamed semaphore at the address pointed to by sem

2. pshared
The pshared argument indicates whether this semaphore is to be shared between the threads of a process, or between processes.

信号量是进程之间的还是线程之间的。0 线程间，1进程间

3.value
The value argument specifies the initial value for the semaphore.资源的可用数

* 返回值
sem_init() returns 0 on success; on error, -1 is returned, and errno is set to indicate the error.
```

2. sem_destroy(3)

```
#include <semaphore.h>

int sem_destroy(sem_t *sem);

Link with -pthread.

* 描述
sem_destroy() destroys the unnamed semaphore at the address pointed to by sem.

* 参数
1. sem
unnamed semaphore at the address pointed to by sem

* 返回值

sem_destroy() returns 0 on success; on error, -1 is returned, and errno is set to indicate the error.

```

3. sem_post(3)

```
#include <semaphore.h>

int sem_post(sem_t *sem);

Link with -pthread.
* 描述
sem_post()  increments  (unlocks)  the  semaphore pointed to by sem.  If the semaphore's value consequently becomes greater than zero, then another process or thread blocked in a sem_wait(3)
call will be woken up and proceed to lock the semaphore.

解锁一个信号量,如果value变得大于0，sem_wait()阻塞的一个线程或者进程被唤醒

* 参数
1. sem
unnamed semaphore at the address pointed to by sem

* 返回值
sem_post() returns 0 on success; on error, the value of the semaphore is left unchanged, -1 is returned, and errno is set to indicate the error.


```

4. sem_wait(3)

```
#include <semaphore.h>

int sem_wait(sem_t *sem);

int sem_trywait(sem_t *sem);

int sem_timedwait(sem_t *sem, const struct timespec *abs_timeout);

Link with -pthread.

* 描述
sem_wait()  decrements  (locks)  the  semaphore pointed to by sem.  If the semaphore's value is greater than zero, then the decrement proceeds, and the function returns, immediately.  If the
semaphore currently has the value zero, then the call blocks until either it becomes possible to perform the decrement (i.e., the semaphore value rises above zero), or a signal  handler  in‐
terrupts the call.

信号量的值-1，当值变为0时不能-1时，线程或者进程被阻塞。

sem_trywait() is the same as sem_wait(), except that if the decrement cannot be immediately performed,then call returns an error
信号量的值-1，当值变为0时不能-1时，线程或者进程不糊被阻塞，返回一个错误

sem_timedwait()  is  the same as sem_wait(), except that abs_timeout specifies a limit on the amount of time that the call should block if the decrement cannot be immediately performed.  The abs_timeout argument points to a structure that specifies an absolute timeout in seconds and nanoseconds since the Epoch, 1970-01-01 00:00:00 +0000 (UTC).

信号量的值-1，当值变为0时不能-1时，线程或者进程不糊被阻塞在指定的时间内被阻塞。

* 参数

1. sem
unnamed semaphore at the address pointed to by sem

* 返回值

All of these functions return 0 on success; on error, the value of the semaphore is left unchanged, -1 is returned, and errno is set to indicate the error.

```

#### http 服务器

http 服务器本质上 tcp 服务器，通过浏览器直接请求服务器可以打印出 http 的请求数据。我们响应的时候只需在数据前加上 http 的响应头即可响应数据。

post 请求 ，提交方式 application/x-www-form-urlencoded

```
POST /hello HTTP/1.1
Host: 192.168.43.99:8080
Connection: keep-alive
Content-Length: 33
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: http://192.168.43.99:8080
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://192.168.43.99:8080/form.html
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

username=lijunjie&password=123445
```

post 请求 ，提交方式 application/json

```
POST /hello HTTP/1.1
Host: 192.168.43.99:8080
Connection: keep-alive
Content-Length: 28
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: chrome-extension://aejoelaoggembcahagimdiliamlcdmfm
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

{
  name:"hello",
  age:12
}
```

get 请求时：

```
GET /hello?username=lijunjie&password=123456 HTTP/1.1
Host: 192.168.43.99:8080
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://192.168.43.99:8080/form.html
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9


```

请求体是空的，数据在 path 上

参见文稿下的 ppt.htm 和 nginx.htm
