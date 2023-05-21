import {getA} from "../item/a";
import {getB} from "../item/b";
import {getC} from "../item/c";
import {getD} from "../item/d";
import {getE} from "../item/e";

getA();
getB();
getC();
getD();
getE();


export default function getCJs() {
    return "我CCC=======CCCCC";
}

import (/*webpackChunkName: "D"*/"./async_D_entry2.js").then(bModule=> {
    bModule.default();
});