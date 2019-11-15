Component({
  properties: {
    controlSwiper: Boolean,
    guideList: Array,
    height: Number
    // guideType: String
  },
  data: {
    guideIndex: -1,
    // guideList: data.getData().guideList,
    noContinuousClick: false //禁止连续点击
  },

  attached: function () {
    // this.setData({
    //   guideList: data.getData().guideList
    // });
  },
  lifetimes: {
    ready: function () {
      this.setData({
        // 更新属性和数据的方法\更新页面数据的方法
      });
    }
  },
  methods: {
    //事件响应函数
    chooseGuide: function (e) {
      if (this.properties.controlSwiper) {
        this.setData(
          {
            guideIndex: e.currentTarget.dataset.id
          },
          () => {
            var that = this;
            that.setData({
              guideIndex: -1
            });
          }
        );
        this.triggerEvent("chooseGuide", e.currentTarget.dataset.content);
      }
    }
  }
});
