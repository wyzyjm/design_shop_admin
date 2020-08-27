import Vue from 'vue'
import App from './App.vue'

import './filters.js'

import less from 'less';
import '@/assets/css/globle.css'
import router from './router' // 路由
import '@/plugins/element.js' // element-UI
import '@/plugins/treeTable.js' // tree-table

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


Vue.use(VueQuillEditor, /* { default global options } */ )



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
