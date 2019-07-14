/*
 * Created Date: 2019-07-11
 * Author: 宋慧武
 * ------
 * Last Modified: Sunday 2019-07-14 23:07:02 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
export const TYPES = {
  GET_USERINFO: "GET_USERINFO"
};

const getUserInfo = payload => ({
  type: TYPES.GET_USERINFO,
  payload
});

export function fetchUserInfo() {
  return async dispatch => {
    const rest = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ name: "LHammer", age: "18" });
      }, 100);
    });

    dispatch(getUserInfo(rest));
  };
}
