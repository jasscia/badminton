//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    result: {}
  },
  onLoad: function () {
    wx.getStorage({
      key: 'scoreList',
      success: res => {
        let calcedScore = this.calcScore(res.data);
        let orderedScore = this.orderScore(calcedScore);
        this.setData({
          result: orderedScore
        })
      },
    })
  },
  onShow: function () {
    wx.getStorage({
      key: 'scoreList',
      success: res => {
        let calcedScore = this.calcScore(res.data);
        let orderedScore = this.orderScore(calcedScore);
        this.setData({
          result: orderedScore
        })
      },
    })
  },
  onShareAppMessage() {
    return {
      title: "CGGC羽球赛"
    }
  },
  orderScore: function (obj) {
    let keys = Object.keys(obj);
    let orderedKeys = [];
    for (let i = 0; i < keys.length; i++) {
      let key_of_max = this.findKeyOfMax(obj, orderedKeys);
      orderedKeys.push(key_of_max)
    }
    let newObj = {};
    for (let i=0; i < orderedKeys.length; i++) {
      newObj[orderedKeys[i]] = obj[orderedKeys[i]].concat(i + 1)//[4]是名次，concat的部分
    }
    return newObj;
  },
  findKeyOfMax: function (obj, orderedKeys) {
    let keys = Object.keys(obj);
    let key_of_max = '';
    for (let i = 0; i < keys.length; i++) {
      if (orderedKeys.indexOf(keys[i]) !== -1) {//对于已经被找到的值 排除在本次查询之外
        continue;
      }
      if (!key_of_max) {//把第一个在查询范围内的值赋值为max
        key_of_max = keys[i];
        continue;
      }
      if (obj[key_of_max][3] > obj[keys[i]][3]) {//先比较 胜/负比
        // key_of_max = keys[i];
      } else if (obj[key_of_max][3] < obj[keys[i]][3]) {
        key_of_max = keys[i];
      } else {
        if (obj[key_of_max][0] >= obj[keys[i]][0]) {//再比较净胜分
          // key_of_max  = keys[i]
        } else {
          key_of_max = keys[i];
        }
      }
    }
    return key_of_max;
  },
  calcScore: function (array) {
    let result = {};
    for (let item of array) {
      for (let i = 0; i < 4; i++) {
        result[item[i]] = result[item[i]] || [0, 0, 0];
        if (i < 2) {
          result[item[i]][0] += (item[4] - item[5]);
          result[item[i]][1] += (item[4] > item[5] ? 1 : 0);
          result[item[i]][2] += (item[4] < item[5] ? 1 : 0);
        } else {
          result[item[i]][0] += (item[5] - item[4]);//[0]是净胜分
          result[item[i]][1] += (item[4] < item[5] ? 1 : 0);//[1]胜的场次
          result[item[i]][2] += (item[4] > item[5] ? 1 : 0);//[2]是败胜分
        }
        result[item[i]][3] = result[item[i]][1] - result[item[i]][2];//[3]是胜-败的比值率
      }
    }
    return result;
  }
})
