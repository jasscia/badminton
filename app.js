//app.js
App({
  onLaunch: function () {
   wx.setKeepScreenOn({
     keepScreenOn: true,
     success:()=>{console.log('设置屏幕常亮 成功')}
   })
  },
  globalData: {
    // lessFour:false
  }
})