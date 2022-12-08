import ItemChildren from "./index_item-children.js";

const itemChildren = new ItemChildren();

var a = 1;
var b = 22;
var c = itemChildren.add(a, b);

function test() {
    return c+44;
}

export function getC() {
    return test;
}