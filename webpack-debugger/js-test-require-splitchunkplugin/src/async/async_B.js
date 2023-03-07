

import (/*webpackChunkName: "C"*/"./async_C.js").then(bModule=> {
    bModule.default();
});

export default function getBJs() {
    return "我是BBBBBBBBBB.js";
}

setTimeout(()=> {
    console.info("testvalue", "testvalue");
}, 3000);
