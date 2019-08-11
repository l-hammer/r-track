/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-08-11 18:54:33 pm
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

/**
 * @desc 防抖函数，至少间隔200毫秒执行一次
 *
 * @param {Function} fn callback
 * @param {Number} [ms=200] 默认200毫秒
 * @returns {Function}
 */
export function debounce(fn, ms = 200) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}
