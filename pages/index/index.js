//index.js
//获取应用实例
import util from '../../utils/util'
const app = getApp()

Page({
  data: {
    personList: [],
    personList_unordered: [],
    personList_ordered: [],
    personListToString: null,
    animationData: '',
  },
  onLoad: function () {
    // this.setStorage('personList', []);
    this.pos={startX:0,startY:0,endX:0,endY:0};
    this.initalPersonList();
 
  },
  onShareAppMessage() {
    return {
      title: "CGGC羽球赛"
    }
  },
  initalPersonList: function () {
    wx.getStorage({
      key: 'personList',
      success: res => {
        this.setData({
          personList: res.data,
          personList_unordered: res.data,
          personListToString: res.data.join(' ')
        })

        this.setStorage('personList', res.data);
        this.setStorage('personList_ordered', res.data);
        this.setStorage('personList_unordered', []);
      }
    })
  },
  getPersonList(e) {
    let findNames = function (stringWithName) {
      return stringWithName.split(/[!！？？]+/).slice(-1)[0].split(/[\+\＋\s]+/);
    }
    let content = e.detail.value;
    let personlist = findNames(content.trim());
    this.setData({
      personList: personlist,
      personList_unordered:personlist,
      personList_ordered: []
    });

    this.setStorage('personList', personlist);
    this.setStorage('personList_ordered', personlist);
    this.setStorage('personList_unordered', []);
  },

unorderedMove(e) {
  console.log(e.target.dataset.tag);
  if (!e.target.dataset.tag){return};
  let index = e.target.dataset.index;
  let orderedList = this.data.personList_ordered;
  let unorderedList = this.data.personList_unordered;
  let list = orderedList.concat(unorderedList)
  let value = null;
  if (e.target.dataset.tag==='unordered') {
    value = unorderedList[index]; 
    unorderedList.splice(index, 1);
    orderedList.push(value);
   };
   if (e.target.dataset.tag === 'ordered') {
     value = orderedList[index];
     orderedList.splice(index, 1);
     unorderedList.push(value);
   };
  this.setData({
    personList_unordered: unorderedList,
    personList_ordered: orderedList,
    personList: orderedList.concat(unorderedList),
  })
  this.setStorage('personList', list);
  this.setStorage('personList_ordered', orderedList);
  this.setStorage('personList_unordered', unorderedList);
},
touchEnd(e) {
  this.pos.endX = e.detail.x,
  this.pos.endY = e.detail.y;
},
touchStart(e){
  this.pos.startX=e.detail.x,
  this.pos.startY = e.detail.y;
},
  submit: function () {
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
    this.setStorage('personList', realPersonList);
    wx.switchTab({
      url: '../against/against',
    })
  },
  setStorage: function (key, data) {
    wx.setStorage({
      key,
      data
    })
  }
})

