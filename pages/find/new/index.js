// pages/find/new/index.js
const app = getApp();
let http = require('../../../utils/http.js');
let authLogin = require('../../../utils/authLogin');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		location : {
			name : '添加地点',
		},
		location_img: '/images/icon/location_fill.png',
		type: null,
		poem: null,
		poet: null,
		pin:null,
		t_id: 0,
		user_id: -1,
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
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		console.log(options.id,options.type);
		wx.setNavigationBarTitle({
			title: '写想法'
		});
		that.getUserId();
		let url = app.globalData.url;
		let data = {
			user_id: that.data.user_id
		};
		if(options.type && options.type == 'poem'){
			url = url+'/wxxcx/poem/' + options.id;
		}else if(options.type && options.type == 'poet'){
			url = url + '/wxxcx/getPoetDetailData/' + options.id;
		}else if(options.type && options.type =='pin'){
			url = url + '/wxxcx/getPinDetail/' + options.id;
		}
		http.request(url,data).then(res=>{
			if (res.data) {
				// console.log(res.data);
				console.log('----------success------------');
				that.setData({
					pin: res.data.pin ? res.data.pin : null,
					poem: res.data.poem ? res.data.poem : null,
					poet: res.data.poet ? res.data.poet : null
				});
				// wx.hideLoading();
				if(options.type && options.type == 'poem'){
					that.setData({
						type: 'poem',
						t_id: res.data.poem.id
					})
				}else if(options.type && options.type == 'poet'){
					that.setData({
						type: 'poet',
						t_id: res.data.poet.id
					})
				}else if(options.type && options.type =='pin'){
					that.setData({
						type: 'pin',
						t_id: res.data.pin.id
					})
				}
			}
		}).catch(error => {
			console.log(error);
			http.loadFailL();
		});
	},
	
	/**
	 * 获取用户位置信息
	 */
	getLocation: function(){
		wx.chooseLocation({
			success : (res)=>{
				console.log(res);
				if(res.name && res.name!=''){
					this.setData({
						location: res,
						location_img: '/images/icon/location_active.png'
					})
				}else{
					this.setData({
						location: {
							name: '添加地点',
						},
						location_img: '/images/icon/location_fill.png'
					})
				}
				
			}
		})
	},
	keyBoardUp: function(event){
		console.log(event.detail)
	},
	keyBoardDown: ()=>{
		console.log('keyBoard down')
	},
	/**
	 * 提交数据
	 * @param e
	 */
	bindFormSubmit: function(e){
		let user = wx.getStorageSync('user');
		console.log(e.detail.value.mind);
		// mind = e.detail.value.mind;
		let data = {
			content: e.detail.value.mind,
			t_id: e.detail.value.t_id,
			t_type: e.detail.value.t_type,
			p_id: e.detail.value.p_id,
			location: {
				'name':e.detail.value.l_name,
				'address':e.detail.value.l_address,
				'lat':e.detail.value.l_latitude,
				'lon':e.detail.value.l_longitude,
			},
			wx_token: wx.getStorageSync('wx_token')
		};
		// console.log(data);
		// create pin
		if (this.data.user_id < 1) {
			let back_url = '/pages/find/index';
			let url_type = 'tab';
			if(this.data.type =='poem'){
				back_url = '/pages/poem/detail?id='+this.data.poem.id;
			}else if(this.data.type =='poet'){
				back_url = '/pages/poet/detail?id='+this.data.poet.id;
			}else if(this.data.type =='pin'){
				back_url = '/pages/find/detail?id='+this.data.pin.id;
			}
			authLogin.authLogin(back_url, url_type, app);
		} else {
			http.request(app.globalData.url+ '/wxxcx/createPin/'+user.user_id,data).then(res=>{
				
				if(res.data && res.data.pin_id && res.data.pin_id>0){
					wx.showToast({
						title: '发布成功',
						icon: 'success',
						duration: 1000
					});
					setTimeout(()=>{
						wx.reLaunch({
							url: '/pages/find/index'
						});
					},1000)
				}else{
					http.loadFailL('发布失败,请重试');
				}
			}).catch(error => {
				console.log(error);
				http.loadFailL('发布失败,请重试');
			});
		}
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
	
	}
});