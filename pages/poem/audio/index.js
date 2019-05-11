// pages/poem/audio/index.js
const app = getApp();
let http = require('../../../utils/http.js');
let audioCtx = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: null,
        id: null,
        audio: null,
        poem: null,
        content: null,
        _audio: null
    },
    // play
    audioPlay: function() {
        audioCtx.play()
    },
    // pause
    audioPause: function() {
        audioCtx.pause()
    },
    // seek
    audio14: function() {
        audioCtx.seek(14)
    },
    // start again
    audioStart: function() {
        audioCtx.seek(0)
        audioCtx.play();
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
        }).then(() => {
            this.loadAudio();
         }).catch(error => {
            console.log(error);
            http.loadFailL();
        });
     
    },
    /**
     * 加载音频
     */
    loadAudio: function () { 
        let that = this;
           // 加载音频
           http.request(app.globalData.url + '/wxxcx/getPoemAudio/' + that.data.id, undefined).then(res => {
            if (res.data && res.succeeded) {
                // console.log(res.data);
                console.log('--音频加载成功')
                that.setData({
                    _audio: res.data
                });
                audioCtx = wx.createInnerAudioContext('myAudio');
                audioCtx.src = res.data.src;
                audioCtx.autoplay = true;
                audioCtx.obeyMuteSwitch = false;
                audioCtx.onPlay(() => {
                    console.log('开始播放')
                });
                audioCtx.onError((res) => {
                    console.log(res.errMsg);
                    console.log(res.errCode)
                });
                // wx.hideLoading();
            } else {
                http.loadFailL('音频加载失败！')
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
        audioCtx.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        audioCtx.destroy();
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