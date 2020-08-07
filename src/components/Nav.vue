<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: "Nav",
}
</script>

<style lang="less" scoped>
</style>