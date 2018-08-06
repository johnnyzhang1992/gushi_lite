// pages/search/index.js
const app = getApp();
let WxSearch = require('../../wxSearchView/wxSearchView.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '搜索古诗文',
    poems:null,
    poets: null,
    sentences:null,
    tags: null,
    keyWord: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    // 2 搜索栏初始化
    let that = this;
    let hotKey = null;
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getsHotSearch',
      success: res =>{
        // console.log(res.data);
        hotKey = res.data;
        WxSearch.init(
          that,  // 本页面一个引用
          hotKey ? hotKey : [], // 热点搜索推荐，[]表示不使用
          [],// ,// 搜索匹配，[]表示不使用
          that.mySearchFunction, // 提供一个搜索回调函数
          that.myGobackFunction //提供一个返回回调函数
        );
      },
      fail: () =>{
        WxSearch.init(
          that,  // 本页面一个引用
          hotKey ? hotKey : [], // 热点搜索推荐，[]表示不使用
          [],// ,// 搜索匹配，[]表示不使用
          that.mySearchFunction, // 提供一个搜索回调函数
          that.myGobackFunction //提供一个返回回调函数
        );
      }
    });
  
 
  },
  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
  // 4 搜索回调函数
  mySearchFunction: function (value) {
    // do your job here
    // console.log(value);
    wx.showNavigationBarLoading();
    let that = this;
    this.setData({
      'keyWord': value
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/search/'+value,
      success: res =>{
        console.log(res.data);
        that.setData({
          poems: res.data ? res.data.poems : null,
          poets: res.data ? res.data.poets : null,
          sentences: res.data ? res.data.sentences : null,
          tags: res.data.tags
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  
  // 5 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 示例：返回
    wx.switchTab({
      url: '/pages/index/index'
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})