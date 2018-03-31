// pages/discover/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '专栏文章',
    posts: null,
    current_page: 1,
    last_page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: that.data.motto
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPostData',
      success: res =>{
        if(res.data){
          console.log('----------success--post----------');
          this.setData({
            posts: res.data.data,
            current_page: res.data.current_page,
            last_page: res.data.last_page
          });
        
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPostData',
      success: res =>{
        if(res.data){
          console.log('----------success--post----------');
          that.setData({
            posts: res.data.data,
            current_page: res.data.current_page,
            last_page: res.data.last_page
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh()
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if(this.data.last_page<this.data.current_page){
      return false;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPostData',
      data: {
        page: that.data.current_page+1
      },
      success: res =>{
        if(res.data){
          console.log('----------success--post----------');
          that.setData({
            posts: that.data.posts.concat(res.data.data),
            current_page: res.data.current_page,
            last_page: res.data.last_page
          });
          wx.hideNavigationBarLoading();
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})