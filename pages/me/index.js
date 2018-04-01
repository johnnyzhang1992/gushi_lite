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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    p_count: 0,
    a_count: 0,
  },
  // 获取用户id
  getUserId: function(){
    let user = wx.getStorageSync('user');
    let user_id = user ? user.user_id: 0;
    this.setData({
      user_id: user_id
    });
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
    if (that.data.user_id < 1) {
      https.userLogin(0,'me');
    } else {
      wx.showLoading({
        title: '加载中',
      });
      wx.setNavigationBarTitle({
        title: '个人中心'
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
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });

          }
        })
      }
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/getUserInfo/' + this.data.user_id,
        success: res => {
          if (res.data) {
            that.setData({
              p_count: res.data.p_count,
              a_count: res.data.a_count
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
  getUserInfo: function(e) {
    // console.log(e);
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
