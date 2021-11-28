<template lang="html">
  <div class="menu-container">
    <!--  保存按钮-->
    <save-btn @minder-save="minderSave" />
    <!--  撤销回退、重做-->
    <back-and-right />

    <expand />
    <selection />
    <!-- <insert-box />  不需要插入功能-->
    <move-box />
    <edit-del />
    <!--    超链接-->
    <hyberlink />
    <!--  查询、过滤-->
    <search />
    <node-box />
    <sequence-box />
    <!-- <progress-box />  不需要这个进度-->
    <!--  自定义标签-->
    <resource-edit />

  </div>
</template>

<script>
import SaveBtn from './SaveBtn.vue'
import insertBox from './insertBox'
import moveBox from './moveBox'
import editDel from './editDel'
import sequenceBox from './sequenceBox'
import progressBox from './progressBox'
import expand from './expand'
import selection from './selection'
import NodeBox from './noteBox'
import resourceEdit from './resourceEdit'
import Search from './search/search'
import hyberlink from './hyberlink'
import backAndRight from './backAndRight'

export default {
  name: 'EditMenu',
  components: {
    SaveBtn,
    Search,
    NodeBox,
    insertBox,
    moveBox,
    editDel,
    sequenceBox,
    progressBox,
    expand,
    selection,
    resourceEdit,
    hyberlink,
    backAndRight
  },
  methods: {
    minderSave() {
      this.$emit('minder-save')
    }
  }
}
</script>
