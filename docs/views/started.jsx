/*
 * Created Date: 2019-08-19
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-08-19 19:41:27 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component, Fragment } from "react";
import CodeSnippet from "@/components/code-snippet";
import { Alert } from "antd";

const installSnippet = `
# YARN
$ yarn add r-track

# NPM
$ npm install r-track --save
`;

const injectUsageSnippet = `
// react class component
import { inject } from "r-track";
import tracks from "@/tracks";
@inject({ trackEvents: tracks.home })

// mobx class
import { inject } from "r-track";
import tracks from "@/tracks";
@inject({ trackEvents: tracks.home  })

// react class component + mobx-react
import { inject } from "mobx-react";
import tracks from "@/tracks";
@inject(store => ({ store, trackEvents: tracks.home }))
`;

const trackUsageSnippet = `
import { track } from "r-track";

@track("UVPV") // 访问量埋点
@track("TONP") // 页面停留时长埋点
@track("trigger", 22121) // 同步事件行为埋点
@track("trigger.after", 22121) // 同上，方法执行完成后触发
@track("trigger.once", 22121) // 同上，只触发一次
@track("trigger.after.once", 22121) // 只触发一次且在方法执行完成后触发
@track("async", 22121) // 异步行为埋点
@track("async.once", 22121) // 同上，只触发一次
@track("async.delay", 22121, { delay: 3000, ref: "elementRef") // 异步延时行为埋点
`;

export default class Started extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tips = () => {
    return (
      <Fragment>
        <p>
          1、@track("UVPV")、@track("TONP")应该装饰componentDidMount，因为需要在页面挂载完成后上报对应的埋点
        </p>
        <p>
          2、ref
          参数为DOM的引用，可控制在小于埋点延迟时间内发生DOM隐藏是否继续上报埋点
        </p>
        <p>
          3、async.delay 埋点应该装饰 class component 的方法。因为 mobx class
          没有生命周期，我们无法在页面销毁的时候及时清除定时器
        </p>
      </Fragment>
    );
  };

  render() {
    return (
      <main className="started_page">
        <div className="desc">
          r-track是一个基于装饰器的埋点业务插件，同样可实现将埋点代码与业务代码完全解耦，适用于react项目。完整示例可参考
          <a href="https://github.com/l-hammer/r-track/tree/master/docs/tracks">
            GitHub
          </a>
        </div>
        <h3 className="global-title">安装</h3>
        <CodeSnippet code={installSnippet} lang="shell"></CodeSnippet>
        <h3 className="global-title">用法</h3>
        <p className="global-pdtb:12">注入当前模块（页面）相关的埋点声明~</p>
        <CodeSnippet code={injectUsageSnippet} lang="js"></CodeSnippet>
        <p className="global-pdtb:12">埋点装饰器，对应 v-track 中的指令~</p>
        <CodeSnippet code={trackUsageSnippet} lang="js"></CodeSnippet>
        <Alert
          className="start_alert"
          message="需要注意的几个地方："
          description={this.tips()}
          type="warning"
        />
      </main>
    );
  }
}
