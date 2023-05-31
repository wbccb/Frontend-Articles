import {getE} from "./item/entry1_a.js";
import {getF} from "./item/entry1_b.js";
import {getG} from "./item/common_____g.js";
import _ from "loadsh";
import Cookies from 'js-cookie';
Cookies.set('foo', 'bar')

console.info(_.add(13, 24));



axios.defaults.params = {"test": 1};

var testvalue = getE() + getF() + getG();

import (/*webpackChunkName: "B"*/"./async/async_B.js").then(bModule=> {
    bModule.default();
});

import (/*webpackChunkName: "C"*/"./async/async_C.js").then(bModule=> {
    bModule.default();
});

setTimeout(()=> {
    console.info("testvalue", testvalue + _.add(13, 24));
}, 2000);
