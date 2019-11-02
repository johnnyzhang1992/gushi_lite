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

//-----------------
//------ 个人中心 --
//-----------------

/**
 * 获取我的名句收藏列表
 * @param {String} method
 * @param {Object} data
 */
export const GET_COLLECT_SENTENCE = (method, data) => {
    return Request(`/wxxcx/getCollect/${data.user_id}`, data, method);
};

/**
 * 更新名句收藏状态
 * @param {String} method
 * @param {Object} data
 */
export const UPDATE_SENTENCE_COLLECT = (method, data) => {
    return Request(`/wxxcx/updateCollect/sentence`, data, method);
};

/**
 * 获取我的诗词收藏列表
 * @param {String} method
 * @param {Object} data
 */
export const GET_COLLECT_POEM = (method, data) => {
    return Request(`/wxxcx/getCollect/${data.user_id}`, data, method);
};

/**
 * 更新诗词收藏状态
 * @param {String} method
 * @param {Object} data
 */
export const UPDATE_POEM_COLLECT = (method, data) => {
    return Request(`/wxxcx/updateCollect/poem`, data, method);
};

/**
 * 获取我的诗词作者人收藏列表
 * @param {String} method 
 * @param {Object} data 
 */
export const GET_COLLECT_POET = (method, data) => { 
    return Request(`/wxxcx/getCollect/${data.user_id}`, data, method);
}

/**
 * 更新诗人收藏状态
 * @param {String} method 
 * @param {Object} data 
 */
export const UPDATE_POET_COLLECT = (method, data) => { 
    return Request(`/wxxcx/updateCollect/author`, data, method);
}