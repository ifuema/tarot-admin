import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios.create({
  baseURL: 'http://localhost:3000'
})

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
