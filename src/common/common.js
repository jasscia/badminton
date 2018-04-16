import {URLList, htr, transformStatusAndTimeOfMatchInfo,
        getToken, getUserInfo, login, formatNumber, getStorage, setStorage} from './util'
// import wepy from 'wepy'
const downLoadMatchList = async function(token, type = 'my') {
  let url = (type === 'my' ? URLList.getGameListMyURL : URLList.getGameListAllURL)
  let data = {token}
  let method = 'GET'
  let res = await htr(url, method, data)
  if (res.statusCode >= 400) {
    console.log('res.statusCode>=400', res.statusCode)
    return
  }
  if ([200, 206, 304].indexOf(res.statusCode) === -1) {
    console.log('res.statusCode not in [200,206,304]', res.status)
    return
  }
  if (res.data.data && !res.data.data.length) {
    wx.showToast({
      title: '没有比赛',
      duration: 1500})
    return
  }
  let matchList = res.data.data
  for (let match of matchList) {
    transformStatusAndTimeOfMatchInfo(match)
  }
  return matchList
}
const downLoadMatchInfo = async function(gameid) {
  let url = URLList.getGameInfoURL + '\/' + gameid
  let method = 'GET'
  let data = {}
  let res = await htr(url, method, data)
  let matchInfo = res.data.data
  if (matchInfo) {
    return transformStatusAndTimeOfMatchInfo(matchInfo)
  }
}
const updateMatchInfo = async function(gameid, originMatchInfo) {
  let newMatchInfo = await downLoadMatchInfo(gameid)
  if (newMatchInfo) {
    let originMatchInfoKeys = Object.keys(originMatchInfo)
    let newMatchInfoKeys = Object.keys(newMatchInfo)
    originMatchInfoKeys.forEach(key => {
      if (newMatchInfoKeys.includes(key)) {
        originMatchInfo[key] = newMatchInfo[key]
      }
    })
      // console.log(originMatchInfo);
    return originMatchInfo
  }
}

const initUserInfo = async function() {
  let token = wx.getStorageSync('token')
  // let userInfo = await getStorage('userInfo')
  if (!token) {
    let loginRes = await login()
    let code = loginRes.code
    let getuserInfoRes = await getUserInfo()
    let {nickName, avatarUrl, gender} = getuserInfoRes.userInfo
    let userInfo = {nickName, avatarUrl, gender}
    setStorage('userInfo', userInfo)
    token = await getToken(code, userInfo.nickName, userInfo.avatarUrl)
    setStorage('token', token)
  }
}
const addPlayer = async function(e) {
  let url = URLList.addplayerURL
  let method = 'POST'
  let data = {
    token: wx.getStorageSync('token'),
    gameid: e.target.dataset.gameid
  }
  let res = await htr(url, method, data)
  if (res.errMsg === 'request:ok') {
    return 'ok'
  }
}
const changeRealname = async function(token, realName) {
  console.log('进入 changeRealname fn')
  if (token) {
    let url = URLList.changeRealnameURl
    let method = 'POST'
    let data = {token: token,
      realName: realName}
    let res = await htr(url, method, data)
    console.log(res, data)
    return res
  }
}
const createGame = async function(formData, token) {
  let url = URLList.postGameInfoURL
  let method = 'POST'
  let data = {
    token: token,
    gamename: formData.theme,
    status: 0,
    note: null,
    address: formData.address,
    begintime: formData.begintime
  }
  console.log(data)
  const success = async function() {
    await wx.showToast({
      title: '创建成功,返回赛事列表',
      icon: 'success',
      duration: 1500
    })
    wx.navigateBack({delta: 1})
  }
  const fail = function(err) {
    wx.showModal({
      title: '创建失败',
      content: err.msg
    })
  }
  htr(url, method, data).then(success, fail)
}
const formatTime = (date, mark = '/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(mark) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const share = function(path) {
  return {
    title: 'CGGC羽球赛',
    path: path,
      // imgUrl:'../image/src.jpg',
    success: function(res) {
      console.log('转发成功')
    },
    fail: function(res) {
      console.log('转发失败')
    }
  }
}

const requestTableList = async function(personCount,roundCount) {
  let url = `https://gzbtestsystem.cn/badminton/againsttable?NumberOfPeople=${personCount}&RoundsOfPerson=${roundCount}&format=json`;
  let method = "GET";
  let data={};
  // let success=function(res){ 
  //   wx.showModal({
  //     title: '友情建议',
  //     content: `共为您排了${res.data.AgainstTable.length}场比赛，如果您的赛时为2小时，建议预定${Math.ceil(res.data.AgainstTable.length / 14)}个场地!\rps:每个场地不宜超过14场。`
  //   })
  //     wx.setStorageSync('groupList',res.data.AgainstTable)
  //     console.log('getstorage',wx.getStorageSync('groupList'))
  //   }
  let res=await htr(url,method,data);
  return res.data.AgainstTable
  }
export {downLoadMatchList,
        downLoadMatchInfo,
        updateMatchInfo,
        initUserInfo,
        addPlayer,
        changeRealname,
        createGame,
        formatTime,
        share,
        requestTableList}
