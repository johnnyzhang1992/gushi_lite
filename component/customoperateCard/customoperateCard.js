var plugin = requirePlugin("wechatBot");
Component({
  properties: {
    focus: Boolean,
    recording: Boolean,
    inputText: String,
    inputing: Boolean,
    height: Number
  },

  data: {
    inputing: false, //值为true时表示正在输入
    inputText: ''
  },
  lifetimes: {
    ready: function() {
      if (this.properties.focus) {
        this.setData({
          focus: this.properties.focus,
          inputing: true
        })
      }
    },
    attached:function () {
    }
  },
  methods: {
    bindInput: function(e) {
      this.setData({
        inputText: e.detail.value
      });
    },
    // 输入选择
    chooseType: function(e) {
      if (e.currentTarget.dataset.type == "voice") {
        this.setData({
          inputing: false
        });
      } else {
        this.setData({
          inputing: true
        });
      }
    },
    bindconfirmInput: function(e) {
      var that = this;
      let text = e.detail.value;
      that.triggerEvent("bindInput", text);
      that.setData({
        inputText: ''
      })
    },
    // 返回首页
    showGuideView: function() {
      this.triggerEvent("back");
    },
    // 启动语音
    inputVoiceStart: function() {
      const chat = plugin.getChatComponent();
      chat.inputVoiceStart()
      // this.triggerEvent('inputVoiceStart')
      // plugin.voiceStart(true)
    },
    // 停止语音
    inputVoiceEnd: function() {
      const chat = plugin.getChatComponent();
      chat.inputVoiceEnd()
      // this.triggerEvent('inputVoiceEnd')
    },
  }
});
