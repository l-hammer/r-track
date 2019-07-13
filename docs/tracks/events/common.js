/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Saturday 2019-07-13 18:18:48 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import trackAction from "../action";

export default {
  /**
   * UP、PV埋点
   */
  UVPV() {
    trackAction("1,3");
  },
  /**
   * 页面停留时间埋点（Time on Page）
   * @param {String} stt 进入页面时长，单位为秒
   */
  TONP({ stt }) {
    trackAction("2", { stt });
  },
  22120(context) {
    console.log("上报22120埋点", context.userInfo);
    console.log("------------------------------------");
  },
  22121(context, val) {
    console.log("上报22121埋点", context.date, val);
    console.log("------------------------------------");
  },
  22122(context, val) {
    console.log("上报22122埋点", context.content, val);
    console.log("------------------------------------");
  }
};
