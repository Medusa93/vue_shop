import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'

// 导入nprogress包对应的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 在request拦截器,展示进度条 NProgress.start()
axios.interceptors.request.use(config => {  
  NProgress.start()
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在response拦截器,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  var dt = new Date(originVal)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1 +'').padStart(2, '0')
  var d = (dt.getDay() +'').padStart(2, '0')

  var hh = (dt.getHours() +'').padStart(2, '0')
  var mm = (dt.getMinutes() +'').padStart(2, '0')
  var ss = (dt.getSeconds() +'').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')