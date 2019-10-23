// pages/sentence/list/index.js
const app = getApp();
let http = require("../../../utils/http");
let current_page = 1;
let last_page = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        poems: [],
        inputShowed: false,
        theme: '全部',
        type: '全部',
        total: 0,
        isSearch: false,
        _keyWord: ''
    },
    /**
     * 获取名句详情
     * @param {*} page
     */
    getSentenceData: function(page) {
        let that = this;
        const { theme, type, _keyWord, isSearch } = this.data;
        let data = {
            theme: theme|| '全部',
            type: type || '全部',
            page: page ? page : 1
        };
        // console.log(data);
        let url = app.globalData.url + "/wxxcx/getSentenceData";
        if (isSearch) {
            url = url + "?keyWord=" + _keyWord;
        }
        http.request(url, data).then(res => {
            wx.hideNavigationBarLoading();
            if (res.data && res.succeeded) {
                console.log("----------success------------");
                const { poems } = res.data;
                if (isSearch) {
                    poems.data.map(item => {
                        item.key = _keyWord;
                        item.name = item.title;
                        return item;
                    });
                }
                that.setData({
                    poems: [...that.data.poems, ...poems.data],
                    total: poems.total
                });
                current_page = poems.current_page;
                last_page = poems.last_page;
				wx.hideLoading();
				wx.stopPullDownRefresh();
            } else {
                http.loadFailL();
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		const { theme, type, isSearch, keyWord } = options;
		console.log(options);
		wx.setNavigationBarTitle({
			title: keyWord ? keyWord : `${theme} | ${type}`
		});
		wx.showLoading({
            title: "加载中"
        });
        this.setData(
            {
				theme: theme || '全部',
				type: type || '全部',
				isSearch: keyWord || false,
				_keyWord: keyWord || ''
            },
            () => {
                this.getSentenceData();
            }
        );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        let page = 1;
        this.getSentenceData(page);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
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
		const { theme, type } = this.data;
		return {
            title: `${theme} | ${type}`,
            path: "/pages/sentence/list/index",
            // imageUrl: '/images/poem.png',
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
