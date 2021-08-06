Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    properties: {
        closabled: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: ''
        },
        subTitle: {
            type: String,
            value: ''
        },
        extClass: {
            type: String,
            value: ''
        },
        desc: {
            type: String,
            value: ''
        },
        tips: {
            type: String,
            value: ''
        },
        maskClosable: {
            type: Boolean,
            value: true
        },
        mask: {
            type: Boolean,
            value: true
        },
        show: {
            type: Boolean,
            value: false,
            observer: '_showChange'
        },
        buttons: {
            type: Array,
            value: []
        }
    },
    methods: {
        close: function close(e) {
            var type = e.currentTarget.dataset.type;

            if (this.data.maskClosable || type === 'close') {
                this.setData({
                    show: false
                });
                this.triggerEvent('close');
            }
        },
        buttonTap: function buttonTap(e) {
            var index = e.currentTarget.dataset.index;

            this.triggerEvent('buttontap', { index: index, item: this.data.buttons[index] }, {});
        }
    }
});