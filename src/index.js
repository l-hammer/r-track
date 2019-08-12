/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-08-12 21:46:20 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isElement, isVisible } from "./utils/dom";
import { isObject, zipObject, clearTimeoutQueue } from "./utils/helper";
import { vaildEvent, vaildRC } from "./utils/error";
import VisMonitor from "./utils/vis-monitor";

const ONCE = "once";
const modifiers = {
  UVPV: "UVPV", // 特殊的修饰符
  TONP: "TONP", // 特殊的修饰符，表示页面停留时长
  TRIGGER: "trigger",
  TRIGGER_AFTER: "trigger.after",
  ASYNC: "async",
  ASYNC_DELAY: "async.delay",
  SHOW: "show"
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

  // 获取模块对应的埋点的适配器
  function getTrackEvents(ctx) {
    return ctx.trackEvents || ctx.props.trackEvents;
  }

  // 当前实例是否为react class组件
  function checkRC(ctx) {
    return ctx.isReactComponent;
  }

  // 生成唯一的once标记属性
  function createOnceProp(name, eventId) {
    return `${name}_${eventId}_${ONCE}`;
  }

  // 描述符value适配器
  function valueAdapter(ctx, value, initializer, args) {
    if (value) {
      return value.bind(ctx);
    }
    if (initializer) {
      return initializer.apply(ctx, args);
    }
  }

  // 生成不同队列，即value执行前的值
  function queueAdapter(ctx, fn, tck, ops) {
    if (ops.after) {
      return [fn, ops.isRC ? () => ctx.setState({}, tck) : tck];
    } else {
      return [tck, fn];
    }
  }

  if (!mdfs.includes(modifier.replace(/\.once/g, ""))) {
    throw new Error(`modifier '${modifier}' does not exist`);
  }
  return (_, name, descriptor) => {
    let handler;
    const { value, initializer } = descriptor;
    // 页面初始化埋点
    if (modifier.includes(modifiers.UVPV)) {
      handler = function(...args) {
        vaildRC(this.isReactComponent);

        const evts = getTrackEvents(this);
        const fn = valueAdapter(this, value, initializer, args);
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
        const isRC = vaildRC(this.isReactComponent); // 是否为 react 组件
        const evts = getTrackEvents(this);
        const tck = () => {
          const stt = Date.now() - this.__trackPageEntryTime;
          const context = { ...this.state, ...this.props };

          evts[modifier].call(null, context, { stt });
        };

        this.__trackPageEntryTime = Date.now();
        // 页面卸载前上报埋点
        if (isRC && !this.componentWillUnmount) {
          this.$needMergeTONPWillUnmount = false;
          this.componentWillUnmount = () => tck();
        } else if (
          this.componentWillUnmount &&
          this.$needMergeTONPWillUnmount !== false
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
    // 区域曝光埋点
    else if (modifier.includes(modifiers.SHOW)) {
      handler = function(...args) {
        const isRC = vaildRC(this.isReactComponent); // 是否为 react 组件
        const evts = getTrackEvents(this);

        function tck(event, params) {
          const context = { ...this.state, ...this.props };

          evts[event].call(null, context, params);
        }
        // 绑定滚动监听器
        function visMonitor() {
          const props = Object.keys(this).filter(k => isObject(this[k]));

          props.forEach(prop => {
            const ele = this[prop].current || this[prop];
            if (/TrackRef$/.test(prop) && isElement(ele) && !ele.$visMonitor) {
              const vm = new VisMonitor(ele);
              const { trackOnce, trackEvent, trackParams } = ele.dataset;

              (trackOnce ? vm.$once : vm.$on).call(
                vm,
                "fullyvisible",
                tck.bind(this, trackEvent, trackParams)
              );
              ele.$visMonitor = vm;
            }
          });
        }

        // 只执行一次
        if (isRC && !this.$isMounted) {
          const didMountRef = this.componentDidMount;

          this.componentDidMount = () => {
            didMountRef && didMountRef.apply(this);
            this.$isMounted = true; // 编辑是否已经挂载
            visMonitor.apply(this);
          };
        }
        // DOM update 更新滚动监听器
        if (isRC && !this.componentDidUpdate) {
          this.$needMergeSHOWDidUpdate = false;
          this.componentDidUpdate = () => visMonitor.apply(this);
        } else if (
          this.componentDidUpdate &&
          this.$needMergeSHOWDidUpdate !== false
        ) {
          this.$didUpdateHookRef =
            this.$didUpdateHookRef || this.componentDidUpdate;
          this.componentDidUpdate = () => {
            this.$didUpdateHookRef.apply(this);
            visMonitor.apply(this);
          };
        }
        return value.apply(this, args);
      };
    }
    // 事件行为埋点(支持同步、异步)
    else if (
      (modifier.includes(modifiers.TRIGGER) ||
        modifier.includes(modifiers.ASYNC)) &&
      (!params.stateKey && !params.propKey)
    ) {
      handler = function(...args) {
        let tck;
        let context = this;
        const isRC = checkRC(this); // 是否为 react 组件
        const evts = getTrackEvents(this);
        const onceProp = createOnceProp(name, eventId);
        const fn = valueAdapter(this, value, initializer, args);
        const after =
          modifier.includes(modifiers.TRIGGER_AFTER) ||
          modifier.includes(modifiers.ASYNC);

        tck = () => {
          if (this[onceProp]) return; // 如果存在once修饰符，且为true则直接返回
          vaildEvent(evts, eventId); // 检测eventId是否合法
          isRC && (context = { ...this.state, ...this.props });
          evts[eventId].call(null, context, ...args);
          modifier.includes(ONCE) && (this[onceProp] = true);
        };

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
            this.$needMergeWillUnmount = false;
            this.componentWillUnmount = () => {
              clearTimeoutQueue(this.tckTimerQueue);
            };
          } else if (
            this.componentWillUnmount &&
            this.$needMergeWillUnmount !== false
          ) {
            const willUnmountRef = this.componentWillUnmount;
            this.componentWillUnmount = () => {
              willUnmountRef.apply(this);
              clearTimeoutQueue(this.tckTimerQueue);
            };
          }
        }

        const queue = queueAdapter(this, fn, tck, { isRC, after });

        if (modifier.includes(modifiers.ASYNC)) {
          // 异步
          return (async () => {
            for (const iter of queue) {
              await iter(...args);
            }
          })();
        } else {
          // 同步
          return queue.forEach(sub => sub(...args));
        }
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
