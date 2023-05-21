import {getB} from "../item/b";
import {getD} from "../item/d";
import {getE} from "../item/e";

getB();
getD();
getE();

import (/*webpackChunkName: "C"*/"./async_C_entry2.js").then(bModule=> {
    bModule.default();
});
