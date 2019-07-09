/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 22:45:35 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { format } from "@/utils/date";
import $log from "@/utils/logger";
/**
 * 埋点Action
 *
 * @description 埋点参数包括 基本参数 和 行为参数
 * @param {Object} action 行为参数
 * @param {Object} other 基本参数 一般不需要传此参数
 */
export default function trackAction(evt, actionsAddtion, addtional = {}) {
  try {
    window.$HPLOG.send(evt, {
      action: {
        time: format(Date.now()),
        ...actionsAddtion
      },
      pid: "crm_m_cservice",
      event: "mElementClick", // 默认类型
      ...addtional
    });
  } catch (error) {
    $log.error(error);
  }
}
