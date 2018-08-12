// pages/find/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {
      name: '添加地点',
    },
    location_img: '/images/icon/location_fill.png',
    type: null,
    poem: null,
    poet: null,
    pin: null,
    p_pin:null,
    t_id: 0,
    user_id: 0,
    content: '',
    review_bottom: 0,
    show_load: true,
    reviews: [],
    current_page: 0,
    total: 0
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
  addNew: function (event) {
    let pin_id = event.currentTarget.dataset.id ? event.currentTarget.dataset.id : 0;
    let that = this;
    if (that.data.user_id < 1) {
      wx.showModal({
        title: '提示',
        content: '登录后才可以操作哦！',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/me/index'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      let _url = '/pages/find/new/index';
      if (pin_id > 0) {
        _url = _url + '?type=pin&id=' + pin_id;
      }
      wx.navigateTo({
        url: _url
      })
    }
  },
  pinDetail: (e)=>{
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/find/detail/index?id='+id+'&type='+type
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.getUserId();
    console.log(options.id, options.type);
    wx.setNavigationBarTitle({
      title: '详情'
    });
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/getPinDetail/' + options.id + '?user_id=' + that.data.user_id,
        success: res => {
          if (res.data) {
            // console.log(res.data);
            console.log('----------success------------');
            this.setData({
              pin: res.data.pin,
              poem: res.data.poem ? res.data.poem : null,
              poet: res.data.poet ? res.data.poet : null,
              type: 'pin',
              t_id: res.data.pin.id
            });
            // wx.hideLoading();
            that.getPinReviews(that);
          }
        }
      });
    
  },
  reviewFocus: function(){
    // console.log(event.detail)
    this.setData({
      review_bottom: '10px'
    })
  },
  keyBoardDown: function(){
    this.setData({
      review_bottom: 0
    })
  },
  reviewSend: function(){
    let that = this;
    let data = {
      wx_token: wx.getStorageSync('wx_token'),
      user_id: that.data.user_id,
      content: that.data.content,
      t_id: that.data.pin.id,
      t_type: 'pin'
    }
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/createPinReview',
      data: data,
      success: (res)=>{
        console.log(res);
        if(res.data.status == 200){
          let review = res.data.review;
          let reviews = that.data.reviews.concat(review);
          that.setData({
            reviews: reviews,
            show_load: false
          })
        }
      }
    })
    // console.log(data);
  },
  getPinReviews: (th)=>{
    let that = th;
    let id = that.data.pin.id;
    let page = that.data.current_page +1;
    that.setData({
      show_load: true
    })
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPinReviews/'+id+'?page='+page,
      success: (res)=>{
        console.log(res);
        if(res.data){
          that.setData({
            reviews: res.data.data,
            current_page: res.data.current_page,
            total: res.data.last_page,
            show_load: false
          })
        }
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      content: e.detail.value
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
      current_page: 0
    })
    this.getPinReviews(this);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPinReviews(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.pin.content,
      path: '/pages/find/detail/index?id=' + this.data.pin.id,
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
})