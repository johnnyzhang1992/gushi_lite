// pages/me/search/index.js
const app = getApp();
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_id: 0,
        lists: [],
        a_total: 0
    },
    // 获取用户id
    getUserId: function () {
        let user = wx.getStorageSync('user');
        let user_id = user ? user.user_id : 0;
        this.setData({
            user_id: user_id
        });
    },
    // 更新状态
    update: function (event) {
        let that = this;
        let id = event.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success: function (res) {
                if (res.confirm) {
                    http.request(app.globalData.url + '/wxxcx/search/' + id + '/update',undefined).then(res=>{
                        if (res.data && res.data.status == 200) {
                            that.data.lists.map(function (item, index) {
                                if (item.id == id) {
                                    console.log(item, index);
                                    that.data.lists.splice(index, 1)
                                }
                            });
                            that.setData({
                                lists: that.data.lists
                            });
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000
                            });
                        } else {
                            wx.showToast({
                                title: '删除失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                        http.loadFailL();
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 获取搜索列表
    getList: function (page) {
        let that = this;
        if (page > last_page) {
            return false;
        }
        http.request(app.globalData.url + '/wxxcx/search_list', { page: page + 1}).then(res => {
            if (res.data) {
                that.setData({
                    lists: [...that.data.lists,...res.data.data],
                    a_total: res.data.total
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserId();
        wx.showLoading({
            title: '加载中',
        });
        wx.setNavigationBarTitle({
            title: '搜索列表'
        });
        this.getList(0)
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
        this.getList(0);
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getList(current_page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});