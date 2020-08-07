<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <img src="@/assets/ResourcePlatform.png" alt="logo" />
      <el-button type="info" @click="logoutFn">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle_btn" @click="toggleNavFn">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          router
          unique-opened
          background-color="#313743"
          text-color="#fff"
          active-text-color="#359BFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-index="activeNav"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconObj[item.path]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavActive(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <!-- 路由 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [], // 菜单列表数据
      // 字体图标
      iconObj: {
        users: "iconfont icon-yonghuguanli", // 用户
        rights: "iconfont icon-role", // 权限
        goods: "iconfont icon-iconfontshangpin2", // 商品
        orders: "iconfont icon-order", // 订单
        reports: "iconfont icon-shuju", // 数据
      },
      // 导航展开与折叠
      isCollapse: false,
      // 导航高亮
      activeNav: "",
    }
  },
  methods: {
    // 退出功能
    logoutFn() {
      window.sessionStorage.clear() // 清空token
      this.$router.push("/login") // 跳转登录页
      this.$msg.success("退出成功")
    },
    // 获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus")
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.menuList = res.data
    },
    // 导航折叠与展开
    toggleNavFn() {
      this.isCollapse = !this.isCollapse
    },
    // 保存高亮值
    saveNavActive(activePath) {
      window.sessionStorage.setItem("navActive", activePath)
      this.activeNav = activePath
    },
  },
  created() {
    this.getMenuList()
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #363d40;
    color: #fff;
    font-size: 20px;
  }
  .el-aside {
    background-color: #313743;
    .iconfont {
      margin-right: 10px;
    }
    .toggle_btn {
      text-align: center;
      letter-spacing: 0.2em;
      background-color: #495065;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #e9edf1;
  }
}
</style>