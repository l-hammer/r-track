/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Thursday 2019-07-11 15:45:10 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import { TYPES } from "./actions";

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.GET_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.payload
      });
    default:
      return state;
  }
};
