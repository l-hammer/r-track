/*
 * Created Date: 2019-07-14
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 21:40:53 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component } from "react";
import { Provider, inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import store from "@/store-mobx";
import trackEvents from "@/tracks";
import { track } from "../../../";

@withRouter
@observer
@inject(({ app }) => ({
  app,
  trackEvents
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = null;
  }

  @track("UVPV")
  @track("TONP")
  componentDidMount() {
    this.props.app.initContent("test");
    this.props.app.fetchUserInfo();
  }

  render() {
    const { handleClick } = this.props.app;

    return (
      <button
        ref={ref => (this.buttonRef = ref)}
        onClick={e => handleClick("123", e)}
      >
        Click Mee
      </button>
    );
  }
}

export default class WrapDetail extends Component {
  render() {
    return (
      <Provider {...store}>
        <Detail />
      </Provider>
    );
  }
}
