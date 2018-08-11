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
    poet: null,
    pin:null,
    t_id: 0
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
    console.log(options.id,options.type);
    wx.setNavigationBarTitle({
      title: '写想法'
    });
    if(options.type && options.type == 'poem'){
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/poem/' + options.id + '?user_id=' + that.data.user_id,
        success: res => {
          if (res.data) {
            console.log('----------success------------');
            this.setData({
              poem: res.data.poem,
              type: 'poem',
              t_id: res.data.poem.id
            });
            // wx.hideLoading();
          }
        }
      });
    }else if(options.type && options.type == 'poet'){
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/getPoetDetailData/' + options.id + '?user_id=' + that.data.user_id,
        success: res => {
          if (res.data) {
            console.log('----------success------------');
            // wx.setStorageSync('user',res.data);
            // console.log(res.data);
            this.setData({
              poet: res.data.poet,
              type: 'poet',
              t_id: res.data.poet.id
            });
            // wx.hideLoading();
          }
        }
      })
    }else if(options.type && options.type =='pin'){
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
          }
        }
      });
    }
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
    let user = wx.getStorageSync('user');
    console.log(e.detail.value.mind);
    // mind = e.detail.value.mind;
    let data = {
      content: e.detail.value.mind,
      t_id: e.detail.value.t_id,
      t_type: e.detail.value.t_type,
      p_id: e.detail.value.p_id,
      location: {
        'name':e.detail.value.l_name,
        'address':e.detail.value.l_address,
        'lat':e.detail.value.l_latitude,
        'lon':e.detail.value.l_longitude,
      },
      wx_token: wx.getStorageSync('wx_token')
    };
    // console.log(data);
    // create pin
    if (user && user.user_id < 1) {
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
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/createPin/'+user.user_id,
        data: data,
        success: (res)=>{
          // console.log(res);
          if(res.data && res.data.pin_id && res.data.pin_id>0){
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/find/index'
              });
            },1000)
          }else{
            wx.showToast({
              title: '发布失败,请重试',
              icon: none,
              duration: 2000
            })
          }
        }
      })
    }
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
});