
console.error("准备开始entry");
const moduleA = require("./a.js");
const moduleB = require("./b.js");


console.error("entry最后拿到的值是", moduleA.a_Value);
console.error("entry最后拿到的值是", moduleB.b_Value);