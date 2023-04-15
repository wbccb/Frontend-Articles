import { createApp } from "vue";
import App from "./App";
import { toString, toArray } from "lodash-es";
import "./main.css";
import {test1Fn, test2_child_Fn} from "./test1";
import.meta.hot = __vite__createHotContext("/src/main.js");
import {AExport} from "./simple/A.js";
import CommonJS from "./commonjs/index";
import React from "react";

console.error("CommonJS", CommonJS);
console.warn("React", React);

import.meta.hot.acceptExports(["aa"]);

console.log("我是main.js", toString(123) + test1Fn() + test2_child_Fn()+AExport);

createApp(App).mount("#app");

