/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-09 17:03:00 pm
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
  22122(context, val) {
    console.log('-=-=-=-', context.state.rest, val);
  }
};
