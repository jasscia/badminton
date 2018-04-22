import {htr, formatNumber} from './util'
// import wepy from 'wepy'
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
  let res=await htr(url,method,data);
  return res.data.AgainstTable
  }
export {formatTime,
        share,
        requestTableList}
