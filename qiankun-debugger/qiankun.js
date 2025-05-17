var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { mergeWith, concat, cloneDeep, memoize, once, snakeCase, isFunction, without, noop, forEach } from "lodash";
var t = Object.freeze({ __proto__: null, get start() {
        return Bt;
    }, get ensureJQuerySupport() {
        return lt;
    }, get setBootstrapMaxTime() {
        return J;
    }, get setMountMaxTime() {
        return H;
    }, get setUnmountMaxTime() {
        return Q;
    }, get setUnloadMaxTime() {
        return V;
    }, get registerApplication() {
        return bt;
    }, get unregisterApplication() {
        return At;
    }, get getMountedApps() {
        return yt;
    }, get getAppStatus() {
        return Ot;
    }, get unloadApplication() {
        return Nt;
    }, get checkActivityFunctions() {
        return Tt;
    }, get getAppNames() {
        return Pt;
    }, get pathToActiveWhen() {
        return Dt;
    }, get navigateToUrl() {
        return et;
    }, get triggerAppChange() {
        return Lt;
    }, get addErrorHandler() {
        return a;
    }, get removeErrorHandler() {
        return c;
    }, get mountRootParcel() {
        return W;
    }, get NOT_LOADED() {
        return l;
    }, get LOADING_SOURCE_CODE() {
        return p;
    }, get NOT_BOOTSTRAPPED() {
        return h;
    }, get BOOTSTRAPPING() {
        return m;
    }, get NOT_MOUNTED() {
        return v;
    }, get MOUNTING() {
        return d;
    }, get UPDATING() {
        return g;
    }, get LOAD_ERROR() {
        return P;
    }, get MOUNTED() {
        return w;
    }, get UNLOADING() {
        return y;
    }, get UNMOUNTING() {
        return E;
    }, get SKIP_BECAUSE_BROKEN() {
        return O;
    } });
function n(t2) {
    return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
        return typeof t3;
    } : function(t3) {
        return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
    })(t2);
}
function e(t2, n2, e2) {
    return n2 in t2 ? Object.defineProperty(t2, n2, { value: e2, enumerable: true, configurable: true, writable: true }) : t2[n2] = e2, t2;
}
var r = ("undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}).CustomEvent, o = function() {
    try {
        var t2 = new r("cat", { detail: { foo: "bar" } });
        return "cat" === t2.type && "bar" === t2.detail.foo;
    } catch (t3) {
    }
    return false;
}() ? r : "undefined" != typeof document && "function" == typeof document.createEvent ? function(t2, n2) {
    var e2 = document.createEvent("CustomEvent");
    return n2 ? e2.initCustomEvent(t2, n2.bubbles, n2.cancelable, n2.detail) : e2.initCustomEvent(t2, false, false, void 0), e2;
} : function(t2, n2) {
    var e2 = document.createEventObject();
    return e2.type = t2, n2 ? (e2.bubbles = Boolean(n2.bubbles), e2.cancelable = Boolean(n2.cancelable), e2.detail = n2.detail) : (e2.bubbles = false, e2.cancelable = false, e2.detail = void 0), e2;
}, i = [];
function u(t2, n2, e2) {
    var r2 = f(t2, n2, e2);
    i.length ? i.forEach(function(t3) {
        return t3(r2);
    }) : setTimeout(function() {
        throw r2;
    });
}
function a(t2) {
    if ("function" != typeof t2) throw Error(s(28, false));
    i.push(t2);
}
function c(t2) {
    if ("function" != typeof t2) throw Error(s(29, false));
    var n2 = false;
    return i = i.filter(function(e2) {
        var r2 = e2 === t2;
        return n2 = n2 || r2, !r2;
    }), n2;
}
function s(t2, n2) {
    for (var e2 = arguments.length, r2 = new Array(e2 > 2 ? e2 - 2 : 0), o2 = 2; o2 < e2; o2++) r2[o2 - 2] = arguments[o2];
    return "single-spa minified message #".concat(t2, ": ").concat("", "See https://single-spa.js.org/error/?code=").concat(t2).concat(r2.length ? "&arg=".concat(r2.join("&arg=")) : "");
}
function f(t2, n2, e2) {
    var r2, o2 = "".concat(S(n2), " '").concat(A(n2), "' died in status ").concat(n2.status, ": ");
    if (t2 instanceof Error) {
        try {
            t2.message = o2 + t2.message;
        } catch (t3) {
        }
        r2 = t2;
    } else {
        console.warn(s(30, false, n2.status, A(n2)));
        try {
            r2 = Error(o2 + JSON.stringify(t2));
        } catch (n3) {
            r2 = t2;
        }
    }
    return r2.appOrParcelName = A(n2), n2.status = e2, r2;
}
var l = "NOT_LOADED", p = "LOADING_SOURCE_CODE", h = "NOT_BOOTSTRAPPED", m = "BOOTSTRAPPING", v = "NOT_MOUNTED", d = "MOUNTING", w = "MOUNTED", g = "UPDATING", E = "UNMOUNTING", y = "UNLOADING", P = "LOAD_ERROR", O = "SKIP_BECAUSE_BROKEN";
function b(t2) {
    return t2.status === w;
}
function T(t2) {
    try {
        return t2.activeWhen(window.location);
    } catch (n2) {
        return u(n2, t2, O), false;
    }
}
function A(t2) {
    return t2.name;
}
function N(t2) {
    return Boolean(t2.unmountThisParcel);
}
function S(t2) {
    return N(t2) ? "parcel" : "application";
}
function _() {
    for (var t2 = arguments.length - 1; t2 > 0; t2--) for (var n2 in arguments[t2]) "__proto__" !== n2 && (arguments[t2 - 1][n2] = arguments[t2][n2]);
    return arguments[0];
}
function D(t2, n2) {
    for (var e2 = 0; e2 < t2.length; e2++) if (n2(t2[e2])) return t2[e2];
    return null;
}
function U(t2) {
    return t2 && ("function" == typeof t2 || (n2 = t2, Array.isArray(n2) && !D(n2, function(t3) {
        return "function" != typeof t3;
    })));
    var n2;
}
function j(t2, n2) {
    var e2 = t2[n2] || [];
    0 === (e2 = Array.isArray(e2) ? e2 : [e2]).length && (e2 = [function() {
        return Promise.resolve();
    }]);
    var r2 = S(t2), o2 = A(t2);
    return function(t3) {
        return e2.reduce(function(e3, i2, u2) {
            return e3.then(function() {
                var e4 = i2(t3);
                return M(e4) ? e4 : Promise.reject(s(15, false, r2, o2, n2, u2));
            });
        }, Promise.resolve());
    };
}
function M(t2) {
    return t2 && "function" == typeof t2.then && "function" == typeof t2.catch;
}
function L(t2, n2) {
    return Promise.resolve().then(function() {
        return t2.status !== h ? t2 : (t2.status = m, t2.bootstrap ? q(t2, "bootstrap").then(e2).catch(function(e3) {
            if (n2) throw f(e3, t2, O);
            return u(e3, t2, O), t2;
        }) : Promise.resolve().then(e2));
    });
    function e2() {
        return t2.status = v, t2;
    }
}
function R(t2, n2) {
    return Promise.resolve().then(function() {
        if (t2.status !== w) return t2;
        t2.status = E;
        var e2 = Object.keys(t2.parcels).map(function(n3) {
            return t2.parcels[n3].unmountThisParcel();
        });
        return Promise.all(e2).then(r2, function(e3) {
            return r2().then(function() {
                var r3 = Error(e3.message);
                if (n2) throw f(r3, t2, O);
                u(r3, t2, O);
            });
        }).then(function() {
            return t2;
        });
        function r2() {
            return q(t2, "unmount").then(function() {
                t2.status = v;
            }).catch(function(e3) {
                if (n2) throw f(e3, t2, O);
                u(e3, t2, O);
            });
        }
    });
}
var I = false, x = false;
function B(t2, n2) {
    return Promise.resolve().then(function() {
        return t2.status !== v ? t2 : (I || (window.dispatchEvent(new o("single-spa:before-first-mount")), I = true), q(t2, "mount").then(function() {
            return t2.status = w, x || (window.dispatchEvent(new o("single-spa:first-mount")), x = true), t2;
        }).catch(function(e2) {
            return t2.status = w, R(t2, true).then(r2, r2);
            function r2() {
                if (n2) throw f(e2, t2, O);
                return u(e2, t2, O), t2;
            }
        }));
    });
}
var G = 0, C = { parcels: {} };
function W() {
    return $.apply(C, arguments);
}
function $(t2, e2) {
    var r2 = this;
    if (!t2 || "object" !== n(t2) && "function" != typeof t2) throw Error(s(2, false));
    if (t2.name && "string" != typeof t2.name) throw Error(s(3, false, n(t2.name)));
    if ("object" !== n(e2)) throw Error(s(4, false, name, n(e2)));
    if (!e2.domElement) throw Error(s(5, false, name));
    var o2, i2 = G++, u2 = "function" == typeof t2, a2 = u2 ? t2 : function() {
        return Promise.resolve(t2);
    }, c2 = { id: i2, parcels: {}, status: u2 ? p : h, customProps: e2, parentName: A(r2), unmountThisParcel: function() {
            return y2.then(function() {
                if (c2.status !== w) throw Error(s(6, false, name, c2.status));
                return R(c2, true);
            }).then(function(t3) {
                return c2.parentName && delete r2.parcels[c2.id], t3;
            }).then(function(t3) {
                return m2(t3), t3;
            }).catch(function(t3) {
                throw c2.status = O, d2(t3), t3;
            });
        } };
    r2.parcels[i2] = c2;
    var l2 = a2();
    if (!l2 || "function" != typeof l2.then) throw Error(s(7, false));
    var m2, d2, E2 = (l2 = l2.then(function(t3) {
        if (!t3) throw Error(s(8, false));
        var n2 = t3.name || "parcel-".concat(i2);
        if (Object.prototype.hasOwnProperty.call(t3, "bootstrap") && !U(t3.bootstrap)) throw Error(s(9, false, n2));
        if (!U(t3.mount)) throw Error(s(10, false, n2));
        if (!U(t3.unmount)) throw Error(s(11, false, n2));
        if (t3.update && !U(t3.update)) throw Error(s(12, false, n2));
        var e3 = j(t3, "bootstrap"), r3 = j(t3, "mount"), u3 = j(t3, "unmount");
        c2.status = h, c2.name = n2, c2.bootstrap = e3, c2.mount = r3, c2.unmount = u3, c2.timeouts = z(t3.timeouts), t3.update && (c2.update = j(t3, "update"), o2.update = function(t4) {
            return c2.customProps = t4, k(function(t5) {
                return Promise.resolve().then(function() {
                    if (t5.status !== w) throw Error(s(32, false, A(t5)));
                    return t5.status = g, q(t5, "update").then(function() {
                        return t5.status = w, t5;
                    }).catch(function(n3) {
                        throw f(n3, t5, O);
                    });
                });
            }(c2));
        });
    })).then(function() {
        return L(c2, true);
    }), y2 = E2.then(function() {
        return B(c2, true);
    }), P2 = new Promise(function(t3, n2) {
        m2 = t3, d2 = n2;
    });
    return o2 = { mount: function() {
            return k(Promise.resolve().then(function() {
                if (c2.status !== v) throw Error(s(13, false, name, c2.status));
                return r2.parcels[i2] = c2, B(c2);
            }));
        }, unmount: function() {
            return k(c2.unmountThisParcel());
        }, getStatus: function() {
            return c2.status;
        }, loadPromise: k(l2), bootstrapPromise: k(E2), mountPromise: k(y2), unmountPromise: k(P2) };
}
function k(t2) {
    return t2.then(function() {
        return null;
    });
}
function K(e2) {
    var r2 = A(e2), o2 = "function" == typeof e2.customProps ? e2.customProps(r2, window.location) : e2.customProps;
    ("object" !== n(o2) || null === o2 || Array.isArray(o2)) && (o2 = {}, console.warn(s(40, false), r2, o2));
    var i2 = _({}, o2, { name: r2, mountParcel: $.bind(e2), singleSpa: t });
    return N(e2) && (i2.unmountSelf = e2.unmountThisParcel), i2;
}
var F = { bootstrap: { millis: 4e3, dieOnTimeout: false, warningMillis: 1e3 }, mount: { millis: 3e3, dieOnTimeout: false, warningMillis: 1e3 }, unmount: { millis: 3e3, dieOnTimeout: false, warningMillis: 1e3 }, unload: { millis: 3e3, dieOnTimeout: false, warningMillis: 1e3 }, update: { millis: 3e3, dieOnTimeout: false, warningMillis: 1e3 } };
function J(t2, n2, e2) {
    if ("number" != typeof t2 || t2 <= 0) throw Error(s(16, false));
    F.bootstrap = { millis: t2, dieOnTimeout: n2, warningMillis: e2 || 1e3 };
}
function H(t2, n2, e2) {
    if ("number" != typeof t2 || t2 <= 0) throw Error(s(17, false));
    F.mount = { millis: t2, dieOnTimeout: n2, warningMillis: e2 || 1e3 };
}
function Q(t2, n2, e2) {
    if ("number" != typeof t2 || t2 <= 0) throw Error(s(18, false));
    F.unmount = { millis: t2, dieOnTimeout: n2, warningMillis: e2 || 1e3 };
}
function V(t2, n2, e2) {
    if ("number" != typeof t2 || t2 <= 0) throw Error(s(19, false));
    F.unload = { millis: t2, dieOnTimeout: n2, warningMillis: e2 || 1e3 };
}
function q(t2, n2) {
    var e2 = t2.timeouts[n2], r2 = e2.warningMillis, o2 = S(t2);
    return new Promise(function(i2, u2) {
        var a2 = false, c2 = false;
        t2[n2](K(t2)).then(function(t3) {
            a2 = true, i2(t3);
        }).catch(function(t3) {
            a2 = true, u2(t3);
        }), setTimeout(function() {
            return l2(1);
        }, r2), setTimeout(function() {
            return l2(true);
        }, e2.millis);
        var f2 = s(31, false, n2, o2, A(t2), e2.millis);
        function l2(t3) {
            if (!a2) {
                if (true === t3) c2 = true, e2.dieOnTimeout ? u2(Error(f2)) : console.error(f2);
                else if (!c2) {
                    var n3 = t3, o3 = n3 * r2;
                    console.warn(f2), o3 + r2 < e2.millis && setTimeout(function() {
                        return l2(n3 + 1);
                    }, r2);
                }
            }
        }
    });
}
function z(t2) {
    var n2 = {};
    for (var e2 in F) n2[e2] = _({}, F[e2], t2 && t2[e2] || {});
    return n2;
}
function X(t2) {
    return Promise.resolve().then(function() {
        return t2.loadPromise ? t2.loadPromise : t2.status !== l && t2.status !== P ? t2 : (t2.status = p, t2.loadPromise = Promise.resolve().then(function() {
            var o2 = t2.loadApp(K(t2));
            if (!M(o2)) throw r2 = true, Error(s(33, false, A(t2)));
            return o2.then(function(r3) {
                var o3;
                t2.loadErrorTime = null, "object" !== n(e2 = r3) && (o3 = 34), Object.prototype.hasOwnProperty.call(e2, "bootstrap") && !U(e2.bootstrap) && (o3 = 35), U(e2.mount) || (o3 = 36), U(e2.unmount) || (o3 = 37);
                var i2 = S(e2);
                if (o3) {
                    var a2;
                    try {
                        a2 = JSON.stringify(e2);
                    } catch (t3) {
                    }
                    return console.error(s(o3, false, i2, A(t2), a2), e2), u(void 0, t2, O), t2;
                }
                return e2.devtools && e2.devtools.overlays && (t2.devtools.overlays = _({}, t2.devtools.overlays, e2.devtools.overlays)), t2.status = h, t2.bootstrap = j(e2, "bootstrap"), t2.mount = j(e2, "mount"), t2.unmount = j(e2, "unmount"), t2.unload = j(e2, "unload"), t2.timeouts = z(e2.timeouts), delete t2.loadPromise, t2;
            });
        }).catch(function(n2) {
            var e3;
            return delete t2.loadPromise, r2 ? e3 = O : (e3 = P, t2.loadErrorTime = (/* @__PURE__ */ new Date()).getTime()), u(n2, t2, e3), t2;
        }));
        var e2, r2;
    });
}
var Y, Z = "undefined" != typeof window, tt = { hashchange: [], popstate: [] }, nt = ["hashchange", "popstate"];
function et(t2) {
    var n2;
    if ("string" == typeof t2) n2 = t2;
    else if (this && this.href) n2 = this.href;
    else {
        if (!(t2 && t2.currentTarget && t2.currentTarget.href && t2.preventDefault)) throw Error(s(14, false));
        n2 = t2.currentTarget.href, t2.preventDefault();
    }
    var e2 = st(window.location.href), r2 = st(n2);
    0 === n2.indexOf("#") ? window.location.hash = r2.hash : e2.host !== r2.host && r2.host ? window.location.href = n2 : r2.pathname === e2.pathname && r2.search === e2.search ? window.location.hash = r2.hash : window.history.pushState(null, null, n2);
}
function rt(t2) {
    var n2 = this;
    if (t2) {
        var e2 = t2[0].type;
        nt.indexOf(e2) >= 0 && tt[e2].forEach(function(e3) {
            try {
                e3.apply(n2, t2);
            } catch (t3) {
                setTimeout(function() {
                    throw t3;
                });
            }
        });
    }
}
function ot() {
    Rt([], arguments);
}
function it(t2, n2) {
    return function() {
        var e2 = window.location.href, r2 = t2.apply(this, arguments), o2 = window.location.href;
        return Y && e2 === o2 || (Gt() ? window.dispatchEvent(ut(window.history.state, n2)) : Rt([])), r2;
    };
}
function ut(t2, n2) {
    var e2;
    try {
        e2 = new PopStateEvent("popstate", { state: t2 });
    } catch (n3) {
        (e2 = document.createEvent("PopStateEvent")).initPopStateEvent("popstate", false, false, t2);
    }
    return e2.singleSpa = true, e2.singleSpaTrigger = n2, e2;
}
if (Z) {
    window.addEventListener("hashchange", ot), window.addEventListener("popstate", ot);
    var at = window.addEventListener, ct = window.removeEventListener;
    window.addEventListener = function(t2, n2) {
        if (!("function" == typeof n2 && nt.indexOf(t2) >= 0) || D(tt[t2], function(t3) {
            return t3 === n2;
        })) return at.apply(this, arguments);
        tt[t2].push(n2);
    }, window.removeEventListener = function(t2, n2) {
        if (!("function" == typeof n2 && nt.indexOf(t2) >= 0)) return ct.apply(this, arguments);
        tt[t2] = tt[t2].filter(function(t3) {
            return t3 !== n2;
        });
    }, window.history.pushState = it(window.history.pushState, "pushState"), window.history.replaceState = it(window.history.replaceState, "replaceState"), window.singleSpaNavigate ? console.warn(s(41, false)) : window.singleSpaNavigate = et;
}
function st(t2) {
    var n2 = document.createElement("a");
    return n2.href = t2, n2;
}
var ft = false;
function lt() {
    var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.jQuery;
    if (t2 || window.$ && window.$.fn && window.$.fn.jquery && (t2 = window.$), t2 && !ft) {
        var n2 = t2.fn.on, e2 = t2.fn.off;
        t2.fn.on = function(t3, e3) {
            return pt.call(this, n2, window.addEventListener, t3, e3, arguments);
        }, t2.fn.off = function(t3, n3) {
            return pt.call(this, e2, window.removeEventListener, t3, n3, arguments);
        }, ft = true;
    }
}
function pt(t2, n2, e2, r2, o2) {
    return "string" != typeof e2 ? t2.apply(this, o2) : (e2.split(/\s+/).forEach(function(t3) {
        nt.indexOf(t3) >= 0 && (n2(t3, r2), e2 = e2.replace(t3, ""));
    }), "" === e2.trim() ? this : t2.apply(this, o2));
}
var ht = {};
function mt(t2) {
    return Promise.resolve().then(function() {
        var n2 = ht[A(t2)];
        if (!n2) return t2;
        if (t2.status === l) return vt(t2, n2), t2;
        if (t2.status === y) return n2.promise.then(function() {
            return t2;
        });
        if (t2.status !== v && t2.status !== P) return t2;
        var e2 = t2.status === P ? Promise.resolve() : q(t2, "unload");
        return t2.status = y, e2.then(function() {
            return vt(t2, n2), t2;
        }).catch(function(e3) {
            return function(t3, n3, e4) {
                delete ht[A(t3)], delete t3.bootstrap, delete t3.mount, delete t3.unmount, delete t3.unload, u(e4, t3, O), n3.reject(e4);
            }(t2, n2, e3), t2;
        });
    });
}
function vt(t2, n2) {
    delete ht[A(t2)], delete t2.bootstrap, delete t2.mount, delete t2.unmount, delete t2.unload, t2.status = l, n2.resolve();
}
function dt(t2, n2, e2, r2) {
    ht[A(t2)] = { app: t2, resolve: e2, reject: r2 }, Object.defineProperty(ht[A(t2)], "promise", { get: n2 });
}
function wt(t2) {
    return ht[t2];
}
var gt = [];
function Et() {
    var t2 = [], n2 = [], e2 = [], r2 = [], o2 = (/* @__PURE__ */ new Date()).getTime();
    return gt.forEach(function(i2) {
        var u2 = i2.status !== O && T(i2);
        switch (i2.status) {
            case P:
                u2 && o2 - i2.loadErrorTime >= 200 && e2.push(i2);
                break;
            case l:
            case p:
                u2 && e2.push(i2);
                break;
            case h:
            case v:
                !u2 && wt(A(i2)) ? t2.push(i2) : u2 && r2.push(i2);
                break;
            case w:
                u2 || n2.push(i2);
        }
    }), { appsToUnload: t2, appsToUnmount: n2, appsToLoad: e2, appsToMount: r2 };
}
function yt() {
    return gt.filter(b).map(A);
}
function Pt() {
    return gt.map(A);
}
function Ot(t2) {
    var n2 = D(gt, function(n3) {
        return A(n3) === t2;
    });
    return n2 ? n2.status : null;
}
function bt(t2, e2, r2, o2) {
    var i2 = function(t3, e3, r3, o3) {
        var i3, u2 = { name: null, loadApp: null, activeWhen: null, customProps: null };
        return "object" === n(t3) ? (function(t4) {
            if (Array.isArray(t4) || null === t4) throw Error(s(39, false));
            var e4 = ["name", "app", "activeWhen", "customProps"], r4 = Object.keys(t4).reduce(function(t5, n2) {
                return e4.indexOf(n2) >= 0 ? t5 : t5.concat(n2);
            }, []);
            if (0 !== r4.length) throw Error(s(38, false, e4.join(", "), r4.join(", ")));
            if ("string" != typeof t4.name || 0 === t4.name.length) throw Error(s(20, false));
            if ("object" !== n(t4.app) && "function" != typeof t4.app) throw Error(s(20, false));
            var o4 = function(t5) {
                return "string" == typeof t5 || "function" == typeof t5;
            };
            if (!(o4(t4.activeWhen) || Array.isArray(t4.activeWhen) && t4.activeWhen.every(o4))) throw Error(s(24, false));
            if (!_t(t4.customProps)) throw Error(s(22, false));
        }(t3), u2.name = t3.name, u2.loadApp = t3.app, u2.activeWhen = t3.activeWhen, u2.customProps = t3.customProps) : (function(t4, n2, e4, r4) {
            if ("string" != typeof t4 || 0 === t4.length) throw Error(s(20, false));
            if (!n2) throw Error(s(23, false));
            if ("function" != typeof e4) throw Error(s(24, false));
            if (!_t(r4)) throw Error(s(22, false));
        }(t3, e3, r3, o3), u2.name = t3, u2.loadApp = e3, u2.activeWhen = r3, u2.customProps = o3), u2.loadApp = "function" != typeof (i3 = u2.loadApp) ? function() {
            return Promise.resolve(i3);
        } : i3, u2.customProps = /* @__PURE__ */ function(t4) {
            return t4 || {};
        }(u2.customProps), u2.activeWhen = function(t4) {
            var n2 = Array.isArray(t4) ? t4 : [t4];
            return n2 = n2.map(function(t5) {
                return "function" == typeof t5 ? t5 : Dt(t5);
            }), function(t5) {
                return n2.some(function(n3) {
                    return n3(t5);
                });
            };
        }(u2.activeWhen), u2;
    }(t2, e2, r2, o2);
    if (-1 !== Pt().indexOf(i2.name)) throw Error(s(21, false, i2.name));
    gt.push(_({ loadErrorTime: null, status: l, parcels: {}, devtools: { overlays: { options: {}, selectors: [] } } }, i2)), Z && (lt(), Rt());
}
function Tt() {
    var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location;
    return gt.filter(function(n2) {
        return n2.activeWhen(t2);
    }).map(A);
}
function At(t2) {
    if (0 === gt.filter(function(n2) {
        return A(n2) === t2;
    }).length) throw Error(s(25, false, t2));
    return Nt(t2).then(function() {
        var n2 = gt.map(A).indexOf(t2);
        gt.splice(n2, 1);
    });
}
function Nt(t2) {
    var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { waitForUnmount: false };
    if ("string" != typeof t2) throw Error(s(26, false));
    var e2 = D(gt, function(n3) {
        return A(n3) === t2;
    });
    if (!e2) throw Error(s(27, false, t2));
    var r2, o2 = wt(A(e2));
    if (n2 && n2.waitForUnmount) {
        if (o2) return o2.promise;
        var i2 = new Promise(function(t3, n3) {
            dt(e2, function() {
                return i2;
            }, t3, n3);
        });
        return i2;
    }
    return o2 ? (r2 = o2.promise, St(e2, o2.resolve, o2.reject)) : r2 = new Promise(function(t3, n3) {
        dt(e2, function() {
            return r2;
        }, t3, n3), St(e2, t3, n3);
    }), r2;
}
function St(t2, n2, e2) {
    R(t2).then(mt).then(function() {
        n2(), setTimeout(function() {
            Rt();
        });
    }).catch(e2);
}
function _t(t2) {
    return !t2 || "function" == typeof t2 || "object" === n(t2) && null !== t2 && !Array.isArray(t2);
}
function Dt(t2, n2) {
    var e2 = function(t3, n3) {
        var e3 = 0, r2 = false, o2 = "^";
        "/" !== t3[0] && (t3 = "/" + t3);
        for (var i2 = 0; i2 < t3.length; i2++) {
            var u2 = t3[i2];
            (!r2 && ":" === u2 || r2 && "/" === u2) && a2(i2);
        }
        return a2(t3.length), new RegExp(o2, "i");
        function a2(i3) {
            var u3 = t3.slice(e3, i3).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
            if (o2 += r2 ? "[^/]+/?" : u3, i3 === t3.length) if (r2) n3 && (o2 += "$");
            else {
                var a3 = n3 ? "" : ".*";
                o2 = "/" === o2.charAt(o2.length - 1) ? "".concat(o2).concat(a3, "$") : "".concat(o2, "(/").concat(a3, ")?(#.*)?$");
            }
            r2 = !r2, e3 = i3;
        }
    }(t2, n2);
    return function(t3) {
        var n3 = t3.origin;
        n3 || (n3 = "".concat(t3.protocol, "//").concat(t3.host));
        var r2 = t3.href.replace(n3, "").replace(t3.search, "").split("?")[0];
        return e2.test(r2);
    };
}
var Ut = false, jt = [], Mt = Z && window.location.href;
function Lt() {
    return Rt();
}
function Rt() {
    var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], n2 = arguments.length > 1 ? arguments[1] : void 0;
    if (Ut) return new Promise(function(t3, e2) {
        jt.push({ resolve: t3, reject: e2, eventArguments: n2 });
    });
    var r2, i2 = Et(), u2 = i2.appsToUnload, a2 = i2.appsToUnmount, c2 = i2.appsToLoad, s2 = i2.appsToMount, f2 = false, p2 = Mt, h2 = Mt = window.location.href;
    return Gt() ? (Ut = true, r2 = u2.concat(c2, a2, s2), g2()) : (r2 = c2, d2());
    function m2() {
        f2 = true;
    }
    function d2() {
        return Promise.resolve().then(function() {
            var t3 = c2.map(X);
            return Promise.all(t3).then(y2).then(function() {
                return [];
            }).catch(function(t4) {
                throw y2(), t4;
            });
        });
    }
    function g2() {
        return Promise.resolve().then(function() {
            if (window.dispatchEvent(new o(0 === r2.length ? "single-spa:before-no-app-change" : "single-spa:before-app-change", P2(true))), window.dispatchEvent(new o("single-spa:before-routing-event", P2(true, { cancelNavigation: m2 }))), f2) return window.dispatchEvent(new o("single-spa:before-mount-routing-event", P2(true))), E2(), void et(p2);
            var n3 = u2.map(mt), e2 = a2.map(R).map(function(t3) {
                return t3.then(mt);
            }).concat(n3), i3 = Promise.all(e2);
            i3.then(function() {
                window.dispatchEvent(new o("single-spa:before-mount-routing-event", P2(true)));
            });
            var l2 = c2.map(function(t3) {
                return X(t3).then(function(t4) {
                    return It(t4, i3);
                });
            }), h3 = s2.filter(function(t3) {
                return c2.indexOf(t3) < 0;
            }).map(function(t3) {
                return It(t3, i3);
            });
            return i3.catch(function(t3) {
                throw y2(), t3;
            }).then(function() {
                return y2(), Promise.all(l2.concat(h3)).catch(function(n4) {
                    throw t2.forEach(function(t3) {
                        return t3.reject(n4);
                    }), n4;
                }).then(E2);
            });
        });
    }
    function E2() {
        var n3 = yt();
        t2.forEach(function(t3) {
            return t3.resolve(n3);
        });
        try {
            var e2 = 0 === r2.length ? "single-spa:no-app-change" : "single-spa:app-change";
            window.dispatchEvent(new o(e2, P2())), window.dispatchEvent(new o("single-spa:routing-event", P2()));
        } catch (t3) {
            setTimeout(function() {
                throw t3;
            });
        }
        if (Ut = false, jt.length > 0) {
            var i3 = jt;
            jt = [], Rt(i3);
        }
        return n3;
    }
    function y2() {
        t2.forEach(function(t3) {
            rt(t3.eventArguments);
        }), rt(n2);
    }
    function P2() {
        var t3, o2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], i3 = arguments.length > 1 ? arguments[1] : void 0, m3 = {}, d3 = (e(t3 = {}, w, []), e(t3, v, []), e(t3, l, []), e(t3, O, []), t3);
        o2 ? (c2.concat(s2).forEach(function(t4, n3) {
            E3(t4, w);
        }), u2.forEach(function(t4) {
            E3(t4, l);
        }), a2.forEach(function(t4) {
            E3(t4, v);
        })) : r2.forEach(function(t4) {
            E3(t4);
        });
        var g3 = { detail: { newAppStatuses: m3, appsByNewStatus: d3, totalAppChanges: r2.length, originalEvent: null == n2 ? void 0 : n2[0], oldUrl: p2, newUrl: h2, navigationIsCanceled: f2 } };
        return i3 && _(g3.detail, i3), g3;
        function E3(t4, n3) {
            var e2 = A(t4);
            n3 = n3 || Ot(e2), m3[e2] = n3, (d3[n3] = d3[n3] || []).push(e2);
        }
    }
}
function It(t2, n2) {
    return T(t2) ? L(t2).then(function(t3) {
        return n2.then(function() {
            return T(t3) ? B(t3) : t3;
        });
    }) : n2.then(function() {
        return t2;
    });
}
var xt = false;
function Bt(t2) {
    var n2;
    xt = true, t2 && t2.urlRerouteOnly && (n2 = t2.urlRerouteOnly, Y = n2), Z && Rt();
}
function Gt() {
    return xt;
}
Z && setTimeout(function() {
    xt || console.warn(s(1, false));
}, 5e3);
var Ct = { getRawAppData: function() {
        return [].concat(gt);
    }, reroute: Rt, NOT_LOADED: l, toLoadPromise: X, toBootstrapPromise: L, unregisterApplication: At };
Z && window.__SINGLE_SPA_DEVTOOLS__ && (window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = Ct);
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self2, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var regeneratorRuntime$1 = { exports: {} };
var _typeof$1 = { exports: {} };
var hasRequired_typeof;
function require_typeof() {
    if (hasRequired_typeof) return _typeof$1.exports;
    hasRequired_typeof = 1;
    (function(module) {
        function _typeof2(obj) {
            "@babel/helpers - typeof";
            return module.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
                return typeof obj2;
            } : function(obj2) {
                return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
            }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof2(obj);
        }
        module.exports = _typeof2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    })(_typeof$1);
    return _typeof$1.exports;
}
var hasRequiredRegeneratorRuntime;
function requireRegeneratorRuntime() {
    if (hasRequiredRegeneratorRuntime) return regeneratorRuntime$1.exports;
    hasRequiredRegeneratorRuntime = 1;
    (function(module) {
        var _typeof2 = require_typeof()["default"];
        function _regeneratorRuntime2() {
            /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
            module.exports = _regeneratorRuntime2 = function _regeneratorRuntime3() {
                return exports;
            }, module.exports.__esModule = true, module.exports["default"] = module.exports;
            var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
            function define(obj, key, value) {
                return Object.defineProperty(obj, key, {
                    value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                }), obj[key];
            }
            try {
                define({}, "");
            } catch (err) {
                define = function define2(obj, key, value) {
                    return obj[key] = value;
                };
            }
            function wrap(innerFn, outerFn, self2, tryLocsList) {
                var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []);
                return generator._invoke = /* @__PURE__ */ function(innerFn2, self3, context2) {
                    var state = "suspendedStart";
                    return function(method, arg) {
                        if ("executing" === state) throw new Error("Generator is already running");
                        if ("completed" === state) {
                            if ("throw" === method) throw arg;
                            return doneResult();
                        }
                        for (context2.method = method, context2.arg = arg; ; ) {
                            var delegate = context2.delegate;
                            if (delegate) {
                                var delegateResult = maybeInvokeDelegate(delegate, context2);
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel) continue;
                                    return delegateResult;
                                }
                            }
                            if ("next" === context2.method) context2.sent = context2._sent = context2.arg;
                            else if ("throw" === context2.method) {
                                if ("suspendedStart" === state) throw state = "completed", context2.arg;
                                context2.dispatchException(context2.arg);
                            } else "return" === context2.method && context2.abrupt("return", context2.arg);
                            state = "executing";
                            var record = tryCatch(innerFn2, self3, context2);
                            if ("normal" === record.type) {
                                if (state = context2.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
                                return {
                                    value: record.arg,
                                    done: context2.done
                                };
                            }
                            "throw" === record.type && (state = "completed", context2.method = "throw", context2.arg = record.arg);
                        }
                    };
                }(innerFn, self2, context), generator;
            }
            function tryCatch(fn, obj, arg) {
                try {
                    return {
                        type: "normal",
                        arg: fn.call(obj, arg)
                    };
                } catch (err) {
                    return {
                        type: "throw",
                        arg: err
                    };
                }
            }
            exports.wrap = wrap;
            var ContinueSentinel = {};
            function Generator() {
            }
            function GeneratorFunction() {
            }
            function GeneratorFunctionPrototype() {
            }
            var IteratorPrototype = {};
            define(IteratorPrototype, iteratorSymbol, function() {
                return this;
            });
            var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
            NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
            var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
            function defineIteratorMethods(prototype) {
                ["next", "throw", "return"].forEach(function(method) {
                    define(prototype, method, function(arg) {
                        return this._invoke(method, arg);
                    });
                });
            }
            function AsyncIterator(generator, PromiseImpl) {
                function invoke(method, arg, resolve, reject) {
                    var record = tryCatch(generator[method], generator, arg);
                    if ("throw" !== record.type) {
                        var result = record.arg, value = result.value;
                        return value && "object" == _typeof2(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function(value2) {
                            invoke("next", value2, resolve, reject);
                        }, function(err) {
                            invoke("throw", err, resolve, reject);
                        }) : PromiseImpl.resolve(value).then(function(unwrapped) {
                            result.value = unwrapped, resolve(result);
                        }, function(error) {
                            return invoke("throw", error, resolve, reject);
                        });
                    }
                    reject(record.arg);
                }
                var previousPromise;
                this._invoke = function(method, arg) {
                    function callInvokeWithMethodAndArg() {
                        return new PromiseImpl(function(resolve, reject) {
                            invoke(method, arg, resolve, reject);
                        });
                    }
                    return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                };
            }
            function maybeInvokeDelegate(delegate, context) {
                var method = delegate.iterator[context.method];
                if (void 0 === method) {
                    if (context.delegate = null, "throw" === context.method) {
                        if (delegate.iterator["return"] && (context.method = "return", context.arg = void 0, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
                        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
                    }
                    return ContinueSentinel;
                }
                var record = tryCatch(method, delegate.iterator, context.arg);
                if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
                var info = record.arg;
                return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = void 0), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
            }
            function pushTryEntry(locs) {
                var entry = {
                    tryLoc: locs[0]
                };
                1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
            }
            function resetTryEntry(entry) {
                var record = entry.completion || {};
                record.type = "normal", delete record.arg, entry.completion = record;
            }
            function Context(tryLocsList) {
                this.tryEntries = [{
                    tryLoc: "root"
                }], tryLocsList.forEach(pushTryEntry, this), this.reset(true);
            }
            function values(iterable) {
                if (iterable) {
                    var iteratorMethod = iterable[iteratorSymbol];
                    if (iteratorMethod) return iteratorMethod.call(iterable);
                    if ("function" == typeof iterable.next) return iterable;
                    if (!isNaN(iterable.length)) {
                        var i2 = -1, next = function next2() {
                            for (; ++i2 < iterable.length; ) {
                                if (hasOwn.call(iterable, i2)) return next2.value = iterable[i2], next2.done = false, next2;
                            }
                            return next2.value = void 0, next2.done = true, next2;
                        };
                        return next.next = next;
                    }
                }
                return {
                    next: doneResult
                };
            }
            function doneResult() {
                return {
                    value: void 0,
                    done: true
                };
            }
            return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function(genFun) {
                var ctor = "function" == typeof genFun && genFun.constructor;
                return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
            }, exports.mark = function(genFun) {
                return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
            }, exports.awrap = function(arg) {
                return {
                    __await: arg
                };
            }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
                return this;
            }), exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
                void 0 === PromiseImpl && (PromiseImpl = Promise);
                var iter2 = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
                return exports.isGeneratorFunction(outerFn) ? iter2 : iter2.next().then(function(result) {
                    return result.done ? result.value : iter2.next();
                });
            }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function() {
                return this;
            }), define(Gp, "toString", function() {
                return "[object Generator]";
            }), exports.keys = function(object) {
                var keys = [];
                for (var key in object) {
                    keys.push(key);
                }
                return keys.reverse(), function next() {
                    for (; keys.length; ) {
                        var key2 = keys.pop();
                        if (key2 in object) return next.value = key2, next.done = false, next;
                    }
                    return next.done = true, next;
                };
            }, exports.values = values, Context.prototype = {
                constructor: Context,
                reset: function reset(skipTempReset) {
                    if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = false, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name2 in this) {
                        "t" === name2.charAt(0) && hasOwn.call(this, name2) && !isNaN(+name2.slice(1)) && (this[name2] = void 0);
                    }
                },
                stop: function stop() {
                    this.done = true;
                    var rootRecord = this.tryEntries[0].completion;
                    if ("throw" === rootRecord.type) throw rootRecord.arg;
                    return this.rval;
                },
                dispatchException: function dispatchException(exception) {
                    if (this.done) throw exception;
                    var context = this;
                    function handle(loc, caught) {
                        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = void 0), !!caught;
                    }
                    for (var i2 = this.tryEntries.length - 1; i2 >= 0; --i2) {
                        var entry = this.tryEntries[i2], record = entry.completion;
                        if ("root" === entry.tryLoc) return handle("end");
                        if (entry.tryLoc <= this.prev) {
                            var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
                            if (hasCatch && hasFinally) {
                                if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
                                if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                            } else if (hasCatch) {
                                if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
                            } else {
                                if (!hasFinally) throw new Error("try statement without catch or finally");
                                if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                            }
                        }
                    }
                },
                abrupt: function abrupt(type, arg) {
                    for (var i2 = this.tryEntries.length - 1; i2 >= 0; --i2) {
                        var entry = this.tryEntries[i2];
                        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                            var finallyEntry = entry;
                            break;
                        }
                    }
                    finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
                    var record = finallyEntry ? finallyEntry.completion : {};
                    return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
                },
                complete: function complete(record, afterLoc) {
                    if ("throw" === record.type) throw record.arg;
                    return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
                },
                finish: function finish(finallyLoc) {
                    for (var i2 = this.tryEntries.length - 1; i2 >= 0; --i2) {
                        var entry = this.tryEntries[i2];
                        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
                    }
                },
                "catch": function _catch(tryLoc) {
                    for (var i2 = this.tryEntries.length - 1; i2 >= 0; --i2) {
                        var entry = this.tryEntries[i2];
                        if (entry.tryLoc === tryLoc) {
                            var record = entry.completion;
                            if ("throw" === record.type) {
                                var thrown = record.arg;
                                resetTryEntry(entry);
                            }
                            return thrown;
                        }
                    }
                    throw new Error("illegal catch attempt");
                },
                delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                    return this.delegate = {
                        iterator: values(iterable),
                        resultName,
                        nextLoc
                    }, "next" === this.method && (this.arg = void 0), ContinueSentinel;
                }
            }, exports;
        }
        module.exports = _regeneratorRuntime2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    })(regeneratorRuntime$1);
    return regeneratorRuntime$1.exports;
}
var regenerator;
var hasRequiredRegenerator;
function requireRegenerator() {
    if (hasRequiredRegenerator) return regenerator;
    hasRequiredRegenerator = 1;
    var runtime = requireRegeneratorRuntime()();
    regenerator = runtime;
    try {
        regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
        if (typeof globalThis === "object") {
            globalThis.regeneratorRuntime = runtime;
        } else {
            Function("r", "regeneratorRuntime = r")(runtime);
        }
    }
    return regenerator;
}
var regeneratorExports = requireRegenerator();
const _regeneratorRuntime = /* @__PURE__ */ getDefaultExportFromCjs(regeneratorExports);
function allSettledButCanBreak(promises, shouldBreakWhileError) {
    return Promise.all(promises.map(function(promise, i2) {
        return promise.then(function(value) {
            return {
                status: "fulfilled",
                value
            };
        })["catch"](function(reason) {
            if (shouldBreakWhileError !== null && shouldBreakWhileError !== void 0 && shouldBreakWhileError(i2)) {
                throw reason;
            }
            return {
                status: "rejected",
                reason
            };
        });
    }));
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i2) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i2 && _arr.length === i2) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally {
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
        arr2[i2] = arr[i2];
    }
    return arr2;
}
function _unsupportedIterableToArray(o2, minLen) {
    if (!o2) return;
    if (typeof o2 === "string") return _arrayLikeToArray(o2, minLen);
    var n2 = Object.prototype.toString.call(o2).slice(8, -1);
    if (n2 === "Object" && o2.constructor) n2 = o2.constructor.name;
    if (n2 === "Map" || n2 === "Set") return Array.from(o2);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2)) return _arrayLikeToArray(o2, minLen);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i2) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
}
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
        return typeof obj2;
    } : function(obj2) {
        return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
}
var isIE11 = typeof navigator !== "undefined" && navigator.userAgent.indexOf("Trident") !== -1;
function shouldSkipProperty(global2, p2) {
    if (!global2.hasOwnProperty(p2) || !isNaN(p2) && p2 < global2.length) return true;
    if (isIE11) {
        try {
            return global2[p2] && typeof window !== "undefined" && global2[p2].parent === window;
        } catch (err) {
            return true;
        }
    } else {
        return false;
    }
}
var firstGlobalProp, secondGlobalProp, lastGlobalProp;
function getGlobalProp(global2) {
    var cnt = 0;
    var lastProp;
    var hasIframe = false;
    for (var p2 in global2) {
        if (shouldSkipProperty(global2, p2)) continue;
        for (var i2 = 0; i2 < window.frames.length && !hasIframe; i2++) {
            var frame = window.frames[i2];
            if (frame === global2[p2]) {
                hasIframe = true;
                break;
            }
        }
        if (!hasIframe && (cnt === 0 && p2 !== firstGlobalProp || cnt === 1 && p2 !== secondGlobalProp)) return p2;
        cnt++;
        lastProp = p2;
    }
    if (lastProp !== lastGlobalProp) return lastProp;
}
function noteGlobalProps(global2) {
    firstGlobalProp = secondGlobalProp = void 0;
    for (var p2 in global2) {
        if (shouldSkipProperty(global2, p2)) continue;
        if (!firstGlobalProp) firstGlobalProp = p2;
        else if (!secondGlobalProp) secondGlobalProp = p2;
        lastGlobalProp = p2;
    }
    return lastGlobalProp;
}
function getInlineCode(match) {
    var start2 = match.indexOf(">") + 1;
    var end = match.lastIndexOf("<");
    return match.substring(start2, end);
}
function defaultGetPublicPath(entry) {
    if (_typeof(entry) === "object") {
        return "/";
    }
    try {
        var _URL = new URL(entry, location.href), origin = _URL.origin, pathname = _URL.pathname;
        var paths = pathname.split("/");
        paths.pop();
        return "".concat(origin).concat(paths.join("/"), "/");
    } catch (e2) {
        console.warn(e2);
        return "";
    }
}
function isModuleScriptSupported() {
    var s2 = document.createElement("script");
    return "noModule" in s2;
}
var requestIdleCallback$1 = window.requestIdleCallback || function requestIdleCallback(cb) {
    var start2 = Date.now();
    return setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function timeRemaining() {
                return Math.max(0, 50 - (Date.now() - start2));
            }
        });
    }, 1);
};
function readResAsString(response, autoDetectCharset) {
    if (!autoDetectCharset) {
        return response.text();
    }
    if (!response.headers) {
        return response.text();
    }
    var contentType = response.headers.get("Content-Type");
    if (!contentType) {
        return response.text();
    }
    var charset = "utf-8";
    var parts = contentType.split(";");
    if (parts.length === 2) {
        var _parts$1$split = parts[1].split("="), _parts$1$split2 = _slicedToArray(_parts$1$split, 2), value = _parts$1$split2[1];
        var encoding = value && value.trim();
        if (encoding) {
            charset = encoding;
        }
    }
    if (charset.toUpperCase() === "UTF-8") {
        return response.text();
    }
    return response.blob().then(function(file) {
        return new Promise(function(resolve, reject) {
            var reader = new window.FileReader();
            reader.onload = function() {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsText(file, charset);
        });
    });
}
var evalCache = {};
function evalCode(scriptSrc, code) {
    var key = scriptSrc;
    if (!evalCache[key]) {
        var functionWrappedCode = "(function(){".concat(code, "})");
        evalCache[key] = (0, eval)(functionWrappedCode);
    }
    var evalFunc = evalCache[key];
    evalFunc.call(window);
}
function parseUrl(url) {
    var parser = new DOMParser();
    var html = '<script src="'.concat(url, '"><\/script>');
    var doc = parser.parseFromString(html, "text/html");
    return doc.scripts[0].src;
}
var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng\x2Dtemplate\3)[\s\S])*?>[\s\S]*?<\/\1>/i;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var SCRIPT_CROSSORIGIN_REGEX = /.*\scrossorigin=('|")?use-credentials\1/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+[\s\S]*?>/ig;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
function hasProtocol(url) {
    return url.startsWith("http://") || url.startsWith("https://");
}
function getEntirePath(path, baseURI) {
    return new URL(path, baseURI).toString();
}
function isValidJavaScriptType(type) {
    var handleTypes = ["text/javascript", "module", "application/javascript", "text/ecmascript", "application/ecmascript"];
    return !type || handleTypes.indexOf(type) !== -1;
}
var genLinkReplaceSymbol = function genLinkReplaceSymbol2(linkHref) {
    var preloadOrPrefetch = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    return "<!-- ".concat(preloadOrPrefetch ? "prefetch/preload" : "", " link ").concat(linkHref, " replaced by import-html-entry -->");
};
var genScriptReplaceSymbol = function genScriptReplaceSymbol2(scriptSrc) {
    var async = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var crossOrigin = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    return "<!-- ".concat(crossOrigin ? "cors" : "", " ").concat(async ? "async" : "", " script ").concat(scriptSrc, " replaced by import-html-entry -->");
};
var inlineScriptReplaceSymbol = "<!-- inline scripts replaced by import-html-entry -->";
var genIgnoreAssetReplaceSymbol = function genIgnoreAssetReplaceSymbol2(url) {
    return "<!-- ignore asset ".concat(url || "file", " replaced by import-html-entry -->");
};
var genModuleScriptReplaceSymbol = function genModuleScriptReplaceSymbol2(scriptSrc, moduleSupport) {
    return "<!-- ".concat(moduleSupport ? "nomodule" : "module", " script ").concat(scriptSrc, " ignored by import-html-entry -->");
};
function processTpl(tpl, baseURI, postProcessTemplate) {
    var scripts = [];
    var styles = [];
    var entry = null;
    var moduleSupport = isModuleScriptSupported();
    var template = tpl.replace(HTML_COMMENT_REGEX, "").replace(LINK_TAG_REGEX, function(match) {
        var styleType = !!match.match(STYLE_TYPE_REGEX);
        if (styleType) {
            var styleHref = match.match(STYLE_HREF_REGEX);
            var styleIgnore = match.match(LINK_IGNORE_REGEX);
            if (styleHref) {
                var href = styleHref && styleHref[2];
                var newHref = href;
                if (href && !hasProtocol(href)) {
                    newHref = getEntirePath(href, baseURI);
                }
                if (styleIgnore) {
                    return genIgnoreAssetReplaceSymbol(newHref);
                }
                newHref = parseUrl(newHref);
                styles.push(newHref);
                return genLinkReplaceSymbol(newHref);
            }
        }
        var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX) && !match.match(LINK_AS_FONT);
        if (preloadOrPrefetchType) {
            var _match$match = match.match(LINK_HREF_REGEX), _match$match2 = _slicedToArray(_match$match, 3), linkHref = _match$match2[2];
            return genLinkReplaceSymbol(linkHref, true);
        }
        return match;
    }).replace(STYLE_TAG_REGEX, function(match) {
        if (STYLE_IGNORE_REGEX.test(match)) {
            return genIgnoreAssetReplaceSymbol("style file");
        }
        return match;
    }).replace(ALL_SCRIPT_REGEX, function(match, scriptTag) {
        var scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
        var moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && !!scriptTag.match(SCRIPT_MODULE_REGEX);
        var matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
        var matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];
        if (!isValidJavaScriptType(matchedScriptType)) {
            return match;
        }
        if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
            var matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
            var matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
            var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
            if (entry && matchedScriptEntry) {
                throw new SyntaxError("You should not set multiply entry script!");
            }
            if (matchedScriptSrc) {
                if (!hasProtocol(matchedScriptSrc)) {
                    matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
                }
                matchedScriptSrc = parseUrl(matchedScriptSrc);
            }
            entry = entry || matchedScriptEntry && matchedScriptSrc;
            if (scriptIgnore) {
                return genIgnoreAssetReplaceSymbol(matchedScriptSrc || "js file");
            }
            if (moduleScriptIgnore) {
                return genModuleScriptReplaceSymbol(matchedScriptSrc || "js file", moduleSupport);
            }
            if (matchedScriptSrc) {
                var asyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);
                var crossOriginScript = !!scriptTag.match(SCRIPT_CROSSORIGIN_REGEX);
                scripts.push(asyncScript || crossOriginScript ? {
                    async: asyncScript,
                    src: matchedScriptSrc,
                    crossOrigin: crossOriginScript
                } : matchedScriptSrc);
                return genScriptReplaceSymbol(matchedScriptSrc, asyncScript, crossOriginScript);
            }
            return match;
        } else {
            if (scriptIgnore) {
                return genIgnoreAssetReplaceSymbol("js file");
            }
            if (moduleScriptIgnore) {
                return genModuleScriptReplaceSymbol("js file", moduleSupport);
            }
            var code = getInlineCode(match);
            var isPureCommentBlock = code.split(/[\r\n]+/).every(function(line) {
                return !line.trim() || line.trim().startsWith("//");
            });
            if (!isPureCommentBlock) {
                scripts.push(match);
            }
            return inlineScriptReplaceSymbol;
        }
    });
    scripts = scripts.filter(function(script) {
        return !!script;
    });
    var tplResult = {
        template,
        scripts,
        styles,
        // set the last script as entry if have not set
        entry: entry || scripts[scripts.length - 1]
    };
    if (typeof postProcessTemplate === "function") {
        tplResult = postProcessTemplate(tplResult);
    }
    return tplResult;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = null != arguments[i2] ? arguments[i2] : {};
        i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};
if (!window.fetch) {
    throw new Error('[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it');
}
var defaultFetch = window.fetch.bind(window);
function defaultGetTemplate(tpl) {
    return tpl;
}
function getEmbedHTML(template, styles) {
    var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var _opts$fetch = opts.fetch, fetch2 = _opts$fetch === void 0 ? defaultFetch : _opts$fetch;
    var embedHTML = template;
    return _getExternalStyleSheets(styles, fetch2).then(function(styleSheets) {
        embedHTML = styleSheets.reduce(function(html, styleSheet) {
            var styleSrc = styleSheet.src;
            var styleSheetContent = styleSheet.value;
            html = html.replace(genLinkReplaceSymbol(styleSrc), isInlineCode(styleSrc) ? "".concat(styleSrc) : "<style>/* ".concat(styleSrc, " */").concat(styleSheetContent, "</style>"));
            return html;
        }, embedHTML);
        return embedHTML;
    });
}
var isInlineCode = function isInlineCode2(code) {
    return code.startsWith("<");
};
function getExecutableScript(scriptSrc, scriptText) {
    var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var proxy = opts.proxy, strictGlobal = opts.strictGlobal, _opts$scopedGlobalVar = opts.scopedGlobalVariables, scopedGlobalVariables = _opts$scopedGlobalVar === void 0 ? [] : _opts$scopedGlobalVar;
    var sourceUrl = isInlineCode(scriptSrc) ? "" : "//# sourceURL=".concat(scriptSrc, "\n");
    var scopedGlobalVariableDefinition = scopedGlobalVariables.length ? "const {".concat(scopedGlobalVariables.join(","), "}=this;") : "";
    var globalWindow = (0, eval)("window");
    globalWindow.proxy = proxy;
    return strictGlobal ? scopedGlobalVariableDefinition ? ";(function(){with(this){".concat(scopedGlobalVariableDefinition).concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)();") : ";(function(window, self, globalThis){with(window){;".concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);") : ";(function(window, self, globalThis){;".concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);");
}
function _getExternalStyleSheets(styles) {
    var fetch2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultFetch;
    return allSettledButCanBreak(styles.map(/* @__PURE__ */ function() {
        var _ref = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee(styleLink) {
            return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                    case 0:
                        if (!isInlineCode(styleLink)) {
                            _context.next = 4;
                            break;
                        }
                        return _context.abrupt("return", getInlineCode(styleLink));
                    case 4:
                        return _context.abrupt("return", styleCache[styleLink] || (styleCache[styleLink] = fetch2(styleLink).then(function(response) {
                            if (response.status >= 400) {
                                throw new Error("".concat(styleLink, " load failed with status ").concat(response.status));
                            }
                            return response.text();
                        })["catch"](function(e2) {
                            try {
                                if (e2.message.indexOf(styleLink) === -1) {
                                    e2.message = "".concat(styleLink, " ").concat(e2.message);
                                }
                            } catch (_2) {
                            }
                            throw e2;
                        })));
                    case 5:
                    case "end":
                        return _context.stop();
                }
            }, _callee);
        }));
        return function(_x) {
            return _ref.apply(this, arguments);
        };
    }())).then(function(results) {
        return results.map(function(result, i2) {
            if (result.status === "fulfilled") {
                result.value = {
                    src: styles[i2],
                    value: result.value
                };
            }
            return result;
        }).filter(function(result) {
            if (result.status === "rejected") {
                Promise.reject(result.reason);
            }
            return result.status === "fulfilled";
        }).map(function(result) {
            return result.value;
        });
    });
}
function _getExternalScripts(scripts) {
    var fetch2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultFetch;
    var entry = arguments.length > 2 ? arguments[2] : void 0;
    var fetchScript = function fetchScript2(scriptUrl, opts) {
        return scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch2(scriptUrl, opts).then(function(response) {
            if (response.status >= 400) {
                throw new Error("".concat(scriptUrl, " load failed with status ").concat(response.status));
            }
            return response.text();
        })["catch"](function(e2) {
            try {
                if (e2.message.indexOf(scriptUrl) === -1) {
                    e2.message = "".concat(scriptUrl, " ").concat(e2.message);
                }
            } catch (_2) {
            }
            throw e2;
        }));
    };
    var shouldBreakWhileError = function shouldBreakWhileError2(i2) {
        return scripts[i2] === entry;
    };
    return allSettledButCanBreak(scripts.map(/* @__PURE__ */ function() {
        var _ref2 = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee2(script) {
            var src, async, crossOrigin, fetchOpts;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(typeof script === "string")) {
                            _context2.next = 8;
                            break;
                        }
                        if (!isInlineCode(script)) {
                            _context2.next = 5;
                            break;
                        }
                        return _context2.abrupt("return", getInlineCode(script));
                    case 5:
                        return _context2.abrupt("return", fetchScript(script));
                    case 6:
                        _context2.next = 13;
                        break;
                    case 8:
                        src = script.src, async = script.async, crossOrigin = script.crossOrigin;
                        fetchOpts = crossOrigin ? {
                            credentials: "include"
                        } : {};
                        if (!async) {
                            _context2.next = 12;
                            break;
                        }
                        return _context2.abrupt("return", {
                            src,
                            async: true,
                            content: new Promise(function(resolve, reject) {
                                return requestIdleCallback$1(function() {
                                    return fetchScript(src, fetchOpts).then(resolve, reject);
                                });
                            })
                        });
                    case 12:
                        return _context2.abrupt("return", fetchScript(src, fetchOpts));
                    case 13:
                    case "end":
                        return _context2.stop();
                }
            }, _callee2);
        }));
        return function(_x2) {
            return _ref2.apply(this, arguments);
        };
    }()), shouldBreakWhileError).then(function(results) {
        return results.map(function(result, i2) {
            if (result.status === "fulfilled") {
                result.value = {
                    src: scripts[i2],
                    value: result.value
                };
            }
            return result;
        }).filter(function(result) {
            if (result.status === "rejected") {
                Promise.reject(result.reason);
            }
            return result.status === "fulfilled";
        }).map(function(result) {
            return result.value;
        });
    });
}
function throwNonBlockingError(error, msg) {
    setTimeout(function() {
        console.error(msg);
        throw error;
    });
}
var supportsUserTiming$1 = typeof performance !== "undefined" && typeof performance.mark === "function" && typeof performance.clearMarks === "function" && typeof performance.measure === "function" && typeof performance.clearMeasures === "function";
function _execScripts(entry, scripts) {
    var proxy = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : window;
    var opts = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var _opts$fetch2 = opts.fetch, fetch2 = _opts$fetch2 === void 0 ? defaultFetch : _opts$fetch2, _opts$strictGlobal = opts.strictGlobal, strictGlobal = _opts$strictGlobal === void 0 ? false : _opts$strictGlobal, success = opts.success, _opts$error = opts.error, error = _opts$error === void 0 ? function() {
    } : _opts$error, _opts$beforeExec = opts.beforeExec, beforeExec = _opts$beforeExec === void 0 ? function() {
    } : _opts$beforeExec, _opts$afterExec = opts.afterExec, afterExec = _opts$afterExec === void 0 ? function() {
    } : _opts$afterExec, _opts$scopedGlobalVar2 = opts.scopedGlobalVariables, scopedGlobalVariables = _opts$scopedGlobalVar2 === void 0 ? [] : _opts$scopedGlobalVar2;
    return _getExternalScripts(scripts, fetch2, entry).then(function(scriptsText) {
        var geval = function geval2(scriptSrc, inlineScript) {
            var rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
            var code = getExecutableScript(scriptSrc, rawCode, {
                proxy,
                strictGlobal,
                scopedGlobalVariables
            });
            evalCode(scriptSrc, code);
            afterExec(inlineScript, scriptSrc);
        };
        function exec(scriptSrc, inlineScript, resolve) {
            var markName = "Evaluating script ".concat(scriptSrc);
            var measureName = "Evaluating Time Consuming: ".concat(scriptSrc);
            if (process.env.NODE_ENV === "development" && supportsUserTiming$1) {
                performance.mark(markName);
            }
            if (scriptSrc === entry) {
                noteGlobalProps(strictGlobal ? proxy : window);
                try {
                    geval(scriptSrc, inlineScript);
                    var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
                    resolve(exports);
                } catch (e2) {
                    console.error("[import-html-entry]: error occurs while executing entry script ".concat(scriptSrc));
                    throw e2;
                }
            } else {
                if (typeof inlineScript === "string") {
                    try {
                        if (scriptSrc !== null && scriptSrc !== void 0 && scriptSrc.src) {
                            geval(scriptSrc.src, inlineScript);
                        } else {
                            geval(scriptSrc, inlineScript);
                        }
                    } catch (e2) {
                        throwNonBlockingError(e2, "[import-html-entry]: error occurs while executing normal script ".concat(scriptSrc));
                    }
                } else {
                    inlineScript.async && (inlineScript === null || inlineScript === void 0 ? void 0 : inlineScript.content.then(function(downloadedScriptText) {
                        return geval(inlineScript.src, downloadedScriptText);
                    })["catch"](function(e2) {
                        throwNonBlockingError(e2, "[import-html-entry]: error occurs while executing async script ".concat(inlineScript.src));
                    }));
                }
            }
            if (process.env.NODE_ENV === "development" && supportsUserTiming$1) {
                performance.measure(measureName, markName);
                performance.clearMarks(markName);
                performance.clearMeasures(measureName);
            }
        }
        function schedule(i2, resolvePromise) {
            if (i2 < scriptsText.length) {
                var script = scriptsText[i2];
                var scriptSrc = script.src;
                var inlineScript = script.value;
                exec(scriptSrc, inlineScript, resolvePromise);
                if (!entry && i2 === scriptsText.length - 1) {
                    resolvePromise();
                } else {
                    schedule(i2 + 1, resolvePromise);
                }
            }
        }
        return new Promise(function(resolve) {
            return schedule(0, success || resolve);
        });
    })["catch"](function(e2) {
        error();
        throw e2;
    });
}
function importHTML(url) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var fetch2 = defaultFetch;
    var autoDecodeResponse = false;
    var getPublicPath = defaultGetPublicPath;
    var getTemplate = defaultGetTemplate;
    var postProcessTemplate = opts.postProcessTemplate;
    if (typeof opts === "function") {
        fetch2 = opts;
    } else {
        if (opts.fetch) {
            if (typeof opts.fetch === "function") {
                fetch2 = opts.fetch;
            } else {
                fetch2 = opts.fetch.fn || defaultFetch;
                autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
            }
        }
        getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
        getTemplate = opts.getTemplate || defaultGetTemplate;
    }
    return embedHTMLCache[url] || (embedHTMLCache[url] = fetch2(url).then(function(response) {
        return readResAsString(response, autoDecodeResponse);
    }).then(function(html) {
        var assetPublicPath = getPublicPath(url);
        var _processTpl = processTpl(getTemplate(html), assetPublicPath, postProcessTemplate), template = _processTpl.template, scripts = _processTpl.scripts, entry = _processTpl.entry, styles = _processTpl.styles;
        return getEmbedHTML(template, styles, {
            fetch: fetch2
        }).then(function(embedHTML) {
            return {
                template: embedHTML,
                assetPublicPath,
                getExternalScripts: function getExternalScripts() {
                    return _getExternalScripts(scripts, fetch2);
                },
                getExternalStyleSheets: function getExternalStyleSheets() {
                    return _getExternalStyleSheets(styles, fetch2);
                },
                execScripts: function execScripts(proxy, strictGlobal) {
                    var opts2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                    if (!scripts.length) {
                        return Promise.resolve();
                    }
                    return _execScripts(entry, scripts, proxy, _objectSpread({
                        fetch: fetch2,
                        strictGlobal
                    }, opts2));
                }
            };
        });
    }));
}
function importEntry(entry) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _opts$fetch3 = opts.fetch, fetch2 = _opts$fetch3 === void 0 ? defaultFetch : _opts$fetch3, _opts$getTemplate = opts.getTemplate, getTemplate = _opts$getTemplate === void 0 ? defaultGetTemplate : _opts$getTemplate, postProcessTemplate = opts.postProcessTemplate;
    var getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
    if (!entry) {
        throw new SyntaxError("entry should not be empty!");
    }
    if (typeof entry === "string") {
        return importHTML(entry, {
            fetch: fetch2,
            getPublicPath,
            getTemplate,
            postProcessTemplate
        });
    }
    if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
        var _entry$scripts = entry.scripts, scripts = _entry$scripts === void 0 ? [] : _entry$scripts, _entry$styles = entry.styles, styles = _entry$styles === void 0 ? [] : _entry$styles, _entry$html = entry.html, html = _entry$html === void 0 ? "" : _entry$html;
        var getHTMLWithStylePlaceholder = function getHTMLWithStylePlaceholder2(tpl) {
            return styles.reduceRight(function(html2, styleSrc) {
                return "".concat(genLinkReplaceSymbol(styleSrc)).concat(html2);
            }, tpl);
        };
        var getHTMLWithScriptPlaceholder = function getHTMLWithScriptPlaceholder2(tpl) {
            return scripts.reduce(function(html2, scriptSrc) {
                return "".concat(html2).concat(genScriptReplaceSymbol(scriptSrc));
            }, tpl);
        };
        return getEmbedHTML(getTemplate(getHTMLWithScriptPlaceholder(getHTMLWithStylePlaceholder(html))), styles, {
            fetch: fetch2
        }).then(function(embedHTML) {
            return {
                template: embedHTML,
                assetPublicPath: getPublicPath(entry),
                getExternalScripts: function getExternalScripts() {
                    return _getExternalScripts(scripts, fetch2);
                },
                getExternalStyleSheets: function getExternalStyleSheets() {
                    return _getExternalStyleSheets(styles, fetch2);
                },
                execScripts: function execScripts(proxy, strictGlobal) {
                    var opts2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                    if (!scripts.length) {
                        return Promise.resolve();
                    }
                    return _execScripts(scripts[scripts.length - 1], scripts, proxy, _objectSpread({
                        fetch: fetch2,
                        strictGlobal
                    }, opts2));
                }
            };
        });
    } else {
        throw new SyntaxError("entry scripts or styles should be array!");
    }
}
function getAddOn$1(global2) {
    return {
        async beforeLoad() {
            global2.__POWERED_BY_QIANKUN__ = true;
        },
        async beforeMount() {
            global2.__POWERED_BY_QIANKUN__ = true;
        },
        async beforeUnmount() {
            delete global2.__POWERED_BY_QIANKUN__;
        }
    };
}
const rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
function getAddOn(global2, publicPath = "/") {
    let hasMountedOnce = false;
    return {
        async beforeLoad() {
            global2.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
        },
        async beforeMount() {
            if (hasMountedOnce) {
                global2.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
            }
        },
        async beforeUnmount() {
            if (rawPublicPath === void 0) {
                delete global2.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
            } else {
                global2.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
            }
            hasMountedOnce = true;
        }
    };
}
function getAddOns(global2, publicPath) {
    return mergeWith(
        {},
        getAddOn$1(global2),
        getAddOn(global2, publicPath),
        (v1, v2) => concat(v1 ?? [], v2 ?? [])
    );
}
class QiankunError extends Error {
    constructor(message) {
        super(`[qiankun]: ${message}`);
    }
}
let globalState = {};
const deps = {};
function emitGlobal(state, prevState) {
    Object.keys(deps).forEach((id) => {
        if (deps[id] instanceof Function) {
            deps[id](cloneDeep(state), cloneDeep(prevState));
        }
    });
}
function initGlobalState(state = {}) {
    if (process.env.NODE_ENV === "development") {
        console.warn(`[qiankun] globalState tools will be removed in 3.0, pls don't use it!`);
    }
    if (state === globalState) {
        console.warn("[qiankun] state has not changed！");
    } else {
        const prevGlobalState = cloneDeep(globalState);
        globalState = cloneDeep(state);
        emitGlobal(globalState, prevGlobalState);
    }
    return getMicroAppStateActions(`global-${+/* @__PURE__ */ new Date()}`, true);
}
function getMicroAppStateActions(id, isMaster) {
    return {
        /**
         * onGlobalStateChange 全局依赖监听
         *
         * 收集 setState 时所需要触发的依赖
         *
         * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
         *
         * 这么设计是为了减少全局监听滥用导致的内存爆炸
         *
         * 依赖数据结构为：
         * {
         *   {id}: callback
         * }
         *
         * @param callback
         * @param fireImmediately
         */
        onGlobalStateChange(callback, fireImmediately) {
            if (!(callback instanceof Function)) {
                console.error("[qiankun] callback must be function!");
                return;
            }
            if (deps[id]) {
                console.warn(`[qiankun] '${id}' global listener already exists before this, new listener will overwrite it.`);
            }
            deps[id] = callback;
            if (fireImmediately) {
                const cloneState = cloneDeep(globalState);
                callback(cloneState, cloneState);
            }
        },
        /**
         * setGlobalState 更新 store 数据
         *
         * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
         * 2. 修改 store 并触发全局监听
         *
         * @param state
         */
        setGlobalState(state = {}) {
            if (state === globalState) {
                console.warn("[qiankun] state has not changed！");
                return false;
            }
            const changeKeys = [];
            const prevGlobalState = cloneDeep(globalState);
            globalState = cloneDeep(
                Object.keys(state).reduce((_globalState, changeKey) => {
                    if (isMaster || _globalState.hasOwnProperty(changeKey)) {
                        changeKeys.push(changeKey);
                        return Object.assign(_globalState, { [changeKey]: state[changeKey] });
                    }
                    console.warn(`[qiankun] '${changeKey}' not declared when init state！`);
                    return _globalState;
                }, globalState)
            );
            if (changeKeys.length === 0) {
                console.warn("[qiankun] state has not changed！");
                return false;
            }
            emitGlobal(globalState, prevGlobalState);
            return true;
        },
        // 注销该应用下的依赖
        offGlobalStateChange() {
            delete deps[id];
            return true;
        }
    };
}
var SandBoxType = /* @__PURE__ */ ((SandBoxType2) => {
    SandBoxType2["Proxy"] = "Proxy";
    SandBoxType2["Snapshot"] = "Snapshot";
    SandBoxType2["LegacyProxy"] = "LegacyProxy";
    return SandBoxType2;
})(SandBoxType || {});
const version = "2.10.16";
function toArray(array) {
    return Array.isArray(array) ? array : [array];
}
const nextTick = typeof window.__zone_symbol__setTimeout === "function" ? window.__zone_symbol__setTimeout : (cb) => Promise.resolve().then(cb);
let globalTaskPending = false;
function nextTask(cb) {
    if (!globalTaskPending) {
        globalTaskPending = true;
        nextTick(() => {
            cb();
            globalTaskPending = false;
        });
    }
}
const fnRegexCheckCacheMap = /* @__PURE__ */ new WeakMap();
function isConstructable(fn) {
    const hasPrototypeMethods = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;
    if (hasPrototypeMethods) return true;
    if (fnRegexCheckCacheMap.has(fn)) {
        return fnRegexCheckCacheMap.get(fn);
    }
    let constructable = hasPrototypeMethods;
    if (!constructable) {
        const fnString = fn.toString();
        const constructableFunctionRegex = /^function\b\s[A-Z].*/;
        const classRegex = /^class\b/;
        constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
    }
    fnRegexCheckCacheMap.set(fn, constructable);
    return constructable;
}
const callableFnCacheMap = /* @__PURE__ */ new WeakMap();
function isCallable(fn) {
    if (callableFnCacheMap.has(fn)) {
        return true;
    }
    const callable = typeof fn === "function" && fn instanceof Function;
    if (callable) {
        callableFnCacheMap.set(fn, callable);
    }
    return callable;
}
const frozenPropertyCacheMap = /* @__PURE__ */ new WeakMap();
function isPropertyFrozen(target, p2) {
    if (!target || !p2) {
        return false;
    }
    const targetPropertiesFromCache = frozenPropertyCacheMap.get(target) || {};
    if (targetPropertiesFromCache[p2]) {
        return targetPropertiesFromCache[p2];
    }
    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, p2);
    const frozen = Boolean(
        propertyDescriptor && propertyDescriptor.configurable === false && (propertyDescriptor.writable === false || propertyDescriptor.get && !propertyDescriptor.set)
    );
    targetPropertiesFromCache[p2] = frozen;
    frozenPropertyCacheMap.set(target, targetPropertiesFromCache);
    return frozen;
}
const boundedMap = /* @__PURE__ */ new WeakMap();
function isBoundedFunction(fn) {
    if (boundedMap.has(fn)) {
        return boundedMap.get(fn);
    }
    const bounded = fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype");
    boundedMap.set(fn, bounded);
    return bounded;
}
const isConstDestructAssignmentSupported = memoize(() => {
    try {
        new Function("const { a } = { a: 1 }")();
        return true;
    } catch (e2) {
        return false;
    }
});
const qiankunHeadTagName = "qiankun-head";
function getDefaultTplWrapper(name2, sandboxOpts) {
    return (tpl) => {
        let tplWithSimulatedHead;
        if (tpl.indexOf("<head>") !== -1) {
            tplWithSimulatedHead = tpl.replace("<head>", `<${qiankunHeadTagName}>`).replace("</head>", `</${qiankunHeadTagName}>`);
        } else {
            tplWithSimulatedHead = `<${qiankunHeadTagName}></${qiankunHeadTagName}>${tpl}`;
        }
        return `<div id="${getWrapperId(
            name2
        )}" data-name="${name2}" data-version="${version}" data-sandbox-cfg=${JSON.stringify(
            sandboxOpts
        )}>${tplWithSimulatedHead}</div>`;
    };
}
function getWrapperId(name2) {
    return `__qiankun_microapp_wrapper_for_${snakeCase(name2)}__`;
}
const nativeGlobal = new Function("return this")();
const nativeDocument = new Function("return document")();
const getGlobalAppInstanceMap = once(() => {
    if (!nativeGlobal.hasOwnProperty("__app_instance_name_map__")) {
        Object.defineProperty(nativeGlobal, "__app_instance_name_map__", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    return nativeGlobal.__app_instance_name_map__;
});
const genAppInstanceIdByName = (appName) => {
    const globalAppInstanceMap = getGlobalAppInstanceMap();
    if (!(appName in globalAppInstanceMap)) {
        nativeGlobal.__app_instance_name_map__[appName] = 0;
        return appName;
    }
    globalAppInstanceMap[appName]++;
    return `${appName}_${globalAppInstanceMap[appName]}`;
};
function validateExportLifecycle(exports) {
    const { bootstrap, mount, unmount } = exports ?? {};
    return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}
class Deferred {
    constructor() {
        __publicField(this, "promise");
        __publicField(this, "resolve");
        __publicField(this, "reject");
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
const supportsUserTiming = typeof performance !== "undefined" && typeof performance.mark === "function" && typeof performance.clearMarks === "function" && typeof performance.measure === "function" && typeof performance.clearMeasures === "function" && typeof performance.getEntriesByName === "function";
function performanceGetEntriesByName(markName, type) {
    let marks = null;
    if (supportsUserTiming) {
        marks = performance.getEntriesByName(markName, type);
    }
    return marks;
}
function performanceMark(markName) {
    if (supportsUserTiming) {
        performance.mark(markName);
    }
}
function performanceMeasure(measureName, markName) {
    if (supportsUserTiming && performance.getEntriesByName(markName, "mark").length) {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
    }
}
function isEnableScopedCSS(sandbox) {
    if (typeof sandbox !== "object") {
        return false;
    }
    if (sandbox.strictStyleIsolation) {
        return false;
    }
    return !!sandbox.experimentalStyleIsolation;
}
function getXPathForElement(el, document2) {
    if (!document2.body.contains(el)) {
        return void 0;
    }
    let xpath = "";
    let pos;
    let tmpEle;
    let element = el;
    while (element !== document2.documentElement) {
        pos = 0;
        tmpEle = element;
        while (tmpEle) {
            if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
                pos += 1;
            }
            tmpEle = tmpEle.previousSibling;
        }
        xpath = `*[name()='${element.nodeName}'][${pos}]/${xpath}`;
        element = element.parentNode;
    }
    xpath = `/*[name()='${document2.documentElement.nodeName}']/${xpath}`;
    xpath = xpath.replace(/\/$/, "");
    return xpath;
}
function getContainer(container) {
    return typeof container === "string" ? document.querySelector(container) : container;
}
function getContainerXPath(container) {
    if (container) {
        const containerElement = getContainer(container);
        if (containerElement) {
            return getXPathForElement(containerElement, document);
        }
    }
    return void 0;
}
let currentRunningApp = null;
function getCurrentRunningApp() {
    return currentRunningApp;
}
function setCurrentRunningApp(appInstance) {
    currentRunningApp = appInstance;
}
function clearCurrentRunningApp() {
    currentRunningApp = null;
}
const functionBoundedValueMap = /* @__PURE__ */ new WeakMap();
function rebindTarget2Fn(target, fn) {
    if (isCallable(fn) && !isBoundedFunction(fn) && !isConstructable(fn)) {
        const cachedBoundFunction = functionBoundedValueMap.get(fn);
        if (cachedBoundFunction) {
            return cachedBoundFunction;
        }
        const boundValue = Function.prototype.bind.call(fn, target);
        Object.getOwnPropertyNames(fn).forEach((key) => {
            if (!boundValue.hasOwnProperty(key)) {
                Object.defineProperty(boundValue, key, Object.getOwnPropertyDescriptor(fn, key));
            }
        });
        if (fn.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype")) {
            Object.defineProperty(boundValue, "prototype", { value: fn.prototype, enumerable: false, writable: true });
        }
        if (typeof fn.toString === "function") {
            const valueHasInstanceToString = fn.hasOwnProperty("toString") && !boundValue.hasOwnProperty("toString");
            const boundValueHasPrototypeToString = boundValue.toString === Function.prototype.toString;
            if (valueHasInstanceToString || boundValueHasPrototypeToString) {
                const originToStringDescriptor = Object.getOwnPropertyDescriptor(
                    valueHasInstanceToString ? fn : Function.prototype,
                    "toString"
                );
                Object.defineProperty(
                    boundValue,
                    "toString",
                    Object.assign(
                        {},
                        originToStringDescriptor,
                        (originToStringDescriptor == null ? void 0 : originToStringDescriptor.get) ? null : { value: () => fn.toString() }
                    )
                );
            }
        }
        functionBoundedValueMap.set(fn, boundValue);
        return boundValue;
    }
    return fn;
}
function isPropConfigurable(target, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(target, prop);
    return descriptor ? descriptor.configurable : true;
}
class LegacySandbox {
    constructor(name2, globalContext = window) {
        /** 沙箱期间新增的全局变量 */
        __publicField(this, "addedPropsMapInSandbox", /* @__PURE__ */ new Map());
        /** 沙箱期间更新的全局变量 */
        __publicField(this, "modifiedPropsOriginalValueMapInSandbox", /* @__PURE__ */ new Map());
        /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
        __publicField(this, "currentUpdatedPropsValueMap", /* @__PURE__ */ new Map());
        __publicField(this, "name");
        __publicField(this, "proxy");
        __publicField(this, "globalContext");
        __publicField(this, "type");
        __publicField(this, "sandboxRunning", true);
        __publicField(this, "latestSetProp", null);
        this.name = name2;
        this.globalContext = globalContext;
        this.type = SandBoxType.LegacyProxy;
        const { addedPropsMapInSandbox, modifiedPropsOriginalValueMapInSandbox, currentUpdatedPropsValueMap } = this;
        const rawWindow = globalContext;
        const fakeWindow = /* @__PURE__ */ Object.create(null);
        const setTrap = (p2, value, originalValue, sync2Window = true) => {
            if (this.sandboxRunning) {
                if (!rawWindow.hasOwnProperty(p2)) {
                    addedPropsMapInSandbox.set(p2, value);
                } else if (!modifiedPropsOriginalValueMapInSandbox.has(p2)) {
                    modifiedPropsOriginalValueMapInSandbox.set(p2, originalValue);
                }
                currentUpdatedPropsValueMap.set(p2, value);
                if (sync2Window) {
                    rawWindow[p2] = value;
                }
                this.latestSetProp = p2;
                return true;
            }
            if (process.env.NODE_ENV === "development") {
                console.warn(`[qiankun] Set window.${p2.toString()} while sandbox destroyed or inactive in ${name2}!`);
            }
            return true;
        };
        const proxy = new Proxy(fakeWindow, {
            set: (_2, p2, value) => {
                const originalValue = rawWindow[p2];
                return setTrap(p2, value, originalValue, true);
            },
            get(_2, p2) {
                if (p2 === "top" || p2 === "parent" || p2 === "window" || p2 === "self") {
                    return proxy;
                }
                const value = rawWindow[p2];
                return rebindTarget2Fn(rawWindow, value);
            },
            // trap in operator
            // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
            has(_2, p2) {
                return p2 in rawWindow;
            },
            getOwnPropertyDescriptor(_2, p2) {
                const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p2);
                if (descriptor && !descriptor.configurable) {
                    descriptor.configurable = true;
                }
                return descriptor;
            },
            defineProperty(_2, p2, attributes) {
                const originalValue = rawWindow[p2];
                const done = Reflect.defineProperty(rawWindow, p2, attributes);
                const value = rawWindow[p2];
                setTrap(p2, value, originalValue, false);
                return done;
            }
        });
        this.proxy = proxy;
    }
    setWindowProp(prop, value, toDelete) {
        if (value === void 0 && toDelete) {
            delete this.globalContext[prop];
        } else if (isPropConfigurable(this.globalContext, prop) && typeof prop !== "symbol") {
            Object.defineProperty(this.globalContext, prop, { writable: true, configurable: true });
            this.globalContext[prop] = value;
        }
    }
    active() {
        if (!this.sandboxRunning) {
            this.currentUpdatedPropsValueMap.forEach((v2, p2) => this.setWindowProp(p2, v2));
        }
        this.sandboxRunning = true;
    }
    inactive() {
        if (process.env.NODE_ENV === "development") {
            console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
                ...this.addedPropsMapInSandbox.keys(),
                ...this.modifiedPropsOriginalValueMapInSandbox.keys()
            ]);
        }
        this.modifiedPropsOriginalValueMapInSandbox.forEach((v2, p2) => this.setWindowProp(p2, v2));
        this.addedPropsMapInSandbox.forEach((_2, p2) => this.setWindowProp(p2, void 0, true));
        this.sandboxRunning = false;
    }
    patchDocument() {
    }
}
const arrayify = (list) => {
    return [].slice.call(list, 0);
};
const rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
const _ScopedCSS = class _ScopedCSS {
    constructor() {
        __publicField(this, "sheet");
        __publicField(this, "swapNode");
        const styleNode = document.createElement("style");
        rawDocumentBodyAppend.call(document.body, styleNode);
        this.swapNode = styleNode;
        this.sheet = styleNode.sheet;
        this.sheet.disabled = true;
    }
    process(styleNode, prefix = "") {
        if (_ScopedCSS.ModifiedTag in styleNode) {
            return;
        }
        if (styleNode.textContent !== "") {
            const textNode = document.createTextNode(styleNode.textContent || "");
            this.swapNode.appendChild(textNode);
            const sheet = this.swapNode.sheet;
            const rules = arrayify((sheet == null ? void 0 : sheet.cssRules) ?? []);
            const css = this.rewrite(rules, prefix);
            styleNode.textContent = css;
            this.swapNode.removeChild(textNode);
            styleNode[_ScopedCSS.ModifiedTag] = true;
            return;
        }
        const mutator = new MutationObserver((mutations) => {
            for (let i2 = 0; i2 < mutations.length; i2 += 1) {
                const mutation = mutations[i2];
                if (_ScopedCSS.ModifiedTag in styleNode) {
                    return;
                }
                if (mutation.type === "childList") {
                    const sheet = styleNode.sheet;
                    const rules = arrayify((sheet == null ? void 0 : sheet.cssRules) ?? []);
                    const css = this.rewrite(rules, prefix);
                    styleNode.textContent = css;
                    styleNode[_ScopedCSS.ModifiedTag] = true;
                }
            }
        });
        mutator.observe(styleNode, { childList: true });
    }
    rewrite(rules, prefix = "") {
        let css = "";
        rules.forEach((rule) => {
            switch (rule.type) {
                case 1:
                    css += this.ruleStyle(rule, prefix);
                    break;
                case 4:
                    css += this.ruleMedia(rule, prefix);
                    break;
                case 12:
                    css += this.ruleSupport(rule, prefix);
                    break;
                default:
                    if (typeof rule.cssText === "string") {
                        css += `${rule.cssText}`;
                    }
                    break;
            }
        });
        return css;
    }
    // handle case:
    // .app-main {}
    // html, body {}
    // eslint-disable-next-line class-methods-use-this
    ruleStyle(rule, prefix) {
        const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
        const rootCombinationRE = /(html[^\w{[]+)/gm;
        const selector = rule.selectorText.trim();
        let cssText = "";
        if (typeof rule.cssText === "string") {
            cssText = rule.cssText;
        }
        if (selector === "html" || selector === "body" || selector === ":root") {
            return cssText.replace(rootSelectorRE, prefix);
        }
        if (rootCombinationRE.test(rule.selectorText)) {
            const siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;
            if (!siblingSelectorRE.test(rule.selectorText)) {
                cssText = cssText.replace(rootCombinationRE, "");
            }
        }
        cssText = cssText.replace(
            /^[\s\S]+{/,
            (selectors) => selectors.replace(/(^|,\n?)([^,]+)/g, (item, p2, s2) => {
                if (rootSelectorRE.test(item)) {
                    return item.replace(rootSelectorRE, (m2) => {
                        const whitePrevChars = [",", "("];
                        if (m2 && whitePrevChars.includes(m2[0])) {
                            return `${m2[0]}${prefix}`;
                        }
                        return prefix;
                    });
                }
                return `${p2}${prefix} ${s2.replace(/^ */, "")}`;
            })
        );
        return cssText;
    }
    // handle case:
    // @media screen and (max-width: 300px) {}
    ruleMedia(rule, prefix) {
        const css = this.rewrite(arrayify(rule.cssRules), prefix);
        return `@media ${rule.conditionText || rule.media.mediaText} {${css}}`;
    }
    // handle case:
    // @supports (display: grid) {}
    ruleSupport(rule, prefix) {
        const css = this.rewrite(arrayify(rule.cssRules), prefix);
        return `@supports ${rule.conditionText || rule.cssText.split("{")[0]} {${css}}`;
    }
};
__publicField(_ScopedCSS, "ModifiedTag", "Symbol(style-modified-qiankun)");
let ScopedCSS = _ScopedCSS;
let processor;
const QiankunCSSRewriteAttr = "data-qiankun";
const process$1 = (appWrapper, stylesheetElement, appName) => {
    if (!processor) {
        processor = new ScopedCSS();
    }
    if (stylesheetElement.tagName === "LINK") {
        console.warn("Feature: sandbox.experimentalStyleIsolation is not support for link element yet.");
    }
    const mountDOM = appWrapper;
    if (!mountDOM) {
        return;
    }
    const tag = (mountDOM.tagName || "").toLowerCase();
    if (tag && stylesheetElement.tagName === "STYLE") {
        const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
        processor.process(stylesheetElement, prefix);
    }
};
const globalsInES2015 = window.Proxy ? [
    "Array",
    "ArrayBuffer",
    "Boolean",
    "constructor",
    "DataView",
    "Date",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Error",
    "escape",
    "eval",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "hasOwnProperty",
    "Infinity",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "isFinite",
    "isNaN",
    "isPrototypeOf",
    "JSON",
    "Map",
    "Math",
    "NaN",
    "Number",
    "Object",
    "parseFloat",
    "parseInt",
    "Promise",
    "propertyIsEnumerable",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "Set",
    "String",
    "Symbol",
    "SyntaxError",
    "toLocaleString",
    "toString",
    "TypeError",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "undefined",
    "unescape",
    "URIError",
    "valueOf",
    "WeakMap",
    "WeakSet"
].filter((p2) => (
    /* just keep the available properties in current window context */
    p2 in window
)) : [];
const globalsInBrowser = [
    "AbortController",
    "AbortSignal",
    "addEventListener",
    "alert",
    "AnalyserNode",
    "Animation",
    "AnimationEffectReadOnly",
    "AnimationEffectTiming",
    "AnimationEffectTimingReadOnly",
    "AnimationEvent",
    "AnimationPlaybackEvent",
    "AnimationTimeline",
    "applicationCache",
    "ApplicationCache",
    "ApplicationCacheErrorEvent",
    "atob",
    "Attr",
    "Audio",
    "AudioBuffer",
    "AudioBufferSourceNode",
    "AudioContext",
    "AudioDestinationNode",
    "AudioListener",
    "AudioNode",
    "AudioParam",
    "AudioProcessingEvent",
    "AudioScheduledSourceNode",
    "AudioWorkletGlobalScope",
    "AudioWorkletNode",
    "AudioWorkletProcessor",
    "BarProp",
    "BaseAudioContext",
    "BatteryManager",
    "BeforeUnloadEvent",
    "BiquadFilterNode",
    "Blob",
    "BlobEvent",
    "blur",
    "BroadcastChannel",
    "btoa",
    "BudgetService",
    "ByteLengthQueuingStrategy",
    "Cache",
    "caches",
    "CacheStorage",
    "cancelAnimationFrame",
    "cancelIdleCallback",
    "CanvasCaptureMediaStreamTrack",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "CharacterData",
    "clearInterval",
    "clearTimeout",
    "clientInformation",
    "ClipboardEvent",
    "ClipboardItem",
    "close",
    "closed",
    "CloseEvent",
    "Comment",
    "CompositionEvent",
    "CompressionStream",
    "confirm",
    "console",
    "ConstantSourceNode",
    "ConvolverNode",
    "CountQueuingStrategy",
    "createImageBitmap",
    "Credential",
    "CredentialsContainer",
    "crypto",
    "Crypto",
    "CryptoKey",
    "CSS",
    "CSSConditionRule",
    "CSSFontFaceRule",
    "CSSGroupingRule",
    "CSSImportRule",
    "CSSKeyframeRule",
    "CSSKeyframesRule",
    "CSSMatrixComponent",
    "CSSMediaRule",
    "CSSNamespaceRule",
    "CSSPageRule",
    "CSSPerspective",
    "CSSRotate",
    "CSSRule",
    "CSSRuleList",
    "CSSScale",
    "CSSSkew",
    "CSSSkewX",
    "CSSSkewY",
    "CSSStyleDeclaration",
    "CSSStyleRule",
    "CSSStyleSheet",
    "CSSSupportsRule",
    "CSSTransformValue",
    "CSSTranslate",
    "CustomElementRegistry",
    "customElements",
    "CustomEvent",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DecompressionStream",
    "defaultstatus",
    "defaultStatus",
    "DelayNode",
    "DeviceMotionEvent",
    "DeviceOrientationEvent",
    "devicePixelRatio",
    "dispatchEvent",
    "document",
    "Document",
    "DocumentFragment",
    "DocumentType",
    "DOMError",
    "DOMException",
    "DOMImplementation",
    "DOMMatrix",
    "DOMMatrixReadOnly",
    "DOMParser",
    "DOMPoint",
    "DOMPointReadOnly",
    "DOMQuad",
    "DOMRect",
    "DOMRectList",
    "DOMRectReadOnly",
    "DOMStringList",
    "DOMStringMap",
    "DOMTokenList",
    "DragEvent",
    "DynamicsCompressorNode",
    "Element",
    "ErrorEvent",
    "event",
    "Event",
    "EventSource",
    "EventTarget",
    "external",
    "fetch",
    "File",
    "FileList",
    "FileReader",
    "find",
    "focus",
    "FocusEvent",
    "FontFace",
    "FontFaceSetLoadEvent",
    "FormData",
    "FormDataEvent",
    "frameElement",
    "frames",
    "GainNode",
    "Gamepad",
    "GamepadButton",
    "GamepadEvent",
    "getComputedStyle",
    "getSelection",
    "HashChangeEvent",
    "Headers",
    "history",
    "History",
    "HTMLAllCollection",
    "HTMLAnchorElement",
    "HTMLAreaElement",
    "HTMLAudioElement",
    "HTMLBaseElement",
    "HTMLBodyElement",
    "HTMLBRElement",
    "HTMLButtonElement",
    "HTMLCanvasElement",
    "HTMLCollection",
    "HTMLContentElement",
    "HTMLDataElement",
    "HTMLDataListElement",
    "HTMLDetailsElement",
    "HTMLDialogElement",
    "HTMLDirectoryElement",
    "HTMLDivElement",
    "HTMLDListElement",
    "HTMLDocument",
    "HTMLElement",
    "HTMLEmbedElement",
    "HTMLFieldSetElement",
    "HTMLFontElement",
    "HTMLFormControlsCollection",
    "HTMLFormElement",
    "HTMLFrameElement",
    "HTMLFrameSetElement",
    "HTMLHeadElement",
    "HTMLHeadingElement",
    "HTMLHRElement",
    "HTMLHtmlElement",
    "HTMLIFrameElement",
    "HTMLImageElement",
    "HTMLInputElement",
    "HTMLLabelElement",
    "HTMLLegendElement",
    "HTMLLIElement",
    "HTMLLinkElement",
    "HTMLMapElement",
    "HTMLMarqueeElement",
    "HTMLMediaElement",
    "HTMLMenuElement",
    "HTMLMetaElement",
    "HTMLMeterElement",
    "HTMLModElement",
    "HTMLObjectElement",
    "HTMLOListElement",
    "HTMLOptGroupElement",
    "HTMLOptionElement",
    "HTMLOptionsCollection",
    "HTMLOutputElement",
    "HTMLParagraphElement",
    "HTMLParamElement",
    "HTMLPictureElement",
    "HTMLPreElement",
    "HTMLProgressElement",
    "HTMLQuoteElement",
    "HTMLScriptElement",
    "HTMLSelectElement",
    "HTMLShadowElement",
    "HTMLSlotElement",
    "HTMLSourceElement",
    "HTMLSpanElement",
    "HTMLStyleElement",
    "HTMLTableCaptionElement",
    "HTMLTableCellElement",
    "HTMLTableColElement",
    "HTMLTableElement",
    "HTMLTableRowElement",
    "HTMLTableSectionElement",
    "HTMLTemplateElement",
    "HTMLTextAreaElement",
    "HTMLTimeElement",
    "HTMLTitleElement",
    "HTMLTrackElement",
    "HTMLUListElement",
    "HTMLUnknownElement",
    "HTMLVideoElement",
    "IDBCursor",
    "IDBCursorWithValue",
    "IDBDatabase",
    "IDBFactory",
    "IDBIndex",
    "IDBKeyRange",
    "IDBObjectStore",
    "IDBOpenDBRequest",
    "IDBRequest",
    "IDBTransaction",
    "IDBVersionChangeEvent",
    "IdleDeadline",
    "IIRFilterNode",
    "Image",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageCapture",
    "ImageData",
    "indexedDB",
    "innerHeight",
    "innerWidth",
    "InputEvent",
    "IntersectionObserver",
    "IntersectionObserverEntry",
    "Intl",
    "isSecureContext",
    "KeyboardEvent",
    "KeyframeEffect",
    "KeyframeEffectReadOnly",
    "length",
    "localStorage",
    "location",
    "Location",
    "locationbar",
    "matchMedia",
    "MediaDeviceInfo",
    "MediaDevices",
    "MediaElementAudioSourceNode",
    "MediaEncryptedEvent",
    "MediaError",
    "MediaKeyMessageEvent",
    "MediaKeySession",
    "MediaKeyStatusMap",
    "MediaKeySystemAccess",
    "MediaList",
    "MediaMetadata",
    "MediaQueryList",
    "MediaQueryListEvent",
    "MediaRecorder",
    "MediaSettingsRange",
    "MediaSource",
    "MediaStream",
    "MediaStreamAudioDestinationNode",
    "MediaStreamAudioSourceNode",
    "MediaStreamConstraints",
    "MediaStreamEvent",
    "MediaStreamTrack",
    "MediaStreamTrackEvent",
    "menubar",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "MIDIAccess",
    "MIDIConnectionEvent",
    "MIDIInput",
    "MIDIInputMap",
    "MIDIMessageEvent",
    "MIDIOutput",
    "MIDIOutputMap",
    "MIDIPort",
    "MimeType",
    "MimeTypeArray",
    "MouseEvent",
    "moveBy",
    "moveTo",
    "MutationEvent",
    "MutationObserver",
    "MutationRecord",
    "name",
    "NamedNodeMap",
    "NavigationPreloadManager",
    "navigator",
    "Navigator",
    "NavigatorUAData",
    "NetworkInformation",
    "Node",
    "NodeFilter",
    "NodeIterator",
    "NodeList",
    "Notification",
    "OfflineAudioCompletionEvent",
    "OfflineAudioContext",
    "offscreenBuffering",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "onabort",
    "onafterprint",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "onappinstalled",
    "onauxclick",
    "onbeforeinstallprompt",
    "onbeforeprint",
    "onbeforeunload",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondevicemotion",
    "ondeviceorientation",
    "ondeviceorientationabsolute",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "ongotpointercapture",
    "onhashchange",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onlanguagechange",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onlostpointercapture",
    "onmessage",
    "onmessageerror",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpause",
    "onplay",
    "onplaying",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerup",
    "onpopstate",
    "onprogress",
    "onratechange",
    "onrejectionhandled",
    "onreset",
    "onresize",
    "onscroll",
    "onsearch",
    "onseeked",
    "onseeking",
    "onselect",
    "onstalled",
    "onstorage",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "ontransitionend",
    "onunhandledrejection",
    "onunload",
    "onvolumechange",
    "onwaiting",
    "onwheel",
    "open",
    "openDatabase",
    "opener",
    "Option",
    "origin",
    "OscillatorNode",
    "outerHeight",
    "outerWidth",
    "OverconstrainedError",
    "PageTransitionEvent",
    "pageXOffset",
    "pageYOffset",
    "PannerNode",
    "parent",
    "Path2D",
    "PaymentAddress",
    "PaymentRequest",
    "PaymentRequestUpdateEvent",
    "PaymentResponse",
    "performance",
    "Performance",
    "PerformanceEntry",
    "PerformanceLongTaskTiming",
    "PerformanceMark",
    "PerformanceMeasure",
    "PerformanceNavigation",
    "PerformanceNavigationTiming",
    "PerformanceObserver",
    "PerformanceObserverEntryList",
    "PerformancePaintTiming",
    "PerformanceResourceTiming",
    "PerformanceTiming",
    "PeriodicWave",
    "Permissions",
    "PermissionStatus",
    "personalbar",
    "PhotoCapabilities",
    "Plugin",
    "PluginArray",
    "PointerEvent",
    "PopStateEvent",
    "postMessage",
    "Presentation",
    "PresentationAvailability",
    "PresentationConnection",
    "PresentationConnectionAvailableEvent",
    "PresentationConnectionCloseEvent",
    "PresentationConnectionList",
    "PresentationReceiver",
    "PresentationRequest",
    "print",
    "ProcessingInstruction",
    "ProgressEvent",
    "PromiseRejectionEvent",
    "prompt",
    "PushManager",
    "PushSubscription",
    "PushSubscriptionOptions",
    "queueMicrotask",
    "RadioNodeList",
    "Range",
    "ReadableByteStreamController",
    "ReadableStream",
    "ReadableStreamBYOBReader",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "ReadableStreamDefaultReader",
    "registerProcessor",
    "RemotePlayback",
    "removeEventListener",
    "reportError",
    "Request",
    "requestAnimationFrame",
    "requestIdleCallback",
    "resizeBy",
    "ResizeObserver",
    "ResizeObserverEntry",
    "resizeTo",
    "Response",
    "RTCCertificate",
    "RTCDataChannel",
    "RTCDataChannelEvent",
    "RTCDtlsTransport",
    "RTCIceCandidate",
    "RTCIceGatherer",
    "RTCIceTransport",
    "RTCPeerConnection",
    "RTCPeerConnectionIceEvent",
    "RTCRtpContributingSource",
    "RTCRtpReceiver",
    "RTCRtpSender",
    "RTCSctpTransport",
    "RTCSessionDescription",
    "RTCStatsReport",
    "RTCTrackEvent",
    "screen",
    "Screen",
    "screenLeft",
    "ScreenOrientation",
    "screenTop",
    "screenX",
    "screenY",
    "ScriptProcessorNode",
    "scroll",
    "scrollbars",
    "scrollBy",
    "scrollTo",
    "scrollX",
    "scrollY",
    "SecurityPolicyViolationEvent",
    "Selection",
    "self",
    "ServiceWorker",
    "ServiceWorkerContainer",
    "ServiceWorkerRegistration",
    "sessionStorage",
    "setInterval",
    "setTimeout",
    "ShadowRoot",
    "SharedWorker",
    "SourceBuffer",
    "SourceBufferList",
    "speechSynthesis",
    "SpeechSynthesisEvent",
    "SpeechSynthesisUtterance",
    "StaticRange",
    "status",
    "statusbar",
    "StereoPannerNode",
    "stop",
    "Storage",
    "StorageEvent",
    "StorageManager",
    "structuredClone",
    "styleMedia",
    "StyleSheet",
    "StyleSheetList",
    "SubmitEvent",
    "SubtleCrypto",
    "SVGAElement",
    "SVGAngle",
    "SVGAnimatedAngle",
    "SVGAnimatedBoolean",
    "SVGAnimatedEnumeration",
    "SVGAnimatedInteger",
    "SVGAnimatedLength",
    "SVGAnimatedLengthList",
    "SVGAnimatedNumber",
    "SVGAnimatedNumberList",
    "SVGAnimatedPreserveAspectRatio",
    "SVGAnimatedRect",
    "SVGAnimatedString",
    "SVGAnimatedTransformList",
    "SVGAnimateElement",
    "SVGAnimateMotionElement",
    "SVGAnimateTransformElement",
    "SVGAnimationElement",
    "SVGCircleElement",
    "SVGClipPathElement",
    "SVGComponentTransferFunctionElement",
    "SVGDefsElement",
    "SVGDescElement",
    "SVGDiscardElement",
    "SVGElement",
    "SVGEllipseElement",
    "SVGFEBlendElement",
    "SVGFEColorMatrixElement",
    "SVGFEComponentTransferElement",
    "SVGFECompositeElement",
    "SVGFEConvolveMatrixElement",
    "SVGFEDiffuseLightingElement",
    "SVGFEDisplacementMapElement",
    "SVGFEDistantLightElement",
    "SVGFEDropShadowElement",
    "SVGFEFloodElement",
    "SVGFEFuncAElement",
    "SVGFEFuncBElement",
    "SVGFEFuncGElement",
    "SVGFEFuncRElement",
    "SVGFEGaussianBlurElement",
    "SVGFEImageElement",
    "SVGFEMergeElement",
    "SVGFEMergeNodeElement",
    "SVGFEMorphologyElement",
    "SVGFEOffsetElement",
    "SVGFEPointLightElement",
    "SVGFESpecularLightingElement",
    "SVGFESpotLightElement",
    "SVGFETileElement",
    "SVGFETurbulenceElement",
    "SVGFilterElement",
    "SVGForeignObjectElement",
    "SVGGElement",
    "SVGGeometryElement",
    "SVGGradientElement",
    "SVGGraphicsElement",
    "SVGImageElement",
    "SVGLength",
    "SVGLengthList",
    "SVGLinearGradientElement",
    "SVGLineElement",
    "SVGMarkerElement",
    "SVGMaskElement",
    "SVGMatrix",
    "SVGMetadataElement",
    "SVGMPathElement",
    "SVGNumber",
    "SVGNumberList",
    "SVGPathElement",
    "SVGPatternElement",
    "SVGPoint",
    "SVGPointList",
    "SVGPolygonElement",
    "SVGPolylineElement",
    "SVGPreserveAspectRatio",
    "SVGRadialGradientElement",
    "SVGRect",
    "SVGRectElement",
    "SVGScriptElement",
    "SVGSetElement",
    "SVGStopElement",
    "SVGStringList",
    "SVGStyleElement",
    "SVGSVGElement",
    "SVGSwitchElement",
    "SVGSymbolElement",
    "SVGTextContentElement",
    "SVGTextElement",
    "SVGTextPathElement",
    "SVGTextPositioningElement",
    "SVGTitleElement",
    "SVGTransform",
    "SVGTransformList",
    "SVGTSpanElement",
    "SVGUnitTypes",
    "SVGUseElement",
    "SVGViewElement",
    "TaskAttributionTiming",
    "Text",
    "TextDecoder",
    "TextDecoderStream",
    "TextEncoder",
    "TextEncoderStream",
    "TextEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TimeRanges",
    "ToggleEvent",
    "toolbar",
    "top",
    "Touch",
    "TouchEvent",
    "TouchList",
    "TrackEvent",
    "TransformStream",
    "TransformStreamDefaultController",
    "TransitionEvent",
    "TreeWalker",
    "UIEvent",
    "URL",
    "URLSearchParams",
    "ValidityState",
    "visualViewport",
    "VisualViewport",
    "VTTCue",
    "WaveShaperNode",
    "WebAssembly",
    "WebGL2RenderingContext",
    "WebGLActiveInfo",
    "WebGLBuffer",
    "WebGLContextEvent",
    "WebGLFramebuffer",
    "WebGLProgram",
    "WebGLQuery",
    "WebGLRenderbuffer",
    "WebGLRenderingContext",
    "WebGLSampler",
    "WebGLShader",
    "WebGLShaderPrecisionFormat",
    "WebGLSync",
    "WebGLTexture",
    "WebGLTransformFeedback",
    "WebGLUniformLocation",
    "WebGLVertexArrayObject",
    "WebSocket",
    "WheelEvent",
    "window",
    "Window",
    "Worker",
    "WritableStream",
    "WritableStreamDefaultController",
    "WritableStreamDefaultWriter",
    "XMLDocument",
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestUpload",
    "XMLSerializer",
    "XPathEvaluator",
    "XPathExpression",
    "XPathResult",
    "XRAnchor",
    "XRBoundedReferenceSpace",
    "XRCPUDepthInformation",
    "XRDepthInformation",
    "XRFrame",
    "XRInputSource",
    "XRInputSourceArray",
    "XRInputSourceEvent",
    "XRInputSourcesChangeEvent",
    "XRPose",
    "XRReferenceSpace",
    "XRReferenceSpaceEvent",
    "XRRenderState",
    "XRRigidTransform",
    "XRSession",
    "XRSessionEvent",
    "XRSpace",
    "XRSystem",
    "XRView",
    "XRViewerPose",
    "XRViewport",
    "XRWebGLBinding",
    "XRWebGLDepthInformation",
    "XRWebGLLayer",
    "XSLTProcessor"
];
function uniq(array) {
    return array.filter(function filter(element) {
        return element in this ? false : this[element] = true;
    }, /* @__PURE__ */ Object.create(null));
}
function array2TruthyObject(array) {
    return array.reduce(
        (acc, key) => {
            acc[key] = true;
            return acc;
        },
        // Notes that babel will transpile spread operator to Object.assign({}, ...args), which will keep the prototype of Object in merged object,
        // while this result used as Symbol.unscopables, it will make properties in Object.prototype always be escaped from proxy sandbox as unscopables check will look up prototype chain as well,
        // such as hasOwnProperty, toString, valueOf, etc.
        // so we should use Object.create(null) to create a pure object without prototype chain here.
        /* @__PURE__ */ Object.create(null)
    );
}
const cachedGlobalsInBrowser = array2TruthyObject(
    globalsInBrowser.concat(process.env.NODE_ENV === "test" ? ["mockNativeWindowFunction"] : [])
);
function isNativeGlobalProp(prop) {
    return prop in cachedGlobalsInBrowser;
}
const rawObjectDefineProperty = Object.defineProperty;
const variableWhiteListInDev = process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development" || window.__QIANKUN_DEVELOPMENT__ ? [
    // for react hot reload
    // see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
    "__REACT_ERROR_OVERLAY_GLOBAL_HOOK__",
    // for react development event issue, see https://github.com/umijs/qiankun/issues/2375
    "event"
] : [];
const globalVariableWhiteList = [
    // FIXME System.js used a indirect call with eval, which would make it scope escape to global
    // To make System.js works well, we write it back to global window temporary
    // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
    "System",
    // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
    "__cjsWrapper",
    ...variableWhiteListInDev
];
const inTest = process.env.NODE_ENV === "test";
const mockSafariTop = "mockSafariTop";
const mockTop = "mockTop";
const mockGlobalThis = "mockGlobalThis";
const accessingSpiedGlobals = ["document", "top", "parent", "eval"];
const overwrittenGlobals = ["window", "self", "globalThis", "hasOwnProperty"].concat(inTest ? [mockGlobalThis] : []);
const cachedGlobals = Array.from(
    new Set(
        without(globalsInES2015.concat(overwrittenGlobals).concat("requestAnimationFrame"), ...accessingSpiedGlobals)
    )
);
const cachedGlobalObjects = array2TruthyObject(cachedGlobals);
const unscopables = array2TruthyObject(without(cachedGlobals, ...accessingSpiedGlobals.concat(overwrittenGlobals)));
const useNativeWindowForBindingsProps = /* @__PURE__ */ new Map([
    ["fetch", true],
    ["mockDomAPIInBlackList", process.env.NODE_ENV === "test"]
]);
function createFakeWindow(globalContext, speedy) {
    const propertiesWithGetter = /* @__PURE__ */ new Map();
    const fakeWindow = {};
    Object.getOwnPropertyNames(globalContext).filter((p2) => {
        const descriptor = Object.getOwnPropertyDescriptor(globalContext, p2);
        return !(descriptor == null ? void 0 : descriptor.configurable);
    }).forEach((p2) => {
        const descriptor = Object.getOwnPropertyDescriptor(globalContext, p2);
        if (descriptor) {
            const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, "get");
            if (p2 === "top" || p2 === "parent" || p2 === "self" || p2 === "window" || // window.document is overwriting in speedy mode
                p2 === "document" && speedy || inTest && (p2 === mockTop || p2 === mockSafariTop)) {
                descriptor.configurable = true;
                if (!hasGetter) {
                    descriptor.writable = true;
                }
            }
            if (hasGetter) propertiesWithGetter.set(p2, true);
            rawObjectDefineProperty(fakeWindow, p2, Object.freeze(descriptor));
        }
    });
    return {
        fakeWindow,
        propertiesWithGetter
    };
}
let activeSandboxCount = 0;
class ProxySandbox {
    constructor(name2, globalContext = window, opts) {
        /** window 值变更记录 */
        __publicField(this, "updatedValueSet", /* @__PURE__ */ new Set());
        __publicField(this, "document", document);
        __publicField(this, "name");
        __publicField(this, "type");
        __publicField(this, "proxy");
        __publicField(this, "sandboxRunning", true);
        __publicField(this, "latestSetProp", null);
        // the descriptor of global variables in whitelist before it been modified
        __publicField(this, "globalWhitelistPrevDescriptor", {});
        __publicField(this, "globalContext");
        this.name = name2;
        this.globalContext = globalContext;
        this.type = SandBoxType.Proxy;
        const { updatedValueSet } = this;
        const { speedy } = opts || {};
        const { fakeWindow, propertiesWithGetter } = createFakeWindow(globalContext, !!speedy);
        const descriptorTargetMap = /* @__PURE__ */ new Map();
        const proxy = new Proxy(fakeWindow, {
            set: (target, p2, value) => {
                if (this.sandboxRunning) {
                    this.registerRunningApp(name2, proxy);
                    if (typeof p2 === "string" && globalVariableWhiteList.indexOf(p2) !== -1) {
                        this.globalWhitelistPrevDescriptor[p2] = Object.getOwnPropertyDescriptor(globalContext, p2);
                        globalContext[p2] = value;
                    } else {
                        if (!target.hasOwnProperty(p2) && globalContext.hasOwnProperty(p2)) {
                            const descriptor = Object.getOwnPropertyDescriptor(globalContext, p2);
                            const { writable, configurable, enumerable, set } = descriptor;
                            if (writable || set) {
                                Object.defineProperty(target, p2, { configurable, enumerable, writable: true, value });
                            }
                        } else {
                            target[p2] = value;
                        }
                    }
                    updatedValueSet.add(p2);
                    this.latestSetProp = p2;
                    return true;
                }
                if (process.env.NODE_ENV === "development") {
                    console.warn(`[qiankun] Set window.${p2.toString()} while sandbox destroyed or inactive in ${name2}!`);
                }
                return true;
            },
            get: (target, p2) => {
                this.registerRunningApp(name2, proxy);
                if (p2 === Symbol.unscopables) return unscopables;
                if (p2 === "window" || p2 === "self") {
                    return proxy;
                }
                if (p2 === "globalThis" || inTest && p2 === mockGlobalThis) {
                    return proxy;
                }
                if (p2 === "top" || p2 === "parent" || inTest && (p2 === mockTop || p2 === mockSafariTop)) {
                    if (globalContext === globalContext.parent) {
                        return proxy;
                    }
                    return globalContext[p2];
                }
                if (p2 === "hasOwnProperty") {
                    return hasOwnProperty;
                }
                if (p2 === "document") {
                    return this.document;
                }
                if (p2 === "eval") {
                    return eval;
                }
                if (p2 === "string" && globalVariableWhiteList.indexOf(p2) !== -1) {
                    return globalContext[p2];
                }
                const actualTarget = propertiesWithGetter.has(p2) ? globalContext : p2 in target ? target : globalContext;
                const value = actualTarget[p2];
                if (isPropertyFrozen(actualTarget, p2)) {
                    return value;
                }
                if (!isNativeGlobalProp(p2) && !useNativeWindowForBindingsProps.has(p2)) {
                    return value;
                }
                const boundTarget = useNativeWindowForBindingsProps.get(p2) ? nativeGlobal : globalContext;
                return rebindTarget2Fn(boundTarget, value);
            },
            // trap in operator
            // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
            has(target, p2) {
                return p2 in cachedGlobalObjects || p2 in target || p2 in globalContext;
            },
            getOwnPropertyDescriptor(target, p2) {
                if (target.hasOwnProperty(p2)) {
                    const descriptor = Object.getOwnPropertyDescriptor(target, p2);
                    descriptorTargetMap.set(p2, "target");
                    return descriptor;
                }
                if (globalContext.hasOwnProperty(p2)) {
                    const descriptor = Object.getOwnPropertyDescriptor(globalContext, p2);
                    descriptorTargetMap.set(p2, "globalContext");
                    if (descriptor && !descriptor.configurable) {
                        descriptor.configurable = true;
                    }
                    return descriptor;
                }
                return void 0;
            },
            // trap to support iterator with sandbox
            ownKeys(target) {
                return uniq(Reflect.ownKeys(globalContext).concat(Reflect.ownKeys(target)));
            },
            defineProperty: (target, p2, attributes) => {
                const from = descriptorTargetMap.get(p2);
                switch (from) {
                    case "globalContext":
                        return Reflect.defineProperty(globalContext, p2, attributes);
                    default:
                        return Reflect.defineProperty(target, p2, attributes);
                }
            },
            deleteProperty: (target, p2) => {
                this.registerRunningApp(name2, proxy);
                if (target.hasOwnProperty(p2)) {
                    delete target[p2];
                    updatedValueSet.delete(p2);
                    return true;
                }
                return true;
            },
            // makes sure `window instanceof Window` returns truthy in micro app
            getPrototypeOf() {
                return Reflect.getPrototypeOf(globalContext);
            }
        });
        this.proxy = proxy;
        activeSandboxCount++;
        function hasOwnProperty(key) {
            if (this !== proxy && this !== null && typeof this === "object") {
                return Object.prototype.hasOwnProperty.call(this, key);
            }
            return fakeWindow.hasOwnProperty(key) || globalContext.hasOwnProperty(key);
        }
    }
    active() {
        if (!this.sandboxRunning) activeSandboxCount++;
        this.sandboxRunning = true;
    }
    inactive() {
        if (process.env.NODE_ENV === "development") {
            console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
                ...this.updatedValueSet.keys()
            ]);
        }
        if (inTest || --activeSandboxCount === 0) {
            Object.keys(this.globalWhitelistPrevDescriptor).forEach((p2) => {
                const descriptor = this.globalWhitelistPrevDescriptor[p2];
                if (descriptor) {
                    Object.defineProperty(this.globalContext, p2, descriptor);
                } else {
                    delete this.globalContext[p2];
                }
            });
        }
        this.sandboxRunning = false;
    }
    patchDocument(doc) {
        this.document = doc;
    }
    registerRunningApp(name2, proxy) {
        if (this.sandboxRunning) {
            const currentRunningApp2 = getCurrentRunningApp();
            if (!currentRunningApp2 || currentRunningApp2.name !== name2) {
                setCurrentRunningApp({ name: name2, window: proxy });
            }
            nextTask(clearCurrentRunningApp);
        }
    }
}
const SCRIPT_TAG_NAME = "SCRIPT";
const LINK_TAG_NAME = "LINK";
const STYLE_TAG_NAME = "STYLE";
const styleElementTargetSymbol = Symbol("target");
const styleElementRefNodeNo = Symbol("refNodeNo");
const overwrittenSymbol = Symbol("qiankun-overwritten");
const getAppWrapperHeadElement = (appWrapper) => {
    return appWrapper.querySelector(qiankunHeadTagName);
};
function isExecutableScriptType(script) {
    return !script.type || ["text/javascript", "module", "application/javascript", "text/ecmascript", "application/ecmascript"].indexOf(
        script.type
    ) !== -1;
}
function isHijackingTag(tagName) {
    return (tagName == null ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME || (tagName == null ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME || (tagName == null ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME;
}
function isStyledComponentsLike(element) {
    var _a, _b;
    return !element.textContent && (((_a = element.sheet) == null ? void 0 : _a.cssRules.length) || ((_b = getStyledElementCSSRules(element)) == null ? void 0 : _b.length));
}
const appsCounterMap = /* @__PURE__ */ new Map();
function calcAppCount(appName, calcType, status) {
    const appCount = appsCounterMap.get(appName) || { bootstrappingPatchCount: 0, mountingPatchCount: 0 };
    switch (calcType) {
        case "increase":
            appCount[`${status}PatchCount`] += 1;
            break;
        case "decrease":
            if (appCount[`${status}PatchCount`] > 0) {
                appCount[`${status}PatchCount`] -= 1;
            }
            break;
    }
    appsCounterMap.set(appName, appCount);
}
function isAllAppsUnmounted() {
    return Array.from(appsCounterMap.entries()).every(
        ([, { bootstrappingPatchCount: bpc, mountingPatchCount: mpc }]) => bpc === 0 && mpc === 0
    );
}
function patchCustomEvent(e2, elementGetter) {
    Object.defineProperties(e2, {
        srcElement: {
            get: elementGetter
        },
        target: {
            get: elementGetter
        }
    });
    return e2;
}
function manualInvokeElementOnLoad(element) {
    const loadEvent = new CustomEvent("load");
    const patchedEvent = patchCustomEvent(loadEvent, () => element);
    if (isFunction(element.onload)) {
        element.onload(patchedEvent);
    } else {
        element.dispatchEvent(patchedEvent);
    }
}
function manualInvokeElementOnError(element) {
    const errorEvent = new CustomEvent("error");
    const patchedEvent = patchCustomEvent(errorEvent, () => element);
    if (isFunction(element.onerror)) {
        element.onerror(patchedEvent);
    } else {
        element.dispatchEvent(patchedEvent);
    }
}
function convertLinkAsStyle(element, postProcess, fetchFn = fetch) {
    const styleElement = document.createElement("style");
    const { href } = element;
    styleElement.dataset.qiankunHref = href;
    fetchFn(href).then((res) => res.text()).then((styleContext) => {
        styleElement.appendChild(document.createTextNode(styleContext));
        postProcess(styleElement);
        manualInvokeElementOnLoad(element);
    }).catch(() => manualInvokeElementOnError(element));
    return styleElement;
}
const defineNonEnumerableProperty = (target, key, value) => {
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        writable: true,
        value
    });
};
const styledComponentCSSRulesMap = /* @__PURE__ */ new WeakMap();
const dynamicScriptAttachedCommentMap = /* @__PURE__ */ new WeakMap();
const dynamicLinkAttachedInlineStyleMap = /* @__PURE__ */ new WeakMap();
function recordStyledComponentsCSSRules(styleElements) {
    styleElements.forEach((styleElement) => {
        if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
            if (styleElement.sheet) {
                styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
            }
        }
    });
}
function getStyledElementCSSRules(styledElement) {
    return styledComponentCSSRulesMap.get(styledElement);
}
function getOverwrittenAppendChildOrInsertBefore(opts) {
    function appendChildOrInsertBefore(newChild, refChild = null) {
        var _a, _b;
        let element = newChild;
        const { rawDOMAppendOrInsertBefore, isInvokedByMicroApp, containerConfigGetter, target = "body" } = opts;
        if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
        }
        if (element.tagName) {
            const containerConfig = containerConfigGetter(element);
            const {
                appName,
                appWrapperGetter,
                proxy,
                strictGlobal,
                speedySandbox,
                dynamicStyleSheetElements,
                scopedCSS,
                excludeAssetFilter
            } = containerConfig;
            switch (element.tagName) {
                case LINK_TAG_NAME:
                case STYLE_TAG_NAME: {
                    let stylesheetElement = newChild;
                    const { href } = stylesheetElement;
                    if (excludeAssetFilter && href && excludeAssetFilter(href)) {
                        return rawDOMAppendOrInsertBefore.call(this, element, refChild);
                    }
                    defineNonEnumerableProperty(stylesheetElement, styleElementTargetSymbol, target);
                    const appWrapper = appWrapperGetter();
                    if (scopedCSS) {
                        const linkElementUsingStylesheet = ((_a = element.tagName) == null ? void 0 : _a.toUpperCase()) === LINK_TAG_NAME && element.rel === "stylesheet" && element.href;
                        if (linkElementUsingStylesheet) {
                            const fetch2 = typeof frameworkConfiguration.fetch === "function" ? frameworkConfiguration.fetch : (_b = frameworkConfiguration.fetch) == null ? void 0 : _b.fn;
                            stylesheetElement = convertLinkAsStyle(
                                element,
                                (styleElement) => process$1(appWrapper, styleElement, appName),
                                fetch2
                            );
                            dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
                        } else {
                            process$1(appWrapper, stylesheetElement, appName);
                        }
                    }
                    const mountDOM = target === "head" ? getAppWrapperHeadElement(appWrapper) : appWrapper;
                    const referenceNode = mountDOM.contains(refChild) ? refChild : null;
                    let refNo;
                    if (referenceNode) {
                        refNo = Array.from(mountDOM.childNodes).indexOf(referenceNode);
                    }
                    const result = rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode);
                    if (typeof refNo === "number" && refNo !== -1) {
                        defineNonEnumerableProperty(stylesheetElement, styleElementRefNodeNo, refNo);
                    }
                    dynamicStyleSheetElements.push(stylesheetElement);
                    return result;
                }
                case SCRIPT_TAG_NAME: {
                    const { src, text } = element;
                    if (excludeAssetFilter && src && excludeAssetFilter(src) || !isExecutableScriptType(element)) {
                        return rawDOMAppendOrInsertBefore.call(this, element, refChild);
                    }
                    const appWrapper = appWrapperGetter();
                    const mountDOM = target === "head" ? getAppWrapperHeadElement(appWrapper) : appWrapper;
                    const { fetch: fetch2 } = frameworkConfiguration;
                    const referenceNode = mountDOM.contains(refChild) ? refChild : null;
                    const scopedGlobalVariables = speedySandbox ? cachedGlobals : [];
                    if (src) {
                        let isRedfinedCurrentScript = false;
                        _execScripts(null, [src], proxy, {
                            fetch: fetch2,
                            strictGlobal,
                            scopedGlobalVariables,
                            beforeExec: () => {
                                const isCurrentScriptConfigurable = () => {
                                    const descriptor = Object.getOwnPropertyDescriptor(document, "currentScript");
                                    return !descriptor || descriptor.configurable;
                                };
                                if (isCurrentScriptConfigurable()) {
                                    Object.defineProperty(document, "currentScript", {
                                        get() {
                                            return element;
                                        },
                                        configurable: true
                                    });
                                    isRedfinedCurrentScript = true;
                                }
                            },
                            success: () => {
                                manualInvokeElementOnLoad(element);
                                if (isRedfinedCurrentScript) {
                                    delete document.currentScript;
                                }
                                element = null;
                            },
                            error: () => {
                                manualInvokeElementOnError(element);
                                if (isRedfinedCurrentScript) {
                                    delete document.currentScript;
                                }
                                element = null;
                            }
                        });
                        const dynamicScriptCommentElement = document.createComment(`dynamic script ${src} replaced by qiankun`);
                        dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
                        return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicScriptCommentElement, referenceNode);
                    }
                    _execScripts(null, [`<script>${text}<\/script>`], proxy, { strictGlobal, scopedGlobalVariables });
                    const dynamicInlineScriptCommentElement = document.createComment("dynamic inline script replaced by qiankun");
                    dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
                    return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicInlineScriptCommentElement, referenceNode);
                }
            }
        }
        return rawDOMAppendOrInsertBefore.call(this, element, refChild);
    }
    appendChildOrInsertBefore[overwrittenSymbol] = true;
    return appendChildOrInsertBefore;
}
function getNewRemoveChild(rawRemoveChild2, containerConfigGetter, target, isInvokedByMicroApp) {
    function removeChild(child) {
        const { tagName } = child;
        if (!isHijackingTag(tagName) || !isInvokedByMicroApp(child)) return rawRemoveChild2.call(this, child);
        try {
            let attachedElement;
            const { appWrapperGetter, dynamicStyleSheetElements } = containerConfigGetter(child);
            switch (tagName) {
                case STYLE_TAG_NAME:
                case LINK_TAG_NAME: {
                    attachedElement = dynamicLinkAttachedInlineStyleMap.get(child) || child;
                    const dynamicElementIndex = dynamicStyleSheetElements.indexOf(attachedElement);
                    if (dynamicElementIndex !== -1) {
                        dynamicStyleSheetElements.splice(dynamicElementIndex, 1);
                    }
                    break;
                }
                case SCRIPT_TAG_NAME: {
                    attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;
                    break;
                }
                default: {
                    attachedElement = child;
                }
            }
            const appWrapper = appWrapperGetter();
            const container = target === "head" ? getAppWrapperHeadElement(appWrapper) : appWrapper;
            if (container.contains(attachedElement)) {
                return rawRemoveChild2.call(attachedElement.parentNode, attachedElement);
            }
        } catch (e2) {
            console.warn(e2);
        }
        return rawRemoveChild2.call(this, child);
    }
    removeChild[overwrittenSymbol] = true;
    return removeChild;
}
function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
    const rawHeadAppendChild2 = HTMLHeadElement.prototype.appendChild;
    const rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
    const rawHeadInsertBefore2 = HTMLHeadElement.prototype.insertBefore;
    if (rawHeadAppendChild2[overwrittenSymbol] !== true && rawBodyAppendChild[overwrittenSymbol] !== true && rawHeadInsertBefore2[overwrittenSymbol] !== true) {
        HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
            rawDOMAppendOrInsertBefore: rawHeadAppendChild2,
            containerConfigGetter,
            isInvokedByMicroApp,
            target: "head"
        });
        HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
            rawDOMAppendOrInsertBefore: rawBodyAppendChild,
            containerConfigGetter,
            isInvokedByMicroApp,
            target: "body"
        });
        HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
            rawDOMAppendOrInsertBefore: rawHeadInsertBefore2,
            containerConfigGetter,
            isInvokedByMicroApp,
            target: "head"
        });
    }
    const rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
    const rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
    if (rawHeadRemoveChild[overwrittenSymbol] !== true && rawBodyRemoveChild[overwrittenSymbol] !== true) {
        HTMLHeadElement.prototype.removeChild = getNewRemoveChild(
            rawHeadRemoveChild,
            containerConfigGetter,
            "head",
            isInvokedByMicroApp
        );
        HTMLBodyElement.prototype.removeChild = getNewRemoveChild(
            rawBodyRemoveChild,
            containerConfigGetter,
            "body",
            isInvokedByMicroApp
        );
    }
    return function unpatch() {
        HTMLHeadElement.prototype.appendChild = rawHeadAppendChild2;
        HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
        HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
        HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
        HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore2;
    };
}
function rebuildCSSRules(styleSheetElements, reAppendElement) {
    styleSheetElements.forEach((stylesheetElement) => {
        const appendSuccess = reAppendElement(stylesheetElement);
        if (appendSuccess) {
            if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
                const cssRules = getStyledElementCSSRules(stylesheetElement);
                if (cssRules) {
                    for (let i2 = 0; i2 < cssRules.length; i2++) {
                        const cssRule = cssRules[i2];
                        const cssStyleSheetElement = stylesheetElement.sheet;
                        cssStyleSheetElement.insertRule(cssRule.cssText, cssStyleSheetElement.cssRules.length);
                    }
                }
            }
        }
    });
}
function patchLooseSandbox(appName, appWrapperGetter, sandbox, mounting = true, scopedCSS = false, excludeAssetFilter) {
    const { proxy } = sandbox;
    let dynamicStyleSheetElements = [];
    const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
        /*
      check if the currently specified application is active
      While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
      but the url change listener must wait until the current call stack is flushed.
      This scenario may cause we record the stylesheet from react routing page dynamic injection,
      and remove them after the url change triggered and qiankun app is unmounting
      see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
     */
        () => Tt(window.location).some((name2) => name2 === appName),
        () => ({
            appName,
            appWrapperGetter,
            proxy,
            strictGlobal: false,
            speedySandbox: false,
            scopedCSS,
            dynamicStyleSheetElements,
            excludeAssetFilter
        })
    );
    if (!mounting) calcAppCount(appName, "increase", "bootstrapping");
    if (mounting) calcAppCount(appName, "increase", "mounting");
    return function free() {
        if (!mounting) calcAppCount(appName, "decrease", "bootstrapping");
        if (mounting) calcAppCount(appName, "decrease", "mounting");
        if (isAllAppsUnmounted()) unpatchDynamicAppendPrototypeFunctions();
        recordStyledComponentsCSSRules(dynamicStyleSheetElements);
        return function rebuild() {
            rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
                const appWrapper = appWrapperGetter();
                if (!appWrapper.contains(stylesheetElement)) {
                    document.head.appendChild.call(appWrapper, stylesheetElement);
                    return true;
                }
                return false;
            });
            if (mounting) {
                dynamicStyleSheetElements = [];
            }
        };
    };
}
Object.defineProperty(nativeGlobal, "__proxyAttachContainerConfigMap__", { enumerable: false, writable: true });
Object.defineProperty(nativeGlobal, "__currentLockingSandbox__", {
    enumerable: false,
    writable: true,
    configurable: true
});
const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
const rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
nativeGlobal.__proxyAttachContainerConfigMap__ = nativeGlobal.__proxyAttachContainerConfigMap__ || /* @__PURE__ */ new WeakMap();
const proxyAttachContainerConfigMap = nativeGlobal.__proxyAttachContainerConfigMap__;
const elementAttachContainerConfigMap = /* @__PURE__ */ new WeakMap();
const docCreatePatchedMap = /* @__PURE__ */ new WeakMap();
const patchMap = /* @__PURE__ */ new WeakMap();
function patchDocument(cfg) {
    const { sandbox, speedy } = cfg;
    const attachElementToProxy = (element, proxy) => {
        const proxyContainerConfig = proxyAttachContainerConfigMap.get(proxy);
        if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
        }
    };
    if (speedy) {
        const modifications = {};
        const proxyDocument = new Proxy(document, {
            /**
             * Read and write must be paired, otherwise the write operation will leak to the global
             */
            set: (target, p2, value) => {
                switch (p2) {
                    case "createElement": {
                        modifications.createElement = value;
                        break;
                    }
                    case "querySelector": {
                        modifications.querySelector = value;
                        break;
                    }
                    default:
                        target[p2] = value;
                        break;
                }
                return true;
            },
            get: (target, p2, receiver) => {
                switch (p2) {
                    case "createElement": {
                        const targetCreateElement = modifications.createElement || target.createElement;
                        return function createElement2(...args) {
                            if (!nativeGlobal.__currentLockingSandbox__) {
                                nativeGlobal.__currentLockingSandbox__ = sandbox.name;
                            }
                            const element = targetCreateElement.call(target, ...args);
                            if (nativeGlobal.__currentLockingSandbox__ === sandbox.name) {
                                attachElementToProxy(element, sandbox.proxy);
                                delete nativeGlobal.__currentLockingSandbox__;
                            }
                            return element;
                        };
                    }
                    case "querySelector": {
                        const targetQuerySelector = modifications.querySelector || target.querySelector;
                        return function querySelector(...args) {
                            const selector = args[0];
                            switch (selector) {
                                case "head": {
                                    const containerConfig = proxyAttachContainerConfigMap.get(sandbox.proxy);
                                    if (containerConfig) {
                                        const qiankunHead = getAppWrapperHeadElement(containerConfig.appWrapperGetter());
                                        qiankunHead.appendChild = HTMLHeadElement.prototype.appendChild;
                                        qiankunHead.insertBefore = HTMLHeadElement.prototype.insertBefore;
                                        qiankunHead.removeChild = HTMLHeadElement.prototype.removeChild;
                                        return qiankunHead;
                                    }
                                    break;
                                }
                            }
                            return targetQuerySelector.call(target, ...args);
                        };
                    }
                }
                const value = target[p2];
                if (isCallable(value) && !isBoundedFunction(value)) {
                    return function proxyFunction(...args) {
                        return value.call(target, ...args.map((arg) => arg === receiver ? target : arg));
                    };
                }
                return value;
            }
        });
        sandbox.patchDocument(proxyDocument);
        const nativeMutationObserverObserveFn = MutationObserver.prototype.observe;
        if (!patchMap.has(nativeMutationObserverObserveFn)) {
            const observe = function observe2(target, options) {
                const realTarget = target instanceof Document ? nativeDocument : target;
                return nativeMutationObserverObserveFn.call(this, realTarget, options);
            };
            MutationObserver.prototype.observe = observe;
            patchMap.set(nativeMutationObserverObserveFn, observe);
        }
        const prevCompareDocumentPosition = Node.prototype.compareDocumentPosition;
        if (!patchMap.has(prevCompareDocumentPosition)) {
            Node.prototype.compareDocumentPosition = function compareDocumentPosition(node) {
                const realNode = node instanceof Document ? nativeDocument : node;
                return prevCompareDocumentPosition.call(this, realNode);
            };
            patchMap.set(prevCompareDocumentPosition, Node.prototype.compareDocumentPosition);
        }
        const parentNodeDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, "parentNode");
        if (parentNodeDescriptor && !patchMap.has(parentNodeDescriptor)) {
            const { get: parentNodeGetter, configurable } = parentNodeDescriptor;
            if (parentNodeGetter && configurable) {
                const patchedParentNodeDescriptor = {
                    ...parentNodeDescriptor,
                    get() {
                        var _a;
                        const parentNode = parentNodeGetter.call(this);
                        if (parentNode instanceof Document) {
                            const proxy = (_a = getCurrentRunningApp()) == null ? void 0 : _a.window;
                            if (proxy) {
                                return proxy.document;
                            }
                        }
                        return parentNode;
                    }
                };
                Object.defineProperty(Node.prototype, "parentNode", patchedParentNodeDescriptor);
                patchMap.set(parentNodeDescriptor, patchedParentNodeDescriptor);
            }
        }
        return () => {
            MutationObserver.prototype.observe = nativeMutationObserverObserveFn;
            patchMap.delete(nativeMutationObserverObserveFn);
            Node.prototype.compareDocumentPosition = prevCompareDocumentPosition;
            patchMap.delete(prevCompareDocumentPosition);
            if (parentNodeDescriptor) {
                Object.defineProperty(Node.prototype, "parentNode", parentNodeDescriptor);
                patchMap.delete(parentNodeDescriptor);
            }
        };
    }
    const docCreateElementFnBeforeOverwrite = docCreatePatchedMap.get(document.createElement);
    if (!docCreateElementFnBeforeOverwrite) {
        const rawDocumentCreateElement = document.createElement;
        Document.prototype.createElement = function createElement2(tagName, options) {
            const element = rawDocumentCreateElement.call(this, tagName, options);
            if (isHijackingTag(tagName)) {
                const { window: currentRunningSandboxProxy } = getCurrentRunningApp() || {};
                if (currentRunningSandboxProxy) {
                    attachElementToProxy(element, currentRunningSandboxProxy);
                }
            }
            return element;
        };
        if (document.hasOwnProperty("createElement")) {
            document.createElement = Document.prototype.createElement;
        }
        docCreatePatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
    }
    return function unpatch() {
        if (docCreateElementFnBeforeOverwrite) {
            Document.prototype.createElement = docCreateElementFnBeforeOverwrite;
            document.createElement = docCreateElementFnBeforeOverwrite;
        }
    };
}
function patchStrictSandbox(appName, appWrapperGetter, sandbox, mounting = true, scopedCSS = false, excludeAssetFilter, speedySandbox = false) {
    const { proxy } = sandbox;
    let containerConfig = proxyAttachContainerConfigMap.get(proxy);
    if (!containerConfig) {
        containerConfig = {
            appName,
            proxy,
            appWrapperGetter,
            dynamicStyleSheetElements: [],
            strictGlobal: true,
            speedySandbox,
            excludeAssetFilter,
            scopedCSS
        };
        proxyAttachContainerConfigMap.set(proxy, containerConfig);
    }
    const { dynamicStyleSheetElements } = containerConfig;
    const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
        (element) => elementAttachContainerConfigMap.has(element),
        (element) => elementAttachContainerConfigMap.get(element)
    );
    const unpatchDocument = patchDocument({ sandbox, speedy: speedySandbox });
    if (!mounting) calcAppCount(appName, "increase", "bootstrapping");
    if (mounting) calcAppCount(appName, "increase", "mounting");
    return function free() {
        if (!mounting) calcAppCount(appName, "decrease", "bootstrapping");
        if (mounting) calcAppCount(appName, "decrease", "mounting");
        if (isAllAppsUnmounted()) {
            unpatchDynamicAppendPrototypeFunctions();
            unpatchDocument();
        }
        recordStyledComponentsCSSRules(dynamicStyleSheetElements);
        return function rebuild() {
            rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
                const appWrapper = appWrapperGetter();
                if (!appWrapper.contains(stylesheetElement)) {
                    const mountDom = stylesheetElement[styleElementTargetSymbol] === "head" ? getAppWrapperHeadElement(appWrapper) : appWrapper;
                    const refNo = stylesheetElement[styleElementRefNodeNo];
                    if (typeof refNo === "number" && refNo !== -1) {
                        const refNode = mountDom.childNodes[refNo] || null;
                        rawHeadInsertBefore.call(mountDom, stylesheetElement, refNode);
                        return true;
                    } else {
                        rawHeadAppendChild.call(mountDom, stylesheetElement);
                        return true;
                    }
                }
                return false;
            });
        };
    };
}
function patch$2() {
    let rawHistoryListen = (_2) => noop;
    const historyListeners = [];
    const historyUnListens = [];
    if (window.g_history && isFunction(window.g_history.listen)) {
        rawHistoryListen = window.g_history.listen.bind(window.g_history);
        window.g_history.listen = (listener) => {
            historyListeners.push(listener);
            const unListen = rawHistoryListen(listener);
            historyUnListens.push(unListen);
            return () => {
                unListen();
                historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
                historyListeners.splice(historyListeners.indexOf(listener), 1);
            };
        };
    }
    return function free() {
        let rebuild = noop;
        if (historyListeners.length) {
            rebuild = () => {
                historyListeners.forEach((listener) => window.g_history.listen(listener));
            };
        }
        historyUnListens.forEach((unListen) => unListen());
        if (window.g_history && isFunction(window.g_history.listen)) {
            window.g_history.listen = rawHistoryListen;
        }
        return rebuild;
    };
}
const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;
function patch$1(global2) {
    let intervals = [];
    global2.clearInterval = (intervalId) => {
        intervals = intervals.filter((id) => id !== intervalId);
        return rawWindowClearInterval.call(window, intervalId);
    };
    global2.setInterval = (handler, timeout, ...args) => {
        const intervalId = rawWindowInterval(handler, timeout, ...args);
        intervals = [...intervals, intervalId];
        return intervalId;
    };
    return function free() {
        intervals.forEach((id) => global2.clearInterval(id));
        global2.setInterval = rawWindowInterval;
        global2.clearInterval = rawWindowClearInterval;
        return noop;
    };
}
const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;
function patch(global2) {
    const listenerMap = /* @__PURE__ */ new Map();
    global2.addEventListener = (type, listener, options) => {
        const listeners = listenerMap.get(type) || [];
        listenerMap.set(type, [...listeners, listener]);
        return rawAddEventListener.call(window, type, listener, options);
    };
    global2.removeEventListener = (type, listener, options) => {
        const storedTypeListeners = listenerMap.get(type);
        if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
            storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
        }
        return rawRemoveEventListener.call(window, type, listener, options);
    };
    return function free() {
        listenerMap.forEach(
            (listeners, type) => [...listeners].forEach((listener) => global2.removeEventListener(type, listener))
        );
        global2.addEventListener = rawAddEventListener;
        global2.removeEventListener = rawRemoveEventListener;
        return noop;
    };
}
function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
    var _a;
    const basePatchers = [
        () => patch$1(sandbox.proxy),
        () => patch(sandbox.proxy),
        () => patch$2()
    ];
    const patchersInSandbox = {
        [SandBoxType.LegacyProxy]: [
            ...basePatchers,
            () => patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter)
        ],
        [SandBoxType.Proxy]: [
            ...basePatchers,
            () => patchStrictSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter, speedySandBox)
        ],
        [SandBoxType.Snapshot]: [
            ...basePatchers,
            () => patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter)
        ]
    };
    return (_a = patchersInSandbox[sandbox.type]) == null ? void 0 : _a.map((patch2) => patch2());
}
function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
    var _a;
    const patchersInSandbox = {
        [SandBoxType.LegacyProxy]: [
            () => patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter)
        ],
        [SandBoxType.Proxy]: [
            () => patchStrictSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter, speedySandBox)
        ],
        [SandBoxType.Snapshot]: [
            () => patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter)
        ]
    };
    return (_a = patchersInSandbox[sandbox.type]) == null ? void 0 : _a.map((patch2) => patch2());
}
function iter(obj, callbackFn) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) || prop === "clearInterval") {
            callbackFn(prop);
        }
    }
}
class SnapshotSandbox {
    constructor(name2) {
        __publicField(this, "proxy");
        __publicField(this, "name");
        __publicField(this, "type");
        __publicField(this, "sandboxRunning", true);
        __publicField(this, "windowSnapshot");
        __publicField(this, "modifyPropsMap", {});
        this.name = name2;
        this.proxy = window;
        this.type = SandBoxType.Snapshot;
    }
    active() {
        this.windowSnapshot = {};
        iter(window, (prop) => {
            this.windowSnapshot[prop] = window[prop];
        });
        Object.keys(this.modifyPropsMap).forEach((p2) => {
            window[p2] = this.modifyPropsMap[p2];
        });
        this.sandboxRunning = true;
    }
    inactive() {
        this.modifyPropsMap = {};
        iter(window, (prop) => {
            if (window[prop] !== this.windowSnapshot[prop]) {
                this.modifyPropsMap[prop] = window[prop];
                window[prop] = this.windowSnapshot[prop];
            }
        });
        if (process.env.NODE_ENV === "development") {
            console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap));
        }
        this.sandboxRunning = false;
    }
    patchDocument() {
    }
}
function createSandboxContainer(appName, elementGetter, scopedCSS, useLooseSandbox, excludeAssetFilter, globalContext, speedySandBox) {
    let sandbox;
    if (window.Proxy) {
        sandbox = useLooseSandbox ? new LegacySandbox(appName, globalContext) : new ProxySandbox(appName, globalContext, { speedy: !!speedySandBox });
    } else {
        sandbox = new SnapshotSandbox(appName);
    }
    const bootstrappingFreers = patchAtBootstrapping(
        appName,
        elementGetter,
        sandbox,
        scopedCSS,
        excludeAssetFilter,
        speedySandBox
    );
    let mountingFreers = [];
    let sideEffectsRebuilders = [];
    return {
        instance: sandbox,
        /**
         * 沙箱被 mount
         * 可能是从 bootstrap 状态进入的 mount
         * 也可能是从 unmount 之后再次唤醒进入 mount
         */
        async mount() {
            sandbox.active();
            const sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
            const sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length);
            if (sideEffectsRebuildersAtBootstrapping.length) {
                sideEffectsRebuildersAtBootstrapping.forEach((rebuild) => rebuild());
            }
            mountingFreers = patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox);
            if (sideEffectsRebuildersAtMounting.length) {
                sideEffectsRebuildersAtMounting.forEach((rebuild) => rebuild());
            }
            sideEffectsRebuilders = [];
        },
        /**
         * 恢复 global 状态，使其能回到应用加载之前的状态
         */
        async unmount() {
            sideEffectsRebuilders = [...bootstrappingFreers, ...mountingFreers].map((free) => free());
            sandbox.inactive();
        }
    };
}
function assertElementExist(element, msg) {
    if (!element) {
        if (msg) {
            throw new QiankunError(msg);
        }
        throw new QiankunError("element not existed!");
    }
}
function execHooksChain(hooks, app, global2 = window) {
    if (hooks.length) {
        return hooks.reduce((chain, hook) => chain.then(() => hook(app, global2)), Promise.resolve());
    }
    return Promise.resolve();
}
async function validateSingularMode(validate, app) {
    return typeof validate === "function" ? validate(app) : !!validate;
}
const supportShadowDOM = !!document.head.attachShadow || !!document.head.createShadowRoot;
function createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId) {
    const containerElement = document.createElement("div");
    containerElement.innerHTML = appContent;
    const appElement = containerElement.firstChild;
    if (strictStyleIsolation) {
        if (!supportShadowDOM) {
            console.warn(
                "[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!"
            );
        } else {
            const { innerHTML } = appElement;
            appElement.innerHTML = "";
            let shadow;
            if (appElement.attachShadow) {
                shadow = appElement.attachShadow({ mode: "open" });
            } else {
                shadow = appElement.createShadowRoot();
            }
            shadow.innerHTML = innerHTML;
        }
    }
    if (scopedCSS) {
        const attr = appElement.getAttribute(QiankunCSSRewriteAttr);
        if (!attr) {
            appElement.setAttribute(QiankunCSSRewriteAttr, appInstanceId);
        }
        const styleNodes = appElement.querySelectorAll("style") || [];
        forEach(styleNodes, (stylesheetElement) => {
            process$1(appElement, stylesheetElement, appInstanceId);
        });
    }
    return appElement;
}
function getAppWrapperGetter(appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
    return () => {
        if (useLegacyRender) {
            if (strictStyleIsolation) throw new QiankunError("strictStyleIsolation can not be used with legacy render!");
            if (scopedCSS) throw new QiankunError("experimentalStyleIsolation can not be used with legacy render!");
            const appWrapper = document.getElementById(getWrapperId(appInstanceId));
            assertElementExist(appWrapper, `Wrapper element for ${appInstanceId} is not existed!`);
            return appWrapper;
        }
        const element = elementGetter();
        assertElementExist(element, `Wrapper element for ${appInstanceId} is not existed!`);
        if (strictStyleIsolation && supportShadowDOM) {
            return element.shadowRoot;
        }
        return element;
    };
}
const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;
function getRender(appInstanceId, appContent, legacyRender) {
    const render = ({ element, loading, container }, phase) => {
        if (legacyRender) {
            if (process.env.NODE_ENV === "development") {
                console.error(
                    "[qiankun] Custom rendering function is deprecated and will be removed in 3.0, you can use the container element setting instead!"
                );
            }
            return legacyRender({ loading, appContent: element ? appContent : "" });
        }
        const containerElement = getContainer(container);
        if (phase !== "unmounted") {
            const errorMsg = (() => {
                switch (phase) {
                    case "loading":
                    case "mounting":
                        return `Target container with ${container} not existed while ${appInstanceId} ${phase}!`;
                    case "mounted":
                        return `Target container with ${container} not existed after ${appInstanceId} ${phase}!`;
                    default:
                        return `Target container with ${container} not existed while ${appInstanceId} rendering!`;
                }
            })();
            assertElementExist(containerElement, errorMsg);
        }
        if (containerElement && !containerElement.contains(element)) {
            while (containerElement.firstChild) {
                rawRemoveChild.call(containerElement, containerElement.firstChild);
            }
            if (element) {
                rawAppendChild.call(containerElement, element);
            }
        }
        return void 0;
    };
    return render;
}
function getLifecyclesFromExports(scriptExports, appName, global2, globalLatestSetProp) {
    if (validateExportLifecycle(scriptExports)) {
        return scriptExports;
    }
    if (globalLatestSetProp) {
        const lifecycles = global2[globalLatestSetProp];
        if (validateExportLifecycle(lifecycles)) {
            return lifecycles;
        }
    }
    if (process.env.NODE_ENV === "development") {
        console.warn(
            `[qiankun] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`
        );
    }
    const globalVariableExports = global2[appName];
    if (validateExportLifecycle(globalVariableExports)) {
        return globalVariableExports;
    }
    throw new QiankunError(`You need to export lifecycle functions in ${appName} entry`);
}
let prevAppUnmountedDeferred;
async function loadApp(app, configuration = {}, lifeCycles) {
    var _a;
    const { entry, name: appName } = app;
    const appInstanceId = genAppInstanceIdByName(appName);
    const markName = `[qiankun] App ${appInstanceId} Loading`;
    if (process.env.NODE_ENV === "development") {
        performanceMark(markName);
    }
    const {
        singular = false,
        sandbox = true,
        excludeAssetFilter,
        globalContext = window,
        ...importEntryOpts
    } = configuration;
    const { template, execScripts, assetPublicPath, getExternalScripts } = await importEntry(entry, importEntryOpts);
    await getExternalScripts();
    if (await validateSingularMode(singular, app)) {
        await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
    }
    const appContent = getDefaultTplWrapper(appInstanceId, sandbox)(template);
    const strictStyleIsolation = typeof sandbox === "object" && !!sandbox.strictStyleIsolation;
    if (process.env.NODE_ENV === "development" && strictStyleIsolation) {
        console.warn(
            "[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!"
        );
    }
    const scopedCSS = isEnableScopedCSS(sandbox);
    let initialAppWrapperElement = createElement(
        appContent,
        strictStyleIsolation,
        scopedCSS,
        appInstanceId
    );
    const initialContainer = "container" in app ? app.container : void 0;
    const legacyRender = "render" in app ? app.render : void 0;
    const render = getRender(appInstanceId, appContent, legacyRender);
    render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, "loading");
    const initialAppWrapperGetter = getAppWrapperGetter(
        appInstanceId,
        !!legacyRender,
        strictStyleIsolation,
        scopedCSS,
        () => initialAppWrapperElement
    );
    let global2 = globalContext;
    let mountSandbox = () => Promise.resolve();
    let unmountSandbox = () => Promise.resolve();
    const useLooseSandbox = typeof sandbox === "object" && !!sandbox.loose;
    const speedySandbox = typeof sandbox === "object" ? sandbox.speedy !== false : true;
    let sandboxContainer;
    if (sandbox) {
        sandboxContainer = createSandboxContainer(
            appInstanceId,
            // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
            initialAppWrapperGetter,
            scopedCSS,
            useLooseSandbox,
            excludeAssetFilter,
            global2,
            speedySandbox
        );
        global2 = sandboxContainer.instance.proxy;
        mountSandbox = sandboxContainer.mount;
        unmountSandbox = sandboxContainer.unmount;
    }
    const {
        beforeUnmount = [],
        afterUnmount = [],
        afterMount = [],
        beforeMount = [],
        beforeLoad = []
    } = mergeWith({}, getAddOns(global2, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));
    await execHooksChain(toArray(beforeLoad), app, global2);
    const scriptExports = await execScripts(global2, sandbox && !useLooseSandbox, {
        scopedGlobalVariables: speedySandbox ? cachedGlobals : []
    });
    const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
        scriptExports,
        appName,
        global2,
        (_a = sandboxContainer == null ? void 0 : sandboxContainer.instance) == null ? void 0 : _a.latestSetProp
    );
    const { onGlobalStateChange, setGlobalState, offGlobalStateChange } = getMicroAppStateActions(appInstanceId);
    const syncAppWrapperElement2Sandbox = (element) => initialAppWrapperElement = element;
    const parcelConfigGetter = (remountContainer = initialContainer) => {
        let appWrapperElement;
        let appWrapperGetter;
        const parcelConfig = {
            name: appInstanceId,
            bootstrap,
            mount: [
                async () => {
                    if (process.env.NODE_ENV === "development") {
                        const marks = performanceGetEntriesByName(markName, "mark");
                        if (marks && !marks.length) {
                            performanceMark(markName);
                        }
                    }
                },
                async () => {
                    if (await validateSingularMode(singular, app) && prevAppUnmountedDeferred) {
                        return prevAppUnmountedDeferred.promise;
                    }
                    return void 0;
                },
                // initial wrapper element before app mount/remount
                async () => {
                    appWrapperElement = initialAppWrapperElement;
                    appWrapperGetter = getAppWrapperGetter(
                        appInstanceId,
                        !!legacyRender,
                        strictStyleIsolation,
                        scopedCSS,
                        () => appWrapperElement
                    );
                },
                // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                async () => {
                    const useNewContainer = remountContainer !== initialContainer;
                    if (useNewContainer || !appWrapperElement) {
                        appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
                        syncAppWrapperElement2Sandbox(appWrapperElement);
                    }
                    render({ element: appWrapperElement, loading: true, container: remountContainer }, "mounting");
                },
                mountSandbox,
                // exec the chain after rendering to keep the behavior with beforeLoad
                async () => execHooksChain(toArray(beforeMount), app, global2),
                async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),
                // finish loading after app mounted
                async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, "mounted"),
                async () => execHooksChain(toArray(afterMount), app, global2),
                // initialize the unmount defer after app mounted and resolve the defer after it unmounted
                async () => {
                    if (await validateSingularMode(singular, app)) {
                        prevAppUnmountedDeferred = new Deferred();
                    }
                },
                async () => {
                    if (process.env.NODE_ENV === "development") {
                        const measureName = `[qiankun] App ${appInstanceId} Loading Consuming`;
                        performanceMeasure(measureName, markName);
                    }
                }
            ],
            unmount: [
                async () => execHooksChain(toArray(beforeUnmount), app, global2),
                async (props) => unmount({ ...props, container: appWrapperGetter() }),
                unmountSandbox,
                async () => execHooksChain(toArray(afterUnmount), app, global2),
                async () => {
                    render({ element: null, loading: false, container: remountContainer }, "unmounted");
                    offGlobalStateChange(appInstanceId);
                    appWrapperElement = null;
                    syncAppWrapperElement2Sandbox(appWrapperElement);
                },
                async () => {
                    if (await validateSingularMode(singular, app) && prevAppUnmountedDeferred) {
                        prevAppUnmountedDeferred.resolve();
                    }
                }
            ]
        };
        if (typeof update === "function") {
            parcelConfig.update = update;
        }
        return parcelConfig;
    };
    return parcelConfigGetter;
}
function idleCall(cb, start2) {
    cb({
        didTimeout: false,
        timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start2));
        }
    });
}
let requestIdleCallback2;
if (typeof window.requestIdleCallback !== "undefined") {
    requestIdleCallback2 = window.requestIdleCallback;
} else if (typeof window.MessageChannel !== "undefined") {
    const channel = new MessageChannel();
    const port = channel.port2;
    const tasks = [];
    channel.port1.onmessage = ({ data }) => {
        const task = tasks.shift();
        if (!task) {
            return;
        }
        idleCall(task, data.start);
    };
    requestIdleCallback2 = function(cb) {
        tasks.push(cb);
        port.postMessage({ start: Date.now() });
    };
} else {
    requestIdleCallback2 = (cb) => setTimeout(idleCall, 0, cb, Date.now());
}
const isSlowNetwork = navigator.connection ? navigator.connection.saveData || navigator.connection.type !== "wifi" && navigator.connection.type !== "ethernet" && /([23])g/.test(navigator.connection.effectiveType) : false;
function prefetch(entry, opts) {
    if (!navigator.onLine || isSlowNetwork) {
        return;
    }
    requestIdleCallback2(async () => {
        const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
        requestIdleCallback2(getExternalStyleSheets);
        requestIdleCallback2(getExternalScripts);
    });
}
function prefetchAfterFirstMounted(apps, opts) {
    window.addEventListener("single-spa:first-mount", function listener() {
        const notLoadedApps = apps.filter((app) => Ot(app.name) === l);
        if (process.env.NODE_ENV === "development") {
            const mountedApps = yt();
            console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
        }
        notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));
        window.removeEventListener("single-spa:first-mount", listener);
    });
}
function prefetchImmediately(apps, opts) {
    if (process.env.NODE_ENV === "development") {
        console.log("[qiankun] prefetch starting for apps...", apps);
    }
    apps.forEach(({ entry }) => prefetch(entry, opts));
}
function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
    const appsName2Apps = (names) => apps.filter((app) => names.includes(app.name));
    if (Array.isArray(prefetchStrategy)) {
        prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
    } else if (isFunction(prefetchStrategy)) {
        (async () => {
            const { criticalAppNames = [], minorAppsName = [] } = await prefetchStrategy(apps);
            prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
            prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
        })();
    } else {
        switch (prefetchStrategy) {
            case true:
                prefetchAfterFirstMounted(apps, importEntryOpts);
                break;
            case "all":
                prefetchImmediately(apps, importEntryOpts);
                break;
        }
    }
}
let microApps = [];
let frameworkConfiguration = {};
let started = false;
const defaultUrlRerouteOnly = true;
const frameworkStartedDefer = new Deferred();
const autoDowngradeForLowVersionBrowser = (configuration) => {
    const { sandbox = true, singular } = configuration;
    if (sandbox) {
        if (!window.Proxy) {
            console.warn("[qiankun] Missing window.Proxy, proxySandbox will degenerate into snapshotSandbox");
            if (singular === false) {
                console.warn(
                    "[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy"
                );
            }
            return { ...configuration, sandbox: typeof sandbox === "object" ? { ...sandbox, loose: true } : { loose: true } };
        }
        if (!isConstDestructAssignmentSupported() && (sandbox === true || typeof sandbox === "object" && sandbox.speedy !== false)) {
            console.warn(
                "[qiankun] Speedy mode will turn off as const destruct assignment not supported in current browser!"
            );
            return {
                ...configuration,
                sandbox: typeof sandbox === "object" ? { ...sandbox, speedy: false } : { speedy: false }
            };
        }
    }
    return configuration;
};
function registerMicroApps(apps, lifeCycles) {
    const unregisteredApps = apps.filter((app) => !microApps.some((registeredApp) => registeredApp.name === app.name));
    microApps = [...microApps, ...unregisteredApps];
    unregisteredApps.forEach((app) => {
        const { name: name2, activeRule, loader = noop, props, ...appConfig } = app;
        bt({
            name: name2,
            app: async () => {
                loader(true);
                await frameworkStartedDefer.promise;
                const { mount, ...otherMicroAppConfigs } = (await loadApp({ name: name2, props, ...appConfig }, frameworkConfiguration, lifeCycles))();
                return {
                    mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
                    ...otherMicroAppConfigs
                };
            },
            activeWhen: activeRule,
            customProps: props
        });
    });
}
const appConfigPromiseGetterMap = /* @__PURE__ */ new Map();
const containerMicroAppsMap = /* @__PURE__ */ new Map();
function loadMicroApp(app, configuration, lifeCycles) {
    const { props, name: name2 } = app;
    const container = "container" in app ? app.container : void 0;
    const containerXPath = getContainerXPath(container);
    const appContainerXPathKey = `${name2}-${containerXPath}`;
    let microApp;
    const wrapParcelConfigForRemount = (config) => {
        let microAppConfig = config;
        if (container) {
            if (containerXPath) {
                const containerMicroApps = containerMicroAppsMap.get(appContainerXPathKey);
                if (containerMicroApps == null ? void 0 : containerMicroApps.length) {
                    const mount = [
                        async () => {
                            const prevLoadMicroApps = containerMicroApps.slice(0, containerMicroApps.indexOf(microApp));
                            const prevLoadMicroAppsWhichNotBroken = prevLoadMicroApps.filter(
                                (v2) => v2.getStatus() !== "LOAD_ERROR" && v2.getStatus() !== "SKIP_BECAUSE_BROKEN"
                            );
                            await Promise.all(prevLoadMicroAppsWhichNotBroken.map((v2) => v2.unmountPromise));
                        },
                        ...toArray(microAppConfig.mount)
                    ];
                    microAppConfig = {
                        ...config,
                        mount
                    };
                }
            }
        }
        return {
            ...microAppConfig,
            // empty bootstrap hook which should not run twice while it calling from cached micro app
            bootstrap: () => Promise.resolve()
        };
    };
    const memorizedLoadingFn = async () => {
        const userConfiguration = autoDowngradeForLowVersionBrowser(
            configuration ?? { ...frameworkConfiguration, singular: false }
        );
        const { $$cacheLifecycleByAppName } = userConfiguration;
        if (container) {
            if ($$cacheLifecycleByAppName) {
                const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name2);
                if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
            }
            if (containerXPath) {
                const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(appContainerXPathKey);
                if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
            }
        }
        const parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);
        if (container) {
            if ($$cacheLifecycleByAppName) {
                appConfigPromiseGetterMap.set(name2, parcelConfigObjectGetterPromise);
            } else if (containerXPath) appConfigPromiseGetterMap.set(appContainerXPathKey, parcelConfigObjectGetterPromise);
        }
        return (await parcelConfigObjectGetterPromise)(container);
    };
    if (!started && (configuration == null ? void 0 : configuration.autoStart) !== false) {
        Bt({ urlRerouteOnly: frameworkConfiguration.urlRerouteOnly ?? defaultUrlRerouteOnly });
    }
    microApp = W(memorizedLoadingFn, { domElement: document.createElement("div"), ...props });
    if (container) {
        if (containerXPath) {
            const microAppsRef = containerMicroAppsMap.get(appContainerXPathKey) || [];
            microAppsRef.push(microApp);
            containerMicroAppsMap.set(appContainerXPathKey, microAppsRef);
            const cleanup = () => {
                const index = microAppsRef.indexOf(microApp);
                microAppsRef.splice(index, 1);
                microApp = null;
            };
            microApp.unmountPromise.then(cleanup).catch(cleanup);
        }
    }
    return microApp;
}
function start(opts = {}) {
    frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
    const { prefetch: prefetch2, urlRerouteOnly = defaultUrlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;
    if (prefetch2) {
        doPrefetchStrategy(microApps, prefetch2, importEntryOpts);
    }
    frameworkConfiguration = autoDowngradeForLowVersionBrowser(frameworkConfiguration);
    Bt({ urlRerouteOnly });
    started = true;
    frameworkStartedDefer.resolve();
}
function addGlobalUncaughtErrorHandler(errorHandler) {
    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);
}
function removeGlobalUncaughtErrorHandler(errorHandler) {
    window.removeEventListener("error", errorHandler);
    window.removeEventListener("unhandledrejection", errorHandler);
}
const firstMountLogLabel = "[qiankun] first app mounted";
if (process.env.NODE_ENV === "development") {
    console.time(firstMountLogLabel);
}
function setDefaultMountApp(defaultAppLink) {
    window.addEventListener("single-spa:no-app-change", function listener() {
        const mountedApps = yt();
        if (!mountedApps.length) {
            et(defaultAppLink);
        }
        window.removeEventListener("single-spa:no-app-change", listener);
    });
}
function runDefaultMountEffects(defaultAppLink) {
    console.warn(
        "[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead"
    );
    setDefaultMountApp(defaultAppLink);
}
function runAfterFirstMounted(effect) {
    window.addEventListener("single-spa:first-mount", function listener() {
        if (process.env.NODE_ENV === "development") {
            console.timeEnd(firstMountLogLabel);
        }
        effect();
        window.removeEventListener("single-spa:first-mount", listener);
    });
}
export {
    SandBoxType,
    getCurrentRunningApp as __internalGetCurrentRunningApp,
    a as addErrorHandler,
    addGlobalUncaughtErrorHandler,
    initGlobalState,
    loadMicroApp,
    prefetchImmediately as prefetchApps,
    registerMicroApps,
    c as removeErrorHandler,
    removeGlobalUncaughtErrorHandler,
    runAfterFirstMounted,
    runDefaultMountEffects,
    setDefaultMountApp,
    start
};
