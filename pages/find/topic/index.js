// pages/find/topic/index.js
const app = getApp();
let http = require('../../../utils/http.js');
Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		keyWord: '',
		user_id: 0,
		wxSearchData: null,
		topic:null,
		userInfo: wx.getStorageSync('user'),
	},
	
	/**
	 * 获取用户 id
	 */
	getUserId: function () {
		let user = wx.getStorageSync('user');
		if (user && user.user_id) {
			let user_id = user ? user.user_id : 0;
			this.setData({
				user_id: user_id
			});
		}
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '关于"'+options.keyWord+'"的诗词'
		});
		// 2 搜索栏初始化
		let that = this;
		that.setData({
			keyWord: options && options.keyWord ? options.keyWord : ''
		});
		http.request(app.globalData.url+'/wxxcx/getRecentTopic',undefined).then(res=>{
			if(res.data){
				console.log('----------success------------');
				that.setData({
					topic: res.data
				});
				wx.hideLoading();
				this.getResult();
			}else{
				http.loadFailL('获取最新热点失败');
			}
		}).catch(error => {
			console.log(error);
			http.loadFailL();
		});
	},
	
	/**
	 * 获取结果集
	 */
	getResult: function(){
		let keyWord = this.data.keyWord;
		let that = this;
		let temData = {};
		let barHeight = 43;
		let view = {
			barHeight: barHeight
		};
		wx.getSystemInfo({
			success: function (res) {
				let wHeight = res.windowHeight;
				view.seachHeight = wHeight - barHeight;
				temData.view = view;
				that.setData({
					wxSearchData: temData
				});
			}
		});
		let data = {
			wx_token: wx.getStorageSync('wx_token'),
			user_id: that.data.user_id
		};
		http.request(app.globalData.url+'/wxxcx/search/' + keyWord,data).then(res=>{
			if(res.data){
				that.setData({
					poems: res.data ? res.data.poems : null,
					poets: res.data ? res.data.poets : null,
					sentences: res.data ? res.data.sentences : null,
					tags: res.data.tags
				});
			}else{
				http.loadFailL();
			}
			wx.hideNavigationBarLoading()
		}).catch(error => {
			console.log(error);
			http.loadFailL();
		});
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
		this.getResult();
		wx.stopPullDownRefresh();
	},
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
	
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let keyWord = this.data.keyWord;
		return {
			title: '关于"'+keyWord+'"的诗词',
			path: '/pages/find/topic/index',
			// imageUrl:'/images/poem.png',
			success: function(res) {
				// 转发成功
				console.log('转发成功！')
			},
			fail: function(res) {
				// 转发失败
			}
		}
	}
});