// 我们先用另外一个例子来理解「均摊复杂度」
//
// 「哈希表」底层是通过数组实现的。
// 正常情况下，计算元素在哈希桶的位置，然后放入哈希桶，复杂度为 O(1)O(1)，假定是通过简单的“拉链法”搭配「头插法」方式来解决哈希冲突。
// 但当某次元素插入后，「哈希表」达到扩容阈值，则需要对底层所使用的数组进行扩容，这个复杂度是 O(n)O(n)
// 显然「扩容」操作不会发生在每一次的元素插入中，因此扩容的 O(n)O(n) 都会伴随着 n 次的 O(1)O(1)，也就是 O(n)O(n) 的复杂度会被均摊到每一次插入当中，因此哈希表插入仍然是 O(1)O(1) 的。
// 同理，我们的「倒腾」不是发生在每一次的「输出操作」中，而是集中发生在一次「输出栈为空」的时候，因此 pop 和 peek 都是均摊复杂度为 O(1)O(1) 的操作。


// 使用两个栈模仿队列
// 1. 使用数组模拟一个stack
// 2. 队列插入push、移除pop、获取peek都是O(1)，就是使用模拟的stack实现队列效果

function MyStack() {

    this._data = [];
    this.size = 0;

    this.pop = function () {
        if (this.size <= 0) {
            return undefined;
        }

        const lastItem = this._data[this.size - 1];
        this._data.splice(this.size - 1, 1);
        this.size--;

        return lastItem;
    }
    this.peek = function () {
        if (this.size > 0) {
            return this._data[this.size - 1];
        }
        return undefined;
    }
    this.push = function (value) {
        this._data.push(value);
        this.size++;
    }
}

var MyQueue = function () {
    this._pushStack = new MyStack();
    this._popStack = new MyStack();
}

// 将元素 x 推到队列的末尾
MyQueue.prototype.push = function (value) {
    this._pushStack.push(value);
}

// 从队列的开头移除并返回元素
MyQueue.prototype.pop = function () {
    // _pushStack: 栈底[1, 2, 3, 4]栈顶top
    // _popStack: 栈底[4, 3, 2, 1]栈顶top
    if (this._popStack.size <= 0) {
        while (this._pushStack.size > 0) {
            const item = this._pushStack.pop();
            this._popStack.push(item);
        }
    }
    return this._popStack.pop();
}

// 返回队列开头的元素
MyQueue.prototype.peek = function () {
    // _pushStack: 栈底[1, 2, 3, 4]栈顶top
    // _popStack: 栈底[4, 3, 2, 1]栈顶top
    if (this._popStack.size <= 0) {
        while (this._pushStack.size > 0) {
            const item = this._pushStack.pop();
            this._popStack.push(item);
        }
    }
    // 返回栈顶，不删除！
    return this._popStack.peek();
}

// 如果队列为空，返回 true ；否则，返回 false
MyQueue.prototype.empty = function () {
    if (this._popStack.size <= 0) {
        while (this._pushStack.size > 0) {
            const item = this._pushStack.pop();
            this._popStack.push(item);
        }
    }
    return this._popStack.size > 0 ? false : true;
}


const myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
