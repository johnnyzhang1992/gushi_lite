// pages/find/index.js
const app = getApp();
let https = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '古诗文小助手',
    user_id: 0,
    current_page:1,
    total_page:0,
    tags: ['科普','故事','问与答'],
    items: null,
    imgUrls: null,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    animationData:{}
  },
  addNew: function () {
    let that = this;
    if (that.data.user_id < 1) {
      wx.showModal({
        title: '提示',
        content: '登录后才可以收藏哦！',
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
    }else{
      wx.navigateTo({
        url: '/pages/find/new/index'
      })
    }
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

    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getSliderImages',
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          this.setData({
            imgUrls: res.data
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
    wx.setNavigationBarTitle({
      title: '想法'
    });
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    animation.scale(1.3,1.3).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.scale(1,1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 500)
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})