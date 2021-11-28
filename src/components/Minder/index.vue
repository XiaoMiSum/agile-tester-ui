<template>
  <!--<div class="main-container">-->
  <div>
    <header-menu v-if="showHeader" @minder-save="minderSave" />
    <main-editor />
    <navigator />

    <!-- note markdown 挂件 -->
    <div
      v-show="showNotePreviewer"
      ref="notePreviewer"
      class="note-box"
      :style="notBoxStyle"
    >
      <VueMarkdown :source="markSource" />
    </div>

    <!--    查询过滤文本框-->
    <search-box ref="searchBox" />
    <search-label-box ref="searchLabelBox" />

  </div>

</template>

<script>
import headerMenu from '@/components/Minder/header'
import mainEditor from '@/components/Minder/main/mainEditor'
import navigator from '@/components/Minder/main/navigator'
import VueMarkdown from 'vue-markdown'
import searchBox from './menu/edit/search/searchBox'
import searchLabelBox from './menu/edit/search/searchLabelBox'
import { expandParent } from '@/utils/convert/jsonconvert'

export default {
  name: 'Minder',
  components: {
    headerMenu,
    mainEditor,
    navigator,
    VueMarkdown,
    searchBox,
    searchLabelBox
  },
  props: {
    showHeader: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  // 父组件中通过provide来提供变量，然后在子组件中通过inject来注入变量
  provide() {
    return {
      main: this
    }
  },
  data() {
    return {
      showNotePreviewer: false,
      notBoxStyle: {},
      markSource: ''
    }
  },
  mounted() {
    this.$refs.notePreviewer.addEventListener('wheel', (e) => {
      e.stopPropagation()
    })
    this.$refs.notePreviewer.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
    this.$refs.notePreviewer.addEventListener('mousewheel', (e) => {
      e.stopPropagation()
    })
  },
  methods: {
    // 对外暴露初始化MinderJson
    init(json) {
      if (typeof (json) === 'string') {
        window.minder.importJson(JSON.parse(json))
      } else if (json) {
        window.minder.importJson(json)
      }
    },
    // 对外暴露保存方法
    minderSave() {
      const json = window.minder.exportJson()
      this.$emit('minder-save', json)
    },
    // 设置note显示和位置
    preview(node, keyword) {
      const icon = node.getRenderer('NoteIconRenderer').getRenderShape()
      const b = icon.getRenderBox('screen')
      const note = node.getData('note')
      const x = b.cx
      const y = b.bottom
      this.markSource = note
      this.showNotePreviewer = true
      this.notBoxStyle = {
        top: y + 'px',
        left: x + 'px'
      }
    },
    hidePreviewer() {
      this.showNotePreviewer = false
    },
    openSearchBox() {
      this.$refs.searchBox.enterSearch()
    },
    openLabelBox() {
      this.$refs.searchLabelBox.openModal().then(res => {
        const priority = res.priority
        const source = res.sourceSelected
        const testResult = ''
        this.filterMindForLabel(priority, testResult, source)
      })
    },
    filterMindForLabel(priority, testResult, source) {
      const json = window.minder.exportJson()
      filter(json.root)

      function filter(data) {
        let needExpand = false

        const hasPriorityCondition = priority.length !== 0 // 具备Priority过滤条件
        const hasTestResultCondition = testResult.length !== 0 // 具备testResult过滤条件
        const hasSourceCondition = source.length !== 0 // 具备source过滤条件

        // 交集
        let intersection = null
        if (hasSourceCondition) {
          intersection = source.filter(function(val) {
            return data.data.resource && data.data.resource.indexOf(val) > -1
          })
        }

        const matchPriority = hasPriorityCondition && priority.indexOf(data.data.priority) !== -1
        const matchTestResult = hasTestResultCondition && testResult.indexOf(data.data.testResult) !== -1
        const matchSource = hasSourceCondition && intersection.length !== 0
        needExpand = (!hasPriorityCondition || matchPriority) && (!hasTestResultCondition || matchTestResult) && (!hasSourceCondition || matchSource)
        if (needExpand) {
          data.data.expandState = 'expand'
        } else {
          data.data.expandState = 'collapse'
        }
        if (data.children.length !== 0) {
          data.children.forEach(item => {
            filter(item)
          })
        }
      }

      json.root.data.expandState = 'expand'
      json.root = expandParent(json.root)
      window.minder.importJson(json)
    }
  }
}

</script>
