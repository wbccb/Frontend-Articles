"./src/es_a.js":
(function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {

    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   "a_Value": function () {
            return /* binding */ a_Value;
        }
        /* harmony export */
    });
    /* harmony import */
    var _es_b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es_b.js */ "./src/es_b.js");

    console.info("a.js开始运行");
    console.warn("在a.js中import得到b", _es_b_js__WEBPACK_IMPORTED_MODULE_0__.b_Value);

    var a_Value = "我是一开始的a.js";
    console.info("a.js结束运行");

    setTimeout(() => {
        console.warn("在a.js结束运行后(b.js那边已经在500毫秒前改变值)再次import得到b",
            _es_b_js__WEBPACK_IMPORTED_MODULE_0__.b_Value);
    }, 1000);
})