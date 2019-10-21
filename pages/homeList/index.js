// pages/poem/list/index.js
const app = getApp();
const apiDomain = app.globalData.domain;
let http = require("../../utils/http.js");
let current_page = 1;
let last_page = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        code: "",
        name: "",
        profile: "",
        poems: [],
        show_load: true
    },

    // 获取首页数据
    getHomeData: function(name, type) {
        let that = this;
        let data = null;
        let page = 1;
        let url = apiDomain + "/getHomeData";
        if (name && name != "") {
            url = url + "?name=" + name;
        }
        if (type && type == "more") {
            if (last_page < current_page) {
                return false;
            }
            page = current_page + 1;
            data = { page: page };
        }
        that.setData({
            show_load: true
        });
        wx.showNavigationBarLoading();
        http.request(url, data)
            .then(res => {
                if (res.data && res.succeeded) {
                    if (!app.globalData.hot) {
                        app.globalData.hot = res.data.hot[0];
                    }
                    that.setData({
                        poems:
                            page > 1
                                ? [...that.data.poems, ...res.data.poems.data]
                                : res.data.poems.data,
                        show_load: false
                    });
                    current_page = res.data.poems.current_page;
                    last_page = res.data.poems.last_page;
                } else {
                    http.loadFailL();
				}
				wx.stopPullDownRefresh();
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            })
            .catch(error => {
				console.log(error);
				wx.stopPullDownRefresh();
                http.loadFailL();
            });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		const { code, name, profile } = options;
		wx.showLoading({
            title: "加载中"
        });
		wx.setNavigationBarTitle({
			title: name
		  })
		this.setData({
			code,
			name,
			profile
		})
		this.getHomeData(code);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
	onPullDownRefresh: function () {
		current_page = 1;
		this.getHomeData(this.data.code);
	},

    /**
     * 页面上拉触底事件的处理函数
     */
    // 滚动到底部
    onReachBottom: function() {
        this.getHomeData(this.data.code, "more");
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});
