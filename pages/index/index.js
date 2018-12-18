//index.js
//获取应用实例
let util = require('../../utils/util.js');
let http = require('../../utils/http.js');
const app = getApp();
Page({
    data: {
        motto: '古诗文小助手',
        poems: [],
        inputShowed: false,
        current_page: 1,
        last_page: 1,
        array: ['诗经','楚辞','乐府','小学古诗','初中古诗','高中古诗','宋词精选','古诗十九','唐诗三百首','宋词三百首','古诗三百首'],
        objectArray: ['shijing','chuci','yuefu','xiaoxue','chuzhong','gaozhong','songci','shijiu','tangshi','songcisanbai','sanbai'],
        index: 10,
        date: util.formatDateToMb(),
        hot: app.globalData.hot
    },
    showInput: function () {
        wx.navigateTo({
            url: '/pages/search/index'
        });
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
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
            if(that.data.last_page<that.data.current_page){
                return false;
            }
            data = {page: that.data.current_page+1};
            wx.showNavigationBarLoading();
            
        }
        http.request(url,data).then(res=>{
            if(res.data && res.succeeded){
                if(!app.globalData.hot){
                    app.globalData.hot = res.data.hot[0]
                }
                that.setData({
                    hot: app.globalData.hot ? app.globalData.hot : res.data.hot[0],
                    poems: (type && type == 'more') ? that.data.poems.concat(res.data.poems.data) : res.data.poems.data,
                    current_page: res.data.poems.current_page,
                    last_page: res.data.poems.last_page
                });
            }else{
                console.log(res);
                wx.showToast({
                    title: '请求失败，请刷新重试！',
                    icon: 'none',
                    duration: 2000
                })
            }
            wx.hideLoading();
            wx.hideNavigationBarLoading();
        });
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh()
    },
    onReachBottom: function() {
        wx.showNavigationBarLoading();
        let that = this;
        this.getHomeData(that.data.objectArray[that.data.index],'more');
    },
    onShareAppMessage: function (res) {
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        return {
            title: '古诗文小助手',
            path: '/pages/index/index',
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
    bindPickerChange: function(e) {
        let that = this;
        this.setData({
            index: e.detail.value
        });
        wx.showNavigationBarLoading();
        that.getHomeData(that.data.objectArray[that.data.index]);
    }
});

