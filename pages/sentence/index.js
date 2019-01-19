// pages/poem/sentence/index.js
const app = getApp();
let http = require('../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        poems: null,
        inputShowed: false,
        themes: [],
        types: [],
        _types: [],
        th_index: 0,
        ty_index: 0,
        total: 0,
        isSearch: false,
        _keyWord: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let _url = '';
        wx.showLoading({
            title: '加载中',
        });
        if (options.type) {
            wx.setNavigationBarTitle({
                title: options.keyWord
            });
        } else {
            wx.setNavigationBarTitle({
                title: '热门名句'
            });
        }
        if (options.type) {
            _url = app.globalData.url + '/wxxcx/getSentenceData?keyWord=' + options.keyWord;
        } else {
            _url = app.globalData.url + '/wxxcx/getSentenceData'
        }
        that.setData({
            isSearch: options.type ? true : false,
            _keyWord: options.keyWord ? options.keyWord : null
        });
        http.request(_url, undefined).then(res => {
            if (res.data && res.succeeded) {
                console.log('----------success------------');
                // wx.setStorageSync('user',res.data);
                // console.log(res.data);
                that.setData({
                    poems: res.data.poems.data,
                    themes: res.data.themes,
                    _types: res.data.types,
                    types: res.data.types[0].types,
                    total: res.data.poems.total,
                    isSearch: options.type ? true : false,
                    _keyWord: options.keyWord ? options.keyWord : null
                });
                current_page = res.data.poems.current_page;
                last_page = res.data.poems.last_page;
                wx.hideLoading();
            } else {
                http.loadFailL();
            }
        });
    },
    // 获取名句数据
    getSentenceData: function (page) {
        let that = this;
        let data = {
            theme: that.data.themes[that.data.th_index],
            type: that.data.types[that.data.ty_index],
            page: page ? page : 1
        };
        console.log(data);
        let url = app.globalData.url + '/wxxcx/getSentenceData';
        http.request(url, data).then(res => {
            wx.hideNavigationBarLoading();
            if (res.data && res.succeeded) {
                console.log('----------success------------');
                // wx.setStorageSync('user',res.data);
                // console.log(res.data);
                that.setData({
                    poems: page > 1 ? that.data.poems.concat(res.data.poems.data) : res.data.poems.data,
                    current_page: res.data.poems.current_page,
                    last_page: res.data.poems.last_page,
                    total: res.data.poems.total
                });
                wx.hideLoading();
            } else {
                http.loadFailL();
            }
        })
    },
    // 检测主题变化
    ThemeChange: function (e) {
        let that = this;
        let theme_index = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : 0;
        this.setData({
            th_index: theme_index,
            types: that.data._types[theme_index>0 ? theme_index-1 : 0].types,
            ty_index: 0
        });
        wx.setNavigationBarTitle({
            title: that.data.themes[theme_index]
        });
        wx.showNavigationBarLoading();
        that.getSentenceData(1);
    },
    // 检测类型变化
    TypeChange: function (e) {
        let that = this;
        let type_index= e.currentTarget.dataset.id ? e.currentTarget.dataset.id: 0;
        this.setData({
            ty_index: type_index
        });
        wx.setNavigationBarTitle({
            title: that.data.themes[that.data.th_index] + ' | ' + that.data.types[type_index]
        });
        wx.showNavigationBarLoading();
        that.getSentenceData(1);
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
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showNavigationBarLoading();
        let that = this;
        let page = current_page + 1;
        if (current_page > last_page) {
            wx.hideNavigationBarLoading();
            return false;
        } else {
            that.getSentenceData(page);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '名句赏析',
            path: '/pages/sentence/index',
            imageUrl: '/images/poem.png',
            success: function (res) {
                // 转发成功
                console.log('转发成功！')
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
});