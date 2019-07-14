/*
 * Created Date: 2019-07-13
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 17:19:53 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { observable, action, runInAction, reaction } from "mobx";
import trackEvents from "@/tracks";
import { track, inject } from "../../";

@inject({
  reaction,
  trackEvents
})
class App {
  @observable userInfo = {};
  @observable date = null;
  @observable target = null;
  @observable content = null;

  @action.bound
  @track("click.after", 22121)
  handleClick(val, e) {
    console.log("handleClick 方法正常执行。并受到参数：", val, e.target);
    this.date = Date.now();
    this.target = e.target;
  }
  // @action.bound
  // @track("async", 22121, { stateKey: "date" })
  // handleClick = async (val, e) => {
  //   e.persist();
  //   const response = await new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({ date: Date.now() });
  //     }, 300);
  //   });
  //   console.log('handleClick 方法正常执行。并受到参数：', val, response.data)

  //   runInAction(() => {
  //     this.date = response.date;
  //     this.target = e.target;
  //   });
  // }

  @action
  @track("async", 22120, { stateKey: "userInfo" })
  fetchUserInfo = async () => {
    const rest = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ name: "LHammer", age: "18" });
      }, 300);
    });

    console.log("fetchUserInfo 方法正常执行");
    runInAction(() => {
      this.userInfo = rest;
    });
  };

  @action
  @track("async.delay", 22122, { delay: 3000, stateKey: "content" })
  initContent = async val => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: "success" });
      }, 500);
    });
    console.log("initContent 方法正常执行。并受到参数：", val);

    runInAction(() => {
      this.content = response.data;
    });
  };
}

export default new App();
