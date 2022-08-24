#### java学习笔记

###### 1.jdk的下载和安装

* [jdk的下载路径](https://www.oracle.com/java/technologies/downloads/archive/)
* 下载对应操作系统的版本进行安装
* `java11.x`版本不想要自己配置环境变量，低版本的入8.x需要自己配置环境变量。

###### 2.jdk的目录结构

* mac下查找`jdk`的安装目录

```shell
bruce@MacBook-Pro step1 % /usr/libexec/java_home -V
Matching Java Virtual Machines (1):
    11.0.16 (x86_64) "Oracle Corporation" - "Java SE 11.0.16" /Library/Java/JavaVirtualMachines/jdk-11.0.16.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/jdk-11.0.16.jdk/Contents/Home

bruce@MacBook-Pro Home % tree -L 1 .
.
├── README.html
├── bin     // 该目录下主要存放JDK的各种工具命令
├── conf    // 该目录下主要存放jdk的相关配置文件。
├── include // 该目录下主要存放了一些平台的头文件
├── jmods   // 该目录下主要存放了JDK的各种模块
├── legal   // 该目录下主要存放了JDK各模块的授权文档。
├── lib     // 该目录下主要存放了JDK工具的一些补充jar包和源代码。
├── man
└── release
```

###### 3.相关的概念
- JDK - 称为Java开发工具包( Java Development Kit)。Java开发人士需 要下载和安装JDK，目前的主流版本为JDK11。

- JRE - 称之为Java SE运行时环境(Java SE Runtime Environment)，提供 了运行Java应用程序所必须的软件环境等。无论是开发还是运行Java应用 都必须安装。

- javac.exe - 编译器，主要用于将高级Java源代码翻译成字节码文件。

- java.exe - 解释器，主要用于启动JVM对字节码文件进行解释并执行。

![jdk,jre,jvm的关系](/java/java-relation.png)

##### 4.Java开发的常用工具
- 文本编辑器(TE，Text Editor)

- 记事本、Notepad++、Edit Plus、UltraEdit、...

- 集成开发环境(IDE，Integrated Development Environment ) - Jbuilder、NetBeans、Eclipse、MyEclipse、IDEA、...


##### 5.编写Java程序的流程
- 新建文本文档，将文件扩展名由xxx.txt修改为xxx.java;
- 使用记事本/Notepad++的方式打开文件，编写Java代码后进行保存;
- 启动dos窗口，并切换到.java文件所在的路径中;
- 使用javac xxx.java进行编译，生成xxx.class的字节码文件;
- 使用java xxx(不需要后缀) 进行解释执行，打印最终结果;

##### 6.常见的错误
-错误:需要class,interface或enum =>通常都是class关键字拼写错误
- 错误: 找不到符号 => 通常因为单词拼写错误或Java中不支持这样的单词
- 错误: 需要';' => 通常都是因为少写分号，加上英文版分号即可
- 错误: 非法字符: '\uff1b' => 通常是因为出现了中文标点符号，修改为英
文版即可
- 错误: 在类 PrintTest 中找不到 main 方法, 请将 main 方法定义为: => main写成了mian
- Java11新特性之简化的编译运行-使用java xxx.java 进行编译运行，打印最终结果(慎用);

![运行过程](/java/run-build.png)

##### 7.windows常用的快捷键
```
ctrl+s 保存 ctrl+c 复制 ctrl+v 粘贴 ctrl+a 全选 ctrl+x 剪切
ctrl+z 撤销 ctrl+f 搜索 ctrl+shift 切换输入法，使用shift进行中英文切换
windows+d 回到桌面 windows+e 打开计算机 windows+l 锁屏 windows+r 打开运行，输入cmd后回车就会启动dos窗口 windows+tab 切 换任务 alt+tab 切换任务
ctrl+alt+delete 启动任务管理器
```

##### 8.注释
- 注释用于进行代码说明，是给程序员看的文字描述，编译器会忽略注释。
- 基本分类
  - // 单行注释 ，从 // 开始，到本行结束，都是注释。
  - 0 /* */ 多行注释，从/* 开始，到*/结束，中间所有都是注释。
  - /** */ 多行/文档注释，从/**开始，到*/结束，是一种支持提取的注释。
- 多行注释不允许嵌套使用!

##### 9.环境变量的配置
- 配置方式
计算机 => 右击，选择属性 => 高级系统设置 => 高级 => 环境变量 => 系统变量 => 找到Path，点击编辑 => 将javac.exe所在的路径信息配置到 Path变量值的最前面，加上英文版的分号 => 一路点击确定即可
- 注意事项 切记Path变量原来的变量值不要删除，配置完毕后记得重启dos窗口!

##### 10.java跨平台原理

- Java字节码可以通过JVM翻译为具体平台能够执行的机器指令。由于Sun 定义了JVM规范，而且不同的操作系统大多提供了JVM实现，才使得相同 的一个字节码文件可以在不同的系统上运行，从而使Java赢得了“一次编 译，到处使用”的美名。

![java跨平台原理](/java/jvm.png)
