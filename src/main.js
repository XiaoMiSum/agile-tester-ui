import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import $ from 'jquery'

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

/** 思维导图组件相关 */
require('../node_modules/codemirror/lib/codemirror.js')
require('../node_modules/codemirror/mode/xml/xml.js')
require('../node_modules/codemirror/mode/javascript/javascript.js')
require('../node_modules/codemirror/mode/css/css.js')
require('../node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
// require('../node_modules/codemirror/mode/markdown/markdown.js')
require('../node_modules/codemirror/addon/mode/overlay.js')
require('../node_modules/codemirror/mode/gfm/gfm.js')
require('../node_modules/marked/lib/marked.js')

require('../node_modules/kity/dist/kity.js')

// require('../node_modules/hotbox/hotbox.js')
require('../hotbox/hotbox.js')
// require('../node_modules/kityminder-core/dist/kityminder.core.js')
require('../kityminder-core/dist/kityminder.core.js')

require('./script/expose-editor.js')

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
