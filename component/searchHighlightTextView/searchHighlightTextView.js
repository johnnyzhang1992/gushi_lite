// component/searchHilightTextView.js
Component({
  // options: {
  //   multipleSlots: true // 在组件定义时的选项中启用多slot支持
  // },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * {key:'关键字',name:'待匹配字符串'}
     */
    datas: {
      type: Object,
      observer: "_propertyDataChange"
    },
    type: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        this.setData({
          type: newVal ? newVal : ''
        })
        // 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数
        // 新版本基础库不推荐使用这个字段，而是使用 Component 构造器的 observer 字段代替（这样会有更强的功能和更好的性能）
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchArray: [],
    keyName: '',
    type: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _propertyDataChange: function(newVal) {
      // console.log(newVal);
      let searchArray = this.getHilightStrArray(this.data.type.length>0 ? newVal.content : newVal.name, newVal.key);
      this.setData({
        keyName: newVal.key,
        searchArray: searchArray
      })
    },

    getHilightStrArray: function (str, key) {
      if (!str) { 
        return '';
      }
      return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
    }
  },
});