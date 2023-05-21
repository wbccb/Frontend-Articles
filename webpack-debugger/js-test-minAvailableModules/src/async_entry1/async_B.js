
import {getD} from "../item/d";
import {getE} from "../item/e";

getD();
getE();

import (/*webpackChunkName: "C"*/"./async_C.js").then(bModule=> {
    bModule.default();
});
