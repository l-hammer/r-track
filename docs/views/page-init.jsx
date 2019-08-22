/*
 * Created Date: 2019-08-22
 * Author: 宋慧武
 * ------
 * Last Modified: Thursday 2019-08-22 16:49:55 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 */
/*
 * Created Date: 2019-08-21
 * Author: 宋慧武
 * ------
 * Last Modified: Wednesday 2019-08-21 22:17:01 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { withRouter } from "react-router";
import { message, Alert } from "antd";
import CodeSnippet from "@/components/code-snippet";
import store from "@/store";
import { home as trackEvents } from "@/tracks";
import $log from "@/utils/logger";
import { track, inject } from "../../";

const UVPVTONPSnippet = `
@inject({ trackEvents })
class Home extends Component {
  ...
  @track("UVPV")
  @track("TONP")
  componentDidMount() {
    ...
  }
  ...
}
`;

const ASYNCDELAYSnippet = `
@inject({ trackEvents })
class Home extends Component {
  state = {
    content: null
  };

  @track("async.delay", 22122, { delay: 3000 })
  initContent = async val => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 300);
    });

    this.setState({
      content: response.data
    });
  };
  ...
}
`;

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  };
}

@withRouter
@connect(mapStateToProps)
@inject({ trackEvents })
class Trigger extends Component {
  state = {
    content: null
  };

  @track("UVPV")
  @track("TONP")
  componentDidMount() {
    message.success("页面挂载完成，发送UPPV埋点");
    this.initContent("一个页面延迟3s埋点");
  }

  @track("async.delay", 22122, { delay: 3000 })
  initContent = async val => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 300);
    });

    $log("initContent 方法正常执行。并受到参数：", val);
    this.setState({
      content: response.data
    });
  };

  componentWillUnmount() {
    message.success("页面即将销毁，发送TONP埋点");
  }

  render() {
    return (
      <div className="r-track">
        <p className="description">
          如果我们需要统计当前模块（页面）的UV、PV、TONP（页面停留时长）埋点，示例如下：
        </p>
        <CodeSnippet code={UVPVTONPSnippet} lang="js"></CodeSnippet>
        <Alert
          message="UVPV、TONP 应该装饰componentDidMount，因为需要在页面挂载完成及页面离开之后上报对应的埋点。"
          type="warning"
        />
        <p className="description">
          如果我们需要在页面初始化3s之后上报埋点，可增加delay修饰符，示例如下：
        </p>
        <CodeSnippet code={ASYNCDELAYSnippet} lang="js"></CodeSnippet>
        <Alert
          message="async.delay 建议装饰 class component 的方法，因为我们需要在页面销毁的时候及时清除定时器"
          type="warning"
        />
      </div>
    );
  }
}

export default class WithTrigger extends Component {
  render() {
    return (
      <Provider store={store}>
        <Trigger />
      </Provider>
    );
  }
}
