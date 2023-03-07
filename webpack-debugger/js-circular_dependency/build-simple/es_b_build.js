"./src/es_b.js":
(function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {

    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   "b_Value": function () {
            return /* binding */ b_Value;
        }
        /* harmony export */
    });
    /* harmony import */
    var _es_a_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es_a.js */ "./src/es_a.js");
    console.info("bbbbbbb.js开始运行");
    console.warn("在bbbbbbb.js中import得到a", _es_a_js__WEBPACK_IMPORTED_MODULE_0__.a_Value);
    var b_Value = "我是一开始的b.js";
    console.info("b.js结束运行");
    setTimeout(() => {
        b_Value = "我是结束后改变的b.js";
        console.warn("在b.js中延迟后再次import得到a", _es_a_js__WEBPACK_IMPORTED_MODULE_0__.a_Value);
    }, 500);
})