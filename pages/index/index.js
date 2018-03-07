//index.js
//获取应用实例
import util from '../../utils/util'
const app = getApp()

Page({
  data: {
    personList: []
  },
  onLoad: function () {
    this.initalPersonList();
    // wx.switchTab({
    //   url: '../against/against',
    // })
  },
  initalPersonList: function () {
    wx.getStorage({
      key: 'personList',
      success: res => {
        if (res.data.length < 4) {
          // let newList = res.data;
          for (let i = 0; i < 4; i++) {
            res.data[i] = res.data[i] || '';
          }
          this.setData({
            personList: res.data
          })
        } else {
          this.setData({
            personList: res.data
          })
        }
      },
      fail: () => {
        this.setData({
          personList: ['', '', '', '']
        })
      }
    })
  },
  addPerson: function () {
    let newList = this.data.personList.slice();
    newList.push('');
    this.setData({
      personList: newList
    })
  },
  delTap: function (e) {
    if (this.data.personList.length > 4) {
      let newList = this.data.personList.slice();
      newList.remove(e.target.dataset.item);
      this.setData({
        personList: newList
      })
    } else {
      wx.showModal({
        title: '错误提示',
        content: '人数不能少于4人'
      })
    }
  },
  personNameChange: function (e) {
    let newList = this.data.personList.slice();
    newList.change(e.target.dataset.item, e.detail.value);
    this.setData({
      personList: newList
    })
  },
  finish: function () {
    let realPersonList = this.data.personList.filter((name) => {
      return name
    });
    if (realPersonList.length < 4) {
      wx.showModal({
        title: '错误提示',
        content: '人数不能少于4人'
      })
      return
    };
    wx.setStorage({
      key: 'personList',
      data: realPersonList,
      success: function () {
        wx.switchTab({
          url: '../against/against',
        })
      }
    })
  }
})
