/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-07-08 22:51:07 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { format } from "./date";

const logger = console;
const message = () => format(Date.now());

const $log = rest => {
  logger.log(
    `%c ${message()} 小贝SDK`,
    "color: #03A9F4; font-weight: bold",
    rest
  );
};

$log.error = rest => {
  logger.log(
    `%c ${message()} 小贝SDK`,
    "color: #F56C6C; font-weight: bold",
    rest
  );
  return Promise.reject(rest);
};

export default $log;
