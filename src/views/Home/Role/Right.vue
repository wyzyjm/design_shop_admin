<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 1">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 2">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
export default {
  name: "Rights",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumb: ["权限管理", "权限列表"], // 面包屑数据
      rightsList: [], // 权限列表数据
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list")
      console.log("权限列表数据", res.data)
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.rightsList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
</style>