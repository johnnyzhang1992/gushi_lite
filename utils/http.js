/**
 * Author johnnyZhang
 * Site johnnyzhang.cn
 * CreateTime 2017/7/19.
 */
var app = getApp();
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}
function getPosts(cb) {
    wx.request({
        url: 'https://johnnyzhang.cn/wxxcx/get/posts',
        data: {
            id: wx.getStorageSync('user').user_id
        },
        success: function (resp) {
            if(resp.data){
                var posts = resp.data;
                posts.forEach(function (p1) {
                    p1.created_at = getDateDiff(p1.created_at);
                });
                return typeof cb == "function" && cb(posts.sort(compare('id')));
            }
        }
    });
}
module.exports = {
    getPosts:getPosts
};