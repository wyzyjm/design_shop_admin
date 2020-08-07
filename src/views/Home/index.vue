<template>
  <el-container>
    <el-header>
      Header
      <el-button type="info" @click="logoutFn">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  methods: {
    // 退出功能
    logoutFn() {
      window.sessionStorage.clear() // 清空token
      this.$router.push("/login") // 跳转登录页
      this.$msg.success("退出成功")
    },
  },
}
</script>

<style lang="less" scoped>
</style>