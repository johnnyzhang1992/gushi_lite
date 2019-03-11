// pages/me/poem/index.js
//获取应用实例
const app = getApp();
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({
    data: {
        user_id: 0,
        poems: [],
        p_total: 0
    },
    // 获取用户id
    getUserId: function () {
        let user = wx.getStorageSync('user');
        let user_id = user ? user.user_id : 0;
        this.setData({
            user_id: user_id
        });
    },
    // 获取收藏的诗人列表
    getCollectPoem: function (page) {
        let that = this;
        if (page > last_page) {
            return false;
        }
        http.request(app.globalData.url + '/wxxcx/getCollect/' + that.data.user_id, { page: page + 1, type: 'poem' }).then(res => {
            if (res.data) {
                that.setData({
                    poems: [...that.data.poems,...res.data.data.data],
                    p_total: res.data.data.total
                });
                current_page = res.data.data.current_page;
                last_page = res.data.data.last_page
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
    onLoad: function () {
        this.getUserId();
        wx.showLoading({
            title: '加载中',
        });
        wx.setNavigationBarTitle({
            title: '诗词收藏'
        });
        this.getCollectPoem(0)
    },
    onReady: function () {
        // Do something when page ready.
    },
    onReachBottom: function () {
        this.getCollectPoem(current_page)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.getCollectPoem(0);
        wx.stopPullDownRefresh()
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '个人中心',
            path: '/page/me/index',
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