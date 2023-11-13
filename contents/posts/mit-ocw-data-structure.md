---
title: MIT 2. Data Structures and Dynamic Arrays
date: 2023-11-13 15:03:20 +0900
updated: 2023-11-13 17:53:34 +0900
tags: 
---

## Interface (API / ADT) vs Data Structure

- Interface
	- specification
	- what you want to do
	- what data can store
	- what operations do / are supported / what they mean
- data structure
	- presentation
	- how you do it
	- how to store data
	- algorithms to support operations

The idea is we want to store n things!
The things will be fairly arbitrary.

## 2 main interfaces

- set
- sequences

## 2 main DS approaches

- arrays
- pointer based

## Solution (natural)

### static sequence interface: maintain a sequence of items

- build(x)
- len()
- iter_seq()
- get_at(i)
- set_at(i)
- get_first/last()
- set_first/last(x)

### word RAM

word RAM model of computation is that your memory is an array of w-bit words.

we have a big memory which goes off to infinity, maybe.
it's divided into words.
Each word here is w bits long.
You can access this array randomly.

You can access any of them equally quickly.
 
- memory = array of w-bit words
- array = a consecutive chunk of memory. 
- consecutive -> If i want to access the array at position, at index i, then this is the same thing as accessing my memory array at position
- array[i] = memory[address(array) + i]
- array access is constant time.

---
Assume $w >=  log n$, w is the machine promise size.
we don't usually think of the machine as getting bigger over time, but you should think of the machine as getting bigger over time.

Because if I have n things that I"m dealing with -- n, here, is the problem size -- at the very least, I need to be able to address them.

Otherwise, because the machine is designed to only work with w-bit words in constant time, they'll want to be able to access the ith word in constant time, I need a word size that's at least $logn$ just to address that and n things in my input. 

eventually, when our n's get really really big, we're going to have to increase w just so we can address that RAM. This is intuition here.

But this is a way to bridge reallity which are fixed machines, with theory in algorithms, we care about scalability for very large n.

We want to know what that growth function is and ignore the lead constant factor, that's what asymptotic notation is all about.

We need a notion of word size also changing in this asymptotic way.

### static array

- $O(1)$ per get_at, set_at / len
- $O(N)$ per build / iter_seq

### how do you create an array in the beginning?

memory allocation model: you can allocate an array of size n in $\theta(n)$ time

if you're just allocating arrays, the amount of space you use is, at most, the amount of time you use. $space = O(time)$

## Dynamic Sequences

### interface

static sequence, plus:

- insert_at(i, x): make x the new xi, shifting xi -> xi+1 -> xi+2 ... -> xn-1
- delete_at(i): shift xi <- xi+1 <- ... <- xn-1

And let's say I insert at position 2
So I come in with my new x, and I would like x to be the new x2, but I don't want to lose any information.

- insert/delete_first/last(x)/()

---
the algorithm for supporting get-first or set-first or in particular, insert-first or insert_last might be more efficient. maybe we can solve this problem better than we can solve insert_at.

## Linked List

- What is a linked List? We store our items in a bunch of nodes.
- Each node has an item in it and a next field, So you can think of these as class objects with two class variables, the item and the next pointer.
- In the item fields, we're going to store the actual values that we want to represent in our sequence, x0 through xn-1, in order.
- And then we're going to use the next pointers to link these all together in that order. 
- The data structure is going to be represented by a head (If you want to, it can store its lengths)
- That pointers can be stored in a single word, which means we can de-reference them in constant time in word-RAM model.
- They're in some arbitrary order.
- what is the address of this little array?
	- that say where, in memory, is this thing over here?
- it's easy to manipulate the order of a linked list, whereas arrays are problematic.

### Dynamic Seq. ops

- static array
	- insert and delete anywhere costs $\theta(N)$ time
		1. if we're near the front, then we have to do shifting.
		2. allocation (even if allocating the new array didn't take linear time, you have to copy all the elements over from the old array to new one)
	- what about insert or delete the last element of array?
		- I don't have to do shifting. 
	- Can I do insert and delete last in constant time in a static array?
		- our model is that remember allocation model is that we can allocate a static array of size n, it's just a size n I can't just say please make it bigger by 1 I need space to store this extra space. 
	- If I try to grow this array by 1, there might already be something there. And that's not possible without first shifting. So even though, in the array, I don't have to do any shifting, in memory, I might have to do shifting. You can also de-allocate memory, just to keep space usage small. But the only way to get more space is to ask for a new array.
=> So static arrays are really bad for dynamic operations.
- linked list
	- Insert and delete_first are $O(1)$
		- I'm going to set the next pointer here to this one, and I'm going to change this head pointer to point here. 
	- get and set_at need $O(i)$, in the worst case, $O(n)$
	- If I want to get the 10th item in a linked list, I have to follow these pointers 10 times. 
	- accessing the ith item is going to take order i time.

### amortization

operation takes T(n) amortized time, if any k of those operations take k <= k * T(n) time.
(averaging over operation sequence)

## Questions

1. Can we do insert and delete last in constant time in a static array?

## Feedback

- length constant time 을 말할 때 문장 구조 점검하기
- 차근차근
- 2 to the k
