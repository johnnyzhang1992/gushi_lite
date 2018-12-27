/**
 * Created by PhpStorm.
 * Author: johnnyzhang
 * Date: 2018/10/10 11:39 AM
 */
// let app = getApp();
function login(url,type,app) {
    wx.showModal({
        title: '登录提醒',
        content: '该功能需要登陆后才能正常使用哦。',
        cancelText: '一会再说',
        confirmText: '现在登录',
        success: (res)=>{
            console.log(res);
            if(res && res.confirm){
                // 记录跳转前的页面 URL 以及页面类型
                // 登陆成功后需要跳转回去
                app.globalData.backUrl.url = url;
                app.globalData.backUrl.type = type;
                // 现在去登录
                // 跳转到登陆页，并关闭其他所有非 tabBar 页面
                wx.switchTab({
                    url: '/pages/me/index'
                });
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
    });
}
export { login as authLogin };