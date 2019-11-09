//index.js
//获取应用实例
const app = getApp();
const apiDomain = app.globalData.domain;
let util = require("../utils/util.js");
let http = require("../utils/http.js");

let homeInterval = null;
Page({
    data: {
        motto: "古诗文小助手",
        poems: [],
        categories: [
            {
                code: 'shijing',
                name: '诗经全集',
                profile: '最古老的诗集',
            },
            {
                code: 'chuci',
                name: '楚辞全集',
                profile: '浪漫主义诗集',
            },
            {
                code: 'yuefu',
                name: '乐府诗集',
                profile: '古代乐府诗集',
            },
            {
                code: 'songci',
                name: '宋词精选',
                profile: '优秀宋词集锦',
            },
            {
                code: 'shijiu',
                name: '古诗十九首',
                profile: '南朝萧统录',
            },
            {
                code: 'tangshi',
                name: '唐诗三百首',
                profile: '蘅塘退士编',
            },
            {
                code: 'songcisanbai',
                name: '宋词三百首',
                profile: '朱孝臧编',
            },
            {
                code: 'sanbai',
                name: '古诗三百首',
                profile: '曾立国编',
            },
        ],
        books: [
            {
                name: '小学诗词',
                code: 'xiaoxue',
                profile: '静夜思'
            },
            {
                name: '小学古文',
                code: 'xiaoxuewyw',
                profile: '揠苗助长'
            },
            {
                name: '初中诗词',
                code: 'chuzhong',
                profile: '明月几时有'
            },
            {
                name: '初中古文',
                code: 'chuzhongwyw',
                profile: '湖心亭看雪'
            },
            {
                name: '高中诗词',
                code: 'gaozhong',
                profile: '鱼我所欲也'
            },
            {
                name: '高中古文',
                code: 'gaozhongwyw',
                profile: '孔雀东南飞'
            },
        ],
        date: util.formatDateToMb(),
        hot: app.globalData.hot,
        animationData: {},
        show_load: true
    },
    // 每日一诗
    getRandomSentence: function() { 
        const that = this;
        let url = apiDomain + "/getRandomSentence";
        http.request(url, null)
            .then(res => {
                if (res.data && res.succeeded) { 
                    that.setData({
                        hot: res.data[0]
                    })
                    app.globalData.hot = res.data[0]
                }
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            })
            .catch(error => {
                console.log(error);
                http.loadFailL();
            });
    },
    // 监控筛选变化
    pageRedirectTo: function (e) {
        const { code, type } = e.currentTarget.dataset;
        let item = {};
        if (type === 'category') {
            this.data.categories.forEach(element => {
                if (element.code === code) {
                    item = element;
                }
            });
        } else { 
            this.data.books.forEach(element => { 
                if (element.code === code) { 
                    item = element;
                }
            })
        }
        wx.navigateTo({
            url: `/pages/homeList/index?code=${item.code}&name=${item.name}&profile=${item.profile}`,
        });
    },
    onLoad: function() {
        wx.showLoading({
            title: "加载中"
        });
        if (!this.data.hot) {
            this.getRandomSentence();
        } else { 
            wx.hideLoading();
                wx.hideNavigationBarLoading();
        }
        // that.getHomeData(that.data.categoryCode[that.data.index]);
    },
    onShow: function() {
        let that = this;
        let sysInfo = app.globalData.systemInfo;
        let winWidth = sysInfo.windowWidth;
        let ii = 0;
        let animation = wx.createAnimation({
            duration: 20000,
            timingFunction: "ease-in-out"
        });
        wx.setNavigationBarTitle({
            title: "首页 | 古诗文小助手"
        });
        //动画的脚本定义必须每次都重新生成，不能放在循环外
        animation
            .translateX(winWidth - 50)
            .step({ duration: 10000 })
            .translateX(10)
            .step({ duration: 10000 });
        // 更新数据
        that.setData({
            // 导出动画示例
            animationData: animation.export()
        });
        homeInterval = setInterval(
            function() {
                //动画的脚本定义必须每次都重新生成，不能放在循环外
                animation
                    .translateX(winWidth - 50)
                    .step({ duration: 10000 })
                    .translateX(10)
                    .step({ duration: 10000 });
                // 更新数据
                that.setData({
                    // 导出动画示例
                    animationData: animation.export()
                });
                ++ii;
            }.bind(that),
            20000
        ); //20000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错
    },
    onHide: function() {
        clearInterval(homeInterval);
    },
    onUnload: function() {
        clearInterval(homeInterval);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    // 分享
    onShareAppMessage: function(res) {
        return {
            title: "古诗文小助手",
            path: "/pages/index",
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
