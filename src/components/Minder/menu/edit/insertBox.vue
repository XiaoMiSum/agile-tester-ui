<template>
  <div class="insert-group">
    <div class="insert-child-box menu-btn" :disabled="disabled1" @click="appendChildNode">
      <i class="tab-icons" />
      <span>插入下级主题</span>
    </div>
    <div class="insert-parent-box menu-btn" :disabled="disabled2" @click="appendParentNode">
      <i class="tab-icons" />
      <span>插入上级主题</span>
    </div>
    <div class="insert-sibling-box menu-btn" :disabled="disabled3" @click="appendSiblingNode">
      <i class="tab-icons" />
      <span>插入同级主题</span>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'InsertBox',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({ minder: 'getMinder' }),
    disabled1() {
      var minder = this.minder
      var bool = false
      if (minder.queryCommandState) {
        bool = minder.queryCommandState('AppendChildNode') === -1
      }
      return bool
    },
    disabled2() {
      var minder = this.minder
      var bool = false
      if (minder.queryCommandState) {
        bool = minder.queryCommandState('AppendParentNode') === -1
      }
      return bool
    },
    disabled3() {
      var minder = this.minder
      var bool = false
      if (minder.queryCommandState) {
        bool = minder.queryCommandState('AppendSiblingNode') === -1
      }
      return bool
    }
  },
  methods: {
    appendChildNode() {
      var minder = this.minder
      minder.queryCommandState('AppendChildNode') === -1 || minder.execCommand('AppendChildNode')
    },
    appendParentNode() {
      var minder = this.minder
      minder.queryCommandState('AppendParentNode') === -1 || minder.execCommand('AppendParentNode')
    },
    appendSiblingNode() {
      var minder = this.minder
      minder.queryCommandState('AppendSiblingNode') === -1 || minder.execCommand('AppendSiblingNode')
    }
  }
}
</script>
