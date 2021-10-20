### 指针高级
1. 二级指针
2. 万能指针（空指针）
3.  函数指针

### 指针使用的常见问题
1. 野指针：指针变量在声明的时候没有初始化。此时指针变量可以指向内存的任何地址。对指针变量指向的地址进行赋值操作，可能发生未知的错误。
2. 空指针，指针指向NULL(0地址)。不允许对NULL地址进行修改。将一个指针指向NULL,表明该指针不指向内存中的任何存储单元，此外，编译器会将NULL和0进行转化，所以他们是相等的。
3.  悬空指针：指针指向函数返回的(auto)局部变量的地址，变量在函数返回后被销毁，使用指针操作的地址不是预期的。但是可以返回static变量或者字符串常量的地址。
4. int * p,q;  p是一个指针变量，而q是一个int型变量。
### 二级指针

二级指针就是指向指针的指针，声明一个二级指针：
int ** p;其中的一个星表明他是一个指针，int * 表明他指向的是一个指针变量的地址。
```c
int a = 10;
int *p =&a;
//声明一个二级指针
int ** pa = &p;
printf("%d",**pa); //打印a的值
```
二级指针的作用

1 .在修改一个函数外的变量需要传递该变量的指针给函数，同样的，修改一个函数外的指针变量，也需要传递一个指针变量的指针。
2. 操作字符串数组

### void(空)指针（万能指针）

将一个整型指针赋值给一个char类型的指针，需要强制转换，且使用该指针每次只能读出一个字节的数据。
```c
  6 int main(){
  7 
  8     int i=0x21323334;
  9     //将char×类型的指针只想一个整形指针。
 10 
 11     char* p =( char *) &i;
 12     // 字符c对应的scill码为34.
 13     printf("%c\n",*p);
 14     printf("%c\n",*(p+1)); // 33 --> 3
 15     printf("%c\n",*(p+2)); // 32 --> 2
 16     printf("%c\n",*(p+3)); // 33 --> 1
 17     return 0;
 18 }
```
可以将任何类型的指针赋值给空指针，使用空指针时读取值时需要先进行类型转换。

```c
         char c = 'A';
         void * pa= &c; // 将字符类型赋值给空指针
         printf("c=%c\n",*(char *)pa);
```
空指针的作用
 1. 作为函数的形参，可以接受任何类型的指针作为实参。
 2. 动态类型分配的时候返回的指向该内存空间的指针为void * 类型的。
 
 
### 函数指针

C语言中函数也有存放的地址，可以直接使用函数名或&函数名取得地址。这一点和数组有点类似，int arr[] ={0}; arr == &arr;//true

```c
int  main(){
    printf("%p",&main);
    printf("%p",main);
}
```

```shell
objdump -S a.out //对可执行的文件反汇编
```
可以声明一个函数指针指向一个函数的地址。这个指针我们称之为函数指针。

```c
// 声明一个函数指针
// 返回值  指针标识符 指针变量名 函数的参数类型
int （* p）(int ,int) = NULL;

int add( int a,int b){
    return a+b;
}

//使用函数指针调用函数
p = add;
//下面两种写法是一样的，因为 p和*p都是add函数的地址
printf("%d",(*p)(2+3));
printf("%d",p(2+3);)
```

声明函数指针类型

```c
//声明函数指针类型
typedef int (*pa )(int,int);
//创建一个函数指针变量
pa p =add;
p(2+3) //5
```
函数指针的作用：
1. 作为函数的形参，可以给函数接受一个函数地址作为参数。 ->回调函数。

```c
 8 #include <stdio.h>
 9 int add( int a,int b){
 10 
 11 
 12     return a+b;
 13 }
 14 
 15 int sub(int a,int b){
 16 
 17     return a-b;
 18 }
 19 //声明一个函数指针类型
 20 typedef int (*pa)(int ,int);
 21 
 22 //接受第三个参数为一个函数指针
 23 int computed(int a,int b,pa p){
 24     return p(a,b);
 25 }
 26 int main(){
 27     //传入一个函数作为参数，函数会根据回调函数的不同进行不同的操作
 28     int sum =computed(2,3,add);
 29     int cha =computed(2,4,sub);
 30 
 31     printf("sum=%d\n",sum);
 32     printf("cha=%d\n",cha);
 33     return 0;
 34 }
```
2. 函数指针可以作为函数的返回值类型

```c
    8 #include <stdio.h>
    9 int add( int a,int b){
   10 
   11 
   12     return a+b;
   13 }
   14 
   15 int sub(int a,int b){
   16 
   17     return a-b;
   18 }
   19 //声明一个函数指针类型
   20 typedef int (*pa)(int ,int);
   21 
   22 //接受一个字符串，根据字符串的不同返回不同的函数
   23 pa useAmethod(char oper){
   24     if(oper =='+'){
   25         return add;
   26     }else{
   27         return sub;
   28     }
   29 }
   30 //接受第三个参数为一个函数指针
   31 int computed(int a,int b,char operator){
   32     //调用上面的方法
   33     pa method = useAmethod(operator);
   34 
   35     //调用method方法
   36 
   37     return method(a,b);
   38 
   39 }
   40 
   41 
   42 int main(){
   43     //传入一个函数作为参数，函数会根据回调函数的不同进行不同的操作
   44     int sum =computed(2,3,'+');
   45     int cha =computed(2,4,'-');
   46 
   47     printf("sum=%d\n",sum);
   48     printf("cha=%d\n",cha);
   49     return 0;
   50 }
```
3.可以声明一个函数指针数组

```c
typedef int (*pa) (int,int);
pa arr[10]; 
```




