### 位运算

对于一个前端程序员，几乎用不到位运算，所以在位运算方面只能停留在语法层面，再不断的刷题过程中，也见到了各种各样关于位元素的秒用，不断的积累，逐步去强化这方面的缺失吧。

* 异或运算

  * 和命名一样，它的运算规则就是：二进制位上相同的时运算结果为0，不同时运算结果为1.

  * 性质一：x^x = 0 ,这个容易理解，因为x和x的二进制形式上对应的位置的数字上相同的。

  * 性质二：x^0 = x, eg:`0000 1111`^`0000 0000` = `0000 1111` ,每个位置的结果都是取决于x.

  * 性质三：满足结合律和交换律：

    * x ^ y ^ z = x ^ z ^ y = x ^ (z ^y)

    * x ^ y ^ x = x ^ x ^ y = 0 ^ y = y(结合上面的性质)

#### 使用异或:

* [136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/)`

```tex
//给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。 
//
// 说明： 
//
// 你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？ 
//
// 示例 1: 
//
// 输入: [2,2,1]
//输出: 1
// 
//
// 示例 2: 
//
// 输入: [4,1,2,1,2]
//输出: 4 
// Related Topics 位运算 数组 
// 👍 2094 👎 0
```

根据题意我们可以知道数组元素满足：**某个元素只出现一次以外，其余每个元素均出现两次**,那么我可以将数组中元素全部进行异或运算：`x ^ x ^ y ^ y ^ z = z`,最终得到的结果就是只出现一次的数字：

```go
func singleNumber(nums []int) int {
	ans := 0
	for _,num :=range nums{
		ans ^= num
	}
	return ans
}
```

* #### [268. 丢失的数字](https://leetcode-cn.com/problems/missing-number/)

```tex
//给定一个包含 [0, n] 中 n 个数的数组 nums ，找出 [0, n] 这个范围内没有出现在数组中的那个数。
//
// 
// 
//
// 
//
// 示例 1： 
//
// 
//输入：nums = [3,0,1]
//输出：2
//解释：n = 3，因为有 3 个数字，所以所有的数字都在范围 [0,3] 内。2 是丢失的数字，因为它没有出现在 nums 中。 
//
// 示例 2： 
//
// 
//输入：nums = [0,1]
//输出：2
//解释：n = 2，因为有 2 个数字，所以所有的数字都在范围 [0,2] 内。2 是丢失的数字，因为它没有出现在 nums 中。 
//
// 示例 3： 
//
// 
//输入：nums = [9,6,4,2,3,5,7,0,1]
//输出：8
//解释：n = 9，因为有 9 个数字，所以所有的数字都在范围 [0,9] 内。8 是丢失的数字，因为它没有出现在 nums 中。 
//
// 示例 4： 
//
// 
//输入：nums = [0]
//输出：1
//解释：n = 1，因为有 1 个数字，所以所有的数字都在范围 [0,1] 内。1 是丢失的数字，因为它没有出现在 nums 中。 
//
// 
//
// 提示： 
//
// 
// n == nums.length 
// 1 <= n <= 104 
// 0 <= nums[i] <= n 
// nums 中的所有数字都 独一无二 
// 
//
// 
//
// 进阶：你能否实现线性时间复杂度、仅使用额外常数空间的算法解决此问题? 
// Related Topics 位运算 数组 哈希表 数学 排序 
// 👍 490 👎 0
```

nums中的数字是[0,n] - x,nums1 =[0,n]nums 中的元素和nums1中的所有元素异或，得到的值就x.

```go
func missingNumber(nums []int) int {
	// n的值等于nums
	n := len(nums)
	x :=0
	for _,num := range nums{
		x ^= num
	}

	for i:=0;i<=n;i++{
		x ^= i
	}
	return x
}
```






