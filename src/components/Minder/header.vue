<template lang="html">
  <header>
    <ul id="mind_tab">
      <li :class="{selected:switchShow.showEditMenu}">
        <a href="#" class="btn-showEditMenu" @click="showMenu">思维导图</a>
      </li>
      <li :class="{selected:switchShow.showViewMenu}">
        <a href="#" class="btn-showViewMenu" @click="showMenu">外观样式</a>
      </li>
    </ul>
    <div id="mind_tab-content">
      <div v-show="switchShow.showEditMenu" class="mind-tab-panel">
        <edit-menu @minder-save="minderSave" />
      </div>
      <div v-show="switchShow.showViewMenu" class="mind-tab-panel">
        <view-menu />
      </div>
    </div>
  </header>
</template>

<script>
import EditMenu from './menu/edit/EditMenu'
import ViewMenu from './menu/view/ViewMenu'
export default {
  name: 'HeaderVue',
  components: {
    EditMenu,
    ViewMenu
  },
  data() {
    return {
      switchShow: {
        showEditMenu: true,
        showViewMenu: false
      }
    }
  },
  methods: {
    showMenu: function(e) {
      for (var variable in this.switchShow) {
        if (this.switchShow.hasOwnProperty(variable)) {
          this.switchShow[variable] = false
        }
      }
      this['switchShow'][e.target.className.replace('btn-', '')] = true
    },
    minderSave() {
      this.$emit('minder-save')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/minder/header.scss";
</style>
