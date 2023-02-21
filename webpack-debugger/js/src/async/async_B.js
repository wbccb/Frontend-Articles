
import {getE} from "../item/entry1_a.js";
import {getF} from "../item/entry1_b.js";
import {getG} from "../item/common_____g.js";

var testvalue = getE() + getF() + getG();

import (/*webpackChunkName: "C"*/"./async_C.js").then(bModule=> {
    bModule.default();
});

export default function getBJs() {
    return "我是BBBBBBBBBB.js";
}

setTimeout(()=> {
    console.info("testvalue", testvalue);
}, 3000);
