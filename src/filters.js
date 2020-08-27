import Vue from 'vue';


// 日期处理
Vue.filter("dateFormat", function (date) {
  const dt = new Date(date)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, "0") // 月
  const d = (dt.getDate() + '').padStart(2, "0") //日

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
