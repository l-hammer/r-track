/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable valid-typeof */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/**
 * 便于webpack打包，这是基于http://git.lianjia.com/hydra/dig-log/blob/master/static/lianjiaUlog.js修改的版本
 */
!(function(e) {
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  var t = {};
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, r) {
      n.o(e, t) ||
        Object.defineProperty(e, t, {
          configurable: !1,
          enumerable: !0,
          get: r
        });
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function(e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }),
    (n.p = ""),
    n((n.s = 0));
})([
  function(e, n, t) {
    !(function(e) {
      if (!window.$HPLOG || 1 !== window.$HPLOG.state) {
        var n = {
            add: function(e, n, t) {
              e.addEventListener
                ? e.addEventListener(n, t, !1)
                : e.attachEvent
                ? e.attachEvent("on" + n, t)
                : null === e["on" + n] && (e["on" + n] = t);
            },
            remove: function(e, n, t) {
              e.removeEventListener
                ? e.removeEventListener(n, t, !1)
                : e.dispatchEvent
                ? e.detachEvent("on" + n, t)
                : (e["on" + n] = null);
            }
          },
          t = {
            extend: function(e, n) {
              if (null === e || "object" != typeof e) return e;
              if (e.constructor !== Object && e.constructor !== Array) return e;
              if (
                e.constructor === Date ||
                e.constructor === RegExp ||
                e.constructor === Function ||
                e.constructor === String ||
                e.constructor === Number ||
                e.constructor === Boolean
              )
                return new e.constructor(e);
              n = n || new e.constructor();
              for (var r in e)
                e.hasOwnProperty(r) &&
                  (n[r] = void 0 === n[r] ? t.extend(e[r], null) : n[r]);
              return n;
            },
            getIndex: function(e, n) {
              if (n.indexOf) return n.indexOf(e);
              for (var t = 0, r = n.length; t < r; t++)
                if (n[t] === e) return t;
              return -1;
            },
            getCookie: function(e) {
              if (document.cookie.length > 0) {
                var n = document.cookie.indexOf(e + "=");
                if (-1 !== n) {
                  n = n + e.length + 1;
                  var t = document.cookie.indexOf(";", n);
                  return (
                    -1 === t && (t = document.cookie.length),
                    decodeURIComponent(document.cookie.substring(n, t))
                  );
                }
              }
              return "";
            }
          },
          r = t.extend(e, {}),
          o = {
            target: "//dig.lianjia.com/t.gif",
            autosend: !0,
            send: function(e) {
              var n = new Image(),
                t = this.target,
                r = [];
              try {
                e = encodeURIComponent(JSON.stringify(e));
              } catch (e) {}
              e && (r.push("r=" + +new Date()), r.push("d=" + e)),
                (t += "?" + r.join("&")),
                (n.onload = n.onerror = function() {
                  n = null;
                }),
                (n.src = t);
            },
            makeParam: function(e) {
              var n = {},
                o = {};
              for (var i in r)
                r.hasOwnProperty(i) &&
                  ("function" == typeof r[i] ? (o[i] = r[i]()) : (o[i] = r[i]));
              return (
                (n = t.extend(e, n)),
                (n = t.extend(o, n)),
                (n = t.extend(
                  {
                    key: window.location.href,
                    uuid: t.getCookie("lianjia_uuid"),
                    ssid: t.getCookie("lianjia_ssid")
                  },
                  n
                ))
              );
            },
            parseElement: function(e) {
              var n = e.tagName.toLowerCase(),
                r = e.className.replace(/ /g, ""),
                o = e.id;
              (r = 0 === r.length ? "" : "." + r.replace(/ /g, ".")),
                (o = 0 === o.length ? "" : "#" + o);
              var i = n + o + r;
              return {
                selector: i,
                index:
                  null === e.parentElement
                    ? 0
                    : t.getIndex(
                        e,
                        Array.prototype.slice.apply(
                          e.parentElement.querySelectorAll(i)
                        )
                      )
              };
            },
            loadTime: new Date().getTime(),
            buffer: []
          };
        window.$HPLOG &&
          1 !== typeof window.$HPLOG.state &&
          (window.$HPLOG.buffer &&
            window.$HPLOG.buffer.length > 0 &&
            (o.buffer = t.extend(window.$HPLOG.buffer, [])),
          !1 === window.$HPLOG.autosend && (o.autosend = !1),
          void 0 !== window.$HPLOG.target && (o.target = window.$HPLOG.target)),
          (window.$HPLOG = {
            send: function(e, n) {
              (n = n || {}), (n.evt = e + "");
              var r = o.makeParam(n);
              switch (n.evt) {
                case "1":
                  o.send(
                    t.extend({ cid: t.getCookie("select_city") || "" }, r)
                  );
                  break;
                case "2":
                  var i = Math.round((new Date().getTime() - o.loadTime) / 1e3);
                  o.send(t.extend({ event: "UserStay", stt: i }, r));
                  break;
                case "3":
                case "4":
                  o.send(
                    t.extend(
                      {
                        f: document.referrer || "",
                        cid: t.getCookie("select_city") || ""
                      },
                      r
                    )
                  );
                  break;
                case "1,3":
                  o.send(
                    t.extend(
                      {
                        event: "$pageview",
                        f: document.referrer || "",
                        cid: t.getCookie("select_city") || ""
                      },
                      r
                    )
                  );
                  break;
                default:
                  o.send(r);
              }
            },
            update: function(e) {
              r = t.extend(e, {});
            },
            state: 1
          });
        for (var i in o.buffer)
          if (o.buffer.hasOwnProperty(i)) {
            var a = o.buffer[i];
            "string" == typeof a
              ? window.$HPLOG.send(a)
              : window.$HPLOG.send(a[0], a[1]);
          }
        o.autosend &&
          (window.$HPLOG.send("1,3"),
          n.add(window, "beforeunload", function() {
            window.$HPLOG.send("2");
          }));
      }
    })(window.__HP__UDL_CONFIG || {});
  }
]);
