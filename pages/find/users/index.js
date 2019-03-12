// pages/find/users/index.js
const app = getApp();
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		pin_id:0,
		users: [],
		total:0
	},
	
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.setData({
			pin_id: options.id
		});
		wx.setNavigationBarTitle({
			title: '鼓掌'
		});
		wx.showLoading({
			title: '加载中',
		});
		that.getPinLikes(0)
	},
	userPins: (e) => {
		wx.navigateTo({
			url: '/pages/find/user/index?id=' + e.currentTarget.dataset.id
		});
	},
	getPinLikes: function(page){
		let that = this;
		if(page > last_page){
			return false;
		}
		http.request(app.globalData.url+'/wxxcx/getPinLikeUsers/'+that.data.pin_id,{page: page+1}).then(res=>{
			if(res.data){
				that.setData({
					users: [...that.data.users,...res.data.data],
					total: res.data.total
				});
				current_page = res.data.current_page;
				last_page = res.data.last_page;
				wx.hideLoading();
			}
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
		this.setData({
			users: []
		});
		wx.showLoading({
			title: '加载中',
		});
		this.getPinLikes(0);
		wx.stopPullDownRefresh();
	},
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		
		this.getPinLikes(current_page);
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '鼓掌',
			path: '/pages/find/users/index?id=' + this.data.pin_id,
			// imageUrl:'/images/poem.png',
			success: function (res) {
				// 转发成功
				console.log('转发成功！')
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
});