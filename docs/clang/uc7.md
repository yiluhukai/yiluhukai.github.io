### uc7

#### 进程间通信

##### 管道

每个进程都有自己独享的4G的内存空间，其中1G位于是内核空间。两个进程要想通信，就需要在内核中分配一段共用的内存空间，来实现进程通信。

1.无名管道

无名管道用于父子进程和兄弟进程间的通信，由于调用fork创建的子进程时会复制父进程的pcb快，里面包含了进程相关的文件描述符，这样子父子进程就拥有相同的文件描述符，所以兄弟进程也会拥有和父进程相同的文件描述符。

操作步骤
```
1.创建管道(生成两个文件描述符指向管道文件开始和结束的文件描述符，类似于一个队列)
2.创建子进程共享文件描述符
3.父进程中：
关闭用于读的文件描述符
向用于写的文件描述符中写入内容
关闭用于写的文件描述符
等待子进程终止
4. 子进程中：
关闭用于写的文件描述符
读出文件描述符的内容。
关闭读文件描写符
进程终止
```

管道的读写操作和进程的wait()都会阻塞进程的执行。

```
 #include <unistd.h>

/* On Alpha, IA-64, MIPS, SuperH, and SPARC/SPARC64; see NOTES */
struct fd_pair {
   long fd[2];
};
struct fd_pair pipe();

/* On all other architectures */
int pipe(int pipefd[2]);
```

* 描述
创建一个单项管道
* 参数

pipefd时一个整型数组，用来接受系统返回的文件描述符。0是读文件描述符，1是写文件描述符。

* 返回值
On success, zero is returned.  On error, -1 is returned, errno  is  set appropriately, and pipefd is left unchanged.

```pipe.c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>

int main(){
        // 创建管道

        int fds[2];
        int res = pipe(fds);
        char * buff[128];
        char * msg ="hello world";
        int len  = strlen(msg);
        if(res==-1){
                perror("pipe");
                return -1;
        }
        // 创建子进程
        pid_t pid = fork();
        if(pid ==-1){
                perror("fork");
                return -1;
        }

        if(pid == 0){
                close(fds[1]);
                int r =read(fds[0],buff,len);
                close(fds[1]);
                write(1,buff,r);
                write(1,"\n",strlen("\n"));
                exit(1);
        }else{
                close(fds[0]);
                write(fds[1],msg,len);
                close(fds[1]);
                wait(NULL);
        }
        return 0;
}
```

2.有名管道

有名管道文件可以用在任意两个进程之间通信。

创建有名管道:mkfifo(3)
```
#include <sys/types.h>
#include <sys/stat.h>

int mkfifo(const char *pathname, mode_t mode);

* 创建一个有名管道文件（实质上是一个队列）
* 参数
pathname:文件名
mode:权限 和 umask&mode
* 返回值

On  success mkfifo() and mkfifoat() return 0.  In the case of an error,
-1 is returned (in which case, errno is set appropriately).

```

创建管道文件：
```c

#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>

int main(int argc,char * argv[]){

        // 创建管道文件

        int res = mkfifo(argv[1],0644);

        if(res == -1){
                perror("mkfifo");
                return -1;
        }

        printf("创建管道文件%s成功",argv[1]);


        return 0;
}
```
pa.c
```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
int main(int argc,char * argv[]){
        char * msg ="hello world\n";
        int  fd = open(argv[1],O_WRONLY);
        if(fd == -1){
                perror("open");
                return -1;
        }
        // 向文件写入内容，会阻塞当前进程
        write(fd,msg,strlen(msg));
        close(fd);
        return 0;
}

```

pb.c

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
int main(int argc,char * argv[]){

        char  buff[128];

        int  fd = open(argv[1],O_RDONLY);

        if(fd == -1){
                perror("open");
                return -1;
        }
        // 向文件写入内容，会阻塞当前进程
        int r =read(fd,buff,128);
        write(1,buff,r);
        close(fd);
        return 0;
}
```

```
pa.c向管道文件里写，pb.c从管道里面读数据。
只有当读写同时存在时管道才不会阻塞。所以当我们查看管道文件时，他的大小始终为0；
```


#### system v ipc

实质上是内核中的一些对象。可以通过ipcs去查看，创建了这些对象需要手动回收，或者系统重启。这些对象有消息队列，共享内存，信号量数组。

用户态中需要先去获取自己的System V IPC key,通过key去获取对象的id,通过对象id去对对象进行操作。无论使用那种对象，都需要先获取key.

1.获取用户的键值 ftok(3)

```c
 #include <sys/types.h>
 #include <sys/ipc.h>
 key_t ftok(const char *pathname, int proj_id);
```


* 描述
convert a pathname and a project identifier to a System V IPC key，生成一个消息队列。

* 参数
pathname (which must refer to an existing, accessible file) 。
proj_id the least significant 8 bits of proj_id (which must be nonzero) to generate a key_t type System V IPC key。

* 返回值
成功返回一个key_t类型的key,失败返回-1，errorn被设置。

ftok.c
```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>

int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);
        return 0;
}

```


#### 消息队列

1.msgget(2)

```
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>
int msgget(key_t key, int msgflg);

* 描述
The  msgget() system call returns the System V message queue identifier associated with the value of the key argument.  It may be  used  either to  obtain  the  identifier of a previously created message queue (when msgflg is zero and key does not have the value IPC_PRIVATE), or to create a new set.

* 参数
key: system v key.

msgflg:

IPC_CREAT:如果消息队列不存在时。msgflg指定的为该值时，创建一个新的消息队列。

IPC_CREAT and IPC_EXCL:但参数为两个值的与时，消息队列的存在会报错，errorn被设置。
 
Upon creation, the least significant bits of the argument msgflg define the  permissions  of the message queue.  These permission bits have the
same format and semantics as the permissions specified for the mode ar‐
gument of open(2) 

创建的时候可以指定消息队列的权限在最后。

* 返回值

成功返回消息队列的id,失败返回-1，errorn被设置。

```
msgget.c
```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>
#include <sys/msg.h>

int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);

        int msg_id =  msgget(key,IPC_CREAT|0644);
        if(msg_id == -1){
                perror("msgget");
                return -1;
        }

        printf("msg_id=%d\n",msg_id);
        return 0;
}
```

#### 消息队列的操作

1.msgsnd(2)
```
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

int msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);

* 描述
向消息队列发送消息
*参数
msqid:消息队列的id
mggp: 用户自定义的结构体
The msgp argument is a pointer to a caller-defined  structure  of  the following general form:

struct msgbuf {
    long mtype;       /* message type, must be > 0 */
    char mtext[1];    /* message data */
};

msgsz：
The  mtext field is an array (or other structure) whose size is specified by msgsz, a nonnegative integer value.


struct msgbuf * msg = (struct msgbuf *)malloc(sizeof(struct msgbuf)-4+strlen("hello world")+1)
strcpy(msg.mtext,"hello wolrd");


这里的mtext是一个指针，只需要指向要包含的字符串的首地址即可，具体存放的内容个数取决msgsz。mtype指定了要发送的消息的类型。

msgflg：

当消息队列的空间充足时，消息立刻发送成功。空间不足时，
havior of msgsnd() is to block  until  space  becomes  available.   If IPC_NOWAIT  is  specified  in msgflg, then the call instead fails with the error EAGAIN.

* 返回值

失败返回-1，errorn被设置，成功返回0；

2.ssize_t msgrcv(int msqid, void *msgp, size_t msgsz, long msgtyp,int msgflg);

* 描述，从消息队列中接受一条消息。


int msgflg:

IPC_NOWAIT:Return  immediately  if  no message of the requested type is in the queue.  The system call fails with errno set to ENOMSG.

0:消息队列取不到消息时被阻塞。

返回值:
失败：-1，errorn被设置，
成功：收取到消息的字节数。
```
msgsnd.c

```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>
#include <sys/msg.h>
#include <string.h>
typedef struct msgbuf {
        long mtype; /* message type, must be > 0 */
        char mtext[128];
} msgbuff;


int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);

        int msg_id =  msgget(key,IPC_CREAT|0644);
        if(msg_id == -1){
                perror("msgget");
                return -1;
        }

        printf("msg_id=%d\n",msg_id);
        char * msg ="hello world";
        msgbuff  buf = {0};
        buf.mtype = 3;
        strcpy(buf.mtext,msg);
        int res = msgsnd(msg_id,&buf,strlen(msg),0);

        if (res == -1){
                perror("msgsnd");
                return -1;
        }
        return 0;
}
```
msgrcv.c
```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>
#include <sys/msg.h>
#include <string.h>
#include <unistd.h>

typedef struct msgbuf {
        long mtype; /* message type, must be > 0 */
        char mtext[128];
} msgbuff;


int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);

        int msg_id =  msgget(key,IPC_CREAT|0644);
        if(msg_id == -1){
                perror("msgget");
                return -1;
        }

        printf("msg_id=%d\n",msg_id);
        msgbuff  buf = {0};
        int r = msgrcv(msg_id,&buf,128,3,0);

        if (r == -1){
                perror("msgsnd");
                return -1;
        }
        write(1,buf.mtext,r);
        return 0;
}
```


#### 共享内存
```
1. 首先获取一个System v ipc 的key.
2. 获取一个共享内存的id
3. 关联进程和这块内存空间
4. 对内存空间进行操作
5. 取消和这块内存空间的关联
```

获取共享内存的id.

```
#include <sys/ipc.h>
#include <sys/shm.h>

int shmget(key_t key, size_t size, int shmflg);


* 描述
allocates a shared memory segment

* 参数
1. key System v ipc 的key
2. size 共享内存区域的大小。内存中分配的实际大小回按页（4k）向上取整，我们看到只是我们制定的的大小。
3. shmflg: 
IPC_CREAT 当key对应的共享内存不存在的时候，又该标记时创建一块共享内存区域。
IPC_EXCL  当该标记和IPC_CREAT同时存在且共享内存已经存在，该函数失败且errorn被设置。
mode_flags 共享内存的访问权限，当创建的时候有效。

* 返回值

成功返回shmid,失败返回-1，errorn被设置。
```

进程关联共享共享内存和取消关联

```
 #include <sys/types.h>
 #include <sys/shm.h>

 void *shmat(int shmid, const void *shmaddr, int shmflg);
 
 * 描述
 关联共享内存，进程的地址空间和内核中的共享内存间建立关联。
 
 * 参数
 shmid:共享内存对应的id.
 shmaddr: is NULL, the system chooses a suitable (unused) address at which to attach the segment.

 shmflg:0
 
 * 返回值
 
 
 成功返回进程关联共享内存的地址，on error (void *) -1 is returned, and errno is set。
    

 int shmdt(const void *shmaddr);
 
 * 描述
 
 取消进程地址空间和共享内存的关联。
 
 * 参数
 shmaddr：关联到共享内存的进程地址。
 
 * 返回值
 成功返回0，失败返回-1，errorn 被设置。
 
```

shmw.c，对共享内存写操作
```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>
#include <sys/shm.h>
#include <string.h>
int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);
        int shmid = shmget(key,1024,IPC_CREAT|0644);
        if (shmid == -1){
                perror("shmget");
                return -1;
        }
        // 
        void * address = shmat(shmid,NULL,0);

        if(address == (void *)-1){
                perror("shmat");
                return -1;
        }

        //
        strcpy((char*) address,"I am testing ...." );
        shmdt(address);
        return 0;
}
```

shmr.c
```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdio.h>
#include <sys/shm.h>

int main(){
        key_t key  = ftok(".",23);
        if(key == -1){
                perror("ftok");
                return -1;
        }

        printf("key:0x%x\n",key);
        int shmid = shmget(key,1024,IPC_CREAT|0644);
        if (shmid == -1){
                perror("shmget");
                return -1;
        }
        //
        printf("shmid:%d\n",shmid);
        void * address = shmat(shmid,NULL,0);

        if(address == (void *)-1){
                perror("shmat");
                return -1;
        }

        //
        printf("%s\n",(char *)address);
        shmdt(address);
        return 0;
}
```





























