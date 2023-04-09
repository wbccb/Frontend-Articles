import { createApp } from "vue";
import App from "./App";
import { toString, toArray } from "lodash-es";
import "./main.css";
import {test1Fn} from "./test1";

console.log(toString(123) + test1Fn());
console.log(toArray([]));

createApp(App).mount("#app");

