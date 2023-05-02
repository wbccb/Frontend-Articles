// 最不经常使用（LFU）缓存算法
// 跟LRU (最近最少使用) 缓存相比较，这里需要使用key=freq，value=DoubleLinkedList
// 如果频率相同，则移除最少使用的
// 如果频率只有1个，则移除该key


class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = undefined;
        this.next = undefined;
    }
}

class DoubleLinkedList {
    constructor() {
        this.head = new Node(-999, -999);
        this.tail = new Node(-998, -998);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.size = 0;

        this._map = new Map(); //记录key:Node的关系
    }

    addLastNode(key, value) {
        // 增加最新的节点
        const preNode = this.tail.prev;
        const newNode = new Node(key, value);

        preNode.next = newNode;
        newNode.prev = preNode;

        newNode.next = this.tail;
        this.tail.prev = newNode;

        this.size++;

        this._map.set(key, newNode);
    }

    removeFirstNode() {
        // 删除最旧的节点
        const node = this.head.next;
        this._removeCommonNode(node);

        return node;
    }

    removeNodeByKey(key) {
        const node = this._map.get(key);
        this._removeCommonNode(node);
        return node;
    }

    _removeCommonNode(node) {
        const preNode = node.prev;
        const nextNode = node.next;

        preNode.next = nextNode;
        nextNode.prev = preNode;

        this.size--;
        this._map.delete(node.key);
    }

    toString() {
        const array = [];
        let p = this.head.next;
        while(p !== this.tail) {
            array.push(p.key + "=" + p.value);
            p = p.next;
        }
        return `{${array.join(",")}}`;
    }
}

function LFUCache(capacity) {
    this.freq = new Map(); // 管理key=频率，value=DoubleLinkedList
    this.map = new Map(); // 管理key=key，value=频率

    this.capacity = capacity;
    this.size = 0;

    this.minFrequency = Number.MIN_SAFE_INTEGER;
}

LFUCache.prototype.changeNodeToFrequencyAddOne = function (key, value) {
    const frequency = this.map.get(key);
    const list = this.freq.get(frequency);
    let newList = this.freq.get(frequency + 1);
    if (!newList) {
        newList = new DoubleLinkedList();
    }

    // freq操作
    const removeNode = list.removeNodeByKey(key);
    if (list.size === 0) {
        // 如果list删除key之后的大小为0，删除双向链表
        this.freq.delete(frequency);
    }
    if (value) {
        // 如果同时伴随着更新value值
        newList.addLastNode(removeNode.key, value);
    } else {
        newList.addLastNode(removeNode.key, removeNode.value);
    }
    this.freq.set(frequency + 1, newList);

    // map操作
    this.map.set(key, frequency + 1);

    // minFrequency操作
    if (frequency === this.minFrequency && !this.freq.has(frequency)) {
        // 如果要删除的是最小频率，并且删除完后就没有最小频率
        this.minFrequency = this.minFrequency + 1;
    }

    return value?value:removeNode.value;
}

LFUCache.prototype.put = function (key, value) {
    if (this.map.has(key)) {
        this.changeNodeToFrequencyAddOne(key, value);
    } else {
        // 不存在这个key: 先检测容量+再执行插入操作
        if (this.capacity === this.size) {
            // 超过了容量，必须删除一个
            const list = this.freq.get(this.minFrequency);
            const node = list.removeFirstNode();
            this.map.delete(node.key);
            if (list.size === 0) {
                this.freq.delete(this.minFrequency);
            }
            this.size--;
        }

        let newList = this.freq.get(1);
        if (!newList) {
            newList = new DoubleLinkedList();
        }
        newList.addLastNode(key, value);
        this.freq.set(1, newList);
        this.map.set(key, 1);

        this.size++;
        this.minFrequency = 1; // 新增了一个newNode
    }

    // this.test();
}
LFUCache.prototype.get = function (key) {
    if (!this.map.has(key)) {
        console.error(`返回 -1（未找到）`);
        console.log("\n");
        return -1;
    }
    const nodeValue = this.changeNodeToFrequencyAddOne(key);

    // this.test();

    return nodeValue;
}

LFUCache.prototype.test = function () {
    const freqencyArray = Array.from(this.freq.keys());
    freqencyArray.sort((a, b)=>a-b);

    let freqencyString = [];
    for(const freqency of freqencyArray) {
        const list = this.freq.get(freqency);
        freqencyString.push("频率"+freqency+""+"对应的双向链表为:"+list.toString());
    }
    console.warn(`[${freqencyString.join(",")}]`);


    let mapArray = [];
    for(const key of this.map.keys()) {
        mapArray.push("key="+key+"对应的频率是"+"="+this.map.get(key));
    }
    console.error(`[${mapArray.join(",")}]`);

    console.log("\n");
}


lfu = new LFUCache(2);
lfu.put(1, 1);   // cache=[1,_], cnt(1)=1
lfu.put(2, 2);   // cache=[2,1], cnt(2)=1, cnt(1)=1
lfu.get(1);      // 返回 1
                 // cache=[1,2], cnt(2)=1, cnt(1)=2
lfu.put(3, 3);   // 去除键 2 ，因为 cnt(2)=1 ，使用计数最小
                 // cache=[3,1], cnt(3)=1, cnt(1)=2
lfu.get(2);      // 返回 -1（未找到）
lfu.get(3);      // 返回 3
                 // cache=[3,1], cnt(3)=2, cnt(1)=2
lfu.put(4, 4);   // 去除键 1 ，1 和 3 的 cnt 相同，但 1 最久未使用
                 // cache=[4,3], cnt(4)=1, cnt(3)=2
lfu.get(1);      // 返回 -1（未找到）
lfu.get(3);      // 返回 3
                 // cache=[3,4], cnt(4)=1, cnt(3)=3
lfu.get(4);      // 返回 4
                 // cache=[3,4], cnt(4)=2, cnt(3)=3



