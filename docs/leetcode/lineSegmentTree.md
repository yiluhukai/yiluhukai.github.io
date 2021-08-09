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

由于线段树是一个完全二叉树，类似于堆，所以用数组这种线行结构存储更加的方便。其中父节点的下标为i,那么该节点的左子节点的下标为`2*i+1`,右子节点的下标为`2*i+2`.

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
		container: make([]int,n * 4),
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

`Update`更新了原区间中的值后去更新线段树而不是重新创建线段树，这是因为更新操作只需要更新线段树中的部分值

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

假设区间的长度为N,那么创建一个线段树的时间复杂度为O(N),查询区间的某种值，时间复杂度为O(logN)

:::tip

线段树查询某个区间[l,r]的信息f([l,r])，那么要满足一个条件:m是区间中的一个点，f[l,r]可以由f[l,m]和f[m,r]求得。

:::

例题：

```
//给你一个整数数组 target 和一个数组 initial ，initial 数组与 target 数组有同样的维度，且一开始全部为 0 。
//
// 请你返回从 initial 得到 target 的最少操作次数，每次操作需遵循以下规则： 
//
// 
// 在 initial 中选择 任意 子数组，并将子数组中每个元素增加 1 。 
// 
//
// 答案保证在 32 位有符号整数以内。 
//
// 
//
// 示例 1： 
//
// 输入：target = [1,2,3,2,1]
//输出：3
//解释：我们需要至少 3 次操作从 intial 数组得到 target 数组。
//[0,0,0,0,0] 将下标为 0 到 4 的元素（包含二者）加 1 。
//[1,1,1,1,1] 将下标为 1 到 3 的元素（包含二者）加 1 。
//[1,2,2,2,1] 将下表为 2 的元素增加 1 。
//[1,2,3,2,1] 得到了目标数组。
// 
//
// 示例 2： 
//
// 输入：target = [3,1,1,2]
//输出：4
//解释：(initial)[0,0,0,0] -> [1,1,1,1] -> [1,1,1,2] -> [2,1,1,2] -> [3,1,1,2] (tar
//get) 。
// 
//
// 示例 3： 
//
// 输入：target = [3,1,5,4,2]
//输出：7
//解释：(initial)[0,0,0,0,0] -> [1,1,1,1,1] -> [2,1,1,1,1] -> [3,1,1,1,1] 
//                                  -> [3,1,2,2,2] -> [3,1,3,3,2] -> [3,1,4,4,2]
// -> [3,1,5,4,2] (target)。
// 
//
// 示例 4： 
//
// 输入：target = [1,1,1,1]
//输出：1
// 
//
// 
//
// 提示： 
//
// 
// 1 <= target.length <= 10^5 
// 1 <= target[i] <= 10^5 
// 
// Related Topics 栈 贪心 数组 动态规划 单调栈 
// 👍 37 👎 0
```

使用线段树来求解

```go
// 线段树 + 分治
// 找到target中当前区域[0,n-1]的最小值target[index]，将当前值s(上次增加的后的值，默认为0)变为target[index]，记录val = val + target[index]-s
// 然后当前区域划分成[0,index-1] 和 [index+1,n-1]两个区域继续上面额度过程
// 线段树的作用是为了让我们更好的求当前区域的最小值，我们在线段树中存储的最小值在线段树中的下标

// 创建一颗线段树

//解答成功:
//执行耗时:248 ms,击败了12.50% 的Go用户
//内存消耗:25.5 MB,击败了12.50% 的Go用户
// 时间复杂度 数组的区间长度为N,那么生成的线段的长度为4*N,我们是用递归来构造线段树的节点的，那么时间复杂度为O(log 4*N)
// 对于N个区间，我们可能需要查找每个区间的最小值，每个区间的最小值的查找时间复杂度为log(4 * N)
// 所以最终的时间复杂度为 O(N*Log 4* N) +O(N) ==> O(NlogN)

// 空间复杂度为: O(log 4*N) == > O(log N)

type SegmentTree struct {
	// 初始化传入的数组
	nums []int
	// 使用build方法构造的线段树
	values []int
	size int// 线段树的长度
	// 原始区间的宽度
	n int
}
// 因为线段树是一个完全二叉树，且叶子节点的数目等于原数组的长度 length，
// 假设线段树的最后一个节点的下标为 n,那么线段树中第一个非叶子节点的下标为,当 n是偶数的时候(n-2)/2，当n为奇数的时候 (n-1)/2
// 那么线段树中的叶子节点的个数 n - (n-1)/2 = length 或者 n - (n-2)/2 = length
//    n = 2length-1  或者 n == 2length-2
// 	长度为length的元素组可以得到一个长度为n+1(2length || 2length-1)的线段树。

func NewSegmentTree(nums []int)*SegmentTree{
	length := len(nums)
	s := &SegmentTree{
		nums:nums,
		values: make([]int, 4 * length),
		n: length-1,
	}
	s.build(0,0,s.n)
	return s
}
// s.values中的下标，原始的区间长度[left,right]
// values中保存的是nums最小值的下标
func (s * SegmentTree) build(pos,left,right int){
	// 没递归一层，线段树的长度就加1
	s.size++
	if left == right {
		s.values[pos] = left
		return
	}
	mid := (left + right)/2

	s.build(pos*2+1,left,mid)
	s.build(pos*2+2,mid+1,right)
	leftIndex,rightIndex := s.values[pos*2+1],s.values[pos*2+2]
	if s.nums[leftIndex] > s.nums[rightIndex] {
		s.values[pos] = rightIndex
		return
	}
	s.values[pos] = leftIndex
}

// 查询区间[qLeft,qRight]中的最小值在nums中的下标
func (s * SegmentTree)getMinValue(pos,qLeft,qRight,left,right int)int{
	if qLeft > qRight{
		return -1
	}
	if qLeft == left && qRight == right{
		return s.values[pos]
	}
	// 子节点的区间[left,mid] [mid+1,right]
	// 将区间[qLeft,qRight]拆分成[qLeft,min(qRight,mid)] 和max[mid+1,qLeft,qRight]
	mid := (left +right)/2

	leftIndex := s.getMinValue(pos * 2 + 1,qLeft,min(qRight,mid) ,left,mid)
	rightIndex := s.getMinValue(pos * 2 + 2,max(mid+1,qLeft),qRight,mid+1,right)


	if leftIndex == -1 {
		return rightIndex
	}
	if rightIndex == -1{
		return leftIndex
	}

	if s.nums[leftIndex] > s.nums[rightIndex] {
		return rightIndex
	}
	return  leftIndex
}
// 计算minValue 变为区间最小值的次数
func(s SegmentTree)getMinNumberOperations(minValue,left,right int)int{
	// 我们将区间划分成了[left,index -1] [index+1,right]
	if left  >  right{
		return 0
	}
	index := s.getMinValue(0,left,right, 0 ,s.n)
	leftTimes := s.getMinNumberOperations(s.nums[index],left,index-1)
	rightTimes := s.getMinNumberOperations(s.nums[index],index + 1,right)
	return s.nums[index] - minValue + leftTimes + rightTimes
}

func minNumberOperations(target []int) int {
	s := NewSegmentTree(target)
	return s.getMinNumberOperations(0,0,s.n)
}



func min(a,b int)int{
	if b < a {
		return b
	}
	return a
}

func max(a,b int)int{
	if b > a {
		return b
	}
	return a
}
```

:::warning

代码中存储线段树的长度 4*N不符合我们的计算，暂时没有想明白。

` index := s.getMinValue(0,left,right, 0 ,s.n)`中也未对下标为`-1`的情况做处理，是否需要处理呢？

:::

对于本题的更优解:[差分数组](https://cloud.tencent.com/developer/article/1629357)

差分数组是通过对原数组`target`的相邻两项做差构造出来的，

* 有 `d[i] = target[i]- target[i-1],d[0]= 0`;所以`target[i] = d[i]+ target[i-1]`;
* 原始数组同时加上或者减去一个数，差分数组不变
* 对原始数组中区间[a,b]对应的数做加减操作，差分数组d[a] 会相应的操作，而d[b+1]会反向操作。
* 差分数组的作用就是求多次进行修改后的原数组(`target[i] = d[i]+ target[i-1]`)
* 对原数组中区间上的修改反映到差分数组上，其实是差分数组中两项的修改(参照第三条性质)

对于数组`target`,我们初始值0到target[0]，我们需要`target[0]`次操作，而对于数组中两个相邻的数`target[i]、target[i+1]`,

如果`target[i] >= target[i+1]`,我们每次对`target[i]`的数操作的同时可以`target[i+1]`的数操作，所以需要的额外操作次数为0，

如果`target[i] < target[i+1]`,我们每次对`target[i]`的数操作的同时可以对`target[j]`的数操作，当`target[i]`符合预期的时候，我们还需要额外的操作对target[i+1].所以最终的操作次数为：

`target[0] + max(target[i],target[i-1],0)`次，i的范围为[1,length-1]

```go
//解答成功:
//执行耗时:128 ms,击败了100.00% 的Go用户
//内存消耗:7.8 MB,击败了100.00% 的Go用户
// 时间复杂度为O(n)
func minNumberOperations(target []int) int {
	length:=len(target)
	if length == 0{
		return 0
	}
	total := target[0]
	for i:=1;i < length;i++{
		total += max(target[i]-target[i-1],0)
	}
	return total
}

func max(a,b int)int{
	if b > a {
		return b
	}
	return a
}
```

本题来源：[数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/solution/shu-zu-zhong-de-di-kge-zui-da-yuan-su-by-leetcode-/)

相似的例题：[leetcode 307](https://leetcode-cn.com/problems/range-sum-query-mutable/)





