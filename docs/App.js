/*
 * Created Date: 2019-07-08
 * Author: 宋慧武
 * ------
 * Last Modified: Tuesday 2019-07-09 18:26:35 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component, createContext } from 'react';
import trackEvents from "./tracks";
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
      rest: null
    };
  }

  // @track("click.delay", 22122)
  // handleClick = (val, e) => {
  //   console.log('click', val, e.target)
  // }

  @track("async", 22122)
  async handleClick (val) {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 300);
    });
    console.log('click', val)

    this.updateState({
      rest: response.data
    })
  }

  componentDidMount() {
    this.initContent();
  }

  @track("async.delay", 22122, { delay: 3000, ref: "buttonRef" })
  initContent = async () => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 300);
    });
    console.log('done')

    this.updateState({
      rest: response.data
    })
  }

  render() {
    return (
      <button ref={ref => this.buttonRef = ref} onClick={this.handleClick.bind(this, '123')}>Click Me</button>
    );
  }
}

export default App;
