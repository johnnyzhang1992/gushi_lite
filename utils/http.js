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
    _data.appId = 'wx4278af156928b4f6';
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
module.exports = {
    userLogin: login,
    request: request,
    loadFailL: loadFail,
    startPullRefresh: startPullRefresh
};