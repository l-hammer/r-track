/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-02 20:46:26 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
window.$HPLOG = window.$HPLOG || {};
window.$HPLOG.autosend = false;
window.$HPLOG.buffer = [];

if (process.env.NODE_ENV === "production") {
  window.$HPLOG.target = "//dig.lianjia.com/delta.gif";
} else {
  window.$HPLOG.target = "//test.dig.lianjia.com/delta.gif";
}

window.$HPLOG.send = function(evtid, param) {
  window.$HPLOG.buffer.push([evtid, param]);
};
