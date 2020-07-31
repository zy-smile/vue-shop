<template>
  <div class='login_container'>
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        label-width="0px"
        ref="LoginFormRef"
        :model="LoginForm"
        :rules="LoginFormRules"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="LoginForm.username"
            prefix-icon="iconfont icon-OOjs_UI_icon_userAvatar"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="LoginForm.password"
            prefix-icon="iconfont icon-password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" :plain="true" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
    },
    login() {
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('login', this.LoginForm)
          if (res.meta.status !== 200) return this.$message.error('登录失败')      
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')     
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  .avatar_box {
    width: 130px;
    height: 130px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
