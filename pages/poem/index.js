// pages/poem/index.js
const app = getApp();
let http = require('../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        motto: '古诗文小助手',
        poems: [],
        types: ["全部", "诗", "词", "曲", "文言文"],
        dynasty: ["全部", "先秦", "两汉", "魏晋", "南北朝", "隋代", "唐代", "五代", "宋代", "金朝", "元代", "明代", "清代", "近代"],
        d_index: 0,
        t_index: 0,
        total: 0,
        is_search: false,
        _type: null,
        _keyWord: null
    },
    // 获取诗词数据
    getPoemData: function (type, keyWord, _type, page) {
        let that = this;
        return new Promise((resolve, reject) => {
            // resolve(Object.assign(res.data, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
            let data = {
                page: page ? page : 1,
                type: _type ? _type : '全部',
                _type: type ? type : null,
                keyWord: keyWord ? keyWord : null,
                dynasty: that.data.dynasty[that.data.d_index] ? that.data.dynasty[that.data.d_index] : '全部',
            };
            http.request(app.globalData.domain + '/getPoemData', data).then(res => {
                if (res.data && res.succeeded) {
                    that.setData({
                        is_search: keyWord ? true : false,
                        poems: page > 1 ? that.data.poems.concat(res.data.poems.data) : res.data.poems.data,
                        total: res.data.poems.total,
                        _type: type ? type : null,
                        _keyWord: keyWord ? keyWord : null
                    });
                    current_page = res.data.poems.current_page;
                    last_page = res.data.poems.last_page;
                    wx.hideLoading();
                    resolve(Object.assign(res.data, { succeeded: true })); //成功失败都resolve，并通过succeeded字段区分
                } else {
                    reject(Object.assign(res.data, { succeeded: false })); //成功失败都resolve，并通过succeeded字段区分
                }
            });
        });
    },
    // 跳转到搜索页面
    ngToSearch: function () {
        wx.navigateTo({
            url: '/pages/search/index'
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (options.type) {
            wx.setNavigationBarTitle({
                title: options.keyWord,
                _keyWord: options.keyWord
            });
            that.setData({
                _type : options.type
            })
        }
        wx.showLoading({
            title: '加载中',
        });
        that.getPoemData(options.type, options.keyWord).then((res) => {
            if (res && res.succeeded) {
                wx.hideNavigationBarLoading()
            } else {
                http.loadFailL('加载数据失败，请下拉重试。')
            }
        }).catch(error=>{
            console.log(error);
            http.loadFailL();
        });
    },
    // 检测变化
    filterPoem: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        if(type =='dynasty'){
            this.setData({
                d_index: id
            });
        }else{
            that.setData({
                t_index: id
            });
        };

        wx.setNavigationBarTitle({
            title: that.data.dynasty[that.data.d_index] + ' | ' + that.data.types[that.data.t_index]
        });
        wx.showNavigationBarLoading();
        that.getPoemData(that.data._type, that.data.keyWord, that.data.types[that.data.t_index], 1).then((res) => {
            if (res && res.succeeded) {
                wx.hideNavigationBarLoading()
            } else {
                http.loadFailL('加载数据失败，请下拉重试。');
            }
        }).catch(error=>{
            console.log(error);
            http.loadFailL();
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '古诗文'
        });
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
        let that = this;
        wx.showNavigationBarLoading();
        if (current_page > last_page) {
            wx.hideNavigationBarLoading();
            return false;
        }
        that.getPoemData(that.data._type, that.data._keyWord, that.data.types[that.data.t_index], current_page + 1).then((res) => {
            if (res && res.succeeded) {
                wx.hideNavigationBarLoading()
            } else {
                http.loadFailL('加载数据失败，请下拉重试。');
            }
        }).catch(error=>{
            console.log(error);
            http.loadFailL();
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '古诗文',
            path: '/pages/poem/index',
            // imageUrl:'/images/poem.png',
            success: function (res) {
                // 转发成功
                console.log('转发成功！')
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
});