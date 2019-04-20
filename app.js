//app.js
// 百度小程序统计
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
App({
    onLaunch: function () {
        let that = this;
        // 尝试使用 unionId 登录
        wx.login({
            success: res => {
                this.globalData.code = res.code;
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: 'https://xuegushi.cn/wxxcx/userInfo',
                    data: {
                        code: this.globalData.code,
                        systemInfo:this.globalData.systemInfo
                    },
                    success: function (res) {
                        if(res.data){
                            console.log('----------success------------');
                            wx.setStorageSync('user',res.data);
                            wx.setStorageSync('wx_token', res.data.wx_token);
                            that.globalData.userInfo = res.data;
                        }
                    }
                });
            }
        });
        // 版本更新------
        const updateManager = wx.getUpdateManager();
        // 强制更新
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            // console.log(res.hasUpdate)
            if(!res.hasUpdate){
                console.log('-----无更新---');
            }
        });
        // 更新完成
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
            
        });
        // 更新失败
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showToast({
                title: '更新失败',
                icon: 'none',
                duration: 2000
            })
        });
        // 版本更新部分结束------
        
        // 获取用户手机信息
        wx.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res;
                //model中包含着设备信息
                console.log('手机型号：'+res.model);
                // 判断是否为 iPhone X
                this.globalData.isIpx = res.model.search('iPhone X') != -1;
            }
        });
    },
    // 如果找不到页面就跳转到首页
    onPageNotFound(res) {
        wx.switchTab({
            url: 'pages/index'
        })
    },
    globalData: {
        userInfo: null,
        code:null,
        systemInfo:null,
        user:null,
        hot:null,
        domain: 'https://xuegushi.cn/wxxcx',
        url: 'https://xuegushi.cn',
        backUrl: {}
    }
});