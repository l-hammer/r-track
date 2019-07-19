/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 18:53:03 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import base from "./rollup.config.base";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";

const config = Object.assign({}, base, {
  output: {
    name: "RTrack",
    file: "dist/r-track.min.js",
    format: "umd"
  }
});

config.plugins = [
  ...config.plugins,
  uglify({}),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production")
  })
];

export default config;
