// against.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personCount:10,
    roundcount:4,
    againstTable:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  createAgainstTable() {
    wx.request({
      url: `https://gzbtestsystem.cn/badminton/againsttable?NumberOfPeople=${this.data.personCount}&RoundsOfPerson=${this.data.roundcount}&format=json`,
      method: "GET",
      success: res => {
        console.log(res.data.AgainstTable);
        this.setData({
          againstTable: res.data.AgainstTable
        })
      }
    })},
  onLoad: function (options) {
    console.log(456);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})