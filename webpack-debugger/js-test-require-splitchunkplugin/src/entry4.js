import getE from "./item/entry1_a.js";
import {getG} from "./item/common_____g.js";
import _ from "loadsh";
console.info(_.add(13, 24));

var testvalue = getE() + getG();

import (/*webpackChunkName: "B"*/"./async/async_B.js").then(bModule => {
    bModule.default();
});

// import ("loadsh").then(loadshModule => {
//     console.info("我是loadsh");
//     loadshModule.default();
// });


setTimeout(() => {
    const requireA = require("./require/require_A.js");
    console.info("testvalue", testvalue + requireA.getRequireA());
}, 4000);

console.info("我是entry4");