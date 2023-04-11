

import.meta.hot = __vite__createHotContext("/src/main.js");


function test1_child_Fn() {
    return "test_child__fn1_a";
}

function test2_child_Fn() {
    return "test_child__fn2_a";
}


import.meta.hot.acceptExports(["test1_child_Fn"], ()=> {
    console.error("test1_child_Fn acceptExports触发了！！！");
});


export {test1_child_Fn, test2_child_Fn};

