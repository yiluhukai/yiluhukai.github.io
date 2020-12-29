### 单词反转

## 题目描述

```
//给定一个字符串，逐个翻转字符串中的每个单词。 
//
// 说明： 
//
// 
// 无空格字符构成一个 单词 。 
// 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。 
// 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。 
// 
//
// 
//
// 示例 1： 
//
// 输入："the sky is blue"
//输出："blue is sky the"
// 
//
// 示例 2： 
//
// 输入："  hello world!  "
//输出："world! hello"
//解释：输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
// 
//
// 示例 3： 
//
// 输入："a good   example"
//输出："example good a"
//解释：如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
// 
//
// 示例 4： 
//
// 输入：s = "  Bob    Loves  Alice   "
//输出："Alice Loves Bob"
// 
//
// 示例 5： 
//
// 输入：s = "Alice does not even like bob"
//输出："bob like even not does Alice"
// 
//
// 
//
// 提示： 
//
// 
// 1 <= s.length <= 104 
// s 包含英文大小写字母、数字和空格 ' ' 
// s 中 至少存在一个 单词 
// 
//
// 
// 
//
// 
//
// 进阶： 
//
// 
// 请尝试使用 O(1) 额外空间复杂度的原地解法。 
// 
// Related Topics 字符串 
// 👍 250 👎 0
```

## 解法—：

```go
/*
		将字符串中每一个单词作为一个整体，对字符串进行反转
		解答成功:
						执行耗时:4 ms,击败了40.83% 的Go用户
						内存消耗:3.9 MB,击败了44.29% 的Go用户
	*/
```

```go
func reverseWords(s string) string {
	
	s=strings.TrimSpace(s)
	re := regexp.MustCompile("\\s+")
	words :=re.Split(s,-1)
	// 对数组进行反转
	for start,end := 0,len(words)-1;start <= end;{
			words[start],words[end] = words[end],words[start]
			start++
			end--
	}
	return strings.Join(words," ")

}
```

## 解法一优化

```go
/* 

 1. 不去考虑空白的字符串,直接用一个空格去切割字符得到一个数组
 2. 反序遍历数组，对字符串中的非空字符串进行拼接，
 3. 删除最前面的空格

 解答成功:
							执行耗时:0 ms,击败了100.00% 的Go用户
							内存消耗:3.6 MB,击败了60.16% 的Go用户
*/
```

```go
func reverseWords(s string) string {
 	//  用一个空格切割
	if s == " " {
		return ""
	}
	words :=  strings.Split(s," ")
	result :=make([]string,0)
	//  反向遍历数组
	for i:=len(words)-1;i >= 0;i--{
		if word:= words[i];len(word)!=0{
			result =append(result,word)
		}
	}
	return strings.Join(result," ") 
}
```

## 解法二

>  主要思想是使用双指针去反序遍历字符串，截取单词到数组中，将数组转成字符串

```go
func reverseWords(s string) string {
	length:=len(s)

	if length == 0{
		return ""
	}
	//  保存单词的切片
	var words = make([]rune,0)
	//标记是否切片中包含单词吗
	hasWord :=false
	//  双指针
	start,end := -1,-1
	// 反序遍历字符串
	for  i:=length-1;i>=0;i-- {
		// 每个字符都有两种情况
		if c:=s[i]; c!= ' ' {
			// 不等于-1说明end没有指向单词的结尾
			if end ==-1{
				end = i
			}
			// 到达字符的开始且这个位置不为空格
			if i == 0{
				start = i
			}
		}else{
			// 当遍历的字符是一个空格；那么有可能到达字符的开始位置前一个字符，也有可能这是字符串两边空格和中间位置的非边界空格
			if end !=-1 {
				// 说明是一个单词开始位置的空格
				start = i+1
			}
		}
		// 当start和end不等于-1的时候，说明这两个指针指向的是单词的开始位置和结束位置
		if start !=-1 && end !=-1{
			// 如果是最开始的字符，我们不去给他添加空格
			if hasWord {
				words = append(words,' ')
			}
			//将start和end指向的单词复制到切片中
			for i:=start;i<=end;i++{
				words = append(words,rune(s[i]))
			}
			// 切片中有单词
			hasWord = true
			// 重置开始和结束指针的位置
			start = -1
			end = -1
		}
	}
	return string(words)
}
```

```
时间复杂度：O(n),虽然我们有双层for循环，但是里层的for循环不是每次都执行，执行的次数是单词的个数常数级别的。
空间复杂度：O(n)
```

## 双端队列

普通的队列是先进先出，双端队列可以在队列的头部和尾部进行插入和删除操作。可以实现栈和队列的效果。双端队列一般用双向链表实现。

![双端队列](/leetcode/doubly.png)

##  解法三

使用双端队列实现。

```go
	/*
		使用双端队列来实现,用缓存区暂存单词
		解答成功:
					执行耗时:0 ms,击败了100.00% 的Go用户
					内存消耗:7.8 MB,击败了9.06% 的Go用户
	*/
func reverseWords(s string) string {
	l := list.New()
	length:=len(s)
	word:=make([]byte,0)
	// 遍历字符串
	for i:=0;i<length;i++{
		if c := s[i];c != ' '{
			// 当前字符非空
			word =append(word,c)
		}else{
			if len(word)!=0 {
				l.PushFront(string(word))
				// 清空缓存区
				word = word[0:0]
			}
		}
	}

	// 存在这样一种情况，就是到达单词的最后位置，但是单词不是以空格结尾的，这个时候缓冲区中还有数据
	if len(word)!=0{
		l.PushFront(string(word))
	}
	var res =""
	// 遍历list
	Len :=l.Len()
	count := 0
	for e := l.Front(); e != nil; e = e.Next() {
		count++
		word := e.Value.(string)
		if count != Len{
			res+= word + " "
		} else{
			res+=word
		}

	}
	return res
}
```







