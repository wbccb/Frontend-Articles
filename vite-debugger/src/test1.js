import {test1_child_Fn, test2_child_Fn} from "./test1_child";
import {toString} from "lodash-es";

import.meta.hot = __vite__createHotContext("/src/main.js");


const temp = test1_child_Fn();
console.log("我是index.js", temp+"ffff");

function test1Fn() {
    return "test4dfd848";
}

function test2Fn() {
    return "tests4ffffd2fF5n";
}


import.meta.hot.acceptExports(["test1Fn", "test2_child_Fn"], ()=> {
    console.error("test1.js acceptExports触发了！！！");
});


export {test1Fn, test2Fn, test2_child_Fn};

