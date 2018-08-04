// pages/find/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location : {
      name : '添加地点',
    },
    location_img: '/images/icon/location_fill.png',
    type: null,
    poem: null,
    author: null,
  },
  // 获取用户id
  getUserId: function () {
    let user = wx.getStorageSync('user');
    if (user && user.user_id) {
      let user_id = user ? user.user_id : 0;
      this.setData({
        user_id: user_id
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.id,options.type)
    wx.setNavigationBarTitle({
      title: '写想法'
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/poem/' + options.id + '?user_id=' + that.data.user_id,
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          this.setData({
            poem: res.data.poem,
            type: 'poem'
          });
          wx.hideLoading();
        }
      }
    });
  },
  getLocation: function(){
    wx.chooseLocation({
      success : (res)=>{
        console.log(res);
        if(res.name && res.name!=''){
          this.setData({
            location: res,
            location_img: '/images/icon/location_active.png'
          })
        }else{
          this.setData({
            location: {
              name: '添加地点',
            },
            location_img: '/images/icon/location_fill.png'
          })
        }
       
      }
    })
  },
  keyBoardUp: function(event){
    console.log(event.detail)
  },
  keyBoardDown: ()=>{
    console.log('keyBoard down')
  },
  bindFormSubmit: (e)=>{
    console.log(e.detail.value.mind);
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
    wx.stopPullDownRefresh();
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