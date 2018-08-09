// pages/poem/audio/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    id: null,
    audio: null,
    poem: null,
    content: null
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({ title: '加载中' });
    wx.setNavigationBarTitle({
      title: options.title
    })
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoemContent/' + options.id,
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          // console.log(res.data);
          this.setData({
            poem: res.data.poem,
            content:JSON.parse(res.data.poem.content),
          });
          wx.hideLoading();
        }
      }
    });
    this.setData({
      title: options.title,
      id: options.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/getPoemAudio/'+that.data.id,
      success: res => {
        if (res.data) {
          console.log(res.data);
          that.setData({
            _audio: res.data
          });
          that.audioCtx = wx.createAudioContext('myAudio');
          // const backgroundAudioManager = wx.getBackgroundAudioManager()

          // backgroundAudioManager.title = that.data.poem.title
          // backgroundAudioManager.epname = that.data.poem.title
          // backgroundAudioManager.singer = that.data.poem.title.author_name
          // backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
          // backgroundAudioManager.src = res.data.src // 设置了 src 之后会自动播放
          // const innerAudioContext = wx.createInnerAudioContext()
          // innerAudioContext.autoplay = true
          // innerAudioContext.src = res.data.src;
          // innerAudioContext.onPlay(() => {
          //   console.log('开始播放')
          // })
          // innerAudioContext.onError((res) => {
          //   console.log(res.errMsg)
          //   console.log(res.errCode)
          // })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '加载音频失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载音频失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})