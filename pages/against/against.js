// against.js
Page({

  data: {
    personList:[],
    scoreList:[],
    personCount:0,
    roundCount:4,
    showAgainstTable:false
  },

  onLoad: function (options) {
    this.initalPersonList();
    this.setData({
      showAgainstTable: false
    });
  },
  onShow: function (options) {
    this.initalPersonList();
    this.setData({
      showAgainstTable: false
    });
  },
  initalPersonList: function () {
    wx.getStorage({
      key: 'personList',
      success: res => {
        res = res.data.filter((name) => {
          return name
        });

        this.setData({
          personList: res,
          personCount: res.length
        })
      },
    })
  },

  roundCountChange:function(e){
    this.setData({
      roundCount:new Number(e.detail.value)
    })
  },
  createAgainstTable() {
    if(!this.data.roundCount||this.data.personCount*this.data.roundCount%4){
      wx.showModal({ 
        title: "错误提示",
        content: "场次和人数的乘积 不能被4整除 排阵失败！！",
        mask:true,
        duration:2000
        })
      return
      }
    this.getAgainstTable();
    },

  getAgainstTable:function(){
      wx.request({
        url: `https://gzbtestsystem.cn/badminton/againsttable?NumberOfPeople=${this.data.personCount}&RoundsOfPerson=${this.data.roundCount}&format=json`,
        method: "GET",
        success: res => {
          Array.prototype.numToString.call(res.data.AgainstTable,this.data.personList);
          for (let i=0; i<res.data.AgainstTable.length;i++){
            res.data.AgainstTable[i] = res.data.AgainstTable[i].concat([0,0]);
          };
          this.setData({
            scoreList:res.data.AgainstTable,
            // showAgainstTable: true,
          });
          wx.setStorage({
            key: 'scoreList',
            data: res.data.AgainstTable,
          });
          wx.showModal({
            title: '友情建议',
            content: `共为您排了${res.data.AgainstTable.length}场比赛，如果您的赛时为2小时，建议预定${Math.ceil(res.data.AgainstTable.length / 14)}个场地!\rps:每个场地不宜超过14场。`,
          })
        }
      })
  },
  scoreChange:function(e){
    let id = e.target.dataset.id;
    let side=(e.target.dataset.side==='A'?4:5);
    let way=e.target.dataset.way;
    let newScoreList = this.data.scoreList;
    if (way === "more") {
      newScoreList[id][side]++
    } else if (newScoreList[id][side]!==0){
      newScoreList[id][side]--
    };
    this.setData({
      scoreList:newScoreList
    });
    wx.setStorage({
      key: 'scoreList',
      data: newScoreList
    })
  }
})