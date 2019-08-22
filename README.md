# r-track

<a href="https://travis-ci.org/l-hammer/r-track"><img alt="Travis (.org) branch" src="https://img.shields.io/travis/l-hammer/r-track/master.svg?logoColor=%23666666&style=flat-square"></a>
<a href="https://unpkg.com/r-track/dist/r-track.min.js"><img src="https://img.badgesize.io/https://unpkg.com/r-track/dist/r-track.min.js?compression=gzip&style=flat-square" alt="Gzip Size" /></a>
<a href="https://www.npmjs.com/package/r-track"><img src="https://img.shields.io/npm/v/r-track.svg?colorB=brightgreen&style=flat-square"></a>
<a href="http://hits.dwyl.io/l-hammer/r-track" alt="hit count"><img src="http://hits.dwyl.io/l-hammer/r-track.svg" /></a>

r-track是一个基于装饰器的埋点业务插件，可实现埋点代码与业务代码完全解耦，适用于react项目~

## 安装

### YARN

```shell
$ yarn add r-track
```

### NPM

```shell
$ npm install r-track --save
```

## 用法

r-track 包含track、inject两个方法，基本用法如下：

### inject

注入当前模块（页面）相关的埋点声明~

- **参数**
  - `{Object} trackEvents` 埋点事件声明的对象 [events](https://github.com/l-hammer/r-track/blob/master/docs/tracks/events/home.js)

- **用法**
```js
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
@inject(store => ({ store, trackEvents: tracks.home  }))
```

### track

埋点装饰器，对应 v-track 中的指令~

- **参数**
  - `{String} modifier` 对应的埋点类型
  - `{Number | String} eventId` 埋点事件id
  - `{Object} params` 自定义参数，目前支持delay、ref

- **用法**
```js
import { track } from "r-track";

@track("UVPV")
@track("TONP")
@track("trigger", 22121)
@track("trigger.after", 22121)
@track("trigger.once", 22121)
@track("trigger.after.once", 22121)
@track("async", 22121)
@track("async.once", 22121)
@track("async.delay", 22121, { delay: 3000, ref: "elementRef")
```

## 示例

假如我们有一个 Home 的组件，需要在点击`button`时上报 id 为22121的埋点，示例如下：

```js
import { home as trackEvents } from "@/tracks";
import { track, inject } from "r-track";

@inject({ trackEvents })
class Home extends Component {
  state = {
    date: Date.now(),
  };

  @track("trigger", 22121)
  handleClick(val, e) {
    this.setState({
      date: Date.now()
    });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this, "click button")}>Click Me</button>
    );
  }
}
```

如果需要在`button`点击事件发生后上报埋点，可增加`after`修饰符，示例如下：

```js
@inject({ trackEvents })
class Home extends Component {
  ...
  @track("trigger.after", 22121)
  handleClick(val, e) {
    this.setState({
      date: Date.now()
    });
  }
  ...
}
```

如果`button`点击事件包含异步请求，可使用`async`修饰符，示例如下：

```js
@inject({ trackEvents })
class Home extends Component {
  ...
  @track("async", 22121)
  handleClick = async (val, e) => {
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ date: Date.now() });
      }, 300);
    });

    this.setState({
      date: response.date
    })
  }
  ...
}
```

UVPV、TONP（页面停留时长）埋点，示例如下：

```js
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
```

页面初始化异步埋点延迟上报，示例如下：

```js
@inject({ trackEvents })
class Home extends Component {
  ...
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
```

> `async.delay`类型的埋点应该装饰在react component中，因为我们需要在页面卸载的时候及时清除定时器

区域或者元素曝光埋点，需通过 data-track-attributes 传递参数，示例如下：

```js
@inject({ trackEvents })
class Home extends Component {
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
        <p>我想被曝光</p>
      </Card>
    );
  }
}
```

> 区域曝光类型的埋点需要元素绑定`ref`属性，属性必须以`TrackRef`结尾，即`ref={ref => (this.buttonTrackRef = ref)}`

## LICENSE

[MIT](https://github.com/l-hammer/r-track/blob/master/LICENSE) © 2019-present, LHammer
