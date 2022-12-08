import {getC} from "./item/index_item-parent.js";
import {getC1} from "./item/index_item-parent1.js";

var temp = 333;
const C1 = getC1(4, 5);
console.log("now c is:", temp + getC(3, 44) + C1);