//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    personList:[1,2,3,4]
  },
  //事件处理函数
  personNameTap: function(e) {
    this.setData({
      personList:[1,2,3,4,5]
    })
  },
  onLoad: function () {
    console.log(123);
  },
  delTap: function(e) {
  console.log('hhhh')
  }
})
