//index.js
//获取应用实例
const app = getApp();
let util = require('../utils/util.js');
let http = require('../utils/http.js');
let current_page = 1;
let last_page = 1;
let homeInterval = null;
Page({
    data: {
        motto: '古诗文小助手',
        poems: [],
        category: ['诗经','楚辞','乐府','小学古诗','初中古诗','高中古诗','宋词精选','古诗十九','唐诗三百首','宋词三百首','古诗三百首'],
        categoryCode: ['shijing','chuci','yuefu','xiaoxue','chuzhong','gaozhong','songci','shijiu','tangshi','songcisanbai','sanbai'],
        index: 6,
        date: util.formatDateToMb(),
        hot: app.globalData.hot,
        animationData: {},
    },
    // 跳转到搜索页面
    ngToSearch: function () {
        wx.navigateTo({
            url: '/pages/search/index'
        });
    },
    // 获取首页数据
    getHomeData: function(name,type){
        let that = this;
        let data = null;
        let url = app.globalData.domain+'/getHomeData';
        if(name && name !=''){
            url = url +'?name='+name;
        }
        if(type && type =='more'){
            if(last_page < current_page){
                return false;
            }
            data = {page: current_page+1};
        }
        wx.showNavigationBarLoading();
        http.request(url,data).then(res=>{
            if(res.data && res.succeeded){
                if(!app.globalData.hot){
                    app.globalData.hot = res.data.hot[0]
                }
                that.setData({
                    hot: app.globalData.hot ? app.globalData.hot : res.data.hot[0],
                    poems: [...that.data.poems, ...res.data.poems.data]
                });
                current_page = res.data.poems.current_page;
                last_page = res.data.poems.last_page
            }else{
                http.loadFailL();
            }
            wx.hideLoading();
            wx.hideNavigationBarLoading();
        }).catch(error => {
            console.log(error);
            http.loadFailL();
        });
    },
    // 监控筛选变化
    bindPickerChange: function(e) {
        let that = this;
        this.setData({
            index: e.detail.value
        });
        that.getHomeData(that.data.categoryCode[that.data.index]);
    },
    onLoad: function () {
        let that = this;
        wx.showLoading({
            title: '加载中',
        });
        that.getHomeData();
    },
    onReady: function() {
        // Do something when page ready.
        
    },
    onShow: function(){
        let that = this;
        let sysInfo = app.globalData.systemInfo;
        let winWidth = sysInfo.windowWidth;
        let ii = 0;
        let animation = wx.createAnimation({
            duration: 20000,
            timingFunction: "ease-in-out",
        });
        //动画的脚本定义必须每次都重新生成，不能放在循环外
        animation.translateX(winWidth-50).step({ duration: 10000 }).translateX(10).step({ duration: 10000 });
        // 更新数据
        that.setData({
            // 导出动画示例
            animationData: animation.export(),
        });
        homeInterval = setInterval(function () {
            //动画的脚本定义必须每次都重新生成，不能放在循环外
            animation.translateX(winWidth-50).step({ duration: 10000 }).translateX(10).step({ duration: 10000 });
            // 更新数据
            that.setData({
                // 导出动画示例
                animationData: animation.export(),
            });
            ++ii;
        }.bind(that),20000);//20000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错
    },
    onHide: function(){
        clearInterval(homeInterval);
    },
    onUnload: function(){
        clearInterval(homeInterval);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh()
    },
    // 滚动到底部
    onReachBottom: function() {
        let that = this;
        this.getHomeData(that.data.categoryCode[that.data.index],'more');
    },
    // 分享
    onShareAppMessage: function (res) {
        return {
            title: '古诗文小助手',
            path: '/pages/index',
            // imageUrl:'/images/poem.png',
            success: function(res) {
                // 转发成功
                console.log('转发成功！')
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
});