<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo -->
      <div class="logo_box">
        <img src="@/assets/ResourcePlatform.png" alt="logo" />
      </div>
      <!-- form -->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghuguanli"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            prefix-icon="iconfont icon-denglurizhi"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="login_btn">
          <el-button type="primary" @click="loginFormFn">登录</el-button>
          <el-button type="default" @click="resetFormFn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
    }
  },
  methods: {
    // 表单重置
    resetFormFn() {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录
    loginFormFn() {
      this.$refs.loginFormRef.validate(async (valid, no) => {
        // console.log(valid); // 验证是否通过
        // console.log(no); // 不通过时的对象
        if (!valid) return
        let { data: res } = await this.$http.post("login", this.loginForm)
        // console.log(res.meta)
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg) // 登录成功

        // 1. 保存token
        // 2. 编程式导航,跳转主页
        window.sessionStorage.setItem("loginToken", res.data.token)
        this.$router.push("/home")
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    position: relative;
    width: 300px;
    height: 200px;
    border-radius: 3px;
    background: #fff;
    .logo_box {
      position: absolute;
      left: 50%;
      box-shadow: 0 0 0 #ddd;
      transform: translate(-50%, -50%);
      img {
        padding: 10px;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .login_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>