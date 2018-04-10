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
    // animationData: '',
  },
  onLoad: function () {
    // this.animation=wx.createAnimation({
    //   duration: 400,
    //   timingFunction: "linear",
    //   delay: 0,
    //   transformOrigin: "50% 50% 0",
    // })
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

  touchEnd: function (e) {
    this.pos.endX = e.changedTouches[0].pageX,
    this.pos.endY = e.changedTouches[0].pageY;
  },
  touchStart: function (e) {
    this.pos.startX = e.touches[0].pageX,
    this.pos.startY = e.touches[0].pageY;
  },
  itemMove: function (e) {
    //首先判断 点击对象是否正确
    if (!e.target.dataset.tag){return};
    // //为初始点和 结束点 定位
    // if (e.type === "touchstart") { this.touchStart(e)}
    // if (e.type === "touchend") { this.touchEnd(e)}
    // let distanceX = this.pos.endX - this.pos.startX;
    // let distanceY = this.pos.endY - this.pos.startY;
    // let originPosTop = e.target.dataset.originpostop;
    // // console.log(this.pos)
    // console.log(distanceX)
    // //判断移动位置是否满足要求
    // if(Math.abs(distanceX)<100){//单位转换 px 与 rpx的转换问题
    //   return
    // }
    //更新数据
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

