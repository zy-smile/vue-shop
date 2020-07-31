<template>
  <div>
    <!--面包屑导航--->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddCateDialog"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="goodsList"
        :columns="columns"
        :show-index='true'
        index-text="#"
        :expand-type="false"
        :selection-type='false'
        :show-row-hover="false"
        border
      >
        <!-- 是否有效 -->
        <template
          slot="isOk"
          slot-scope="scope"
        >
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i
            class="el-icon-error"
            style="color: red"
            v-else
          ></i>
        </template>
        <!--排序---->
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag
            size="mini"
            v-if="scope.row.cat_level === 0"
          >一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >二级</el-tag>
          <el-tag
            size="mini"
            type="warning"
            v-else
          >三级</el-tag>
        </template>
        <!-- 操作 -->
        <template
          slot="opt"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称:"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="SelectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="selectedCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑页面对话框 -->
    <el-dialog
      title="商品编辑"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="商品名称"
          prop="cat_name"
        >
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0,
      //  树形表格每一列的数据数组
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: '',
          type: 'template',
          template: 'isOk',
          width: '80px'
        },
        {
          label: '排序',
          prop: '',
          type: 'template',
          template: 'order',
          width: '80px'
        },
        {
          label: '操作',
          prop: '',
          type: 'template',
          template: 'opt'
        }
      ],
      //  是否展示添加商品分类对话框
      addCateDialogVisible: false,
      //  添加商品表单数据绑定
      addCateForm: {
        cat_name: '',
        cat_level: '0',
        cat_pid: '0'
      },
      //  添加商品表单验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      //  添加商品分类父级商品分类列表数据
      parentCateList: [],
      // 级联选择器双向绑定数据
      SelectedKeys: [],
      //  级联选择器配置展示规则
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true // 是否单独选择
      },
      editGoodsDialogVisible: false,
      //  编辑商品数据绑定
      editCateForm: {
        cat_name: ''
      },
      //  商品分类Id
      EditCateId: ''
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    //  监听页码条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //  监听当前页码变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    //  展示添加商品分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //  获取父级商品分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.parentCateList = res.data
    },
    //  监听级联选择器选择变化
    selectedCateChange() {
      if (this.SelectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.SelectedKeys[
          this.SelectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.SelectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //  添加商品分类表单的提交
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('商品分类提交失败')
        }
        this.$message.success('商品分类提交成功')
        this.addCateDialogVisible = false
        this.getGoodsList()
      })
    },
    // 添加商品对话框关闭触发
    addCateDialogClosed() {
      //  重置表单
      this.$refs.addCateFormRef.resetFields()
      this.SelectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //  展示编辑页面
    async showEditDialog(id) {
      this.EditCateId = id
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.editCateForm.cat_name = res.data.cat_name
      this.editGoodsDialogVisible = true
    },
    //  编辑商品提交
    async editCate() {
      const { data: res } = await this.$http.put(
        'categories/' + this.EditCateId,
        this.editCateForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类提交失败')
      }
      this.$message.success('商品分类修改成功')
      this.editGoodsDialogVisible = false
      this.getGoodsList()
    },
    //  编辑商品对话框关闭触发
    editCateDialogClosed() {
      this.EditCateId = ''
    },
    //  删除商品分类时触发
    async removeCateById(id) {
      //  确认删除弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('已成功删除')
      this.getGoodsList()
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>