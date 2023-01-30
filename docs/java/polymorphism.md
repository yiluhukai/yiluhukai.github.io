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

##### 抽象方法的概念
- 抽象方法主要指不能具体实现的方法并且使用abstract关键字修饰，也就 是没有方法体。
- 具体格式如下:
    - 访问权限 abstract 返回值类型 方法名(形参列表);
    - `public abstract void cry()`;


##### 抽象类的概念
- 抽象类主要指不能具体实例化的类并且使用abstract关键字修饰，也就是不能创建对象。

##### 抽象类和抽象方法的关系
- 抽象类中可以有成员变量、构造方法、成员方法;
- 抽象类中可以没有抽象方法，也可以有抽象方法;
- 拥有抽象方法的类必须是抽象类，因此真正意义上的抽象类应该是具有 抽象方法并且使用abstract关键字修饰的类。

##### 抽象类的实际意义
- 抽象类的实际意义不在于创建对象而在于被继承。
- 当一个类继承抽象类后必须重写抽象方法，否则该类也变成抽象类，也 就是抽象类对子类具有强制性和规范性，因此叫做模板设计模式。

##### 开发经验分享
- 在以后的开发中推荐使用多态的格式，此时父类类型引用直接调用的所 有方法一定是父类中拥有的方法，若以后更换子类时，只需要将new关键 字后面的子类类型修改而其它地方无需改变就可以立即生效，从而提高 了代码的可维护性和可扩展型。
- 该方式的缺点就是:父类引用不能直接调用子类独有的方法，若调用则 需要强制类型转换。

抽象类的应用
- 银行有 定期账户和活期账户。继承自 账户类。账户类中: 
- getLixi()和具体存取方式又关系，不能直接实现，定义成抽象的方法更合理。

```java
// Account.java

public class Account{
    private double money;
    public double getLixi(){}
}
```

```java
package com.bruce.classSample;

public abstract class Account {
    public Account(double money) {
        this.money = money;
    }

    public double getMoney() {
        return money;
    }

    public void setMoney(double money) {
        if(money >=0){
            this.money = money;
        }else{
            System.out.println("money is invalid!");
        }
    }

    private double money;

    // 计算利息
    public abstract double getInterest();
}

```

```java
// FixedAccount.java

public class FixedAccount extends Account{
    public FixedAccount(double money) {
        super(money);
    }

    @Override
    public double getInterest() {
        // 定期：利息 = 本金 *  利率 * 时间
        return this.getMoney() * 0.01 * 1;
    }

    public static void main(String[] args) {
        Account ac = new FixedAccount(1000);
        ac.getInterest();
    }

}


```

##### 关于抽象类的注意使用

- 不能同时使用`final`和`abstract`修饰类，不能继承且不能实例化的类毫无意义。`public final abstrabct Account`.
- 不能用`final`和`abstract`同时修饰方法，这样方法没有方法体且不能被重写。
- 不能用`private`和`abstract`同时修饰方法，因为这个方法不能被子类继承和重写。
- 不能用`static`和`abstract`修饰方法，因为可以通过类去掉用，但是方法有没有具体实现，没有意义。

##### 接口

- 接口就是一种比抽象类还抽象的类，体现在所有方法都为抽象方法。
- 定义类的关键字是class，而定义接口的关键字是interface。
- 如:金属接口、货币接口、黄金类，黄金类可以实现金属借口和和货币借口，接口正是为了解决java中不支持类的多继承。
  - 接口中只能有常量
  - 接口中只能有抽象方法(默认方法例外)
  - 接口中可以有私有方法
  - 接口中可以有默认方法
  - 接口中可以有静态方法

```java
package com.bruce.classSample;

public interface Money {
    // 常量：public final static可省略
    public final static String UNIT = "$";

    // 私有方法，为了在借口内部复用，jdk1.9开始支持
    private void show(){
        System.out.println("这是一个私有的方法");
    };

    // 默认方法，子类实现时可以重写也可以不重写
    public default void show1(){
        show();
        System.out.println("show1");
    }

    // 抽象方法：public abstract 可以省略
    public abstract void  buy();

    //静态方法
    public static void descriptor(){
        System.out.println("this is a money");
    }
}

```

```java

package com.bruce.classSample;

public class Gold implements Money{
    @Override
    public void show1() {
        Money.super.show1();
        System.out.println("this is show1");
    }

    @Override
    public void buy() {
        System.out.println("this is bud method");
    }

    public static void main(String[] args) {
        Money m1= new Gold();
        m1.buy();
        m1.show1();
    }
}

```

##### 接口和类的关系

|名称|关键字|关系|
|----|----|----|
| 类和类之间的关系 | 使用extends关键字表达继承关系 |支持单继承|
 类和接口之间的关系|使用implements关键字表达实现关系|支持多实现|
|接口和接口之间的关系|使用extends关键字表达继承关系|支持多继承|

##### 抽象类和接口的主要区别(笔试题)
- 定义抽象类的关键字是abstract class，而定义接口的关键字是interface。 - 继承抽象类的关键字是extends，而实现接口的关键字是implements。
- 继承抽象类支持单继承，而实现接口支持多实现。
- 抽象类中可以有构造方法，而接口中不可以有构造方法。
- 抽象类中可以有成员变量，而接口中只可以有常量。
- 抽象类中可以有成员方法，而接口中只可以有抽象方法。
- 抽象类中增加方法时子类可以不用重写，而接口中增加方法时实现类需
要重写(Java8以前的版本)。
- 从Java8开始增加新特性，接口中允许出现非抽象方法和静态方法，但非
抽象方法需要使用default关键字修饰。
- 从Java9开始增加新特性，接口中允许出现私有方法。
