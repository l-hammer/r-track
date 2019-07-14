/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 22:56:22 pm
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
 * @desc chenck 埋点ID是否合法
 *
 * @param {Object} value
 */
export const vaildEvent = (events, eventId) => {
  if (!isFun(events[eventId])) {
    throw new Error(`track eventId '${eventId}' does not exist`);
  }
};

/**
 * @desc check 异步埋点监听key是否存在
 *
 * @param {Object} value
 */
export const vaildWatchKey = (stateKey, propKey) => {
  if (!stateKey && !propKey) {
    throw new Error(
      `Missing arguments.{stateKey} or arguments.{propKey} in async track`
    );
  }
};

/**
 * @desc check 当前实例是否为react组件
 */
export const vaildReactComponent = isRC => {
  if (!isRC) {
    throw new Error(
      `Missing arguments.{stateKey} or arguments.{propKey} in async track`
    );
  } else {
    return isRC;
  }
};

/**
 * @desc 清除定时器
 */
export const clearTimeoutQueue = (queue = []) => {
  Object.keys(queue).forEach(timer => {
    clearTimeout(queue[timer]);
  });
};
