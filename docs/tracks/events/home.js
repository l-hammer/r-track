/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Wednesday 2019-08-21 21:28:11 pm
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
   * @param {String} stt 进入页面时长，单位为毫秒
   */
  TONP(_, { stt }) {
    trackAction("2", { stt });
  },
  22120({ userInfo }) {
    trackAction("22120", {
      userInfo: JSON.stringify(userInfo)
    });
  },
  22121(context, val) {
    trackAction("22121", {
      tamp: context.date,
      param: val
    });
  },
  22122(context, val) {
    trackAction("22122", {
      content: context.content,
      param: val
    });
  },
  22123(_, val) {
    trackAction("22123", {
      param: val
    });
  }
};
