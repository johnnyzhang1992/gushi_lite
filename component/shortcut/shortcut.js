const App = getApp();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    right: {
      type: String,
      value: '24rpx'
    },
    bottom: {
      type: String,
      value: '250rpx'
    }
  },

  /**
   * 私有数据, 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    transparent: true
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    /**
     * 导航菜单切换事件
     */
    _onToggleShow(e) {
      this.setData({
        isShow: !this.data.isShow,
        transparent: false
      })
    },

    /**
     * 导航页面跳转
     */
    _onTargetPage(e) {
      let urls = App.getTabBarLinks();
      wx.switchTab({
        url: urls[parseInt(e.detail.target.dataset.index)]
      });
    }

  }
})