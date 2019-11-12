/**
 * API 统一请求文件
 * author: johnnyzhang
 * github: https://github.com/johnnyzhang1992/gushi_lite
 */
const app = getApp();
const BaseUrl = app.globalData.url;

// 封装小程序远程请求函数
function Request(url, params = {}, method) {
    let data = {
        ...params,
        openId: wx.getStorageSync("user").openId,
        wx_token: wx.getStorageSync("wx_token")
    };
    return new Promise((resolve, reject) => {
        //结果以Promise形式返回
        wx.request({
            url: BaseUrl + url,
            data: data,
            type: method || "GET",
            success: res => {
                if (res.data) {
                    resolve(Object.assign(res, { succeeded: true }));
                    //成功失败都resolve，并通过succeeded字段区分
                } else {
                    reject(Object.assign(res, { succeeded: false }));
                    //成功失败都resolve，并通过succeeded字段区分
                }
            },
            fail: error => {
                console.log(error);
                reject(Object.assign(error, { succeeded: false }));
                //成功失败都resolve，并通过succeeded字段区分
            }
        });
    });
}

// 加载失败
export const LOADFAIL = msg => {
    wx.showToast({
        title: msg || "加载失败",
        icon: "none",
        duration: 2000
    });
};

// 返回登录前页面
export const BACKURL = ()=>{
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

/**
 * 创建新用户
 * @param {*} method 
 * @param {*} data 
 */
export const CREATE_USER = (method, data) => { 
    return Request('/wxxcx/userCrate',data,method)
}

/**
 * 获取用户的基本信息
 * @param {*} method 
 * @param {*} data 
 */
export const GET_USER_INFO = (method,data) => { 
    return Request(`/wxxcx/getUserInfo/${data.user_id}`,data,method)
}

/**
 * 获取一条随机名句
 * @param {String} method 
 * @param {Object} data 
 */
export const GET_RANDOM_SENTENCE = (method, data) => { 
    return Request(`/wxxcx/getRandomSentence`, data, method);
}

//-----------------
//------ 个人中心 --
//-----------------

/**
 * 获取我的收藏信息(诗词、名句、诗人)
 * @param {String} method
 * @param {Object} data
 */
export const GET_USER_COLLECT = (method, data) => {
    return Request(`/wxxcx/getCollect/${data.user_id}`, data, method);
};

/**
 * 更新收藏状态
 * @param {String} method
 * @param {Object} data
 */
export const UPDATE_USER_COLLECT = (method, data) => {
    return Request(`/wxxcx/updateCollect/${data.type}`, data, method);
};

//-----------------
//------ 搜索部分 --
//-----------------

/**
 * 获取搜索热词
 * @param {*} method
 * @param {*} data
 */
export const GET_HOT_SEARCH = (method, data) => {
    return Request(`/wxxcx/getsHotSearch`, data, method);
};

/**
 * 根据关键字搜索
 * @param {*} method
 * @param {*} data
 */
export const GET_SEARCH = (method, data) => {
    return Request(`/wxxcx/search/${data.key}`, data, method);
};