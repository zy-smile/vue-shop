<template>
    <el-container class="el_container">
        <el-header class="el_header">
            <div>
                <img src="../assets/heima.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
      <el-container>
          <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px': '200px'" class="el_aside">
            <div class="toggle-button" @click="toToggle">|||</div>
            <el-menu class="el_menu" background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"  :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                <!--一级菜单-->
              <el-submenu :index="item.id +''" :key="item.id" v-for="item in menuList">
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!--二级菜单--> 
                <el-menu-item :index="'/'+subItem.path" :key="subItem.id" v-for="subItem in item.children" @click="saveNavstate('/'+subItem.path)" >
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu> 
            </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main class="el_main">
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            isCollapse: false,
            menuList: null,
            iconsObj: {
              125: 'iconfont icon-Customermanagement-fill',
              103: 'iconfont icon-product',
              101: 'iconfont icon-Newuserzone-fill',
              102: 'iconfont icon-feeds-fill',
              145: 'iconfont icon-integral-fill'
            },
            activePath: ''
        }
    },
    created: function() {
       this.getMenuList()
       this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
         async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        toToggle() {
            this.isCollapse = !this.isCollapse
        },
        saveNavstate(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>
<style lang="less" scoped>
    .el_container {
        height: 100%;
    }
    .el_header {
        background-color:#373D41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        font-size: 20px;
        color: #fff;
        > div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    .el_aside {
         background-color:#333744;
    }
    .el_menu {
        border-right: none;
    }
    .el_main {
         background-color:#eaedf1;
    }
    .toggle-button {
        height: 30px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        background-color: #4a5064;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>