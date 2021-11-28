<template>
  <div>
    <el-row :gutter="0">
      <!--测试集合数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="testsuite.content"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node" style="position: relative; width: 90%">
              <div style="float: left;">
                <i v-if="data.icon === 'folder'" :class="'el-icon-folder' + (node.expanded ? '-opened' : '')" />
                <svg-icon v-else :icon-class=" data.icon" />
                <span>{{ '  ' + node.label }}</span>
              </div>
              <div v-if="currentNode.id === data.id" style="float: right;position: absolute;right: 1px">
                <el-dropdown @command="(command) => handleCommand(command, node.id, data)">
                  <i class="el-icon-more el-icon--right" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="data.icon === 'folder' " command="handleAdd">新增</el-dropdown-item>
                    <el-dropdown-item command="handleRename">重命名</el-dropdown-item>
                    <el-dropdown-item :disabled="data.children && data.children.length > 0" command="handleDelete">删除</el-dropdown-item>
                    <el-dropdown-item divided command="handleArchive">全局归档</el-dropdown-item>
                    <el-dropdown-item command="handleShowHistory">历史版本</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-tree>
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="20" :xs="24" style="min-height: calc(100vh - 50px);">
        <minder v-if="showMinder" ref="minderx" @minder-save="handleSaveMinder" />
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row v-if="!form.id">
          <el-col :span="24">
            <el-form-item label="集合类型" prop="icon">
              <el-radio-group v-model="form.icon" size="small">
                <el-radio-button label="folder">目录</el-radio-button>
                <el-radio-button label="minder">脑图 </el-radio-button>
                <el-radio-button label="table" disabled> 表格</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用例集合" prop="name">
              <el-input v-model="form.name" v-focus placeholder="请输入测试用例集名称" maxlength="32" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEvent">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Minder from '@/components/Minder'
import { v4 as uuidv4 } from 'uuid'

import { getList, addUser, updateUser, deleteUser, updateUserStatus, resetPassword } from '@/api/user'
import { getSuiteList, updateSuite } from '@/api/tester/suite'
import { getTestcase, addTestcase, updateTestcase } from '@/api/tester/case'

export default {
  name: 'Testcase',
  components: { Minder },
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector('input').focus()
      }
    }},
  data() {
    return {
      //  TODO 暂时写死 后续修改为 header
      productId: 1,
      testcase: {},
      /** 测试集合树相关 */
      testsuite: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showMinder: false,
      currentNode: {},
      open: false,
      title: '',
      form: {},
      rules: { name: [{ required: true, message: '用例集节点名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    //   this.handleQuery()
    this.handleGetSuite()
  },
  methods: {
    /** 团队树节点点击 */
    handleNodeClick(data, node) {
      this.currentNode = data
      this.showMinder = data.icon !== 'folder'
      if (this.showMinder) {
        getTestcase({ suiteId: data.id }).then(response => {
          const testcase = this.testcase = response.data
          this.$refs.minderx.init(testcase.content)
        })
      }
    },
    handleSaveMinder(json) {
      this.testcase.content = json
      updateTestcase(this.testcase).then(response => {

      })
    },
    handleCommand(command, id, data) {
      switch (command) {
        case 'handleAdd':
          this.handleAdd(data)// 新增节点
          break
        case 'handleDelete':
          this.handleDelete(data)// 删除节点
          break
        case 'handleRename':
          this.handleRename(data) // 重命名节点
          break
        case 'handleArchive':
          this.handleArchive() // 全局归档
          break
        case 'handleShowHistory':
          this.handleShowHistory() // 查看历史版本
          break
        default:
          break
      }
    },
    /** 新增按钮点击 */
    handleAdd(data) {
      this.currentNode = data
      this.reset()
      this.title = '新增节点'
      this.open = true
      this.form.icon = 'folder'
    },
    /** 修改按钮操作 */
    handleRename(data) {
      this.currentNode = data
      this.reset()
      this.title = '重命名节点'
      const { id, name, folder } = data
      this.form = { id, name, folder }
      this.open = true
    },
    submitEvent() {
      const addStatus = !this.form.id
      if (addStatus) { // 新增节点
        if (!this.currentNode.children) {
          this.$set(this.currentNode, 'children', [])
        }
        this.form.id = uuidv4()
        this.currentNode.children.push(this.form)
      } else { // 重命名
        this.currentNode.name = this.form.name
      }
      updateSuite(this.testsuite).then(response => {
        this.open = false
        this.handleGetSuite()
        if (addStatus && this.form.icon === 'minder') {
          addTestcase({ suiteId: this.form.id, type: this.form.icon, content: { root: { data: { id: uuidv4(), created: new Date(), text: this.form.name }, children: [] }, template: 'default', theme: 'fresh-blue', version: '1.4.43' }})
        }
      })
    },
    /** 获取用例集合树 */
    handleGetSuite() {
      const productId = this.productId
      getSuiteList({ productId }).then(response => {
        this.testsuite = response.data
      })
    },
    /** 窗口关闭 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        icon: undefined,
        children: []
      }
      this.resetForm('form')
    },
    handleDelete(node) {
      this.$confirm('确认删除用户 ' + node.name + ' 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteUser(node.id)
      }).then(() => {
        this.msgSuccess('删除成功')
        this.handleQuery()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scop>

</style>
