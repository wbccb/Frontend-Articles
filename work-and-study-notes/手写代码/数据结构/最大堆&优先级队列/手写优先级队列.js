// 堆、优先级队列

// 最大堆的性质: 每个节点都大于/等于它的两个子节点
// 最小堆的性质: 每个节点都小于/等于它的两个子节点


class MaxPriorityQueue {

    constructor(initArray=[]) {
        // 根据"优先级队列-数组与树对应关系.png"得出关系，第1个元素不使用才能简化转化关系
        this.pq = [null];
        this.lastIndex = this.pq.length - 1;

        for(let i=0; i<initArray.length; i++) {
            this.insert(initArray[i]);
        }

    }

    getParent(rootIndex) {
        // 根据"优先级队列-数组与树对应关系.png"得出关系
        return parseInt((rootIndex / 2).toString());
    }

    getLeftChild(rootIndex) {
        // 根据"优先级队列-数组与树对应关系.png"得出关系
        return rootIndex * 2;
    }

    getRightChild(rootIndex) {
        // 根据"优先级队列-数组与树对应关系.png"得出关系
        return rootIndex * 2 + 1;
    }

    getMax() {
        return this.pq[1];
    }

    insert(value) {
        this.lastIndex++;
        this.pq.push(value);
        // 上浮到正确位置
        this.swim(this.lastIndex);
    }

    deletemax() {
        // 交换顶部和尾部
        this.swap(1, this.lastIndex);

        // 删除尾部
        this.pq[this.lastIndex] = null;
        this.lastIndex--;

        // 下沉顶部
        this.sink(1);
    }

    // 上浮第k个元素，以维护最大堆的性质
    swim(k) {
        // 逻辑：如果parent>k大，则不操作，如果小，则将k与parent交换，然后继续比较parent.parent
        while(this.getParent(k) >= 1 && this.pq[this.getParent(k)] < this.pq[k]) {
            const parentIndex = this.getParent(k);
            this.swap(parentIndex, k);
            k = parentIndex;
        }
    }

    // 下沉第k个元素，以维护最大堆的性质
    sink(k) {
        // 逻辑：比较两个child，找到那个最大的child进行交换，然后继续比较两个child
        while(this.getLeftChild(k) <= this.lastIndex) {
            let maxIndex = this.pq[this.getLeftChild(k)];
            if(this.getRightChild(k) <= this.lastIndex) {
                maxIndex = this.pq[this.getLeftChild(k)] > this.pq[this.getRightChild(k)]?this.getLeftChild(k):this.getRightChild(k);
            }

            if(!maxIndex) {
                // 没有child
                break;
            }

            if(this.pq[maxIndex] < this.pq[k]) {
                break;
            }
            this.swap(maxIndex, k);
            k = maxIndex;
        }
    }


    swap(i, j) {
        const temp = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = temp;
    }

}

const test = new MaxPriorityQueue([4, 2, 0, 1, 8, 9]);
console.info("初始化---MaxPriorityQueue最大值", test.getMax());

test.insert(13);
console.info("insert(13)----->MaxPriorityQueue最大值", test.getMax());

test.insert(12);
console.info("insert(12)----->MaxPriorityQueue最大值", test.getMax());

test.deletemax();
console.info("deletemax---->MaxPriorityQueue最大值", test.getMax());
