<template lang="html">
  <div class="save-group">
    <el-button type="primary" plain @click="minderSave"> 保存</el-button>

  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'SaveBtn',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      count: 'count'
    })
  },
  methods: {
    ...mapActions([
      'changeCount',
      'increment',
      'clearMemory',
      'setMemory'
    ]),
    minderSave() {
      this.$emit('minder-save')
    }
  }
}
</script>
