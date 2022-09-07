#### 多态

##### 1.多态的概念
- 多态主要指同一种事物表现出来的多种形态。 
- 饮料:可乐、雪碧、红牛、脉动、...
- 宠物:猫、狗、鸟、小强、鱼、...
- 人:学生、教师、工人、保安、...
- 图形:矩形、圆形、梯形、三角形、...

##### 2. 多态的语法格式
- 父类类型 引用变量名 = new 子类类型(); 
- 如:`Shape sr = new Rect(); sr.show()`;

```txt
1.可以把对象变量看作指针，对象变量的复制实际上是修改变量指向的地址：`Shape sr = new Rect()`
2. 由于我们使用的变量是sr类型的，那么我们只能访问到变量类型对应存储空间的属性和方法，
3. 当我们需要访问子类的属性和方法时，采用强制类型转换扩大了该类型在内存中的空间，可以访问到更多的方法。
```

##### 3.多态的特点
- 当父类类型的引用指向子类类型的对象时，父类类型的引用可以直接调 用父类独有的方法。
- 当父类类型的引用指向子类类型的对象时，父类类型的引用不可以直接 调用子类独有的方法。
- 对于父子类都有的非静态方法来说，编译阶段调用父类版本，运行阶段 调用子类重写的版本(动态绑定)。
- 对于父子类都有的静态方法来说，编译和运行阶段都调用父类版本。

##### 4.引用数据类型之间的转换
- 引用数据类型之间的转换方式有两种:自动类型转换 和 强制类型转换。
- 自动类型转换主要指小类型向大类型的转换，也就是子类转为父类，也
叫做向上转型。
- 强制类型转换主要指大类型向小类型的转换，也就是父类转为子类，也 叫做向下转型或显式类型转换。
- 引用数据类型之间的转换必须发生在父子类之间，否则编译报错。

##### 5.引用数据类型之间的转换
- 若强转的目标类型并不是该引用真正指向的数据类型时则编译通过，运 行阶段发生类型转换异常。
- 为了避免上述错误的发生，应该在强转之前进行判断，格式如下: if(引用变量 instanceof 数据类型) 判断引用变量指向的对象是否为后面的数据类型

```java

// 在强制类型转换之前应该使用instanceof进行类型的判断
// 判断sr指向堆区内存中的对象是否为Circle类型，若是则返回true，否则返回false
if(sr instanceof Circle) {
    System.out.println("可以放心地转换了！");
    Circle c1 = (Circle)sr;
} else {
    System.out.println("强转有风险，操作需谨慎！");
}
```

#### 6.多态的实际意义
- 多态的实际意义在于屏蔽不同子类的差异性实现通用的编程带来不同的 效果。


```java
// shape.java

public class Shape {
    private int x;
    private int y;

    public Shape() {
    }

    public Shape(int x, int y) {
        setX(x);
        setY(y);
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void show() {
        System.out.println("横坐标：" + getX() + "，纵坐标：" + getY());
    }

    // 自定义静态方法
    public static void test() {
        System.out.println("Shape类中的静态方法！");
    }
}

```

```java

//React.java

public class Rect extends Shape {
    private int len;
    private int wid;

    public Rect() {
    }

    public Rect(int x, int y, int len, int wid) {
        super(x, y);
        setLen(len);
        setWid(wid);
    }

    public int getLen() {
        return len;
    }

    public void setLen(int len) {
        if(len > 0) {
            this.len = len;
        } else {
            System.out.println("长度不合理哦！！！");
        }
    }

    public int getWid() {
        return wid;
    }

    public void setWid(int wid) {
        if (wid > 0) {
            this.wid = wid;
        } else {
            System.out.println("宽度不合理哦！！！");
        }
    }

    @Override
    public void show() {
        super.show();
        System.out.println("长度是：" + getLen() + "，宽度是：" + getWid());
    }

    // 自定义静态方法
    //@Override Error: 历史原因、不是真正意义上的重写
    public static void test() {
        System.out.println("---Rect类中的静态方法！");
    }
}


```


```java

// Circle.java

public class Circle extends Shape {
    private int ir;

    public Circle() {
    }

    public Circle(int x, int y, int ir) {
        super(x, y);
        setIr(ir);
    }

    public int getIr() {
        return ir;
    }

    public void setIr(int ir) {
        if (ir > 0) {
            this.ir = ir;
        } else {
            System.out.println("半径不合理哦！！！");
        }
    }

    @Override
    public void show() {
        super.show();
        System.out.println("半径是：" + getIr());
    }
}


```


```java

// ShapeTest.java

public class ShapeTest {

    // 自定义成员方法实现将参数指定矩形对象特征打印出来的行为，也就是绘制图形的行为
    // Rect r = new Rect(1, 2, 3, 4);
//    public static void draw(Rect r) {
//        r.show(); // 1 2 3 4
//    }
    // 自定义成员方法实现将参数指定圆形对象特征打印出来的行为
//    public static void draw(Circle c) {
//        c.show(); // 5 6 7
//    }
    // 自定义成员方法实现既能打印矩形对象又能打印圆形对象的特征，对象由参数传入  子类 is a 父类
    // Shape s = new Rect(1, 2, 3, 4);   父类类型的引用指向子类类型的对象，形成了多态
    // Shape s = new Circle(5, 6, 7);    多态
    // 多态的使用场合一：通过参数传递形成了多态
    public static void draw(Shape s) {
        // 编译阶段调用父类的版本，运行阶段调用子类重写以后的版本
        s.show();
    }

    public static void main(String[] args) {

        // Rect r = new Rect(1, 2, 3, 4);
        // r.show();
        ShapeTest.draw(new Rect(1, 2, 3, 4));
        ShapeTest.draw(new Circle(5, 6, 7));
    }
}


```

- 上面的一个`draw`方法，可以接受不同的`Shape`类型，调用他们的`draw`方法，来展示不同的信息，这就是多态。