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
        // canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUse: true,
        p_count: 0,
        a_count: 0,
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
    onLoad: function () {
        let that = this;
        this.getUserId();
        wx.setNavigationBarTitle({
            title: '个人中心'
        });
        if (app.globalData.userInfo && that.data.user_id > 0) {
            wx.showNavigationBarLoading();
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
            wx.request({
                url: app.globalData.url + '/wxxcx/getUserInfo/' + that.data.user_id,
                success: res => {
                    if (res.data) {
                        that.setData({
                            p_count: res.data.p_count,
                            a_count: res.data.a_count,
                            u_count: res.data.u_count,
                            u_t_count: res.data.u_t_count,
                            s_count: res.data.s_count
                        })
                    }
                    wx.hideNavigationBarLoading();
                }
            });
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
        let that = this;
        wx.request({
            url: app.globalData.url+'/wxxcx/getUserInfo/'+this.data.user_id,
            success: res => {
                if (res.data) {
                    that.setData({
                        p_count: res.data.p_count,
                        a_count: res.data.a_count
                    });
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh()
                }
            }
        });
    },
    // 通过用户点击按钮获取用户数据
    bindGetUserInfo: function(e) {
        // console.log('---this');
        // console.log(e);
        let that = this;
        if(e.detail.errMsg != 'getUserInfo:ok'){
            http.loadFailL('授权失败！');
            // 授权失败
            return false;
        }else{
            that.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
            let code = '';
            wx.login({
                success: res => {
                    console.log(res);
                    // app.globalData.code = res.code;
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    code = res.code;
                    // 可以将 res 发送给后台解码出 unionId
                    app.globalData.userInfo = e.detail.userInfo;
                    let data = {
                        code: code,
                        iv: e.detail.iv,
                        encryptedData: e.detail.encryptedData,
                        systemInfo:app.globalData.systemInfo
                    };
                    console.log(data);
                    // 向关联网站发送请求，解密、存储数据
                    wx.request({
                        url: app.globalData.url+'/wxxcx/userCrate',
                        data: data,
                        success: function (res) {
                            if(res.data && res.data.user_id){
                                console.log('----------success------------');
                                wx.setStorageSync('user',res.data);
                                wx.setStorageSync('wx_token', res.data.wx_token);
                                app.globalData.userInfo = res.data;
                                wx.request({
                                    url: app.globalData.url+'/wxxcx/getUserInfo/'+res.data.user_id,
                                    success: _res => {
                                        if (_res.data) {
                                            that.setData({
                                                user_id: res.data.user_id,
                                                p_count: _res.data.p_count,
                                                a_count: _res.data.a_count,
                                                u_count: _res.data.u_count,
                                                u_t_count: _res.data.u_t_count,
                                                s_count: _res.data.s_count
                                            });
                                            if(app.globalData.backUrl && app.globalData.backUrl.url){
                                                // 问询是否返回登录前页面
                                                wx.showModal({
                                                    title: '登录成功',
                                                    content: '您是否想返回登录前的页面？',
                                                    cancelText: '不需要',
                                                    confirmText: '马上返回',
                                                    success: (res)=>{
                                                        console.log(res);
                                                        that.getUserDetail();
                                                        let backUrl = app.globalData.backUrl;
                                                        if(res && res.confirm){
                                                            // 现在去登录
                                                            if(backUrl && backUrl.type && backUrl.type == 'tab'){
                                                                wx.switchTab({
                                                                    url: backUrl.url
                                                                });
                                                            }else{
                                                                wx.navigateTo({
                                                                    url: backUrl.url
                                                                })
                                                            }
                                                        }
                                                    },
                                                    fail: (error)=>{
                                                        console.log(error);
                                                        wx.showToast({
                                                            title: '好像哪里出错了，请重试。',
                                                            icon: 'none',
                                                            mask: true
                                                        });
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                            }else{
                                http.loadFailL('登陆失败')
                            }
                        }
                    });
                }
            });
        }
        
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '个人中心',
            path: '/page/me/index',
            imageUrl:'/images/poem.png',
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