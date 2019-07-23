/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-22 17:44:20 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
/**
 * @desc 获取对象的键值
 *
 * @param {Object} value
 * @returns {Array} [keys, values]
 */
export function zipObject(value) {
  return [Object.values(value), Object.keys(value)];
}

/**
 * @desc 判断给定变量是否为一个函数
 *
 * @param {*} v
 * @return {Boolean}
 */
export const isFun = v => typeof v === "function" || false;

/**
 * @desc 清除定时器
 */
export const clearTimeoutQueue = (queue = []) => {
  Object.keys(queue).forEach(timer => {
    clearTimeout(queue[timer]);
  });
};
