import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'
import Pagination from '@/components/Pagination'

import {
  resetForm,
  addDateRange,
  addBeginAndEndTime,
  handleTree
} from '@/utils/index'

/** 全局挂载 Element-ui */
Vue.use(ElementUI)
/** 全局挂载公共组件 */
Vue.component('RightToolbar', RightToolbar)
Vue.component('Pagination', Pagination)

/** 全局挂载公共方法 */
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}
Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.addBeginAndEndTime = addBeginAndEndTime
Vue.prototype.handleTree = handleTree

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
