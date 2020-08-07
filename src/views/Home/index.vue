<template>
  <div>
    <el-button type="info" @click="logoutFn">退出</el-button>
  </div>
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