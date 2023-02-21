import {getE} from "./item/entry1_a.js";
import {getF} from "./item/entry1_b.js";
import {getG} from "./item/common_____g.js";

var testvalue = getE() + getF() + getG();

import (/*webpackChunkName: "B"*/"./async/async_B.js").then(bModule=> {
    bModule.default();
});

setTimeout(()=> {
    console.info("testvalue", testvalue);
}, 2000);
