/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Saturday 2019-07-13 12:25:27 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isVisible } from "./utils/dom";
import { zipObject, vaildEvent, vaildWatchKey } from "./utils/helper";

const ONCE = 'once';
const modifiers = {
  CLICK: "click",
  CLICK_AFTER: "click.after",
  ASYNC: "async",
  ASYNC_DELAY: "async.delay",
};

export function track(modifier, eventId, params = {}) {
  const [mdfs] = zipObject(modifiers);

  if (!mdfs.includes(modifier.replace(/\.once/g, ''))) {
    throw new Error(`modifier '${modifier}' does not exist`);
  }

  return (target, name, descriptor) => {
    let handler;
    const { value, initializer } = descriptor;

    // 如果在React组件中使用
    if (target.isReactComponent){

    }
  
    // 如果在Mobx中使用
    if (target.isReactComponent){

    }

    // 事件行为埋点
    if (modifier.includes(modifiers.CLICK)) {
      handler = function(...args) {
        const once = modifier.includes(ONCE);
        const onceProp = `${name}_${eventId}`;
        const after = modifier.includes(modifiers.CLICK_AFTER);
        const tck = () => {
          if (this[onceProp]) return; // 如果存在once修饰符，且为true则直接返回
          vaildEvent(this.context, eventId); // 检测eventId是否合法
          this.context[eventId].call(null, this, ...args);
          once && (this[onceProp] = true);
        };
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const queue = after ? [fn, () => this.setState({}, tck)] : [tck, fn];

        return queue.forEach(sub => sub(...args));
      }
    }
    // 异步行为埋点
    else {
      handler = function(...args) {
        let tck;
        const once = modifier.includes(ONCE);
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const { stateKey, propKey } = params;
        const watchPropKey = `${name}_${propKey}_${eventId}`; // 保证key的唯一性
        const watchStateKey = `${name}_${stateKey}_${eventId}`;

        vaildEvent(this.context, eventId);
        vaildWatchKey(stateKey, propKey);

        !this.tckQueue && (this.tckQueue = {}); // 在当前实例维护一个异步埋点队列
        !this.propQueueKeys && (this.propQueueKeys = []); //
        !this.stateQueueKeys && (this.stateQueueKeys = []); //

        if (modifier === modifiers.ASYNC_DELAY || modifier === modifiers.ASYNC_DELAY + ".once") {
          tck = () => {
            const { delay = 0, ref } = params;
            const ele = this[ref] || document;

            this.$timer = setTimeout(() => {
              isVisible(ele) && this.context[eventId].call(null, this, ...args);
              clearTimeout(this.$timer);
            }, delay);
          };
        } else if (modifier === modifiers.ASYNC || modifier === modifiers.ASYNC + ".once") {
          tck = () => {
            // console.log('当前的修饰符', modifier, once, propKey, stateKey)
            if (propKey && this[`${watchPropKey}_${ONCE}`]) return;
            if (stateKey && this[`${watchStateKey}_${ONCE}`]) return;
            this.context[eventId].call(null, this, ...args);
            once && propKey && (this[`${watchPropKey}_${ONCE}`] = true);
            once && stateKey && (this[`${watchStateKey}_${ONCE}`] = true);
          };
        }

        propKey && (this.tckQueue[watchPropKey] = [tck]) && this.propQueueKeys.push(watchPropKey);
        stateKey && (this.tckQueue[watchStateKey] = [tck]) && this.stateQueueKeys.push(watchStateKey);
        // console.log('namename', name)
        // console.log(this.tckQueue, tck);

        if (!this.getSnapshotBeforeUpdate) {
          this.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            Object.keys(this.tckQueue).forEach(watchKey => {
              let oldVal, newVal, cbks, key;

              if (this.propQueueKeys.includes(watchKey)) {
                key = watchKey.split("_")[1];
                newVal = this.props[key];
                oldVal = prevProps[key];
                cbks = this.tckQueue[watchKey];
              }
              if (this.stateQueueKeys.includes(watchKey)) {
                key = watchKey.split("_")[1];
                newVal = this.state[key];
                oldVal = prevState[key];
                cbks = this.tckQueue[watchKey];
              }
              oldVal !== newVal && cbks.forEach(sub => sub && sub());
            })
            return true;
          }
        }
        return fn(...args);
      }
    }

    if (value) {
      descriptor.value = function(...args) {
        return handler.apply(this, args);
      }
    }
    // 兼容箭头函数 https://github.com/MuYunyun/diana/issues/7
    if (initializer) {
      descriptor.initializer = function() {
        return handler;
      }
    }
  }
}
