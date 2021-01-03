### uc6

#### 替换进程的映像(内存空间)

exec家族函数


1.execve(2)

```
#include <unistd.h>

int execve(const char *pathname, char *const argv[],char *const envp[]);
```


* 描述
execve()  executes the program referred to by pathname.  This causes the program that is currently being run by the calling process to be replaced with a new program, with newly initialized stack, heap, and (initialized and uninitialized) data segments.

* 参数

1. pathname must be either a binary executable, or a script starting with a line of the form:
#!interpreter [optional-arg]

2. argv is an array of argument strings passed to the new program.  By convention, the first of these strings (i.e., argv[0]) should contain the filename  associated  with the file being executed.
3. envp is an array of strings, conventionally of the form key=value, which are passed as environment to the new program.
4. The argv and envp arrays must each include a null pointer at the end of the array.


The argument vector and environment can be accessed by the called program's main function, when it is defined as:

int main(int argc, char *argv[], char *envp[])
Note, however, that the use of a third argument to the main function is not specified in POSIX.1; according to POSIX.1, the environment  should  be  accessed via the external variable environ(7).

* 返回值

On success, execve() does not return, on error -1 is returned, and errno is set appropriately.


2.其他的exec相关的库函数

```
#include <unistd.h>

extern char **environ;

int execl(const char *pathname, const char *arg, .../* (char  *) NULL */);
int execlp(const char *file, const char *arg, ...
/* (char  *) NULL */);
int execle(const char *pathname, const char *arg, .../*, (char *) NULL, char *const envp[] */);
int execv(const char *pathname, char *const argv[]);
int execvp(const char *file, char *const argv[]);
int execvpe(const char *file, char *const argv[],
char *const envp[])
```

上面的函数中e带面环境变量，l代表argc参数要展开一个一个的字符串，v的是直接传入一个数组。p代表path，可执行程序时从path中查找的，当没有p时，要指定文件的path.


使用例子
```c
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdio.h>
int main(){
        int status;
        char *  args[] ={"ps","-o","pid,ppid,pgrp,comm",NULL};
        pid_t  pid = fork();

        if(pid == -1){
                printf("fork");
                return -1;
        }
        if(pid == 0){
                //替换进程映像
        //      int res=execlp("ps","ps","-o","pid,ppid,pgrp,comm",NULL);
        //      int res=execl("/usr/bin/ps","/usr/bin/ps","-o","pid,ppid,pgrp,comm",NULL);

                int res=execvp("ps",args);
                        //替换成功不会执行下面的代码
                if(res ==-1){
                        perror("execl");
                        return -1;
                }
        }else{
                wait(&status);
        }
        return 0;
}

```

执行结果：
```
bruce@bruce-VirtualBox:~/C-/uc/thread$ ./a.out 
    PID    PPID    PGRP COMMAND
  23554   23444   23554 bash
  41773   23554   41773 a.out
  41774   41773   41773 ps
```

可以看出子进程映像被ps替换了，且父子进程在同一个进程组。


#### 环境变量

```text
环境变量可以被子进程继承，每个进程都有自己的环境变量，环境变量与进程密切相关。环境变量默认从父进程继承。
extern char **environ;
这个全局变量指向了进程的环境变量
```

获取进程的环境变量

```c
#include <stdio.h>
#include <unistd.h>
extern char **environ;
int main(){
        int i;
        for(i=0;environ[i]!=NULL;i++){
                printf("%s\n",environ[i]);
        }
        return 0;
}
```


1.getenv
```
#include <stdlib.h>
char *getenv(const char *name);
```
* 描述

获取指定name的环境变量

* 参数
name 环境变量的名称

* 返回值
找到了返回对应的值，没找到返回NULL.

```c
#include <stdlib.h>
#include <stdio.h>
int main(){
        //默认从父进程bash继承而来
        char *env = getenv("name");
        if(env ==NULL){
                printf("no macth\n");
                return -1;
        }
        printf("name=%s\n",env);
        return 0;
}
```


#### setenv(3)和putenv()

1.setenv
```
#include <stdlib.h>

int setenv(const char *name, const char *value, int overwrite);
    
```
* 描述：
设置或者改变环境变量

* 参数
name:环境变量的名字
value:环境变量的名字
overwrite:是否覆盖，非零时覆盖，为零是不覆盖

* 返回值

成功返回0，失败返回-1.errorn被设置。


2.putenv

```
 #include <stdlib.h>

 int putenv(char *string);
```

* 参数
string 是name=value形式的字符串。

* 其余和setenv类似


setenv和putenv的差别
1.当环境变量存在时，setenv是否覆盖环境变量取决于overwrite.

2.setenv会复制name和value,然后设置到当前进程的环境变量上。putenv直接使用当前添加到环境变量上。

3. 他们设置的环境变量都只对当前的进程有效，不会影响父进程。
```c
#include <stdlib.h>
#include <stdio.h>
void setEnv(){
        char name[] = "name";
        char value[] = "nanjing";
        char s[20] = {};
        sprintf(s,"%s=%s","caption","beijing");
        setenv(name,value,1);
        int res =putenv(s);
        //int res =putenv("name=nanjing");
        if(res==-1){
                perror("setenv");
        }
}

int main(){
        setEnv();
        printf("name=%s\n",getenv("name"));
        printf("caption=%s\n",getenv("caption"));

        unsetenv("name");
        printf("name=%s\n",getenv("name"));
        return 0;
}
```
```shell
name=nanjing
caption=(null)
name=(null)
bruce@bruce-VirtualBox:~/C-/uc/thread$ echo $name

bruce@bruce-VirtualBox:~/C-/uc/thread$ 
```
在setEnv中变量的生命周期只在当前函数中有效，当我们在main函数中访问环境变量时可以访问到setenv的但是访问不到putenv的，是因为setenv会复制name和value来设置环境变量，复制后的值不会在函数结束被销毁。

当我们访问bash的name环境变量，看到他还是为空，所以子进程不会影响父进程的环境变量，但是子进程会继承父进程的环境变量。

3.unsetenv

```
#include <stdlib.h>
int unsetenv(const char *name);
```
* 描述
删除进程的环境变量

* 参数
要删除环境变量的name


* 返回值
成功返回0，失败返回-1.errorn被设置。


4.clearenv

```
#include <stdlib.h>

int clearenv(void);

```

* 描述
删除当前进程的所以环境变量

* 返回值
成功返回0，environ = NULL, 失败返回非0.



#### bash和exit命令

使用bash命令可以在当前的终端新建一个bash子进程，然后exit可以退出当前的进程。pstree可以查看进程树


```
使用上面的命令我们可以测试自定义变量不可以被子进程继承，而环境变量可以
```


```shell
bruce@bruce-VirtualBox:~$ name=bruce
bruce@bruce-VirtualBox:~$ bash 
#访问不到父进程的自定义变量
bruce@bruce-VirtualBox:~$ echo $name

bruce@bruce-VirtualBox:~$
```
接下来在当前终端执行

```
bruce@bruce-VirtualBox:~$ exit
exit
bruce@bruce-VirtualBox:~$ export name="bruce"
bruce@bruce-VirtualBox:~$ bash
#可以访问到父进程的环境变量
bruce@bruce-VirtualBox:~$ echo $name
bruce
bruce@bruce-VirtualBox:~$ 
```


使用execle函数来替换子进程的环境变量。

```c
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
int main(){

        char * envs[] = {"caption=beijing",NULL};
        pid_t pid = fork();
        if(pid == -1){
                perror("fork");
                return -1;
        }
        if(pid == 0){
                // 给子进程添加环境变量
                setenv("name","lijunjie",1);
                //execl("./tenv","./tenv",NULL);
                //使用我们之前的可执行程序替换原来的子进程映像
                execle("./tenv","./tenv",NULL,envs);
        }else{
                wait(NULL);
        }
        return 0;
}

```

```shell
bruce@bruce-VirtualBox:~/C-/uc/thread$ ./a.out 
caption=beijing
```

上面的tenv是我们自己实现的一个打印环境变量的函数，其功能类似于env命令。我们先给子进程设置环境变量，此时的环境变量是从父进程继承而来的在加上我们设置的name,调用execle()函数后环境变量只剩下我们替换后的caption.

#### bash命令

bash命令分为内部和外部命令，通过type command来区分，我们自己写的可执行程序也属于外部命令，他们的区别在与外部命令会创建新的子进程而内部命令不会。

bash下执行外部命令的过程
```
bash ->fork() --> exec(command)
#创建子进程然后替换子进程的映像
```

























