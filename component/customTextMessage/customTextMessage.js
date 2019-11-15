var plugin = requirePlugin("wechatBot");
Component({
  properties: {
    msg: Object
  },

  data: {},
  lifetimes: {
    ready: function() {
      const chat = plugin.getChatComponent();
      chat.scrollToNew();
    }
	},
  
  methods: {
    choose: function(e) {
      const chat = plugin.getChatComponent();
      chat.send(e.currentTarget.dataset.title);
    },
  }
});
