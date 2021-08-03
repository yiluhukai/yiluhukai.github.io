#### 线段树

* 线段树是一种[二叉搜索树](https://baike.baidu.com/item/二叉搜索树)，与[区间树](https://baike.baidu.com/item/区间树)相似，它将一个区间划分成一些单元区间，每个单元区间对应线段树中的一个叶结点。 

* 对于线段树中的每一个非[叶子节点](https://baike.baidu.com/item/叶子节点)[a,b]，它的左儿子表示的区间为[a,(a+b)/2]，右儿子表示的区间为[(a+b)/2+1,b]。因此线段树是[平衡二叉树](https://baike.baidu.com/item/平衡二叉树)，最后的子节点数目为N，即整个线段区间的长度。
* 线段树是建立在[线段](https://baike.baidu.com/item/线段)的基础上，每个结点都代表了一条线段[a,b]。长度为1的线段称为元线段。非元线段都有两个子结点，左结点代表的线段为[a,(a + b) / 2]，右结点代表的线段为[((a + b) / 2）+1,b]。
* 长度范围为[1,L] 的一棵线段树的深度为log (L) + 1。这个显然，而且存储一棵线段树的空间复杂度为O(L）。

![线段树](/leetcode/lineSegment.png)

#### 如何构建一颗线段树

![构建线段树](/leetcode/build-lineSegment.png)

数组nums是一个[0,4]的线段，数组中的每个元素的相当于一个点。区间则代表线段,区间的值代表组成线段的元素点的和，最小的线段是自己到自己。如[0,0]这条线段的值(元素和)为0.[0,4]的线段的值(元素和)为14.

如何将上面的数组转化成后面的线段树呢？

根据线段树的特点：对于线段树中的每一个非[叶子节点](https://baike.baidu.com/item/叶子节点)[a,b]，它的左儿子表示的区间为[a,(a+b)/2]，右儿子表示的区间为[(a+b)/2+1,b]。因此线段树是[平衡二叉树](https://baike.baidu.com/item/平衡二叉树)，最后的子节点数目为N，即整个线段区间的长度。我们可以利用递归的方式去构建一颗线段树；

:::tip

由于线段树是一个完全二叉树，类似于堆，所以用数组这种先行结构存储更加的方便。其中父节点的下标为i,那么该节点的左子节点的下标为`2*i+1`,右子节点的下标为`2*i+2`.

:::

```go

package lineSegmentTree

type LineSegmentTree struct {
	// 存储线段树中元素的节点
	container []int
	n  int// 区间长度
	size int // 二叉树的节点个数
	nums []int // 存储原始点的数组
}
// 假设安全二叉树有x个节点，那么他的叶子节点个数为
// 最后一个节点的父节点的下标为  （x-1）-((x-1-1)/2)) =  n ,那么x === 2n
// 验证一下：n == 3
func NewLineSegmentTree(n int, nums []int) *LineSegmentTree{
	l := &LineSegmentTree{
		nums:nums,
		n:n,
		// 完全二叉树的叶子节点的个数等n,所以二叉树的节点个数为
		container: make([]int,n * 2),
	}
	l.build(0,0,n-1)
	l.container = l.container[:l.size]
	return l
}

//非叶子节点[a,b]，它的左儿子表示的区间为[a,(a+b)/2]，右儿子表示的区间为[(a+b)/2+1,b]
// index代表节点在线段树中的下标，left 和 right代表节点的左右区间值
func (l *LineSegmentTree)build(index,left,right int){
	l.size++
	if left == right{
		l.container[index] = l.nums[left]
		return
	}
	mid := (left + right) /2
	leftChildIndex,rightChildIndex := 2 * index +1,2*index+2
	l.build( leftChildIndex,left,mid)
	l.build( rightChildIndex,mid+1,right)
	l.container[index] = l.container[leftChildIndex] + l.container[rightChildIndex]
}


// 对区间求和[qLeft,qRight]的和
// index代表线段树中节点的下标，left和right代表节点的区间值[left,right]
func (l *LineSegmentTree)Query(index,left,right,qLeft,qRight int)int{
	// 两个区间没有交集
	if qLeft > right || qRight < left {
		return 0
	}
	// 求和区间包含当前的区间
	if qRight >= right && qLeft <= left{
		return l.container[index]
	}
	// 【left,right】和【qLeft，qRight】两个区间有交集，将[left,right]拆分成[left,mid] [mid+1,right]再去求和
	mid := (right +left) / 2
	leftSum := l.Query(index *2 +1,left,mid,qLeft,qRight)
	rightSum := l.Query(index*2 +2 ,mid+1,right,qLeft,qRight)
	return leftSum + rightSum
}

// 修改nums中的值，对线段树对应的节点做更新
// index代表线段树中节点的位置,节点的区间值[left,right]，
// position代表更新了的下标，value代表更新后的值
func (l *LineSegmentTree)Update(index,left,right,position,value int){
	// 如果是叶子结点
	if left == right && position == left {
		l.container[index] = value
		return
	}
	// 非叶子节点，递归去更新子节点的值，然后重新计算当前节点的值
	mid := (left + right)/2
	if position <= mid{
		//更新左子树
		l.Update(index * 2 + 1,left,mid,position,value)
	}else{
		l.Update(index * 2 +2,mid +1,right,position,value)
	}
	// 更新当前节点的和
	l.container[index] = l.container[index * 2 + 1] + l.container[index * 2 + 2]
}

```

:::tip

`Query`对区间求和利用了线段树中部分区间的和是计算好的，这样子的事件复杂度比直接遍历区间求和的效率高。

`Update`跟新了原区间中的值后跟新线段树而不是重新创建，这是因为更新操作只需要更新线段树中的部分值

:::

```go

package lineSegmentTree

import (
	"fmt"
	"testing"
)

func TestNewLineSegmentTree(t *testing.T) {
	l := NewLineSegmentTree(5, []int{0,1,3,4,6})
	fmt.Printf("%#v\n",l.container)

	sum := l.Query(0,0,4, 2,4)
	fmt.Printf("%v\n",sum)
	l.Update(0,0,4,0,2)
	fmt.Printf("%#v\n",l.container)
}

```

运行结果：

```shell
=== RUN   TestNewLineSegmentTree
[]int{14, 4, 10, 1, 3, 4, 6, 0, 1}
13
[]int{16, 6, 10, 3, 3, 4, 6, 2, 1}
--- PASS: TestNewLineSegmentTree (0.00s)
```

