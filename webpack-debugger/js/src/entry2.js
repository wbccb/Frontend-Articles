import getA2E from "./item/entry2_aa";
import {getG} from "./item/common_____g.js";

import (/*webpackChunkName: "B"*/"./async/async_B.js").then(bModule=> {
    bModule.default();
});

console.info("getA2E", getA2E()+getG());
