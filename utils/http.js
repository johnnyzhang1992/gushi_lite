/**
 * Author johnnyZhang
 * Site johnnyzhang.cn
 * CreateTime 2017/7/19.
 */
let app = getApp();
function compare(property){
    return function(a,b){
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
}
function login(id,type) {
  wx.reLaunch({
    url: '/pages/me/index'
  });
}
// 封装小程序远程请求函数
function request(url,data,type){
    let _data = data ? data : {};
    _data.appId = wx.getStorageSync('user').openId;
    _data.wx_token = wx.getStorageSync('wx_token');
    return new Promise((resolve,reject)=> { //结果以Promise形式返回
        wx.request({
            url: url,
            data: _data,
            type: type ? type : 'GET',
            success: res => {
                if (res.data) {
                    resolve(Object.assign(res, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
                }else{
                    reject(Object.assign(res, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
    
                }
            },
            fail:error=>{
                console.log(error);
                reject(Object.assign(error, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
            }
        });
    });
}
// 加载失败
function loadFail(msg){
    wx.showToast({
        title: msg && msg !='' ? msg :'加载失败',
        icon: 'none',
        duration: 2000
    })
}
// 刷新页面
function startPullRefresh() {
    wx.showModal({
        title: '加载失败。',
        content: '请下拉刷新以便重新加载',
        showCancel: false,
        success: ()=>{
            wx.startPullDownRefresh();
        }
    })
}
// 返回登录前页面
function backUrl(){
    if(app.globalData.backUrl && app.globalData.backUrl.url){
        // 问询是否返回登录前页面
        wx.showModal({
            title: '登录成功',
            content: '您是否想返回登录前的页面？',
            cancelText: '不需要',
            confirmText: '马上返回',
            success: (res)=>{
                console.log(res);
                // that.getUserDetail();
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
module.exports = {
    userLogin: login,
    request: request,
    loadFailL: loadFail,
    startPullRefresh: startPullRefresh,
    backUrl: backUrl
};