import {getG} from "aliasTest/common_____g";
import _ from "loadsh";
import {dirIndex} from "babel-loader!./dir?query=1#location";

console.info(getG() + _.add(3, 4) + dirIndex);