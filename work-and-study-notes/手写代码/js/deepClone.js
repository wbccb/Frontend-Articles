// 深拷贝
const mapType = "[object Map]";
const setType = "[object Set]";
const objectType = "[object Object]";
const functionType = "[object Function]";
const arrayType = "[object Array]";
const argsTag = "[object Arguments]"; // 不是很熟


const numberType = "[object Number]";
const booleanType = "[object Boolean]";
const stringType = "[object String]";
const dataType = "[object Date]";
const errorType = "[object Error]"; // 不是很熟
const regexType = "[object RegExp]"; // 不是很熟
const symbolType = "[object Symbol]"; // 不是很熟

const deepType = [mapType, setType, arrayType, objectType, argsTag];


function getType(target) {
    return Object.prototype.toString.call(target);
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function deepClone(target, map = new Map()) {
    if(!isObject(target)) {
        // 非引用类型直接返回
        return target;
    }

    if(map.get(target)) {
        // 循环引用直接返回
        return map.get(target);
    }

    const isArray = Array.isArray(target);
    const type = getType(target);

    let cloneTarget;
    if(deepType.includes(type)) {
        // 引用类型先通过构造函数初始化
        cloneTarget = getInit(target);

        map.set(target, cloneTarget);

        if(type === mapType) {
            target.forEach((value, key)=> {
                cloneTarget.set(key, deepClone(value, map));
            });
        }
        else if(type === setType) {
            target.forEach((value, value)=> {
                cloneTarget.add(deepClone(value));
            });
        }
        else {
            // Array/Object
            const keys = Object.keys(target);
            for(let key of keys) {
                cloneTarget[key] = deepClone(target[key], map);
            }
        }
        return cloneTarget;
    }

    return cloneOtherType(target, type);
}

function cloneOtherType(target, type) {
    const Ctor = target.constructor;
    switch (type) {
        case booleanType:
        case numberType:
        case stringType:
        case errorType:
        case dataType:
            return new Ctor(target);
        case regexType:
            return cloneReg(target);
        case symbolType:
            return cloneSymbol(target);
        case functionType:
            return cloneFunction(target);
    }
}

function cloneReg(target) {
    const source = target.source;
    const regFlags = /\w+$/;

    const result = new target.constructor(source, regFlags.exec(target));
    result.lastIndex = target.lastIndex;
    return result;
}

function cloneSymbol(target) {
    return target;
}

// https://github.com/ConardLi/ConardLi.github.io/blob/master/demo/deepClone/src/clone_6.js
function cloneFunction(target) {
    // 两种类型的function
    // clone的时候是 target[key] = deepClone(xxx)，因此不需要考虑名称，只需要考虑function

    // \s表示匹配所有的空白字符
    const paramsReg = /(?<=\().+(?=\)\s+{)/;
    // /m表示多行匹配；/g表示全局匹配，要匹配多个结果，而不是匹配第一个结果就结束匹配；/i表示匹配不在乎大小写
    const bodyReg = /(?<={)(.|\n)+(?=})/m;

    const funcString = target.toString();

    // 箭头函数没有prototype
    if (target.prototype) {

        // 解析出body和params，然后新建一个新的function进行返回
        const params = paramsReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (params) {
                const paramsArray = params[0].split(",");
                // new Function，使用字符串创建方法，不懂可以看：https://zh.javascript.info/new-function
                // let temp = new Function(["a","b"], "return a+b;")这两种写法都可以
                // let temp = new Function("a","b", "return a+b;")这两种写法都可以
                return new Function(...paramsArray, body[0]);
            } else {
                // new Function，使用字符串创建方法，不懂可以看：https://zh.javascript.info/new-function
                return new Function(body[0]);
            }
        } else {
            return null;
        }

    } else {
        return eval(funcString);
    }
}
