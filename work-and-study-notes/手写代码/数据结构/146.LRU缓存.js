// LRU (最近最少使用) 缓存
// 有一定的容量，如果超过这个容量，则移除最近最少使用

// 本质就是构建hashMap管理值 + 双向链表管理"最近最少使用"

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;

        this.next = undefined;
        this.prev = undefined;
    }
}

class DoubleLinkedList {
    constructor() {
        this.head = new Node(-998, 998);
        this.tail = new Node(-999, 998);
        this.head.next = this.tail;
        this.tail.prev = this.head;

        this.map = new Map();
    }

    addNewNode(key, value) {
        const newNode = new Node(key, value);

        const lastNode = this.tail.prev;
        lastNode.next = newNode;
        newNode.prev = lastNode;

        newNode.next = this.tail;
        this.tail.prev = newNode;

        this.map.set(key, newNode);

        return newNode;
    }

    makeNodeToNewest(key) {
        // 拿到这个node
        const node = this.map.get(key);

        if(node.next === this.tail) {
            return;
        }
        // 添加到最后面
        const preNode = node.prev;
        const nextNode = node.next;

        preNode.next = nextNode;
        nextNode.prev = preNode;


        const lastNode = this.tail.prev;
        lastNode.next = node;
        node.prev = lastNode;

        node.next = this.tail;
        this.tail.prev = node;
    }

    removeNode(key) {
        const node = this.map.get(key);

        const preNode = node.prev;
        const nextNode = node.next;
        preNode.next = nextNode;
        nextNode.prev = preNode;
    }

    removeOldNode() {
        // 删除第一个元素
        const node = this.head.next;

        const preNode = node.prev;
        const nextNode = node.next;
        preNode.next = nextNode;
        nextNode.prev = preNode;

        return node;
    }

    testIterator() {
        const array = [];
        let p = this.head.next;
        while(p !== this.tail) {
            array.push(p.key + "=" + p.value);
            p = p.next;
        }
        console.info("目前缓存是", `{${array.join(",")}}`);
    }
}

function LRUCache(capactity) {
    this._cap = capactity;
    this._size = 0;
    this._map = new Map();
    this._cache = new DoubleLinkedList();
}

// 封装能否复用的业务函数
LRUCache.prototype.addNewNode = function (key, value) {
    if(this._size === this._cap) {
        const removeNode = this._cache.removeOldNode();
        this._map.delete(removeNode.key);
        this._size--;
    }
    const node = this._cache.addNewNode(key, value);
    this._map.set(key, node);
    this._size++;
}

LRUCache.prototype.removeNode = function (key) {
    this._cache.removeNode(key);
    this._map.delete(key);
    this._size--;
}

// 暴露出去的方法
LRUCache.prototype.get = function (key) {
    debugger;
    if(!this._map.has(key)) {
        console.warn("返回-1(未找到)");
        return -1;
    }
    // 将这个节点提升到最新使用
    this._cache.makeNodeToNewest(key);

    this._cache.testIterator();
    return this._map.get(key).value;
}
LRUCache.prototype.put = function (key, value) {
    // 判断是否存在
    if(this._map.get(key)) {
        this.removeNode(key);
        this.addNewNode(key, value);
        return;
    }

    this.addNewNode(key, value);

    this._cache.testIterator();
}


const lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
