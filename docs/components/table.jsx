/*
 * Created Date: 2019-08-21
 * Author: 宋慧武
 * ------
 * Last Modified: Wednesday 2019-08-21 21:25:13 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 */
import React, { Component } from "react";

export default class Table extends Component {
  render() {
    const { data } = this.props;
    const tableData = Object.keys(data).reduce(
      // eslint-disable-next-line no-sequences
      (list, k) => (list.push({ key: k, val: data[k] }), list),
      []
    );
    const trs = tableData.map(({ key, val }) => {
      return (
        <div className="row" key={key}>
          <span className="key">{key}</span>
          <span className="val">{val}</span>
        </div>
      );
    });

    return (
      <section className="r-track-table">
        <div className="header">
          <strong className="key">key</strong>
          <strong className="val">value</strong>
        </div>
        {trs}
      </section>
    );
  }
}
