/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-15 14:56:34 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
// const eventModules = require.context("./events", false, /\.js/);

// export default eventModules.keys().reduce((events, module) => {
//   const prop = /[^(./)?][\w|\W]*[^(.js)?]/.exec(module)[0];

//   events[prop] = eventModules(module).default;
//   return events;
// }, {});

export { default as home } from "./events/home";
