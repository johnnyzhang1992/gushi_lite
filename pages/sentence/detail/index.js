// pages/sentence/detail/index.js
const app = getApp();
import {
	GET_SENTEMCE_DETAIL,
	UPDATE_USER_COLLECT,
	GET_WX_QRCODE,
	LOADFAIL
} from "../../../apis/request";
let until = require("../../../utils/util");
const canvas = require("../../../utils/canvas");
let authLogin = require("../../../utils/authLogin");
let findTimeOut = null;
let bg_image = "";
let filePath = "";
let codePath = "";
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
		filePath: null,
		DPR: 1,
		canvas_img: null,
		is_show: "visible",
		is_load: false,
		show_canvas: false,
		is_ipx: app.globalData.isIpx,
		dialogShow: false
	},
	dialogSave: function(params) {
		this.setData({
			dialogShow: false
		});
	},
	dialogCancel: function() {
		this.setData({
			dialogShow: false,
			show_canvas: false
		});
	},
	// 获取用户id
	getUserId: function() {
		let user = wx.getStorageSync("user");
		let user_id = user ? user.user_id : 0;
		this.setData({
			user_id: user_id
		});
	},
	// 返回启动页
	return: function() {
		wx.switchTab({
			url: "/pages/index"
		});
	},
	// new find
	addNew: function() {
		let that = this;
		if (that.data.user_id < 1) {
			authLogin.authLogin(
				"/pages/poem/detail/index?id=" + that.data.poem.id,
				"nor",
				app
			);
		} else {
			wx.navigateTo({
				url: "/pages/find/new/index?type=poem&id=" + that.data.poem.id
			});
		}
	},
	// 复制文本内容
	copy: function() {
		let sentence = this.data.sentence;
		let _data = sentence.title;
		wx.setClipboardData({
			data: _data,
			success: function(res) {
				wx.getClipboardData({
					success: function(res) {
						wx.showToast({
							title: "诗词复制成功",
							icon: "success",
							duration: 2000
						});
					}
				});
			}
		});
	},
	// 获取诗词详情
	getSentenceDetail: function(sentence_id, user_id) {
		let that = this;
		const data = {
			id: sentence_id,
			user_id
		};
		//结果以Promise形式返回
		GET_SENTEMCE_DETAIL("GET", data)
			.then(res => {
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
								: []
					});
					bg_image = res.data.bg_image;
					wx.setNavigationBarTitle({
						title: res.data.sentence.origin
					});
				} else {
					LOADFAIL();
				}
				wx.hideLoading();
				wx.stopPullDownRefresh();
				// that.getCodeImage("sentence", sentence_id);
			})
			.catch(err => {
				console.log(err);
				LOADFAIL();
			});
	},
	// 拆分词句
	splitSentence: function(sentence) {
		// 替代特殊符号 。。
		let pattern = new RegExp("[。，.、!！]", "g");
		sentence = sentence.replace(/，/g, ",");
		sentence = sentence.replace(pattern, ",");
		return sentence.split(",").filter(item => {
			return item;
		});
	},
	// context.font="italic small-caps bold 12px arial";
	// canvas 画图
	drawImage: function() {
		let that = this;
		let DPR = that.data.DPR;
		let winWidth = that.data.winWidth;
		let winHeight = that.data.winWidth/0.75;
		const scale = 1 / DPR;
		const ctx = wx.createCanvasContext("myCanvas");
		// 全局设置
		// ctx.setGlobalAlpha(0.8);
		let fontSize = 18 * DPR;
		ctx.setFontSize(fontSize)
		// 画布底图
		canvas.drawRect(ctx, 0, 0, winWidth * DPR, winHeight * DPR, "#fff");
		// 正文
		fontSize = 22 * DPR;
		const sentenceArr = this.splitSentence(that.data.sentence.title);
		let textX = winWidth * 0.85;
		sentenceArr.forEach(item => {
			canvas.drawTextVertical(
				ctx,
				item,
				textX * DPR,
				(winHeight * 0.15) * DPR,
				"center",
				"#333",
				fontSize
			);
			textX -= 40;
		});

		// canvas.drawText(
		// 	ctx,
		// 	that.data.sentence.title,
		// 	(winWidth * DPR) / 2,
		// 	(winHeight - 110) * DPR,
		// 	"center",
		// 	"#333",
		// 	(winWidth - 80) * DPR,
		// 	fontSize
		// );

		// 作者
		fontSize = 18 * DPR;
		let author = that.data.poem.author;
		canvas.drawTextVertical(
			ctx,
			author,
			winWidth*0.12 * DPR,
			(winHeight * 0.85-18*3) * DPR,
			"left",
			"#333",
			fontSize
		);
		// canvas.drawText(
		// 	ctx,
		// 	author,
		// 	(winWidth * DPR) / 2,
		// 	(winHeight - 85 - text_y) * DPR,
		// 	"center",
		// 	"#808080",
		// 	(winWidth - 90) * DPR,
		// 	fontSize
		// );

		// 二维码
		// let codePath = codePath ? codePath : "/images/xcx1.jpg";

		// let img_width = 30; // 半径
		// let img_x = (winWidth - 60) / 2; // 左上角横坐标
		// let img_y = winHeight - 80; // 左上角纵坐标
		// canvas.drawCircleImage(
		// 	ctx,
		// 	(img_width + 5) * DPR,
		// 	img_width * 2 * DPR,
		// 	(img_x + 30) * DPR,
		// 	(img_y + 30) * DPR,
		// 	img_x * DPR,
		// 	img_y * DPR,
		// 	codePath
		// );
		// 缩放
		ctx.scale(scale, scale);
		// 画图
		ctx.draw(true, () => {
			console.log("画图结束，生成临时图...");
			wx.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: winWidth * DPR,
				height: winHeight * DPR,
				destWidth: winWidth * 2,
				destHeight: winHeight * 2,
				canvasId: "myCanvas",
				success(res) {
					console.log(res);
					that.setData({
						is_show: "hidden",
						show_canvas: "visible",
						canvas_img: res.tempFilePath,
						is_load: true
					});
					wx.hideLoading();
					console.log(res.tempFilePath);
				}
			});
		});
	},
	// canvas 生成临时图
	canvasToImage: function() {
		console.log("---click---me");
		let that = this;
		that.setData({
			show_canvas: true,
			dialogShow: true
		});
		if (!that.data.canvas_img) {
			wx.showLoading({
				title: "图片生成中..."
			});
			that.drawImage();
			// until
			// 	.downImage(bg_image)
			// 	.then(res => {
			// 		console.log("背景图片下载完成---");
			// 		if (res && res.succeeded) {
			// 			filePath = res.tempFilePath;
			// 			console.log("canvas 画图中...");

			// 		}
			// 	})
			// 	.catch(error => {
			// 		console.log(error);
			// 		LOADFAIL()
			// 	});
		}
	},
	// 保存图片到本地
	saveImage: function() {
		let file_path = this.data.canvas_img;
		wx.showLoading({
			title: "正在保存图片..."
		});
		wx.saveImageToPhotosAlbum({
			filePath: file_path,
			success(res) {
				console.log(res);
				console.log("图片保存完成");
				wx.hideLoading();
				wx.showToast({
					title: "已保存成功",
					icon: "success",
					duration: 2000
				});
			},
			fail: res => {
				console.log(res);
				wx.hideLoading();
			}
		});
	},
	notSaveImage: function() {
		this.setData({
			show_canvas: false
		});
	},
	// 获取小程序码
	getCodeImage: function(type, id) {
		let _type = type ? type : "sentence";
		let path = "";
		let data = {
			type: _type,
			target_id: id,
			path: path,
			width: 300,
			id: id
		};
		GET_WX_QRCODE("GET", data)
			.then(res => {
				if (res.data && res.succeeded) {
					// 下载小程序码都本地
					until.downImage(res.data.file_name).then(res1 => {
						console.log(res1.tempFilePath);
						if (res1 && res1.succeeded) {
							codePath = res1.tempFilePath;
						}
					});
				} else {
					LOADFAIL();
				}
			})
			.catch(error => {
				console.log(error);
				LOADFAIL();
			});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let that = this;
		wx.showLoading({
			title: "页面加载中...",
			mask: true
		});
		this.getUserId();
		//  高度自适应
		wx.getSystemInfo({
			success: function(res) {
				let clientHeight = res.windowHeight,
					clientWidth = res.windowWidth,
					rpxR = 750 / clientWidth;
				let calc = clientHeight * rpxR - 180;
				// console.log(calc)
				that.setData({
					winHeight1: calc,
					DPR: res.devicePixelRatio,
					winHeight: clientHeight,
					winWidth: clientWidth
				});
			}
		});
		that.getSentenceDetail(options.id, that.data.user_id);
	},
	// 更新收藏情况
	updateCollect: function() {
		let that = this;
		const data = {
			id: that.data.sentence.id,
			type: "sentence",
			user_id: that.data.user_id
		};
		if (that.data.user_id < 1) {
			authLogin.authLogin(
				"/pages/poem/detail/index?id=" + that.data.sentence.id,
				"nor",
				app
			);
		} else {
			UPDATE_USER_COLLECT("GET", data)
				.then(res => {
					if (res.data && res.succeeded) {
						that.setData({
							collect_status: res.data.status
						});
					} else {
						that.setData({
							collect_status: res.data.status
						});
					}
				})
				.catch(error => {
					console.log(error);
					LOADFAIL();
				});
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		wx.hideLoading();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		let animation = wx.createAnimation({
			transformOrigin: "50% 50%",
			duration: 500,
			timingFunction: "ease",
			delay: 0
		});
		animation.scale(1.3, 1.3).step();
		this.setData({
			animationData: animation.export()
		});
		findTimeOut = setTimeout(
			function() {
				animation.scale(1, 1).step();
				this.setData({
					animationData: animation.export()
				});
			}.bind(this),
			500
		);
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		clearTimeout(findTimeOut);
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {
		clearTimeout(findTimeOut);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		wx.showLoading({
			title: "刷新中...",
			mask: true
		});
		let that = this;
		this.getUserId();
		that.setData({
			is_loading: true
		});
		that.getSentenceDetail(that.data.sentence.id, that.data.user_id);
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		let that = this;
		return {
			title: that.data.poem.title,
			path: "/pages/sentence/detail/index?id=" + that.data.sentence.id,
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
