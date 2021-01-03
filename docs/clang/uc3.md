### uc3

umask


指定文件没有那些权限

新创建文件的权限等于mode&~umask

```eg

mode  rwx,rw_,rw_ 766
umask ___,___,_w_ 002
创建的文件的权限位。  rwx,rw,r__

mode        111,110,110

umask取反    111，111，101

与的结果     111，110，100  ==  rwx,rw,r__

```

查看当前进程的umask.

```
umask 
022

```

设置进程的umask 

```
umask 042
```

* 返回值：

If successful, open() returns a non-negative integer, termed a file descriptor.  It returns -1 on failure, and sets errno to indicate the error.


进程：进程的本质是程序执行过程中，对计算机资源的使用情况的描述，类似于视频是由一幅幅图片连起来的。


文件描述符（a non-negative integer, termed a file descriptor）的本质：
每个进程都有一个pid来标识，pid对应的进程信息存在内核中的pcb（process contril block）中.是一个结构体，结构体中会把进程运行时使用的文件资源存在一个file结构体数组的字段中。当进程打开一个文件时，会把当前数组中未占用的最小数组下标返回。这个数组的下标就是文件描述符。pcb位于内核中，还会记录进程对其他计算机资源的使用。


![cb60ac2581291b05e14f27ce1c3ae538](/clang/file.png)

bash中启动的进程的012文件描述符被占用了。

0 标准输入 键盘 对应的宏 STDIN_FILENO

1 标准输出 显示器 STDOUT_FILENO

2 标准错误输出 显示器 STDERR_FILENO


2.关闭文件

 #include <unistd.h>

 int close(int fildes);

 功能：delete a descriptor

 返回值：
 Upon successful completion, a value of 0 is returned.Otherwise, a value of -1 is returned and the global integer variable errno is set to indicate the error.

3.读文件的内容

 #include <unistd.h>

 ssize_t
     read(int fildes, void *buf, size_t nbyte);


* 功能：
read() attempts to read nbyte bytes of data from the object referenced by the descriptor fildes into the buffer pointed to by buf. 

* 参数：
fildes 指向读取文件的文件描述符

buf 读取文件到缓冲区

size_t 代表要读区的字节数

* 返回值

成功返回读取到的字节数，返回0代表到达文件的末尾
失败返回-1，errorn被设置


4. 写入文件的内容
include <unistd.h>
ssize_t 
        write(int fildes, const void *buf, size_t nbyte);

* 功能
write() attempts to write nbyte of data to the object referenced by the
     descriptor fildes from the buffer pointed to by buf.
* 参数

fildes 要写入的文件描述符

buf 将buf中的写到文件中

nbyte 写入的字节数

* 返回值

Upon successful completion the number of bytes which were written is returned.  Otherwise, a -1 is returned and the global variable errno is set to indicate the error.

返回值为0时不为错，可能磁盘满了。


5.修改文件的偏移

#include <unistd.h>

off_t lseek(int fildes, off_t offset, int whence);

* 功能

The lseek() function repositions the offset of the file descriptor fildes to the argument offset, according to the directive whence.  The argument fildes must be an open file descriptor.  lseek() repositions the file
pointer fildes as follows:
If whence is SEEK_SET, the offset is set to offset bytes.

If whence is SEEK_CUR, the offset is set to its current location plus offset bytes.

If whence is SEEK_END, the offset is set to the size of the file plus offset bytes.

* 参数

fildes 指定文件描述符只想的文件的偏移

off_t  指定偏移多少个字节数

whence 偏移的开始，可以为SEEK_SET（文件的开始），SEEK_CUR（当前偏移位置），SEEK_END（文件的结尾）


* 返回值
off_t 代表最终的相对文件开始位置的偏移量。

```
以指定类型(x1 = 16进制) c(ascii)形式显示文件的内容
$ od -tx1  -tc hello.txt
0000000    68  65  6c  6c  6f  20  77  6f  72  6c  64  21  0a            
           h   e   l   l   o       w   o   r   l   d   !  \n            
0000015
```

6.将文件映射到虚拟地址

代码：map_file.c


7.复制文件描述符

文件描述符是pcb快中保存引用文件的结构体数组的下标，复制文件描述符使两个文件描述符指向同一个文件。利用这个可以输出文件重定向。

#include <unistd.h>

int
dup(int fildes);

int
dup2(int fildes, int fildes2);

* 功能：
dup复制一个文件描述符，返回一个新的文件描述符，这个文件描述符是当前进程文件描述符表中的最小索引。
dup2复制一个文件描述符到指定的描述符，如果指定文件描述符被使用的话，系统会先关闭这个文件引用在区复制。

* 返回值

Upon successful completion, the new file descriptor is returned.  Other-wise, a value of -1 is returned and the global integer variable errno is set to indicate the error.

成功返回文件描述符，失败返回-1，errno被设置。


#### 文件的元数据（meta）

每个文件都有一个inode结构体(inode又自己的编号)，这个结构体存放了文件的元数据和文件内容所在块的编号，一个inode可以对应多个文件。一个块包含磁盘上的多个扇区（一般是4个），每个扇区的大小是512个字节。
![16215cc36d11afc861f873e8e621645c](/clang/inode.png)




查看文件的inode编号
```shell

ls -li

1573616 -rwxr-xr-x  1 yiluhuakai yiluhuakai  8648 2月  13 23:53 a.out

```

第一个参数代表的是文件的inode编号。



硬链接


```shell
yiluhuakai@debian:~/oc$ ln hello.m  hello
yiluhuakai@debian:~/oc$ ls -li
总用量 8
1589381 -rw-r--r-- 2 yiluhuakai yiluhuakai 190 2月  14 00:10 hello
1589381 -rw-r--r-- 2 yiluhuakai yiluhuakai 190 2月  14 00:10 hello.m
```
硬链接相当于给文件一个别名，两个文件名对应一个inode.文件权限旁边的数字代表的是硬链接的个数。

软连接

```shell
yiluhuakai@debian:~/oc$ ln -s hello.m hello.c
yiluhuakai@debian:~/oc$ ls
hello  hello.c  hello.m
yiluhuakai@debian:~/oc$ ls -li
总用量 8
1589381 -rw-r--r-- 2 yiluhuakai yiluhuakai 190 2月  14 00:10 hello
1589359 lrwxrwxrwx 1 yiluhuakai yiluhuakai   7 5月  31 22:05 hello.c -> hello.m
1589381 -rw-r--r-- 2 yiluhuakai yiluhuakai 190 2月  14 00:10 hello.m
```

软件接文件和原文件的inode是不同的。软连接的inode中块编号保存的是硬链接文件的名称。通过名称可以找源文件的inode,然后访问磁盘上对应位置的内容，所以用cat打印文件的内容，看到的结果是一样的。

#### 查看文件的元信息
 #include <sys/types.h>
 #include <sys/stat.h>
 #include <unistd.h>
 int stat(const char *pathname, struct stat *buf);

*  函数作用
These functions return information about a file, in the buffer pointed to by buf.  

* 参数
path 文件名
buf  返回文件元信息的结构体
```
struct stat {
               dev_t     st_dev;         /* ID of device containing file */
               ino_t     st_ino;         /* inode number */
               mode_t    st_mode;        /* file type and mode */
               nlink_t   st_nlink;       /* number of hard links */
               uid_t     st_uid;         /* user ID of owner */
               gid_t     st_gid;         /* group ID of owner */
               dev_t     st_rdev;        /* device ID (if special file) */
               off_t     st_size;        /* total size, in bytes */
               blksize_t st_blksize;     /* blocksize for filesystem I/O */
               blkcnt_t  st_blocks;      /* number of 512B blocks allocated */

               /* Since Linux 2.6, the kernel supports nanosecond
                  precision for the following timestamp fields.
                  For the details before Linux 2.6, see NOTES. */

               struct timespec st_atim;  /* time of last access */
               struct timespec st_mtim;  /* time of last modification */
               struct timespec st_ctim;  /* time of last status change */

           #define st_atime st_atim.tv_sec      /* Backward compatibility */
           #define st_mtime st_mtim.tv_sec
           #define st_ctime st_ctim.tv_sec
           };
```

* 返回值

On success, zero is returned.  On error, -1 is returned, and errno is set appropriately.


* 上面的结构体中定义了宏变量，用来代表另一个结构体的字段


代码参见 : file_message/t_stat.c

### uid和gid


uid和gid是系统中标示用户和用户组的，我们一般看到的和使用的是用户和用户组的名字。

linux下查看用户的相关信息

```shell
cat /etc/passwd|grep root
root:x:0:0:root:/root:/bin/bash
cat /etc/passwd|grep bruce
bruce:x:1000:1000:bruce,,,:/home/bruce:/bin/bash
```
冒号是分隔符。
第一列代表用户名，第二列是否有密码，第三列代表了uid,第四列是gid,第五列是用户的信息，第六列是用户的家目录，第七列是用户登陆时执行的第一个程序。


linux下查看用户组信息


```shell
cat /etc/group|grep bruce
adm:x:4:syslog,bruce
cdrom:x:24:bruce
sudo:x:27:bruce
dip:x:30:bruce
plugdev:x:46:bruce
lpadmin:x:120:bruce
lxd:x:131:bruce
bruce:x:1000:
```
冒号是分隔符，第一列是用户的用户组名，第二列代表是否有密码，第三列代表用户组id,第四列是用户成员。


### 获取用户信息和用户组信息

 #include <sys/types.h>
 #include <pwd.h>

 struct passwd *getpwuid(uid_t uid);


 * 功能

The getpwuid() function returns a pointer to a structure containing the
broken-out  fields  of the record in the password database that matches the user ID uid.

* 参数 uid(用户组id)
* 返回值

成功返回paswd结构体指针，失败返回NULL,errorn被设置。

passwd结构体：

```shell
struct passwd {
               char   *pw_name;       /* username */
               char   *pw_passwd;     /* user password */
               uid_t   pw_uid;        /* user ID */
               gid_t   pw_gid;        /* group ID */
               char   *pw_gecos;      /* user information */
               char   *pw_dir;        /* home directory */
               char   *pw_shell;      /* shell program */
           };
```

#include <sys/types.h>
#include <grp.h>

struct group *getgrgid(gid_t gid);

* 返回用户组的信息
* 参数用户组id
* 返回值
成功返回group结构体的指针，失败返回NULL,errorn被设置。


group结构体：

```shell
 struct group {
               char   *gr_name;        /* group name */
               char   *gr_passwd;      /* group password */
               gid_t   gr_gid;         /* group ID */
               char  **gr_mem;         /* NULL-terminated array of pointers
                                          to names of group members */
           };
```

### 时间相关的函数
#include <time.h>
char *ctime(const time_t *timep);

* 描述

毫秒数转成时间戳字符串

* 参数
timep是距离1970.1.1的毫秒数变量的地址

* 返回值

成功返回时间戳，失败返回NULL.


### 查看文件的权限

stat函数返回的结构体中包含文件的权限（st_mode），st_mode返回一个无符号整型。
```
# 八进制显示
mode of file:100664
```
10代表文件的类型，0代表文件的三个可执行权限组成的权限，后面的9位代表文件的权限。可以在man 7 inode中查看。


```
The following mask values are defined for the file type:

           S_IFMT     0170000   bit mask for the file type bit field

           S_IFSOCK   0140000   socket
           S_IFLNK    0120000   symbolic link
           S_IFREG    0100000   regular file
           S_IFBLK    0060000   block device
           S_IFDIR    0040000   directory
           S_IFCHR    0020000   character device
           S_IFIFO    0010000   FIFO

       Thus, to test for a regular file (for example), one could write:

           stat(pathname, &sb);
           if ((sb.st_mode & S_IFMT) == S_IFREG) {
               /* Handle regular file */
           }

```

将文件的权限和S_IFMT 与可以取得文件类型。

```
#最前面的0代表9进制
st_mode 0100664 ->(2进制)001 000 110 110 100 
S_IFMT  0170000        001 111 000 000 000     

按位与  010000          001 000 000 000 000
```

与会除了文件类型的位置，其他位置的字段都是0，然后与对应的宏进行比较，得到的就是文件的类型。

The following mask values are defined for the file mode component of the st_mode field:

```
S_ISUID     04000   set-user-ID bit (see execve(2))
           S_ISGID     02000   set-group-ID bit (see below)
           S_ISVTX     01000   sticky bit (see below)

           S_IRWXU     00700   owner has read, write, and execute permission
           S_IRUSR     00400   owner has read permission
           S_IWUSR     00200   owner has write permission
           S_IXUSR     00100   owner has execute permission

           S_IRWXG     00070   group has read, write, and execute permission
           S_IRGRP     00040   group has read permission
           S_IWGRP     00020   group has write permission
           S_IXGRP     00010   group has execute permission

           S_IRWXO     00007   others (not in group) have read,  write,  and
                               execute permission
           S_IROTH     00004   others have read permission
           S_IWOTH     00002   others have write permission
           S_IXOTH     00001   others have execute permission
```

检测用户组是否有可读权限且将它以字符的形的形式输出。

```
st.st_mode & S_IRUSR ?'r':'_'
st.st_mode & S_IWUSR ?'w':'_'
```




















































