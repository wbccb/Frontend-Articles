import { createApp } from "vue";
import App from "./App";
import { toString, toArray } from "lodash-es";

console.log(toString(123));
console.log(toArray([]));

createApp(App).mount("#app");

