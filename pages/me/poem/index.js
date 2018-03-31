// pages/me/poem/index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    user_id: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    poems: null,
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
  onLoad: function () {
    let that = this;
    this.getUserId();
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '诗词收藏'
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
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getCollect/'+this.data.user_id+'/poem',
      success: res => {
        // console.log(res.data);
        wx.hideLoading();
        if (res.data) {
          that.setData({
            poems: res.data.data.data,
            p_current_page:res.data.data.current_page,
            p_last_page:res.data.data.last_page,
            p_total:res.data.data.total
          })
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '数据加载失败，请下拉刷新重试加载。',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    });
  },
  onReady: function() {
    // Do something when page ready.
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(){
    let that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getCollect/'+this.data.user_id+'/poem',
      success: res => {
        // console.log(res.data);
        if (res.data) {
          that.setData({
            poems: res.data.data.data,
            p_current_page:res.data.data.current_page,
            p_last_page:res.data.data.last_page,
            p_total:res.data.data.total
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh()
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '数据加载失败，请下拉刷新重试加载。',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
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
