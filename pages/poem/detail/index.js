// pages/poem/detail/index.js
const app = getApp();
import {
	GET_POEM_DETAIL,
	UPDATE_USER_COLLECT,
	GET_WX_QRCODE,
	LOADFAIL
} from "../../../apis/request";
let until = require("../../../utils/util");
const canvas = require("../../../utils/canvas");
let authLogin = require("../../../utils/authLogin");
let bg_image = "";
let poem_detail = {};
let filePath = "";
let codePath = "";
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
		canvasHeight: 0,
		currentTab: 0, //预设当前项的值
		scrollLeft: 0, //tab标题的滚动条位置
		tab_lists: null,
		collect_status: false,
		is_loading: true,
		animation: {},
		pixelRatio: 1,
		canvas_img: null,
		is_show: "visible",
		is_load: false,
		show_canvas: false,
		is_ipx: app.globalData.isIpx,
		dialogShow: false,
		add_qrcode: false
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
	// 滚动切换标签样式
	switchTab: function(e) {
		this.setData(
			{
				currentTab: e.detail.current
			},
			() => {
				this.checkCor();
				this.changeTabContent(e.detail.current);
			}
		);
	},
	// 点击标题切换当前页时改变样式
	swichNav: function(e) {
		let cur = e.target.dataset.current;
		// console.log(cur);
		if (this.data.currentTaB == cur) {
			return false;
		} else {
			this.setData({
				currentTab: cur
			});
		}
		this.changeTabContent(cur);
	},
	// 根据tab改变刷新内容
	changeTabContent: function(cur) {
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
			tab_lists: data
		});
	},
	//判断当前滚动超过一屏时，设置tab标题滚动条。
	checkCor: function() {
		if (this.data.currentTab > 4) {
			this.setData({
				scrollLeft: 300
			});
		} else {
			this.setData({
				scrollLeft: 0
			});
		}
	},
	// 跳转到音频页面
	audio: function() {
		wx.navigateTo({
			url:
				"/pages/poem/audio/index?id=" +
				this.data.poem.id +
				"&title=" +
				this.data.poem.title
		});
	},
	// 复制诗词内容
	copy: function() {
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
	// 渲染tagList
	renderTagList: function() {
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
			tab_lists: _detail && _detail.zhu ? _detail.zhu.content : null
		});
		poem_detail = _detail;
	},
	// 获取诗词详情
	getPoemDetail: function(poem_id, user_id) {
		let that = this;
		const data = {
			id: poem_id,
			user_id
		};
		//结果以Promise形式返回
		GET_POEM_DETAIL("GET", data)
			.then(res => {
				if (res.data && res.succeeded) {
					that.setData({
						poem: res.data.poem,
						content: JSON.parse(res.data.poem.content),
						tags:
							res.data.poem.tags && res.data.poem.tags != ""
								? res.data.poem.tags.split(",")
								: [],
						collect_status: res.data.poem.collect_status,
						is_loading: false
					});
					wx.setNavigationBarTitle({
						title: res.data.poem.title
					});
					bg_image = res.data.bg_image;
					poem_detail = res.data.detail;
				} else {
					LOADFAIL();
				}
			})
			.then(() => {
				that.renderTagList();
			})
			.catch(err => {
				console.log(err);
				LOADFAIL();
			});
	},
	dialogSave: function() {
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
	addQrcode: function() {
		const { add_qrcode } = this.data;
		if (add_qrcode) {
			this.setData(
				{
					add_qrcode: false,
					is_load: false
				},
				() => {
					this.drawImage();
				}
			);
		} else {
			this.setData(
				{
					add_qrcode: true,
					is_load: false
				},
				() => {
					this.drawImage(true);
				}
			);
		}
	},
	// canvas 画图
	drawImage: function(add_qrcode) {
		let that = this;
		let content = that.data.content.content;
		let poemType = that.data.poem.type;
		let pixelRatio = that.data.pixelRatio;
		let winWidth = that.data.winWidth;
		const scale = 1 / pixelRatio;
		const ctx = wx.createCanvasContext(add_qrcode ? "myCanvas1" : "myCanvas");
		// 全局设置
		// ctx.setGlobalAlpha(0.8);
		let font_size = 16 * pixelRatio;
		ctx.setFontSize(font_size);
		ctx.font = `normal normal normal ${font_size}px/${font_size +
			20 * pixelRatio}px FangSong, STSong, STZhongsong,"Microsoft YaHei"`;
		// 计算画布高度
		let canvasHeight = 140;
		if (add_qrcode) {
			canvasHeight += 90;
		}
		// 计算标题高度
		let titleArr = [];
		titleArr = canvas.breakLinesForCanvas(
			ctx,
			that.data.poem.title,
			winWidth * 0.8 * pixelRatio,
			18 * pixelRatio
		);
		canvasHeight += titleArr.length * 18;
		// 计算正文
		let result = [];
		font_size = 16 * pixelRatio;
		content.forEach(item => {
			const itemArr = canvas.breakLinesForCanvas(
				ctx,
				poemType === "诗" ? item : "    " + item,
				winWidth * 0.8 * pixelRatio,
				font_size
			);
			result.push(itemArr);
		});
		result.forEach(item => {
			canvasHeight =
				canvasHeight + (Array.isArray(item) ? item.length * 28 : 28);
			if (poemType !== "诗") {
				canvasHeight += 20;
			}
		});
		canvasHeight -= 20;
		// 计算二维码高度
		that.setData({
			canvasHeight: canvasHeight
		});
		// 清空画板
		ctx.clearRect(0, 0, winWidth * pixelRatio, canvasHeight * pixelRatio);
		// 画布背景
		canvas.drawRect(
			ctx,
			0,
			0,
			winWidth * pixelRatio,
			canvasHeight * pixelRatio,
			"#fff"
		);
		// 诗词内容
		let text_y = 30 * pixelRatio;
		let line_number = result.length;
		// 标题
		font_size = 18 * pixelRatio;
		titleArr.forEach(item => {
			canvas.drawText(
				ctx,
				item,
				(winWidth * pixelRatio) / 2,
				text_y * pixelRatio,
				"center",
				"#333",
				(winWidth - 80) * pixelRatio,
				font_size
			);
			text_y += 18;
		});
		text_y += 20;
		// 作者
		font_size = 16 * pixelRatio;
		let author = `[${that.data.poem.dynasty}] ${that.data.poem.author}`;
		canvas.drawText(
			ctx,
			author,
			(winWidth * pixelRatio) / 2,
			text_y * pixelRatio,
			"center",
			"#333",
			(winWidth - 90) * pixelRatio,
			font_size
		);
		text_y = text_y + 40;
		// 古诗词正文
		line_number = 0;
		result.forEach(item => {
			item.forEach(_item => {
				line_number = line_number + 1;
				canvas.drawText(
					ctx,
					_item,
					poemType === "诗"
						? (winWidth / 2) * pixelRatio
						: winWidth * 0.1 * pixelRatio,
					text_y * pixelRatio,
					poemType === "诗" ? "center" : "left",
					"#333",
					winWidth * 0.8 * pixelRatio,
					font_size
				);
				text_y = text_y + 24;
			});
			if (poemType !== "诗") {
				text_y += 20;
			}
		});
		// 二维码
		if (add_qrcode) {
			font_size = 10 * pixelRatio;
			let _codePath = codePath ? codePath : "/images/xcx1.jpg";
			let img_width = 60;
			let img_x = winWidth / 2;
			let img_y = text_y;
			canvas.drawCircleImage(
				ctx,
				(img_width / 2 + 5) * pixelRatio,
				img_width * pixelRatio,
				img_x * pixelRatio,
				(img_y + img_width / 2 + 5) * pixelRatio,
				(img_x - img_width / 2) * pixelRatio,
				(img_y + 5) * pixelRatio,
				_codePath
			);
			text_y += 80;
			canvas.drawText(
				ctx,
				"古诗文小助手",
				(winWidth / 2) * pixelRatio,
				text_y * pixelRatio,
				"center",
				"#333",
				winWidth * 0.8 * pixelRatio,
				font_size
			);
		}

		// 缩放
		ctx.scale(scale, scale);
		console.log("---huatu" + add_qrcode);
		// 画图
		ctx.draw(true, () => {
			console.log("画图结束，生成临时图...");
			wx.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: winWidth * pixelRatio,
				height: canvasHeight * pixelRatio,
				destWidth: winWidth * pixelRatio,
				destHeight: canvasHeight * pixelRatio,
				canvasId: add_qrcode ? "myCanvas1" : "myCanvas",
				success(res) {
					console.log(res);
					that.setData({
						show_canvas: true,
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
		const { poem } = that.data;
		// 获取小程序码
		that.getCodeImage("poem", poem.id);
		that.setData({
			show_canvas: true,
			dialogShow: true
		});
		if (!that.data.canvas_img) {
			wx.showLoading({
				title: "图片生成中..."
			});
			that.drawImage();
		}
	},
	// 保存图片到本地
	saveImage: function() {
		let that = this;
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
				setTimeout(() => {
					that.setData({
						show_canvas: false,
						dialogShow: false
					});
				}, 2000);
			},
			fail: res => {
				console.log(res);
				wx.hideLoading();
			}
		});
	},
	// 隐藏canvas画布
	notSaveImage: function() {
		this.setData({
			show_canvas: false
		});
	},
	// 获取小程序码
	getCodeImage: function(type, id) {
		let _type = type ? type : "poem";
		let path = "";
		if (_type == "poem") {
			path = "/pages/poem/detail/index?id=" + id;
		}
		let data = {
			type: type,
			target_id: id,
			path: path,
			width: 300
		};
		GET_WX_QRCODE("GET", data)
			.then(res => {
				if (res.data && res.succeeded) {
					// 下载小程序码都本地
					until.downImage(res.data.file_name).then(res1 => {
						console.log(res1);
						if (res1 && res1.succeeded) {
							codePath = res1.tempFilePath;
						}
						console.log(codePath);
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
					pixelRatio: res.pixelRatio,
					winHeight: clientHeight,
					winWidth: clientWidth
				});
			}
		});
		that.getPoemDetail(options.id, that.data.user_id);
	},
	// 更新收藏情况
	updateCollect: function() {
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
				type: "poem"
			};
			UPDATE_USER_COLLECT("GET", data)
				.then(res => {
					if (res.data && res.succeeded) {
						that.setData({
							collect_status: res.data.status
						});
					} else {
						LOADFAIL("更新状态失败，请重试");
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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		let that = this;
		return {
			title: `${that.data.poem.title} | 古诗文小助手`,
			path: "/pages/poem/detail/index?id=" + that.data.poem.id,
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
