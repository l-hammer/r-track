/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 01:13:46 am
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isVisible } from "./utils/dom";
import { zipObject, vaildEvent, vaildWatchKey } from "./utils/helper";

const ONCE = "once";
const modifiers = {
  CLICK: "click",
  CLICK_AFTER: "click.after",
  ASYNC: "async",
  ASYNC_DELAY: "async.delay"
};

/**
 * @desc inject 装饰器
 * @param {Function} reaction 如果为 Mobx Class 则需要注入 mobx.reaction 来监听通过异步action 对 state 的改变
 * @param {Object} trackEvents 当前页面需要的埋点事件
 */
export const inject = (...props) => target => {
  Object.assign(target.prototype, ...props);
};

/**
 * @desc track 埋点装饰器
 * @param {String} modifier 修饰符，对应的埋点类型
 * @param {Number | String} eventId 埋点事件id
 * @param {Object} params 自定义参数，目前支持tateKey、propKey、delay、ref
 *
 * @property[stateKey] 对应组件 state 或者 mobx observable 中 key
 * @property[propKey] 对应组件 props 中 key
 * @property[delay] 埋点延迟时间
 * @property[ref] 对应 DOM 的引用，避免小于埋点延迟时间内发生DOM影藏造成埋点继续上报的问题
 */
export function track(modifier, eventId, params = {}) {
  const [mdfs] = zipObject(modifiers);

  if (!mdfs.includes(modifier.replace(/\.once/g, ""))) {
    throw new Error(`modifier '${modifier}' does not exist`);
  }

  return (_, name, descriptor) => {
    let handler;
    const { value, initializer } = descriptor;

    // 事件行为埋点
    if (modifier.includes(modifiers.CLICK)) {
      handler = function(...args) {
        let context = this;
        const isRC = this.isReactComponent; // 是否为 react 组件
        const once = modifier.includes(ONCE);
        const onceProp = `${name}_${eventId}`;
        const after = modifier.includes(modifiers.CLICK_AFTER);
        const tck = () => {
          if (this[onceProp]) return; // 如果存在once修饰符，且为true则直接返回
          vaildEvent(this.trackEvents, eventId); // 检测eventId是否合法
          isRC && (context = { ...this.state, ...this.props });
          this.trackEvents[eventId].call(null, context, ...args);
          once && (this[onceProp] = true);
        };
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const queue = after
          ? [fn, isRC ? () => this.setState({}, tck) : tck]
          : [tck, fn];

        return queue.forEach(sub => sub(...args));
      };
    }
    // 异步行为埋点
    else {
      handler = function(...args) {
        let tck;
        let context = this;
        const isRC = this.isReactComponent; // 是否为 react 组件
        const once = modifier.includes(ONCE);
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const { stateKey, propKey } = params;
        const watchPropKey = `${name}_${propKey}_${eventId}`; // 保证key的唯一性
        const watchStateKey = `${name}_${stateKey}_${eventId}`;

        vaildEvent(this.trackEvents, eventId);
        vaildWatchKey(stateKey, propKey);

        !this.tckQueue && (this.tckQueue = {}); // 在当前实例维护一个异步埋点队列
        !this.tckQueuePropKeys && (this.tckQueuePropKeys = []); //
        !this.tckQueueStateKeys && (this.tckQueueStateKeys = []); //

        if (
          modifier === modifiers.ASYNC_DELAY ||
          modifier === modifiers.ASYNC_DELAY + ".once"
        ) {
          tck = () => {
            const { delay = 0, ref } = params;
            const ele = this[ref] || document;

            this.$timer = setTimeout(() => {
              isRC && (context = { ...this.state, ...this.props });
              isVisible(ele) &&
                this.trackEvents[eventId].call(null, context, ...args);
              clearTimeout(this.$timer);
            }, delay);
          };
        } else if (
          modifier === modifiers.ASYNC ||
          modifier === modifiers.ASYNC + ".once"
        ) {
          tck = () => {
            isRC && (context = { ...this.state, ...this.props });
            if (propKey && this[`${watchPropKey}_${ONCE}`]) return;
            if (stateKey && this[`${watchStateKey}_${ONCE}`]) return;
            this.trackEvents[eventId].call(null, context, ...args);
            once && propKey && (this[`${watchPropKey}_${ONCE}`] = true);
            once && stateKey && (this[`${watchStateKey}_${ONCE}`] = true);
          };
        }

        propKey &&
          (this.tckQueue[watchPropKey] = [tck]) &&
          this.tckQueuePropKeys.push(watchPropKey);
        stateKey &&
          (this.tckQueue[watchStateKey] = [tck]) &&
          this.tckQueueStateKeys.push(watchStateKey);

        if (isRC && !this.getSnapshotBeforeUpdate) {
          this.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            Object.keys(this.tckQueue).forEach(watchKey => {
              let oldVal, newVal, cbks, key;

              if (this.tckQueuePropKeys.includes(watchKey)) {
                key = watchKey.split("_")[1];
                newVal = this.props[key];
                oldVal = prevProps[key];
                cbks = this.tckQueue[watchKey];
              }
              if (this.tckQueueStateKeys.includes(watchKey)) {
                key = watchKey.split("_")[1];
                newVal = this.state[key];
                oldVal = prevState[key];
                cbks = this.tckQueue[watchKey];
              }
              oldVal !== newVal && cbks.forEach(sub => sub && sub());
            });
            return null;
          };
        } else {
          if (this.reaction) {
            const cbks = this.tckQueue[watchStateKey];
            const disposer = this.reaction(
              () => this[stateKey],
              () => {
                cbks.forEach(sub => sub && sub());
                disposer();
              }
            );
          }
        }
        return fn(...args);
      };
    }

    if (value) {
      descriptor.value = function(...args) {
        return handler.apply(this, args);
      };
    }
    // 兼容箭头函数 https://github.com/MuYunyun/diana/issues/7
    if (initializer) {
      descriptor.initializer = function() {
        return handler;
      };
    }
  };
}
