### 标准库函数
标准库函数是一些平台无关的通用函数。
1. printf(),scanf().
2. time(),srand(),rand()
3. strlen(),strcmp(),strcpy(),atoi(),abs().

#### malloc和free函数

malloc和free是程序运行时动态分配内存空间和手动销毁内存空间的函数。动态分配的内存空间需要手动释放。如果没有释放会造成内存泄漏。
1.void * malloc(size_t  size);
size是一个整形的数，用来表示需要申请的字节数，申请成功返回空间的首地址，申请失败，返回NULL.申请的空间在内存中是连续的。使用时候需要使用指针指向这块内存空间。由于是void * 类型的，所以需要先进行类型转换。

2 void free(void * ptr).
参数为内存空间的首地址，申请到的内存空间需要整体去释放。注意最后将指针指向NULL.

```c
  7 #include <stdio.h>
  8 #include <stdlib.h>
  9 
 10 
 11 int main(){
 12     //分配内存空间
 13     int *p =(int *) malloc(sizeof(int));
         if(NULL ==p){
            printf("内存分配失败!\n");
            return
         }
 14     *p =200;
 15     printf("%d\n",*p);
 16     //释放内存
 17     free(p);
 18     //将指针指向NULL,防止野指针
 19 
 20     p = NULL;
 21     return 0;
 22 }
```
可以申请一块内存空间用来存放结构体，函数中使用malloc申请的空间函数结束时不会释放，但是整个程序结束时会释放。
```c
  8 #include <stdio.h>
    9 #include <string.h>
   10 #include <stdlib.h>
   11 typedef struct{
   12     char *name;
   13     int age;
   14     //int height;
   15 }Person;
   16 
   17 Person *  input(){
   18     //该空间在函数执行结束时不会释放
   19     Person * p = (Person *)malloc(sizeof(Person));
   20     printf("%ld\n",sizeof(Person));// 16
   21     p->name="lijunjie";
   22     p->age =20;
   23     //p->height =170;
   24     return p;
   25 }
   26 
   27 void output(Person * p){
   28     printf("name=%s\n",p->name);
   29     printf("age=%d\n",p->age);
   30     //printf("age=%d\n",p->height);
   31 }
   32 
   33 
   34 
   35 int main(){
   36     Person* pi = input();
   37     output(pi);
   38     //释放malloc的内存空间
   39     free(pi);
   40     pi= NULL;
   41     return 0;
   42 }
```

//分配多个int类型的空间（相当int数组）
```c

//相当于int a[10];
int *p =(int *)malloc(sizeof(int) * 10); 
```
3.  void *calloc(size_t nmemb, size_t size);
calloc函数会对分配的内存空间进行清零，一个参数为申请的成员个数，第二个为成员大小，
malloc(sizeof(int)*10) 等价于 calloc(10,sizeof(int)

4.  void *realloc(void *ptr, size_t size);
    如果原来malloc分配的内存空间不够，那么可以使用realloc继续分配，第一个参数为原来的malloc分配的内存首地址，第二个为总的内存大小。如果在原来的区域被移动了，那么*ptr指向的内存空间会被释放。
上面所有分配内存空间的方法都需要free()手动释放。


### 时间相关的函数（time.h）

1. time_t time(time_t *tloc);
当传入的是一个NULL或者0，返回当前时间的（time() returns the time as the number of seconds since the Epoch, 1970-01-01 00:00:00 +0000 (UTC)）
```c
 int main(){
 11     long int sec = 0;
 12     sec = time(0);
 13     printf("%ld\n",sec);
 14     return 0;
 15 }   
```
当传入的是一个指针，用当前指针指向的变量保存秒数。
```c
 #include <stdio.h>
  7 #include <time.h>
  8 
  9 
 10 int main(){
 11     long int sec = 0;
 12     time(&sec);
 13     printf("%ld\n",sec);
 14     return 0;
 15 }

```
 2. char *ctime(const time_t *timep);
 接受一个秒数的指针，返回一个字符串格式的时间。
3. struct tm *localtime(const time_t *timep);
 接受一个秒数的指针，返回一个tm结构体，通过结构体可以获得年月日时分秒等信息。
4. char *asctime(const struct tm *tm);
 接受一个结构体指针，返回一个字符格式的日期
 5. struct tm *gmtime(const time_t *timep);
 返回格林威治时间
 

### 打开文件
#include <stdio.h>

#### FILE *fopen(const char *filename, const char *mode);
返回：成功为FILE指针，失败为NULL

mode是一个字符串，可以是下面的值。
1. r:只读的方式打开，不会删除文件的内容，文件不存在打开失败。返回的指针指向文件的开始位置
2.  r+：可读可写的方式打开，不会删除文件的内容，文件不存在打开失败。返回的指针指向文件的开始位置。
3. w: 以只写的方式打开文件，会删除文件的内容文件，不存在不会创建文件。
返回的指针指向文件的开始位置。
4. w+: 以可读可写的方式打开文件，会删除文件的内容，文件不存在会创建文件的内容。
返回的指针指向文件的开始位置。
5. a: 以追加的方式打开文件，不会清除文件的内容，如果不存在创建。返回的指针指向文件的结束位置。
6. a+：以最佳的方式打开文件并可读，不会删除文件的内容，文件不存在会创建。读文件的时候指向文件的开始，写文件的时候指向文件的结尾。
上面的六种模式都可以和b组合使用，如rb,w+b,这里的b指的是以二进制的方式进行操作。
####  int fclose(FILE *stream);
返回：成功返回0，失败返回EOF;

####   size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);

参数:ptr表示写入字符的指针，size代表写入的类型的大小，nmemb代表写入的个数,stream是带文件返回的指针。
返回值:返回的实际写入文件的个数

```c
7 #include <stdio.h>
    8 #include <stdlib.h>
    9 #include <string.h>
   10 int main(){
   11     //打开文件
   12     FILE * f = fopen("data.txt","w");
   13     if(NULL == f){
   14         printf("打开文件失败\n");
                exit(0);
   15     }
   16     //准备写入文件的内容
   17     char * str= "hello world!";
   18     fwrite(str,sizeof(char),strlen(str),f);
   19     //关闭文件
   20     fclose(f);
   21     f=NULL;
   22     return 0;
   23 }                       
```

写入一个整型数字
```c
int a =0x31; // ox31 -> 1
fwrite(str,sizeof(int),1,f);   
```
#### size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);

参数和上面类似，第一个参数是指向读取文件内容的指针。返回值表示读取的元素的个数。不能使用r+、w+、a+对文件先写后读，因为写入完成后指针指向了文件结束的位置。


### 文件流指针的操作
#### long ftell(FILE *stream);

返回当前文件流指针指向的位置（偏移的字节数）。

####   void rewind(FILE *stream);

将文件流指针指向文件的开始位置。


####  int fseek(FILE *stream, long offset, int whence);
参数:一是流指针,二是偏移量，可以是正的，也可以是负的。第三个是偏移相对的位置。可以是下面的三个宏：SEEK_SET, SEEK_CUR, or SEEK_END，分别代表文件的开始位置，当前位置，末尾位置。

```c
 7 #include <stdio.h>
    8 #include <stdlib.h>
    9 #include <string.h>
   10 
   11 typedef struct {
   12 
   13     char name[20];
   14     int age;
   15     int score;
   16 } Student;
   17 
   18 
   19 
   20 int main(){
   21 
   22     Student s = { "hello",20,80};
   23     //打开文件
   24     FILE * f = fopen("data.txt","w+");
   25     if(NULL == f){
   26         printf("打开文件失败\n");
                exit(0);
   27     }
   28     printf("%ld\n",ftell(f));
   29     //准备写入文件的内容,返回的使已写入的个数
   30     int i =fwrite(&s,sizeof(Student),1,f);
   31     printf("写入文件的个数%d\n",i);
   32 
   33     // 设置文件流指针的位置
   34 
   35     rewind(f);
   36 
   37     //打印文件流指针指向的位置
   38     printf("%ld\n",ftell(f));
   39 
>> 40     Student a[10]={0};
   41     //读取文件
   42     i=fread(a,sizeof(Student),1,f);
   43     printf("读入文件的个数%d\n",i);
   44     printf("%s\n",a[0].name);
   45     printf("%d\n",a[0].age);
   46     printf("%d\n",a[0].score);
   47     printf("当前文件流的位置%ld\n",ftell(f));
   48 
   49     //fseek(f,-8,SEEK_END);
   50     //  fseek(f,20,SEEK_SET);
   51     fseek(f,-8,SEEK_CUR);
   52     int age = fread(&age,sizeof(int),1,f);
   53     printf("age=%d\n",a[0].age);
   54     //修改学生的成绩
   55     int score=70;
   56     fwrite(&score,sizeof(int),1,f);
   57     rewind(f);
   58     fread(a,sizeof(Student),1,f);
   59     printf("name=%s\n",a[0].name);
   60     printf("age=%d\n",a[0].age);
   61     printf("score=%d\n",a[0].score);
   53     //关闭文件
   54     fclose(f);
   55     f=NULL;
   56     return 0;
   57 }
```

####  int printf(const char *format, ...);
#### int fprintf(FILE *stream, const char *format, ...);

printf(将文件内容输入到标准输出设置上 stdout.类似于
fwrite("hello",sizeof(char),6,stdout);

```c
 #include  <stdio.h>
 11 #include  <stdlib.h>
 12 typedef struct{
 13     char name[20];
 14     int age;
 15     int score;
 16 }Student;
 17 int main(){
 18     //printf("hello")
 19     fwrite("hello",sizeof(char),6,stdout);
 20 
 21     FILE* f =  fopen("123.txt","w+");
 22 
 23     if(!f){
 24         printf("文件打开失败");
             exit();
 25     }
 26     printf("文件打开成功");
 27     fprintf(f,"hello");
 28     Student s = {"name",24,90};
 29     fprintf(f,"%s,%d,%d",s.name,s.age,s.score);
 30     fclose(f);
 31     return 0;
 32 }
```
fprintf()保存到文件中的内容不会乱码是因为%d对数字进行了转换，在最终以字符串的形式保存在了文件中。fwrite()是以二进制的方式保存的。

####   int scanf(const char *format, ...);
####   int fscanf(FILE *stream, const char *format, ...);
scanf()从标准输入设备(键盘) stdin读取内容。fscanf()可以从文件中读取内容。


inpt : 从其他位置读取内容到内存。
output :从内存到其他的位置，例如写入数据到文件是输出。

### 字符的输入输出
1.  int putchar(int c);

输出一个字符到标准输出设备上stdout.

2.  int getchar(void);

从标准输入设备上读取一个字符

 getc() and getchar() return the character read as an unsigned char cast to an int or EOF on end of file or error。
 
 3.  int putc(int c, FILE *stream);
   
  可以指定输入的位置，putchar(c)等价于 putc(c,stdout);
 4.  int getc(FILE *stream);
    
  getchar相当于getc(stdin);
```c  
  8 #include <stdio.h>
  9 #include <stdlib.h>
 10 int main(){
 11 
 12     //打开一个文件
 13     FILE* f =fopen("hello.txt","r+");
 14     if(!f){
 15         printf("打开文件失败\n");
 16         exit(0);
 17     }
 18     printf("打开文件成功\n");
 19     int c =0;
 20     while((c =getc(f))!=EOF){
 21         printf("%c\n",c);
 22     }
 23     //写入文件内容
 24     //
 25     int s ='!';
 26     putc(s,f);
 27     fclose(f);
 28     return 0;
 29 }
```
### 字符串的输入输出

1.  int sprintf(char *str, const char *format, ...);
输入内容到字符串中（字符数组或者malloc分配空间的字符指针）；

2.  int sscanf(const char *str, const char *format, ...);
    读取字符串的内容并写入到其他的位置。
    
 
```c
8 #include <stdio.h>
    9 #include <stdlib.h>
   10 
   11 
   12 int main(){
   13 
   14     char* str =(char *)calloc(sizeof(char),20);
   15     if(!str){
   16         printf("分配内存空间失败！");
   17         return -1;
   18     }
   19     sprintf(str,"%s", "lijunjie 24 80");
   20     //
   21     typedef struct{
   22         char name[20];
   23         int age;
   24         int score;
   25     }Student;
   26 
   27     // 读取字符串的内容到结构体中；
>> 28     Student s ={0};
   29     sscanf(str,"%s%d%d",s.name,&s.age,&s.score);
   30     printf("name=%s\n",s.name);
   31     printf("age=%d\n",s.age);
   32     printf("score=%d\n",s.score);
           free(str);
           str =NULL;
   33     return 0;
   34 }
```

### scanf,fgets,gets;
char *fgets(char *s, int size, FILE *stream);
char *gets(char *s);
scanf:缺点是读取的字符不能有空格换行，且超过字符数组长度会溢出。
gets的问题是且超过字符数组长度会溢出

fgets的问题是:如果输入的长度小于size-1(会预留一个\0的位置)，会有\n被加入到数组中，如果长度大于size，只会存入size-1个字符，超过的部分会留在输入缓存区中，需要清除缓存区。

    
    
    



  
  




                                





















