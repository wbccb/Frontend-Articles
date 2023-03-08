console.info("bbbbbbb.js开始运行");

var b_Value = "我是一开始的b.js";
exports.b_Value = b_Value;

const aModule = require("./a.js");
console.warn("在bbbbbbb.js中require得到a",
    aModule.a_Value);

b_Value = "我是后改变的b.js";
exports.b_Value = b_Value;

console.info("b.js结束运行");












