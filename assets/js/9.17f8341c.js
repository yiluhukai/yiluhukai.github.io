(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{363:function(s,t,a){"use strict";a.r(t);var n=a(42),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h3",{attrs:{id:"数据结构主要研究的如何使用存储区-内存-存储数字"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#数据结构主要研究的如何使用存储区-内存-存储数字"}},[s._v("#")]),s._v(" 数据结构主要研究的如何使用存储区(内存)存储数字")]),s._v(" "),a("h3",{attrs:{id:"算法是研究常见问题的通用方法。"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#算法是研究常见问题的通用方法。"}},[s._v("#")]),s._v(" 算法是研究常见问题的通用方法。")]),s._v(" "),a("h3",{attrs:{id:"逻辑关系"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#逻辑关系"}},[s._v("#")]),s._v(" 逻辑关系")]),s._v(" "),a("p",[s._v("数据之间与计算机无关的关系叫做逻辑关系。逻辑结构有以下几种:")]),s._v(" "),a("ol",[a("li",[s._v("集合结构：所有数字都可以被看作一个整体。")]),s._v(" "),a("li",[s._v("线性结构: 可以使用一条有顺序的线将他们串联起来。")]),s._v(" "),a("li",[s._v("树种结构: 所有的数字都是从一个数字扩展开来，任何数字都可以扩展出多个数字。")]),s._v(" "),a("li",[s._v("网状结构: 不同的数字之间都可以有联系，不同的数字之间的关系互相无关的。")])]),s._v(" "),a("h3",{attrs:{id:"物理关系"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#物理关系"}},[s._v("#")]),s._v(" 物理关系")]),s._v(" "),a("p",[s._v("保存到数字的缓存区在内存的位置关系我们称之为物理关系。")]),s._v(" "),a("p",[s._v("物理关系：")]),s._v(" "),a("ol",[a("li",[a("p",[s._v("顺序结构：存储区在内容中是连续排列的，数组和动态分配内容都是顺序结构的例子。顺序结构中每一个存储区都会对应一个编号，我们可以根据对应的编号找到对应的存储区，这是顺序结构的一大优势。所以顺序结构适合从存储区里面找数字。缺点：存储区的个数是不能调整的，容易造成浪费。不适合插入和删除操作。")])]),s._v(" "),a("li",[a("p",[s._v("链式结构： 存储区在内存中相互独立，使用指针来指明他们间的关系。\n最简单的链式数据结构：单向链式数据结构，其中每个节点都是一个结构体，分别保存了数字和下一个结构体的位置。最后一个结构体的指针指向NULL;\n可以在单项链表的最开始位置加一个无效节点，这个我们称之为头节点。也可以在单项链表的最后的位置添加一个无效的节点，我们称这个节点为尾节点。单项线性链式结构不具备随机访问能力，不适合查找操作。\n链式物理结构适合插入删除操作。此外，链式物理结构中的节点可以通过动态分配自由调整。")])])]),s._v(" "),a("p",[s._v("存储数字--\x3e数字之间的关系（逻辑结构）---\x3e物理结构")]),s._v(" "),a("h3",{attrs:{id:"数据结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#数据结构"}},[s._v("#")]),s._v(" 数据结构")]),s._v(" "),a("p",[s._v("数据结构是由一组存储区和相关的管理函数组成的。这些函数提供了存储区的使用方法。")]),s._v(" "),a("h3",{attrs:{id:"_1-栈"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-栈"}},[s._v("#")]),s._v(" 1.栈")]),s._v(" "),a("p",[s._v("栈是一种后进先出的数据结构，每次只能向栈顶放入一个数字，每次也只能向栈顶取出一个数字。")]),s._v(" "),a("h4",{attrs:{id:"相关的操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#相关的操作"}},[s._v("#")]),s._v(" 相关的操作")]),s._v(" "),a("div",{staticClass:"language-c line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-c"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 初始化一个栈")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("initStack")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Stack"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//清空一个栈")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("clearStack")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Stack"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//判断栈里面是否满了")]),s._v("\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackIsFull")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Stack"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//计算栈中元素的个数")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackSize")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Stack"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 判断栈是否为空")]),s._v("\n\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackIsEmpty")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Stack "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 向栈里面加入数据")]),s._v("\n\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackPush")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Stack "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//先判断栈是否满了")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 从栈里取数据(并删除当前的数字)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//val用来保存获取到的数据")]),s._v("\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackPop")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Stack"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v("val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//获取栈顶的元素，但是不会删除栈顶元素")]),s._v("\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("stackTop")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Stack "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" stack"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v("val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br")])]),a("p",[s._v("全部操作进datastruct中的stack_main.c.")]),s._v(" "),a("h3",{attrs:{id:"_2-队列"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-队列"}},[s._v("#")]),s._v(" 2.队列")]),s._v(" "),a("p",[s._v("队列是一种先进先出的是数据结构。队列中的数据是有顺序的，先进入的在前面，后进入的在后面，每次只能取出或者放入一个数字。")]),s._v(" "),a("h4",{attrs:{id:"队列的操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#队列的操作"}},[s._v("#")]),s._v(" 队列的操作")]),s._v(" "),a("div",{staticClass:"language-c line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-c"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//初始化队列 ")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_init")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//销毁队列")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_clear")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//判断队列是否为空")]),s._v("\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_empty")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//判断队列是否满了")]),s._v("\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_full")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//返回队列的长度")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_size")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 向队列中加入元素")]),s._v("\n\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_push")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//从队列中取出元素，删除这个取出的元素")]),s._v("\n\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_pop")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("Seq_Queue"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//返回队列中最后的元素")]),s._v("\n\nbool "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("queue_front")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" Seq_Queue "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" seq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" val"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br")])]),a("h3",{attrs:{id:"简单队列和循环队列"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#简单队列和循环队列"}},[s._v("#")]),s._v(" 简单队列和循环队列")]),s._v(" "),a("p",[s._v("简单队列中tail一直向上增加，当数组满了就不能像数组中添加元素了。循环队列当队列满了会将tail指向head.此时无法区分空队列和满队列，所有我们有两种方法:")]),s._v(" "),a("ol",[a("li",[s._v("添加一个size属性来计算队列中的元素。")]),s._v(" "),a("li",[s._v("第二种就是队列中总是空着一个位置. 当 (tail+1)% Max =head时表明队列满了。")])]),s._v(" "),a("h3",{attrs:{id:"二叉树"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二叉树"}},[s._v("#")]),s._v(" 二叉树")]),s._v(" "),a("p",[s._v("二叉树是一种特殊的树结构，二叉树的每个节点最多只有两个节点，所以二叉树树是一种最简单的树结构。二叉树的每个节点又是一颗二叉树，左边的叫左子树，右边的叫右子树，所以二叉树的大部分操作可以用递归的方法实现。二叉树的操作可以分为对左子树、右子树和根节点的操作。")]),s._v(" "),a("h3",{attrs:{id:"算法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#算法"}},[s._v("#")]),s._v(" 算法")]),s._v(" "),a("p",[s._v("算法是用来解决常见问题的固定方法。同一个问题可以采用不同的方法解决，不同的方法使用不同的环境。")]),s._v(" "),a("ol",[a("li",[s._v("排序算法")]),s._v(" "),a("li",[s._v("查找算法")])]),s._v(" "),a("h4",{attrs:{id:"查找算法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查找算法"}},[s._v("#")]),s._v(" 查找算法")]),s._v(" "),a("p",[s._v("查找算法是从一组数字中查找某个数字的位置。")]),s._v(" "),a("p",[s._v("1.顺序查找")]),s._v(" "),a("p",[s._v("把要查找的数字和每个数字比较，知道找到位置，当数字之间没有规律时，只能采用顺序查找。")]),s._v(" "),a("p",[s._v("2.折半查找")]),s._v(" "),a("p",[s._v("使用前提是数字按某种顺序排列，每次用中间位置数字和要查找数字做对比，可以排除一半的数字，重复以上过程，就可以找到目标数字。")]),s._v(" "),a("h3",{attrs:{id:"数据结构是干什么的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#数据结构是干什么的"}},[s._v("#")]),s._v(" 数据结构是干什么的？")]),s._v(" "),a("p",[s._v("数据结构是用来封装数据类型。")])])}),[],!1,null,null,null);t.default=e.exports}}]);