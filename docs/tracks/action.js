/*
 * Created Date: 2019-06-19
 * Author: 宋慧武
 * ------
 * Last Modified: Wednesday 2019-08-21 21:20:50 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React from "react";
import { notification } from "antd";
import { format } from "@/utils/date";
import $log from "@/utils/logger";
import Table from "@/components/table";

/**
 * 埋点Action
 *
 * @description 埋点参数包括 基本参数 和 行为参数
 * @param {Object} action 行为参数
 * @param {Object} other 基本参数 一般不需要传此参数
 */
/**
 * @desc 模拟埋点Action
 */
export default function trackAction(evt, addtional = {}) {
  const data = {
    evt,
    ...addtional,
    action_time: format(Date.now())
  };

  $log(data);
  notification.success({
    message: "上报数据如下：",
    description: <Table data={data}></Table>
  });
}
