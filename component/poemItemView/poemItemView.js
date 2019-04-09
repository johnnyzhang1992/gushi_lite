Component({
    // 组件样式隔离
    // options: {
    //     styleIsolation: 'isolated'
    // },
    
    // 属性定义（详情参见下文）
    properties: {
        datas: { // 属性名
            type: Object,
            value: {},
            observer: '_myPrivateMethod'
        },
        isSearch:{
            type: Boolean,
            value: false,
            observer: '_isSearch'
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        poem_item: {},
        is_search: false
    }, // 私有数据，可用于模板渲染
    
    methods: {
        // 内部方法建议以下划线开头
        _myPrivateMethod(newVal,oldVal,changedPath) {
            this.setData({
                poem_item: newVal
            })
        },
        _isSearch(newVal,oldVal,changedPath){
            this.setData({
                is_search: newVal
            })
        }
    }
    
});