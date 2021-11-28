<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="团队名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入团队名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="handleQuery" />
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="团队名称" />
      <el-table-column label="备注信息" prop="memo" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.pid !== 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.pid !== 0" :span="24">
            <el-form-item label="上级团队" prop="pid">
              <treeselect v-model="form.pid" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级团队" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="团队名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入团队名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" type="textarea" placeholder="请输入备注信息" maxlength="512" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getTeamList, addTeam, updateTeam, deleteTeam } from '@/api/team'

export default {
  name: 'Team',
  components: { Treeselect },
  filters: {
    statusFilter(status) {
      return status ? 'success' : 'danger'
    }
  },
  data() {
    return {
      /* 表单查询 */
      listLoading: false,
      list: [],
      queryParams: {
        name: ''
      },
      showSearch: true,
      /* 团队新增 修改 */
      form: {},
      title: '',
      deptOptions: [],
      open: false,
      rules: {
        name: [
          { required: true, message: '团队名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.handleQuery()
  },
  methods: {
    async fetchData() {
      const resp = await getTeamList(this.queryParams)
      this.list = this.handleTree(resp.data, 'id')
    },
    /** 查询按钮点击 */
    handleQuery() {
      this.fetchData()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮点击 */
    handleAdd(row) {
      this.reset()
      // 打开表单，并设置初始化
      getTeamList().then(response => {
        this.deptOptions = this.handleTree(response.data, 'id')
      })
      if (row) {
        this.form.pid = row.id
      }
      this.open = true
      this.title = '添加团队'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.title = '修改团队'
      const { id, name, memo, pid } = row
      this.form = { id, name, memo, pid }
      getTeamList().then(response => {
        this.deptOptions = this.handleTree(response.data, 'id')
      })
      this.open = true
    },
    /** 团队信息表单提交 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        const func = this.form.id !== undefined ? updateTeam : addTeam
        func(this.form).then(response => {
          this.msgSuccess('操作成功')
          this.open = false
          this.handleQuery()
        })
      })
    },
    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    /** 窗口关闭 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 团队信息表单重置 */
    reset() {
      this.form = {
        id: undefined,
        pid: undefined,
        name: undefined,
        memo: undefined
      }
      this.resetForm('form')
    },
    handleDelete(row) {
      this.$confirm('确认删除团队 ' + row.name + ' 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteTeam(row.id)
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
