// pages/find/index.js
/**
 * 用户的 pins 列表展示页
 */
const app = getApp();
let authLogin = require('../../../utils/authLogin');
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
Page({
	
	/**
	 * 页面的初始数据
	 */
	data: {
		motto: '古诗文小助手',
		user_id: 0,
		current_page: 1,
		last_page: 1,
		tags: ['科普', '故事', '问与答'],
		pins: [],
		animationData: {},
		pin_u_id: 0,
		userInfo: app.globalData.userInfo
	},
	// 获取用户id
	getUserId: function () {
		let user = wx.getStorageSync('user');
		if (user && user.user_id) {
			let user_id = user ? user.user_id : 0;
			this.setData({
				user_id: user_id
			});
		}
	},
	// 删除 PIN
	deletePin: function(e){
		// console.log(e);
		let that = this;
		let id = e.target.dataset.id;
		let data ={
			user_id: wx.getStorageSync('user').user_id,
			wx_token: wx.getStorageSync('wx_token')
		};
		http.request(app.globalData.url+'/wxxcx/pin/' + id + '/update',data).then(res=>{
			if (res.data && res.data.status) {
				wx.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1000
				});
				let pins = that.data.pins;
				pins = pins.filter((item) => {
					return item.id != id;
				});
				that.setData({
					pins: pins
				})
			} else if (!res.data || (res && !res.data.status)) {
				http.loadFailL('删除失败');
			}else{
				http.loadFailL('删除失败');
			}
		}).catch(error => {
			console.log(error);
			http.loadFailL('删除失败');
		});
	},
	// 跳转到 PIN 详情页
	pinDetail: function(e)  {
		let id = e.currentTarget.dataset.id;
		let type = e.currentTarget.dataset.type;
		wx.navigateTo({
			url: '/pages/find/detail/index?id=' + id + '&type=' + type
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			pin_u_id: options.id
		});
		this.getUserId();
		this.getPins(0);
	},
	// 鼓掌
	pinLike: function (e) {
		let id = e.currentTarget.dataset.id;
		let user_id = wx.getStorageSync('user') ? wx.getStorageSync('user').user_id : 0;
		let wx_token = wx.getStorageSync('wx_token');
		let pins = this.data.pins;
		let that = this;
		let url = app.globalData.url + '/wxxcx/pin/' + id + '/like';
		if (that.data.user_id < 1) {
			authLogin.authLogin('/pages/find/index', 'tab', app);
		} else {
			http.request(url, {
				user_id: user_id,
				wx_token: wx_token
			}).then(res => {
				if (res.data && res.succeeded) {
					if (res.data && res.data.status == 'active') {
						pins.map((item, index) => {
							if (item.id == id) {
								item.like_count = item.like_count + 1;
								item.like_status = res.data.status;
								return item;
							} else {
								return item;
							}
						});
						that.setData({
							pins: pins
						})
					} else if (res.data.status == 'delete') {
						pins.map((item, index) => {
							if (item.id == id) {
								item.like_count = item.like_count - 1;
								item.like_status = res.data.status;
								return item;
							} else {
								return item;
							}
						});
						that.setData({
							pins: pins
						})
					} else {
						http.loadFailL(res.data.msg);
					}
				} else {
					http.loadFailL();
				}
			}).catch(error => {
				console.log(error);
				http.loadFailL();
			});
		}
	},
	// 获取 pins
	getPins: function(page){
		let that = this;
		wx.showNavigationBarLoading();
		let data = {
			page: page+1,
			id:that.data.pin_u_id,
			type: 'list'
		};
		http.request(app.globalData.url+'/wxxcx/getPins',data).then(res=>{
			if (res.data) {
				console.log('----------get PIns------------');
				// console.log(res.data);
				that.setData({
					pins: [...that.data.pins,...res.data.data]
				});
				current_page = res.data.current_page;
				last_page = res.data.last_page;
				wx.setNavigationBarTitle({
					title: that.data.pins[0].user.name
				});
				wx.hideNavigationBarLoading();
			}else{
				http.loadFailL();
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
			pins: []
		});
		this.getPins(0);
		wx.stopPullDownRefresh();
	},
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (current_page>last_page) {
			return false;
		}
		wx.showNavigationBarLoading();
		this.getPins(current_page);
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: this.data.pins[0].user.name,
			path: '/pages/find/user/index?id='+this.data.pin_u_id,
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