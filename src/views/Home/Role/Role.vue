<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialog = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['borderBottom',i==0?'borderTop':'','vcenter']"
              v-for="(item, i ) in scope.row.children"
              :key="i"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[j==0?'':'borderTop','vcenter']"
                  v-for="( item2 , j) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightsById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      closable
                      v-for="item3 in item2.children "
                      :key="item3.id"
                      @close="removeRightsById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsClose"
    >
      <!-- 树形结构 -->
      <el-tree
        ref="rightsTree"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultActive"
      ></el-tree>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsForRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
export default {
  name: "Role",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumb: ["权限管理", "角色列表"], // 面包屑数据
      addRoleDialog: false, // 添加角色对话框
      roleList: [], // 所有角色列表数据
      rightsList: [], // 所有权限 数据
      setRightsDialogVisible: false, // 分配权限对话框
      currentRoleId: "", // 当前分配权限 角色id
      // 树形结构显示
      treeProps: {
        children: "children", // 父子嵌套 的 属性
        label: "authName", // 指定看到的属性
      },
      // 树形结构默认勾选数组
      defaultActive: [],
    }
  },
  created() {
    this.getRoleList() //获取角列表
  },
  methods: {
    //获取角列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles")
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 根据ID 移除标签
    async removeRightsById(role, id) {
      // confirm :  确定
      // cancel :  取消
      const result = await this.$msgBox
        .confirm("此操作将永久删除该权限, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err)
      if (result == "cancel") return this.$msg.info("取消删除权限")
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightsDialog(role) {
      this.currentRoleId = role.id // 将当前id 保存到数据中
      const { data: res } = await this.$http.get("rights/tree")
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      console.log(res)
      this.rightsList = res.data
      // 递归获取三级权限
      this.getLeafKeys(role, this.defaultActive)
      this.setRightsDialogVisible = true // 展示对话框
    },
    // 获取三级默认权限
    getLeafKeys(node, arr) {
      // node : 判断当前节点是否包含children属性
      // 不包含 就把当前节点id保存到里面
      if (!node.children) {
        return arr.push(node.id)
      }
      // 包含就继续递归
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听权限对话框关闭事件
    setRightsClose() {
      this.defaultActive = []
    },
    // 点击确认, 为角色分配权限
    async setRightsForRole() {
      const keys = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(",")
      console.log(idStr)
      const { data: res } = await this.$http.post(
        `roles/${this.currentRoleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.getRoleList()
      this.setRightsDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.borderTop {
  border-top: 1px solid #eee;
}
.borderBottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>