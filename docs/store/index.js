/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Thursday 2019-07-11 14:45:15 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

export default createStore(reducer, compose(applyMiddleware(thunk)));
