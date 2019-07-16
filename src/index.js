/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-16 11:10:24 am
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isVisible } from "./utils/dom";
import {
  zipObject,
  vaildEvent,
  vaildWatchKey,
  vaildReactComponent,
  clearTimeoutQueue
} from "./utils/helper";

const ONCE = "once";
const modifiers = {
  UVPV: "UVPV", // 特殊的修饰符
  TONP: "TONP", // 特殊的修饰符，表示页面停留时长
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
    // 页面初始化埋点
    if (modifier.includes(modifiers.UVPV)) {
      handler = function(...args) {
        vaildReactComponent(this.isReactComponent);

        const evts = this.trackEvents || this.props.trackEvents;
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const tck = () => {
          const context = { ...this.state, ...this.props };
          evts[modifier].call(null, context, ...args);
        };

        return [tck, fn].forEach(sub => sub(...args));
      };
    }
    // 设置进入页面时间
    else if (modifier.includes(modifiers.TONP)) {
      handler = function(...args) {
        const isRC = vaildReactComponent(this.isReactComponent); // 是否为 react 组件
        const evts = this.trackEvents || this.props.trackEvents;
        const tck = () => {
          const stt = Date.now() - this.__trackPageEntryTime;
          const context = { ...this.state, ...this.props };

          evts[modifier].call(null, context, { stt });
        };

        this.__trackPageEntryTime = Date.now();
        // 页面卸载前上报埋点
        if (isRC && !this.componentWillUnmount) {
          this.needMergeTONPWillUnmount = false;
          this.componentWillUnmount = () => tck();
        } else if (
          this.componentWillUnmount &&
          this.needMergeTONPWillUnmount !== false
        ) {
          const willUnmountRef = this.componentWillUnmount;

          this.componentWillUnmount = () => {
            willUnmountRef.apply(this);
            tck();
          };
        }

        return value
          ? value.apply(this, args)
          : initializer.apply(this, args)(...args);
      };
    }
    // 事件行为埋点
    else if (modifier.includes(modifiers.CLICK)) {
      handler = function(...args) {
        let context = this;
        const isRC = this.isReactComponent; // 是否为 react 组件
        const evts = this.trackEvents || this.props.trackEvents;
        const once = modifier.includes(ONCE);
        const onceProp = `${name}_${eventId}`;
        const after = modifier.includes(modifiers.CLICK_AFTER);
        const tck = () => {
          if (this[onceProp]) return; // 如果存在once修饰符，且为true则直接返回
          vaildEvent(evts, eventId); // 检测eventId是否合法
          isRC && (context = { ...this.state, ...this.props });
          evts[eventId].call(null, context, ...args);
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
        const evts = this.trackEvents || this.props.trackEvents;
        const once = modifier.includes(ONCE);
        const fn = value ? value.bind(this) : initializer.apply(this, args);
        const { stateKey, propKey } = params;
        const watchPropKey = `${name}_${propKey}_${eventId}`; // 保证key的唯一性
        const watchStateKey = `${name}_${stateKey}_${eventId}`;

        vaildEvent(evts, eventId);
        vaildWatchKey(stateKey, propKey);

        !this.tckQueue && (this.tckQueue = {}); // 在当前实例维护一个异步埋点队列
        !this.tckQueuePropKeys && (this.tckQueuePropKeys = []); //
        !this.tckQueueStateKeys && (this.tckQueueStateKeys = []); //

        if (
          modifier === modifiers.ASYNC_DELAY ||
          modifier === modifiers.ASYNC_DELAY + ".once"
        ) {
          !this.tckTimerQueue && (this.tckTimerQueue = {}); // 定时器队列
          tck = () => {
            const { delay = 0, ref } = params;
            const ele = this[ref] || document;
            const timer = this.tckTimerQueue[eventId];

            timer && clearTimeout(timer);
            this.tckTimerQueue[eventId] = setTimeout(() => {
              isRC && (context = { ...this.state, ...this.props });
              isVisible(ele) && evts[eventId].call(null, context, ...args);
              clearTimeout(this.tckTimerQueue[eventId]);
            }, delay);
          };

          // 页面卸载时清除进行中的定时器
          if (isRC && !this.componentWillUnmount) {
            this.needMergeWillUnmount = false;
            this.componentWillUnmount = () => {
              clearTimeoutQueue(this.tckTimerQueue);
            };
          } else if (
            this.componentWillUnmount &&
            this.needMergeWillUnmount !== false
          ) {
            const willUnmountRef = this.componentWillUnmount;
            this.componentWillUnmount = () => {
              willUnmountRef.apply(this);
              clearTimeoutQueue(this.tckTimerQueue);
            };
          }
        } else if (
          modifier === modifiers.ASYNC ||
          modifier === modifiers.ASYNC + ".once"
        ) {
          tck = () => {
            isRC && (context = { ...this.state, ...this.props });
            if (propKey && this[`${watchPropKey}_${ONCE}`]) return;
            if (stateKey && this[`${watchStateKey}_${ONCE}`]) return;
            evts[eventId].call(null, context, ...args);
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

        const diffValDispatch = (prevProps, prevState) => {
          Object.keys(this.tckQueue).forEach(watchKey => {
            let oldVal, newVal, key;

            key = watchKey.split("_")[1];
            if (this.tckQueuePropKeys.includes(watchKey)) {
              newVal = this.props[key];
              oldVal = prevProps[key];
            }
            if (this.tckQueueStateKeys.includes(watchKey)) {
              newVal = this.state[key];
              oldVal = prevState[key];
            }
            if (oldVal !== newVal) {
              this.tckQueue[watchKey].forEach(sub => sub && sub());
              this.tckQueue[watchKey] = []; // 清空当前watch的埋点队列
            }
          });
        };
        // 通过 react 生命周期函数 getSnapshotBeforeUpdate diff 值的变化控制埋点的上报
        if (isRC && !this.getSnapshotBeforeUpdate) {
          this.needMergeSnapshotBeforeUpdate = false;
          this.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            diffValDispatch(prevProps, prevState);
            return null;
          };
        } else if (
          this.getSnapshotBeforeUpdate &&
          this.needMergeSnapshotBeforeUpdate !== false
        ) {
          const snapshotBeforeUpdate = this.getSnapshotBeforeUpdate;

          this.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            diffValDispatch(prevProps, prevState);
            return snapshotBeforeUpdate.call(this, prevProps, prevState);
          };
        } else if (!isRC && this.reaction) {
          const cbks = this.tckQueue[watchStateKey];
          const disposer = this.reaction(
            () => this[stateKey],
            () => {
              cbks.forEach(sub => sub && sub());
              disposer();
            }
          );
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
        return handler.bind(this);
      };
    }
  };
}
