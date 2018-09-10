// pages/find/topic/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: '',
    user_id: 0,
    wxSearchData: null,
    topic:null,
    userInfo: wx.getStorageSync('user'),
  },
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
    wx.setNavigationBarTitle({
      title: '关于"'+options.keyWord+'"的诗词'
    });
    // 2 搜索栏初始化
    let that = this;
    that.setData({
      keyWord: options && options.keyWord ? options.keyWord : ''
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getRecentTopic',
      success: res =>{
        if(res.data){
          console.log('----------success------------');
          this.setData({
            topic: res.data
          });
          wx.hideLoading();
          this.getResult();
        }
      }
    });

  },
  getResult: function(th){
    let keyWord = this.data.keyWord;
    let that = this;
    let temData = {};
    let barHeight = 43;
    let view = {
      barHeight: barHeight
    };
  
    wx.getSystemInfo({
      success: function (res) {
        let wHeight = res.windowHeight;
        view.seachHeight = wHeight - barHeight;
        temData.view = view;
        that.setData({
          wxSearchData: temData
        });
      }
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/search/' + keyWord + '?wx_token=' +wx.getStorageSync('wx_token')+'&user_id='+that.data.user_id,
      success: function (res) {
        // console.log(res.data);
        that.setData({
          poems: res.data ? res.data.poems : null,
          poets: res.data ? res.data.poets : null,
          sentences: res.data ? res.data.sentences : null,
          tags: res.data.tags
        });
        wx.hideNavigationBarLoading()
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
    this.getResult();
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
    let keyWord = this.data.keyWord;
    return {
      title: '关于"'+keyWord+'"的诗词',
      path: '/pages/find/topic/index',
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