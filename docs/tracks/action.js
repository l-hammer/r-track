/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 17:44:56 pm
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
/**
 * @desc 模拟埋点Action
 */
export default function trackAction(evt, addtional = {}) {
  const data = {
    evt,
    ...addtional,
    action_time: format(Date.now())
  };

  $log(data);
}
