import {getG} from "./item/common_____g.js";
import Cookies from 'js-cookie';
Cookies.set('foo', 'bar')
import (/*webpackChunkName: "B"*/"./async/async_B.js").then(bModule=> {
    bModule.default();
});

console.info("getA2E", getG());
