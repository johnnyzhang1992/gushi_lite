// pages/poem/poet/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '古诗文小助手',
    poets: null,
    current_page: 1,
    last_page: 1,
    dynasty:[],
    index:0,
    total: 0,
    is_search: false,
    _keyWord: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _url = '';
    wx.showLoading({
      title: '加载中',
    });
    if(options.type){
      wx.setNavigationBarTitle({
        title: options.keyWord
      });
    }else{
      wx.setNavigationBarTitle({
        title: '古代诗人'
      });
    }
    if (options.type) {
      _url = 'https://xuegushi.cn/wxxcx/getPoetData?keyWord=' + options.keyWord;
    } else {
      _url = 'https://xuegushi.cn/wxxcx/getPoetData'
    }
    wx.request({
      url: _url,
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          this.setData({
            poets: res.data.poets.data,
            current_page: res.data.poets.current_page,
            last_page: res.data.poets.last_page,
            dynasty: res.data.dynasty,
            total: res.data.poets.total,
            is_search: options.type ? true: false,
            _keyWord: options.keyWord ? options.keyWord :null
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let _data = [];
    wx.showNavigationBarLoading();
    if (that.data.is_search) {
      _data = {
        page: that.data.current_page + 1,
        keyWord: that.data._keyWord
      }
    } else {
      _data = {
        page: that.data.current_page + 1,
      }
    }
    if (that.data.current_page > that.data.last_page) {
      wx.hideNavigationBarLoading()
      return false;
    }
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoetData?dynasty='+that.data.dynasty[that.data.index],
      data: _data,
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          this.setData({
            poets: that.data.poets.concat(res.data.poets.data),
            current_page: res.data.poets.current_page,
            last_page: res.data.poets.last_page
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
      title: '古代诗人一览',
      path: '/pages/poet/index/index',
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
      index: e.detail.value,
    });
    wx.setNavigationBarTitle({
      title: that.data.dynasty[e.detail.value]
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoetData?dynasty='+that.data.dynasty[e.detail.value],
      data: {
        page: 1
      },
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          that.setData({
            poets: res.data.poets.data,
            current_page: res.data.poets.current_page,
            last_page: res.data.poets.last_page,
            total: res.data.poets.total
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  }
});