/*
 * Created Date: 2019-08-22
 * Author: 宋慧武
 * ------
 * Last Modified: Friday 2019-08-23 16:03:48 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 */
/*
 * Created Date: 2019-08-22
 * Author: 宋慧武
 * ------
 * Last Modified: Thursday 2019-08-22 13:57:18 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import { withRouter } from "react-router";
import { Card, Alert } from "antd";
import CodeSnippet from "@/components/code-snippet";
import store from "@/store";
import { home as trackEvents } from "@/tracks";
import $log from "@/utils/logger";
import { track, inject } from "../../";

const blockShowSnippet = `
@inject({ trackEvents })
class BlockShow extends Component {
  constructor(props) {
    super(props);
    this.cardTrackRef = null;
  }

  @track("show")
  render() {
    return (
      <Card
        data-track-event="22123"
        data-track-params={Date.now()}
        ref={ref => (this.cardTrackRef = ref)}
        className="block_show__card"
      >
        <p>我想被曝光无数次</p>
      </Card>
    );
  }
}
`;

const blockShowOnceSnippet = `
@inject({ trackEvents })
class BlockShow extends Component {
  constructor(props) {
    super(props);
    this.cardTrackRef = null;
  }

  @track("show.once")
  render() {
    return (
      <Card
        data-track-event="22123"
        data-track-params={Date.now()}
        ref={ref => (this.cardTrackRef = ref)}
        className="block_show__card"
      >
        <p>我只想被曝光一次</p>
      </Card>
    );
  }
}
`;

@withRouter
@inject({ trackEvents })
class BlockShow extends Component {
  constructor(props) {
    super(props);
    this.firstCardTrackRef = null;
    this.secondCardTrackRef = null;
  }

  componentDidMount() {
    $log("页面挂载完成");
  }

  @track("show")
  render() {
    return (
      <div className="r-track">
        <p className="description">
          如果我们需要统计某个元素的曝光量，可增加修饰符show，这里以 Antd Card
          组件为例，代码如下：
        </p>
        <Card
          data-track-event="22123"
          data-track-params={Date.now()}
          ref={ref => (this.firstCardTrackRef = ref)}
          className="block_show__card"
        >
          <p>我想被曝光无数次</p>
        </Card>
        <CodeSnippet code={blockShowSnippet} lang="js"></CodeSnippet>
        <p className="description">
          如果我们只需要统计一次曝光，可增加once修饰符，代码如下：
        </p>
        <Card
          data-track-once
          data-track-event="22123"
          data-track-params={Date.now()}
          ref={ref => (this.secondCardTrackRef = ref)}
          className="block_show__card"
        >
          <p>我只想被曝光一次</p>
        </Card>
        <CodeSnippet code={blockShowOnceSnippet} lang="js"></CodeSnippet>
        <Alert
          message="区域曝光类型的埋点需要元素绑定ref属性，属性必须以TrackRef结尾，即ref={ref => (this.cardTrackRef = ref)}"
          type="warning"
        />
      </div>
    );
  }
}

export default class WithBlockShow extends Component {
  render() {
    return (
      <Provider store={store}>
        <BlockShow />
      </Provider>
    );
  }
}
