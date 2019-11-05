// pages/me/poem/index.js
//获取应用实例
import {
    GET_USER_COLLECT,
    LOADFAIL,
    UPDATE_USER_COLLECT
} from "../../../apis/request";
let current_page = 1;
let last_page = 1;
Page({
    data: {
        user_id: 0,
        poems: [],
        p_total: 0,
        slideButtons: [
            {
                type: "warn",
                text: "删除",
                extClass: "test",
                src: "" // icon的路径
            }
        ]
    },
    // 获取用户id
    getUserId: function() {
        let user = wx.getStorageSync("user");
        let user_id = user ? user.user_id : 0;
        this.setData({
            user_id: user_id
        });
    },
    // 获取收藏的诗人列表
    getCollectPoem: function(page) {
        let that = this;
        if (page > last_page) {
            return false;
        }
        const data = {
            user_id: that.data.user_id,
            page: page + 1,
            type: "poem"
        };
        GET_USER_COLLECT("get", data)
            .then(res => {
                if (res.data) {
                    that.setData({
                        poems: [...that.data.poems, ...res.data.data.data],
                        p_total: res.data.data.total
                    });
                    current_page = res.data.data.current_page;
                    last_page = res.data.data.last_page;
                } else {
                    LOADFAIL();
                }
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            })
            .catch(error => {
                console.log(error);
                LOADFAIL();
            });
    },
    // 更新诗词收藏状态
    updateCollectPoem: function(e) {
        const { id } = e.currentTarget.dataset;
        const data = {
            id,
            user_id: this.data.user_id,
            type: 'poem'
        };
        const { poems } = this.data;
        UPDATE_USER_COLLECT("get", data)
            .then(res => {
                if (res.data && res.succeeded && !res.data.status) {
                    const Poems = poems.filter(item => {
                        return item.like_id !== id;
                    });
                    this.setData({
                        poems: Poems
                    })
                } else {
                    LOADFAIL();
                }
            })
            .catch(err => {
                console.log(err);
                LOADFAIL();
            });
    },
    onLoad: function() {
        this.getUserId();
        wx.showLoading({
            title: "加载中"
        });
        wx.setNavigationBarTitle({
            title: "诗词收藏"
        });
        this.getCollectPoem(0);
    },
    onReady: function() {
        // Do something when page ready.
    },
    onReachBottom: function() {
        this.getCollectPoem(current_page);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.setData(
            {
                poems: []
            },
            () => {
                this.getCollectPoem(0);
                wx.stopPullDownRefresh();
            }
        );
    },
    onShareAppMessage: function(res) {
        if (res.from === "button") {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: "个人中心",
            path: "/page/me/index",
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
