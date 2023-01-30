(window.webpackJsonp=window.webpackJsonp||[]).push([[74],{425:function(a,s,t){"use strict";t.r(s);var n=t(42),e=Object(n.a)({},(function(){var a=this,s=a.$createElement,t=a._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h4",{attrs:{id:"java学习笔记"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java学习笔记"}},[a._v("#")]),a._v(" Java学习笔记")]),a._v(" "),t("h6",{attrs:{id:"_1-jdk的下载和安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-jdk的下载和安装"}},[a._v("#")]),a._v(" 1.jdk的下载和安装")]),a._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://www.oracle.com/java/technologies/downloads/archive/",target:"_blank",rel:"noopener noreferrer"}},[a._v("jdk的下载路径"),t("OutboundLink")],1)]),a._v(" "),t("li",[a._v("下载对应操作系统的版本进行安装")]),a._v(" "),t("li",[t("code",[a._v("java11.x")]),a._v("版本不想要自己配置环境变量，低版本的入8.x需要自己配置环境变量。")])]),a._v(" "),t("h6",{attrs:{id:"_2-jdk的目录结构"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-jdk的目录结构"}},[a._v("#")]),a._v(" 2.jdk的目录结构")]),a._v(" "),t("ul",[t("li",[a._v("mac下查找"),t("code",[a._v("jdk")]),a._v("的安装目录")])]),a._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[a._v("bruce@MacBook-Pro step1 % /usr/libexec/java_home -V\nMatching Java Virtual Machines "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(":\n    "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("11.0")]),a._v(".16 "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("x86_64"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Oracle Corporation"')]),a._v(" - "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"Java SE 11.0.16"')]),a._v(" /Library/Java/JavaVirtualMachines/jdk-11.0.16.jdk/Contents/Home\n/Library/Java/JavaVirtualMachines/jdk-11.0.16.jdk/Contents/Home\n\nbruce@MacBook-Pro Home % tree -L "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n├── README.html\n├── bin     // 该目录下主要存放JDK的各种工具命令\n├── conf    // 该目录下主要存放jdk的相关配置文件。\n├── include // 该目录下主要存放了一些平台的头文件\n├── jmods   // 该目录下主要存放了JDK的各种模块\n├── legal   // 该目录下主要存放了JDK各模块的授权文档。\n├── lib     // 该目录下主要存放了JDK工具的一些补充jar包和源代码。\n├── "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("man")]),a._v("\n└── release\n")])]),a._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[a._v("1")]),t("br"),t("span",{staticClass:"line-number"},[a._v("2")]),t("br"),t("span",{staticClass:"line-number"},[a._v("3")]),t("br"),t("span",{staticClass:"line-number"},[a._v("4")]),t("br"),t("span",{staticClass:"line-number"},[a._v("5")]),t("br"),t("span",{staticClass:"line-number"},[a._v("6")]),t("br"),t("span",{staticClass:"line-number"},[a._v("7")]),t("br"),t("span",{staticClass:"line-number"},[a._v("8")]),t("br"),t("span",{staticClass:"line-number"},[a._v("9")]),t("br"),t("span",{staticClass:"line-number"},[a._v("10")]),t("br"),t("span",{staticClass:"line-number"},[a._v("11")]),t("br"),t("span",{staticClass:"line-number"},[a._v("12")]),t("br"),t("span",{staticClass:"line-number"},[a._v("13")]),t("br"),t("span",{staticClass:"line-number"},[a._v("14")]),t("br"),t("span",{staticClass:"line-number"},[a._v("15")]),t("br"),t("span",{staticClass:"line-number"},[a._v("16")]),t("br")])]),t("h6",{attrs:{id:"_3-相关的概念"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-相关的概念"}},[a._v("#")]),a._v(" 3.相关的概念")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("JDK - 称为Java开发工具包( Java Development Kit)。Java开发人士需 要下载和安装JDK，目前的主流版本为JDK11。")])]),a._v(" "),t("li",[t("p",[a._v("JRE - 称之为Java SE运行时环境(Java SE Runtime Environment)，提供 了运行Java应用程序所必须的软件环境等。无论是开发还是运行Java应用 都必须安装。")])]),a._v(" "),t("li",[t("p",[a._v("javac.exe - 编译器，主要用于将高级Java源代码翻译成字节码文件。")])]),a._v(" "),t("li",[t("p",[a._v("java.exe - 解释器，主要用于启动JVM对字节码文件进行解释并执行。")])])]),a._v(" "),t("p",[t("img",{attrs:{src:"/java/java-relation.png",alt:"jdk,jre,jvm的关系"}})]),a._v(" "),t("h5",{attrs:{id:"_4-java开发的常用工具"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-java开发的常用工具"}},[a._v("#")]),a._v(" 4.Java开发的常用工具")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("文本编辑器(TE，Text Editor)")])]),a._v(" "),t("li",[t("p",[a._v("记事本、Notepad++、Edit Plus、UltraEdit、...")])]),a._v(" "),t("li",[t("p",[a._v("集成开发环境(IDE，Integrated Development Environment ) - Jbuilder、NetBeans、Eclipse、MyEclipse、IDEA、...")])])]),a._v(" "),t("h5",{attrs:{id:"_5-编写java程序的流程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-编写java程序的流程"}},[a._v("#")]),a._v(" 5.编写Java程序的流程")]),a._v(" "),t("ul",[t("li",[a._v("新建文本文档，将文件扩展名由xxx.txt修改为xxx.java;")]),a._v(" "),t("li",[a._v("使用记事本/Notepad++的方式打开文件，编写Java代码后进行保存;")]),a._v(" "),t("li",[a._v("启动dos窗口，并切换到.java文件所在的路径中;")]),a._v(" "),t("li",[a._v("使用javac xxx.java进行编译，生成xxx.class的字节码文件;")]),a._v(" "),t("li",[a._v("使用java xxx(不需要后缀) 进行解释执行，打印最终结果;")])]),a._v(" "),t("h5",{attrs:{id:"_6-常见的错误"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-常见的错误"}},[a._v("#")]),a._v(" 6.常见的错误")]),a._v(" "),t("p",[a._v("-错误:需要class,interface或enum =>通常都是class关键字拼写错误")]),a._v(" "),t("ul",[t("li",[a._v("错误: 找不到符号 => 通常因为单词拼写错误或Java中不支持这样的单词")]),a._v(" "),t("li",[a._v("错误: 需要';' => 通常都是因为少写分号，加上英文版分号即可")]),a._v(" "),t("li",[a._v("错误: 非法字符: '\\uff1b' => 通常是因为出现了中文标点符号，修改为英\n文版即可")]),a._v(" "),t("li",[a._v("错误: 在类 PrintTest 中找不到 main 方法, 请将 main 方法定义为: => main写成了mian")]),a._v(" "),t("li",[a._v("Java11新特性之简化的编译运行-使用java xxx.java 进行编译运行，打印最终结果(慎用);")])]),a._v(" "),t("p",[t("img",{attrs:{src:"/java/run-build.png",alt:"运行过程"}})]),a._v(" "),t("h5",{attrs:{id:"_7-windows常用的快捷键"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_7-windows常用的快捷键"}},[a._v("#")]),a._v(" 7.windows常用的快捷键")]),a._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("ctrl+s 保存 ctrl+c 复制 ctrl+v 粘贴 ctrl+a 全选 ctrl+x 剪切\nctrl+z 撤销 ctrl+f 搜索 ctrl+shift 切换输入法，使用shift进行中英文切换\nwindows+d 回到桌面 windows+e 打开计算机 windows+l 锁屏 windows+r 打开运行，输入cmd后回车就会启动dos窗口 windows+tab 切 换任务 alt+tab 切换任务\nctrl+alt+delete 启动任务管理器\n")])]),a._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[a._v("1")]),t("br"),t("span",{staticClass:"line-number"},[a._v("2")]),t("br"),t("span",{staticClass:"line-number"},[a._v("3")]),t("br"),t("span",{staticClass:"line-number"},[a._v("4")]),t("br")])]),t("h5",{attrs:{id:"_8-注释"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-注释"}},[a._v("#")]),a._v(" 8.注释")]),a._v(" "),t("ul",[t("li",[a._v("注释用于进行代码说明，是给程序员看的文字描述，编译器会忽略注释。")]),a._v(" "),t("li",[a._v("基本分类\n"),t("ul",[t("li",[a._v("// 单行注释 ，从 // 开始，到本行结束，都是注释。")]),a._v(" "),t("li",[a._v("0 /* "),t("em",[a._v("/ 多行注释，从/")]),a._v(" 开始，到*/结束，中间所有都是注释。")]),a._v(" "),t("li",[a._v("/** */ 多行/文档注释，从/*"),t("em",[a._v("开始，到")]),a._v("/结束，是一种支持提取的注释。")])])]),a._v(" "),t("li",[a._v("多行注释不允许嵌套使用!")])]),a._v(" "),t("h5",{attrs:{id:"_9-环境变量的配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_9-环境变量的配置"}},[a._v("#")]),a._v(" 9.环境变量的配置")]),a._v(" "),t("ul",[t("li",[a._v("配置方式\n计算机 => 右击，选择属性 => 高级系统设置 => 高级 => 环境变量 => 系统变量 => 找到Path，点击编辑 => 将javac.exe所在的路径信息配置到 Path变量值的最前面，加上英文版的分号 => 一路点击确定即可")]),a._v(" "),t("li",[a._v("注意事项 切记Path变量原来的变量值不要删除，配置完毕后记得重启dos窗口!")])]),a._v(" "),t("h5",{attrs:{id:"_10-java跨平台原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_10-java跨平台原理"}},[a._v("#")]),a._v(" 10.java跨平台原理")]),a._v(" "),t("ul",[t("li",[a._v("Java字节码可以通过JVM翻译为具体平台能够执行的机器指令。由于Sun 定义了JVM规范，而且不同的操作系统大多提供了JVM实现，才使得相同 的一个字节码文件可以在不同的系统上运行，从而使Java赢得了“一次编 译，到处使用”的美名。")])]),a._v(" "),t("p",[t("img",{attrs:{src:"/java/jvm.png",alt:"java跨平台原理"}})])])}),[],!1,null,null,null);s.default=e.exports}}]);