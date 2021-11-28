<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="filterTeam" placeholder="请输入团队名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="teamOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--产品数据-->
      <el-col :span="20" :xs="24">
        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="产品名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入产品名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
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
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="" width="95">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="产品名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注信息">
            <template slot-scope="scope">
              {{ scope.row.email }}
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabled ? 'success' : 'info'">{{ scope.row.enabled ? '正常' : '已归档' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="large"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-dropdown @command="(command) => handleCommand(command, scope.$index, scope.row)">
                <span class="el-dropdown-link">
                  更多操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.enabled"
                    command="handleArchive"
                    size="mini"
                    type="text"
                    icon="el-icon-key"
                  >归档</el-dropdown-item>
                  <el-dropdown-item
                    v-else
                    command="handleResetArchive"
                    size="mini"
                    type="text"
                    icon="el-icon-key"
                  >撤销归档</el-dropdown-item>
                  <el-dropdown-item
                    command="handleDelete"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="handleQuery"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>

          <el-col :span="24">
            <el-form-item label="所属团队" prop="teamId">
              <treeselect
                v-model="form.teamId"
                :options="teamOptions"
                :show-count="true"
                placeholder="请选择所属团队"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入产品名称" />
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

import { getList, addProduct, updateProduct, deleteProduct, updateProductStatus } from '@/api/product'
import { getTeamList } from '@/api/team'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      /* 表单查询 */
      listLoading: false,
      list: [],
      total: 0,
      queryParams: {
        name: '',
        teamId: null,
        phone: null,
        enabled: null,
        pageNo: 1,
        pageSize: 10
      },
      dateRange: [],
      showSearch: true,
      /** 团队树相关 */
      filterTeam: '',
      teamOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      /* 产品新增 修改 */
      form: {},
      title: '新增产品',
      open: false,
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: "'请选择所属团队", trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterTeam(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.handleQuery()
    this.handleGetTeam()
  },
  methods: {
    async fetchData() {
      const resp = await getList(this.addBeginAndEndTime(this.queryParams, this.dateRange))
      this.list = resp.data.list
      this.total = resp.data.total
    },
    /** 查询按钮点击 */
    handleQuery() {
      this.fetchData()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 过滤团队 */
    filterNode(value, data) {
      return !value ? true : data.name.indexOf(value) !== -1
    },
    /** 团队树节点点击 */
    handleNodeClick(data) {
      this.queryParams.teamId = data.id
      this.handleQuery()
    },
    /** 新增按钮点击 */
    handleAdd() {
      this.reset()
      // 打开表单，并设置初始化
      this.form.teamId = this.queryParams.teamId
      this.open = true
      this.title = '添加产品'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.title = '修改产品'
      const { id, name, memo, teamId, email, phone } = row
      this.form = { id, name, memo, teamId, email, phone }
      this.open = true
    },
    /** 产品信息表单提交 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        const func = this.form.id !== undefined ? updateProduct : addProduct
        func(this.form).then(response => {
          this.msgSuccess('操作成功')
          this.open = false
          this.handleQuery()
        })
      })
    },
    /** 更新产品状态 */
    handleStatusChange(row, enabled) {
      const text = !enabled ? '归档' : '撤销归档'
      this.$confirm('确认要将产品 ' + row.name + ' ' + text + '吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return updateProductStatus(row.id, enabled)
      }).then(() => {
        this.msgSuccess(text + '成功')
        row.enabled = !row.enabled
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
    /** 获取团队树 */
    handleGetTeam() {
      getTeamList().then(response => {
        this.teamOptions = []
        this.teamOptions.push(...this.handleTree(response.data, 'id'))
      })
    },
    /** 窗口关闭 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 产品信息表单重置 */
    reset() {
      this.form = {
        id: undefined,
        teamId: undefined,
        name: undefined,
        memo: undefined
      }
      this.resetForm('form')
    },
    // 更多操作
    handleCommand(command, index, row) {
      switch (command) {
        case 'handleDelete':
          this.handleDelete(row)// 红号变更
          break
        case 'handleArchive': // 归档
          this.handleStatusChange(row, false)
          break
        case 'handleResetArchive': // 撤销归档
          this.handleStatusChange(row, true)
          break
        default:
          break
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除产品 ' + row.name + ' 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteProduct(row.id)
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
