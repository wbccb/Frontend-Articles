
import {getA} from "./item/a";
import {getB} from "./item/b";

getA();
getB();

import (/*webpackChunkName: "B"*/"./async_entry2/async_B_entry2.js").then(bModule=> {
  bModule.default();
});


// entry2.js ---> async_B.js ---> async_C.js
// a  b           b c d             a b c d e