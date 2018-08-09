// pages/poem/detail/index.js
const app = getApp();
let _detail = null;
// let https = require('../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    poem: null,
    detail: null,
    poems_count:0,
    content:null,
    tags:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tab_lists: null,
    collect_status: false,
    _audio: null,
    animation: {}
  },
  // 获取用户id
  getUserId: function(){
    let user = wx.getStorageSync('user');
    let user_id = user ? user.user_id: 0;
    this.setData({
      user_id: user_id
    });
  },
  return: function () {
    if (this.data.user_id > 0) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
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
    } else {
      wx.navigateTo({
        url: '/pages/find/new/index?type=poem&id='+that.data.poem.id
      })
    }
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
    let cur = e.target.dataset.current;
    // console.log(cur);
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
    if(cur == 3){
      data = that.data.poem.background
    }else if (cur ==1){
      data = (that.data.detail && that.data.detail.yi) ? that.data.detail.yi.content : null
    }else if (cur == 0) {
      data = (that.data.detail && that.data.detail.zhu) ? that.data.detail.zhu.content: null;
      // for(let i = 0;i<data.length;i++){
      //   let _data = data[i].toString();
      //   data[i] = [_data.substr(0,_data.indexOf("：")),_data.substr(_data.indexOf("：")+1,_data.length)];
      // }
    }else if (cur == 2) {
      data = (that.data.detail && that.data.detail.shangxi) ? that.data.detail.shangxi.content:null
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
  audio: function(){
    wx.navigateTo({
      url: '/pages/poem/audio/index?id='+this.data.poem.id+'&title='+this.data.poem.title,
    })
  
  },
  copy: function(){
    let poem = this.data.poem;
    let _data = '《'+poem.title+'》'+poem.dynasty+'|'+poem.author+'\n'+poem.text_content;
    wx.setClipboardData({
      data: _data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '诗词复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 渲染tagList
  renderTagList: function () {
    if (_detail && _detail.yi) {
      _detail.yi = JSON.parse(_detail.yi)
    }
    if (_detail && _detail.zhu) {
      _detail.zhu = JSON.parse(_detail.zhu)
    }
    if (_detail && _detail.shangxi) {
      _detail.shangxi = JSON.parse(_detail.shangxi)
    }
    if (_detail && _detail.more_infos) {
      _detail.more_infos = JSON.parse(_detail.more_infos)
    }
    this.setData({
      detail: _detail,
      tab_lists: (_detail && _detail.zhu) ? _detail.zhu.content : null,
    })
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
    this.getUserId();
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
      url: 'https://xuegushi.cn/wxxcx/poem/'+options.id+'?user_id='+that.data.user_id,
      success: res => {
        if (res.data) {
          console.log('----------success------------');
          // console.log(res.data);
          _detail = res.data.detail;
          this.setData({
            poem: res.data.poem,
            // detail: res.data.detail,
            poems_count: res.data.poems_count,
            content:JSON.parse(res.data.poem.content),
            tags: (res.data.poem.tags && res.data.poem.tags !='') ? res.data.poem.tags.split(',') : [],
            // tab_lists: (res.data.detail && res.data.detail.zhu) ? res.data.detail.zhu.content : null,
            collect_status: res.data.poem.collect_status
          });
          wx.hideLoading();
          setTimeout(()=>{
            this.renderTagList();
          },800)
        }
      }
    });
  },
  // 更新收藏情况
  updateCollect: function () {
    let that = this;
    if(that.data.user_id<1){
      // https.userLogin(that.data.poem.id);
      wx.showModal({
        title: '提示',
        content: '登录后才可以收藏哦！',
        success: function(res) {
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
      wx.request({
        url: 'https://xuegushi.cn/wxxcx/' + that.data.poem.id + '/collect/poem?user_id=' + that.data.user_id + '&wx_token=' + wx.getStorageSync('wx_token'),
        success: res => {
          if(res.data){
            that.setData({
              collect_status: res.data.status
            })
          }else{
            that.setData({
              collect_status: res.data.status
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
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    animation.scale(1.3, 1.3).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.scale(1, 1).step()
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
    wx.showLoading({
      title: '刷新中...',
      mask: true
    });
    let that = this;
    this.getUserId();
    wx.request({
      url: 'https://xuegushi.cn/wxxcx/poem/'+this.data.poem.id+'?user_id='+that.data.user_id,
      success: res => {
        if (res.data) {
          console.log('----------refresh-success------------');
          _detail = res.data.detail;
          this.setData({
            poem: res.data.poem,
            // detail: res.data.detail,
            poems_count: res.data.poems_count,
            content:JSON.parse(res.data.poem.content),
            tags: res.data.poem.tags && res.data.poem.tags !='' ? res.data.poem.tags.split(',') : [],
            // tab_lists: (res.data.detail && $res.data.detail.zhu) ? res.data.detail.zhu.content : null,
            collect_status: res.data.poem.collect_status
          });
          wx.hideLoading();
          wx.stopPullDownRefresh();
          setTimeout(() => {
            that.renderTagList();
          }, 800)
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