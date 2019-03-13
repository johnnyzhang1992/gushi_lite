// pages/poem/poet/detail/index.js
const app = getApp();
let authLogin = require('../../../utils/authLogin');
// let poetTimeOut = null;
let http = require('../../../utils/http.js');
let current_page = 1;
let last_page = 1;
let poet_id = 0;
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        poet: null,
        poems: [],
        total: 0,
        collect_status: false,
        user_id: 0,
        animationData: {}
    },
    // 获取用户id
    getUserId: function () {
        let user = wx.getStorageSync('user');
        let user_id = user ? user.user_id : 0;
        this.setData({
            user_id: user_id
        });
    },
    return: function(){
        if(this.data.user_id>0){
            wx.navigateBack({
                delta: 1
            })
        }else{
            wx.switchTab({
                url: '/pages/index'
            })
        }
    },
    addNew: function () {
        let that = this;
        if (that.data.user_id < 1) {
            authLogin.authLogin('/pages/poet/detail/index?id='+that.data.poet.id,'nor',app);
        } else {
            wx.navigateTo({
                url: '/pages/find/new/index?type=poet&id=' + that.data.poet.id
            })
        }
    },
    getPoetData: function(page){
        let that = this;
        let url = app.globalData.domain+'/getPoetDetailData/'+poet_id;
        let data = {
            user_id: that.data.user_id,
            page: page
        };
        http.request(url,data).then(res=>{
            if(res.data && res.succeeded){
                console.log('----------success------------');
                // wx.setStorageSync('user',res.data);
                // console.log(res.data);
                that.setData({
                    poet: res.data.poet,
                    poems: current_page>1 ? that.data.poems.concat(res.data.poems.data) : res.data.poems.data,
                    total: res.data.poems.data.length>0 ? res.data.poems.total : 0,
                    collect_status: res.data.poet.collect_status
                });
                current_page  = res.data.poems.data.length>0 ? res.data.poems.current_page : 1;
                last_page = res.data.poems.data.length>0 ? res.data.poems.last_page : 1;
                wx.setNavigationBarTitle({
                    title: that.data.poet.author_name
                });
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            }
        }).catch(error=>{
            console.log(error);
            http.loadFailL();
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        });
        this.getUserId();
        poet_id = options.id ? options.id : 0;
        this.getPoetData(1);
    },
    // 更新收藏情况
    updateCollect: function () {
        let that = this;
        if (that.data.user_id < 1) {
            // https.userLogin(that.data.author.id,'poet');
            authLogin.authLogin('/pages/poet/detail/index?id='+that.data.poet.id,'nor',app);
        } else {
            let url = app.globalData.domain+'/'+ that.data.poet.id + '/collect/author';
            let data = {
                user_id: that.data.user_id,
                wx_token: wx.getStorageSync('wx_token')
            };
            http.request(url,data).then(res=>{
                if(res.data && res.succeeded){
                    that.setData({
                        collect_status: res.data.status
                    })
                }else{
                    http.loadFailL('操作失败，请重试！');
                }
            }).catch(error=>{
                console.log(error);
                http.loadFailL('操作失败，请重试！');
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
        this.getPoetData(1);
        wx.showNavigationBarLoading();
        current_page = 1;
        wx.stopPullDownRefresh()
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        wx.showNavigationBarLoading();
        current_page++;
        if(current_page>last_page){
            return false;
        }
        that.getPoetData(current_page);
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this;
        return {
            title: that.data.poet.author_name,
            path: '/pages/poet/detail/index?id='+that.data.poet.id,
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