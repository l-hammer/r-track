/*
 * Created Date: 2019-07-14
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-08-19 18:38:10 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
module.exports = {
  presets: ["react-app"],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "lib",
        style: "css"
      }
    ]
  ]
};
