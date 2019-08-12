/*
 * Created Date: 2019-07-14
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-08-12 21:35:28 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component, Fragment } from "react";
import { Provider, inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import store from "@/store-mobx";
import { home as trackEvents } from "@/tracks";
import { track } from "../../../";

@withRouter
@inject(({ app }) => ({
  app,
  trackEvents
}))
@observer
class Detail extends Component {
  constructor(props) {
    super(props);
    this.buttonTrackRef = null;
  }

  @track("UVPV")
  @track("TONP")
  componentDidMount() {
    this.props.app.initContent("test");
    this.props.app.fetchUserInfo();
  }

  @track("show")
  render() {
    const { handleClick, date } = this.props.app;

    return (
      <Fragment>
        <div style={{ height: "1500px" }}></div>
        <button
          data-track-event="22123"
          data-track-params={`${date}`}
          ref={ref => (this.buttonTrackRef = ref)}
          onClick={e => handleClick("123", e)}
        >
          Click Mee
        </button>
        <p style={{ height: "1500px" }}>tmsp: {date}</p>
      </Fragment>
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
