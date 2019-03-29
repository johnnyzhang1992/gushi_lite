// pages/poem/audio/index.js
const app = getApp();
let http = require('../../../utils/http.js');
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
    // play
    audioPlay: function() {
        this.audioCtx.play()
    },
    // pause
    audioPause: function() {
        this.audioCtx.pause()
    },
    // seek
    audio14: function() {
        this.audioCtx.seek(14)
    },
    // start again
    audioStart: function() {
        this.audioCtx.seek(0)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.showLoading({
            title: '加载中'
        });
        wx.setNavigationBarTitle({
            title: options.title
        });
        that.setData({
            title: options.title,
            id: options.id
        });
        http.request(app.globalData.url + '/wxxcx/getPoemContent/' + options.id, undefined).then(res => {
            if (res.data && res.succeeded) {
                console.log('----------success------------');
                // console.log(res.data);
                that.setData({
                    poem: res.data.poem,
                    content: JSON.parse(res.data.poem.content),
                });
                wx.hideLoading();
            } else {
                http.loadFailL()
            }
        }).catch(error => {
            console.log(error);
            http.loadFailL();
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let that = this;
        http.request(app.globalData.url + '/wxxcx/getPoemAudio/' + that.data.id, undefined).then(res => {
            if (res.data && res.succeeded) {
                // console.log(res.data);
                that.setData({
                    _audio: res.data
                });
                that.audioCtx = wx.createInnerAudioContext('myAudio');
                that.audioCtx.src = res.data.src;
                that.audioCtx.onPlay(() => {
                    console.log('开始播放')
                });
                that.audioCtx.onError((res) => {
                    console.log(res.errMsg);
                    console.log(res.errCode)
                });
                wx.hideLoading();
            } else {
                http.loadFailL('音频加载失败！')
            }
        }).catch(error => {
            console.log(error);
            http.loadFailL();
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
});