// pages/poem/sentence/index.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        categories: [
            {
                theme_name: "抒情",
                types: [
                    "全部",
                    "爱情",
                    "友情",
                    "离别",
                    "思念",
                    "思乡",
                    "伤感",
                    "孤独",
                    "闺怨",
                    "悼亡",
                    "怀古",
                    "爱国",
                    "感恩"
                ]
            },
            {
                theme_name: "四季",
                types: ["全部", "春天", "夏天", "秋天", "冬天"]
            },
            {
                theme_name: "山水",
                types: [
                    "全部",
                    "庐山",
                    "泰山",
                    "江河",
                    "长江",
                    "黄河",
                    "西湖",
                    "瀑布"
                ]
            },
            {
                theme_name: "天气",
                types: [
                    "全部",
                    "写风",
                    "写云",
                    "写雨",
                    "写雪",
                    "彩虹",
                    "太阳",
                    "月亮",
                    "星星"
                ]
            },
            {
                theme_name: "人物",
                types: ["全部", "女子", "父亲", "母亲", "老师", "儿童"]
            },
            {
                theme_name: "人生",
                types: [
                    "全部",
                    "励志",
                    "哲理",
                    "青春",
                    "时光",
                    "梦想",
                    "读书",
                    "战争"
                ]
            },
            {
                theme_name: "生活",
                types: ["全部", "乡村", "田园", "边塞", "写桥"]
            },
            {
                theme_name: "节日",
                types: [
                    "全部",
                    "春节",
                    "元宵节",
                    "寒食节",
                    "清明节",
                    "端午节",
                    "七夕节",
                    "中秋节",
                    "重阳节"
                ]
            },
            {
                theme_name: "动物",
                types: ["全部", "写鸟", "写马", "写猫"]
            },
            {
                theme_name: "植物",
                types: [
                    "全部",
                    "梅花",
                    "梨花",
                    "荷花",
                    "菊花",
                    "柳树",
                    "叶子",
                    "竹子"
                ]
            },
            {
                theme_name: "食物",
                types: ["全部", "写酒", "写茶", "荔枝"]
            }
        ],
        colors: [
            "#41395b",
            "#6f8657",
            "#94232d",
            "#c45a65",
            "#4c1f24",
            // "#2376b7",
            "#0f1423",
            "#f03752",
            "#4f383e",
            "#ccccd6",
            "#41395b",
            "#6f8657",
            "#94232d",
            "#c45a65",
            "#4c1f24",
            // "#2376b7",
            "#0f1423",
            "#f03752",
            "#4f383e",
            "#ccccd6"
        ]
    },
    // 跳转到搜索页面
    ngToSearch: function() {
        wx.switchTab({
            url: "/pages/search/index"
        });
    },
    
    getStences: function(e) {
        let theme = e.currentTarget.dataset.theme;
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: `/pages/sentence/list/index?isSearch=false&theme=${theme}&type=${type}`
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "热门名句"
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: "名句赏析",
            path: "/pages/sentence/index",
            // imageUrl: '/images/poem.png',
            success: function(res) {
                // 转发成功
                console.log("转发成功！");
            },
            fail: function(res) {
                // 转发失败
            }
        };
    }
});
