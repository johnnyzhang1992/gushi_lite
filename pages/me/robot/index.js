// pages/me/robot/index.js
const app = getApp();
var plugin = requirePlugin("wechatBot");
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  // goBackHome回调 返回上一级页面
  goBackHome: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        let isIOS = res.system.indexOf("iOS") > -1;
        let navHeight = 0;
        if (!isIOS) {
          navHeight = 48;
        } else {
          navHeight = 44;
        }
        this.setData({
          status: res.statusBarHeight,
          navHeight: navHeight,
          statusBarHeight: res.statusBarHeight + navHeight
        });
      }
    });
  },
  getQueryCallback: function(e) {},
  goBackHome: function() {
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  back: function(e) {
    this.goBackHome();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
