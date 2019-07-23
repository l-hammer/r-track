/*
 * Created Date: 2019-07-22
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-23 11:54:20 am
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isFun } from "./helper";

/**
 * @desc chenck 埋点ID是否合法
 *
 * @param {Object} events 当前模块的所有埋点
 * @param {Object} eventId 埋点事件id
 */
export const vaildEvent = (events, eventId) => {
  if (!isFun(events[eventId])) {
    throw new Error(`track eventId '${eventId}' does not exist`);
  }
};

/**
 * @desc check 异步埋点监听key是否存在
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
export const vaildRC = isRC => {
  if (!isRC) {
    throw new Error(`The current instance is not a react component`);
  } else {
    return isRC;
  }
};
