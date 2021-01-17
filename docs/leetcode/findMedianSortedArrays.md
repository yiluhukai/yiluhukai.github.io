## 数组的中位数

### 题目描述

```
//给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的中位数。 
//
// 进阶：你能设计一个时间复杂度为 O(log (m+n)) 的算法解决此问题吗？ 
//
// 
//
// 示例 1： 
//
// 输入：nums1 = [1,3], nums2 = [2]
//输出：2.00000
//解释：合并数组 = [1,2,3] ，中位数 2
// 
//
// 示例 2： 
//
// 输入：nums1 = [1,2], nums2 = [3,4]
//输出：2.50000
//解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
// 
//
// 示例 3： 
//
// 输入：nums1 = [0,0], nums2 = [0,0]
//输出：0.00000
// 
//
// 示例 4： 
//
// 输入：nums1 = [], nums2 = [1]
//输出：1.00000
// 
//
// 示例 5： 
//
// 输入：nums1 = [2], nums2 = []
//输出：2.00000
// 
//
// 
//
// 提示： 
//
// 
// nums1.length == m 
// nums2.length == n 
// 0 <= m <= 1000 
// 0 <= n <= 1000 
// 1 <= m + n <= 2000 
// -106 <= nums1[i], nums2[i] <= 106 
// 
// Related Topics 数组 二分查找 分治算法 
// 👍 3604 👎 0

```

### 归并排序

* 排序的思想

```
/*
归并排序:归并排序是将带排序的数组不断分割,直到带排序的数组长度为1时停止分割,对这些子数组合并排序,每次合并的两个子数组都是有序的,
最终得到一个新的有序的数组,归并排序是一种稳定的排序方式。
*/
```

* 代码实现

```go
func MergeSort(sli []int)[]int{
	// 递归的终止条件
	length:= len(sli)
	if length<= 1{
		return sli
	}
	orderSli1:= MergeSort(sli[0:length/2])
	orderSli2:= MergeSort(sli[length/2:])

	//将数组分成两半
	return merge(orderSli1,orderSli2)
}
// 合并两个有序的数组
func merge(orderSli1,orderSli2 []int)[]int{

	length1,length2:= len(orderSli1),len(orderSli2)

	res:=make([]int,0,length1+length2)
	i,j:=0,0
	for  i< length1 && j<length2 {
		if  orderSli1[i] <=orderSli2[j]{
			res = append(res, orderSli1[i])
			i++
		}else{
			res = append(res, orderSli2[j])
			j++
		}
	}
	// 有一个数组中的元素已经全部放入了res中

	if i == length1 {
		res = append(res, orderSli2[j:length2]...)
	}else{
		res = append(res,orderSli1[i:length1]...)
	}
	return res
}
```

### 基本解法

我们可以仿照归并排序的中合并两个数组的方法。将整两个数组合并，然后去获取数组中间位置的数字，求得中位数。

```
优化:当数组长度为奇数时，我们找到[n/2]的数字时，便没有必要去对数组排序了
偶数则去找[n/2-1]、[n/2]
```

* 代码的实现

```go
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	length1,length2 := len(nums1),len(nums2)
	// 两个数来存储中位数，
	m1,m2 :=0,0
	p1,p2 := 0,0
	length := (length1+length2)/2
	for i :=0;i <= length;i++{
		m1 = m2
		// 当p1小于length， p2移动到了最后位置或者p1的元素更小时，移动p1
		if p1 < length1 && ( p2 >= length2 || nums1[p1] < nums2[p2]  ){
			m2 =nums1[p1]
			p1++
		}else{
			// i< length 且不能移动p1,那么只能移动p2,此时p2肯定是小于length2
			m2 = nums2[p2]
			p2++
		}
	}
	// 判断奇偶

	if (length1+length2)%2 == 0{
		return float64(m1+m2)/2.0
	} else{
		return float64(m2)
	}

}

```

* 代码的执行效率和复杂度

```

  解答成功:
			执行耗时:12 ms,击败了92.59% 的Go用户
			内存消耗:5.3 MB,击败了100.00% 的Go用户
	时间复杂度， 移动了（（m+n）/2+1）次，时间复杂度为O(m+n)
	空间复杂度； O(1)
```



### 优化解法

* 解题思路

```
  中位数的性质:
				1. 中位数可以将数组分成两部分,中位数左边的元素都小于等于右边的数字

				2. 0<=中位数的右边的数字个数 - 中位数左边的数字个数<=1

				eg:[1,2,3] 的中位数为2,分成了左边[1,2]和右边[3],满足上面的两条性质
				eg:[1,3,4,6]的中位数是3.5,分成做了左边[1,3]和右边[2,4]
	从上面还可以看出来寻找中位数就是找一条线,将数组分成符合条件的两部分:[1,2,3] -> 1 2|3,[1,3,4,6] -> 1 3｜4 6
	两个数组的中位数也可以可以满足上面的条件:
				eg: [1,2,3]和[1,4,5,6],他的中位数的左边应该是[1,1,2,3] 右边[4,5,6],而他的中位数为3
	而我们也可以找到一条线,将两个数组分成上述条件的两部分
			1 2 3 |
			    1 | 4  5 6
	这条线可以出现在 1 2 3的任何位置,但是要同时满足条件只能在这个位置
	加入是在2和3之间:
			1 2 | 3
			1 4 | 5 6
	那么可以看到 4大于3,不满足中位数中左边小于等于右边的性质
	根据这条性质,我们可以知道 当这条线在一个数组中确定了,那么这条线在另一个位置就是确定了。所以我可以用两个数组中较小的来找这条线。
	同时由于两个数组都是有序的，我们还可以使用折半查找来找寻这个位置:上面的例子中 4 > 3,我们就只能可以排除这条线左边的位置。
			1 ｜ 2 3
        1 4 5  ｜ 6
	因为当去右边找是,3和四永远在不同边.

	所以折半查找的规律是：当num1边界的最大值(右边)  < nums2边界的最小值时(左边)->去右半边继续查找
                      当num1边界的最小值(左边) 	>  nums2边界的最大值时(右边)->去左半边查找
                     所以这个num1的值相当于折半查找的中间位置的值，而nums2的值相当于目标值
	最终的中位数的值,当为奇数时,是这条边界线左边最近位置的最大值,如上面的例子是max(3,1)
	当我偶数是,是边界左边最近位置的最大值和边界右边最近位置的最小值和的一半。
```

* 代码的实现

```go
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
		length1,length2 := len(nums1),len(nums2)
		// 在长度小的数组里面确定分界线的位置
		if length1 > length2 {
			return findMedianSortedArrays(nums2,nums1)
		}
		//nums1 	数组中分界线位置的开始和结束
		start,end := 0,length1
		// 二分查找分界线的位置
		// nums1和nums2中分界线的位置
		//fmt.Printf("nums1=%v,nums2=%v",nums1,nums2)
		seq1,seq2 :=0,0
		for start <= end {
			seq1 = (end + start)/2
			// 对应的seq2的位置也是可以确定的
			seq2 = ((length1+length2+1)/2) - seq1
			//验证这个位置是否符合中位数的要求
			if seq1<length1 &&  seq2 > 0 && nums1[seq1] < nums2[seq2-1] {
				start = seq1+1
			}else if seq1 >0 && seq2 < length2 && nums1[seq1-1] > nums2[seq2] {
				end = seq1-1
			}else{
				//满足条件
				break
			}
		}
		// 计算满足条件的中位数
		var leftVal,rightVal float64
		//nums1的左侧是为空的
		if seq1 == 0 {
			leftVal = float64(nums2[seq2-1])
		}else if seq2 == 0{
			leftVal = float64(nums1[seq1-1])
		}else{
			leftVal =  math.Max( float64( nums1[seq1-1]),float64( nums2[seq2-1]))
		}
		if (length1 + length2)%2 == 1{
			return  leftVal
		}
		// 为偶数
		if seq1 == length1{
			rightVal =  float64(nums2[seq2])
		}else if seq2 == length2 {
			rightVal =  float64(nums1[seq1])
		}else{
			rightVal = math.Min(float64( nums1[seq1]), float64(nums2[seq2]))
		}
		return (rightVal+leftVal)/2
}
```

* 代码的执行效率和复杂度

```
解答成功:
						执行耗时:12 ms,击败了92.59% 的Go用户
						内存消耗:5.3 MB,击败了100.00% 的Go用户
时间复杂度为 log(min(m,n)),空间复杂度为O(1)						
```

### 折半查找

* 折半查找要求查找的数组是有序的
* 递归实现

```go
func BinaryFind(sli []int,target int)bool{
	// 递归实现
	// 递归的终止条件，切片的长度为0
	length := len(sli)
	if length == 0{
		return  false
	}
	// 递归的过程和递推条件
	start,end :=0,length

	if half:=(end-start)/2;sli[half] == target{
		return true
	}else if sli[half] < target{
		//右半边去查找
		return BinaryFind(sli[half+1:end],target)
	}else{
		//左半边去查找
		return BinaryFind(sli[start:half],target)
	}
}
```

* 循环实现

```go
// 循环实现的折半查找
func BinaryFindByCircle(sli []int,target int)bool{
	// 递归实现
	// 递归的终止条件，切片的长度为0
	length := len(sli)
	if length == 0{
		return  false
	}
	// 递归的过程和递推条件
	start,end :=0,length-1

	for start<=end{
		//fmt.Printf("start=%v,end=%v\n",start,end)
		if half:=(end+start)/2;sli[half] == target{
			return true
		}else if sli[half] < target{
			//右半边去查找
			start = half+1
		}else{
			//左半边去查找
			end = half-1
		}
	}
	return false
}
```

* 两种实现方式的时间复杂度都是log(n),但是循环实现的空间复杂度为O(1),而递归实现的空间复杂度和递归的深度有关，所以空间复杂度log(n).



