<template>
  <div>
    <h3>用户列表组件</h3>
    <!--面包屑导航--->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图--->
    <el-card>
      <!--栅格系统---->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true "
          >添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        style="width: 100%"
        border
        :data="usersList"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        > </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        > </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        > </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click='editDialog(scope.row.id)'
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click='deleteUser(scope.row.id)'
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRolesDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addDialogClosed'
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='editDialogClosed'
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="RoleDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select
            v-model="selectRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="RoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsersList()
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱格式的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('邮箱格式不合法'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('手机格式不合法'))
    }
    return {
      // 获取后台用户数据
      usersList: [],
      total: null,
      //  后台响应参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 对话框是否显示
      addDialogVisible: false,
      editDialogVisible: false,
      RoleDialogVisible: false,
      //  分配角色信息
      userInfo: {},
      // 所有角色列表
      rolesList: [],
      // 角色下拉框选中后绑定的id数据
      selectRoleId: '',
      // 添加表单用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 添加用户验证表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确,请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码格式不正确,请重新输入',
            trigger: 'blur'
          }
        ]
      },
      // 修改表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确,请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码格式不正确,请重新输入',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //  获取用户后台数据
    async getUsersList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 用户状态改变
    async userStateChanged(row) {
      const { data: res } = await this.$http.put(
        '/users/' + row.id + '/state/' + row.mg_state
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 监听页面展示数量
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听当前页改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    //  监听修改用户对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 绘制用户修改对话框信息
    async editDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      this.editForm = res.data
    },
    //  修改用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUsersList()
      })
    },
    //  删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success(res.meta.msg)
      this.getUsersList()
    },
    // 展示分配角色对话框
    async setRolesDialog(user) {
      this.userInfo = user
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.RoleDialogVisible = true
    },
    // 点击了分配角色提交按钮
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('角色分配失败')
      }
      this.RoleDialogVisible = false
      this.getUsersList()
    },
    //  监听分配角色对话框
    setRolesDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>