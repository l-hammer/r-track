/*
 * Created Date: 2019-07-14
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 17:18:47 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import HomeRedux from "@/views/home-redux";
import HomeMobx from "@/views/home-mobx";

const routes = [
  {
    path: "/home-redux",
    component: HomeRedux
  },
  {
    path: "/home-mobx",
    component: HomeMobx
  }
];

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  );
}

export default () => {
  return (
    <HashRouter>
      <main>
        <Link to="/home-redux">Home redux page</Link>
        <Link to="/home-mobx">Home mobx page</Link>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </main>
    </HashRouter>
  );
};
