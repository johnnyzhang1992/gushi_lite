// pages/poem/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '古诗文小助手',
    poems: [],
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
    let that = this;
    if (options.type) {
      wx.setNavigationBarTitle({
        title: options.keyWord
      });
    } else {
      wx.setNavigationBarTitle({
        title: '古诗文'
      });
    }
    wx.showLoading({
      title: '加载中',
    });
    that.getPoemData(options.type,options.keyWord).then((res)=>{
      if(res && res.succeeded){
        wx.hideNavigationBarLoading()
      }else{
        wx.showToast({
          title: '加载数据失败，请下拉重试。',
          icon: 'none',
          mask: true
        });
      }
    });
  },
  getPoemData: function(type,keyWord,_type,page){
    let that = this;
    return new Promise((resolve,reject)=>{
      // resolve(Object.assign(res.data, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
      wx.request({
        url: app.globalData.domain+'/getPoemData',
        data: {
          page: page ? page : 1,
          type: _type ? _type : '全部',
          _type: type ? type : null,
          keyWord: keyWord ? keyWord : null,
          dynasty: that.data.dynasty[that.data.d_index] ? that.data.dynasty[that.data.d_index] : '全部',
        },
        success: res =>{
          if(res.data){
            console.log('----------success------------');
            // wx.setStorageSync('user',res.data);
            // console.log(res.data);
            that.setData({
              is_search: keyWord ? true:false,
              poems:  page >1 ? that.data.poems.concat(res.data.poems.data) : res.data.poems.data,
              current_page: res.data.poems.current_page,
              last_page: res.data.poems.last_page,
              types: res.data.types,
              dynasty: res.data.dynasty,
              total: res.data.poems.total,
              _type: type ? type : null,
              _keyWord: keyWord ? keyWord : null
            });
            wx.hideLoading();
            resolve(Object.assign(res.data, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
          }else{
            resolve(Object.assign(res.data, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
          }
        },
        fail: res=>{
          resolve(Object.assign(res.data, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
        }
      })
    });
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
    wx.showNavigationBarLoading();
    if(that.data.current_page> that.data.last_page){
      wx.hideNavigationBarLoading();
      return false;
    }
    that.getPoemData(that.data._type,that.data.keyWord,that.data.types[that.data.t_index],that.data.current_page+1).then((res)=>{
      if(res && res.succeeded){
        wx.hideNavigationBarLoading()
      }else{
        wx.showToast({
          title: '加载数据失败，请下拉重试。',
          icon: 'none',
          mask: true
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '古诗文',
      path: '/pages/poem/index',
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
    that.getPoemData(that.data._type,that.data.keyWord,that.data.types[that.data.t_index],1).then((res)=>{
      if(res && res.succeeded){
        wx.hideNavigationBarLoading()
      }else{
        wx.showToast({
          title: '加载数据失败，请下拉重试。',
          icon: 'none',
          mask: true
        });
      }
    });
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
    that.getPoemData(that.data._type,that.data.keyWord,that.data.types[e.detail.value],1).then((res)=>{
      if(res && res.succeeded){
        wx.hideNavigationBarLoading()
      }else{
        wx.showToast({
          title: '加载数据失败，请下拉重试。',
          icon: 'none',
          mask: true
        });
      }
    });
  }
});