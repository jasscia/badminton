//index.js
//获取应用实例
import util from '../../utils/util'
const app = getApp()

Page({
  data: {
    personList: [],
    personListToString:null
  },
  onLoad: function () {
    this.initalPersonList();
  },
  initalPersonList: function () {
    wx.getStorage({
      key: 'personList',
      success: res => {
        this.setData({
            personList: res.data,
            personListToString:res.data.join(' ')
          })
          console.log(this.data.personList);
      }
    })
  },
  sortPersonList(e){
    let dom = e.target,
        domData=dom.dataset;
    if(domData.type){
      let order=domData.order;
      let type=domData.type;
      let originArr = this.data.personList
      let currArr = this.changePosition(originArr,order-1,type);
      this.setData({
        personList: currArr,
        personListToString:currArr.join(' ')
      });
    }
  },
  changePosition(array,index,way){
    console.log(array,index,way)
    if(way==="up"){
      let tem=array[index];
      array[index]=array[index-1];
      array[index-1]=tem
    }
    if (way === "down") {
      let tem = array[index];
      array[index] = array[index + 1];
      array[index+1] = tem
    }
    if (way === "remove") {
      array.splice(index-1,1);
    }
    return array;
  },
  getPersonList(e){
    let findNames= function(stringWithName){
      return stringWithName.split(/[!！？？]+/).slice(-1)[0].split(/[\+\＋\s]/);
    }
    let content = e.detail.value;;
    let personlist = findNames(content.trim());
    // console.log('jjj',personlist);
    this.setData({
      personList:personlist,
      // personListToString:personlist.join(' ')
    });
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
