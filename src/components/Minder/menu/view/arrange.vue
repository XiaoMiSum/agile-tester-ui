<template lang="">
  <div class="arrange-group">
    <div class="arrange menu-btn" :disabled="disabled" @click="resetlayout">
      <span class="tab-icons" />
      <span class="label">整理布局</span>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Arrange',
  computed: {
    ...mapGetters({ minder: 'getMinder' }),
    disabled() {
      return this.minder.queryCommandState && this.minder.queryCommandState('resetlayout') === -1
    }
  },
  methods: {
    resetlayout() {
      this.minder.queryCommandState('resetlayout') === -1 || this.minder.execCommand('resetlayout')
    }
  }
}
</script>
