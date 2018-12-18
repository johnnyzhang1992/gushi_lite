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
    return new Promise((resolve,reject)=> { //结果以Promise形式返回
        wx.request({
            url: url,
            data: data ? data : null,
            type: type ? type : 'GET',
            success: res => {
                if (res.data) {
                    resolve(Object.assign(res, {succeeded: true})); //成功失败都resolve，并通过succeeded字段区分
                }else{
                    resolve(Object.assign(res, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
    
                }
            },
            fail:error=>{
                console.log(error);
                resolve(Object.assign(error, {succeeded: false})); //成功失败都resolve，并通过succeeded字段区分
            }
        });
    });
}
module.exports = {
    userLogin: login,
    request: request
};