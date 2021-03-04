#### 对tcp编程的代码进行封装

对已有的server.c 和client.c进行封装。代码参见package_tcp/*

提取server.c中的头文件


```h
#ifndef __T_NET_TCP_H__
#define __T_NET_TCP_H__



#include <sys/types.h> /* See NOTES */
#include <sys/socket.h>
#include <stdio.h>
#include <unistd.h>
#include <netinet/ip.h>
#include <arpa/inet.h>

typedef struct sockaddr_in ipv4_addr;
typedef struct sockaddr normal_addr;

int s_bind(int domain, int type,short int port);
void do_request_handle(int fd);
#endif
```

封装创建socket和绑定ip地址的函数 s_bind.c

```c
#include "t_net_tcp.h"

int s_bind(int domain,int type,short int port){

        // 创建一个用于通信的socket
        ipv4_addr addr;
        int  sfd =  socket(domain,type,0);

        if(sfd==-1){
                perror("socket");
                return -1;
        }
        // 绑定具体的地址
        addr.sin_family =AF_INET;
        addr.sin_port =  htons(port);
        addr.sin_addr.s_addr = INADDR_ANY;
        int res =  bind(sfd,(normal_addr *)&addr,sizeof(addr));
        if(res == -1){
                perror("bind");
                return -1;
        }

        return sfd;
}

```

封装处理客户端连接相关的socket cfd的函数 do_request_handle.c

```c
#include "t_net_tcp.h"
#include <string.h>
void do_request_handle(int cfd){
         char * msg ="receive ok\n";
         char buff[128];

         // 从文件描述读取请求内容

         int r = read(cfd,buff,128);
         //  输出到屏幕上
         write(1,buff,r);
         // 向客户端返回在数据
         write(cfd,msg,strlen(msg));

}
```
在server.c中调用

```c
#include <stdio.h>
#include <string.h>
#include "t_net_tcp.h"

int main(){

        // 接受客户端socket的addr
        ipv4_addr client;
        socklen_t addrlen =(socklen_t)sizeof(client);
        char ip[128];

        int sfd =s_bind(AF_INET,SOCK_STREAM,8080);
        if(sfd ==-1){
                return -1;
        }
        // 将socket 设置为被动监听状态
        // 未决队列的最大容量为5
        int res = listen(sfd,5);

        if (res == -1){
                perror("listen");
                return -1;
        }
        //  
        printf("listen successfully\n");
        while(1){
                // 当未决队列为空时，处于阻塞状态，
                // 否则取出第一个请求连接
                // 不获取客户端socket的地址和大小
                // 创建一个新的socket文件描述符
                //int cfd = accept(sfd,NULL,NULL);
                //获取客户端的地址
                int cfd = accept(sfd,(normal_addr *)&client,&addrlen);

                // 打印客户端的地址信息,需要经ip地址从binary 转到字符串
                printf("%s\n",inet_ntop(AF_INET,&client.sin_addr,ip,128));
                do_request_handle(cfd);
                close(cfd);


        }
        return 0;
}
```

编译
```shell
gcc server.c s_bind.c do_request_handle.c -o. server 
```

一个我们只需要处理do_request_handle.c中的代码，其他两部分我们编译成动态库。


```shell

gcc -c -fPIC  server.c s_bind.c

gcc -shared -o libt_net.so server.o s_bind.o

gcc  do_request_handle.c  -lt_net.so

// 设置环境变量
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:.


./a.out 


因为我们只改变do_reuest_handle.c中的内容

所以我们可以设置别名
alias gnn="gcc  -L. -lt_net"

gnn  do_request_handle.c 

./a.out

// g++ 编译器就是利用上面的原理
alias g++="gcc -lstdc++"
```


#### 并发服务器的实现

使用三种方式实现服务器的并发：
1. 多线程
2. 多进程
3. 多路复用


使用多进程实现并发服务器。

父进程：负责从未决队列中取出连接请求对应的socket cfd.
1 .从未决队列中取出请求
2. 创建子进程处理业务
3. 关闭父进程中请求连接的socket cfd.
4. 非阻塞等待子进程的结束，回收子进程的资源。

子进程：负责去根据请求内容处理具体的业务。

1. 关闭从父进程继承来的socket文件描述符。
2. 从父进程继承来的文件描述符cfd中读取内容并处理
3. 向客户端返回内容
4. 关闭cfd文件描述符

代码参见：/net/multi-process/*
server.c
```c
#include <stdio.h>
#include <string.h>
#include "t_net_tcp.h"
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
int main(){

        // 接受客户端socket的addr
        ipv4_addr client;
        socklen_t addrlen =(socklen_t)sizeof(client);
        char ip[128];

        int sfd =s_bind(AF_INET,SOCK_STREAM,8080);
        if(sfd ==-1){
                return -1;
        }
        // 将socket 设置为被动监听状态
        // 未决队列的最大容量为5
        int res = listen(sfd,5);

        if (res == -1){
                perror("listen");
                return -1;
        }
        //  
        printf("listen successfully\n");
        while(1){
                // 当未决队列为空时，处于阻塞状态，
                // 否则取出第一个请求连接
                // 不获取客户端socket的地址和大小
                // 创建一个新的socket文件描述符
                //int cfd = accept(sfd,NULL,NULL);
                //获取客户端的地址
                int cfd = accept(sfd,(normal_addr *)&client,&addrlen);

                // 打印客户端的地址信息,需要经ip地址从binary 转到字符串
                printf("%s\n",inet_ntop(AF_INET,&client.sin_addr,ip,128));

                // 启用多进程去处理请求


                int pid = fork();
                if(pid == -1){
                        perror("fork");
                        return -1;
                }
                if(pid == 0){
                        // 子进程
                        close(sfd);
                        do_request_handle(cfd);
                        close(cfd);
                        exit(1);

                }else{
                        close(cfd);
                        //  非阻塞等待
                        waitpid(-1,NULL,WNOHANG);
                }


        }
        return 0;
}
```

do_request_handle.c

```c
#include "t_net_tcp.h"
#include <string.h>
#include <ctype.h>
void do_request_handle(int cfd){
         char * msg ="receive ok\n";
         char buff[128];

         // 从文件描述读取请求内容

         int r = read(cfd,buff,128);

         for(int i=0;i<r;i++){
                buff[i] = toupper(buff[i]);
         }
         //  输出到屏幕上
         write(cfd,buff,r);
         // 向客户端返回在数据
         write(cfd,msg,strlen(msg));
         // 模拟复杂业务的处理
         sleep(10);

}

```
其他的代码没有改变





