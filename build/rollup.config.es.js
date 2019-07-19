/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 18:53:09 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import base from "./rollup.config.base";

const config = Object.assign({}, base, {
  output: {
    name: "r-track",
    file: "dist/r-track.esm.js",
    format: "es"
  }
});

export default config;
