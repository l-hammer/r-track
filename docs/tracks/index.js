/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 17:12:49 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import "./config";
import "./udig-sdk";

const eventModules = require.context("./events", false, /\.js/);

export default eventModules.keys().reduce((events, module) => {
  return Object.assign(events, eventModules(module).default);
}, {});
