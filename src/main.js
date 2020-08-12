import Vue from 'vue'
import App from './App.vue'

import less from 'less';
import '@/assets/css/globle.css'
import router from './router' // 路由
import '@/plugins/element.js' // element-UI
import '@/plugins/treeTable.js' // tree-table






import Axios from 'axios'

Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
Axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('loginToken');
  return config;
})
Vue.prototype.$http = Axios;


Vue.use(less); // 使用less
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
