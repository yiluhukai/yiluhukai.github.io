### 无重复字符的最长子串

## 题目描述

```tiki wiki
//给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。 
//
// 
//
// 示例 1: 
//
// 
//输入: s = "abcabcbb"
//输出: 3 
//解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
// 
//
// 示例 2: 
//
// 
//输入: s = "bbbbb"
//输出: 1
//解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
// 
//
// 示例 3: 
//
// 
//输入: s = "pwwkew"
//输出: 3
//解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
// 
//
// 示例 4: 
//
// 
//输入: s = ""
//输出: 0
// 
//
// 
//
// 提示： 
//
// 
// 0 <= s.length <= 5 * 104 
// s 由英文字母、数字、符号和空格组成 
// 
// Related Topics 哈希表 双指针 字符串 Sliding Window 
// 👍 4728 👎 0
```

* 暴力解法

> 解题思路：使用双指针去截取字符串串中所有字串并保存到一个切片中，然后遍历切片去计算字串的最大长度

```go
func lengthOfLongestSubstring(s string) int {
	// 空字符串
	length :=len(s)
	if length == 0{
		return 0
	}
	subStrs := make([]string,0)
	// 字符串对应的切片
	strSli := []byte(s)
	// 字符串的长度大于1
	for start:=0;start<length;start++{
		for end:=start+1;end<=length;end++{
			if subStr := string(strSli[start:end]);end == length || strings.Contains(subStr,string(s[end])){
				subStrs = append(subStrs,subStr)
				break
			}
		}
	}
	// 获取字串的最大长度
	maxLen := 1
	for _,str := range subStrs{
		if length:=len(str);length>maxLen {
			maxLen = length
		}
	}
	return maxLen
}
```

	解答成功:
					执行耗时:172 ms,击败了11.27% 的Go用户
					内存消耗:18.4 MB,击败了5.15% 的Go用户
> 这种方法就是列出当前字符串的所有字串，最长的可能是自己，最短的是单个字符组成的字符串，计算出最大长度然后返回。

	时间复杂度：O(n^3) ,两次for循环，还有截取子串的操作
	空间复杂度：O(n^2) 空间复杂度主要来自对子串的存储，子串最多有n(n+1)/2个， eg:abcd 有10个这种子串 
	综上可知时间复杂度和空间复杂度都比较高。
* 优化解法

由于我们需要的是最长子串的长度，所以我们可以去使用一个变量保存最长的子串的长度，当长度大于这个值的时候更新，从而不需要去保存子串，这样子可以降低所需要的空间复杂度。

```go
func lengthOfLongestSubstring(s string) int {
	// 空字符串
	length :=len(s)
	if length == 0{
		return 0
	}
	maxLen := 1
	// 字符串对应的切片
	strSli := []byte(s)
	// 字符串的长度大于1
	for start:=0;start<length;start++{
		for end:=start+1;end<=length;end++{
			if subStr := string(strSli[start:end]);end == length || strings.Contains(subStr,string(s[end])){
				if length:=len(subStr);length > maxLen {
					maxLen = length
				}
				break
			}
		}
	}
	return maxLen
}
```

```
解答成功:
					执行耗时:124 ms,击败了11.86% 的Go用户
					内存消耗:6.8 MB,击败了11.00% 的Go用户
```

可以看到时间复杂度和空间复杂度都有提高，时间复杂度的提高主要来源于我们不需要去遍历保存子串的切片。

```wiki
时间复杂度：O(n^3),代码的中双重for循环和截取子串的操作依然存在。
空间复杂度：O(n^2),代码中还是需要截取子串，最多可以有你你n(n+1)/2个字串
```

* 优化解法

> 使用hashtable和双指针去验证字符是否在子串中重复,right和left分别指向字符串的开始，当时right指向的字符不在hash table中，right++，且将字符加入的hash table里，此时hash table 保存的是当前无重复的字串字符，len = right-left+1;当出现重复的元素时，我们不能确定重复的元素在子串的什么位置，所以我们需要删除子串最左边的元素，然后去检测是否可以和右边的字符去重新构成一个新的无重复子串。

```
字符串：“abbcd”
当我们的字串为ab时,我们检测到下一个字符b不能去和ab构成一个新的无重复子串，我们先需要删除a,发现bb组成的还是重复子串，所有我们需要从b开始去构建新的字串。
```

```go
// 自己实现一个简单的hash表
type HashTable struct {
	Array [128]byte
}

func hash(data byte)int{
	return int(data)
}

func (ht * HashTable)GetData(data byte)(isExist bool){
	index:= (len(ht.Array)-1)&hash(data)
	if d := ht.Array[index];d != 0{
		isExist =true
	}else{
		isExist =false
	}
	return
}

func (ht * HashTable)AddData(data byte){
	index:= (len(ht.Array)-1)&hash(data)
	ht.Array[index] =  data
}

func (ht * HashTable)DeleteData(data byte){
	index:= (len(ht.Array)-1)&hash(data)
	ht.Array[index] = 0
}

func lengthOfLongestSubstring(s string) int {
	maxLen,left,right,length := 0,0,0,len(s)
	ht := new(HashTable)
	for right <  length {
		// 检测元素在hashTable中是否存在
		if isExist := ht.GetData(s[right]);isExist {
			// 说明字符在字串中已经存在
			ht.DeleteData(s[left])
			left++
		}else{
			//  存入hash表中
			ht.AddData(s[right])
			right++
			if  size :=  right - left;size > maxLen{
				maxLen =size
			}

		}
	}
	return maxLen
}
```

```
	解答成功:
						执行耗时:4 ms,击败了90.21% 的Go用户
						内存消耗:2.5 MB,击败了90.78% 的Go用户
```

```
时间复杂度：我们只需要遍历一次字符串，所以时间复杂度为O(n)
空间复杂度：哈希表的长度时128，常数级别的，所以时O(1)
```

* 最优解

> 使用双指针和hash table的效率已经很高了，但是当每次出现重复的子符是，我们需要不断的移动left指针去删除与right指针指向的元素。当重复的字符和right相邻时，这个时候我们需要不断移动left，指针left=right.这样子当right和left相差很大的时候，频繁的移动比较耗费时间。我们可以让hash table中保存当前字符的索引。
>
> 当重复时我们直接移动left到当前索引+1的位置，由于我们的left指针时跳跃移动的，没有去删除hash table中的保存的索引，当下次元素出现重复的时候，重复位置的索引是小于left.只有大于left的索引才是合法的。
>
> 不管字符是否已经存在，我们都需要去更新hash table中right指向字符的索引。

```go
/*
	在上面代码的基础上进行优化，hash table中保存字符的位置信息，这样子当元素重复的时候可以快速的定位left的位置
 */


// 自己实现一个简单的hash表
type HashTable struct {
	Array [128]int
}

func hash(data byte)int{
	return int(data)
}
//  初始化hash table中的值
func (ht * HashTable)Init(val int){
	for index := range ht.Array{
		ht.Array[index] = val
	}
}

func (ht * HashTable)GetData(data byte)(val int,isExist bool){
	index:= (len(ht.Array)-1)&hash(data)
	if val = ht.Array[index];val != -1{
		isExist =true
	}else{
		isExist =false
	}
	return
}

func (ht * HashTable)AddData(data byte,position int){
	index:= (len(ht.Array)-1)&hash(data)
	ht.Array[index] =  position
}

func (ht * HashTable)DeleteData(data byte){
	index:= (len(ht.Array)-1)&hash(data)
	ht.Array[index] = 0
}




func lengthOfLongestSubstring(s string) int {
	maxLen,left,right,length := 0,0,0,len(s)
	ht := new(HashTable)
	//  将hash table 中的位置信息全部初始化为-1
	ht.Init(-1)
	for right <  length {
		// 检测元素在hashTable中是否存在
		if pos,isExist := ht.GetData(s[right]);isExist {
			// 说明字符在字串中已经存在，移动left指针到指定位置
			leftIndex := pos + 1
			if leftIndex > left{
				left =  leftIndex
			}
		}
		//  无论字符是否相等，我们都需要去保存right指向字符的位置
		ht.AddData(s[right],right)
		//  计算当前子串的长度
		if length:=right-left+1;length > maxLen{
			maxLen = length
		}
		right++
	}
	return maxLen
}
```

```
	解答成功:
						执行耗时:0 ms,击败了100.00% 的Go用户
						内存消耗:2.5 MB,击败了99.28% 的Go用户
```

```
时间复杂度：O(n) 遍历字符串一次
空间复杂度：O(1) hash table的底层数组
```

## 哈希表

哈希表又叫散列表。这种数据结构提供了健和值的映射关系，给出一个key就可以在O(1)的时间内找出对应的value.哈希表的底层使用数组去实现的，而将key转成数组的下标的方法便是哈希函数。java中每个对象都有有个HashCode，我们可以使用取模运算来得到数组的下标。

```
index = HashCode / Array.length
```

但是通常使用效率更高的位运算

```
index = HashCode & (Array.length-1)
```

当两个对象通过哈希函数得到数组的下标相等时，这时候就会产生哈希冲突。解决哈希冲突的方法有：

* 开放地址法

所谓的开放地址法就是当出现当对应下标已经有值时，我们就去找一个新的位置，如找当前下表的后一个，如果后一个还有值，那就再后一个，直到没有被占用被值。

* 链表法

链表法就是数组的每一个元素是链表的头指针，当出现哈希冲突时，将后面的值添加到链表上。

我们查找某个key对应的值。由于有哈希冲突，一个key可能在哈希表中对应多个值，以链表法为例，key -> index上的链表有多个节点，我们需要遍历链表节点，取出每个对象，去判断他的key是否等于当前key.



