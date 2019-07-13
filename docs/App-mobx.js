/*
 * Created Date: 2019-07-13
 * Author: 宋慧武
 * ------
 * Last Modified: Saturday 2019-07-13 18:13:23 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject("app")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = null;
  }

  componentDidMount() {
    this.props.app.initContent('test');
    this.props.app.fetchUserInfo();
  }

  render() {
    const { handleClick } = this.props.app;

    return (
      <button 
        ref={ref => this.buttonRef = ref}
        onClick={(e) => handleClick('123', e)}
      >
        Click Me
      </button>
    );
  }
}

export default App;
