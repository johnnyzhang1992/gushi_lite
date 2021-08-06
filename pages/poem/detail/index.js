// pages/poem/detail/index.js
import {
	GET_POEM_DETAIL,
	UPDATE_USER_COLLECT,
	LOADFAIL,
} from "../../../apis/request";
let authLogin = require("../../../utils/authLogin");
const app = getApp();
let poem_detail = {};

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		user_id: 0,
		poem: null,
		content: null,
		tags: [],
		winHeight: "", //窗口高度
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
		tab_lists: null,
		collect_status: false,
		is_loading: true,
		animation: {},
		is_load: false,
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
	// 滚动切换标签样式
	switchTab: function (e) {
		this.setData(
			{
				currentTab: e.detail.current,
			},
			() => {
				this.checkCor();
				this.changeTabContent(e.detail.current);
			}
		);
	},
	// 点击标题切换当前页时改变样式
	swichNav: function (e) {
		let cur = e.target.dataset.current;
		// console.log(cur);
		if (this.data.currentTaB == cur) {
			return false;
		} else {
			this.setData({
				currentTab: cur,
			});
		}
		this.changeTabContent(cur);
	},
	// 根据tab改变刷新内容
	changeTabContent: function (cur) {
		let that = this;
		let data = null;
		if (cur == 3) {
			data = that.data.poem.background;
		} else if (cur == 1) {
			data = poem_detail && poem_detail.yi ? poem_detail.yi.content : null;
		} else if (cur == 0) {
			data = poem_detail && poem_detail.zhu ? poem_detail.zhu.content : null;
		} else if (cur == 2) {
			data =
				poem_detail && poem_detail.shangxi ? poem_detail.shangxi.content : null;
		} else if (cur == 4) {
			data = poem_detail.more_infos ? poem_detail.more_infos.content : [];
		}
		that.setData({
			tab_lists: data,
		});
	},
	//判断当前滚动超过一屏时，设置tab标题滚动条。
	checkCor: function () {
		if (this.data.currentTab > 4) {
			this.setData({
				scrollLeft: 300,
			});
		} else {
			this.setData({
				scrollLeft: 0,
			});
		}
	},
	// 跳转到音频页面
	audio: function () {
		wx.navigateTo({
			url:
				"/pages/poem/audio/index?id=" +
				this.data.poem.id +
				"&title=" +
				this.data.poem.title,
		});
	},
	// 复制诗词内容
	copy: function () {
		let poem = this.data.poem;
		let _data =
			"《" +
			poem.title +
			"》" +
			poem.dynasty +
			"|" +
			poem.author +
			"\n" +
			poem.text_content;
		wx.setClipboardData({
			data: _data,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: "诗词复制成功",
							icon: "success",
							duration: 2000,
						});
					},
				});
			},
		});
	},
	// 渲染tagList
	renderTagList: function () {
		let _detail = poem_detail;
		if (_detail && _detail.yi) {
			_detail.yi = JSON.parse(_detail.yi);
		}
		if (_detail && _detail.zhu) {
			_detail.zhu = JSON.parse(_detail.zhu);
		}
		if (_detail && _detail.shangxi) {
			_detail.shangxi = JSON.parse(_detail.shangxi);
		}
		if (_detail && _detail.more_infos) {
			_detail.more_infos = JSON.parse(_detail.more_infos);
		}
		this.setData({
			tab_lists: _detail && _detail.zhu ? _detail.zhu.content : null,
		});
		poem_detail = _detail;
	},
	// 获取诗词详情
	getPoemDetail: function (poem_id, user_id) {
		let that = this;
		const data = {
			id: poem_id,
			user_id,
		};
		//结果以Promise形式返回
		GET_POEM_DETAIL("GET", data)
			.then((res) => {
				if (res.data && res.succeeded) {
					that.setData({
						poem: res.data.poem,
						content: JSON.parse(res.data.poem.content),
						tags:
							res.data.poem.tags && res.data.poem.tags != ""
								? res.data.poem.tags.split(",")
								: [],
						collect_status: res.data.poem.collect_status,
						is_loading: false,
					});
					wx.setNavigationBarTitle({
						title: res.data.poem.title,
					});
					poem_detail = res.data.detail;
				} else {
					LOADFAIL();
				}
			})
			.then(() => {
				that.renderTagList();
			})
			.catch((err) => {
				console.log(err);
				LOADFAIL();
			});
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
					winHeight1: calc
				});
			},
		});
		that.getPoemDetail(options.id, that.data.user_id);
	},
	// 更新收藏情况
	updateCollect: function () {
		let that = this;
		// 判断登陆情况
		if (that.data.user_id < 1) {
			authLogin.authLogin(
				"/pages/poem/detail/index?id=" + that.data.poem.id,
				"nor",
				app
			);
		} else {
			let data = {
				user_id: that.data.user_id,
				wx_token: wx.getStorageSync("wx_token"),
				id: that.data.poem.id,
				type: "poem",
			};
			UPDATE_USER_COLLECT("GET", data)
				.then((res) => {
					if (res.data && res.succeeded) {
						that.setData({
							collect_status: res.data.status,
						});
					} else {
						LOADFAIL("更新状态失败，请重试");
					}
				})
				.catch((error) => {
					console.log(error);
					LOADFAIL();
				});
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.hideLoading();
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let that = this;
		return {
			title: `${that.data.poem.title} | 古诗文小助手`,
			path: "/pages/poem/detail/index?id=" + that.data.poem.id,
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
