<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图---->
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddRolesDialog"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['itemAlign','bdBottom',i1 === 0?'bdTop':'']"
            >
              <!-- 渲染一级权限列表 -->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row,item1.id)"
                  closable
                >{{item1.authName}}</el-tag>
              </el-col>
              <!-- 渲染二三级权限列表 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0?'':'bdTop','itemAlign']"
                >
                  <!-- 二级权限列表 -->
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                  <!-- 三级权限列表 -->
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightsDialogVisible(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="RightsDialogVisible"
      width="50%"
      @close="RightsDialogClosed"
    >
      <el-tree
        show-checkbox
        :data="rightsList"
        :props="treeProp"
        default-expand-all
        node-key="id"
        ref="treeRef"
        :default-checked-keys="defKeys"
      >
      </el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="RightsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
    >
      <el-form
        :model="addRoleform"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="addRoleform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click='addRole'
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleform"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editRoleform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="subEditRole"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      //  角色列表
      rolesList: [],
      RightsDialogVisible: false,
      rightsList: [],
      //  树形控件树形绑定对象
      treeProp: {
        children: 'children',
        label: 'authName'
      },
      //  默认选中的节点数组
      defKeys: [],
      //  角色id
      roleId: '',
      //   添加角色对话框展示
      addRoleDialogVisible: false,
      //  添加角色表单属性绑定
      addRoleform: {
        roleName: '',
        roleDesc: ''
      },
      //  编辑角色对话框展示
      editRoleDialogVisible: false,
      // 编辑角色表单属性绑定
      editRoleform: []
    }
  },
  methods: {
    //  获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 添加角色对话框展示
    showAddRolesDialog() {
      this.addRoleDialogVisible = true
    },
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleform)
      if (res.meta.status !== 201) {
        return this.$message.error('角色创建失败')
      }
      this.$message.success('角色创建成功')
      this.addRoleDialogVisible = false
      this.getRolesList()
    },
    //  编辑角色对话框展示
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色失败')
      }
      this.editRoleform = res.data
      this.editRoleDialogVisible = true
    },
    //  编辑对话框提交
    async subEditRole() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editRoleform.roleId,
        this.editRoleform
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色失败')
      }
      this.editRoleDialogVisible = false
      this.getRolesList()
    },
    //  角色删除功能
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('角色删除失败')
      }
      this.$message.success('角色删除成功')
      this.getRolesList()
    },
    //  权限删除事件
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = res.data
    },

    // 监听权限设置对话框关闭事件
    RightsDialogClosed() {
      this.defKeys = []
    },
    // 设置分配权限
    async setRightsDialogVisible(role) {
      //  给角色id传值
      this.roleId = role.id
      //  获取权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 给权限列表赋值
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.RightsDialogVisible = true
    },
    //  用递归函数循环节点
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //  权限数据提交
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('角色权限设置失败')
      }
      this.$message.success('权限设置成功')
      this.RightsDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdBottom {
  border-bottom: 1px solid #ebeef5;
}
.bdTop {
  border-top: 1px solid #ebeef5;
}
.itemAlign {
  display: flex;
  align-items: center;
}
</style>