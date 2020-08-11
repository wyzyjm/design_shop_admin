<template>
  <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
</template>

<script>
export default {
  name: "Swith",
  props: {
    value: {
      type: Boolean,
    },
  },
}
</script>

<style lang="less" scoped>
</style>