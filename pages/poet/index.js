// pages/poem/poet/index.js
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
        poets: [],
        current_page: 1,
        last_page: 1,
        dynasty: ["全部", "先秦", "两汉", "魏晋", "南北朝", "隋代", "唐代", "五代", "宋代", "金朝", "元代", "明代", "清代", "近代"],
        d_index: 0,
        total: 0,
        is_search: false,
        _keyWord: null
    },
    // 跳转到搜索页面
    ngToSearch: function () {
        wx.navigateTo({
            url: '/pages/search/index'
        });
    },
    // 获取诗人列表
    getPoetData: function (d_index, page, keyWord) {
        let that = this;
        let _url = '';
        if (keyWord) {
            _url = app.globalData.url + '/wxxcx/getPoetData?keyWord=' + keyWord;
        } else {
            _url = app.globalData.url + '/wxxcx/getPoetData'
        }
        let data = {
            dynasty: that.data.dynasty[d_index ? d_index : 0],
            page: page
        };
        current_page = page;
        http.request(_url, data).then(res => {
            if (res.data && res.succeeded) {
                console.log('----------success------------');
                // wx.setStorageSync('user',res.data);
                // console.log(res.data);
                that.setData({
                    poets: current_page >1 ? that.data.poets.concat(res.data.poets.data) : res.data.poets.data,
                    total: res.data.poets.total
                });
                current_page = res.data.poets.current_page;
                last_page = res.data.poets.last_page;
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            } else {
                http.loadFailL()
            }
        }).catch(error => {
            console.log(error);
            http.loadFailL();
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        });
        if (options.type) {
            wx.setNavigationBarTitle({
                title: options.keyWord
            });
        } else {
            wx.setNavigationBarTitle({
                title: '古代诗人'
            });
        }
        that.setData({
            is_search: options.type ? true : false,
            _keyWord: options.keyWord ? options.keyWord : null
        });
        that.getPoetData(0, 1, options.keyWord);
    },
    // 检测朝代变化
    DynastyChange: function (e) {
        let that = this;
        let d_index = e.currentTarget.dataset.id;
        this.setData({
            d_index: d_index,
        });
        wx.setNavigationBarTitle({
            title: that.data.dynasty[d_index]
        });
        wx.showNavigationBarLoading();
        that.getPoetData(d_index, 1);
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
        let that = this;
        wx.showNavigationBarLoading();
        if (current_page > last_page) {
            wx.hideNavigationBarLoading();
            return false;
        }
        that.getPoetData(that.data.d_index, current_page + 1, that.data._keyWord);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '古代诗人一览',
            path: '/pages/poet/index',
            // imageUrl:'/images/poem.png',
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