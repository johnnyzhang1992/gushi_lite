//index.js
//获取应用实例
let util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    motto: '古诗文小助手',
    poems: null,
    inputShowed: false,
    current_page: 1,
    last_page: 1,
    array: ['诗经','楚辞','乐府','小学古诗','初中古诗','高中古诗','宋词精选','古诗十九','唐诗三百首','宋词三百首','古诗三百首'],
    objectArray: ['shijing','chuci','yuefu','xiaoxue','chuzhong','gaozhong','songci','shijiu','tangshi','songcisanbai','sanbai'],
    index: 10,
    date: util.formatDateToMb(),
    hot: app.globalData.hot
  },
  showInput: function () {
    wx.navigateTo({
      url: '/pages/search/index'
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
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getHomeData',
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          if(!app.globalData.hot){
            app.globalData.hot = res.data.hot[0]
          }
          this.setData({
            hot: app.globalData.hot ? app.globalData.hot : res.data.hot[0],
            poems: res.data.poems.data,
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page
          });
          
          wx.hideLoading();
        }
      }
    })
  },
  onReady: function() {
    // Do something when page ready.
  
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    let that = this;
    // Do something when page reach bottom.
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getHomeData',
      data: {
        page: that.data.current_page+1
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          this.setData({
            poems: that.data.poems.concat(res.data.poems.data),
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  getPhoneNumber: function(e) {
    console.log(e.detail.errMsg);
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData)
   },
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '古诗文小助手',
      path: '/pages/index/index',
      imageUrl:'/images/poem.png',
      success: function(res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  bindPickerChange: function(e) {
    let that = this;
    this.setData({
      index: e.detail.value
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getHomeData?name='+that.data.objectArray[that.data.index],
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          this.setData({
            poems: res.data.poems.data,
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
});
