/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 20:17:41 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs()
  ]
};
