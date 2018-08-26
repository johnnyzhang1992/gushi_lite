// pages/find/users/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pin_id:0,
    users: [],
    current_page:0,
    last_page:1,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      pin_id: options.id
    });
    wx.setNavigationBarTitle({
      title: '鼓掌'
    });
    that.getPinLikes()
  },
  userPins: (e) => {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/find/user/index?id=' + id
    });
  },
  getPinLikes: function(){
    let that = this;
    let id = that.data.pin_id;
    let page = that.data.current_page +1;
    if(that.data.last_page<page){
      return false;
    }
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPinLikeUsers/'+id+'?page='+page,
      success: (res)=>{
        // console.log(res);
        if(res.data){
          that.setData({
            users: that.data.users.concat(res.data.data),
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            total: res.data.total
          })
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
    this.setData({
      current_page: 0,
      users: []
    });
    this.getPinLikes();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPinLikes();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '鼓掌',
      path: '/pages/find/users/index?id=' + this.data.pin_id,
      // imageUrl:'/images/poem.png',
      success: function (res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});