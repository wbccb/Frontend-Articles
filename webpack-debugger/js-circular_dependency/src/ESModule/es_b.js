console.info("bbbbbbb.js开始运行");
import {a_Value} from "./es_a.js";

console.warn("在bbbbbbb.js中import得到a", a_Value);

export var b_Value = "我是一开始的b.js";
console.info("b.js结束运行");
setTimeout(()=> {
    b_Value = "我是结束后改变的b.js";
    console.warn("在b.js中延迟后再次import得到a", a_Value);
}, 500);





