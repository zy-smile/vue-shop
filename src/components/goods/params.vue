<template>
  <div>
    <!--面包屑导航--->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="rowTop">
        <el-col>
          <span style="margin-right: 10px">选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="CateList"
            :props="cascaderProps"
            clearable
            @change="selectedCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="isButtonDisabled"
                @click="showAddFormDialog"
              >添加参数</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="manyList"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  size="mini"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="isButtonDisabled"
                @click="showAddFormDialog"
              >添加属性</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="onlyList"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  size="mini"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数和属性对话框 -->
    <el-dialog
      :title="'添加'+ titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addFormDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label='titleText + "名称"'
          prop="attr_name"
        >
          <el-input
            v-model="addForm.attr_name"
            ref="gain"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+ titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editFormDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label='titleText + "名称"'
          prop="attr_name"
        >
          <el-input
            v-model="editForm.attr_name"
            ref="gain"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 级联选择器双向绑定的id值
      selectedKeys: [],
      //  商品列表
      CateList: [],
      //  级联选择器相关配置属性
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //  tab栏动态绑定类名
      activeName: 'many',
      //  获取的动态参数数组
      manyList: [],
      //  获取的静态属性数组
      onlyList: [],
      //  是否展示添加参数对话框
      addParamsDialogVisible: false,
      //  添加参数表单数据绑定
      addForm: {
        attr_name: ''
      },
      // 添加参数表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      //  修改对话框的展示隐藏
      editParamsDialogVisible: false,
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 监听级联选择器改变
    selectedCateChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyList = []
        this.onlyList = []
        return false
      }
      this.getParamsList()
    },
    //  获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.CateList = res.data
    },
    //  tab切换
    handleTabClick() {
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else if (this.activeName === 'only') {
        this.onlyList = res.data
      }
    },
    //  展示添加对话框
    showAddFormDialog() {
      this.addParamsDialogVisible = true
      //   this.$nextTick将回调延迟到下次DOM更新之后执行
      this.$nextTick(() => {
        this.$refs.gain.focus()
      }, 100)
    },
    //  点击添加提交参数和属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('提交参数失败')
        }
        this.$message.success('添加成功')
        this.getParamsList()
        this.addParamsDialogVisible = false
      })
    },
    //  监听添加对话框关闭事件
    addFormDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.getParamsList()
    },
    //  监听修改对话框的关闭
    editFormDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm.attr_name = ''
      this.editForm.attr_id = ''
      this.getParamsList()
    },
    // 点击展示修改对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.editForm.attr_name = res.data.attr_name
      this.editForm.attr_id = res.data.attr_id
      this.editParamsDialogVisible = true
    },
    // 修改提交事件
    async editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        this.$message.success('修改成功！')
        this.editParamsDialogVisible = false
        this.getParamsList()
      })
    },
    //  删除操作
    async removeParamsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsList()
    },
    // 离开焦点或敲击enter键触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrvals(row)
    },
    //  tag表签删除事件
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrvals(row)
    },
    async saveAttrvals(row) {
      // 把参数项提交到后台
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('提交参数项失败')
      }
      this.$message.success('操作成功')
    },
    // 点击button展示表单
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isButtonDisabled() {
      return this.selectedKeys.length !== 3
    },
    titleText() {
      return this.activeName === 'many' ? '参数' : '属性'
    },
    //  分类Id
    cateId() {
      return this.selectedKeys[this.selectedKeys.length - 1]
    }
  }
}
</script>
<style lang="less" scoped>
.rowTop {
  margin: 10px 0 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>