// pages/poem/poet/detail/index.js
let authLogin = require('../../../utils/authLogin');
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        poet: null,
        poems: null,
        total: 0,
        current_page: 1,
        last_page: 1,
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
                url: '/pages/index/index'
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        });
        this.getUserId();
        wx.request({
            url: 'https://xuegushi.cn/wxxcx/getPoetDetailData/'+options.id+'?user_id=' + that.data.user_id,
            success: res =>{
                if(res.data){
                    console.log('----------success------------');
                    // wx.setStorageSync('user',res.data);
                    // console.log(res.data);
                    this.setData({
                        poet: res.data.poet,
                        poems: res.data.poems.data,
                        current_page: res.data.poems.data.length>0 ? res.data.poems.current_page : 0,
                        last_page: res.data.poems.data.length>0 ? res.data.poems.last_page : 0,
                        total: res.data.poems.data.length>0 ? res.data.poems.total : 0,
                        collect_status: res.data.poet.collect_status
                    });
                    wx.setNavigationBarTitle({
                        title: that.data.poet.author_name
                    });
                    wx.hideLoading();
                }
            }
        })
    },
    // 更新收藏情况
    updateCollect: function () {
        let that = this;
        if (that.data.user_id < 1) {
            // https.userLogin(that.data.author.id,'poet');
            authLogin.authLogin('/pages/poet/detail/index?id='+that.data.poet.id,'nor',app);
        } else {
            wx.request({
                url: 'https://xuegushi.cn/wxxcx/' + that.data.poet.id + '/collect/author?user_id=' + that.data.user_id +'&wx_token='+wx.getStorageSync('wx_token'),
                success: res => {
                    if (res.data) {
                        that.setData({
                            collect_status: res.data.status
                        })
                    } else {
                        that.setData({
                            collect_status: res.data.status
                        })
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        
    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease",
            delay: 0
        })
        animation.scale(1.3, 1.3).step();
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.scale(1, 1).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 500)
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
        wx.stopPullDownRefresh()
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        wx.showNavigationBarLoading();
        wx.request({
            url: 'https://xuegushi.cn/wxxcx/getPoetDetailData/'+that.data.poet.id,
            data: {
                page: that.data.current_page+1
            },
            success: res =>{
                if(res.data){
                    console.log('----------success------------');
                    this.setData({
                        poems: that.data.poems.concat(res.data.poems.data),
                        current_page: res.data.poems.current_page,
                        last_page: res.data.poems.last_page
                    });
                    wx.hideNavigationBarLoading()
                }
            }
        })
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