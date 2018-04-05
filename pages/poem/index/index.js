// pages/poem/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '古诗文小助手',
    poems: null,
    current_page: 1,
    last_page: 1,
    types:[],
    dynasty:[],
    d_index:0,
    t_index:0,
    total: 0,
    is_search: false,
    _type: null,
    _keyWord: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;let _url = '';
    wx.showLoading({
      title: '加载中',
    });
    if(options.type){
      _url = 'https://xuegushi.cn/wxxcx/getPoemData?_type=' + options.type + '&keyWord=' + options.keyWord
    }else{
      _url = 'https://xuegushi.cn/wxxcx/getPoemData'
    }
    wx.request({
      url: _url,
      data: {
        type: '全部'
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          this.setData({
            is_search: options.keyWord ? true:false,
            poems: res.data.poems.data,
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page,
            types: res.data.types,
            dynasty: res.data.dynasty,
            total: res.data.poems.total,
            _type: options.type ? options.type : null,
            _keyWord: options.keyWord ? options.keyWord : null
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
    wx.setNavigationBarTitle({
      title: '古诗文'
    });
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
    let that = this;
    let _data = {};
    wx.showNavigationBarLoading();
    if(that.data._type){
      _data = {
        page: that.data.current_page + 1,
        _type: that.data._type,
        keyWord: that.data._keyWord
      }
    }else{
      _data = {
        page: that.data.current_page + 1,
      }
    }
    if(that.data.current_page> that.data.last_page){
      wx.hideNavigationBarLoading()
      return false;
    }
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoemData?dynasty='+that.data.dynasty[that.data.d_index]+'&type='+that.data.types[that.data.t_index],
      data: _data,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '古诗文',
      path: '/pages/poem/index/index',
      // imageUrl:'/images/poem.png',
      success: function(res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  bindPickerDynastyChange: function(e) {
    let that = this;
    this.setData({
      d_index: e.detail.value,
      t_index: 0
    });
    wx.setNavigationBarTitle({
      title: that.data.dynasty[e.detail.value]
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoemData?dynasty='+that.data.dynasty[e.detail.value],
      data: {
        page: 1
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          that.setData({
            poems: res.data.poems.data,
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page,
            total: res.data.poems.total
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  bindPickerTypeChange: function (e) {
    let that = this;
    this.setData({
      t_index: e.detail.value
    });
    wx.setNavigationBarTitle({
      title: that.data.dynasty[that.data.d_index] + ' | ' + that.data.types[e.detail.value]
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoemData?dynasty='+that.data.dynasty[that.data.d_index]+'&type='+that.data.types[e.detail.value],
      data: {
        page: 1
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          that.setData({
            poems: res.data.poems.data,
            current_page: res.data.poems.current_page,
            last_page: res.data.poems.last_page,
            total: res.data.poems.total
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  }
});