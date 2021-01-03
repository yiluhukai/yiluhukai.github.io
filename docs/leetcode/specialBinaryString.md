## 特殊的二进制序列

### 理解题意

```
//特殊的二进制序列是具有以下两个性质的二进制序列： 
//
// 
// 0 的数量与 1 的数量相等。 
// 二进制序列的每一个前缀码中 1 的数量要大于等于 0 的数量。 
// 
//
// 给定一个特殊的二进制序列 S，以字符串形式表示。定义一个操作 为首先选择 S 的两个连续且非空的特殊的子串，然后将它们交换。（两个子串为连续的当且仅当第一
//个子串的最后一个字符恰好为第二个子串的第一个字符的前一个字符。) 
//
// 在任意次数的操作之后，交换后的字符串按照字典序排列的最大的结果是什么？ 
//
// 示例 1: 
//
// 
//输入: S = "11011000"
//输出: "11100100"
//解释:
//将子串 "10" （在S[1]出现） 和 "1100" （在S[3]出现）进行交换。
//这是在进行若干次操作后按字典序排列最大的结果。
// 
//
// 说明: 
//
// 
// S 的长度不超过 50。 
// S 保证为一个满足上述定义的特殊 的二进制序列。 
// 
// Related Topics 递归 字符串 
// 👍 56 👎 0
```

::: tip

• 特殊二进制序列
	 • 0的数量与1的数量相等

​	• 每一个前缀码中1的数量>= 0的数量,前缀码：指的是当前字符串的前缀子串,101 10 01的前缀串 1、10、....

 • 交换

 101 10 01
 101100 1 10 101 1011 10110 101100

• 两个连续且非空的特殊的子串交换 • 任意次操作
 • 字典序最大的结果

:::

## 解题思路

```wiki
1.找出符合要求的子串(子串有可能可以再分割成连续的子串，需要对子串进行遍历操作)
		我们可以对统计字符串中1，0的出现的次数，当出现次数相同时，就是一个特殊的二进制序列
		连续的二进制序列最多出现25个，因为S的长度最大为50，一个子串最小长度为2
		递归处理二进制序列子串的时候需要去除头为的1和0， 1110 1100 00 ->否则，只能匹配到整个子串
2.对子串进行排序
3.重新拼接字符串(字符串要么整个是一个特殊的二进制序列，要么可以拆分成多个连续的二进制序列)
```

## 代码实现

```go
func makeLargestSpecial(S string) string {
	length:=len(S)
	if length <= 1{
		return S
	}
	// 存储二进制序列子串
	strArr := make([]string,0,25)
	// start二进制序列的开始位置，用于截取的时候定位开始位置
	start :=0
	// 使用count来统计10出现的次数，== 1 -> count++ ,== 0 => count-- ,
	// 当再次等于0的时候，便得到了一个子串
	count := 0
	// 查找二进制序列子串
	for i :=0;i<length;i++{
		if S[i] == '1'{
			count++
		}else{
			count--
		}
		// 得到了一个子串
		if count == 0{
			//  对字串进行头尾的1和0去除
			str:=S[start+1:i]
			// 对字串进行递归查找
			res:=makeLargestSpecial(str)

			strArr = append(strArr, "1"+res+"0")
			// 去找下一个
			start = i+1
		}
	}
	if len(strArr) == 1{
		return strArr[0]
	}
	//fmt.Printf("%v\n",strArr)
	// 获取了所有的子串，最子串进行排序
	bubbleSort(strArr)
	
	// 重新拼接字符串
	return strings.Join(strArr,"")
}

func bubbleSort(sli []string) {
	flag := true
	for i, length := 0, len(sli); i < length-1 && flag; i++ {
		flag = false
		for j := 0; j < length-1-i; j++ {
			if strings.Compare(sli[j],sli[j+1]) < 0   {
				// 发生了交换
				flag = true
				sli[j], sli[j+1] = sli[j+1], sli[j]
			}
		}
	}
}
```

:::tip

代码的优化主要是排序方法的优化，比如使用快速排序

:::



##  排序



## 冒泡排序

* 排序思路

```
 *	冒泡排序:采用先确定位置然后找数字的方法（位置只能在最前面或者最后面），确定位置后通过不断
 *	交换位置的方法将数字调整到合适的位置
```

* 代码实现

```go
func BubbleSort(sli []int) {
	sortBorder := len(sli)-1
	lastExChange:=0
	flag := true
	for i, length := 0, len(sli); i < length-1 && flag; i++ {
		flag = false
		for j := 0; j < sortBorder; j++ {
			if sli[j] > sli[j+1] {
				// 发生了交换
				flag = true
				sli[j], sli[j+1] = sli[j+1], sli[j]
				lastExChange = j
			}
		}
		sortBorder = lastExChange
		//fmt.Printf("%#v\n",sli)
	}
}
```

:::warning

这里是我们优化后的代码:flag用来表示这一轮是否发生了交换，当没有交换，则已经排序好了。sortBorder用来表示有序的边界，指向最后发生交换的地方。边界的后面是有序的序列。

其他类型的排序只需要替换相邻位置的比较方法，如字符串切片排序：strings.Compare(sli[j],sli[j+1]) < 0 代替  sli[j] > sli[j+1]

:::

```
时间复杂度：O(n^2)
空间复杂度:O(1)
稳定排序
```

## 插入排序

* 排序思想

```
插入排序：采用的是先找数字后确定位置的方法
 *	假设前面一组或后面一组数字是排好序的。把与他们相邻的数组作为选定数字。
 *	每次把选定数字和他前面的相邻数字比较，知道把数字插入到合适的位置。
```

* 代码实现

```go
func InsertSort(sli []int) {
	length := len(sli)
	for i := 1; i < length; i++ {
		for j := i - 1; j >= 0 && sli[j] > sli[j+1]; j-- {
			sli[j], sli[j+1] = sli[j+1], sli[j]
		}
	}
}
```

```
时间复杂度：O(n^2)
空间复杂度:O(1)
稳定排序
```

## 快速排序

* 排序思想

```go
快速排序：采用先找数字再找位置的方法。
 *	在待排序的数字中最前面或者最后面的数字作为选定数字。
 *	将选定数字和其他的数字作对比，将他放到和合适的位置。保证前面的数字比他小，后面的数字比他大
 *	然后对这个数字前面和后面的数字使用快速排序，当待排序的数字个数小于等于1的时候，停止排序。
```

* 代码实现

```go
func QuickSort(sli []int){
	length := len(sli)
	if length <=1 {
		return
	}
	//选择base
	base := sli[0]
	start,end := 0,length-1
	// 开始调整base的位置
	for start < end {
		if sli[start] > sli[end]{
			sli[start],sli[end] = sli[end],sli[start]
		}
		// 前移或者后移
		if sli[start] == base{
			end--
		}else{
			start++
		}
	}
	// 处理这个数字前后和后面的序列
	QuickSort(sli[:start])
	QuickSort(sli[start+1:length])
}
```

```
时间复杂度：最坏情况当前序列顺序排列，每轮比较n次，递归n轮，最好的情况每次排序把数组分成两部分去比较，最多logN轮，时间复杂度为nLogN.
空间复杂度:空间复杂度和递归的深度有关系最好O(logN) 最坏O(n)
不稳定排序
```