import {getA} from "../item/a";
import {getB} from "../item/b";
import {getE} from "../item/e";
import {getF} from "../item/f";

getA();
getB();
getE();
getF();


export default function getCJs() {
    return "我CCC=======CCCCC";
}

import (/*webpackChunkName: "D"*/"./async_D.js").then(bModule=> {
    bModule.default();
});