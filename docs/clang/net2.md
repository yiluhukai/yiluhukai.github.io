#### ip地址 

ipv4和ipv6
ipv4四个字节，ipv6是16个字节。

IP地址由两部分组成，网络号和主机号，

192.168.1.111 

获取这个网络号需要子网掩码，假设子网掩码是255.255.255.0

那么网络号就是 192.168.1.111&255.255.255.0 =>192.168.1.0

所以这个网断可以分配256个地址，但是192.168.1.0代表网络号，192.168.1.255代表广播地址。所以可以有254个主机。

![1c8ae77417419ab5e51ed3a0cf26c49b](/clang/IP地址分类.png)
#### 集线器、交换机、路由器
![55c821c4381fa869a784d2242e72606e](/clang/533E9C55-6835-4F13-AC18-22021D580DAA.png)

集线器hub, 对电信号进行放大分流，物理层。收到信号后在将信号会将信号广播到链接这个集线器的所有电脑上，同时只能有一个电脑在通信。
![b656de2331a5d821d7cbdddc51bb00d4](/clang/6E946E56-D3C0-45F6-9BD5-A39813E97156.png)

交换机： 局域网中不同的主机间通信需要通过交换机。它传输的是以太网帧。工作在数据链路层。收到信号后将信号发给指定mac地址的网卡。

路由器： 不同的网络之间交换数据，需要通过路由器。他转发的是ip数据报。工作在网络层。

![b8bced8a4d6d1ee9c0759b713be7316b](/clang/3B65AE32-8668-409C-BE16-F71064952A2F.png)


#### 局域网之间的数据传输


![b656de2331a5d821d7cbdddc51bb00d4](/clang/6E946E56-D3C0-45F6-9BD5-A39813E97156.png)


比如小A和小E在一个局域网中，小A给小E发送数据，小A通过查询自己路由表发现两人在同一网段。

```shell
sudo route
```
然后查看自己的arp表，查找目标ip地址mac地址
```shell

sudo arp -a
```
当在arp表中找不到目标ip地址对应的ma地址，会在局域网中发起广播，目标ip地址的收到广播后会把自己的mac地址发送源ip地址，

然后源目标ip地址在链路层的以太网帧中填入目标mac地址，发送给出去。


#### 跨网段数据传输


ip数据包会先发给网关(和主机相连的路由器的ip地址)，网关将ip数据报的报文发送给目标主机的网关，有网关交给目标主机。



#### 基于tcp的编程
TCP/UDP位于传输层，
TCP 基于连接的可靠的数据传输，双向的基于流的。
UDP 基于数据包的， 不可靠的，但是比较高效。

连接的建立：通过三次握手建立,客户端：connect(2),服务器端：accept(2)


![66a81556bb623f394846ad298e74ae63](/clang/连接的建立.png)
![fca3d413ed842449ffdf2348f515e010](/clang/三次握手.png)


链接断开：四次分手

tcp编程模型
![4b9a0fdebb0435fbbeda954b066d45a9](/clang/tcp编程模型.png)

服务器端：
```
1. 创建一个用于通信的socket设备，返回socket的文件描述符。sfd
socket(2)
2. 绑定sfd和服务器的地址和端口绑定 bind(2)
3. 将服务器设置为被动连接模式，等待客户端连接的到来，连接到来时，将连接放入未决连接的队列中。未决连接指的是发送到服务器但是还没有处理的连接。listen(2)
while(1){
    4.从未决队列中取出一个连接，返回一个和客户端连接的文件描述符cfd,取不出来处于阻塞状态。accept(2)
    5.使用cfd读取客户端的请求 read(2)
    6.处理客户端的请求
    7.将处理结果返回给客户端 write(2)
    8.关闭cfd. close(2)
}
```

客户端
```
1.建立用于通讯的socket设置，返回文件描述符， sfd
socket(2)
2. 使用sfd连接服务器端，
connect(2)
3. 向服务器端发送数据
write(2)
4. 等待服务器端返回数据

5. 处理服务器返回的数据
read(2)
6. 告知服务器，关闭客户端的连接
close(2)
```


1. socket(2)

```
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>

int socket(int domain, int type, int protocol);

* 描述
socket()  creates  an endpoint for communication and returns a file descriptor that refers to that endpoint.  The file descriptor returned by a  successful call will be the lowest-numbered file descriptor not currently open for the process.

* 参数
1. domain：The domain argument specifies a communication domain; this selects  the
protocol  family  which will be used for communication. 

AF_INET      IPv4 Internet protocols
AF_INET6     IPv6 Internet protocols 
2. type
SOCK_STREAM    其实就是tcp 
Provides sequenced, reliable, two-way, connection-based byte  streams.  An out-of-band data transmission mechanism may be supported.

SOCK_DGRAM    其实就是udp 
Supports datagrams (connectionless, unreliable messages of a fixed maximum length).

protocol:The  protocol  specifies  a  particular  protocol  to  be used with the
socket.  Normally only a single protocol exists to support a particular
socket  type within a given protocol family, in which case protocol can
be specified as 0.

* 返回值

成功返回文件描述符，失败返回-1， errno设置。
```


2. bind(2)

```
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>

int bind(int sockfd, const struct sockaddr *addr,socklen_t addrlen);

* 描述

When a socket is created with socket(2), it exists in a name space (address family) but has no address assigned to it.   bind()  assigns  the address  specified  by  addr  to the socket referred to by the file descriptor sockfd.  addrlen specifies the size, in bytes, of the  address structure  pointed to by addr.

* 参数
1.sockfd 通过socket(2)创建的文件描述符

2.addr 
The  actual  structure  passed for the addr argument will depend on the address family.
address family ： ipv4 、ipv6
struct sockaddr {
               sa_family_t sa_family;
               char        sa_data[14];
}

3. addrlen  指向的结构体的大小。

* 返回值

成功返回0，失败返回-1，errno被设置。

```
3. listen(2)

```
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>

int listen(int sockfd, int backlog);


* 描述
listen()  marks  the  socket referred to by sockfd as a passive socket,
that is, as a socket that will be used to  accept  incoming  connection
requests using accept(2).

* 参数
1. The  sockfd  argument  is  a file descriptor that refers to a socket of type SOCK_STREAM or SOCK_SEQPACKET.

socket 是一个有连接的socket.

2. backlog

The backlog argument defines the maximum length to which the  queue  of pending  connections  for sockfd may grow. If a connection request arrives when the queue is full, the client may receive an error  with  an indication  of ECONNREFUSED or, if the underlying protocol supports retransmission, the request may be ignored so that a later  reattempt  at connection succeeds.

未决连接的最大值。根据底层协议不同客户端可能收到错误或者这个请求被忽略。

* 返回值
成功返回0，失败返回-1，errno被设置。
```


4. accept(2)

```
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>

int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);

* 描述
The  accept()  system  call  is used with connection-based socket types (SOCK_STREAM, SOCK_SEQPACKET).  It extracts the  first  connection  request  on  the  queue  of pending connections for the listening socket,sockfd, creates a new connected socket, and returns a new file descriptor  referring  to that socket.  The newly created socket is not in the listening state.  The original socket  sockfd  is  unaffected  by  this call.

从监听的socket中取出一个连接请求创建一个新的未监听状态的socket.-> cfd，原本处于监听状态的socket不受影响。

* 参数

1. sockfd：The  argument  sockfd is a socket that has been created with socket(2),bound to a local address with bind(2), and is listening for connections after a listen(2).

2. addr

The argument addr is a pointer to a sockaddr structure.  This structure is filled in with the address of the peer socket, as known to the  communications  layer.   The  exact format of the address returned addr is determined by the socket's address family (see socket(2)  and  the  
respective protocol man pages).  When addr is NULL, nothing is filled in;in this case, addrlen is not used, and should also be NULL.

addr是一个结构体指针，用客户端的socket来填充，

3. socklen_t

The addrlen argument is a value-result argument: the caller  must  initialize  it  to contain the size (in bytes) of the structure pointed to by addr; on return it will contain the actual size of the peer address.

* 返回值

成功返回当前进程的最小文件描述符，失败返回-1，errno被设置。and addrlen is left unchanged
```

5. connect(2)

```
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>
int connect(int sockfd, const struct sockaddr *addr,socklen_t addrlen);

* 描述
The  connect()  system call connects the socket referred to by the file descriptor sockfd to the address specified by addr. 

* 参数
1. sockfd

If  the  socket  is  of type SOCK_STREAM or SOCK_SEQPACKET, this call attempts to make a connection to  the  socket that is bound to the address specified by addr.

socket要求基于连接的socket.

2. sockaddr

服务器端socket的地址空间。the address specified by addr，

The format of the address in addr is determined by the address space of the socket sockfd;

3. addrlen

The addrlen  argument  specifies the size of addr.


* 返回值

成功返回0，失败返回-1，errno被设置。
```

scoket地址格式:



```
通用的地址格式：
struct sockaddr {
               sa_family_t sa_family;
               char        sa_data[14];
}
ipv4对应的地址格式 man 7 IP
struct sockaddr_in {
               sa_family_t    sin_family; /* address family: AF_INET */
               in_port_t      sin_port;   /* port in network byte order */
               struct in_addr sin_addr;   /* internet address */
           };

           /* Internet address. */
           struct in_addr {
               uint32_t       s_addr;     /* address in network byte order */
           };
           
两个结构体中的sa_family和sin_family字段，指定具体所使用的地址家族。

我们在代码中加入#include <netinet/ip.h>头文件，然后进行预编译。

可以看到typedef unsigned short int sa_family_t;
所以在结构体中sa_family占用两个字节

typedef uint16_t in_port_t;
typedef __uint16_t uint16_t;
typedef unsigned short int __uint16_t;

所以端口号也是无符号的短整形，占两个字节的长度。


struct in_addr是一个结构体类型，其中uint32_t是无符号整型，占4个字节，所以sin_addr也是占四个字节，

typedef __uint32_t uint32_t;
typedef unsigned int __uint32_t;

```
![17d1e3fcd4b7cb7ba2a776b0cba639a5](/clang/address.png)

```
当我们将struct sockaddr_in类型的地址转成struct sockaddr类型的地址时，sa_family和sin_family在内存中对应，
int_port和sin_addr在内存中对应sa_data中的前6个字节。我们使用connect和bind是指定了的addrlen指定了结构体的大小，我们只使用给定大小的空间便可以得到端口号和ipd地址。


struct sockaddr_in中要求sin_port为网络字节序，
网络字节序是大端的

主机字节序可能是大端也可能是小端。

```

主机字节序和网络字节序的转换


```
#include <arpa/inet.h>

uint32_t htonl(uint32_t hostlong);

uint16_t htons(uint16_t hostshort);

uint32_t ntohl(uint32_t netlong);

uint16_t ntohs(uint16_t netshort);

* 描述

convert values between host and network byte order
h代表host,n代表net,l代表l,s代表short
```

此外ip地址一般是点分10进制的字符串，而我们上面的结构体中要求的是uint32.这就需要从text --> binary

```
#include <arpa/inet.h>

int inet_pton(int af, const char *src, void *dst);

* 描述
convert IPv4 and IPv6 addresses from text to binary form,dst is written in network byte order.

* 参数
1. af
AF_INET ipv4
AF_INET6 ipv6
2. src
代表ip地址的字符串
3.dist
保存转化后结果的地址

* 返回值

成功返回1，src不是合法的ip地址，返回0，af不是合法的地址家族返回-1.


#include <arpa/inet.h>

const char *inet_ntop(int af, const void *src,char *dst, socklen_t size);
* 描述

convert IPv4 and IPv6 addresses from binary to text form

* 参数

af：同上

src:binary类型的ip地址

dst 用来接受转化后字符串的缓存区

size 制定了缓存区的大小

* 返回值
成功返回dst指针，失败返回NULL,errno被设置。

```
代表ip地址的宏，这些宏实质是16进制的数字，需要转换成网络字节序。
```
There are several special addresses: INADDR_LOOPBACK (127.0.0.1) always refers to the local host via the loopback device; INADDR_ANY (0.0.0.0) means any address for binding; INADDR_BROADCAST (255.255.255.255) means any host and has the same effect on bind as INADDR_ANY for historical reasons
```
```
代码参见：server.c client.c

```
setsockopt(2)

```
解决服务器频繁启用时系统资源回收不及时，端口占用的问题
```

























