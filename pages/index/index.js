//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '古诗文小助手',
    userInfo: {},
    hasUserInfo: false,
    user: wx.getStorageSync('user'),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    poems: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {
    // Do something when page ready.
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getRandomPoem',
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          wx.setStorageSync('user',res.data);
          this.setData({
            poems: res.data
          });
        }
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function(e) {
    console.log(e.detail.errMsg);
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData)
   },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '古诗文小助手',
      path: '/page/user?id=123',
      imageUrl:'/images/poem.png',
      success: function(res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
