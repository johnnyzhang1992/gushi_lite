// component/searchHilightTextView.js
Component({
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchArray: [],
    keyName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _propertyDataChange: function(newVal) {
      console.log(newVal);
      let searchArray = this.getHilightStrArray(newVal.name, newVal.key);
      this.setData({
        keyName: newVal.key,
        searchArray: searchArray
      })
    },

    getHilightStrArray: function(str, key) {
      return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
    }
  },
})