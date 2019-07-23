/*
 * Created Date: 2019-07-14
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-23 14:44:42 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { withRouter } from "react-router";
import store from "@/store";
import { home as trackEvents } from "@/tracks";
import { fetchUserInfo } from "@/store/actions";
import { track, inject } from "../../../";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  };
}

@withRouter
@connect(mapStateToProps)
@inject({ trackEvents })
class Home extends Component {
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
    e.persist();
    console.log("handleClick 方法正常执行。并受到参数：", val, e.target);
    this.setState({
      date: Date.now(),
      target: e.target
    });
  }

  // @track("async", 22121, { stateKey: "date" })
  // @track("async.once", 22121)
  // handleClick = async (val, e) => {
  //   e.persist();
  //   const response = await new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({ date: Date.now() });
  //     }, 300);
  //   });
  //   console.log(
  //     "handleClick 方法正常执行。并受到参数：",
  //     val,
  //     e.target,
  //     response.date
  //   );

  //   this.setState({
  //     date: response.date,
  //     target: e.target
  //   });
  // };

  @track("UVPV")
  @track("TONP")
  componentDidMount = () => {
    this.initContent("test");
    this.getUserInfo();

    this.timer = setTimeout(() => {
      console.log("修改 stateKey: content 方法正常执行");
      this.setState({
        content: { test: "test" }
      });
    }, 4000);
  };

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  // @track("async", 22120, { propKey: "userInfo" })
  @track("async", 22120)
  getUserInfo = async () => {
    console.log("getUserInfo 方法正常执行");
    await this.props.dispatch(fetchUserInfo());
  };

  // @track("async", 22120, { propKey: "userInfo" })
  // getUserInfo = () => {
  //   console.log("getUserInfo 方法正常执行");
  //   this.props.dispatch(fetchUserInfo());
  // };

  // @track("async.delay", 22122, { delay: 3000, stateKey: "content" })
  @track("async.delay", 22122, { delay: 3000 })
  initContent = async val => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 300);
    });
    console.log("initContent 方法正常执行。并受到参数：", val);
    this.setState({
      content: response.data
    });
  };

  render() {
    return (
      <button
        ref={ref => (this.buttonRef = ref)}
        onClick={this.handleClick.bind(this, "123")}
      >
        Click Me
      </button>
    );
  }
}

export default class WrapHome extends Component {
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}
