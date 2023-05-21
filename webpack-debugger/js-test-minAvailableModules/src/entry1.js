
import {getA} from "./item/a";
import {getB} from "./item/b";
import {getC} from "./item/c";
import {getD} from "./item/d";

getA();
getB();
getC();
getD();

import (/*webpackChunkName: "B"*/"./async_entry1/async_B.js").then(bModule=> {
  bModule.default();
});


// entry1.js ---> async_B.js ---> async_C.js
// a b c d           d  e           a b e f