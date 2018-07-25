// pages/me/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    lists: null,
    a_current_page: 0,
    a_last_page: 0,
    a_total: 0
  },
  // 获取用户id
  getUserId: function () {
    let user = wx.getStorageSync('user');
    let user_id = user ? user.user_id : 0;
    this.setData({
      user_id: user_id
    });
  },
  update: function(event){
    let that = this;
    let id = event.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://xuegushi.cn/wxxcx/search/'+id+'/update',
            success: res => {
              // console.log(res.data);
              wx.hideLoading();
              if (res.data && res.data.status ==200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.data.lists.map(function(item,index){
                  if(item.id == id){
                    console.log(item, index);
                    that.data.lists.splice(index,1)
                  }
                })
                that.setData({
                  lists: that.data.lists
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.getUserId();
    wx.showLoading({
      title: '加载中',
    });
    wx.setNavigationBarTitle({
      title: '搜索列表'
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/search_list',
      success: res => {
        // console.log(res.data);
        wx.hideLoading();
        if (res.data) {
          that.setData({
            lists: res.data.data,
            a_current_page: res.data.current_page,
            a_last_page: res.data.last_page,
            a_total: res.data.total
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '数据加载失败，请下拉刷新重试加载。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
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
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.a_last_page < this.data.a_current_page) {
      return false;
    }
    let that = this;
    // Do something when page reach bottom.
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/search_list',
      data: {
        page: that.data.a_current_page + 1
      },
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          // wx.setStorageSync('user',res.data);
          // console.log(res.data);
          this.setData({
            lists: that.data.lists.concat(res.data.data),
            a_current_page: res.data.current_page,
            a_last_page: res.data.last_page,
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
  
  }
})