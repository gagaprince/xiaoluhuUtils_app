import { getSelf } from './request';

let loginPromise = null;
const LOCAL_USER_KEY = 'wx_user_info_cache';
const APPID = 'wx2f969fe5f4c9f28c';

export const login = async () => {
  if (loginPromise) {
    return loginPromise;
  }
  loginPromise = new Promise((resolve, reject) => {
    try {
      const userInfoCache = wx.getStorageSync(LOCAL_USER_KEY);
      if (userInfoCache) {
        resolve(userInfoCache);
      } else {
        wx.login({
          async success(res) {
            const { code } = res;
            const url = '/wx/login';
            const ret = await getSelf(url, {
              code,
              appid: APPID,
            });
            const userInfo = ret.data;
            wx.setStorageSync(LOCAL_USER_KEY, userInfo);
            resolve(userInfo);
          },
          fail(e) {
            reject(e);
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
  return loginPromise;
};
