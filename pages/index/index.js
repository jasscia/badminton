//index.js
//获取应用实例
import util from '../../utils/util'
const app = getApp()

Page({
  data: {
    personList: [],
    personListToString:null,
    animationData:'',
  },
  onLoad: function () {
    var animation1 = wx.createAnimation({
      duration: 1,
      timingFunction: 'ease',
    })
    var animation2 = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation1 = animation1; 
    this.animation2 = animation2;
    this.initalPersonList();
  },
  onShareAppMessage(){
    return {
      title:"CGGC羽球赛"
    }
  }, 
  initalPersonList: function () {
    wx.getStorage({
      key: 'personList',
      success: res => {
        this.setData({
            personList: res.data,
            personListToString:res.data.join(' ')
          })
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
      let currArr = this.changePosition(originArr,order-1,type)

      this.dotAnimate(e,type);
      this.setData({
        personList: currArr,
        personListToString:currArr.join(' ')
      });
    }
  },
  changePosition(array,index,way){
    if(way==="up"){
      let tem=array[index];
      array[index]=array[index-1];
      array[index-1]=tem;
    }
    if (way === "down") {
      let tem = array[index];
      array[index] = array[index + 1];
      array[index + 1] = tem;
    }
    if (way === "remove") {
      array.splice(index,1);
    }
    return array;
  },
  dotAnimate(event,way){
    let index = event.target.dataset.order,
        startYPos = (510+130*index-65)/2 -30 ,
        endYPos = startYPos;
    if (way === "up") { endYPos-=65}
    if (way === "down") { endYPos+=65 }
    console.log(index, startYPos, endYPos)//先很快的完成 将dot移动到当前位置
    this.animation1.top(startYPos).opacity(1).step();
    if (timerId) { clearTimeout(timerId)};
     this.setData({
      animationData: this.animation1.export()
    })

    //再缓慢的 将dot移动到下一个位置
    let timerId=setTimeout(function () {
      this.animation2.top(endYPos).opacity(0).scale(1).step();
      this.setData({
        animationData: this.animation2.export()
      })
    }.bind(this),50)
  },
  getPersonList(e){
    let findNames= function(stringWithName){
      return stringWithName.split(/[!！？？]+/).slice(-1)[0].split(/[\+\＋\s]+/);
    }
    let content = e.detail.value;;
    let personlist = findNames(content.trim());
    this.setData({
      personList:personlist,
    });
  },
  
  submit:function () {
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
    this.setStorage('personList',realPersonList);
    wx.switchTab({
      url: '../against/against',
    })
  },
  setStorage:function(key,data){
    wx.setStorage({
      key,
      data
    })
  }
})
