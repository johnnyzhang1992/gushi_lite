Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        extClass: {
            type: String,
            value: ''
        },
        buttons: {
            type: Array,
            value: [],
            observer: function observer(newVal) {
                this.addClassNameForButton();
            }
        },
        disable: {
            type: Boolean,
            value: false
        },
        icon: {
            type: Boolean,
            value: false
        },
        show: {
            type: Boolean,
            value: false
        },
        duration: {
            type: Number,
            value: 350
        },
        throttle: {
            type: Number,
            value: 40
        },
        rebounce: {
            type: Number,
            value: 0
        }
    },
    data: {
        size: null
    },
    ready: function ready() {
        this.updateRight();
        this.addClassNameForButton();
    },

    methods: {
        updateRight: function updateRight() {
            var _this = this;

            var data = this.data;
            var query = wx.createSelectorQuery().in(this);
            query.select('.left').boundingClientRect(function (res) {
                // console.log('right res', res);
                var btnQuery = wx.createSelectorQuery().in(_this);
                btnQuery.selectAll('.btn').boundingClientRect(function (rects) {
                    // console.log('btn rects', rects);
                    _this.setData({
                        size: {
                            buttons: rects,
                            button: res,
                            show: data.show,
                            disable: data.disable,
                            throttle: data.throttle,
                            rebounce: data.rebounce
                        }
                    });
                }).exec();
            }).exec();
        },
        addClassNameForButton: function addClassNameForButton() {
            var _data = this.data,
                buttons = _data.buttons,
                icon = _data.icon;

            buttons.forEach(function (btn) {
                if (icon) {
                    btn.className = '';
                } else if (btn.type === 'warn') {
                    btn.className = 'weui-slideview__btn-group_warn';
                } else {
                    btn.className = 'weui-slideview__btn-group_default';
                }
            });
            this.setData({
                buttons: buttons
            });
        },
        buttonTapByWxs: function buttonTapByWxs(data) {
            this.triggerEvent('buttontap', data, {});
        },
        hide: function hide() {
            this.triggerEvent('hide', {}, {});
        },
        show: function show() {
            this.triggerEvent('show', {}, {});
        },
        transitionEnd: function transitionEnd() {
            console.log('transitiion end');
        }
    }
});