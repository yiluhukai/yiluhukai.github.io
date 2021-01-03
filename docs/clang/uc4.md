### uc4

#### 文件夹的权限

文件的夹的内容是文件夹中包含的文件和文件夹。
```
文件夹的可读权限代表的是可以读取文件夹的内容。比如linux中的ls -al hello(文件夹)
文件夹的可写权限代表的是可以对文件夹中的文件进行新增文件，删除文件，重命名的操作。
文件夹的可执行权限是指可以进入该文件夹，cd hello(文件夹)
```


#### 文件夹的操作


1.opendir(3)
```
 #include <sys/types.h>
 #include <dirent.h>
 DIR *opendir(const char *name);
```

 * 描述
 The  opendir()  function opens a directory stream corresponding to the directory name, and returns a pointer to the directory stream.  The stream is positioned at the first entry in the directory.
打开一个代表文件夹的文件流指针。

 * 参数
 文件夹的名字

* 返回值
成功返回文件流指针，失败返回NULL,errorn被设置。

2. readdir(3)

```
 #include <dirent.h>
 struct dirent *readdir(DIR *dirp);
```

* 描述

The  readdir()  function  returns a pointer to a dirent structure representing the next directory entry in the directory stream pointed to by dirp.  It returns NULL on reaching the end of the directory stream or if an error occurred

读取文件夹的内容

* 参数
文件夹流指针

* 返回值
On success, readdir() returns a pointer to a dirent structure.  (This structure may be statically allocated; do not attempt to free(3) it.) If the end of the directory stream is reached, NULL is returned and errno is not changed.  If an error occurs, NULL is returned and errno is set appropriately.To distinguish end of stream and from an error, set errno to zero before calling readdir() and then check the value of errno if NULL is returned.

成功返回一个dirent 结构体，结构体指向下一个文件，到达文件夹的末尾，NULL被返回但是errorn不会被设置，失败返回NULL,errorn被设置。

```
struct dirent {
  ino_t          d_ino;       /* Inode number */
  off_t          d_off;       /* Not an offset; see below */
  unsigned short d_reclen;    /* Length of this record */
  unsigned char  d_type;      /* Type of file; not supported by all filesystem types */
  char           d_name[256]; /* Null-terminated filename */
 };
```

3.closedir(3)

```
#include <sys/types.h>
#include <dirent.h>
int closedir(DIR *dirp);
```

* 描述

The  closedir()  function closes the directory stream associated with dirp.  A successful call to closedir() also closes the underlying file descriptor associated with dirp.  The directory stream descriptor dirp is not available after this call，
关闭文件夹流指针。

* 参数

文件夹流指针

* 返回值

成功返回0，失败返回-1，errorn被设置。

代码参数 uc/file_message/dir.c



#### 文件锁

![6c3d30b97f7e985e84dc659da4ad2e6c](/clang/file-inode.png)


当两个进程操作同一个文件时，需要对文件加锁。可以对文件加读锁和写锁，读锁是可以共享的，写锁是互斥的。加锁操作一般是对文件描述符操作的，设置锁的类型和其他信息，最终的锁会添加到文件的inode结构体上。文件锁可以分为建议锁和强制锁。建议锁只是建议这样子操作，不按照建议操作会出现问题。


#### 文件的加锁操作


```
 #include <unistd.h>
 #include <fcntl.h>

 int fcntl(int fd, int cmd, ... /* arg */ );

```

* 描述

对文件描述符的操作


* 参数 

fd 文件描述符

cmd 对应的操作

... 对应操作的可选参数


对文件描述符进行建议锁操作（Advisory record locking）：

 F_SETLK, 对文件加锁,当锁互斥时返回-1，errno被设置，当前进程非阻塞
 F_SETLKW, 
对文件加锁,当锁互斥时，当前进程阻塞

F_GETLK 测试是否可以对文件加锁，当可以对文件加锁时设置第三个参数的F_UNLCK in the l_type。不能加锁设置第三个参数的pid为互斥进程pid.

加锁操作的第三个参数
```
struct flock {
       ...
       short l_type;    
       /* Type of lock: F_RDLCK,F_WRLCK, F_UNLCK */
       short l_whence;  
        /* How to interpret l_start:
       SEEK_SET, SEEK_CUR, SEEK_END 
       */
       off_t l_start;  
       /* Starting offset for lock */
       off_t l_len;     
       /* Number of bytes to lock */
       pid_t l_pid;    
       /* PID of process blocking our lock
       (set by F_GETLK and F_OFD_GETLK) */
               ...
           };
```

l_type制定锁的类型，读锁，写锁，无锁。
l_whence 锁偏移的相对位置
l_start  锁的偏移
l_len    锁的长度
l_pid    阻塞我们加锁的pid


* 返回值

加锁操作成功返回0，失败返回-1，errno被设置。



代码：
```
uc/filemessage/read_lock.c 加读锁
uc/filemessage/write_lock.c 加写锁
uc/filemessage/test_lock.c 测试是否可以加锁
```


#### 系统调用函数和标准标准库函数的关系

![ade8b0b8d1bb0c3c34564448d0e97df1](/clang/systen_stdlib.png)


1.fopen()


调用fopen函数会先在内存中分配一块缓存空间用来作为文件读写的缓存区，然后调用open函数返回文件的描述符，将文件描述符保存到对应的File结构体的fileno中，返回FIle结构体的指针。


2.fgetc()

读取文件的内容，先检测读缓存区是否有内容，有直接从缓存区读，否则使用read()读内容到缓存区中，再从缓存区中读取内容。


3. fputc()

将内容先写到写缓存区中，写缓存区中满了在调用write()函数写入到文件中。


4.fflush()

将写缓存区的内容写到文件中。


5.fclose()

将写缓存区的内容保存到文件中，调用文件close()关闭底层的文件描述符。




### 结构体


//链表

```
struct node  {
    struct node * next;
    int data ;
}
```
等价于下面的
```

struct node;
typedef struct node node;
struct node  {
    node * next;
    int data ;
}
```

文件操作杂项

1.access(2)

2.mkdir(2)
3.chdir(2)
4.rmdir(2)
5.umask(2)
6.unlink(2)
7.link(2)
8.rename(2)
9.remove(2)
10.getcwd(2)
11.basename(3)
12.dirname(3)


### 进程

所有用户态进程构成了一棵树，树根是一号进程init,他是所有用户态进程的祖先。进程间的关系我们只关注父子和兄弟关系。

```shell

#查看进程树

pstree

#查看所有用户态进程的信息

ps -aux 
ps -aux|grep name
#实时查看进程的使用情况
top
```

1. 创建一个子进程

fork(2)
```shell
#include <sys/types.h>
#include <unistd.h>
pid_t fork(void);
```

从当前进程复制一个进程，fork不会复制原进程的内存空间，而是共享一个写时复制的内存空间（每个进程都有4G的内存空间，存放代码段、数据段。。。）。


写时复制指的两个进程在读数据时共享相同的内存，但是当两个中有一个对内存进行写时会立马复制一块内存空间供这个进程使用，这个进程的操作不会对另一个进程产生影响。


fork时会在内核中产生一个新的pcb，这两个pcb共享进程映像和文件描述。

* 返回值

成功父进程返回子进程的pid,子进程返回0，失败时父进程返回-1.子进程创建失败，errno被设置。







































 
