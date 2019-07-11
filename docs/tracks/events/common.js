/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Thursday 2019-07-11 23:57:02 pm
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
    console.log('上报22120埋点', context.props.userInfo);
    console.log('------------------------------------');
  },
  22121(context, val) {
    console.log('上报22121埋点', context.state.target, val);
    console.log('------------------------------------');
  },
  22122(context, val) {
    console.log('上报22122埋点', context.state.rest, val);
    console.log('------------------------------------');
  }
};
