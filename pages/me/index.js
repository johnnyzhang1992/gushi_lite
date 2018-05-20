//index.js
//获取应用实例
const app = getApp();
let https = require('../../utils/http.js');
Page({
  data: {
    motto: '古诗文小助手',
    userInfo: null,
    hasUserInfo: false,
    user_id: 0,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUse: true,
    p_count: 0,
    a_count: 0,
    u_count: 0,
    u_t_count: 0
  },
  // 获取用户id
  getUserId: function(){
    let user = wx.getStorageSync('user');
    if(user && user.user_id){
      let user_id = user ? user.user_id: 0;
      this.setData({
        user_id: user_id
      });
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    this.getUserId();
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    if (that.data.user_id < 1) {
      // https.userLogin(0,'me');
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                console(res.userInfo);
                that.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                });
                app.globalData.userInfo = res.userInfo;
              }
            })
          }
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
      });
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      }
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/getUserInfo/' + this.data.user_id,
        success: res => {
          if (res.data) {
            that.setData({
              p_count: res.data.p_count,
              a_count: res.data.a_count,
              u_count: res.data.u_count,
              u_t_count: res.data.u_t_count
            })
          }
          wx.hideLoading();
        }
      });
    }
  },
  onReady: function() {
    // Do something when page ready.
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(){
    wx.showNavigationBarLoading();
    let that = this;
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getUserInfo/'+this.data.user_id,
      success: res => {
        if (res.data) {
          that.setData({
            p_count: res.data.p_count,
            a_count: res.data.a_count
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh()
        }
      }
    });
  },
  bindGetUserInfo: function(e) {
    // console.log('---this');
    // console.log(e);
    let that = this;
    // console.log(e.detail);
    if(e.detail.errMsg != 'getUserInfo:ok'){
      // 授权失败
      return false;
    }else{
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.login({
        success: res => {
          app.globalData.code = res.code
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      });
      // 可以将 res 发送给后台解码出 unionId
      app.globalData.userInfo = e.detail.userInfo;
      // 向关联网站发送请求，解密、存储数据
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/userInfo',
        data: {
          code: app.globalData.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          systemInfo:app.globalData.systemInfo
        },
        success: function (res) {
          if(res.data){
            console.log('----------success------------');
            wx.setStorageSync('user',res.data);
            app.globalData.userInfo = res.data;
            wx.request({
              url: 'https://xuegushi.cn/wxxcx/getUserInfo/'+res.data.user_id,
              success: _res => {
                if (_res.data) {
                  that.setData({
                    user_id: res.data.user_id,
                    p_count: _res.data.p_count,
                    a_count: _res.data.a_count,
                    u_count: _res.data.u_count,
                    u_t_count: _res.data.u_t_count
                  });
                }
              }
            });
          }
        }
      });
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (that.userInfoReadyCallback) {
        that.userInfoReadyCallback(res)
      }
    }

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
      title: '个人中心',
      path: '/page/me/index',
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
