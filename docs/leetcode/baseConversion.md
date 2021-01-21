## 十进制小数转N进制小数

### 题目描述

```
输入一个10进制的正小数M和正整数N,用户空格分开，输出M的N进制小数，结果保留10位小数。当输入为0.0 0时结束输出。

例子:输入 10.625 2
		输出 1011.1010000000 
```

### 思路一：

* 将数字分成整数和小数两部分

* 先将整数部分转成N进制，再将小数部分转成N进制

* 整数部分转成二进制遵循的规律:

  * 假设整数部分为S,S对N取余得到A1，S对N作商得到结果R1.

  * 用R1对N继续取余得到余数A2,R1对N作商得到结果R2

  * 不断的重复这个过程直到Rn小于N.

  * 然后这个数字的N进制整数就是RnA(n-1)....A1.

    ```
       10 ->2
       10/2 =  5...0
       5 /2 =  2...1
    	 2/2  =  1...0
       所以结果为商和余数的逆序 1010
    ```

* 小数部分转N进制

  * 对小数部分乘N然后取这个数字的整数部分B1和小数部分D1
  * 当D1不为0时，继续用D2乘N获取整数部分B2和小数D2
  * 重复这个过程直到Dn等于0或者小数部分的长度大于10
  * 小数的计算过程中建议使用float64类型来存储，这样可以保证计算结果的准确性

  ```
  0.625 -> 2
  
  0.625 *2 = 1 +  0.25
  0.25*2 = 0 + 0.5
  0.5* 2 = 1 + 0.0 
  
  所以结果为 0.101（101是从到下的整数部分）
  ```

### 代码实现

```go
package main

import "fmt"

func main() {
	M,N := 0.0,0
	for {
		_,err:=fmt.Scanf("%f %d\n",&M,&N)
		if err!=nil ||  (M==0 && N==0){
			return
		}
		DecimaleConvertion(M,N)
	}
}
// 将一个10进制正小数转成N进制的小数，N是一个正整数
func DecimaleConvertion(M float64,N int)  {
	// 获取整数部分和小数部分
	mInt :=int(M)
	mDecimal := M - float64(mInt)
	result := make([]byte,0)
	// 最小的进制是二进制
	if mInt > 1 {
		merchant:= mInt
		for ;merchant >=N; merchant=merchant/N{
			remainder:= merchant%N
			result = append(result, byte(remainder)+'0')
		}
		result = append(result, byte(merchant)+'0')
		reverseArr(result)
	}else{
		result = append(result,'0')
	}
	result = append(result, '.')
	// 处理小数部分

	for i:=0;i<10;i++{
		if mDecimal!=0{
			product := mDecimal * float64(N)
			// 获取整数部分
			pInt:=byte(product)
			mDecimal =product - float64(pInt)
			result = append(result, pInt+'0')
		}else{
			// 已经可以准确的表示这个数字了，但是小数点后的位数不够10位
			result = append(result, '0')
		}
	}
	fmt.Printf("result=%v\n",string(result))
}


func reverseArr(arr []byte){
	length:=len(arr)
	for i:=0;i<length/2;i++{
		arr[i],arr[length-i-1] = arr[length-i-1],arr[i]
	}
}
```

### 使用标准库方法实现



​    

​    

​    

​    

​    