/**
 * Author johnnyZhang
 * Site johnnyzhang.cn
 * CreateTime 2017/7/19.
 */
let app = getApp();
function compare(property){
    return function(a,b){
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
}
function login(id) {
  let app = getApp();
  let code = null;
  let systemInfo = null;
  // 登录
  wx.login({
    success: res => {
      code = res.code
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  });
  // 获取用户手机信息
  wx.getSystemInfo({
    success: res => {
      systemInfo = res;
    }
  });
  // 获取用户信息
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userInfo']) {
          // 未授权
        wx.openSetting({
          success: res => {
            console.log(res);
            if (res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                complete(res) {
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      app.globalData.userInfo = res.userInfo;
                      // 向关联网站发送请求，解密、存储数据
                      wx.request({
                        url: 'https://xuegushi.cn/wxxcx/userInfo',
                        data: {
                          code: code,
                          iv: res.iv,
                          encryptedData: res.encryptedData,
                          systemInfo: systemInfo
                        },
                        success: function (res) {
                          if(res.data){
                            console.log('----------success------------');
                            wx.setStorageSync('user',res.data);
                            wx.redirectTo({
                              url: '/pages/poem/detail/index?id='+id
                            })
                          }
                        }
                      });
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (app.userInfoReadyCallback) {
                        app.userInfoReadyCallback(res)
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }else{
          // 已授权
        wx.redirectTo({
          url: '/pages/poem/detail/index?id='+id
        })
      }
    }
  });
 
}
module.exports = {
    userLogin: login
};