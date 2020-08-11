<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片视图 开始 -->
    <Card>
      <el-row :gutter="10">
        <el-col :span="7">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
            @input="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="索引" width="50px"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 开关 -->
            <el-switch v-model="scope.row.mg_state" @change="handleSwitchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" :enterable="false" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- total, sizes, prev, pager, next, jumper指定公共模块 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </Card>
    <!-- 卡片视图 结束 -->
    <!-- 添加用户 对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 添加用户主体区 -->
      <el-form :model="addForm" :rules="addFormRoules" ref="addFormRef" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" show-password></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用 对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editFormRoules" label-width="80px" ref="editFormRef">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtUserFn(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
import Card from "@/components/Card.vue" // 卡片视图
import Search from "@/components/Search.vue" // 搜索
// import Table from "@/components/Table.vue" // 表格 稍后再做
// import SwitchUser from "@/components/Switch.vue"
export default {
  name: "User",
  components: {
    Breadcrumb,
    Card,
    Search,
  },
  data() {
    // 邮箱校验规则
    var checkEmail = (rule, value, cbFn) => {
      var regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (value && regEmail.test(value)) {
        return cbFn()
      }
      cbFn(new Error("邮箱验证失败!"))
    }

    // 手机号校验规则
    var checkMobile = (rule, value, cbFn) => {
      var regMobile = /^1[3|4|5|7|8]\d{9}$/ // 手机号验证
      if (value && regMobile.test(value)) {
        return cbFn()
      }
      return cbFn(new Error("请输入正确的手机号!"))
    }

    return {
      breadcrumb: ["用户管理", "用户列表"], // 面包屑数据
      // 用户列表查询数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0, // 总数
      userList: [], // 用户列表数据
      addDialogVisible: false, // 添加用户对话框
      EditDialogVisible: false, // 修改用户对话框
      // 添加用户的表单
      addForm: {
        username: "用户1",
        password: "password",
        mobile: "13700702559",
        email: "1459131395@qq.com",
      },
      // 添加用户表单验证规则
      addFormRoules: {
        // 用户名
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 密码
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        // 电话
        mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
        // 邮箱
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
      },
      // 修改用户的表单
      editForm: {},
      editFormRoules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { required: true, validator: checkMobile, tigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { required: true, validator: checkEmail, tigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getUserList() // 获取用户列表数据
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      console.log("用户列表 : ", res)
      this.userList = res.data.users // 用户列表数据
      this.queryInfo.pagenum = res.data.pagenum // 页码
      this.total = res.data.total // 总数
    },
    // 监听pagesize 的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页面值 改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    // 用户状态改变
    async handleSwitchChange(userInfo) {
      // console.log(userInfo.id)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
    },
    // 添加用户对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields() // 重置表单
    },
    // 添加用户
    addUserFn() {
      // 表单预校验
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post("users", this.addForm)
        console.log("添加用户结果", res)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg) // 提示成功
        this.addDialogVisible = false // 关闭对话框
        this.getUserList() // 重新获取列表
      })
    },
    // 修改用户
    async showEditDialog(userID) {
      const { data: res } = await this.$http.get("users/" + userID)
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.editForm = res.data
      this.EditDialogVisible = true
    },
    // 监听修改用户对话框关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields() // 重置表单
    },
    // 编辑用户
    eidtUserFn(userID) {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          "users/" + userID,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.getUserList()
        this.EditDialogVisible = false
        this.$msg.success(res.meta.msg)
      })
    },
    // 删除用户
    async deleteUser(userID) {
      // confirm :  确定
      // cancel :  取消
      const res = await this.$msgBox
        .confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err)
      if (res == "cancel") return this.$msg.info("取消删除用户")
      const { data: res2 } = await this.$http.delete("users/" + userID)
      if (res2.meta.status !== 200) return this.$msg.error(res2.meta.msg)
      this.$msg.success(res2.meta.msg)
      this.getUserList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>