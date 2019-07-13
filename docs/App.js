/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Saturday 2019-07-13 12:24:52 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component, createContext } from "react";
import trackEvents from "./tracks";
import { connect } from 'react-redux'
import { fetchUserInfo } from "./store/actions";
import { track } from "../";

import './App.css';

const trackContext = createContext(trackEvents)

class App extends Component {
  static contextType = trackContext;

  constructor(props) {
    super(props);
    this.buttonRef = null;
    this.state = {
      date: new Date(),
      rest: null,
      target: null
    };
  }

  @track("click.after", 22121)
  handleClick(val, e) {
    console.log('handleClick 方法正常执行。并受到参数：', val, e.target)
    this.setState({
      target: e.target
    })
  }

  // @track("async.once", 22121, { stateKey: "date" })
  // handleClick = async (val, e) => {
  //   e.persist();
  //   const response = await new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({ date: Date.now() });
  //     }, 300);
  //   });
  //   console.log('handleClick 方法正常执行。并受到参数：', val, response)

  //   this.setState({
  //     date: response,
  //     target: e.target
  //   })
  // }

  componentDidMount() {
    this.initContent('test');
    this.getUserInfo();
  }

  @track("async", 22120, { propKey: "userInfo" })
  getUserInfo = () => {
    console.log('getUserInfo 方法正常执行');
    this.props.dispatch(fetchUserInfo());
  }

  @track("async.delay", 22122, { delay: 3000, stateKey: "rest" })
  initContent = async (val) => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 500);
    });
    console.log('initContent 方法正常执行。并受到参数：', val)
    this.setState({
      rest: response.data
    })
  }

  render() {
    return (
      <button ref={ref => this.buttonRef = ref} onClick={this.handleClick.bind(this, '123')}>Click Me</button>
    );
  }
}

export default connect(
  state => ({userInfo: state.userInfo})
)(App);
