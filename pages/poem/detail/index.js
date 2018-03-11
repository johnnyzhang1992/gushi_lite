// pages/poem/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poem: null,
    poem_id:null,
    detail: null,
    poems_count:0,
    author:null,
    content:null,
    tags:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '页面加载中...',
      mask: true
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/poem/'+options.id,
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          // console.log(res.data);
          // console.log(JSON.parse(res.data.poem.content).content);
          this.setData({
            poem_id: options.id,
            poem: res.data.poem,
            detail: res.data.detail,
            poems_count: res.data.poems_count,
            // author:res.data.author,
            content:JSON.parse(res.data.poem.content),
            tags: res.data.poem.tags && res.data.poem.tags !='' ? res.data.poem.tags.split(',') : []
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
    wx.hideLoading();
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
    wx.showLoading({
      title: '刷新中...',
      mask: true
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/poem/'+this.data.poem_id,
      success: res => {
        if (res.data) {
          console.log('----------refresh-success------------');
          // console.log(res.data);
          // console.log(JSON.parse(res.data.poem.content).content);
          this.setData({
            poem: res.data.poem,
            detail: res.data.detail,
            poems_count: res.data.poems_count,
            // author:res.data.author,
            content:JSON.parse(res.data.poem.content),
            tags: res.data.poem.tags && res.data.poem.tags !='' ? res.data.poem.tags.split(',') : []
          });
          wx.hideLoading();
        }
      }
    })
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
    let that = this;
    return {
      title: that.data.poem.title,
      path: '/pages/poem/detail/index?id='+that.data.poem.id,
      // imageUrl:'/images/poem.png',
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