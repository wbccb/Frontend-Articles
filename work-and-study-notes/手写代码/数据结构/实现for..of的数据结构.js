// 迭代器协议：返回done和value
// 可迭代对象：具有[Symbol.iterator]


function MyArray(array) {
  let nextIndex = 0;
  return {
    next: function () {
      if(nextIndex < array.length) {
        const res = {
          done: false,
          value: array[nextIndex]
        };
        nextIndex++;
        return res
      } else {
        nextIndex = 0;
        return {
          done: true
        }
      }
    },
    [Symbol.iterator]: function () {
      return this;
    }
  }
}

var initData = new MyArray([4, 2, 3]);
for (let value of initData) {
  console.log(value);
}