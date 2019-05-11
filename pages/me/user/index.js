// pages/me/user/index.js
const app = getApp();
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        users: [],
        u_total: 0
    },
    // 获取用户列表
    getUserList: function (page) {
        let that = this;
        if (page > last_page) {
            return false;
        }
        http.request(app.globalData.url + '/wxxcx/getUserList', { page: page + 1}).then(res => {
            if (res.data) {
                that.setData({
                    users: [...that.data.users,...res.data.data],
                    u_total: res.data.total
                });
                current_page = res.data.current_page;
                last_page = res.data.last_page;
            } else {
                http.loadFailL();
            }
            wx.hideLoading();
            wx.hideNavigationBarLoading()
        }).catch(error => {
            console.log(error);
            http.loadFailL();
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        });
        wx.setNavigationBarTitle({
            title: '用户列表'
        });
        this.getUserList(0);
    },
    checkSysInfo: function (event) {
        let id = event.currentTarget.dataset.id;
        console.log(id);
        let that = this;
        wx.showModal({
            title: '设备信息',
            content: that.data.users[id].systemInfo,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
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
        wx.showNavigationBarLoading();
        this.getUserList(0);
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // Do something when page reach bottom.
        wx.showNavigationBarLoading();
        this.getUserList(current_page)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})