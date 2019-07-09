/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-09 18:18:24 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { isVisible } from "./utils/dom";

export function track(modifier, eventId, params) {
  switch (modifier) {
    case "click":
      return (_, name, descriptor) => {
        console.log(name, eventId, descriptor)
        const { value, initializer } = descriptor;
        const handler = function(...args) {
          const tck = this.context[eventId].bind(null, this, ...args);
          const fn = value ? value.bind(this) : initializer.apply(this, args);

          return [tck, fn].forEach(sub => sub(...args));
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
    case "click.delay":
      return (_, name, descriptor) => {
        console.log(name, eventId, descriptor)
        const { value, initializer } = descriptor;
        const handler = function(...args) {
          const tck = this.context[eventId].bind(null, this, ...args);
          const fn = value ? value.bind(this) : initializer.apply(this, args);

          return [fn, tck].forEach(sub => sub(...args));
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
    case "async":
      return (_, name, descriptor) => {
        console.log(name, eventId, descriptor)
        const { value, initializer } = descriptor;
        const handler = function(...args) {
          const tck = this.context[eventId].bind(null, this, ...args);
          const fn = value ? value.bind(this) : initializer.apply(this, args);

          this.updateState = (...subargs) => {
            this.setState(...subargs)
            this.setState(() => {}, () => tck(...args))
          }

          return fn(...args);
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
    case "async.delay":
      return (_, name, descriptor) => {
        console.log(name, eventId, descriptor)
        const { delay, ref } = params;
        const { value, initializer } = descriptor;
        const handler = function(...args) {
          const fn = value ? value.bind(this) : initializer.apply(this, args);
          const tck = () => {
            this.$timer && clearTimeout(this.$timer);
            this.$timer = setTimeout(() => {
              const visible = isVisible(this[ref]);

              visible && this.context[eventId].call(null, this, ...args);
            }, delay);
          };

          this.updateState = (...subargs) => {
            this.setState(...subargs)
            this.setState(() => {}, tck)
          }

          return fn(...args);
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
    default:
      break;
  }
}
