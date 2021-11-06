### [367. 有效的完全平方数](https://leetcode-cn.com/problems/valid-perfect-square/)

```tex
//给定一个 正整数 num ，编写一个函数，如果 num 是一个完全平方数，则返回 true ，否则返回 false 。 
//
// 进阶：不要 使用任何内置的库函数，如 sqrt 。 
//
// 
//
// 示例 1： 
//
// 
//输入：num = 16
//输出：true
// 
//
// 示例 2： 
//
// 
//输入：num = 14
//输出：false
// 
//
// 
//
// 提示： 
//
// 
// 1 <= num <= 2^31 - 1 
// 
// Related Topics 数学 二分查找 
// 👍 298 👎 0
```

这道题是一道简单题，拿到这道题的时候第一想法是利用语言提供的开平方根的api来完成：

#### 方法一

```go
//解答成功:
//执行耗时:0 ms,击败了100.00% 的Go用户
//内存消耗:1.9 MB,击败了100.00% 的Go用户
func isPerfectSquare(num int) bool {
	n := int(math.Sqrt(float64(num)))
	return n * n == num
}
```

:::warning

这里的时间复杂度和语言的底层实现有关系，这些不作分析。

:::

还有一个思路，num是一个正整数，那么它的平方根就是`[1,num]（当num = 1,他的平方根是num）,所以我们可以利用二分查找在这个范围内去查找：

#### 方法二

```go
func isPerfectSquare(num int) bool {
	left,right := 1 ,num
	for left <= right{
		middle := (left + right + 1)/2
		if product:= middle * middle;product  == num{
			return  true
		}else if product  > num{
			right = middle - 1
		}else{
			left =  middle + 1
		}
	}
	return false
}
```

时间复杂度分析：

```tex
时间复杂度：O(logN), 空间复杂度：O(log(1))，这里的n是num的大小
```

`go`语言中的`api`里面提供了对二分查找的实现，可以利用这个`api`可以实现更简洁的代码：

```go
func isPerfectSquare(num int) bool {
		res := sort.Search(num, func(i int) bool {
			i++
			return i * i >= num
		})
		n :=  res +1
		return n * n == num
}
```

` sort.Search`函数的底层实现：

```go
func Search(n int, f func(int) bool) int {
	// Define f(-1) == false and f(n) == true.
	// Invariant: f(i-1) == false, f(j) == true.
	i, j := 0, n
	for i < j {
		h := int(uint(i+j) >> 1) // avoid overflow when computing h
		// i ≤ h < j
		if !f(h) {
			i = h + 1 // preserves f(i-1) == false
		} else {
			j = h // preserves f(j) == true
		}
	}
	// i == j, f(i-1) == false, and f(j) (= f(i)) == true  =>  answer is i.
	return i
}
```

函数的使用说明：

```go
Search uses binary search to find and return the smallest index i in [0, n) at which f(i) is true, assuming that on the range [0, n), f(i) == true implies f(i+1) == true. That is, Search requires that f is false for some (possibly empty) prefix of the input range [0, n) and then true for the (possibly empty) remainder; Search returns the first true index. If there is no such index, Search returns n. (Note that the "not found" return value is not -1 as in, for instance, strings.Index.) Search calls f(i) only for i in the range [0, n).

A common use of Search is to find the index i for a value x in a sorted, indexable data structure such as an array or slice. In this case, the argument f, typically a closure, captures the value to be searched for, and how the data structure is indexed and ordered.

For instance, given a slice data sorted in ascending order, the call Search(len(data), func(i int) bool { return data[i] >= 23 }) returns the smallest index i such that data[i] >= 23. If the caller wants to find whether 23 is in the slice, it must test data[i] == 23 separately.

Searching data sorted in descending order would use the <= operator instead of the >= operator.

To complete the example above, the following code tries to find the value x in an integer slice data sorted in ascending order:
// 函数签名
func Search(n int, f func(int) bool) int
```

* 这里的`f`函数应该是是二分查找中等于和下半区`[left,middle-1]`查找条件的集合。

```go
for i < j {
		h := int(uint(i+j) >> 1) // avoid overflow when computing h
		// i ≤ h < j
		if !f(h) {
			i = h + 1 // preserves f(i-1) == false
		} else {
			j = h // preserves f(j) == true
		}
}
```

* 当查找的元素不在有序的`slice`中时返回n
* 函数返回的结果是满足条件最小下标

使用的例子：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	a := []int{1, 3, 6, 10, 15, 21, 28, 36, 45, 55}
	x := 6

	i := sort.Search(len(a), func(i int) bool { return a[i] >= x })
	if i < len(a) && a[i] == x {
		fmt.Printf("found %d at index %d in %v\n", x, i, a)
	} else {
		fmt.Printf("%d not found in %v\n", x, a)
	}
}

// found 6 at index 2 in [1 3 6 10 15 21 28 36 45 55]
```

当`slice`是降序的可以修改条件（还是从该index开会的元素都满足条件）：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	a := []int{55, 45, 36, 28, 21, 15, 10, 6, 3, 1}
	x := 6

	i := sort.Search(len(a), func(i int) bool { return a[i] <= x })
	if i < len(a) && a[i] == x {
		fmt.Printf("found %d at index %d in %v\n", x, i, a)
	} else {
		fmt.Printf("%d not found in %v\n", x, a)
	}
}
// found 6 at index 7 in [55 45 36 28 21 15 10 6 3 1]
```

* `func SearchInts(a []int, x int) int`

```
SearchInts searches for x in a sorted slice of ints and returns the index as specified by Search. The return value is the index to insert x if x is not present (it could be len(a)). The slice must be sorted in ascending order.
```

使用：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	a := []int{1, 2, 3, 4, 6, 7, 8}

	x := 2
	i := sort.SearchInts(a, x)
	fmt.Printf("found %d at index %d in %v\n", x, i, a)

	x = 5
	i = sort.SearchInts(a, x)
	fmt.Printf("%d not found, can be inserted at index %d in %v\n", x, i, a)
}
// found 2 at index 1 in [1 2 3 4 6 7 8]
// 5 not found, can be inserted at index 4 in [1 2 3 4 6 7 8]
```

`sort.SearchInts`的底层也是使用上面的`Search`函数：

```go
// SearchInts searches for x in a sorted slice of ints and returns the index
// as specified by Search. The return value is the index to insert x if x is
// not present (it could be len(a)).
// The slice must be sorted in ascending order.
//
func SearchInts(a []int, x int) int {
	return Search(len(a), func(i int) bool { return a[i] >= x })
}
```

`sort.SearchFloat64s`的底层是`Search`函数：

```go
// SearchFloat64s searches for x in a sorted slice of float64s and returns the index
// as specified by Search. The return value is the index to insert x if x is not
// present (it could be len(a)).
// The slice must be sorted in ascending order.
//
func SearchFloat64s(a []float64, x float64) int {
	return Search(len(a), func(i int) bool { return a[i] >= x })
}
```

`sort.SearchStrings`的底层也是`Search`函数：

```go
// SearchStrings searches for x in a sorted slice of strings and returns the index
// as specified by Search. The return value is the index to insert x if x is not
// present (it could be len(a)).
// The slice must be sorted in ascending order.
//
func SearchStrings(a []string, x string) int {
	return Search(len(a), func(i int) bool { return a[i] >= x })
}
```

