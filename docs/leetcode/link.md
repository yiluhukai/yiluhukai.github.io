# 链表反序

```
//定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
//
//
//
// 示例:
//
// 输入: 1->2->3->4->5->NULL
//输出: 5->4->3->2->1->NULL
//
//
//
// 限制：
//
// 0 <= 节点个数 <= 5000
//
//
//
// 注意：本题与主站 206 题相同：https://leetcode-cn.com/problems/reverse-linked-list/
// Related Topics 链表
// 👍 144 👎 0
```

### 解答

```go
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

/*
	先构建一个节点的链表，然后遍历剩余链表的节点，使用头插法更新链表
 */

//解答成功:
//执行耗时:0 ms,击败了100.00% 的Go用户
//内存消耗:2.5 MB,击败了97.43% 的Go用户
func reverseList(head *ListNode) *ListNode {
	//  空链表
	if head == nil{
		return head
	}
	// 至少一个节点
	temp :=  head.Next
	head.Next = nil

	for temp!=nil{
		cur := temp.Next
		temp.Next = head
		head =temp
		temp = cur
	}
	return head
}
//leetcode submit region end(Prohibit modification and deletion)

```
