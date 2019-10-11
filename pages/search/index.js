// pages/search/index.js
const app = getApp();
let WxSearch = require("../../wxSearchView/wxSearchView.js");
let util = require("../../utils/util");
let http = require("../../utils/http");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        motto: "搜索古诗文",
        poems: null,
        poets: null,
        sentences: null,
        tags: null,
        keyWord: "",
        closeTips: false
    },
    // close tips
    closeTips: function() {
        wx.setStorageSync("closeTipsStatus", "close");
        this.setData({
            closeTips: true
        });
    },
    /**x
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "搜索"
        });
        // 2 搜索栏初始化
        let that = this;
        let hotKey = null;
        that.setData({
            keyWord: options && options.keyWord ? options.keyWord : ""
        });
        let tipsStatus = wx.getStorageSync("closeTipsStatus");
        if (tipsStatus && tipsStatus.length > 0) {
            that.setData({
                closeTips: true
            });
        }
        http.request(app.globalData.domain + "/getsHotSearch", undefined)
            .then(res => {
                if (res && res.succeeded) {
                    hotKey = res.data;
                }
                WxSearch.init(
                    that, // 本页面一个引用
                    hotKey ? hotKey : [], // 热点搜索推荐，[]表示不使用
                    [], // ,// 搜索匹配，[]表示不使用
                    that.mySearchFunction, // 提供一个搜索回调函数
                    that.myGobackFunction //提供一个返回回调函数
                );
            })
            .catch(error => {
                console.log(error);
                http.loadFailL();
            });
    },
    // 3 转发函数，固定部分，直接拷贝即可
    wxSearchInput: WxSearch.wxSearchInput, // 输入变化时的操作
    wxSearchKeyTap: WxSearch.wxSearchKeyTap, // 点击提示或者关键字、历史记录时的操作
    wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
    wxSearchConfirm: WxSearch.wxSearchConfirm, // 搜索函数
    wxSearchClear: WxSearch.wxSearchClear, // 清空函数
    // 4 搜索回调函数
    mySearchFunction: function(value) {
        // do your job here
        // console.log(value);
        wx.showNavigationBarLoading();
        let that = this;
        value = util.excludeSpecial(value);
        this.setData({
            keyWord: value
        });
        http.request(app.globalData.domain + "/search/" + value, undefined)
            .then(res => {
                if (res.data && res.succeeded) {
                    that.setData({
                        poems: res.data.poems ? res.data.poems : {},
                        poets: res.data.poets ? res.data.poets : {},
                        sentences: res.data.sentences ? res.data.sentences : {},
                        tags: res.data.tags ? res.data.tags : []
                    });
                    wx.hideNavigationBarLoading();
                }
            })
            .catch(error => {
                console.log(error);
                http.loadFailL();
            });
    },

    // 5 返回回调函数
    myGobackFunction: function() {
        // do your job here
        // 示例：返回
        wx.switchTab({
            url: "/pages/index"
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: "搜索 | 古诗文小助手",
            path: "/pages/search/index",
            // imageUrl:'/images/poem.png',
            success: function(res) {
                // 转发成功
                console.log("转发成功！");
            },
            fail: function(res) {
                // 转发失败
            }
        };
    }
});
