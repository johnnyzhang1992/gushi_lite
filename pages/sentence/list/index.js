// pages/sentence/list/index.js
const app = getApp();
import {
	GET_SENTEMCE_DATA,
	LOADFAIL,
} from "../../../apis/request";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		poems: [],
		inputShowed: false,
		theme: "全部",
		type: "全部",
		total: 0,
		isSearch: false,
		_keyWord: ""
	},
	current_page: 1,
	last_page: 1,
	/**
	 * 获取名句详情
	 * @param {*} page
	 */
	getSentenceData: function(page) {
		let that = this;
		const { theme, type, _keyWord, isSearch } = this.data;
		const Page = page ? page : 1
		let data = {
			theme: theme || "全部",
			type: type || "全部",
			page: Page
		};
		if (isSearch) {
			data = {
				...data,
				keyWord: _keyWord
			};
		}
		GET_SENTEMCE_DATA("GET", data)
			.then(res => {
				wx.hideNavigationBarLoading();
				if (res.data && res.succeeded) {
					const { poems } = res.data;
					if (isSearch) {
						poems.data.map(item => {
							item.key = _keyWord;
							item.name = item.title;
							return item;
						});
					}
					that.setData({
						poems: Page>1 ? [...that.data.poems, ...poems.data] : poems.data,
						total: poems.total
					});
					that.current_page = poems.current_page;
					this.last_page = poems.last_page;
					wx.hideLoading();
					wx.stopPullDownRefresh();
				} else {
					LOADFAIL();
				}
			})
			.catch(err => {
				console.log(err);
				LOADFAIL();
			});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		const { theme, type, keyWord } = options;
		wx.setNavigationBarTitle({
			title: keyWord ? keyWord : `${theme} | ${type}`
		});
		wx.showLoading({
			title: "加载中"
		});
		this.setData(
			{
				theme: theme || "全部",
				type: type || "全部",
				isSearch: keyWord || false,
				_keyWord: keyWord || ""
			},
			() => {
				this.getSentenceData();
			}
		);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		wx.showNavigationBarLoading();
		this.getSentenceData(1);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		wx.showNavigationBarLoading();
		let that = this;
		let page = that.current_page + 1;
		if (this.current_page > this.last_page) {
			wx.hideNavigationBarLoading();
			return false;
		} else {
			that.getSentenceData(page);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
        const { theme, type, _keyWord, isSearch } = this.data;
		return {
			title: `${theme} | ${type}`,
			path: `/pages/sentence/list/index?theme=${theme}&type=${type}&_keyWord=${_keyWord}&isSearch=${isSearch}`,
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
