<template lang="html">
  <div class="menu-container">
    <mold />
    <theme />
    <arrange />
    <styleOperation />
    <fontOperation />
  </div>

</template>

<script>
import mold from './mold'
import theme from './theme'
import arrange from './arrange'
import styleOperation from './styleOperation'
import fontOperation from './fontOperation.vue'

export default {
  name: 'ViewMenu',
  components: {
    mold,
    theme,
    arrange,
    styleOperation,
    fontOperation
  }
}

</script>
