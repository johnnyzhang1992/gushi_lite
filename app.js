//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户手机信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 向关联网站发送请求，解密、存储数据
              wx.request({
                url: 'https://xuegushi.cn/wxxcx/userInfo',
                data: {
                  code: this.globalData.code,
                  iv: res.iv,
                  encryptedData: res.encryptedData,
                  systemInfo:this.globalData.systemInfo
                },
                success: function (res) {
                  if(res.data){
                    console.log('---------UserInfo----success------------');
                    console.log(res.data);
                    wx.setStorageSync('user',res.data);
                  }
                }
              });
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code:null,
    systemInfo:null,
    user:null
  }
});