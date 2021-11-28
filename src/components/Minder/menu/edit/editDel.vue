<template lang="html">
  <div class="edit-del-group">
    <div class="edit menu-btn" :disabled="disabled1" title="编辑" @click="edit">
      <i class="tab-icons is" />
      <span>编辑</span>
    </div>
    <div class="del menu-btn" :disabled="disabled2" title="删除" @click="del">
      <i class="tab-icons is" />
      <span>删除</span>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'EditDel',
  computed: {
    ...mapGetters({ minder: 'getMinder', editor: 'getEditor' }),
    disabled1() {
      return this.minder.queryCommandState && this.minder.queryCommandState('text') === -1
    },
    disabled2() {
      return this.minder.queryCommandState && this.minder.queryCommandState('RemoveNode') === -1
    }
  },
  methods: {
    edit() {
      this.minder.queryCommandState('text') === -1 || this.editNode()
    },
    del() {
      this.minder.queryCommandState('RemoveNode') === -1 || this.minder.execCommand('RemoveNode')
    },
    editNode() {
      var editor = this.editor
      var receiverElement = editor.receiver.element
      var fsm = editor.fsm
      var receiver = editor.receiver

      receiverElement.innerText = this.minder.queryCommandValue('text')
      fsm.jump('input', 'input-request')
      receiver.selectAll()
    }
  }
}
</script>
