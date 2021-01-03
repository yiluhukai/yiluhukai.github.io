### set 和 map

## set

**`Set`** 对象允许你存储任何类型的唯一值，无论是[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)或者是对象引用。

* 创建set

```js
const mySet = new Set()

const mySet1 = new Set([1,2,4])
```

> new Set()可以不接受参数或者接受一个可迭代对象。

* 操作方法

```js
const mySet = new Set()

mySet.add(1).add(2).add(3)
//Set { 1, 2, 3 }

const res = mySet.has(1)
console.log(res) //true

console.log('size =', mySet.size) //3

mySet.delete(1)

console.log(mySet) // Set { 2, 3 }

mySet.clear()

console.log(mySet) //Set {}


// keys是一个迭代器对象
const keys = mySet.keys()

console.log(keys.next()) //{ value: 2, done: false }
// values返回的也是一个迭代器对象
console.log('values =', mySet.values()) //values = [Set Iterator] { 2, 3 }
```

* 遍历set

```js
mySet1.forEach((value, key, set) => {
	console.log(value, key, set)
	// 1 1 Set { 1, 2, 4 }
	// 2 2 Set { 1, 2, 4 }
	// 4 4 Set { 1, 2, 4 }
})

for (const ele of mySet1) {
	console.log(ele)
	//1
	// 2
	// 4
}
```

* set的应用

```js
const r_Arr = [1, 1, 2, 3, 5, 8]
// Array.from 接受一个类数组对象或者可迭代的对象
console.log(Array.from(new Set(r_Arr))) //[ 1, 2, 3, 5, 8 ]
// 更简洁的写法
console.log([...new Set(r_Arr)]) //[ 1, 2, 3, 5, 8 ]
```

> 利用set中元素不重复的特性可以实现对数组的去重

## map

**`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)) 都可以作为一个键或一个值。

* map和对象的区别

  * map和对象都是健值对的集合，一个 `Map`的键可以是**任意值**，包括函数、对象或任意基本类型。

  * 对象的键一个`Object` 的键必须是一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String) 或是[`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
  * 对象的键是无序的，而`Map` 中的 key 是有序的。因此，当迭代的时候，一个 `Map` 对象以插入的顺序返回键值。
  * map 是 [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable) 的，所以可以直接被迭代。

  *  ma p在频繁增删键值对的场景下表现更好

* 创建map

```js
const myMap = new Map() //Map {}
const map1 = new Map([[1, 'one']]) //Map { 1 => 'one' }
```

* map的操作

```js
const myMap = new Map() //Map {}

myMap.set(1, 'a').set(2, 'b') //Map { 1 => 'a', 2 => 'b' }

console.log('size', myMap.size) // size 2

console.log(myMap.get(1)) // 'a'

console.log(myMap.has(1)) // true

myMap.delete(1) //Map { 2 => 'b' }

myMap.clear() //Map {}
```

* map的迭代

```js
let myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
for (let [key, value] of myMap) {
  console.log(key + " = " + value);
}
// 将会显示两个log。一个是"0 = zero"另一个是"1 = one"

for (let key of myMap.keys()) {
  console.log(key);
}
// 将会显示两个log。 一个是 "0" 另一个是 "1"

for (let value of myMap.values()) {
  console.log(value);
}
// 将会显示两个log。 一个是 "zero" 另一个是 "one"

for (let [key, value] of myMap.entries()) {
  console.log(key + " = " + value);
}
// 将会显示两个log。 一个是 "0 = zero" 另一个是 "1 = one"


myMap.forEach(function(value, key) {
  console.log(key + " = " + value);
})
// 将会显示两个logs。 一个是 "0 = zero" 另一个是 "1 = one"
```

* map和数组的关系

```js
let kvArray = [["key1", "value1"], ["key2", "value2"]];

// 使用常规的Map构造函数可以将一个二维键值对数组转换成一个Map对象
let myMap = new Map(kvArray);

myMap.get("key1"); // 返回值为 "value1"

// 使用Array.from函数可以将一个Map对象转换成一个二维键值对数组
console.log(Array.from(myMap)); // 输出和kvArray相同的数组

// 更简洁的方法来做如上同样的事情，使用展开运算符
console.log([...myMap]);

// 或者在键或者值的迭代器上使用Array.from，进而得到只含有键或者值的数组
console.log(Array.from(myMap.keys())); // 输出 ["key1", "key2"]
```

