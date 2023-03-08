console.info("a.js开始运行");

var a_Value = "我是一开始的a.js";
exports.a_Value = a_Value;

const bModule = require("./b.js");
console.warn("在a.js中require得到bModule",
    bModule.b_Value);

a_Value = "我是后改变的a.js!!!!!";
exports.a_Value = a_Value;

console.info("a.js结束运行");










