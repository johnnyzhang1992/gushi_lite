// pages/poem/audio/index.js
import {
	GET_POEM_AUDIO,
	GET_POEM_CONTENT,
	LOADFAIL,
} from "../../../apis/request";
let audioCtx = null;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		title: null,
		id: null,
		audio: null,
		poem: null,
		content: null,
		_audio: null,
	},
	// play
	audioPlay: function () {
		audioCtx.play();
	},
	// pause
	audioPause: function () {
		audioCtx.pause();
	},
	// seek
	audio14: function () {
		audioCtx.seek(14);
	},
	// start again
	audioStart: function () {
		audioCtx.seek(0);
		audioCtx.play();
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		wx.showLoading({
			title: "加载中",
		});
		wx.setNavigationBarTitle({
			title: options.title,
		});
		that.setData({
			title: options.title,
			id: options.id,
		});
		GET_POEM_CONTENT("GET", { id: options.id })
			.then((res) => {
				if (res.data && res.succeeded) {
					that.setData({
						poem: res.data.poem,
						content: JSON.parse(res.data.poem.content),
					});
					wx.hideLoading();
				} else {
					LOADFAIL();
				}
			})
			.then(() => {
				this.loadAudio();
			})
			.catch((error) => {
				console.log(error);
				LOADFAIL();
			});
	},
	/**
	 * 加载音频
	 */
	loadAudio: function () {
		let that = this;
		audioCtx = null;
		// 加载音频
		GET_POEM_AUDIO("GET", { id: that.data.id })
			.then((res) => {
				if (res.data && res.succeeded) {
					that.setData({
						_audio: res.data,
					});
					audioCtx = wx.createInnerAudioContext("myAudio");
					audioCtx.src = res.data.src;
					audioCtx.autoplay = true;
					audioCtx.obeyMuteSwitch = false;
					audioCtx.onPlay(() => {
						console.log("开始播放");
					});
					audioCtx.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
					// wx.hideLoading();
				} else {
					LOADFAIL("音频加载失败！");
				}
			})
			.catch((error) => {
				console.log(error);
				LOADFAIL();
			});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		if (audioCtx && audioCtx.stop) {
			audioCtx.stop();
		}
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		if (audioCtx && audioCtx.stop) {
			audioCtx.stop();
		}
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
