//app.js
// 百度小程序统计
const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
var plugin = requirePlugin("wechatBot");
const tabBarLinks = [
    "/pages/index",
    "/pages/search/index",
    "/pages/me/index"
];
App({
    data() {
        return {
          backgroundHeight: '',
          statusBarHeight: ''
        }
    },
    onLaunch: function () {
        let that = this;
        // 获取用户手机信息
        wx.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res;
                // 判断是否为 iPhone X
                this.globalData.isIpx = res.model.search("iPhone X") != -1;
                let isIOS = res.system.indexOf('iOS') > -1
                let navHeight = 0
                if (!isIOS) {
                  navHeight = 48
                } else {
                  navHeight = 44
                }
                this.data.backgroundHeight = res.windowHeight
                this.data.statusBarHeight = res.statusBarHeight + navHeight
            }
        });
        // 尝试使用 unionId 登录
        wx.login({
            success: res => {
                this.globalData.code = res.code;
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: "https://xuegushi.cn/wxxcx/userInfo",
                    data: {
                        code: this.globalData.code,
                        systemInfo: this.globalData.systemInfo
                    },
                    success: function (res) {
                        if (res.data && !res.data.status) {
                            console.log("----------success------------");
                            wx.setStorageSync("user", res.data);
                            wx.setStorageSync("wx_token", res.data.wx_token);
                            that.globalData.userInfo = res.data;
                        } else {
                            try {
                                wx.removeStorageSync("user");
                                wx.removeStorageSync("closeTipsStatus");
                                wx.removeStorageSync("wx_token");
                            } catch (e) {
                                // Do something when catch error
                                console.log("--clear storage fail---");
                            }
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
            if (!res.hasUpdate) {
                console.log("-----无更新---");
            }
        });
        // 更新完成
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            });
        });
        // 更新失败
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showToast({
                title: "更新失败",
                icon: "none",
                duration: 2000
            });
        });
        // 版本更新部分结束------

        // 微信机器人初始化---
        plugin.init({
          appid: "GhqqPBmJ1dREWp3DIlkhoodlXMQd4j", //小程序示例账户，仅供学习和参考
          openid: '', //用户的openid，非必填，建议传递该参数
          guideList: ["李白简介","窈窕淑女一下句","小石潭记全文","大小李杜都指谁"],
          textToSpeech: false, //默认为ture打开状态
          welcome: "hello, 你可以问我关于古诗词的问题呦😁",
          background: "rgba(247,251,252,1)",
          guideCardHeight: 50,
          operateCardHeight: 120,
          history: true,
          historySize: 60,
        //   navHeight: this.data.statusBarHeight,
          navHeight: 0,
          success: () => {}, //非必填
          fail: error => {} //非必填
        });
    },
    // 如果找不到页面就跳转到首页
    onPageNotFound(res) {
        wx.switchTab({
            url: "pages/index"
        });
    },
       /**
     * 获取tabBar页面路径列表
     */
    getTabBarLinks() {
        return tabBarLinks;
    },

    /**
     * 跳转到指定页面
     * 支持tabBar页面
     */
    navigationTo(url) {
        if (!url || url.length == 0) {
            return false;
        }
        let tabBarLinks = this.getTabBarLinks();
        // tabBar页面
        if (tabBarLinks.indexOf(url) > -1) {
            wx.switchTab({
                url: "/" + url
            });
        } else {
            // 普通页面
            wx.navigateTo({
                url: "/" + url
            });
        }
    },
    globalData: {
        userInfo: null,
        code: null,
        systemInfo: null,
        user: null,
        hot: null,
        domain: "https://xuegushi.cn/wxxcx",
        url: "https://xuegushi.cn",
        backUrl: {}
    }
});
