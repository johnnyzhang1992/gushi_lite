//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '古诗文小助手',
    userInfo: {},
    hasUserInfo: false,
    user_id: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    poems: null,
    authors: null,
    p_current_page:0,
    p_last_page:0,
    p_total:0
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
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getCollect/'+this.data.user_id+'/poem',
      success: res => {
        console.log(res.data);
        if (res.data) {
          that.setData({
            poems: res.data.data.data,
            p_current_page:res.data.data.current_page,
            p_last_page:res.data.data.last_page,
            p_total:res.data.data.total
          })
        }
        wx.hideLoading();
        }
    });
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
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(){

  },
  onReachBottom: function() {
    if(this.data.p_last_page<this.data.p_current_page){
      return false;
    }
    let that = this;
    // Do something when page reach bottom.
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getCollect/'+this.data.user_id+'/poem',
      data: {
        page: that.data.p_current_page+1
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          this.setData({
            poems: that.data.poems.concat(res.data.data.data),
            p_current_page:res.data.data.current_page,
            p_last_page:res.data.data.last_page,
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
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
