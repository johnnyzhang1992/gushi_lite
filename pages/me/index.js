//index.js
//获取应用实例
const app = getApp();
let http = require('../../utils/http.js');
Page({
    data: {
        motto: '古诗文小助手',
        userInfo: null,
        hasUserInfo: false,
        user_id: 0,
        canIUse: true,
        poem_count: 0,
        poet_count: 0,
        sentence_count: 0,
        u_count: 0,
        u_t_count: 0,
        s_count: 0
    },
    // 获取用户id
    getUserId: function(){
        let user = wx.getStorageSync('user');
        if(user && user.user_id){
            let user_id = user ? user.user_id: 0;
            this.setData({
                user_id: user_id
            });
        }
    },
    // 通过用户点击按钮获取用户数据
    bindGetUserInfo: function(e) {
        let that = this;
        if(e.detail.errMsg != 'getUserInfo:ok'){
            http.loadFailL('授权失败！');
            // 授权失败
            return false;
        }else{
            // 注册或者登陆
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    app.globalData.userInfo = e.detail.userInfo;
                    let data = {
                        code: res.code,
                        iv: e.detail.iv,
                        encryptedData: e.detail.encryptedData,
                        systemInfo:app.globalData.systemInfo
                    };
                    // console.log(data);
                    // 向关联网站发送请求，解密、存储数据
                    http.request(app.globalData.url+'/wxxcx/userCrate',data).then(res=>{
                        if(res.data && res.data.user_id){
                            console.log('----------success------------');
                            wx.setStorageSync('user',res.data);
                            wx.setStorageSync('wx_token', res.data.wx_token);
                            app.globalData.userInfo = res.data;
                            that.setData({
                                userInfo: e.detail.userInfo,
                                hasUserInfo: true
                            });
                            that.getUserInfo(res.data.user_id).then(_res=>{
                                if(_res.data){
                                    // 返回登录前页面
                                    http.backUrl();
                                }
                            }).catch(error=>{
                                console.log(error);
                                http.loadFailL();
                            });
                        }else{
                            http.loadFailL('注册失败')
                        }
                    }).catch(error=>{
                        console.log(error);
                        http.loadFailL();
                    });
                }
            });
        }
        
    },
    // 获取用户的基本信息
    getUserInfo: function(user_id){
        let that = this;
        return new Promise((resolve,reject)=> { //结果以Promise形式返回
            http.request(app.globalData.url + '/wxxcx/getUserInfo/' + user_id,undefined).then(res=>{
                if (res.data) {
                    that.setData({
                        userInfo: app.globalData.userInfo,
                        hasUserInfo: true,
                        poem_count: res.data.poem_count,
                        poet_count: res.data.poet_count,
                        sentence_count: res.data.sentence_count,
                        u_count: res.data.u_count,
                        u_t_count: res.data.u_t_count,
                        s_count: res.data.s_count
                    });
                    resolve(Object.assign(res, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
                }else{
                    reject(Object.assign(res, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
                    http.loadFailL();
                }
                wx.hideNavigationBarLoading();
            }).catch(error=>{
                console.log(error);
                http.loadFailL();
            })
        });
      
    },
    onLoad: function () {
        let that = this;
        this.getUserId();
        wx.setNavigationBarTitle({
            title: '个人中心'
        });
        // 确认用户是否登录
        if (app.globalData.userInfo && that.data.user_id > 0) {
            wx.showNavigationBarLoading();
            // 获取用户的基本信息
           this.getUserInfo(that.data.user_id)
        }
    },
    onReady: function() {
        // Do something when page ready.
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function(){
        wx.showNavigationBarLoading();
        if(this.data.user_id<1){
            return false;
        }
        this.getUserInfo(this.data.user_id)
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '个人中心',
            path: '/page/me/index',
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