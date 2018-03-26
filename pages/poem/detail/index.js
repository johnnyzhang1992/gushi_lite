// pages/poem/detail/index.js
const app = getApp();
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
    tags:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tab_lists: null
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    this.changeTabContent(e.detail.current)
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    console.log(cur);
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    this.changeTabContent(cur)
  },
  // 根据tab改变刷新内容
  changeTabContent: function(cur){
    let that = this;
    let data = null;
    if(cur == 0){
      data = that.data.poem.background
    }else if (cur ==1){
      data = that.data.detail.yi.content
    }else if (cur == 2) {
      data = that.data.detail.zhu.content
    }else if (cur == 3) {
      data = that.data.detail.shangxi.content
    }else if(cur == 4){
      data = that.data.detail.more_infos ? that.data.detail.more_infos.content : []
    }
    that.setData({
      tab_lists: data
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '页面加载中...',
      mask: true
    });
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/poem/'+options.id,
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          // console.log(res.data);
          if(res.data.detail.yi){
            res.data.detail.yi = JSON.parse(res.data.detail.yi)
          }
          if (res.data.detail.zhu) {
            res.data.detail.zhu = JSON.parse(res.data.detail.zhu)
          }
          if (res.data.detail.shangxi) {
            res.data.detail.shangxi = JSON.parse(res.data.detail.shangxi)
          }
          if (res.data.detail.more_infos) {
            res.data.detail.more_infos = JSON.parse(res.data.detail.more_infos)
          }
          this.setData({
            poem_id: options.id,
            poem: res.data.poem,
            detail: res.data.detail,
            poems_count: res.data.poems_count,
            // author:res.data.author,
            content:JSON.parse(res.data.poem.content),
            tags: res.data.poem.tags && res.data.poem.tags !='' ? res.data.poem.tags.split(',') : [],
            tab_lists: res.data.detail.yi.content
          });
          wx.hideLoading();
        }
      }
    })
    footerTap: app.footerTap
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