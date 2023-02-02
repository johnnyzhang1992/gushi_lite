// pages/sentence/detail/index.js
const app = getApp();
import {
	GET_SENTEMCE_DETAIL,
	UPDATE_USER_COLLECT,
	LOADFAIL,
} from "../../../apis/request";
let authLogin = require("../../../utils/authLogin");
let findTimeOut = null;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		user_id: 0,
		author: null,
		sentence: null,
		poem: null,
		types: [],
		themes: [],
		collect_status: false,
		is_loading: true,
		animationData: {},
	},
	// 获取用户id
	getUserId: function () {
		let user = wx.getStorageSync("user");
		let user_id = user ? user.user_id : 0;
		this.setData({
			user_id: user_id,
		});
	},
	// 返回启动页
	return: function () {
		wx.switchTab({
			url: "/pages/index",
		});
	},
	// new find
	addNew: function () {
		let that = this;
		if (that.data.user_id < 1) {
			authLogin.authLogin(
				"/pages/poem/detail/index?id=" + that.data.poem.id,
				"nor",
				app
			);
		} else {
			wx.navigateTo({
				url: "/pages/find/new/index?type=poem&id=" + that.data.poem.id,
			});
		}
	},
	// 复制文本内容
	copy: function () {
		let sentence = this.data.sentence;
		let _data = sentence.title;
		wx.setClipboardData({
			data: _data,
			success: function (res) {
				wx.showToast({
					title: "诗词复制成功",
					icon: "success",
					duration: 2000,
				});ß
			},
		});
	},
	// 获取诗词详情
	getSentenceDetail: function (sentence_id, user_id) {
		let that = this;
		const data = {
			id: sentence_id,
			user_id,
		};
		//结果以Promise形式返回
		GET_SENTEMCE_DETAIL("GET", data)
			.then((res) => {
				if (res.data && res.succeeded) {
					if (res.data.sentence) {
						res.data.sentence.title_arr = that.splitSentence(
							res.data.sentence.title
						);
					}
					that.setData({
						sentence: res.data.sentence,
						author: res.data.author,
						poem: res.data.poem,
						collect_status: res.data.sentence.collect_status,
						is_loading: false,
						types:
							res.data.sentence.type && res.data.sentence.type != ""
								? res.data.sentence.type.split(",")
								: [],
						themes:
							res.data.sentence.theme && res.data.sentence.theme != ""
								? res.data.sentence.theme.split(",")
								: [],
					});
					wx.setNavigationBarTitle({
						title: res.data.sentence.origin,
					});
				} else {
					LOADFAIL();
				}
				wx.hideLoading();
				wx.stopPullDownRefresh();
				// that.getCodeImage("sentence", sentence_id);
			})
			.catch((err) => {
				console.log(err);
				LOADFAIL();
			});
	},
	// 拆分词句
	splitSentence: function (sentence) {
		// 替代特殊符号 。。
		let pattern = new RegExp("[。，.、!！?？]", "g");
		sentence = sentence.replace(/，/g, ",");
		sentence = sentence.replace(pattern, ",");
		return sentence.split(",").filter((item) => {
			return item;
		});
	},

	// 更新收藏情况
	updateCollect: function () {
		let that = this;
		const data = {
			id: that.data.sentence.id,
			type: "sentence",
			user_id: that.data.user_id,
		};
		if (that.data.user_id < 1) {
			authLogin.authLogin(
				"/pages/poem/detail/index?id=" + that.data.sentence.id,
				"nor",
				app
			);
		} else {
			UPDATE_USER_COLLECT("GET", data)
				.then((res) => {
					if (res.data && res.succeeded) {
						that.setData({
							collect_status: res.data.status,
						});
						if (res.data.status) {
							wx.showToast({
								title: "收藏成功",
								icon: "success",
								duration: 2000,
							});
						} else {
							wx.showToast({
								title: "取消收藏成功",
								icon: "success",
								duration: 2000,
							});
						}
					} else {
						that.setData({
							collect_status: res.data.status,
						});
					}
				})
				.catch((error) => {
					console.log(error);
					LOADFAIL();
				});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		wx.showLoading({
			title: "页面加载中...",
			mask: true,
		});
		this.getUserId();
		//  高度自适应
		wx.getSystemInfo({
			success: function (res) {
				let clientHeight = res.windowHeight,
					clientWidth = res.windowWidth,
					rpxR = 750 / clientWidth;
				let calc = clientHeight * rpxR - 180;
				// console.log(calc)
				that.setData({
					winHeight1: calc,
				});
			},
		});
		that.getSentenceDetail(options.id, that.data.user_id);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.hideLoading();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let animation = wx.createAnimation({
			transformOrigin: "50% 50%",
			duration: 500,
			timingFunction: "ease",
			delay: 0,
		});
		animation.scale(1.3, 1.3).step();
		this.setData({
			animationData: animation.export(),
		});
		findTimeOut = setTimeout(
			function () {
				animation.scale(1, 1).step();
				this.setData({
					animationData: animation.export(),
				});
			}.bind(this),
			500
		);
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		clearTimeout(findTimeOut);
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		clearTimeout(findTimeOut);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.showLoading({
			title: "刷新中...",
			mask: true,
		});
		let that = this;
		this.getUserId();
		that.setData({
			is_loading: true,
		});
		that.getSentenceDetail(that.data.sentence.id, that.data.user_id);
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let that = this;
		return {
			title: that.data.poem.title,
			path: "/pages/sentence/detail/index?id=" + that.data.sentence.id,
			// imageUrl:'/images/poem.png',
			success: function (res) {
				// 转发成功
				console.log("转发成功！");
			},
			fail: function (res) {
				// 转发失败
			},
		};
	},
});
