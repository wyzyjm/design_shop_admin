<template>
  <el-table :data="list">
    <el-table-column v-for="(item, index) in label" :key="index" label="name" prop="username"></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "Table",
  // 父级接收
  props: {
    // 列表项
    list: {
      type: Array,
    },
    // 标签
    label: {
      type: Array,
    },
  },
  mounted() {
    console.log(this.list)
  },
}
</script>

<style lang="less" scoped>
</style>