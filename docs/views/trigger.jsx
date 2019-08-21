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
import { Button, message, Alert } from "antd";
import CodeSnippet from "@/components/code-snippet";
import store from "@/store";
import { home as trackEvents } from "@/tracks";
import $log from "@/utils/logger";
import { track, inject } from "../../";

const triggerSnippet = `
@inject({ trackEvents })
class Home extends Component {
  state = {
    date: Date.now(),
  };

  @track("trigger", 22121)
  handleClick(val, e) {
    this.setState({ date: Date.now() });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this, "button")}>Click Me</button>
    );
  }
}
`;

const triggerAfterSnippet = `
@inject({ trackEvents })
class Home extends Component {
  state = {
    date: Date.now(),
  };

  @track("trigger.after", 22121)
  handleClick(val, e) {
    this.setState({ date: Date.now() });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this, "button")}>Click Me</button>
    );
  }
}
`;

const triggerAsyncSnippet = `
@inject({ trackEvents })
class Home extends Component {
  state = {
    date: Date.now(),
  };

  @track("async", 22121)
  handleClick(val, e) {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ date: Date.now() });
      }, 300);
    });

    this.setState({ date: response.date });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this, "button")}>Click Me</button>
    );
  }
}
`;

const triggerAsyncActionSnippet = `
@inject({ trackEvents })
class Home extends Component {
  ...
  @track("async", 22120)
  getUserInfo = async () => {
    await this.props.dispatch(fetchUserInfo());
  };
  ...
}
`;

const triggerAsyncOnceSnippet = `
@inject({ trackEvents })
class Home extends Component {
  state = {
    date: Date.now(),
  };

  @track("async.once", 22121)
  handleClick(val, e) {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ date: Date.now() });
      }, 300);
    });

    this.setState({ date: response.date });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this, "button")}>Click Me</button>
    );
  }
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
  constructor(props) {
    super(props);
    this.buttonRef = null;
    this.state = {
      date: null,
      target: null,
      content: null
    };
  }

  @track("trigger", 22121)
  handleClick(val, e) {
    $log("handleClick 方法正常执行。并收到参数：", val, e.target);
    message.success("handleClick 方法正常执行");
    this.setState({
      date: Date.now(),
      target: e.target
    });
  }

  @track("trigger.after", 22121)
  handleClick2(val, e) {
    $log("handleClick 方法正常执行。并收到参数：", val, e.target);
    message.success("handleClick 方法正常执行");
    this.setState({
      date: Date.now(),
      target: e.target
    });
  }

  // @track("async.once", 22121)
  @track("async", 22121)
  handleClick3 = async (val, e) => {
    e.persist();
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ date: Date.now() });
      }, 300);
    });
    $log(
      "异步 handleClick 方法正常执行。并受到参数：",
      val,
      e.target,
      response.date
    );
    message.success("异步 handleClick 方法正常执行");
    this.setState({
      date: response.date,
      target: e.target
    });
  };

  @track("async.once", 22121)
  handleClick4 = async (val, e) => {
    e.persist();
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ date: Date.now() });
      }, 300);
    });
    $log(
      "异步 handleClick 方法正常执行。并受到参数：",
      val,
      e.target,
      response.date
    );
    message.success("异步 handleClick 方法正常执行");
    this.setState({
      date: response.date,
      target: e.target
    });
  };

  render() {
    return (
      <div className="trigger-track">
        <p className="description">
          假如我们需要在点击button时上报id为22121的埋点，示例如下：
        </p>
        <Button
          type="primary"
          onClick={this.handleClick.bind(this, "first button")}
        >
          Click Me
        </Button>
        <CodeSnippet code={triggerSnippet} lang="js"></CodeSnippet>
        <p className="description">
          如果需要在button点击事件发生后上报埋点，可增加after修饰符，示例如下：
        </p>
        <Button
          type="primary"
          onClick={this.handleClick2.bind(this, "second button")}
        >
          Click Me
        </Button>
        <CodeSnippet code={triggerAfterSnippet} lang="js"></CodeSnippet>
        <Alert
          message="这里需要注意的是：after 可以保证在埋点action中获取的state为当前最新的state，而默认获取的则为更新前的state。"
          type="warning"
        />
        <p className="description">
          如果button点击事件包含异步请求，可使用async修饰符，示例如下：
        </p>
        <Button
          type="primary"
          onClick={this.handleClick3.bind(this, "third button")}
        >
          Click Me
        </Button>
        <CodeSnippet code={triggerAsyncSnippet} lang="js"></CodeSnippet>
        <p className="description">
          如果需要对来自 redux 中 action
          事件进行埋点，我们可以在组件中包装一层async/await，示例如下：
        </p>
        <CodeSnippet code={triggerAsyncActionSnippet} lang="js"></CodeSnippet>
        <p className="description">
          如果埋点只需上报一次，可增加once修饰符，以异步埋点为例，示例如下：
        </p>
        <Button
          type="primary"
          onClick={this.handleClick4.bind(this, "fourth button")}
        >
          Click Me
        </Button>
        <CodeSnippet code={triggerAsyncOnceSnippet} lang="js"></CodeSnippet>
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
