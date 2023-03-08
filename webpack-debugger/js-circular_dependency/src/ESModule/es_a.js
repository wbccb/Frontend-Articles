import {b_Value} from "./es_b.js";
console.info("a.js开始运行");
console.warn("在a.js中import得到b", b_Value);

export var a_Value = "我是一开始的a.js";
console.info("a.js结束运行");

setTimeout(()=> {
    console.warn("在a.js结束运行后(b.js那边已经" +
        "在500毫秒前改变值)再次import得到b", b_Value);
}, 1000);





